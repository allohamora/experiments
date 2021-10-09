const { promisify } = require('util');
const { scrypt: scryptCallback, randomBytes } = require('crypto');

const scrypt = promisify(scryptCallback);

const hash = async (data) => {
  const salt = randomBytes(8).toString('hex');

  const hash = (await scrypt(data, salt, 64)).toString('hex');
  const hashWithSalt = `${salt}:${hash}`;

  return hashWithSalt;
};

const verify = async (data, hashWithSalt) => {
  const [salt, hash] = hashWithSalt.split(':');

  const newHash = (await scrypt(data, salt, 64)).toString('hex');

  return hash === newHash;
};

const main = async () => {
  const data = 'data';

  const hashed = await hash(data);
  const verified = await verify(data, hashed);

  console.log({ data, hashed, verified });
};

main();
