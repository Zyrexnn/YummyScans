# Product Requirement Document (PRD) — YummyScans

> **Versi:** 4.0 · **Terakhir diperbarui:** 13 Juli 2026 · **Status:** In Progress

---

## 1. Overview & Context

YummyScans adalah platform web untuk membaca komik (manga/manhua/manhwa) dengan terjemahan bahasa Indonesia. Dibangun dengan **Astro SSR** dan memiliki **satu sumber data utama**:

1. **Local Scraper (mangaku.guru)** — scraper built-in yang mengambil data dari sumber lokal Indonesia via Astro API Routes

> **Catatan:** Dukungan MangaDex API telah dihapus karena IP Indonesia diblokir oleh MangaDex. Semua konten sekarang berasal dari scraper mangaku.guru.

Estetika visual mengadopsi penuh **Figma Editorial Design System** — bingkai monokrom bersih yang diinterupsi oleh blok warna pastel berukuran besar (*technical yet joyful*). Referensi desain lengkap: [`DESIGN-figma.md`](./DESIGN-figma.md).

---

## 2. Problem Statement

Pembaca komik Indonesia menghadapi masalah:

| # | Masalah | Dampak |
|---|---------|--------|
| 1 | Situs baca komik Sub Indo didominasi iklan invasive dan UI berantakan | Pengalaman membaca buruk |
| 2 | Tidak ada platform dengan estetika modern dan bersih | Tidak ada alternatif "premium" |
| 3 | Informasi manga tersebar, tidak terorganisir berdasarkan genre/musim | Sulit menemukan manga baru |

**Solusi:** YummyScans memberikan pengalaman membaca komik Indonesia yang bersih, cepat, dan enak dilihat — tanpa iklan invasif, dengan kurasi konten berbasis genre dan warna.

---

## 3. Target Users

| Persona | Kebutuhan Utama |
|---------|-----------------|
| **Pembaca casual** (18–30 thn) | Mau baca manga/manhwa populer Sub Indo tanpa gangguan iklan |
| **Otaku/enthusiast** | Cari manga berdasarkan genre, ingin pengalaman visual premium |
| **Mobile-first reader** | Baca di HP saat commute, butuh loading cepat dan UI responsif |

---

## 4. Design System Tokens

> Seluruh UI **wajib** mematuhi token berikut. Detail lengkap di [`DESIGN-figma.md`](./DESIGN-figma.md).

### 4.1 Color Palette

| Role | Token | Hex | Penggunaan |
|------|-------|-----|------------|
| Primary / Ink | `primary` | `#000000` | Teks utama, tombol primary, navbar |
| Canvas | `canvas` | `#ffffff` | Latar belakang default |
| Surface Soft | `surface-soft` | `#f7f7f5` | Latar kartu, ubin ilustrasi |
| Hairline | `hairline` | `#e6e6e6` | Border kartu, input, garis pemisah |
| **Block Lime** | `block-lime` | `#dceeb1` | Panel pencarian, FAQ |
| **Block Lilac** | `block-lilac` | `#c5b0f4` | Hero banner, komik terpopuler |
| **Block Navy** | `block-navy` | `#1f1d3d` | Panel gelap manga action |
| **Block Cream** | `block-cream` | `#f4ecd6` | Rekomendasi genre |
| **Block Coral** | `block-coral` | `#f3c9b6` | Rekomendasi genre |
| **Block Pink** | `block-pink` | `#efd4d4` | Genre romance |
| **Block Mint** | `block-mint` | `#c8e6cd` | Genre sci-fi, mystery |

**Aturan Teks:** Tidak ada teks abu-abu. Hierarki murni via **ketebalan font** (weight), bukan opacity. Teks di atas kanvas terang = `#000000`.

### 4.2 Typography

Font: **Inter** (sans) + **JetBrains Mono** (mono) — substitusi open-source untuk figmaSans/figmaMono.

