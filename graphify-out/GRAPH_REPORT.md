# Graph Report - C:\Users\ikhsa\Documents\experiment\YummyScans  (2026-07-22)

## Corpus Check
- Corpus is ~25,882 words - fits in a single context window. You may not need a graph.

## Summary
- 364 nodes · 609 edges · 27 communities (21 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Admin CMS & Supabase
- Public Pages & Komiku
- Package Dependencies
- UI Components Library
- User Favorites History
- Auth Middleware
- Theme Toggle
- Genre Showcase
- Library Page
- FAQ Section
- Features Section
- Stats Section
- Marquee Strip
- Floating Nav
- Chapter Uploader
- Admin DataTable
- Continue Reading
- Search Explorer

## God Nodes (most connected - your core abstractions)
1. `useFavorites()` - 14 edges
2. `cn()` - 14 edges
3. `fetchHTML()` - 12 edges
4. `useHistory()` - 11 edges
5. `../layouts/EditorialLayout.astro` - 11 edges
6. `../../../layouts/AdminLayout.astro` - 9 edges
7. `Library()` - 8 edges
8. `getAdminClient()` - 8 edges
9. `scripts` - 7 edges
10. `supabase` - 7 edges

## Surprising Connections (you probably didn't know these)
- `FavHeart()` --calls--> `useFavorites()`  [EXTRACTED]
  src/components/UpdateSection.tsx → src/hooks/useFavorites.ts
- `ContinueReading()` --calls--> `useHistory()`  [EXTRACTED]
  src/components/ContinueReading.tsx → src/hooks/useHistory.ts
- `FavoriteButton()` --calls--> `useFavorites()`  [EXTRACTED]
  src/components/FavoriteButton.tsx → src/hooks/useFavorites.ts
- `MangaCard()` --calls--> `useFavorites()`  [EXTRACTED]
  src/components/MangaCard.tsx → src/hooks/useFavorites.ts
- `Skeleton()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/skeleton.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (27 total, 6 thin omitted)

### Community 0 - "Admin CMS & Supabase"
Cohesion: 0.08
Nodes (41): ../../../db/supabase, ../../../../../lib/chapter, ../../../lib/genres, ../lib/manga, ../../../lib/storage, ../../../lib/supabase-server, ../../../components/admin/MangaForm.astro, ../components/admin/Sidebar.astro (+33 more)

### Community 1 - "Public Pages & Komiku"
Cohesion: 0.06
Nodes (42): ../../../components/ContinueReading, ../../../components/FavoriteButton, ../components/Hero, ../../../components/MangaCard, ../components/Navbar, ../components/Rekomendasi, ../components/SearchExplorer, ../../../components/ui/badge (+34 more)

### Community 2 - "Package Dependencies"
Cohesion: 0.04
Nodes (47): astro, @astrojs/react, @astrojs/tailwind, @astrojs/vercel, cheerio, class-variance-authority, clsx, framer-motion (+39 more)

### Community 3 - "UI Components Library"
Cohesion: 0.06
Nodes (32): faqs, AccordionContent, AccordionItem, AccordionTrigger, Avatar, AvatarFallback, AvatarImage, Badge() (+24 more)

### Community 4 - "User Favorites History"
Cohesion: 0.13
Nodes (28): ../components/Library, ContinueReading(), ContinueReadingProps, FavoriteButton(), FavoriteButtonProps, FavoritesList(), FavoritesListProps, HistoryItem (+20 more)

### Community 5 - "Auth Middleware"
Cohesion: 0.16
Nodes (14): FLAG, isNew(), MangaCard(), MangaCardProps, parseDuration(), Tab, FavHeart(), FLAG (+6 more)

### Community 6 - "Theme Toggle"
Cohesion: 0.12
Nodes (15): aliases, components, hooks, lib, ui, utils, rsc, $schema (+7 more)

### Community 7 - "Genre Showcase"
Cohesion: 0.19
Nodes (12): Card(), chapterNum(), fakeViews(), FLAG, FORMATS, GENRES, isNew(), ListRow() (+4 more)

### Community 8 - "Library Page"
Cohesion: 0.18
Nodes (10): name, scripts, build, design:export-css, design:export-tailwind, design:lint, dev, preview (+2 more)

### Community 9 - "FAQ Section"
Cohesion: 0.24
Nodes (6): NAV_LINKS, QUICK_GENRES, ThemeToggle(), Button, ButtonProps, buttonVariants

### Community 10 - "Features Section"
Cohesion: 0.29
Nodes (4): Announcement, announcements, Slide, slides

### Community 11 - "Stats Section"
Cohesion: 0.33
Nodes (5): astro/tsconfigs/strict, compilerOptions, baseUrl, paths, extends

## Knowledge Gaps
- **120 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+115 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `UI Components Library` to `FAQ Section`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `../layouts/EditorialLayout.astro` connect `Public Pages & Komiku` to `FAQ Section`, `User Favorites History`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `Badge()` connect `UI Components Library` to `Public Pages & Komiku`, `Auth Middleware`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _120 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Admin CMS & Supabase` be split into smaller, more focused modules?**
  _Cohesion score 0.08090117767537122 - nodes in this community are weakly interconnected._
- **Should `Public Pages & Komiku` be split into smaller, more focused modules?**
  _Cohesion score 0.06370543541788427 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._