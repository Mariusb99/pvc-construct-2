# PVC Construct — platformă de vânzare și închiriere utilaje

Platformă web pentru **PVC CONSTRUCT SRL**: catalog de utilaje de construcții cu vânzare și
închiriere, formular de cerere ofertă, flux de închiriere cu confirmare manuală, și panou
de administrare complet (utilaje, categorii, mărci, lead-uri, închirieri, setări, useri).

Construit cu Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Drizzle ORM + PostgreSQL
(compatibil Supabase) și Auth.js v5. Design-ul urmează sistemul vizual „Peloton" — Carbon
Black / Mist Gray, accent roșu unic, Inter.

## Cuprins

1. [Cerințe](#cerințe)
2. [Configurare rapidă (dezvoltare locală)](#configurare-rapidă-dezvoltare-locală)
3. [Configurare Supabase (bază de date + imagini)](#configurare-supabase-bază-de-date--imagini)
4. [Variabile de mediu](#variabile-de-mediu)
5. [Structura proiectului](#structura-proiectului)
6. [Administrare](#administrare)
7. [Deploy în producție](#deploy-în-producție)
8. [Comenzi utile](#comenzi-utile)

## Cerințe

- Node.js 20 sau mai nou
- Un proiect [Supabase](https://supabase.com) (gratuit la pornire) — bază de date Postgres +
  stocare imagini
- Un domeniu `.ro` (opțional pentru dezvoltare, necesar pentru lansare)

## Configurare rapidă (dezvoltare locală)

```bash
bun install
cp .env.example .env
# completează .env cu datele tale (vezi secțiunea de mai jos)

bun run db:push      # creează tabelele în baza de date
bun run db:seed       # populează setările companiei, categoriile, mărcile și contul de admin
bun run dev
```

Aplicația pornește pe [http://localhost:3000](http://localhost:3000). Panoul de admin este la
`/admin/login`.

**Cont de admin implicit după seed:** `admin@pvcconstruct.ro` / `SchimbaParola123!`
— schimbă parola din prima zi (din `/admin/useri` poți crea un cont nou și dezactiva/edita
oricare altul, sau schimbă direct `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` înainte de a
rula seed-ul pe baza de producție).

## Configurare Supabase (bază de date + imagini)

1. Creează un proiect nou pe [supabase.com](https://supabase.com/dashboard).
2. **Baza de date:** *Project Settings → Database → Connection string → URI*. Alege modul
   **Session pooler** (recomandat dacă găzduiești pe o platformă serverless precum Vercel) și
   copiază URL-ul în `DATABASE_URL` din `.env`.
3. **Stocare imagini (obligatoriu în producție):** *Storage → New bucket* → creează un bucket
   numit `public-assets` și marchează-l **Public**. Fără acest pas, imaginile urcate din admin
   se salvează local pe disc — funcționează în dezvoltare, dar **se pierd la fiecare deploy**
   pe platforme serverless (Vercel, Netlify etc.), unde sistemul de fișiere este efemer.
4. *Project Settings → API* → copiază `Project URL` în `SUPABASE_URL` și `service_role` (secret)
   în `SUPABASE_SERVICE_ROLE_KEY`.
5. Rulează migrațiile pe baza de date Supabase: `bun run db:push` (cu `DATABASE_URL` completat).
6. Rulează `bun run db:seed` o singură dată, pentru a popula setările companiei, categoriile,
   mărcile inițiale și contul de admin.

Fără `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` setate, aplicația salvează imaginile local în
`public/uploads` — util doar pentru testare pe propriul calculator sau pe un server clasic cu
disc persistent.

## Variabile de mediu

Vezi `.env.example` pentru șablon. Rezumat:

| Variabilă | Obligatoriu | Descriere |
|---|---|---|
| `DATABASE_URL` | Da | Connection string Postgres (Supabase, mod „Session pooler") |
| `AUTH_SECRET` | Da | Secret pentru sesiuni — generează cu `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | Da | URL public al site-ului (ex. `https://www.pvcconstruct.ro`) — folosit în metadata, sitemap, SEO |
| `SUPABASE_URL` | Recomandat în producție | Project URL Supabase, pentru stocarea imaginilor |
| `SUPABASE_SERVICE_ROLE_KEY` | Recomandat în producție | Cheie service_role Supabase (secretă, nu o expune public) |
| `SUPABASE_STORAGE_BUCKET` | Nu | Numele bucket-ului de storage (implicit `public-assets`) |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Nu | Suprascriu contul de admin creat de `bun run db:seed` |

## Structura proiectului

```
src/
  app/
    (public)/         pagini publice — homepage, catalog, fișă utilaj, contact etc.
    admin/             panou de administrare (protejat, necesită autentificare)
    sitemap.ts, robots.ts
  components/
    ui/                componente reutilizabile (Button, Input, StatusBadge, Card...)
    layout/            Navbar, Footer, comutator limbă
    home/               secțiunile paginii principale
    equipment/          card, filtre, galerie, tabel specificații
    forms/              formular cerere ofertă
    admin/              componente specifice panoului de administrare
  lib/
    db/                 schema Drizzle, client, seed
    queries/            interogări de citire (Server Components)
    actions/            Server Actions — toate mutațiile (creare/editare/ștergere)
    validations/        scheme Zod
    auth/                configurare Auth.js (login, roluri, sesiune)
    i18n/                dicționare RO/EN pentru interfața publică
    storage.ts           upload imagini (Supabase Storage / disc local)
```

**Categorii de utilaje** și **mărci** se administrează integral din `/admin/categorii` și
`/admin/marci` — nu sunt hardcodate în cod, așa că pot fi extinse oricând fără intervenție
tehnică. La fel, fiecare categorie are propriul set de „specificații sugerate" (ex. putere
motor, capacitate cupă), configurabile din `/admin/categorii`.

## Administrare

Rute principale din `/admin`:

- **Dashboard** — cereri și închirieri recente, cifre rapide.
- **Utilaje** — CRUD complet, imagini, specificații tehnice, status (De vânzare / De închiriat
  / Vânzare & închiriere / Indisponibil / Vândut / Închiriat).
- **Categorii** — creare/reordonare/dezactivare + specificații sugerate per categorie.
- **Mărci** — creare + logo.
- **Lead-uri** — toate cererile primite prin formularele publice, cu status (Nou → Contactat →
  Ofertă trimisă → Negociere → Câștigat/Pierdut).
- **Închirieri** — cererile de închiriere **nu se confirmă automat**: admin-ul creează
  închirierea dintr-un lead, stabilește perioada și valoarea, apoi o confirmă manual; la
  confirmare, perioada se blochează automat în calendarul de disponibilitate al utilajului.
- **Setări** — datele firmei (CUI, Reg. Com., adresă), conținutul paginii principale (titlu,
  subtitlu, imagine hero) și logo — toate editabile fără a atinge codul.
- **Useri** — un singur cont de admin la lansare; poți adăuga oricând conturi noi cu rol
  **Administrator** (acces complet) sau **Vânzări** (fără acces la Setări/Useri).

## Deploy în producție

Aplicația e compatibilă cu orice gazdă Node.js. Recomandat: **Vercel** (integrare nativă cu
Next.js, certificat SSL automat, se conectează direct la un domeniu `.ro` din
Project Settings → Domains). Alternativ, orice VPS/hosting cu suport Node 20+ funcționează la
fel de bine — `trustHost: true` este deja configurat în Auth.js tocmai pentru a funcționa în
spatele oricărui reverse proxy.

Pași generali:

1. Urcă acest proiect într-un repository Git (GitHub/GitLab).
2. Conectează repository-ul la platforma de hosting aleasă.
3. Setează variabilele de mediu din secțiunea de mai sus (inclusiv Supabase).
4. Rulează `bun run db:push` (sau `bun run db:migrate`, dacă preferi migrații versionate) pe
   baza de date de producție, apoi `bun run db:seed` **o singură dată**.
5. Deploy. Comanda de build este `bun run build`, cea de pornire `bun run start`.
6. Atașează domeniul `.ro` din panoul platformei de hosting.

După deploy, intră în `/admin/setari` și completează telefon/email de contact (lăsate goale
intenționat la seed), apoi schimbă parola contului de admin din `/admin/useri`.

## Comenzi utile

```bash
bun run dev          # server de dezvoltare
bun run build         # build de producție
bun run start          # pornește build-ul de producție (rulează bun run build înainte)
bun run lint            # verificare cod

bun run db:push         # sincronizează schema cu baza de date (rapid, pentru dezvoltare)
bun run db:generate     # generează fișiere de migrație versionate
bun run db:migrate      # aplică migrațiile generate (recomandat pentru producție)
bun run db:studio       # interfață vizuală pentru baza de date (Drizzle Studio)
bun run db:seed         # populează datele inițiale (setări, categorii, mărci, admin)
```
