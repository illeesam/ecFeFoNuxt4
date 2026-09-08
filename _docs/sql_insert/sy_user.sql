-- 데모 로그인 계정 99명 (비밀번호: 123456)
-- 전제: CREATE EXTENSION IF NOT EXISTS pgcrypto; 및 mb_member INSERT 선행 실행
-- 실행 순서: 1) _docs/sql_ddl/mb_member.sql  2) _docs/sql_ddl/sy_user.sql
--            3) _docs/sql_insert/mb_member.sql  4) 본 파일
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO db2603ec.sy_user (email, password_hash, member_id)
SELECT
  m.email,
  crypt('123456', gen_salt('bf')),
  m.member_id
FROM db2603ec.mb_member m
WHERE m.email ~ '^demo([1-9]|[1-9][0-9])@mail\.com$';
