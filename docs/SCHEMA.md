# Format paczki danych D&D Mates (`dndmates-pack` v1)

Paczka to zwykły plik `.json`. DM wczytuje go w **📚 Dane → Paczki danych → Importuj paczkę**. Dane zapisują się w przeglądarce DM-a. Gracze dostają przez połączenie tylko to, czego używasz w grze (np. definicje rzucanych czarów).

**Kolejność łączenia:** wbudowane dane → paczki w kolejności importu. Wpis z tym samym `id` co wcześniejszy go **nadpisuje**. Dzięki temu możesz poprawić np. czar z SRD, wgrywając paczkę z tym samym `id`.

**Zasady ogólne**
- Każda sekcja jest opcjonalna. Paczka może zawierać np. same potwory.
- Wpis bez `id` albo `name` jest pomijany.
- `id` to małe litery i myślniki, np. `light-domain`, `hermits-staff`. Musi być unikalne w obrębie sekcji.
- Nieznane pola są ignorowane, a błędne wartości zastępowane domyślnymi. Zły plik nic nie zepsuje.
- Typy obrażeń (wszędzie te same): `fire` `cold` `lightning` `thunder` `acid` `poison` `necrotic` `radiant` `force` `psychic` `bludgeoning` `piercing` `slashing`.
- Cechy: `str` `dex` `con` `int` `wis` `cha`.
- Klasy: `barbarian` `bard` `cleric` `druid` `fighter` `monk` `paladin` `ranger` `rogue` `sorcerer` `warlock` `wizard`.
- Kości: `8d6`, `1d10+3`, `2d4-1`.

## Szkielet

```json
{
  "format": "dndmates-pack",
  "version": 1,
  "name": "Moja kampania",
  "source": "Homebrew Jana",
  "license": "Tekst licencji / uznania autorstwa (opcjonalnie)",

  "subclasses": [],
  "species": [],
  "backgrounds": [],
  "feats": [],
  "spells": [],
  "monsters": [],
  "items": [],
  "packs": [],
  "classEquipment": {}
}
```

`format` i `version` są wymagane. Bez nich paczka zostanie odrzucona.

---

## Podklasa (`subclasses`)

Pojawia się w kreatorze postaci jako lista do wyboru (dla pasującej klasy). Na karcie postaci jest karta z cechami do obecnego poziomu.

| pole | typ | uwagi |
|---|---|---|
| `id` | string | np. `light-domain` |
| `name` | string | nazwa, która zapisze się na karcie, np. `Light Domain` |
| `class` | string | jedna z klas, np. `cleric` |
| `level` | liczba | od którego poziomu klasy, zwykle `3` |
| `desc` | string | krótki opis (opcjonalnie) |
| `features` | tablica `{level, name, text}` | cechy podklasy; widać te, których `level` ≤ poziom klasy |
| `spells` | tablica `{level, ids:[…]}` | czary **zawsze przygotowane** od danego poziomu klasy (`id` czarów z katalogu) |

```json
{
  "id": "light-domain", "name": "Light Domain", "class": "cleric", "level": 3,
  "desc": "Kapłani światła i ognia.",
  "features": [
    { "level": 3, "name": "Warding Flare", "text": "Reakcja: atakujący widoczny w 30 ft ma utrudnienie." },
    { "level": 6, "name": "Improved Warding Flare", "text": "Możesz chronić też sojuszników." }
  ],
  "spells": [
    { "level": 3, "ids": ["burning-hands", "faerie-fire"] },
    { "level": 5, "ids": ["fireball"] }
  ]
}
```

