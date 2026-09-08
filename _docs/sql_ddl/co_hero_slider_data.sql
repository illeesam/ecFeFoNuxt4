
-- -----------------------------------------------------------------------------
-- coHeroSliderDataType / Two / Three → co_hero_slider_data
-- -----------------------------------------------------------------------------
-- DROP TABLE IF EXISTS db2603ec.co_hero_slider_data;
CREATE TABLE IF NOT EXISTS db2603ec.co_hero_slider_data (
  hero_slider_id SERIAL PRIMARY KEY,
  variant        VARCHAR(10) NOT NULL DEFAULT 'default' CHECK (variant IN ('default','two','three')),
  bg_img         VARCHAR(500) NOT NULL,
  title          VARCHAR(255) NOT NULL,
  subtile        VARCHAR(255),
  subtitle       VARCHAR(255),
  sm_title       VARCHAR(100),
  is_dark        BOOLEAN DEFAULT FALSE,
  meta           BOOLEAN DEFAULT FALSE,
  sort_order     INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS co_hero_slider_data_variant_idx ON db2603ec.co_hero_slider_data (variant);
COMMENT ON TABLE db2603ec.co_hero_slider_data IS '히어로 슬라이더 (default/two/three variant)';
COMMENT ON COLUMN db2603ec.co_hero_slider_data.hero_slider_id IS '히어로 슬라이더ID';
COMMENT ON COLUMN db2603ec.co_hero_slider_data.variant IS 'variant (default|two|three)';
COMMENT ON COLUMN db2603ec.co_hero_slider_data.bg_img IS '배경 이미지';
COMMENT ON COLUMN db2603ec.co_hero_slider_data.title IS '제목';
COMMENT ON COLUMN db2603ec.co_hero_slider_data.subtile IS '부제목';
COMMENT ON COLUMN db2603ec.co_hero_slider_data.subtitle IS '부제목2';
COMMENT ON COLUMN db2603ec.co_hero_slider_data.sm_title IS '소제목';
COMMENT ON COLUMN db2603ec.co_hero_slider_data.is_dark IS '다크 모드 여부';
COMMENT ON COLUMN db2603ec.co_hero_slider_data.meta IS '메타 표시 여부';
