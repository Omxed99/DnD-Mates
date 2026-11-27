# Wdrożenie na Cloudflare

Gra działa jako jeden Cloudflare Worker:

- **pliki statyczne** (`public/index.html`, paczka SRD) — serwowane bez uruchamiania Workera, więc bez kosztów;
- **pokoje gry** — `wss://<twoja-domena>/room/<id>`: jeden Durable Object na pokój przekazuje wiadomości między DM-em a graczami (zamiast PeerJS/WebRTC). Działa za NAT-ami i firmowymi sieciami, bez serwerów TURN.

Gra sama wykrywa serwer pokoi (zapytanie `/health` na tej samej domenie). Na GitHub Pages i innych hostingach bez Workera zostaje dotychczasowe połączenie PeerJS.

## Pierwsze wdrożenie (z komputera)

1. Konto Cloudflare (plan darmowy wystarczy na start).
2. Node.js 20+ i w tym folderze:
   ```bash
   npm install
   npx wrangler login
   npm run deploy
   ```
   `npm run deploy` kopiuje `../index.html` i `../srd-5.2-pack.json` do `public/` i wysyła Workera.
3. Wrangler poda adres `https://vtt.<twoje-konto>.workers.dev`. Własną domenę podpinasz w panelu: **Workers & Pages → vtt → Settings → Domains & Routes**.

## Automatyczne wdrożenia z GitHuba

W panelu Cloudflare: **Workers & Pages → Create → Import a repository**, wybierz repozytorium i ustaw:

| pole | wartość |
|---|---|
| Root directory | `cloudflare` |
| Build command | `npm run prepare-site` |
| Deploy command | `npx wrangler deploy` |

Każdy merge do `main` wdroży nową wersję.

## Lokalnie

```bash
npm run dev      # http://localhost:8787
```

## Limity i koszty

- Pliki statyczne: bez limitu i bez opłat.
- Durable Objects na planie darmowym: 100 000 żądań dziennie (wiadomości WebSocket liczone 20:1), wystarczy na wiele sesji dziennie. Plan płatny Workers: od 5 USD miesięcznie.
- Wiadomości do 32 MiB; gra dzieli większe (np. duże mapy) na części po 4 MB.
- Pokój: do 6 graczy (`LIMITS` w `src/room.js`; miejsce na plan płatny).

## Struktura

```
cloudflare/
  wrangler.jsonc   konfiguracja (assets + Durable Object „Room”)
  src/worker.js    routing: /room/<id> → pokój, /health, reszta → pliki
  src/room.js      logika pokoju (bez zależności od Cloudflare, testowalna w Node)
```
