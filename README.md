# AutoZapis — TechQuest 2026 (Leżajsk, 24h)

Projekt stworzony na **TechQuest 2026** dla sponsora: **OSK Prawo Jazdy Józef Majkut**.

To pełny system do obsługi ośrodka szkolenia kierowców: rejestracja kursantów, panel administratora, panel instruktora, panel kursanta, obieg dokumentów PKK, ogłoszenia i harmonogramy.

## Autorzy

- Paweł Szymański
- Klaudia Sopyła
- Dawid Pysz
- Dawid Winiarski

## Dlaczego ten projekt

- Cyfryzuje proces zapisu i weryfikacji kursanta.
- Upraszcza pracę administracji i instruktorów.
- Daje kursantowi przejrzysty podgląd postępów, materiałów i planu zajęć.

## Moduły systemu

- `Kursant`: rejestracja, materiały, jazdy, wykłady, status konta, powiadomienia.
- `Instruktor`: przypisania kursantów, plan i historia jazd, wykłady i obecności.
- `Administrator`: aktywacja kont, PKK, płatności, kursy, ogłoszenia, analityka.

## Stack

- Next.js 16 + React 19 + TypeScript
- Prisma + PostgreSQL
- Clerk (auth + webhook)
- Cloudflare R2 (uploady PKK)
- Tailwind CSS

## Szybki start

1. Zainstaluj zależności:

```bash
pnpm install
```

2. Uzupełnij `.env`:

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

3. Uruchom bazę i seedy:

```bash
pnpm prisma generate
pnpm prisma db push
pnpm seed:pwpw-questions
pnpm seed:example-accounts
```

4. Start aplikacji:

```bash
pnpm dev
```

## Konta demo

- `demo.admin@autozapis-demo.pl` / `Admin123!`
- `demo.instruktor@autozapis-demo.pl` / `Instruktor123!`
- `demo.kursant@autozapis-demo.pl` / `Kursant123!`

## Dokumentacja

- Szczegółowy setup: `docs/SETUP.md`
- Wersja pod jury/sponsora: `docs/JURY-SPONSOR.md`