| Token | Size | Weight | Line-Height | Tracking | Penggunaan |
|-------|------|--------|-------------|----------|------------|
| Display XL | 86px | 340 | 1.00 | -1.72px | Logo, judul hero halaman depan |
| Display LG | 64px | 340 | 1.10 | -0.96px | Judul pembuka section |
| Headline | 26px | 540 | 1.35 | -0.26px | Judul komik di dalam blok warna |
| Card Title | 24px | 700 | 1.45 | 0 | Judul komik pada grid |
| Body | 18px | 320 | 1.45 | -0.26px | Sinopsis, deskripsi |
| Eyebrow | 18px | 400 | 1.30 | +0.54px | Label genre (Mono, ALL-CAPS) |

### 4.3 Shapes & Spacing

| Token | Value | Penggunaan |
|-------|-------|------------|
| `rounded.md` | 8px | Cover manga, frame gambar |
| `rounded.lg` | 24px | Sudut blok warna pastel |
| `rounded.pill` | 50px | Semua tombol teks |
| `rounded.full` | 9999px | Tombol ikon (lingkaran) |
| `spacing.section` | 96px | Jarak vertikal antar section utama |
| `spacing.xxl` | 48px | Padding dalam blok warna |

**Tombol:** Wajib bentuk kapsul (`pill`). Tidak boleh ada tombol kotak bersudut tajam.

---

## 5. Core Features & UI Specifications

### 5.1 Homepage (`/`)

| Komponen | Spesifikasi |
|----------|-------------|
| **Navbar** (`top-nav`) | Tinggi 56px, kanvas putih, teks hitam. Logo kiri + navigasi (Beranda, Cari, Genre, Terbaru) + theme toggle |
| **Marquee Strip** | Pita berjalan 36px, hitam-putih, info update chapter terbaru |
| **Hero Section** | Full-screen dengan WebGL animated hills (GLSLHills), judul "Baca Manga Sub Indo", CTA buttons |
| **Stats Section** | Animated counters (5000+ Manga, 120K+ Chapter, dll) |
| **Features Section** | 4 keunggulan YummyScans dalam grid cards |
| **Manga Terbaru** | Grid 5 kolom (desktop) / 2 kolom (mobile) dengan MangaCard |
| **Genre Showcase** | Grid 6 kolom (desktop) / 3 kolom (mobile) dengan genre icons |
| **FAQ Section** | Accordion FAQ dengan shadcn Accordion |
| **CTA Section** | "Siap Membaca?" dengan tombol CTA |

### 5.2 Detail Manga (`/manga/[mangaId]`)

| Komponen | Spesifikasi |
|----------|-------------|
| **Split Layout** | Kiri: cover 8px rounded. Kanan: judul bold, genre ALL-CAPS mono, sinopsis weight 320 |
| **Info Badges** | Status (Ongoing/Tamat/Hiatus), Type (Manga/Manhwa/Manhua) |
| **Meta Info** | Author, jumlah chapter, chapter terbaru |
| **Genre Pills** | Link ke halaman genre, style pill badges |
| **Sinopsis** | Max 500 karakter dengan ellipsis |
| **Action Buttons** | "Baca Chapter 1" (primary) + "Chapter Terbaru" (secondary) |
| **Chapter List** | Daftar bab dengan zebra stripe, nomor chapter bold, label "Baca" |

### 5.3 Reader (`/manga/[mangaId]/[chapterId]`)

| Komponen | Spesifikasi |
|----------|-------------|
| **Inverse Canvas** | Latar hitam pekat `#000000`, teks putih |
| **No-Distraction** | Navbar disembunyikan total |
| **Image Container** | Max-width 800px, center, lazy loading dari gambar ke-2 |
| **Top Bar** | Sticky: tombol "Kembali" + judul chapter + source badge |
| **Floating Nav** | 3 tombol: Prev, Daftar, Next — kapsul transparan + backdrop-blur |
| **Keyboard Nav** | Arrow keys (← →) untuk navigasi prev/next chapter |
| **Page Counter** | Nomor halaman di bawah setiap gambar |

### 5.4 Search (`/search`)

