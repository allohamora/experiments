import { Kysely, PostgresDialect, sql, type Generated, type Insertable, type Selectable } from 'kysely';
import { Pool } from 'pg';

const { POSTGRES_URL } = process.env;
if (!POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not defined');
}

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: POSTGRES_URL,
  }),
});

type User = {
  name: string;
  balance: number;
};

type Transfer = {
  id: Generated<number>;
  from: string;
  to: string;
  amount: number;
};

type Database = {
  user: User;
  transfer: Transfer;
};

const db = new Kysely<Database>({
  dialect,
});

const createTables = async () => {
  await db.schema
    .createTable('user')
    .ifNotExists()
    .addColumn('name', 'varchar(255)', (col) => col.primaryKey())
    .addColumn('balance', 'integer', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('transfer')
    .ifNotExists()
    .addColumn('id', 'integer', (col) => col.generatedAlwaysAsIdentity().primaryKey())
    .addColumn('from', 'varchar(255)', (col) => col.references('user.name').notNull())
    .addColumn('to', 'varchar(255)', (col) => col.references('user.name').notNull())
    .addColumn('amount', 'integer', (col) => col.notNull())
    .execute();
};

const dropTables = async () => {
  await db.schema.dropTable('transfer').ifExists().execute();

  await db.schema.dropTable('user').ifExists().execute();
};

const createUser = async (data: Insertable<User>) => {
  return await db.insertInto('user').values(data).returningAll().executeTakeFirstOrThrow();
};

const getUsers = async () => {
  return await db.selectFrom('user').selectAll().execute();
};

const transferWithRaceCondition = async (data: Insertable<Transfer>) => {
  return await db.transaction().execute(async (trx) => {
    const from = await trx.selectFrom('user').selectAll().where('name', '=', data.from).executeTakeFirstOrThrow();
    if (from.balance < data.amount) {
      throw new Error('Insufficient balance');
    }

    const to = await trx.selectFrom('user').selectAll().where('name', '=', data.to).executeTakeFirstOrThrow();
    await sql`select pg_sleep(1)`.execute(trx);

    await trx
      .updateTable('user')
      .set({ balance: from.balance - data.amount })
      .where('name', '=', from.name)
      .execute();
    await trx
      .updateTable('user')
      .set({ balance: to.balance + data.amount })
      .where('name', '=', to.name)
      .execute();

    return await trx.insertInto('transfer').values(data).returningAll().executeTakeFirstOrThrow();
  });
};

const transferWithForUpdate = async (data: Insertable<Transfer>) => {
  return await db.transaction().execute(async (trx) => {
    const targets = await trx
      .selectFrom('user')
      .selectAll()
      .where('name', 'in', [data.from, data.to])
      .forUpdate()
      .execute();
    if (targets.length !== 2) {
      throw new Error('Invalid users');
    }

    const from = targets.find((user) => user.name === data.from);
    if (!from) {
      throw new Error('Invalid from user');
    }

    if (from.balance < data.amount) {
      throw new Error('Insufficient balance');
    }

    const to = targets.find((user) => user.name === data.to);
    if (!to) {
      throw new Error('Invalid to user');
    }

    await trx
      .updateTable('user')
      .set({ balance: from.balance - data.amount })
      .where('name', '=', from.name)
      .execute();
    await trx
      .updateTable('user')
      .set({ balance: to.balance + data.amount })
      .where('name', '=', to.name)
      .execute();

    return await trx.insertInto('transfer').values(data).returningAll().executeTakeFirstOrThrow();
  });
};

const getTransfers = async () => {
  return await db.selectFrom('transfer').selectAll().execute();
};

const raceCondition = async (transfer: (data: Insertable<Transfer>) => Promise<Selectable<Transfer>>) => {
  const alice = await createUser({ name: 'alice', balance: 1000 });
  const bob = await createUser({ name: 'bob', balance: 1000 });
  const charlie = await createUser({ name: 'charlie', balance: 1000 });

  await Promise.all([
    transfer({ from: alice.name, to: bob.name, amount: 100 }),
    transfer({ from: alice.name, to: charlie.name, amount: 100 }),
    // deadlock detected in transferWithRaceCondition
    // transfer({ from: bob.name, to: alice.name, amount: 100 }),
    // transfer({ from: charlie.name, to: alice.name, amount: 100 }),
  ]);

  const users = await getUsers();
  const transfers = await getTransfers();

  console.log('Users:', users);
  console.log('Transfers:', transfers);
};

await createTables();
await raceCondition(transferWithForUpdate);
await dropTables();
await db.destroy();
