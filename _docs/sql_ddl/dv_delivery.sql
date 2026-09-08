-- -----------------------------------------------------------------------------
-- dvDeliveryType → dv_delivery, dvDeliveryItemType → dv_delivery_item
-- -----------------------------------------------------------------------------
-- DROP TABLE IF EXISTS db2603ec.dv_delivery;
CREATE TABLE IF NOT EXISTS db2603ec.dv_delivery (
  delivery_id      SERIAL PRIMARY KEY,
  order_id         INTEGER NOT NULL,
  recipient_name   VARCHAR(100) NOT NULL,
  phone            VARCHAR(50) NOT NULL,
  address          TEXT,
  addr_id          INTEGER,
  status           VARCHAR(30) NOT NULL CHECK (status IN ('pending','shipped','in_transit','delivered','failed')),
  tracking_number  VARCHAR(100),
  shipped_at       TIMESTAMPTZ,
  delivered_at     TIMESTAMPTZ,
  memo             TEXT,
  CONSTRAINT fk_dv_delivery_order FOREIGN KEY (order_id) REFERENCES db2603ec.or_order(order_id) ON DELETE CASCADE,
  CONSTRAINT fk_dv_delivery_addr  FOREIGN KEY (addr_id) REFERENCES db2603ec.mb_addr(addr_id) ON DELETE SET NULL
);
COMMENT ON TABLE db2603ec.dv_delivery IS '배송 정보';
COMMENT ON COLUMN db2603ec.dv_delivery.delivery_id IS '배송ID';
COMMENT ON COLUMN db2603ec.dv_delivery.order_id IS '주문ID';
COMMENT ON COLUMN db2603ec.dv_delivery.recipient_name IS '수령인명';
COMMENT ON COLUMN db2603ec.dv_delivery.phone IS '연락처';
COMMENT ON COLUMN db2603ec.dv_delivery.address IS '주소';
COMMENT ON COLUMN db2603ec.dv_delivery.status IS '배송상태';
COMMENT ON COLUMN db2603ec.dv_delivery.tracking_number IS '송장번호';
COMMENT ON COLUMN db2603ec.dv_delivery.shipped_at IS '발송일시';
COMMENT ON COLUMN db2603ec.dv_delivery.delivered_at IS '도착일시';
COMMENT ON COLUMN db2603ec.dv_delivery.memo IS '메모';
