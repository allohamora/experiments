CREATE TABLE post (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR(30)
);

CREATE TABLE log (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  content VARCHAR(30)
);

INSERT INTO post(title) VALUES ('bad post'), ('good post');
INSERT INTO log(content) VALUES ('created post'), ('created post'), ('updated post');

/*
  [
    { title: 'bad post', content: 'created post' },
    { title: 'bad post', content: 'created post' },
    { title: 'bad post', content: 'updated post' },
    { title: 'good post', content: 'created post' },
    { title: 'good post', content: 'created post' },
    { title: 'good post', content: 'updated post' }
  ]
*/
SELECT post.title, log.content FROM post, log;