
-- -----------------------------------------------------------------------------
-- orClaimType → or_claim, orClaimItemType → or_claim_item
-- -----------------------------------------------------------------------------
-- DROP TABLE IF EXISTS db2603ec.or_claim;
CREATE TABLE IF NOT EXISTS db2603ec.or_claim (
  claim_id   SERIAL PRIMARY KEY,
  order_id   INTEGER NOT NULL,
  claim_type VARCHAR(20) NOT NULL CHECK (claim_type IN ('exchange','return','cancel')),
  reason     TEXT NOT NULL,
  status     VARCHAR(20) NOT NULL CHECK (status IN ('requested','approved','rejected','completed')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_or_claim_order FOREIGN KEY (order_id) REFERENCES db2603ec.or_order(order_id) ON DELETE CASCADE
);
COMMENT ON TABLE db2603ec.or_claim IS '클레임(교환/반품/취소)';
COMMENT ON COLUMN db2603ec.or_claim.claim_id IS '클레임ID';
COMMENT ON COLUMN db2603ec.or_claim.order_id IS '주문ID';
COMMENT ON COLUMN db2603ec.or_claim.claim_type IS '클레임 유형';
COMMENT ON COLUMN db2603ec.or_claim.reason IS '사유';
COMMENT ON COLUMN db2603ec.or_claim.status IS '처리상태';
COMMENT ON COLUMN db2603ec.or_claim.created_at IS '생성일시';
