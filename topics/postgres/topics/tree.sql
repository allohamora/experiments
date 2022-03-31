CREATE TABLE category (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  parentId INT REFERENCES category(id),
  childId INT REFERENCES category(id)
);

INSERT INTO category (name, parentId, childId) VALUES ('1', null, 2), ('2', 1, 3), ('3', 2, 4), ('4', 3, null);

/*
  If I understood correctly, WITH RECURSIVE works like that:
  1. Run first (before UNION) query
  2. Run second (after UNION) query and join it data to WITH RECURSIVE *table*
  3. Repeat 2. while second (after UNION) returns values
*/

-- all children
WITH RECURSIVE categories AS (
  SELECT id, childId, parentId, name
  FROM category
  WHERE id = 1

  UNION

  SELECT category.id, category.childId, category.parentId, category.name
  FROM category
  JOIN categories ON category.id = categories.childId -- JOIN categories can be used only once
)
SELECT * FROM categories;

-- all parent
WITH RECURSIVE categories AS (
  SELECT id, childId, parentId, name
  FROM category
  WHERE id = 4

  UNION

  SELECT category.id, category.childId, category.parentId, category.name
  FROM category
  JOIN categories ON category.id = categories.parentId
)
SELECT * FROM categories;

-- all tree 
WITH RECURSIVE categories AS (
  SELECT id, childId, parentId, name
  FROM category
  WHERE id = 3

  UNION

  SELECT category.id, category.childId, category.parentId, category.name
  FROM category
  JOIN categories ON category.id = categories.parentId OR category.id = categories.childId
)
SELECT * FROM categories;
