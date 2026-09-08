
-- -----------------------------------------------------------------------------
-- coCategoryTreeType → co_category_tree
-- -----------------------------------------------------------------------------
-- DROP TABLE IF EXISTS db2603ec.co_category_tree;
CREATE TABLE IF NOT EXISTS db2603ec.co_category_tree (
  category_tree_id VARCHAR(50) PRIMARY KEY,
  id               VARCHAR(50),
  img              VARCHAR(500),
  parent_title     VARCHAR(100) NOT NULL,
  value            VARCHAR(50) NOT NULL,
  children         TEXT[],
  sm_desc          VARCHAR(255)
);
COMMENT ON TABLE db2603ec.co_category_tree IS '카테고리 트리';
COMMENT ON COLUMN db2603ec.co_category_tree.category_tree_id IS '카테고리ID';
COMMENT ON COLUMN db2603ec.co_category_tree.id IS 'ID (기존 호환)';
COMMENT ON COLUMN db2603ec.co_category_tree.img IS '이미지';
COMMENT ON COLUMN db2603ec.co_category_tree.parent_title IS '부모 제목';
COMMENT ON COLUMN db2603ec.co_category_tree.value IS '값(코드)';
COMMENT ON COLUMN db2603ec.co_category_tree.children IS '자식 ID 목록';
COMMENT ON COLUMN db2603ec.co_category_tree.sm_desc IS '짧은 설명';

-- co_category_id_to_name (보조)
-- DROP TABLE IF EXISTS db2603ec.co_category_id_to_name;
CREATE TABLE IF NOT EXISTS db2603ec.co_category_id_to_name (
  category_code VARCHAR(50) PRIMARY KEY,
  display_name  VARCHAR(100) NOT NULL
);
COMMENT ON TABLE db2603ec.co_category_id_to_name IS '카테고리 코드-표시명 매핑';