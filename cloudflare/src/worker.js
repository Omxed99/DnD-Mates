/* Worker: strona gry (pliki statyczne) + pokoje gry przez WebSocket (Durable Object na pokój). */
import { DurableObject } from 'cloudflare:workers';
import { RoomCore } from './room.js';

export class Room extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.core = new RoomCore({
      accept: (ws, tags) => this.ctx.acceptWebSocket(ws, tags),
      sockets: (tag) => (tag ? this.ctx.getWebSockets(tag) : this.ctx.getWebSockets()),
      tagsOf: (ws) => this.ctx.getTags(ws),
      plan: () => 'free',
    });
  }
  async fetch(req) {
    if (req.headers.get('Upgrade') !== 'websocket') return new Response('Expected WebSocket', { status: 426 });
    const url = new URL(req.url);
    const pair = new WebSocketPair();
    this.core.open(pair[1], url.searchParams.get('role') === 'host' ? 'host' : 'peer', url.searchParams.get('pid'));
    return new Response(null, { status: 101, webSocket: pair[0] });
  }
  async webSocketMessage(ws, msg) { this.core.message(ws, msg); }
  async webSocketClose(ws) { this.core.close(ws); }
  async webSocketError(ws) { this.core.close(ws); }
}

const ROOM_RE = /^\/room\/([\w-]{3,64})$/;

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const m = ROOM_RE.exec(url.pathname);
    if (m) {
      const id = env.ROOMS.idFromName(m[1]);
      return env.ROOMS.get(id).fetch(req);
    }
    if (url.pathname === '/health') return new Response('ok', { headers: { 'cache-control': 'no-store' } });
    return env.ASSETS.fetch(req);
  },
};
