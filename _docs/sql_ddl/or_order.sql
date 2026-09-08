----------------------------
-- orOrderType → or_order, orOrderItemType → or_order_item
-- -----------------------------------------------------------------------------
-- DROP TABLE IF EXISTS db2603ec.or_order;
CREATE TABLE IF NOT EXISTS db2603ec.or_order (
  order_id      SERIAL PRIMARY KEY,
  member_id     INTEGER,
  shipping_cost INTEGER NOT NULL DEFAULT 0,
  total         INTEGER NOT NULL,
  status        VARCHAR(50) NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_or_order_member FOREIGN KEY (member_id) REFERENCES db2603ec.mb_member(member_id) ON DELETE SET NULL
);
COMMENT ON TABLE db2603ec.or_order IS '주문';
COMMENT ON COLUMN db2603ec.or_order.order_id IS '주문ID';
COMMENT ON COLUMN db2603ec.or_order.shipping_cost IS '배송비';
COMMENT ON COLUMN db2603ec.or_order.total IS '총 금액';
COMMENT ON COLUMN db2603ec.or_order.status IS '주문상태';
COMMENT ON COLUMN db2603ec.or_order.created_at IS '생성일시';
