-- -----------------------------------------------------------------------------
-- coBlogType → co_blog
-- -----------------------------------------------------------------------------
-- DROP TABLE IF EXISTS db2603ec.co_blog;
CREATE TABLE IF NOT EXISTS db2603ec.co_blog (
  blog_id    SERIAL PRIMARY KEY,
  img        VARCHAR(500) NOT NULL,
  title      VARCHAR(255) NOT NULL,
  author     VARCHAR(100) NOT NULL,
  date       VARCHAR(50) NOT NULL,
  "desc"     TEXT NOT NULL,
  blog       VARCHAR(100)
);
COMMENT ON TABLE db2603ec.co_blog IS '블로그';
COMMENT ON COLUMN db2603ec.co_blog.blog_id IS '블로그ID';
COMMENT ON COLUMN db2603ec.co_blog.img IS '이미지';
COMMENT ON COLUMN db2603ec.co_blog.title IS '제목';
COMMENT ON COLUMN db2603ec.co_blog.author IS '작성자';
COMMENT ON COLUMN db2603ec.co_blog.date IS '작성일';
COMMENT ON COLUMN db2603ec.co_blog."desc" IS '설명';
COMMENT ON COLUMN db2603ec.co_blog.blog IS '블로그 본문';