| Komponen | Spesifikasi |
|----------|-------------|
| **Search Input** | Input pill-shaped dengan ikon cari + tombol "Cari" |
| **Results Grid** | Kartu manga di atas kanvas putih, grid responsif |
| **Empty States** | "Mulai mencari", "Tidak ditemukan", error states |
| **Query Param** | Support `?q=` untuk direct link |

### 5.5 Genre Pages

| Halaman | Spesifikasi |
|---------|-------------|
| **Genre Index** (`/genre`) | Grid genre dengan icon, nama, jumlah komik. Warna berbeda per genre |
| **Genre Detail** (`/genre/[slug]`) | Header genre + manga grid + pagination |

### 5.6 Latest Page (`/latest`)

| Komponen | Spesifikasi |
|----------|-------------|
| **Header** | Icon clock + judul "Terbaru" |
| **Manga Grid** | Grid 5 kolom (desktop) / 2 kolom (mobile) |
| **Pagination** | Tombol "Sebelumnya" / "Selanjutnya" + nomor halaman |

---

## 6. Technical Architecture

### 6.1 Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Astro (SSR mode) |
| Styling | Tailwind CSS + custom design tokens |
| External Data | Local Scraper (mangaku.guru via cheerio) |
| Database | Supabase (PostgreSQL) — untuk admin CRUD |
| Auth | Supabase Auth — untuk admin |
| File Storage | Supabase Storage — untuk admin upload |
| Hosting | Vercel |

### 6.2 Routing

```
src/pages/
├── index.astro                    → Homepage (scraper)
├── search.astro                   → Pencarian (scraper)
├── latest.astro                   → Manga terbaru (scraper)
├── genre/
│   ├── index.astro                → Daftar genre (scraper)
│   └── [slug].astro               → Manga per genre (scraper)
├── manga/
│   └── [mangaId]/
│       ├── index.astro            → Detail manga + daftar chapter (scraper)
│       └── [chapterId].astro      → Reader halaman baca (scraper)
├── api/
│   └── manga/
│       ├── latest.ts              → API: manga terbaru
│       ├── detail.ts              → API: detail manga
│       └── read.ts                → API: halaman chapter
└── admin/
    ├── index.astro                → Dashboard admin
    ├── login.astro                → Halaman login admin
    ├── manga/
    │   ├── index.astro            → Daftar manga (CRUD)
    │   ├── new.astro              → Form tambah manga
    │   └── [mangaId]/
    │       ├── edit.astro         → Form edit manga
    │       └── chapters/
    │           ├── index.astro    → Daftar chapter
    │           ├── new.astro      → Form tambah chapter
    │           └── [chapterId]/
    │               └── edit.astro → Form edit chapter
    └── genres.astro               → Kelola genre
```

### 6.3 Folder Structure

```
yummyscans/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx             → Navigasi responsif dengan mobile menu
│   │   ├── MangaCard.tsx          → Kartu manga dengan hover shimmer
│   │   ├── MarqueeStrip.tsx       → Pita berjalan
│   │   ├── GLSLHills.tsx          → Three.js WebGL hero background
│   │   ├── StatsSection.tsx       → Animated counter stats
│   │   ├── FeaturesSection.tsx    → Feature cards grid
│   │   ├── GenreShowcase.tsx      → Genre tiles untuk homepage
│   │   ├── FAQSection.tsx         → Accordion FAQ
│   │   ├── ThemeToggle.tsx        → Dark/light mode toggle
│   │   ├── Footer.astro           → Footer dengan navigasi dan genre links
│   │   ├── ui/                    → shadcn/ui components
│   │   │   ├── accordion.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── tooltip.tsx
│   │   └── admin/                 → Admin components (placeholder)
│   │       ├── Sidebar.astro
│   │       ├── MangaForm.astro
│   │       ├── ChapterUploader.astro
│   │       └── DataTable.astro
│   ├── layouts/
│   │   ├── EditorialLayout.astro  → Layout utama (navbar + footer + dark mode)
│   │   └── AdminLayout.astro      → Layout admin (placeholder)
│   ├── lib/
│   │   ├── komiku.ts              → Scraper module (cheerio + fetch)
│   │   ├── manga.js               → Supabase manga CRUD
│   │   ├── chapter.js             → Supabase chapter CRUD
│   │   ├── genres.js              → Supabase genre CRUD
│   │   ├── storage.js             → Supabase Storage helpers
│   │   └── utils.ts               → cn() utility (clsx + tailwind-merge)
│   ├── db/
│   │   └── supabase.js            → Supabase client init
│   ├── styles/
│   │   └── global.css             → Design tokens, typography, components
│   └── pages/                     → Routes (lihat 6.2)
├── tailwind.config.ts
├── astro.config.mjs
├── components.json                → shadcn config
├── supabase/
│   └── migrations/                → SQL migrations
└── DESIGN-figma.md
```

