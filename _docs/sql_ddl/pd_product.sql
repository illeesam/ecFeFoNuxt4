-- -----------------------------------------------------------------------------
-- pdProductType → pd_product
-- -----------------------------------------------------------------------------
-- DROP TABLE IF EXISTS db2603ec.pd_product;
CREATE TABLE IF NOT EXISTS db2603ec.pd_product (
  product_id           SERIAL PRIMARY KEY,
  img                  VARCHAR(500) NOT NULL,
  thumb_img            VARCHAR(500),
  banner_img           VARCHAR(500),
  big_img              VARCHAR(500),
  title                VARCHAR(255) NOT NULL,
  price                INTEGER NOT NULL,
  old_price            INTEGER,
  rating               DOUBLE PRECISION DEFAULT 0,
  quantity             INTEGER NOT NULL DEFAULT 0,
  sm_desc              TEXT,
  weight               DOUBLE PRECISION,
  dimension            VARCHAR(100),
  category_id          INTEGER,
  brand_id             INTEGER,
  parent_category_code VARCHAR(50),
  category_code        VARCHAR(50),
  brand_code           VARCHAR(50),
  trending             BOOLEAN DEFAULT FALSE,
  banner               BOOLEAN DEFAULT FALSE,
  sale_of_per          INTEGER,
  is_new               BOOLEAN DEFAULT FALSE,
  best_seller          BOOLEAN DEFAULT FALSE,
  top_rated            BOOLEAN DEFAULT FALSE,
  related_images       TEXT[],
  details              JSONB,
  option_sizes         JSONB,
  option_colors        JSONB,
  CONSTRAINT fk_pd_product_category FOREIGN KEY (category_id) REFERENCES db2603ec.co_category(category_id) ON DELETE SET NULL,
  CONSTRAINT fk_pd_product_brand     FOREIGN KEY (brand_id)     REFERENCES db2603ec.co_brand(brand_id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS pd_product_category_id_idx ON db2603ec.pd_product (category_id);
CREATE INDEX IF NOT EXISTS pd_product_brand_id_idx ON db2603ec.pd_product (brand_id);
COMMENT ON TABLE db2603ec.pd_product IS '상품';
COMMENT ON COLUMN db2603ec.pd_product.product_id IS '상품ID';
COMMENT ON COLUMN db2603ec.pd_product.img IS '대표 이미지';
COMMENT ON COLUMN db2603ec.pd_product.thumb_img IS '썸네일 이미지';
COMMENT ON COLUMN db2603ec.pd_product.banner_img IS '배너 이미지';
COMMENT ON COLUMN db2603ec.pd_product.big_img IS '큰 이미지';
COMMENT ON COLUMN db2603ec.pd_product.title IS '상품명';
COMMENT ON COLUMN db2603ec.pd_product.price IS '판매가';
COMMENT ON COLUMN db2603ec.pd_product.old_price IS '정가';
COMMENT ON COLUMN db2603ec.pd_product.rating IS '평점';
COMMENT ON COLUMN db2603ec.pd_product.quantity IS '재고 수량';
COMMENT ON COLUMN db2603ec.pd_product.sm_desc IS '짧은 설명';
COMMENT ON COLUMN db2603ec.pd_product.weight IS '무게';
COMMENT ON COLUMN db2603ec.pd_product.dimension IS '치수';
COMMENT ON COLUMN db2603ec.pd_product.category_id IS '카테고리 FK';
COMMENT ON COLUMN db2603ec.pd_product.brand_id IS '브랜드 FK';
COMMENT ON COLUMN db2603ec.pd_product.trending IS '트렌딩 여부';
COMMENT ON COLUMN db2603ec.pd_product.banner IS '배너 노출 여부';
COMMENT ON COLUMN db2603ec.pd_product.sale_of_per IS '할인율(%)';
COMMENT ON COLUMN db2603ec.pd_product.is_new IS '신상품 여부';
COMMENT ON COLUMN db2603ec.pd_product.best_seller IS '베스트셀러 여부';
COMMENT ON COLUMN db2603ec.pd_product.top_rated IS '베스트 평점 여부';
COMMENT ON COLUMN db2603ec.pd_product.related_images IS '관련 이미지 목록';
COMMENT ON COLUMN db2603ec.pd_product.details IS '상세 설명(JSON)';
COMMENT ON COLUMN db2603ec.pd_product.option_sizes IS '사이즈 옵션 목록(JSON)';
COMMENT ON COLUMN db2603ec.pd_product.option_colors IS '컬러 옵션 목록(JSON)';
