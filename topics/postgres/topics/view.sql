CREATE TABLE users (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TYPE role AS ENUM ('user', 'admin');

CREATE TABLE roles (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  role role,
  userId INT REFERENCES users(id)
);

INSERT INTO users(name) 
VALUES ('john'), ('andrew'), ('alfred');

INSERT INTO roles(role, userId) 
VALUES ('user', 1), ('admin', 1),
('user', 2), 
('admin', 3);

-- view table recreates on client request
CREATE VIEW user_roles AS
SELECT array_agg(roles.role) as roles, users.name as username FROM roles
LEFT JOIN users ON users.id = roles.userId
GROUP BY roles.userId, users.name;

SELECT * FROM user_roles;

DELETE FROM roles
WHERE roles.id = 1;

SELECT * FROM user_roles;