-- -----------------------------------------------------------------------------
-- mbMemberType -> mb_member (회원 프로필)
-- LoginForm.vue: 이메일·비밀번호 로그인 -> sy_user 사용, 회원 정보는 mb_member
-- -----------------------------------------------------------------------------
-- DROP TABLE IF EXISTS db2603ec.mb_member;
CREATE TABLE IF NOT EXISTS db2603ec.mb_member (
  member_id  SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  password      VARCHAR(255) NOT NULL,
  phone      VARCHAR(50),
  address    TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS mb_member_email_key ON db2603ec.mb_member (email);
COMMENT ON TABLE db2603ec.mb_member IS '회원(멤버) 정보';
COMMENT ON COLUMN db2603ec.mb_member.member_id IS '회원ID';
COMMENT ON COLUMN db2603ec.mb_member.name IS '이름';
COMMENT ON COLUMN db2603ec.mb_member.email IS '이메일';
COMMENT ON COLUMN db2603ec.mb_member.password IS 'password';
COMMENT ON COLUMN db2603ec.mb_member.phone IS '연락처';
COMMENT ON COLUMN db2603ec.mb_member.address IS '주소';
COMMENT ON COLUMN db2603ec.mb_member.created_at IS '생성일시';
COMMENT ON COLUMN db2603ec.mb_member.updated_at IS '수정일시';
