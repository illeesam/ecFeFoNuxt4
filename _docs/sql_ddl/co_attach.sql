-- -----------------------------------------------------------------------------
-- 공통 첨부파일 (리뷰·블로그·문의 등)
-- -----------------------------------------------------------------------------
-- DROP TABLE IF EXISTS db2603ec.co_attach;
CREATE TABLE IF NOT EXISTS db2603ec.co_attach (
  attach_id   SERIAL PRIMARY KEY,
  ref_type    VARCHAR(50) NOT NULL,
  ref_id      INTEGER NOT NULL,
  physical_nm VARCHAR(255) NOT NULL,
  file_nm     VARCHAR(500),
  ext         VARCHAR(20) NOT NULL,
  file_size   INTEGER,
  mime_type   VARCHAR(100),
  url         VARCHAR(500) NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_co_attach_ref_type CHECK (ref_type IN ('review', 'blog', 'inquiry', 'etc'))
);
CREATE INDEX IF NOT EXISTS co_attach_ref_idx ON db2603ec.co_attach (ref_type, ref_id);
COMMENT ON TABLE db2603ec.co_attach IS '공통 첨부파일';
COMMENT ON COLUMN db2603ec.co_attach.attach_id IS '첨부ID';
COMMENT ON COLUMN db2603ec.co_attach.ref_type IS '참조 구분 (review, blog, inquiry, etc)';
COMMENT ON COLUMN db2603ec.co_attach.ref_id IS '참조 ID (예: product_review_id, blog_id)';
COMMENT ON COLUMN db2603ec.co_attach.physical_nm IS '물리명 (저장 파일명)';
COMMENT ON COLUMN db2603ec.co_attach.file_nm IS '파일명 (원본 파일명)';
COMMENT ON COLUMN db2603ec.co_attach.ext IS '확장자';
COMMENT ON COLUMN db2603ec.co_attach.file_size IS '파일 크기(바이트)';
COMMENT ON COLUMN db2603ec.co_attach.mime_type IS 'MIME 타입';
COMMENT ON COLUMN db2603ec.co_attach.url IS '접근 URL';
COMMENT ON COLUMN db2603ec.co_attach.sort_order IS '정렬 순서';
COMMENT ON COLUMN db2603ec.co_attach.created_at IS '등록일시';
