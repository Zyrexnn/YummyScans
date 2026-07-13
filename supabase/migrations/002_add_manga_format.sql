-- =============================================
-- 2.1 Add format column to manga table
-- =============================================
ALTER TABLE manga
  ADD COLUMN format VARCHAR(10)
  DEFAULT 'manga'
  CHECK (format IN ('manga', 'manhwa', 'manhua'));

COMMENT ON COLUMN manga.format IS 'Comic origin format: manga (JP), manhwa (KR), manhua (CN)';
