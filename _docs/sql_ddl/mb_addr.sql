
-- -----------------------------------------------------------------------------
-- mbAddrType → mb_addr
-- -----------------------------------------------------------------------------
-- DROP TABLE IF EXISTS db2603ec.mb_addr;
CREATE TABLE IF NOT EXISTS db2603ec.mb_addr (
  addr_id            SERIAL PRIMARY KEY,
  address_id         VARCHAR(50),
  recipient_name     VARCHAR(100) NOT NULL,
  recipient_last_name VARCHAR(100),
  company            VARCHAR(100),
  road_addr          VARCHAR(500) NOT NULL,
  detail_addr        VARCHAR(255),
  zonecode           VARCHAR(20) NOT NULL,
  sido               VARCHAR(50) NOT NULL,
  sigungu            VARCHAR(50) NOT NULL,
  email              VARCHAR(255) NOT NULL,
  phone              VARCHAR(50) NOT NULL
);
COMMENT ON TABLE db2603ec.mb_addr IS '주소 (배송/청구)';
COMMENT ON COLUMN db2603ec.mb_addr.addr_id IS '주소ID';
COMMENT ON COLUMN db2603ec.mb_addr.address_id IS '주소 식별자';
COMMENT ON COLUMN db2603ec.mb_addr.recipient_name IS '수령인명';
COMMENT ON COLUMN db2603ec.mb_addr.recipient_last_name IS '수령인 성';
COMMENT ON COLUMN db2603ec.mb_addr.company IS '회사명';
COMMENT ON COLUMN db2603ec.mb_addr.road_addr IS '도로명 주소';
COMMENT ON COLUMN db2603ec.mb_addr.detail_addr IS '상세 주소';
COMMENT ON COLUMN db2603ec.mb_addr.zonecode IS '우편번호';
COMMENT ON COLUMN db2603ec.mb_addr.sido IS '시/도';
COMMENT ON COLUMN db2603ec.mb_addr.sigungu IS '시/군/구';
COMMENT ON COLUMN db2603ec.mb_addr.email IS '이메일';
COMMENT ON COLUMN db2603ec.mb_addr.phone IS '연락처';
