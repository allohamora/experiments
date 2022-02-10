const { generateKeyPairSync, privateEncrypt, publicDecrypt, createPublicKey } = require('crypto');

const encrypt = (data) => {
  const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });

  const encrypted = privateEncrypt(privateKey, Buffer.from(data, 'utf-8'));
  const exportedPublicKey = publicKey.export({ type: 'spki', format: 'pem' });

  return { encrypted, exportedPublicKey };
};

const decrypt = (encrypted, exportedPublicKey) => {
  const publicKey = createPublicKey(exportedPublicKey);

  return publicDecrypt(publicKey, encrypted);
};

const main = () => {
  const data = 'DATA';

  const { encrypted, exportedPublicKey } = encrypt(data);
  const decrypted = decrypt(encrypted, exportedPublicKey);
  const decryptedString = decrypted.toString('utf-8');
  const isEqual = data === decryptedString;

  console.log({
    encrypted: encrypted.toString('base64'),
    exportedPublicKey,
    decrypted: decryptedString,
    isEqual,
  });
};

main();