> Cechy podklas są **opisem**. Automatycznie działają tylko czary z `spells` i kilka podklas rozpoznawanych po nazwie: *Champion* (krytyk 19–20), *Life* (Disciple of Life), *Fiend* (Dark One's Blessing), *Evoker/Evocation* (Potent Cantrip), *Thief* (4. slot zestrojenia).

---

## Rasa / gatunek (`species`)

W zasadach 2024 „race” nazywa się „species”. Pole w kreatorze: **Gatunek**.

| pole | typ | uwagi |
|---|---|---|
| `id`, `name` | string | |
| `size` | string | `Small`, `Medium`… |
| `sizeChoice` | tablica | gdy można wybrać, np. `["Small","Medium"]` |
| `speed` | liczba (ft) | domyślnie 30 |
| `darkvision` | liczba (ft) | 0 = brak |
| `hpPerLevel` | liczba | dodatkowe PW na poziom (np. krasnolud: `1`) |
| `resist` | tablica typów obrażeń | odporności |
| `cantrips` | tablica `id` czarów | sztuczki od 1. poziomu |
| `extraOriginFeat` | bool | dodatkowy feat pochodzenia (jak człowiek) |
| `traits` | tablica `{name, text}` | opis cech |
| `choices` | tablica wyborów | np. smocze pochodzenie, linia elfów — patrz niżej |

Wybór (`choices[]`): `{ "id", "label", "options": [ … ] }`. Każda opcja może mieć: `id`, `name`, `resist`, `speed`, `darkvision`, `cantrips`, `spells: [{ "id", "level" }]` (czar dostępny od poziomu postaci).

```json
{
  "id": "sea-elf", "name": "Sea Elf", "size": "Medium", "speed": 30, "darkvision": 60,
  "resist": ["cold"], "cantrips": ["shape-water"],
  "traits": [ { "name": "Child of the Sea", "text": "Prędkość pływania 30 ft, oddychasz pod wodą." } ],
  "choices": [
    { "id": "gift", "label": "Dar morza", "options": [
      { "id": "tide", "name": "Tide", "spells": [ { "id": "fog-cloud", "level": 3 } ] },
      { "id": "storm", "name": "Storm", "resist": ["lightning"] }
    ] }
  ]
}
```

---

## Pochodzenie (`backgrounds`)

W zasadach 2024 **pochodzenie (Origin) = gatunek + background**. Background daje +2/+1 (albo +1/+1/+1) do trzech cech, dwie umiejętności, narzędzie, **feat pochodzenia** i wyposażenie startowe. Sam „Origin feat” to zwykły feat z kategorią `Origin` (sekcja Featy niżej).

| pole | typ | uwagi |
|---|---|---|
| `id`, `name` | string | |
| `abilities` | tablica 3 cech | z których rozdziela się +2/+1 lub +1/+1/+1 |
| `feat` | `id` featu | feat pochodzenia, który dostaje postać |
| `featNote` | string | dopisek, np. `Cleric` przy Magic Initiate |
| `skills` | tablica 2 umiejętności | `id` umiejętności (lista niżej) |
| `tool` | string | biegłość w narzędziu (tekst) |
| `desc` | string | opis (opcjonalnie) |
| `equipment` | tablica opcji A/B | jak w `classEquipment` (niżej) |

**Umiejętności:** `acrobatics` `animal-handling` `arcana` `athletics` `deception` `history` `insight` `intimidation` `investigation` `medicine` `nature` `perception` `performance` `persuasion` `religion` `sleight-of-hand` `stealth` `survival`.

```json
{
  "id": "hermit", "name": "Hermit",
  "abilities": ["con", "wis", "cha"], "feat": "healer",
  "skills": ["medicine", "religion"], "tool": "Herbalism Kit",
  "equipment": [
    { "items": [["quarterstaff", 1], ["herbalism-kit", 1], ["lamp", 1]], "pack": "explorers-pack", "gp": 16 },
    { "gp": 50 }
  ]
}
```

---

## Feat (`feats`)

| pole | typ | uwagi |
|---|---|---|
| `id`, `name` | string | |
| `category` | string | `Origin`, `General`, `Fighting Style`, `Epic Boon` |
| `prereq` | string | wymagania jako tekst |
| `minLevel` | liczba | od którego poziomu można wziąć (General: 4, Epic Boon: 19) |
| `repeatable` | bool | czy można wziąć kilka razy |
| `asi` | `{amount, max, choose:[…]}` | zwiększenie cechy, np. `+1` do jednej z `choose`, maks. `max` |
| `needs` | `{any:[…], min}` | wymóg cechy, np. `{ "any": ["str","dex"], "min": 13 }` |
| `desc` | string | opis |
| `fluff` | string | opcjonalny opis fabularny (kursywą nad opisem w katalogu i na karcie); działa też w czarach, potworach, przedmiotach, rasach, pochodzeniach i podklasach |
| `book` | string | skrót źródła (np. `SRD` albo nazwa Twojego dodatku) do filtra źródeł; bez niego brany jest pierwszy wyraz `fsrc` |, "name": "Healer", "category": "Origin", "minLevel": 1,
  "desc": "Battle Medic: zużyj Healer's Kit, cel wydaje Kość Wytrzymałości i leczy się. Rzuty leczenia: przerzucasz 1."
}
```

> Mechanicznie działają featy rozpoznawane po `id`: `alert`, `archery`, `defense`, `dueling`, `grappler`, `great-weapon-fighting`, `great-weapon-master`, `lucky`, `magic-initiate`, `polearm-master`, `savage-attacker`, `sentinel`, `sharpshooter`, `skilled`, `two-weapon-fighting`. Pozostałe są opisem; `asi` działa dla każdego featu.


### Efekty featu (`effects`) — żeby feat naprawdę działał

Pole `effects` to lista klocków. Gra składa z nich mechanikę sama. Liczby mogą być wartością (`2`), premią z biegłości (`"prof"`) albo modyfikatorem cechy (`"ab:con"`).

| klocek | pola | co robi |
|---|---|---|
| `bonus` | `stat`: `ac` `save` `speed` `atk` `dmg`; `value`; `ab` (dla `save`, np. `"wis"` albo `"all"`); `when`: `melee` / `ranged` (dla `atk`/`dmg`) | stała premia |
| `adv` | `on: "save"`, `abs: ["wis","cha"]` | przewaga w rzutach obronnych |
| `resist` | `dmg: ["fire"]` | odporność na typ obrażeń |
| `resource` | `id`, `name`, `uses`, `rest`: `short`/`long` | licznik użyć na karcie (Zasoby) |
| `trigger` | `on: "failSave"`, `abs`, `do`: `addDie` / `reroll` / `succeed`, `die` (np. `1d4`), `bonus`, `cost` (id zasobu), `reaction` (bool), `name` | zdolność „you can” po nieudanym rzucie obronnym; działa zgodnie z oknem **⚙ Zasady sesji → Featy z paczek** (Pytaj / Automatycznie / Wyłączone) |
| `spells` | `known` (stałe czary), `free` (stałe czary 1×/odpoczynek bez slotu), `choose: [{level, class, school, count, free}]`, `ability` albo `abilityChoice`, `rest` | czary z featu; wybory robi się na karcie (**Features & Traits → Efekty featów**), a czar `free` pojawia się na liście slotów jako darmowy |

```json
{
  "id": "aberrant-dragonmark", "name": "Aberrant Dragonmark", "category": "Dragonmark",
  "effects": [
    { "type": "spells", "ability": "con",
      "choose": [ { "level": 0, "class": "sorcerer" }, { "level": 1, "class": "sorcerer", "free": true } ] },
    { "type": "resource", "id": "aberrant-fortitude", "name": "Aberrant Fortitude", "uses": 1, "rest": "long" },
    { "type": "trigger", "on": "failSave", "abs": ["con"], "do": "addDie", "die": "1d4",
      "cost": "aberrant-fortitude", "reaction": true, "name": "Aberrant Fortitude" }
  ],
  "desc": "Krótki opis własnymi słowami."
}
```

Kolejne klocki:

| klocek | pola | co robi |
|---|---|---|
| `prof` | `skills`, `tools`, `armor` (`light`/`medium`/`heavy`/`shield`), `weapons` (`simple`/`martial`/nazwa), `saves`, `choose: {what, from, count}` | biegłości (wybór na karcie) |
| `expertise` | `skills`, `choose: {from: "proficient", count}` | ekspertyza |
| `sense` | `kind`: `darkvision`/`blindsight`/`truesight`/`tremorsense`, `range` | zmysły (darkvision liczy się do mgły) |
| `immune` | `dmg: [...]` | niewrażliwość na typ obrażeń |
| `condImmune` | `conds: ["frightened"]` | odporność na stan |
| `resist` z `choose` | `choose: {from: [...], count}` | odporność do wyboru na karcie |
| `bonus` | `stat`: `init`, `hpPerLevel`, `hpFlat`; `ac` z `armor` i `dexMin`; `dmg` z `when: "thrown"` | inicjatywa, PW, KP zależne od zbroi, broń rzucana |
| `dmgReduce` | `value`, `dmg: [...]`, `armor` | zmniejsza obrażenia od trafień (np. Heavy Armor Master) |
| `onHit` | `dice`, `bonus`, `dmgType` (`weapon` = typ broni), `when` (`melee`/`ranged`/`weapon`/`thrown`/`any`), `reqDmg`, `needBloodied`, `heal`, `targetFx: {n, spd, dAdv}`, `cost` | raz na turę: pole do zaznaczenia w panelu ataku |
| `trigger` z `on: "drop0"` | `healHalf`, `cost`, `name` | zamiast spaść do 0 PW zostajesz z 1 PW (albo z połową maks. PW) |
| `note` | `text` | sama notatka na karcie |

Klocki akcji, reakcji i testów:

| klocek | pola | co robi |
|---|---|---|
| `chkDie` | `skills`, `abs`, `die`, `name`, `cost` | po teście umiejętności/cechy dorzuca kość (np. znaki smocze) |
| `action` | `do`: `dodge` `dash` `dashHide` `dashDis` `disengage` `hide` `teleport` `healHD` `tempHp` `heroic` `selfFx` `note`; `econ`: `a`/`b`/`r`/`free`; `cost`, `range`, `dice`, `value` (`prof`, `lvl`, `ab:con`…), `count`, `fx: {c, n, r}` | przycisk na pasku akcji; `healHD` bez `dice` wydaje Kość Wytrzymałości, z `range` leczy wskazany cel |
| `rxAc` | `value`, `vs`: `melee`/`any`, `req`: `finesse`/`shield`, `cost`, `name` | reakcja po trafieniu: +KP (może zamienić trafienie w pudło) |
| `rxReduce` | `dice` (np. `1d10`, `prof d6`), `bonus`, `dmg`, `cost`, `name` | reakcja: zmniejsza obrażenia |
| `rxFx` | `on`: `hit`/`damaged`, `fx: {c, n, res}`, `cost`, `name` | reakcja nakładająca efekt na siebie |
| `atkAdv` | `when`: `bloodied` / `targetCond` + `cond` | przewaga w atakach |
| `ignoreResist` | `dmg`, `spellsOnly` | twoje obrażenia ignorują odporność |
| `resistWhen` | `dmg` (lista albo `allButForce`), `immune` | odporność (lub niewrażliwość), gdy jesteś Bloodied |
| `deathSave` | `mode`: `a`/`d` | przewaga/utrudnienie w rzutach przeciw śmierci |
| `missToHit` | `name` | raz na turę: pudło zamień w trafienie |
| `onCast` | `school`, `tempHp` (np. `2*slot`), `speed` (np. `5*slot`) | efekt po rzuceniu czaru danej szkoły ze slotu |
| `unarmed` | `dice`, `noWeapon` | kość ataku bez broni |
| `spellRecall` | — | darmowe rzucenie czaru (odzysk slotu) |

Klocki kości obrażeń, obrony i drużyny:

| klocek | pola | co robi |
|---|---|---|
| `dmgDie` | `min` (2–6), `when`: `any` `weapon` `melee` `ranged` `light` `unarmed` `lightUnarmed` `crossbow` `spell`; `dmg` albo `choose: {from, count}`, `school`, `cost` | kości obrażeń poniżej `min` liczą się jako `min`; przy czarze z `cost` gra pyta, czy użyć |
| `critDie` | `dmg`, `when` | dodatkowa kość obrażeń przy trafieniu krytycznym |
| `dmgReroll` | `dmg`, `when` | raz na turę przerzuca najniższą kość obrażeń (gdy wypadła połowa lub mniej) |
| `oaBest` | — | obrażenia ataku okazyjnego rzucane dwa razy, liczy się wyższy wynik |
| `concSafe` | — | obrażenia nie przerywają koncentracji |
| `advNear` | `abs`, `range`, `both` | przewaga w rzutach obronnych, gdy sojusznik (bez stanu Incapacitated) jest w zasięgu; `both` — sojusznik też ją dostaje |
| `grappleAdv` | — | sojusznicy mają przewagę w atakach na stworzenie, które chwytasz |
| `noMeleeDis` | `when: "crossbow"` | brak utrudnienia za strzał z bliska |
| `spellRange` | `add`, `attackOnly` | większy zasięg czarów (z rzutem ataku) |
| `mastery` | `count` | mistrzostwo wybranej broni (wybór na karcie) |
| `tempHpBonus` | `value` | dodatek do każdych zdobywanych tymczasowych PW |
| `hdMax` | — | Kości Wytrzymałości leczą maksymalnie |
| `ignoreResist` z `choose` | `choose: {from, count}` | typ obrażeń wybierany na karcie |
| `chkDie` z `replaces` | `replaces`: id featu | zastępuje kość innego featu (np. Greater Mark → 1d6 zamiast 1d4) |

Reakcje za sojusznika i inne:

| klocek | pola | co robi |
|---|---|---|
| `allyRx` | `do`: `disadv` / `reduce`; `dice`, `bonus`, `range`, `req`: `shield` / `shieldOrWeapon` / `none`, `linger`, `cost` | gdy wróg trafi sojusznika w zasięgu, gra **pyta** właściciela postaci o reakcję: utrudnienie (drugi k20, niższy wynik; z `linger` kolejne ataki na sojusznika z utrudnieniem do początku twojej tury) albo zmniejszenie obrażeń |
| `retaliate` | — | po trafieniu wręcz gra pyta o atak okazyjny za reakcję |
| `initReroll` | `below` | przy inicjatywie ≤ `below` gra pyta o przerzut (w trybie „Automatycznie” przerzuca sama) |
| `dualWield` | — | atak akcją bonusową drugą bronią wręcz bez Two-Handed (gdy masz broń Light) |
| `action` z `do: "ignoreInc"` | — | przycisk: ignorujesz Incapacitated w tej turze (+1 Exhaustion) |
| `upgrade` | `feat`, `die`, `rest` | ulepsza inny feat (np. kość `1d6` zamiast `1d4`, odnowienie po krótkim odpoczynku) |

Reakcje nigdy nie są zużywane bez pytania — masz jedną reakcję na rundę i sam wybierasz, czy wydać ją np. na Shield, czy na feat. Przerzuty „you can” (np. `dmgReroll`) też pytają, chyba że w **⚙ Zasady sesji → Featy z paczek** wybrano „Automatycznie”.

Zdolności, których nie da się złożyć z klocków, trzeba dopisać w kodzie (zgłoś je z treścią featu).

### Efekty czytane z opisu (potwory i czary)

Gra rozpoznaje typowe zdania w formacie SRD 2024, więc własne potwory i czary działają bez dodatkowych pól:

**Potwory**
- trafienie z dodatkowym rzutem obronnym („…it is subjected to the following effect. Constitution Saving Throw: DC 13… Failure: …”) — gra rzuca za cel i nakłada stany, obrażenia oraz powtarzany rzut;
- stany z rzutów obronnych z powtarzanym rzutem („repeats the save at the end of each of its turns”), „can't take Reactions”, „Speed 0”;
- obrażenia co turę („takes 7 (2d6) Poison damage at the start of each of its turns”);
- zmniejszenie maksymalnych PW („Hit Point maximum decreases…”), przywracane po długim odpoczynku;
- akcje, które odsyłają do innych („makes two Bite attacks”, „uses Eye Rays”, „uses Spellcasting to cast …”) — w akcjach legendarnych, bonusowych i zwykłych;
- teleport („teleports up to 60 feet”) — wybór miejsca na mapie;
- reakcje: Parry („adds 2 to its AC”) i Uncanny Dodge — DM dostaje pytanie;
- cechy: Death Burst, Flyby, Evasion, Blood Frenzy, Bloodied Fury/Frenzy (przewaga w atakach), aury obrażeń na początku/końcu tury, obrażenia dla atakującego wręcz.

**Czary**
- stany po nieudanym rzucie lub trafieniu, z powtarzanym rzutem i obrażeniami co turę; −1d4 do rzutów obronnych / ataków;
- leczenie i tymczasowe PW („regains Hit Points equal to 2d8 + your spellcasting ability modifier”, „gains 5 Temporary Hit Points”);
- smite'y (akcja bonusowa po trafieniu bronią): dodatkowe kości, rzut obronny i stan;
- dodatkowe obrażenia broni z czarów na siebie lub dotyk.

**Losowe tabele, formy i przywołania**
- akcja z tabelą („roll 1d10” + lista „• 1: Charm Ray …”) — gra losuje pozycję (bez powtórek w tej samej turze, jeśli opis tak mówi); działa też w Multiattack („uses Eye Rays three times”) i w akcjach legendarnych;
- formy potworów: akcje oznaczone „(Wolf or Hybrid Form Only)” są dostępne tylko w danej formie; przycisk 🔄 w pasku żetonu zmienia formę albo zamienia statystyki na innego potwora z katalogu (PW bez zmian, z powrotem do prawdziwej formy);
- przywołańce czarów: potwór z polami `summonSpell` (id czaru), `acF` i `hpF` (formuły, np. `"11 + the spell's level"`, `"40 + 10 for each spell level above 4"`) — po rzuceniu czaru gra pyta o wariant („(Air only)”), liczy KP, PW, premię do ataku, ST i obrażenia („+ the spell's level”, „your spell save DC”) z poziomu slotu i statystyk rzucającego. Przywołaniec działa zaraz po rzucającym i znika, gdy rzucający straci koncentrację.

| pole potwora | typ | uwagi |
|---|---|---|
| `summonSpell` | id czaru | czar, który przywołuje to stworzenie |
| `acF`, `hpF` | string | formuły KP i PW zależne od poziomu czaru |
| `pbNote` | string | stworzenie używa premii z biegłości rzucającego |

Czary i potwory z ręcznie opisaną mechaniką w grze mają pierwszeństwo przed odczytem z opisu.

### Filtr książek

W oknie **Paczki** pod listą paczek jest sekcja **📚 Książki**: każda książka (pole `book` / `fsrc`) ma przełącznik. Wyłączona książka znika z katalogu, kreatora i wyboru featów; ustawienie zapisuje się w przeglądarce.

---

## Czar (`spells`)

| pole | typ | uwagi |
|---|---|---|
| `id`, `name` | string | |
| `level` | liczba | `0` = sztuczka |
| `school` | string | np. `evocation` |
| `classes` | tablica klas | na czyich listach jest czar |
| `range` | liczba (ft) | `0` = na siebie |
| `rangeText` | string | do wyświetlania, np. `150 feet` |
| `shape` | `circle` `cone` `line` `cube` `single` | kształt na mapie; bez niego czar jest tylko opisem |
| `size` | liczba (ft) | promień / długość / bok |
| `dice` | kości | główne obrażenia albo leczenie |
| `type` | typ obrażeń | |
| `damage` | tablica `{dice, type}` | gdy kilka typów naraz (do 6) |
| `save` | cecha | rzut obronny celu |
| `half` | bool | połowa obrażeń przy udanym rzucie |
| `attack` | `melee` / `ranged` | czar z rzutem na atak |
| `autoHit` | bool | trafia zawsze (jak Magic Missile) |
| `rays` | `{base, perSlot, byLevel}` | wiele pocisków/promieni |
| `scaling` | `{dice, above}` | `+dice` za każdy slot powyżej `above` |
| `castingTime`, `duration` | string | |
| `concentration`, `ritual` | bool | |
| `components` | tablica | `["V","S","M"]` |
| `material` | string | |
| `higher`, `desc` | string | opisy |

Czar jest **rzucalny na mapie**, gdy ma `shape` oraz `dice` i `type`.

```json
{
  "id": "frost-lance", "name": "Frost Lance", "level": 2, "school": "evocation",
  "classes": ["sorcerer", "wizard"], "range": 60, "shape": "line", "size": 60,
  "dice": "4d8", "type": "cold", "save": "con", "half": true,
  "scaling": { "dice": "1d8", "above": 2 },
  "castingTime": "Action", "duration": "Instantaneous", "components": ["V", "S"],
  "desc": "Lodowa włócznia przebija wszystko na linii."
}
```

> Efekty dodatkowe (stany, wzmocnienia) działają dla czarów z SRD rozpoznawanych po `id`. Dla własnych czarów automatyczne są obrażenia, leczenie, rzuty obronne i koncentracja.

---

## Potwór (`monsters`)

| pole | typ | uwagi |
|---|---|---|
| `id`, `name` | string | |
| `cr` | string | `1/4`, `5`… (z tego liczy się XP i budżet spotkań) |
| `hp`, `ac` | liczby | |
| `hitDice` | string | np. `2d8+2` |
| `size`, `type`, `alignment` | string | `type` ważny dla Turn Undead (`Undead`) |
| `speed` | string | np. `40 ft., Fly 60 ft.` |
| `stats` | `{str, dex, con, int, wis, cha}` | wartości cech |
| `initiative` | liczba | modyfikator inicjatywy |
| `senses`, `languages` | string | |
| `resist`, `vulnerable`, `immune` | tablice typów obrażeń | |
| `conditionImmunities` | tablica | np. `["poisoned","charmed"]` |
| `traits`, `actions`, `bonusActions`, `reactions`, `legendary` | tablice stringów | format `"Nazwa. Tekst"` |
| `spells` | tablica `id` czarów | czary na karcie żetonu |
| `desc` | string | |

**Akcje są czytane automatycznie**, jeśli trzymają się formatu z SRD 2024:
- atak: `"Bite. Melee Attack Roll: +4, reach 5 ft. Hit: 5 (1d6 + 2) Piercing damage."`
- rzut obronny: `"Fire Breath (Recharge 5–6). Dexterity Saving Throw: DC 13, each creature in a 15-foot Cone. Failure: 24 (7d6) Fire damage. Success: Half damage."`
- ST czarów w `Spellcasting`: `"(spell save DC 17)"`.

**Cechy działające mechanicznie (po nazwie na początku):** Pack Tactics, Magic Resistance, Sunlight Sensitivity, Undead Fortitude, Regeneration (`regains N Hit Points`, `takes acid or fire damage`), Legendary Resistance (`(3/Day)`). Counterspell w `reactions` daje okno reakcji.

```json
{
  "id": "frost-wolf", "name": "Frost Wolf", "cr": "1", "hp": 26, "ac": 13, "hitDice": "4d8+8",
  "size": "Medium", "type": "Beast", "speed": "50 ft.",
  "stats": { "str": 15, "dex": 16, "con": 14, "int": 3, "wis": 12, "cha": 6 },
  "immune": ["cold"],
  "traits": ["Pack Tactics. The wolf has Advantage on attack rolls against a creature if an ally is within 5 feet of it."],
  "actions": ["Bite. Melee Attack Roll: +5, reach 5 ft. Hit: 7 (1d8 + 3) Piercing damage plus 3 (1d6) Cold damage."]
}
```

---

## Przedmiot (`items`)

| pole | typ | uwagi |
|---|---|---|
| `id`, `name` | string | |
| `kind` | `weapon` `armor` `shield` `gear` `consumable` `magic` | |
| `cat` | string | broń: `simple`/`martial`; zbroja: `light`/`medium`/`heavy`; tarcza: `shield` |
| `weight` | liczba (lb) | |
| `cost` | liczba (GP) | `0.1` = 1 SP, `0.01` = 1 CP |
| `rarity` | string | `common` `uncommon` `rare` `very rare` `legendary` `artifact` |
| `bonus` | 0–3 | magiczne +1/+2/+3 (broń, zbroja, tarcza) |
| `attune`, `attuneBy` | bool, string | wymaga zestrojenia; `attuneBy` np. `Wizard`, `Spellcaster` |
| `tool` | bool | narzędzie / instrument (filtr „Narzędzia”) |
| `note`, `desc` | string | krótka notatka / pełny opis |
| **broń** | | |
| `dice`, `dtype` | kości, typ obrażeń | np. `1d8`, `slashing` |
| `props` | tablica | `light` `finesse` `heavy` `two-handed` `versatile` `thrown` `reach` `ammunition` `loading` |
| `vers` | kości | obrażenia oburącz (Versatile) |
| `range` | string | np. `80/320` |
| `ranged` | bool | broń dystansowa |
| `mastery` | string | `cleave` `graze` `nick` `push` `sap` `slow` `topple` `vex` |
| **zbroja / tarcza** | | |
| `base` | liczba | KP zbroi (tarcza: `2`) |
| `dexMax` | liczba | limit ZRĘ (`0` = bez ZRĘ; pomiń dla lekkiej) |
| `str` | liczba | wymagana SIŁA |
| `stealth` | bool | utrudnienie w Stealth |
| **efekty magiczne** | | |
| `acBonus`, `saveBonus` | liczby | premia do KP / rzutów (gdy zestrojony i założony) |
| `spellAtk`, `spellDc` | liczby | premia do ataku / ST czarów |
| `cond` | `noArmor` | premia tylko bez zbroi i tarczy |
| `heal` | kości | mikstura leczenia, np. `2d4+2` |

```json
[
  { "id": "hermits-staff", "name": "Hermit's Staff", "kind": "weapon", "cat": "simple",
    "dice": "1d6", "dtype": "bludgeoning", "props": ["versatile"], "vers": "1d8",
    "mastery": "topple", "weight": 4, "cost": 3, "note": "Rzeźbiony dąb." },
  { "id": "frost-mail", "name": "Frost Mail", "kind": "armor", "cat": "medium",
    "base": 14, "dexMax": 2, "bonus": 1, "rarity": "rare", "attune": true, "weight": 20,
    "desc": "Odporność na zimno, gdy zestrojona." },
  { "id": "amulet-of-focus", "name": "Amulet of Focus", "kind": "magic", "rarity": "uncommon",
    "attune": true, "attuneBy": "Spellcaster", "spellDc": 1, "spellAtk": 1 }
]
```

---

## Pakiet ekwipunku (`packs`)

Pakiet rozpakowuje się na pojedyncze przedmioty przy dodawaniu.

| pole | typ | uwagi |
|---|---|---|
| `id`, `name` | string | |
| `cost` | liczba (GP) | |
| `contents` | tablica `[id_przedmiotu, ilość]` | |

```json
{ "id": "hunters-pack", "name": "Hunter's Pack", "cost": 12,
  "contents": [["backpack", 1], ["hunting-trap", 1], ["rations", 5], ["rope", 1], ["waterskin", 1]] }
```

Wbudowane pakiety: `burglars-pack`, `diplomats-pack`, `dungeoneers-pack`, `entertainers-pack`, `explorers-pack`, `priests-pack`, `scholars-pack`.

---

## Wyposażenie startowe klas (`classEquipment`)

Obiekt: klucz to klasa, wartość to lista opcji A, B, C… Każda opcja zawiera:
- `items`: `[id, ilość, notatka?]`;
- `pack`: `id` pakietu;
- `gp`: złoto.

Zastępuje wbudowane wyposażenie tej klasy.

```json
"classEquipment": {
  "cleric": [
    { "items": [["chain-shirt", 1], ["shield", 1], ["mace", 1], ["holy-symbol", 1]], "pack": "priests-pack", "gp": 7 },
    { "gp": 110 }
  ]
}
```

---

## Uwagi prawne

Wgrywaj tylko dane, do których masz prawo. SRD 5.2 (CC-BY-4.0) można publikować z uznaniem autorstwa. Treści z płatnych podręczników trzymaj lokalnie i importuj ręcznie, bez wrzucania do publicznego repozytorium.
