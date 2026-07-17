-- =============================================
-- YummyScans Database Schema
-- Supabase PostgreSQL Migration
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. GENRES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS genres (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(60) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. MANGA TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS manga (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  alt_title VARCHAR(200),
  slug VARCHAR(250) UNIQUE NOT NULL,
  cover_url TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed', 'hiatus')),
  author VARCHAR(100),
  artist VARCHAR(100),
  synopsis TEXT NOT NULL,
  year SMALLINT,
  language VARCHAR(10) DEFAULT 'id',
  source VARCHAR(20) DEFAULT 'internal' CHECK (source IN ('internal', 'mangadex')),
  mangadex_id VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. MANGA_GENRES JUNCTION TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS manga_genres (
  manga_id UUID NOT NULL REFERENCES manga(id) ON DELETE CASCADE,
  genre_id UUID NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (manga_id, genre_id)
);

-- =============================================
-- 4. CHAPTERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manga_id UUID NOT NULL REFERENCES manga(id) ON DELETE CASCADE,
  chapter_number NUMERIC(6,1) NOT NULL,
  title VARCHAR(200),
  page_count SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (manga_id, chapter_number)
);

-- =============================================
-- 5. PAGES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  page_number SMALLINT NOT NULL,
  image_url TEXT NOT NULL,
  filename VARCHAR(255),
  UNIQUE (chapter_id, page_number)
);

-- =============================================
-- 6. ADMIN_USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_manga_slug ON manga(slug);
CREATE INDEX IF NOT EXISTS idx_manga_status ON manga(status);
CREATE INDEX IF NOT EXISTS idx_manga_source ON manga(source);
CREATE INDEX IF NOT EXISTS idx_manga_created ON manga(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chapters_manga ON chapters(manga_id, chapter_number);
CREATE INDEX IF NOT EXISTS idx_pages_chapter ON pages(chapter_id, page_number);
CREATE INDEX IF NOT EXISTS idx_manga_genres_genre ON manga_genres(genre_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE manga ENABLE ROW LEVEL SECURITY;
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE manga_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access for manga, genres, chapters, pages
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read manga') THEN
    CREATE POLICY "Public read manga" ON manga FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read genres') THEN
    CREATE POLICY "Public read genres" ON genres FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read manga_genres') THEN
    CREATE POLICY "Public read manga_genres" ON manga_genres FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read chapters') THEN
    CREATE POLICY "Public read chapters" ON chapters FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read pages') THEN
    CREATE POLICY "Public read pages" ON pages FOR SELECT USING (true);
  END IF;
END $$;

-- Admin-only write access
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin insert manga') THEN
    CREATE POLICY "Admin insert manga" ON manga FOR INSERT
      WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin update manga') THEN
    CREATE POLICY "Admin update manga" ON manga FOR UPDATE
      USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin delete manga') THEN
    CREATE POLICY "Admin delete manga" ON manga FOR DELETE
      USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin insert genres') THEN
    CREATE POLICY "Admin insert genres" ON genres FOR INSERT
      WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin update genres') THEN
    CREATE POLICY "Admin update genres" ON genres FOR UPDATE
      USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin delete genres') THEN
    CREATE POLICY "Admin delete genres" ON genres FOR DELETE
      USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin insert manga_genres') THEN
    CREATE POLICY "Admin insert manga_genres" ON manga_genres FOR INSERT
      WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin delete manga_genres') THEN
    CREATE POLICY "Admin delete manga_genres" ON manga_genres FOR DELETE
      USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin insert chapters') THEN
    CREATE POLICY "Admin insert chapters" ON chapters FOR INSERT
      WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin update chapters') THEN
    CREATE POLICY "Admin update chapters" ON chapters FOR UPDATE
      USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin delete chapters') THEN
    CREATE POLICY "Admin delete chapters" ON chapters FOR DELETE
      USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin insert pages') THEN
    CREATE POLICY "Admin insert pages" ON pages FOR INSERT
      WITH CHECK (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin update pages') THEN
    CREATE POLICY "Admin update pages" ON pages FOR UPDATE
      USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin delete pages') THEN
    CREATE POLICY "Admin delete pages" ON pages FOR DELETE
      USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
  END IF;
END $$;

-- Admin users table - admin only
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin read admin_users') THEN
    CREATE POLICY "Admin read admin_users" ON admin_users FOR SELECT
      USING (id = auth.uid());
  END IF;
END $$;

-- =============================================
-- TRIGGER: Auto-update updated_at on manga
-- =============================================
CREATE OR REPLACE FUNCTION update_manga_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_manga_updated_at') THEN
    CREATE TRIGGER trigger_manga_updated_at
      BEFORE UPDATE ON manga
      FOR EACH ROW
      EXECUTE FUNCTION update_manga_updated_at();
  END IF;
END $$;

-- =============================================
-- SEED DATA: Default genres
-- =============================================
INSERT INTO genres (name, slug) VALUES
  ('Action', 'action'),
  ('Adventure', 'adventure'),
  ('Comedy', 'comedy'),
  ('Drama', 'drama'),
  ('Fantasy', 'fantasy'),
  ('Horror', 'horror'),
  ('Mystery', 'mystery'),
  ('Romance', 'romance'),
  ('Sci-Fi', 'sci-fi'),
  ('Slice of Life', 'slice-of-life'),
  ('Sports', 'sports'),
  ('Supernatural', 'supernatural'),
  ('Thriller', 'thriller')
ON CONFLICT (slug) DO NOTHING;
