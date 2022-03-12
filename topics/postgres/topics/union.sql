CREATE TABLE serials (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  release_year INT NOT NULL
);

CREATE TABLE films (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  release_year INT NOT NULL
);

CREATE TABLE top_rated_films (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  release_year INT NOT NULL,
  rate INT NOT NULL
);

INSERT INTO serials (title, release_year) VALUES ('squid game', 2021), ('queen`s gambit', 2020);
INSERT INTO films (title, release_year) VALUES ('spider-man: no way home', 2021), ('the gentelmen', 2020);
INSERT INTO top_rated_films (title, release_year, rate) VALUES ('spider-man: no way home', 2021, 8);

SELECT * FROM serials WHERE release_year = 2020
--- don't remove dubles
UNION ALL
SELECT * FROM films WHERE release_year = 2020;

SELECT title, 'top_rated_films' as source FROM top_rated_films WHERE release_year = 2021
--- remove dubles
UNION
SELECT title, 'films' as source FROM films WHERE release_year = 2021;