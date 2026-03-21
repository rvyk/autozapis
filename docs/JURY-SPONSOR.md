# TechQuest 2026 — prezentacja projektu dla jury i sponsora

Nawigacja dokumentacji: [README](https://github.com/rvyk/techquest-2026-autozapis/blob/master/README.md) | [Setup techniczny](https://github.com/rvyk/techquest-2026-autozapis/blob/master/docs/SETUP.md) | [Mapa podstron i ról](https://github.com/rvyk/techquest-2026-autozapis/blob/master/docs/PAGES-AND-FLOWS.md) | [Wersja jury/sponsor](https://github.com/rvyk/techquest-2026-autozapis/blob/master/docs/JURY-SPONSOR.md)

## Projekt

**AutoZapis** to system stworzony dla OSK **Prawo Jazdy Józef Majkut** podczas 24-godzinnego hackathonu TechQuest 2026 w Leżajsku.

## Zespół

- Paweł Szymański
- Klaudia Sopyła
- Dawid Pysz
- Dawid Winiarski

## Problem, który rozwiązujemy

Wiele lokalnych OSK nadal działa bez nowoczesnej strony i z dużą liczbą ręcznych procesów:

- ręczne zapisy i dokumenty,
- rozproszona komunikacja,
- brak centralnego panelu dla instruktorów i administracji,
- ograniczona widoczność postępów kursanta.

## Nasze rozwiązanie

Jedna platforma, trzy role:

1. **Kursant**
   - rejestracja online,
   - upload PKK,
   - dostęp do materiałów i harmonogramu,
   - podgląd postępów.

2. **Instruktor**
   - przypisani kursanci,
   - planowanie i raportowanie jazd,
   - wykłady i obecności.

3. **Administrator**
   - aktywacja kursantów,
   - obsługa płatności,
   - zarządzanie kursami i ogłoszeniami,
   - dashboard analityczny.

## Dlaczego to ważne dla sponsora

- Oszczędność czasu w codziennej obsłudze.
- Mniej błędów i mniej chaosu informacyjnego.
- Profesjonalny, nowoczesny kanał kontaktu z kursantem.
- Fundament pod dalszy rozwój (automatyzacje, analityka, skalowanie).

## Co działa już teraz

- pełny flow rejestracji i logowania,
- webhooks Clerk synchronizujące użytkowników,
- upload i zarządzanie dokumentami PKK,
- panele dla wszystkich ról,
- podstawowe analizy i raporty operacyjne.

## Kierunek dalszego rozwoju

- integracje SMS/e-mail przypomnień,
- pełne testy E2E,
- rozszerzenie oferty o kolejne kategorie i moduły,
- automatyczne raportowanie wyników i frekwencji.

## Podsumowanie

To nie jest demo „na slajdy”, tylko działający fundament produkcyjny dla lokalnego OSK,
który może realnie odciążyć zespół i poprawić doświadczenie kursanta.
