/* Logika pokoju (bez zależności od Cloudflare — testowalna w Node).
   Jeden pokój = jeden DM (host) + gracze. Serwer tylko przekazuje wiadomości:
     gracz → DM:   {t:'msg', d}            → DM dostaje {t:'msg', pid, d}
     DM → gracz:   {t:'msg', pid, d}       → gracz dostaje {t:'msg', d}
     DM → wszyscy: {t:'all', d, except?}   → gracze dostają {t:'msg', d}
     DM rozłącza:  {t:'kick', pid}
   Zdarzenia: DM dostaje {t:'join', pid} / {t:'leave', pid}; gracz dostaje {t:'open'} albo {t:'err', type:'peer-unavailable'}.
   Stan trzymany jest w tagach gniazd (działa z uśpieniem Durable Objects). */
export const LIMITS = { free: { players: 6 }, pro: { players: 12 } };

export class RoomCore {
  /* ctx: { accept(ws, tags), sockets(tag?) -> ws[], tagsOf(ws) -> string[], plan() -> 'free'|'pro' } */
  constructor(ctx) { this.ctx = ctx; }
  host() { return this.ctx.sockets('host')[0] || null; }
  peers() { return this.ctx.sockets().filter(ws => this.ctx.tagsOf(ws).some(t => t.startsWith('p:'))); }
  pidOf(ws) { const t = this.ctx.tagsOf(ws).find(x => x.startsWith('p:')); return t ? t.slice(2) : null; }
  peerById(pid) { return this.ctx.sockets('p:' + pid)[0] || null; }
  send(ws, o) { try { ws.send(JSON.stringify(o)); } catch (e) {} }

  open(ws, role, pid) {
    if (role === 'host') {
      /* nowy DM (np. po odświeżeniu) zastępuje poprzedniego; gracze zostają podłączeni */
      for (const old of this.ctx.sockets('host')) { try { old.close(4001, 'replaced'); } catch (e) {} }
      this.ctx.accept(ws, ['host']);
      this.send(ws, { t: 'ready' });
      for (const p of this.peers()) this.send(ws, { t: 'join', pid: this.pidOf(p) });
      return;
    }
    pid = String(pid || '').replace(/[^\w-]/g, '').slice(0, 40) || ('p' + Math.random().toString(36).slice(2, 10));
    const h = this.host();
    if (!h) { this.ctx.accept(ws, ['dead']); this.send(ws, { t: 'err', type: 'peer-unavailable' }); try { ws.close(4004, 'no host'); } catch (e) {} return; }
    const max = (LIMITS[this.ctx.plan ? this.ctx.plan() : 'free'] || LIMITS.free).players;
    for (const old of this.ctx.sockets('p:' + pid)) { try { old.close(4001, 'replaced'); } catch (e) {} }
    if (this.peers().filter(p => this.pidOf(p) !== pid).length >= max) { this.ctx.accept(ws, ['dead']); this.send(ws, { t: 'err', type: 'room-full', max }); try { ws.close(4029, 'room full'); } catch (e) {} return; }
    this.ctx.accept(ws, ['p:' + pid]);
    this.send(ws, { t: 'open', pid });
    this.send(h, { t: 'join', pid });
  }

  message(ws, raw) {
    let m; try { m = JSON.parse(typeof raw === 'string' ? raw : new TextDecoder().decode(raw)); } catch (e) { return; }
    const tags = this.ctx.tagsOf(ws);
    if (tags.includes('host')) {
      if (m.t === 'msg' && m.pid) { const p = this.peerById(m.pid); if (p) this.send(p, { t: 'msg', d: m.d, c: m.c }); }
      else if (m.t === 'all') { for (const p of this.peers()) if (this.pidOf(p) !== m.except) this.send(p, { t: 'msg', d: m.d, c: m.c }); }
      else if (m.t === 'kick' && m.pid) { const p = this.peerById(m.pid); if (p) { try { p.close(4000, 'closed by host'); } catch (e) {} } }
      else if (m.t === 'ping') this.send(ws, { t: 'pong' });
      return;
    }
    const pid = this.pidOf(ws); if (!pid) return;
    if (m.t === 'ping') return this.send(ws, { t: 'pong' });
    const h = this.host();
    if (!h) { this.send(ws, { t: 'hostgone' }); return; }
    if (m.t === 'msg') this.send(h, { t: 'msg', pid, d: m.d, c: m.c });
  }

  close(ws) {
    const tags = this.ctx.tagsOf(ws);
    if (tags.includes('host')) { /* gracze czekają na powrót DM-a */ for (const p of this.peers()) this.send(p, { t: 'hostgone' }); return; }
    const pid = this.pidOf(ws); const h = this.host();
    if (pid && h && !this.peerById(pid)) this.send(h, { t: 'leave', pid });
    else if (pid && h) { /* zastąpiony nowym połączeniem — nic */ }
  }
}
