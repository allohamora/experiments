const { randomBytes, createCipheriv, createDecipheriv, createHash } = require('crypto');

const IV_LENGTH = 16;
const algorithm = 'aes-256-ctr';

const secret = 'SECRET';
const key = createHash('sha256').update(secret).digest('base64').substr(0, 32);

const encrypt = (data) => {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(algorithm, key, iv);

  const encrypted = Buffer.concat([iv, cipher.update(data), cipher.final()]);

  return encrypted;
};

const decrypt = (encrypted) => {
  const iv = encrypted.slice(0, IV_LENGTH);
  const encryptedData = encrypted.slice(IV_LENGTH);

  const decipher = createDecipheriv('aes-256-ctr', key, iv);

  const decryptedText = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

  return decryptedText;
};

const encryptAndDecrypt = (data) => {
  const encrypted = encrypt(data).toString('base64');
  const decrypted = decrypt(Buffer.from(encrypted, 'base64')).toString('utf-8');
  const isEqual = data === decrypted;

  return { encrypted, decrypted, data, isEqual };
};

const data = 'SECRET DATA';
console.log(encryptAndDecrypt(data));
