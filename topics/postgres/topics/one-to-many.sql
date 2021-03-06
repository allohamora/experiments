CREATE TABLE users (
  id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE posts (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  content VARCHAR(100) NOT NULL,
  userId INT REFERENCES users(id) ON UPDATE CASCADE
);

INSERT INTO users(name) 
VALUES ('john'), ('andrew'), ('alfred');

INSERT INTO posts(content, userId) 
VALUES ('john post 1', 1), ('john post 2', 1),
('andrew post 1', 2), ('andrew post 2', 2),
('alfred post 1', 3), ('alfred post 2', 3);

SELECT u.name as userName, p.content as postContent 
FROM users as u 
LEFT JOIN posts as p ON p.userId = u.id;