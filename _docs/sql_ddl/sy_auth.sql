
-- -----------------------------------------------------------------------------
-- syAuthType → sy_auth
-- -----------------------------------------------------------------------------
-- DROP TABLE IF EXISTS db2603ec.sy_auth;
CREATE TABLE IF NOT EXISTS db2603ec.sy_auth (
  auth_info_id  SERIAL PRIMARY KEY,
  user_id       VARCHAR(100) NOT NULL,
  access_token  TEXT,
  refresh_token TEXT,
  expires_at    BIGINT,
  created_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS sy_auth_user_id_idx ON db2603ec.sy_auth (user_id);
COMMENT ON TABLE db2603ec.sy_auth IS '인증 정보 (토큰·만료 등)';
COMMENT ON COLUMN db2603ec.sy_auth.auth_info_id IS '인증정보ID';
COMMENT ON COLUMN db2603ec.sy_auth.user_id IS '사용자ID';
COMMENT ON COLUMN db2603ec.sy_auth.access_token IS '액세스 토큰';
COMMENT ON COLUMN db2603ec.sy_auth.refresh_token IS '리프레시 토큰';
COMMENT ON COLUMN db2603ec.sy_auth.expires_at IS '만료 시각';