---

## 7. Scraper Architecture (mangaku.guru)

### 7.1 Module: `src/lib/komiku.ts`

| Function | Return | Cache | Deskripsi |
|----------|--------|-------|-----------|
| `fetchLatest(page)` | `LatestManga[]` | 5 menit | Manga terbaru dari halaman utama |
| `fetchDetail(slug)` | `MangaDetail` | 5 menit | Detail manga + daftar chapter (sorted ascending) |
| `fetchChapterByUrl(url)` | `ChapterPages` | 5 menit | Halaman chapter (gambar) |
| `fetchSearch(query)` | `SearchResult[]` | 5 menit | Pencarian manga |
| `fetchGenreManga(slug, page)` | `LatestManga[]` | 5 menit | Manga per genre |
| `fetchGenreList()` | `Genre[]` | 5 menit | Daftar genre dari homepage |

### 7.2 Selector Mapping (mangaku.guru)

**Cards** (`.mk-card`):
```
container: a.mk-card[href]
title:     .mk-card__title
cover:     .mk-card__cover img [src|data-src]
type:      .mk-badge--tipe
chapter:   .mk-card__chapter
updated:   .mk-card__time
slug:      extract dari href → /komik/{slug}/
```

**Detail** (`/komik/{slug}/`):
```
title:     h1 (first)
cover:     img (first, filter: manga/komik/upload)
synopsis:  p (>50 chars, exclude Mangaku/Tempat baca/Rilis pertama)
genres:    a[href*="/genre/"] (exclude "Lihat semua")
status:    body text → "tamat"/"completed"/"hiatus"
type:      .mk-badge--tipe
chapters:  a[href*="/chapter-"] → extract slug, sort numerically
```

**Reader** (`/komik/{slug}/chapter-{n}/`):
```
images:    .mk-reader__page img [src|data-src]
fallback:  .mk-reader img[src*="mangaku"]
fallback:  img[src*="upload"], img[src*="img.mangaku"]
title:     h1 (first)
```

**Genre** (`/genre/{slug}/`):
```
cards:     .mk-card (same as latest)
pagination: /genre/{slug}/page/{n}/
```

### 7.3 URL Pattern

| Tipe | Pattern | Contoh |
|------|---------|--------|
| Detail manga | `/komik/{slug}/` | `/komik/ao-no-hako/` |
| Chapter | `/komik/{slug}/chapter-{n}/` | `/komik/ao-no-hako/chapter-245/` |
| Genre | `/genre/{slug}/` | `/genre/action/` |
| Genre page | `/genre/{slug}/page/{n}/` | `/genre/action/page/2/` |
| Search | `/?s={query}` | `/?s=one+piece` |
| Latest | `/manga/` | `/manga/` |
| Latest page | `/manga/page/{n}/` | `/manga/page/2/` |

### 7.4 Caching Strategy

| Data | TTL | Metode |
|------|-----|--------|
| Semua scraper requests | 5 menit | In-memory Map cache (LRU, max 100 entries) |
| API responses | 5 menit - 1 jam | `Cache-Control` header dari Astro SSR |

### 7.5 Error Handling

