import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { sql, createPool } from 'slonik';

const {
  PORT = 3000,
  HOSTNAME,

  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
} = process.env;

const pool = createPool(
  `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
);

const chain = (...funcs) => {
  return (...args) => {
    for (const func of funcs) {
      func(...args);
    }
  };
};

const logging = ({ req }) => {
  const ip = req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const start = Date.now();

  req.once('close', () => {
    const finish = Date.now();
    const requestTime = `${finish - start}ms`;

    console.log({ ip, userAgent, requestTime });
  });
};

const HttpType = {
  Text: 'text/plain',
  Json: 'application/json',
};

const HttpCode = {
  Ok: 200,
  Created: 201,
};

const HttpMessage = {
  Ok: 'Ok',
};

const replyFactory = (res) => {
  return ({ code = HttpCode.Ok, type = HttpType.Text, data = HttpMessage.Ok } = {}) => {
    res.statusCode = code;
    res.setHeader('Content-Type', type);
    res.end(data);
  };
};

const routes = {
  '/': ({ reply }) => {
    reply({ code: 200, data: 'hello world!' });
  },
  '/customer/create-random': async ({ reply }) => {
    const name = randomUUID();
    const customer = await pool.connect(async (connection) => {
      const { rows } = await connection.query(sql`
        INSERT INTO customers (name) 
        VALUES (${name}) 
        RETURNING *;
      `);

      return rows[0];
    });

    reply({
      code: HttpCode.Created,
      data: `random customer successfully created, customer: ${JSON.stringify(customer)}`,
    });
  },
  '/customer': async ({ reply }) => {
    const customers = await pool.connect(async (connection) => {
      const { rows } = await connection.query(sql`
        SELECT * FROM customers;
      `);

      return rows;
    });

    reply({ data: JSON.stringify(customers), type: HttpType.Json });
  },
};

const routing = (ctx) => {
  const { req, reply } = ctx;
  const { url } = req;
  const route = routes[url];

  if (!route) {
    reply({ code: 404, data: '404' });
    return;
  }

  route(ctx);
};

const handler = chain(logging, routing);

const server = createServer((req, res) => {
  const reply = replyFactory(res);

  handler({ req, res, reply });
});

const main = async () => {
  await pool.connect(async (connection) => {
    await connection.query(sql`
      CREATE TABLE IF NOT EXISTS customers (
        id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name UUID NOT NULL
      );
    `);
  });

  server.listen(PORT, () => console.log(`server started on port: ${PORT}, hostname: ${HOSTNAME}`));
};

main();
