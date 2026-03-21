# AutoZapis — Setup techniczny

Nawigacja dokumentacji: [README](https://github.com/rvyk/techquest-2026-autozapis/blob/main/README.md) | [Setup techniczny](https://github.com/rvyk/techquest-2026-autozapis/blob/main/docs/SETUP.md) | [Mapa podstron i ról](https://github.com/rvyk/techquest-2026-autozapis/blob/main/docs/PAGES-AND-FLOWS.md) | [Wersja jury/sponsor](https://github.com/rvyk/techquest-2026-autozapis/blob/main/docs/JURY-SPONSOR.md)

Ten dokument zawiera pełną instrukcję uruchomienia projektu lokalnie i na środowisku testowym.

## 1. Wymagania

- Node.js `>=22.12.0`
- pnpm
- PostgreSQL
- Konto Clerk
- Cloudflare R2 bucket

## 2.1 Przydatne linki paneli

- Clerk Dashboard: `https://dashboard.clerk.com/`
- Cloudflare Dashboard (R2): `https://dash.cloudflare.com/`
- Neon (przykładowy Postgres): `https://console.neon.tech/`

## 3. Konfiguracja krok po kroku (Clerk + webhook)

### Krok 1: Utwórz aplikację w Clerk

1. Wejdź do `https://dashboard.clerk.com/`
2. Utwórz aplikację i włącz logowanie email/hasło.
3. Skopiuj klucze:
   - `Publishable key` -> `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `Secret key` -> `CLERK_SECRET_KEY`

### Krok 2: Ustaw webhook Clerk

1. W Clerk przejdź do sekcji Webhooks.
2. Dodaj endpoint:
   - lokalnie przez tunnel: `https://<twoj-tunnel>/api/webhooks/clerk`
   - na serwerze: `https://<twoja-domena>/api/webhooks/clerk`
3. Zaznacz eventy:
   - `user.created`
   - `user.updated`
   - `user.deleted`
4. Skopiuj signing secret do `CLERK_WEBHOOK_SIGNING_SECRET`.

## 4. Konfiguracja krok po kroku (baza danych)

### Krok 1: PostgreSQL

1. Utwórz bazę danych (np. Neon / lokalny Postgres).
2. Skopiuj connection string do `DATABASE_URL`.

### Krok 2: Prisma

Uruchom:

```bash
pnpm prisma generate
pnpm prisma db push
```

## 5. Konfiguracja krok po kroku (Cloudflare R2)

1. W Cloudflare utwórz bucket R2.
2. Utwórz API token/klucze dostępu do bucketu.
3. Uzupełnij:
   - `R2_ACCOUNT_ID`
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`
   - `R2_BUCKET_NAME`

## 6. Zmienne środowiskowe

Utwórz `.env` w root projektu:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SIGNING_SECRET=

DATABASE_URL=

R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
```

## 7. Instalacja i uruchomienie

```bash
pnpm install
pnpm prisma generate
pnpm prisma db push
pnpm seed:pwpw-questions
pnpm seed:example-accounts
pnpm dev
```

## 8. Seedy

### 5.1 Pytania PWPW

```bash
pnpm seed:pwpw-questions
```

Pliki:

- `prisma/seed-pwpw-questions.ts`
- `prisma/pwpw_questions.json`

### 5.2 Konta demo (Clerk + DB)

```bash
pnpm seed:example-accounts
```

Plik:

- `prisma/seed-example-accounts.ts`

Konta:

- admin: `demo.admin@autozapis-demo.pl` / `Admin123!`
- instruktor: `demo.instruktor@autozapis-demo.pl` / `Instruktor123!`
- kursant: `demo.kursant@autozapis-demo.pl` / `Kursant123!`

## 9. Weryfikacja krok po kroku

```bash
pnpm lint
npx tsx scripts/check-demo-accounts.ts
```

Smoke test:

1. `http://localhost:3000/` – landing.
2. `http://localhost:3000/rejestracja` – flow rejestracji.
3. `http://localhost:3000/logowanie` – logowanie.
4. Zaloguj się kontami demo i sprawdź:
   - `http://localhost:3000/administrator`
   - `http://localhost:3000/instruktor`
   - `http://localhost:3000/kursant`

## 10. Skąd brać klucze i dane

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`:
  - Clerk Dashboard -> API Keys
- `CLERK_WEBHOOK_SIGNING_SECRET`:
  - Clerk Dashboard -> Webhooks -> Signing Secret
- `DATABASE_URL`:
  - panel dostawcy PostgreSQL (np. Neon)
- `R2_*`:
  - Cloudflare Dashboard -> R2 -> bucket + API token

## 11. Najczęstsze problemy

### Brak kont demo w Clerk

- Sprawdź `CLERK_SECRET_KEY`
- Uruchom ponownie `pnpm seed:example-accounts`
- Sprawdź logi i `scripts/check-demo-accounts.ts`

### Błąd `USER_NOT_SYNCED`

- Sprawdź webhook `/api/webhooks/clerk`
- Zweryfikuj eventy i `CLERK_WEBHOOK_SIGNING_SECRET`

### Upload PKK nie działa

- Sprawdź `R2_*` w `.env`
- Sprawdź typ i rozmiar pliku (max 10MB)
