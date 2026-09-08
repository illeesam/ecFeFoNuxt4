-- -----------------------------------------------------------------------------
-- syUserType → sy_user (로그인 계정, LoginForm.vue 이메일·비밀번호)
-- mb_member 선행 생성 필요 (member_id FK)
-- -----------------------------------------------------------------------------
-- DROP TABLE IF EXISTS db2603ec.sy_user;
CREATE TABLE IF NOT EXISTS db2603ec.sy_user (
  user_id       SERIAL PRIMARY KEY,
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  member_id     INTEGER,
  created_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_sy_user_email UNIQUE (email),
  CONSTRAINT fk_sy_user_member FOREIGN KEY (member_id) REFERENCES db2603ec.mb_member(member_id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS sy_user_member_id_idx ON db2603ec.sy_user (member_id);
COMMENT ON TABLE db2603ec.sy_user IS '로그인 사용자 (이메일·비밀번호)';
COMMENT ON COLUMN db2603ec.sy_user.user_id IS '사용자ID';
COMMENT ON COLUMN db2603ec.sy_user.email IS '이메일';
COMMENT ON COLUMN db2603ec.sy_user.password_hash IS '비밀번호 해시 (bcrypt 등)';
COMMENT ON COLUMN db2603ec.sy_user.member_id IS '회원ID (mb_member 연동)';
COMMENT ON COLUMN db2603ec.sy_user.created_at IS '생성일시';
