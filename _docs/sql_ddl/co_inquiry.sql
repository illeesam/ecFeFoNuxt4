
-- -----------------------------------------------------------------------------
-- coInquiryType → co_inquiry
-- -----------------------------------------------------------------------------
-- DROP TABLE IF EXISTS db2603ec.co_inquiry;
CREATE TABLE IF NOT EXISTS db2603ec.co_inquiry (
  inquiry_id SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  subject    VARCHAR(255) NOT NULL,
  msg        TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
COMMENT ON TABLE db2603ec.co_inquiry IS '문의하기 폼/데이터';
COMMENT ON COLUMN db2603ec.co_inquiry.inquiry_id IS '문의ID';
COMMENT ON COLUMN db2603ec.co_inquiry.name IS '이름';
COMMENT ON COLUMN db2603ec.co_inquiry.email IS '이메일';
COMMENT ON COLUMN db2603ec.co_inquiry.subject IS '제목';
COMMENT ON COLUMN db2603ec.co_inquiry.msg IS '내용';
