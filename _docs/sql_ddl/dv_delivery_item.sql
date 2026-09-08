-- -----------------------------------------------------------------------------
-- dvDeliveryType → dv_delivery, dvDeliveryItemType → dv_delivery_item
-- -----------------------------------------------------------------------------
-- DROP TABLE IF EXISTS db2603ec.dv_delivery_item;
CREATE TABLE IF NOT EXISTS db2603ec.dv_delivery_item (
  delivery_item_id SERIAL PRIMARY KEY,
  delivery_id       INTEGER NOT NULL,
  product_id       INTEGER NOT NULL,
  title            VARCHAR(255) NOT NULL,
  quantity         INTEGER NOT NULL,
  option_summary   VARCHAR(255),
  CONSTRAINT fk_dv_delivery_item_delivery FOREIGN KEY (delivery_id) REFERENCES db2603ec.dv_delivery(delivery_id) ON DELETE CASCADE,
  CONSTRAINT fk_dv_delivery_item_product FOREIGN KEY (product_id) REFERENCES db2603ec.pd_product(product_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS dv_delivery_order_id_idx ON db2603ec.dv_delivery (order_id);
CREATE INDEX IF NOT EXISTS dv_delivery_item_delivery_id_idx ON db2603ec.dv_delivery_item (delivery_id);
COMMENT ON TABLE db2603ec.dv_delivery_item IS '배송 품목 한 줄 (배송 단위 내 상품)';
COMMENT ON COLUMN db2603ec.dv_delivery_item.delivery_item_id IS '배송품목ID';
COMMENT ON COLUMN db2603ec.dv_delivery_item.delivery_id IS '배송ID';
COMMENT ON COLUMN db2603ec.dv_delivery_item.product_id IS '상품ID';
COMMENT ON COLUMN db2603ec.dv_delivery_item.title IS '상품명';
COMMENT ON COLUMN db2603ec.dv_delivery_item.quantity IS '수량';
COMMENT ON COLUMN db2603ec.dv_delivery_item.option_summary IS '옵션 요약';
