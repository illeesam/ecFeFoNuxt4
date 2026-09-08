
-- -----------------------------------------------------------------------------
-- pdOptionType → pd_option
-- -----------------------------------------------------------------------------
-- DROP TABLE IF EXISTS db2603ec.pd_option;
CREATE TABLE IF NOT EXISTS db2603ec.pd_option (
  option_id    SERIAL PRIMARY KEY,
  option_code  VARCHAR(50),
  option_name  VARCHAR(100) NOT NULL,
  option_type  VARCHAR(20) NOT NULL,
  option_level INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS pd_option_type_idx ON db2603ec.pd_option (option_type);
COMMENT ON TABLE db2603ec.pd_option IS '옵션 (색상/사이즈 등)';
COMMENT ON COLUMN db2603ec.pd_option.option_id IS '옵션ID';
COMMENT ON COLUMN db2603ec.pd_option.option_code IS '옵션코드 (필터/연동용)';
COMMENT ON COLUMN db2603ec.pd_option.option_name IS '옵션명';
COMMENT ON COLUMN db2603ec.pd_option.option_type IS '옵션 유형 (색상/사이즈 등)';
COMMENT ON COLUMN db2603ec.pd_option.option_level IS '옵션 레벨';