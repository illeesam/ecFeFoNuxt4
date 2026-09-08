
-- -----------------------------------------------------------------------------
-- syCodeType → sy_code
-- -----------------------------------------------------------------------------
-- DROP TABLE IF EXISTS db2603ec.sy_code;
CREATE TABLE IF NOT EXISTS db2603ec.sy_code (
  code_id  SERIAL PRIMARY KEY,
  grp_code VARCHAR(20) NOT NULL,
  value    VARCHAR(50) NOT NULL,
  label    VARCHAR(100) NOT NULL
);
CREATE INDEX IF NOT EXISTS sy_code_grp_code_idx ON db2603ec.sy_code (grp_code);
COMMENT ON TABLE db2603ec.sy_code IS '공통코드';
COMMENT ON COLUMN db2603ec.sy_code.code_id IS '코드ID';
COMMENT ON COLUMN db2603ec.sy_code.grp_code IS '그룹코드';
COMMENT ON COLUMN db2603ec.sy_code.value IS '코드값';
COMMENT ON COLUMN db2603ec.sy_code.label IS '표시명';