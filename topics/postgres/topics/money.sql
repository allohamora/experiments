CREATE TABLE product (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  price NUMERIC(12, 2) NOT NULL
);

INSERT INTO product (title, price) VALUES ('bread', 1.00), ('milk', 10.99);
SELECT * FROM product;