| Skenario | Penanganan |
|----------|------------|
| Scraper timeout (20s) | Retry 2x dengan exponential backoff (1s, 2s) |
| Scraper gagal total | Tampilkan error state + tombol "Coba Lagi" |
| Gambar gagal load | Tampilkan placeholder + ikon fallback |
| Chapter kosong | Tampilkan "Belum ada chapter" |
| Genre tidak ditemukan | Tampilkan "Genre tidak ditemukan" + link kembali |

---

## 8. Admin Dashboard & Internal Manga Management

> Dashboard admin untuk mengelola manga internal (CRUD) secara mandiri. Saat ini masih dalam tahap placeholder.

### 8.1 Access Control

| Akses | Siapa | Syarat |
|-------|-------|--------|
| `/admin/*` | Admin only | Login via Supabase Auth, role = `admin` |
| Public pages | Semua user | Tidak perlu login |

### 8.2 Admin Dashboard (`/admin`)

| Komponen | Spesifikasi |
|----------|-------------|
| **Sidebar** | Navigasi kiri: Dashboard, Manga, Chapter, Genre. Hitam-putih, monokrom |
| **Stats Cards** | Total manga, total chapter, total genre, storage usage |
| **Recent Activity** | 5 manga/chapter terakhir yang di-edit |
| **Quick Actions** | Tombol pill "Tambah Manga" dan "Tambah Chapter" |

### 8.3 CRUD Manga (`/admin/manga`)

#### List View

| Kolom | Keterangan |
|-------|------------|
| Cover | Thumbnail 48px rounded-md |
| Judul | Teks bold |
| Status | Badge: `Ongoing`, `Completed`, `Hiatus` |
| Genre | Label ALL-CAPS mono |
| Chapter Count | Angka total chapter |
| Aksi | Tombol Edit, Hapus (ikon lingkaran) |

#### Create/Edit Form

| Field | Tipe | Validasi |
|-------|------|----------|
| Judul | text input | Required, max 200 char |
| Cover Image | file upload | Required (create), max 2MB, format: jpg/png/webp |
| Genre | multi-select | Required, min 1 |
| Status | select dropdown | Required: Ongoing / Completed / Hiatus |
| Author | text input | Optional |
| Sinopsis | textarea | Required, max 2000 char |

### 8.4 CRUD Chapter (`/admin/manga/[mangaId]/chapters`)

| Field | Tipe | Validasi |
|-------|------|----------|
| Chapter Number | number input | Required, unik per manga |
| Judul Chapter | text input | Optional |
| Halaman (images) | multi-file upload | Required, min 1 file, max 5MB/file |

### 8.5 Genre Management (`/admin/genres`)

| Aksi | Detail |
|------|--------|
| Tambah | Input pill-shaped + tombol "Tambah" |
| Edit | Inline edit pada nama genre |
| Hapus | Konfirmasi modal, cek apakah masih dipakai manga |

---

## 9. Database Schema (Supabase PostgreSQL)

### 9.1 Entity Relationship

```
genres 1───* manga_genres *───1 manga
manga 1───* chapters 1───* pages
```

### 9.2 Tables

#### `manga`

| Column | Type | Constraint |
|--------|------|------------|
| `id` | uuid | PK, default `gen_random_uuid()` |
| `title` | varchar(200) | NOT NULL |
| `alt_title` | varchar(200) | |
| `slug` | varchar(250) | UNIQUE, NOT NULL |
| `cover_url` | text | NOT NULL |
| `status` | enum | `ongoing`, `completed`, `hiatus` |
| `author` | varchar(100) | |
| `synopsis` | text | NOT NULL |
| `year` | smallint | |
| `language` | varchar(10) | DEFAULT `'id'` |
| `source` | enum | `'internal'`, `'scraper'` |
| `created_at` | timestamptz | DEFAULT `now()` |
| `updated_at` | timestamptz | DEFAULT `now()` |

#### `genres`

| Column | Type | Constraint |
|--------|------|------------|
| `id` | uuid | PK |
| `name` | varchar(50) | UNIQUE, NOT NULL |
| `slug` | varchar(60) | UNIQUE, NOT NULL |

#### `manga_genres` (junction)

