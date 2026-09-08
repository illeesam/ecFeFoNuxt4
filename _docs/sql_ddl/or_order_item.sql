-- -----------------------------------------------------------------------------
-- orOrderType → or_order, orOrderItemType → or_order_item
-- -----------------------------------------------------------------------------

-- DROP TABLE IF EXISTS db2603ec.or_order_item;

CREATE TABLE IF NOT EXISTS db2603ec.or_order_item (
  order_item_id   SERIAL PRIMARY KEY,
  order_id        INTEGER NOT NULL,
  product_id      INTEGER NOT NULL,
  title           VARCHAR(255) NOT NULL,
  price           INTEGER NOT NULL,
  order_quantity  INTEGER NOT NULL,
  subtotal        INTEGER NOT NULL,
  CONSTRAINT fk_or_order_item_order   FOREIGN KEY (order_id)   REFERENCES db2603ec.or_order(order_id) ON DELETE CASCADE,
  CONSTRAINT fk_or_order_item_product FOREIGN KEY (product_id) REFERENCES db2603ec.pd_product(product_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS or_order_item_order_id_idx   ON db2603ec.or_order_item (order_id);
CREATE INDEX IF NOT EXISTS or_order_item_product_id_idx ON db2603ec.or_order_item (product_id);
COMMENT ON TABLE db2603ec.or_order_item IS '주문 한 줄 (상품 + 수량 + 소계)';
COMMENT ON COLUMN db2603ec.or_order_item.order_item_id IS '주문품목ID';
COMMENT ON COLUMN db2603ec.or_order_item.order_id IS '주문ID';
COMMENT ON COLUMN db2603ec.or_order_item.product_id IS '상품ID';
COMMENT ON COLUMN db2603ec.or_order_item.title IS '상품명';
COMMENT ON COLUMN db2603ec.or_order_item.price IS '단가';
COMMENT ON COLUMN db2603ec.or_order_item.order_quantity IS '주문 수량';
COMMENT ON COLUMN db2603ec.or_order_item.subtotal IS '소계';
