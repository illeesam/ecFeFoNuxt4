
-- -----------------------------------------------------------------------------
-- orClaimType → or_claim, orClaimItemType → or_claim_item
-- -----------------------------------------------------------------------------
-- DROP TABLE IF EXISTS db2603ec.or_claim_item;

CREATE TABLE IF NOT EXISTS db2603ec.or_claim_item (
  claim_item_id  SERIAL PRIMARY KEY,
  claim_id       INTEGER NOT NULL,
  order_id       INTEGER NOT NULL,
  product_id     INTEGER,
  product_title  VARCHAR(255),
  quantity       INTEGER,
  claim_type     VARCHAR(20) NOT NULL CHECK (claim_type IN ('exchange','return','cancel')),
  reason         TEXT NOT NULL,
  status         VARCHAR(20) NOT NULL CHECK (status IN ('requested','approved','rejected','completed')),
  created_at     TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_or_claim_item_claim   FOREIGN KEY (claim_id) REFERENCES db2603ec.or_claim(claim_id) ON DELETE CASCADE,
  CONSTRAINT fk_or_claim_item_product FOREIGN KEY (product_id) REFERENCES db2603ec.pd_product(product_id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS or_claim_order_id_idx ON db2603ec.or_claim (order_id);
CREATE INDEX IF NOT EXISTS or_claim_item_claim_id_idx ON db2603ec.or_claim_item (claim_id);
COMMENT ON TABLE db2603ec.or_claim_item IS '클레임 한 건 (목록/상세용)';
COMMENT ON COLUMN db2603ec.or_claim_item.claim_item_id IS '클레임품목ID';
COMMENT ON COLUMN db2603ec.or_claim_item.claim_id IS '클레임ID';
COMMENT ON COLUMN db2603ec.or_claim_item.order_id IS '주문ID';
COMMENT ON COLUMN db2603ec.or_claim_item.product_id IS '상품ID';
COMMENT ON COLUMN db2603ec.or_claim_item.product_title IS '상품명';
COMMENT ON COLUMN db2603ec.or_claim_item.quantity IS '수량';
COMMENT ON COLUMN db2603ec.or_claim_item.claim_type IS '클레임 유형 (교환/반품/취소)';
COMMENT ON COLUMN db2603ec.or_claim_item.reason IS '사유';
COMMENT ON COLUMN db2603ec.or_claim_item.status IS '처리상태';
COMMENT ON COLUMN db2603ec.or_claim_item.created_at IS '생성일시';
COMMENT ON COLUMN db2603ec.or_claim_item.updated_at IS '수정일시';
