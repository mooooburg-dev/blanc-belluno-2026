-- ============================================
-- Blanc Belluno - 히어로 슬라이드 테이블
-- ============================================

CREATE TABLE belluno_hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  object_position TEXT NOT NULL DEFAULT 'center center',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_belluno_hero_slides_sort_order ON belluno_hero_slides (sort_order);

-- RLS
ALTER TABLE belluno_hero_slides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on belluno_hero_slides"
  ON belluno_hero_slides FOR SELECT
  USING (true);

CREATE POLICY "Allow service write on belluno_hero_slides"
  ON belluno_hero_slides FOR ALL
  USING (auth.role() = 'service_role');