| Column | Type | Constraint |
|--------|------|------------|
| `manga_id` | uuid | FK → manga.id, ON DELETE CASCADE |
| `genre_id` | uuid | FK → genres.id, ON DELETE CASCADE |
| | | PK (`manga_id`, `genre_id`) |

#### `chapters`

| Column | Type | Constraint |
|--------|------|------------|
| `id` | uuid | PK |
| `manga_id` | uuid | FK → manga.id, ON DELETE CASCADE |
| `chapter_number` | numeric(6,1) | NOT NULL |
| `title` | varchar(200) | |
| `page_count` | smallint | DEFAULT 0 |
| `created_at` | timestamptz | DEFAULT `now()` |
| | | UNIQUE (`manga_id`, `chapter_number`) |

#### `pages`

| Column | Type | Constraint |
|--------|------|------------|
| `id` | uuid | PK |
| `chapter_id` | uuid | FK → chapters.id, ON DELETE CASCADE |
| `page_number` | smallint | NOT NULL |
| `image_url` | text | NOT NULL |
| `filename` | varchar(255) | |
| | | UNIQUE (`chapter_id`, `page_number`) |

#### `admin_users`

| Column | Type | Constraint |
|--------|------|------------|
| `id` | uuid | PK, FK → auth.users.id |
| `role` | varchar(20) | DEFAULT `'admin'` |
| `created_at` | timestamptz | DEFAULT `now()` |

### 9.3 Row Level Security (RLS)

| Table | Policy |
|-------|--------|
| `manga` | Public read, admin-only write |
| `chapters` | Public read, admin-only write |
| `pages` | Public read, admin-only write |
| `genres` | Public read, admin-only write |
| `admin_users` | Admin-only read |

---

## 10. Auth & User Management

### 10.1 Supabase Auth Setup

| Config | Value |
|--------|-------|
| Provider | Email + Password |
| Email Confirmation | Disabled (admin self-managed) |
| Session Duration | 7 hari |
| Refresh Token | Aktif |

### 10.2 Admin Registration

Di MVP, akun admin dibuat manual via Supabase Dashboard:
1. Buat user di Supabase Auth → Authentication → Users → Invite
2. Insert row ke tabel `admin_users` dengan `id` yang sama
3. Login di `/admin/login`

### 10.3 Auth Flow

```
/admin/login
  → Form email + password
  → supabase.auth.signInWithPassword()
  → Success: redirect /admin
  → Failed: tampilkan error message

Middleware auth.ts:
  → Cek supabase.auth.getSession()
  → Cek apakah user.id ada di admin_users table
  → Tidak valid: redirect /admin/login
  → Valid: lanjut render halaman
```

---

## 11. Data Flow: Single Source (Scraper)

Sistem sekarang menggunakan **satu sumber data**:

| Sumber | Fetch Via | Cover Art |
|--------|-----------|-----------|
| Local Scraper | `komiku.ts` → cheerio scraping | URL langsung dari mangaku.guru |

**Routing Logic:**
- Semua halaman publik menggunakan `komiku.ts` untuk fetch data
- Tidak ada deteksi UUID/slug lagi — semua slug-based
- Reader fetch chapter list untuk navigasi prev/next

**Data Flow:**
```
Home:     fetchLatest(1) → MangaCard grid
Detail:   fetchDetail(slug) → Manga info + chapter list (sorted)
Reader:   fetchChapterByUrl(url) + fetchDetail(slug) → pages + prev/next
Search:   fetchSearch(query) → Search results
Genre:    fetchGenreList() → Genre list
          fetchGenreManga(slug, page) → Manga per genre
Latest:   fetchLatest(page) → Latest manga + pagination
```

---

## 12. Development Milestones

