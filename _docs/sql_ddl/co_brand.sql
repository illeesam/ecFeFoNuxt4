
-- -----------------------------------------------------------------------------
-- coBrandType → co_brand
-- -----------------------------------------------------------------------------
-- DROP TABLE IF EXISTS db2603ec.co_brand;
CREATE TABLE IF NOT EXISTS db2603ec.co_brand (
  brand_id   SERIAL PRIMARY KEY,
  brand_code VARCHAR(50),
  brand_name VARCHAR(100) NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS co_brand_brand_code_key ON db2603ec.co_brand (brand_code) WHERE brand_code IS NOT NULL;
COMMENT ON TABLE db2603ec.co_brand IS '브랜드';
COMMENT ON COLUMN db2603ec.co_brand.brand_id IS '브랜드ID';
COMMENT ON COLUMN db2603ec.co_brand.brand_code IS '브랜드코드 (필터/연동용)';
COMMENT ON COLUMN db2603ec.co_brand.brand_name IS '브랜드명';
