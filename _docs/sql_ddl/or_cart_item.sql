
-- -----------------------------------------------------------------------------
-- orCartItemType → or_cart_item
-- -----------------------------------------------------------------------------
-- DROP TABLE IF EXISTS db2603ec.or_cart_item;
CREATE TABLE IF NOT EXISTS db2603ec.or_cart_item (
  cart_item_id    SERIAL PRIMARY KEY,
  member_id       INTEGER,
  session_id      VARCHAR(100),
  product_id      INTEGER NOT NULL,
  order_quantity  INTEGER NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_or_cart_item_member  FOREIGN KEY (member_id) REFERENCES db2603ec.mb_member(member_id) ON DELETE CASCADE,
  CONSTRAINT fk_or_cart_item_product FOREIGN KEY (product_id) REFERENCES db2603ec.pd_product(product_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS or_cart_item_member_id_idx  ON db2603ec.or_cart_item (member_id);
CREATE INDEX IF NOT EXISTS or_cart_item_product_id_idx ON db2603ec.or_cart_item (product_id);
COMMENT ON TABLE db2603ec.or_cart_item IS '장바구니에 담긴 상품 한 줄 (상품 + 주문 수량)';
COMMENT ON COLUMN db2603ec.or_cart_item.cart_item_id IS '장바구니품목ID';
COMMENT ON COLUMN db2603ec.or_cart_item.order_quantity IS '주문 수량';
