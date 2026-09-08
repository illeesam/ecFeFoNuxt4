
-- -----------------------------------------------------------------------------
-- coContactInfoItemType → co_contact_info_item
-- -----------------------------------------------------------------------------
-- DROP TABLE IF EXISTS db2603ec.co_contact_info_item;
CREATE TABLE IF NOT EXISTS db2603ec.co_contact_info_item (
  contact_info_item_id SERIAL PRIMARY KEY,
  icon                 VARCHAR(100) NOT NULL,
  title                VARCHAR(100) NOT NULL,
  subtitle             VARCHAR(255) NOT NULL
);
COMMENT ON TABLE db2603ec.co_contact_info_item IS '문의 페이지 연락처 표시용';
COMMENT ON COLUMN db2603ec.co_contact_info_item.contact_info_item_id IS '연락처항목ID';
COMMENT ON COLUMN db2603ec.co_contact_info_item.icon IS '아이콘';
COMMENT ON COLUMN db2603ec.co_contact_info_item.title IS '제목';
COMMENT ON COLUMN db2603ec.co_contact_info_item.subtitle IS '부제목';
