
-- -----------------------------------------------------------------------------
-- mbWishlistItemType → mb_wishlist_item
-- -----------------------------------------------------------------------------
-- DROP TABLE IF EXISTS db2603ec.mb_wishlist_item;
CREATE TABLE IF NOT EXISTS db2603ec.mb_wishlist_item (
  wishlist_id SERIAL PRIMARY KEY,
  member_id   INTEGER NOT NULL,
  product_id  INTEGER NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_mb_wishlist_item_member_product UNIQUE (member_id, product_id),
  CONSTRAINT fk_mb_wishlist_item_member  FOREIGN KEY (member_id) REFERENCES db2603ec.mb_member(member_id) ON DELETE CASCADE,
  CONSTRAINT fk_mb_wishlist_item_product FOREIGN KEY (product_id) REFERENCES db2603ec.pd_product(product_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS mb_wishlist_item_member_id_idx  ON db2603ec.mb_wishlist_item (member_id);
CREATE INDEX IF NOT EXISTS mb_wishlist_item_product_id_idx ON db2603ec.mb_wishlist_item (product_id);
COMMENT ON TABLE db2603ec.mb_wishlist_item IS '위시리스트 아이템 (상품 타입과 동일)';
