CREATE TABLE users (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  isActive BOOLEAN NOT NULL,
  isAdmin BOOLEAN NOT NULL,
  isCook BOOLEAN NOT NULL
);

INSERT INTO users (isActive, isAdmin, isCook)
VALUES (true, true, false), (false, false, false), (true, true, true);

SELECT
  (
    (case 
      when isActive then 100
      else 0
    end) +
    (case 
      when isAdmin then 100
      else 0
    end) + 
    (case 
      when isCook then 100
      else 0
    end)
  ) as score
FROM users;