| Tahap | Scope | Deliverables |
|-------|-------|--------------|
| **1. Foundation** | Konfigurasi & setup | Tailwind config, Astro SSR, global.css, Supabase setup |
| **2. Database & Auth** | Schema & auth | SQL migrations, RLS policies, admin login flow |
| **3. Storage** | File upload | Supabase Storage buckets, upload helpers |
| **4. Admin Dashboard** | CRUD admin | AdminLayout, Sidebar, MangaForm, ChapterUploader |
| **5. Scraper** | Scraper mangaku.guru | `komiku.ts`, API endpoints, caching |
| **6. UI Components** | Komponen publik | Navbar, MangaCard, MarqueeStrip, blok warna pastel |
| **7. Pages** | Halaman lengkap | Homepage, detail, reader, search, genre, latest |
| **8. Polish & Deploy** | Optimasi | Lazy loading, caching, responsive, deploy Vercel |

---

## 13. Progress Tracker

> Tracking pengerjaan per tanggal. Update setiap selesai satu task.

### Status Legend

| Simbol | Arti |
|--------|------|
| ✅ | Selesai |
| 🔧 | Sedang dikerjakan |
| ⏳ | Belum mulai |
| ❌ | Dibatalkan / Skip |

### Tahap 1: Foundation

| Task | Status | Catatan |
|------|--------|---------|
| Setup React + @astrojs/react + shadcn | ✅ | shadcn + React integration |
| Install shadcn components | ✅ | button, card, badge, input, table, separator, skeleton, accordion, avatar, tabs, tooltip |
| global.css | ✅ | Inter + JetBrains Mono, Tailwind layers |
| tailwind.config.ts | ✅ | Merge shadcn + Figma tokens |
| EditorialLayout.astro | ✅ | Navbar + Footer + dark mode |
| Navbar.tsx | ✅ | Responsif dengan mobile menu + theme toggle |
| Footer.astro | ✅ | Navigasi + genre links |

### Tahap 2: Data Layer

| Task | Status | Catatan |
|------|--------|---------|
| SQL migration (6 tabel + RLS + indexes) ✅ | manga, genres, manga_genres, chapters, pages, admin_users |
| Supabase client | ✅ | src/db/supabase.js |
| manga.js (CRUD) | ✅ | |
| chapter.js (CRUD) | ✅ | |
| genres.js (CRUD) | ✅ | |
| storage.js (upload) | ✅ | |

### Tahap 3: Landing Page

| Task | Status | Catatan |
|------|--------|---------|
| MangaCard.tsx | ✅ | Hover shimmer, cover fallback, genre tags |
| MarqueeStrip.tsx | ✅ | CSS animation marquee |
| GLSLHills.tsx | ✅ | Three.js WebGL animated hills |
| StatsSection.tsx | ✅ | Animated counters |
| FeaturesSection.tsx | ✅ | 4 feature cards |
| GenreShowcase.tsx | ✅ | 12 genre dengan icon lucide |
| FAQSection.tsx | ✅ | shadcn Accordion |
| Homepage | ✅ | Semua sections + scraper data |

### Tahap 4: Admin Dashboard

| Task | Status | Catatan |
|------|--------|---------|
| AdminLayout.astro | ⏳ | Placeholder HTML |
| Sidebar.tsx | ⏳ | Component ada, belum diintegrasikan |
| Login page + auth middleware | ⏳ | Placeholder HTML |
| Manga list (CRUD) | ⏳ | Placeholder HTML |
| MangaForm.tsx | ⏳ | |
| Chapter list + uploader | ⏳ | |
| Genre management | ⏳ | |

### Tahap 5: Scraper

| Task | Status | Catatan |
|------|--------|---------|
| komiku.ts — fetchLatest | ✅ | Cache 5 menit, slug dari href |
| komiku.ts — fetchDetail | ✅ | URL /komik/, sorted chapters, genre extraction |
| komiku.ts — fetchChapterByUrl | ✅ | data-src support, dedup pages |
| komiku.ts — fetchSearch | ✅ | Cache 5 menit |
| komiku.ts — fetchGenreManga | ✅ | Pagination support |
| komiku.ts — fetchGenreList | ✅ | Extract dari homepage |
| API: /api/manga/latest | ✅ | |
| API: /api/manga/detail | ✅ | |
| API: /api/manga/read | ✅ | URL pattern /komik/ |
| Retry logic | ✅ | 2 retry, exponential backoff |
| In-memory cache | ✅ | LRU, max 100 entries |

