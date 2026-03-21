# AutoZapis — Mapa podstron i flow ról

Nawigacja dokumentacji: [README](https://github.com/rvyk/techquest-2026-autozapis/blob/main/README.md) | [Setup techniczny](https://github.com/rvyk/techquest-2026-autozapis/blob/main/docs/SETUP.md) | [Mapa podstron i ról](https://github.com/rvyk/techquest-2026-autozapis/blob/main/docs/PAGES-AND-FLOWS.md) | [Wersja jury/sponsor](https://github.com/rvyk/techquest-2026-autozapis/blob/main/docs/JURY-SPONSOR.md)

Ten dokument opisuje **każdą główną podstronę** i jej rolę w systemie, z podziałem na role: gość, kursant, instruktor, administrator.

## 1) Public / Gość

### `/`
- Landing page OSK „Prawo Jazdy Józef Majkut”.
- Sekcje: hero, kursy, instruktorzy, cennik, kontakt.
- CTA do logowania i rejestracji.

### `/logowanie`
- Logowanie przez Clerk (email/hasło).
- Przekierowanie zależnie od roli i statusu konta.

### `/rejestracja`
- Zakładanie konta kursanta.
- Walidacja email, telefonu i hasła.

## 2) Rejestracja (flow krokowy)

### `/rejestracja/weryfikacja`
- Potwierdzenie konta kodem email.

### `/rejestracja/profil`
- Wprowadzanie danych: imię, nazwisko, data urodzenia, kategoria.
- Walidacja pól i podgląd danych dokumentu.
- Przycisk „Przerwij i usuń konto”.

### `/rejestracja/dokument`
- Upload dokumentu PKK do R2.
- Po sukcesie ustawienie statusu rejestracji i przejście dalej.

## 3) Kursant

### `/kursant`
- Główny dashboard kursanta.
- Podsumowanie godzin, najbliższe jazdy, saldo, ogłoszenia.

### `/kursant/oczekiwanie`
- Ekran dla kont po rejestracji, przed aktywacją przez admina.

### `/kursant/jazdy`
- Lista jazd praktycznych z tematami i terminami.

### `/kursant/wyklady`
- Harmonogram wykładów i status obecności.

### `/kursant/instruktorzy`
- Informacje o instruktorach i prowadzącym.

### `/kursant/materialy`
- Hub edukacyjny (ćwiczenia i egzamin próbny).

### `/kursant/materialy/cwiczenia`
- Trening pytań (pojedyncze pytania).

### `/kursant/materialy/egzamin`
- Egzamin próbny (zestaw pytań, wynik).

## 4) Instruktor

### `/instruktor`
- Dashboard instruktora: kursanci, dzisiejsze jazdy, wykłady, statystyki.

### `/instruktor/kursanci`
- Lista kursantów i status przypisań.

### `/instruktor/kursanci/[kursantId]`
- Szczegóły kursanta, historia i plan jazd, szybkie akcje.

### `/instruktor/jazdy`
- Widok harmonogramu jazd.

### `/instruktor/wyklady`
- Zarządzanie wykładami i obecnościami.

## 5) Administrator

### `/administrator`
- Dashboard analityczny: kursanci, PKK, instruktorzy, aktywność.

### `/administrator/kursanci`
- Zarządzanie kursantami:
  - aktywacja kont,
  - statusy,
  - płatności,
  - dokumenty PKK.

### `/administrator/instruktorzy`
- Zarządzanie instruktorami i uprawnieniami (teoria/praktyka).

### `/administrator/kursy`
- Zarządzanie ofertą kursów (CRUD).

### `/administrator/ogloszenia`
- Tworzenie i publikacja ogłoszeń do grup odbiorców.

## 6) API — mapowanie funkcjonalne

### Auth i użytkownik
- `/api/webhooks/clerk` — synchronizacja userów z Clerk do DB.
- `/api/registration/abort` — usunięcie konta i danych podczas przerwania rejestracji.

### PKK
- `/api/pkk/upload` — upload i walidacja dokumentu PKK.
- `/api/admin/kursanci/[kursantId]/pkk-url` — signed URL dla admina.
- `/api/admin/kursanci/[kursantId]/pkk` — usunięcie PKK.

### Kursanci / płatności
- `/api/admin/kursanci/[kursantId]/status` — status konta.
- `/api/admin/kursanci/[kursantId]/payment` — płatności.

### Instruktorzy / jazdy / wykłady
- `/api/instructor/students`
- `/api/instructor/students/[studentId]/assignment`
- `/api/instructor/students/[studentId]/lessons`
- `/api/instructor/lessons`
- `/api/instructor/lessons/[lessonId]`
- `/api/instructor/lectures`
- `/api/instructor/lectures/[lectureId]/attendance/[attendanceId]`

### Kursant — dane szkolenia
- `/api/student/lectures`
- `/api/student/lessons`

### Ogłoszenia / powiadomienia
- `/api/announcements`
- `/api/announcements/[announcementId]`
- `/api/notifications`
- `/api/notifications/read-all`
- `/api/notifications/[announcementId]/read`

## 7) Rola i dostęp (RBAC)

- `ADMINISTRATOR` -> panel admina.
- `INSTRUKTOR` -> panel instruktora.
- `USER` + aktywne konto -> panel kursanta.
- `USER` nieaktywny -> ekran oczekiwania.

Dostęp jest kontrolowany przez layouty panelowe i helpery server-side.

## 8) Najważniejsze scenariusze biznesowe

1. Kursant rejestruje konto i wysyła PKK.
2. Administrator weryfikuje PKK i aktywuje konto.
3. Instruktor prowadzi jazdy i wykłady.
4. Kursant śledzi postępy i uczy się z materiałów.
