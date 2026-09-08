-- 카테고리 트리 (categoryTreeData.ts)
INSERT INTO db2603ec.co_category_tree (category_tree_id, img, parent_title, value, children, sm_desc) VALUES
  ('catTree01', '/cdn/img/shop/banner/banner-sm-1.jpg', '조명 & 의자', 'category08', ARRAY['category01', 'category02'], NULL),
  ('catTree02', '/cdn/img/shop/banner/banner-sm-2.jpg', '데코 & 악세서리', 'category07', ARRAY['category01', 'category02'], NULL),
  ('catTree03', '/cdn/img/shop/banner/banner-sm-3.jpg', '의류 & 오일', 'category09', ARRAY['category03', 'category03'], NULL),
  ('catTree04', '/cdn/img/shop/banner/02/banner-1.webp', '남성 패션', 'category10', ARRAY['category01'], '다양한 트렌드를 반영한 패션을 만나보세요.'),
  ('catTree05', '/cdn/img/shop/banner/02/banner-2.webp', '여성 패션', 'category11', ARRAY['category02'], '다양한 트렌드를 반영한 패션을 만나보세요.'),
  ('catTree06', '/cdn/img/shop/banner/02/banner-3.webp', '남성 패션', 'category10', ARRAY['category01'], '다양한 트렌드를 반영한 패션을 만나보세요.');

INSERT INTO db2603ec.co_category_id_to_name (category_code, display_name) VALUES
  ('category01', '조명'),
  ('category02', '의자'),
  ('category03', '의류'),
  ('category07', '데코 & 악세서리'),
  ('category08', '조명 & 의자'),
  ('category09', '의류 & 오일'),
  ('category10', '남성 패션'),
  ('category11', '여성 패션');
