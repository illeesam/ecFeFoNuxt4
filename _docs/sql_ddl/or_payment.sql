
-- -----------------------------------------------------------------------------
-- orPaymentType → or_payment
-- -----------------------------------------------------------------------------
-- DROP TABLE IF EXISTS db2603ec.or_payment;
CREATE TABLE IF NOT EXISTS db2603ec.or_payment (
  payment_id SERIAL PRIMARY KEY,
  order_id   INTEGER NOT NULL,
  method     VARCHAR(20) NOT NULL CHECK (method IN ('transfer','card','check','free')),
  amount     INTEGER NOT NULL,
  status     VARCHAR(20) NOT NULL CHECK (status IN ('pending','completed','failed')),
  paid_at    TIMESTAMPTZ,
  CONSTRAINT fk_or_payment_order FOREIGN KEY (order_id) REFERENCES db2603ec.or_order(order_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS or_payment_order_id_idx ON db2603ec.or_payment (order_id);
COMMENT ON TABLE db2603ec.or_payment IS '결제 정보';
COMMENT ON COLUMN db2603ec.or_payment.payment_id IS '결제ID';
COMMENT ON COLUMN db2603ec.or_payment.order_id IS '주문ID';
COMMENT ON COLUMN db2603ec.or_payment.method IS '결제 수단';
COMMENT ON COLUMN db2603ec.or_payment.amount IS '결제 금액';
COMMENT ON COLUMN db2603ec.or_payment.status IS '결제상태';
COMMENT ON COLUMN db2603ec.or_payment.paid_at IS '결제일시';
