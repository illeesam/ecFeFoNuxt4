-- -----------------------------------------------------------------------------
-- pdReviewType → pd_review (리뷰 + 답글)
-- -----------------------------------------------------------------------------
-- DROP TABLE IF EXISTS db2603ec.pd_review;
CREATE TABLE db2603ec.pd_review (
	product_review_id serial4 NOT NULL,
	product_id int4 NOT NULL,
	img varchar(500) NULL,
	"name" varchar(100) NOT NULL,
	"time" varchar(50) NOT NULL,
	rating float8 DEFAULT 0 NOT NULL,
	is_children bool DEFAULT false NULL,
	attachments jsonb NULL,
	parent_review_id int4 NULL,
	"content" text NULL,
	CONSTRAINT pd_review_pkey PRIMARY KEY (product_review_id),
	CONSTRAINT fk_pd_review_parent FOREIGN KEY (parent_review_id) REFERENCES db2603ec.pd_review(product_review_id) ON DELETE CASCADE,
	CONSTRAINT fk_pd_review_product FOREIGN KEY (product_id) REFERENCES db2603ec.pd_product(product_id) ON DELETE CASCADE
);
CREATE INDEX pd_review_parent_id_idx ON db2603ec.pd_review USING btree (parent_review_id);
CREATE INDEX pd_review_product_id_idx ON db2603ec.pd_review USING btree (product_id);
CREATE INDEX IF NOT EXISTS pd_review_product_id_idx ON db2603ec.pd_review (product_id);
CREATE INDEX IF NOT EXISTS pd_review_parent_id_idx ON db2603ec.pd_review (parent_review_id);
COMMENT ON TABLE db2603ec.pd_review IS '상품 리뷰';
COMMENT ON COLUMN db2603ec.pd_review.product_review_id IS '리뷰ID';
COMMENT ON COLUMN db2603ec.pd_review.product_id IS '상품ID';
COMMENT ON COLUMN db2603ec.pd_review.parent_review_id IS '부모 리뷰ID (답글인 경우)';
COMMENT ON COLUMN db2603ec.pd_review.img IS '이미지';
COMMENT ON COLUMN db2603ec.pd_review.name IS '작성자명';
COMMENT ON COLUMN db2603ec.pd_review.time IS '작성일시';
COMMENT ON COLUMN db2603ec.pd_review.rating IS '평점';
COMMENT ON COLUMN db2603ec.pd_review.content IS '리뷰/답글 내용';
COMMENT ON COLUMN db2603ec.pd_review.is_children IS '자식 리뷰 여부';
COMMENT ON COLUMN db2603ec.pd_review.attachments IS '첨부파일 URL 목록';
