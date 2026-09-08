-- 카테고리 (category-data.ts)
INSERT INTO db2603ec.co_category (category_code, category_name, category_level, parent_category) VALUES
  ('category01', '셔츠', 2, 'category04'),
  ('category02', '신발', 2, 'category05'),
  ('category03', '오일', 2, 'category06'),
  ('category04', '셔츠', 2, 'category10'),
  ('category05', '신발', 2, 'category11'),
  ('category06', '오일', 2, 'category10'),
  ('category07', '데코 & 악세서리', 1, NULL),
  ('category08', '조명 & 의자', 1, NULL),
  ('category09', '의류 & 오일', 1, NULL),
  ('category10', '남성 패션', 1, NULL),
  ('category11', '여성 패션', 1, NULL);
