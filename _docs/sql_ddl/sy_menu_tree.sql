
-- -----------------------------------------------------------------------------
-- syMenuTreeType → sy_menu_tree
-- -----------------------------------------------------------------------------
-- DROP TABLE IF EXISTS db2603ec.sy_menu_tree;
CREATE TABLE IF NOT EXISTS db2603ec.sy_menu_tree (
  menu_tree_id   SERIAL PRIMARY KEY,
  menu_id        INTEGER,
  link           VARCHAR(255) NOT NULL DEFAULT '',
  title          VARCHAR(100) NOT NULL,
  has_dropdown   BOOLEAN DEFAULT FALSE,
  megamenu       BOOLEAN DEFAULT FALSE,
  dropdown_items JSONB
);
COMMENT ON TABLE db2603ec.sy_menu_tree IS '메뉴 트리';
COMMENT ON COLUMN db2603ec.sy_menu_tree.menu_tree_id IS '메뉴트리ID';
COMMENT ON COLUMN db2603ec.sy_menu_tree.menu_id IS '메뉴ID (기존 호환)';
COMMENT ON COLUMN db2603ec.sy_menu_tree.link IS '링크';
COMMENT ON COLUMN db2603ec.sy_menu_tree.title IS '메뉴명';
COMMENT ON COLUMN db2603ec.sy_menu_tree.has_dropdown IS '드롭다운 여부';
COMMENT ON COLUMN db2603ec.sy_menu_tree.megamenu IS '메가메뉴 여부';
COMMENT ON COLUMN db2603ec.sy_menu_tree.dropdown_items IS '드롭다운 항목(JSON)';
