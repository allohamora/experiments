import { MongoClient } from 'mongodb';

const {
  MONGO_INITDB_ROOT_USERNAME: MONGO_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD: MONGO_PASSWORD,
  MONGO_HOST,
  MONGO_PORT,
} = process.env;

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`;
const client = new MongoClient(url);

const main = async () => {
  await client.connect();

  console.log({ message: 'client connected' });

  const db = client.db('app');
  const users = db.collection('users');

  const insertResult = await users.insertOne({ name: 'example', password: 'example' });

  console.log({ message: 'user created', insertResult, users: await users.find().toArray() });

  const deleteResult = await users.deleteOne({ name: 'example', password: 'example' });

  console.log({ message: 'user deleted', deleteResult, users: await users.find().toArray() });

  await client.close();

  console.log({ message: 'client closed' });
};

main();
