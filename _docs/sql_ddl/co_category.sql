
-- -----------------------------------------------------------------------------
-- coCategoryType → co_category
-- -----------------------------------------------------------------------------
-- DROP TABLE IF EXISTS db2603ec.co_category;
CREATE TABLE IF NOT EXISTS db2603ec.co_category (
  category_id     SERIAL PRIMARY KEY,
  category_code   VARCHAR(50),
  category_name   VARCHAR(100) NOT NULL,
  category_level  INTEGER NOT NULL DEFAULT 1,
  parent_category VARCHAR(50)
);
CREATE UNIQUE INDEX IF NOT EXISTS co_category_category_code_key ON db2603ec.co_category (category_code) WHERE category_code IS NOT NULL;
COMMENT ON TABLE db2603ec.co_category IS '카테고리';
COMMENT ON COLUMN db2603ec.co_category.category_id IS '카테고리ID';
COMMENT ON COLUMN db2603ec.co_category.category_code IS '카테고리코드 (필터/연동용)';
COMMENT ON COLUMN db2603ec.co_category.category_name IS '카테고리명';
COMMENT ON COLUMN db2603ec.co_category.category_level IS '카테고리 레벨';
COMMENT ON COLUMN db2603ec.co_category.parent_category IS '부모 카테고리 코드';