### Tahap 6: Public Pages

| Task | Status | Catatan |
|------|--------|---------|
| Detail manga page | ✅ | Split layout, cover, genres, chapter list, action buttons |
| Reader page | ✅ | Prev/Next/Daftar navigation, keyboard nav, SVG icons |
| Search page | ✅ | Search input, results grid, empty states |
| Genre index page | ✅ | Genre grid dengan icon dan count |
| Genre detail page | ✅ | Manga grid + pagination |
| Latest page | ✅ | Manga grid + pagination |

### Tahap 7: Polish & Deploy

| Task | Status | Catatan |
|------|--------|---------|
| Lazy loading gambar | ✅ | Reader page: loading="lazy" dari frame ke-2 |
| Dark mode | ✅ | CSS class toggling, localStorage, prefers-color-scheme |
| Responsive design | ✅ | Mobile-first, semua halaman responsif |
| SEO meta tags | 🔧 | Basic title ada, description per halaman |
| Deploy ke Vercel | ⏳ | Config vercel ada, belum deploy |

---

## 14. Non-Functional Requirements

| Aspek | Target |
|-------|--------|
| **Performance** | LCP < 2.5s pada koneksi 4G, gambar lazy load dari frame ke-2 |
| **SEO** | Meta tags dinamis per halaman (judul, deskripsi) |
| **Accessibility** | Kontras teks minimal WCAG AA, navigasi keyboard pada reader, alt text pada cover manga |
| **Mobile** | Semua elemen tap target minimal 44px, blok warna full-bleed tanpa radius < 768px |
| **Browser** | Chrome, Firefox, Safari, Edge (versi terbaru 2) |
| **Security** | RLS aktif di semua tabel, admin route di-guard middleware |
| **Caching** | In-memory cache (5 menit TTL, max 100 entries), Cache-Control headers |

---

## 15. Edge Cases

| Skenario | Penanganan |
|----------|------------|
| Manga baru, belum ada chapter | Tampilkan "Belum ada chapter" di halaman detail |
| Cover art tidak tersedia | Placeholder dengan warna `surface-soft` + ikon BookOpen |
| Pencarian tanpa hasil | Empty state dengan pesan "Tidak ditemukan" |
| Scraper timeout | Retry 2x, lalu tampilkan error state |
| Scraper gagal total | Error state + tombol "Coba Lagi" |
| Chapter kosong / tidak ditemukan | Redirect ke halaman detail manga + notifikasi |
| Koneksi lambat di mobile | Progressive image loading (lazy load) |
| Slug manga tidak konsisten | Extract slug dari href (bukan generate dari judul) |
| Genre tidak ditemukan | Tampilkan "Genre tidak ditemukan" + link kembali |

---

## 16. Environment Variables

```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=eyJxxxx
API_KOMIKU_URL=https://mangaku.guru
```

> `API_KOMIKU_URL` adalah base URL untuk scraper. Default fallback: `https://mangaku.guru`.

---

## 17. Open Questions

| # | Pertanyaan | Status |
|---|-----------|--------|
| 1 | Apakah perlu fitur bookmark/favorit di MVP? | Belum diputuskan |
| 2 | Apakah perlu fitur riwayat baca (reading history)? | Belum diputuskan |
| 3 | Apakah dark mode reader perlu toggle atau default hitam? | Default hitam (sesuai desain) |
| 4 | Apakah perlu SSR penuh atau hybrid (SSG + SSR)? | SSR penuh (data dinamis) |
| 5 | Berapa akun admin di MVP? | 1 akun (self-managed) |
| 6 | Apakah perlu multi-admin dengan role berbeda? | Post-MVP |
| 7 | Apakah perlu bulk upload chapter (ZIP)? | Post-MVP |
| 8 | Apakah perlu fitur komentar per chapter? | Post-MVP |
| 9 | Apakah perlu notifikasi update chapter baru? | Post-MVP |
