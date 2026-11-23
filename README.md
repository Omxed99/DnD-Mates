# D&D Mates — wirtualny stół do D&D 5e (2024)

Animowany stół do gry ze znajomymi. Cała aplikacja to jeden plik `index.html`. DM tworzy pokój, a gracze dołączają przez link. Połączenie idzie bezpośrednio między przeglądarkami (PeerJS / WebRTC), bez własnego serwera.

## Publikacja na GitHub Pages (jednorazowo, ok. 5 minut)

1. Załóż darmowe konto na github.com i zaloguj się.
2. Kliknij **+** (prawy górny róg) → **New repository**.
   - Nazwa: `dnd-mates`
   - Widoczność: **Public** (darmowe Pages wymaga publicznego repozytorium; w pliku nie ma żadnych haseł)
   - Kliknij **Create repository**.
3. Na stronie nowego repozytorium kliknij link **uploading an existing file**. Przeciągnij pliki `index.html`, `README.md` i `srd-5.2-pack.json`, a potem kliknij **Commit changes**.
4. Wejdź w **Settings → Pages**. W sekcji *Build and deployment* ustaw:
   - Source: **Deploy from a branch**
   - Branch: **main**, folder **/ (root)**
   - Kliknij **Save**.
5. Po 1–2 minutach strona będzie pod adresem:
   `https://TWOJ-NICK.github.io/dnd-mates/`

## Aktualizacja

Gdy dostaniesz nowy `index.html`, wejdź w repozytorium → **Add file → Upload files**, przeciągnij nowy plik i kliknij **Commit changes**. Po minucie wszyscy mają nową wersję (czasem trzeba odświeżyć stronę z Ctrl+F5).

## Przenosiny kampanii z pliku lokalnego (ważne!)

Przeglądarka trzyma kampanię, paczki danych i homebrew osobno dla każdego adresu. Pod nowym adresem z GitHuba zaczniesz więc od pustego stołu. Przed przeniesieniem w **starej** kopii (otwieranej z pliku):

1. **Eksportuj** w nagłówku zapisuje kampanię do pliku `.json`.
2. **🛠 Homebrew → 💾 Eksportuj paczkę** zapisuje Twoje potwory, czary i przedmioty.

Potem w **nowej** kopii (na GitHubie):

1. **Importuj** wczytuje kampanię.
2. **Paczki danych → Importuj paczkę** wczytuje `srd-5.2-pack.json` oraz `homebrew-pack.json`.

## Przekaźnik TURN (żeby każdy mógł się połączyć)

Gracze z internetu komórkowego albo sieci firmowej często nie połączą się bezpośrednio. Pomaga przekaźnik TURN:

1. Załóż darmowe konto na **expressturn.com** albo **metered.ca** (Open Relay).
2. W aplikacji (jako DM) kliknij **🌐 Połączenie**. Wklej adresy TURN, nazwę użytkownika i hasło, kliknij **Testuj**, potem **Zapisz**.
3. Odśwież stronę i **skopiuj link do pokoju jeszcze raz**. Nowy link sam przekazuje graczom ustawienia przekaźnika.

Hasło do przekaźnika nie trafia do repozytorium. Zostaje w przeglądarce DM-a i w linku, który wysyłasz znajomym.

## Dobrze wiedzieć

- DM musi mieć otwartą kartę z grą przez całą sesję. To jego przeglądarka jest „serwerem”.
- Do pierwszego połączenia (wymiana adresów) aplikacja korzysta z darmowego, publicznego serwera PeerJS. Działa to bez konfiguracji, ale jest to usługa społecznościowa bez gwarancji. Gdyby kiedyś szwankowała, da się podpiąć własny.
- Muzyka z YouTube działa dopiero ze strony www, czyli właśnie z GitHub Pages, a nie z pliku lokalnego.

Dane SRD 5.2: © Wizards of the Coast, licencja CC-BY-4.0.
