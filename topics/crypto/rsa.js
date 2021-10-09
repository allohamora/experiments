const { generateKeyPairSync, privateEncrypt, publicDecrypt, createPublicKey } = require('crypto');

const encrypt = (data) => {
  const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });

  const encrypted = privateEncrypt(privateKey, Buffer.from(data, 'utf-8'));
  const exportedPublicKey = publicKey.export({ type: 'spki', format: 'pem' });

  return { encrypted, exportedPublicKey };
};

const decrypt = (encrypted, exportedPublicKey) => {
  const publicKey = createPublicKey(exportedPublicKey);
  const data = publicDecrypt(publicKey, encrypted);

  return data;
};

const main = () => {
  const data = 'DATA';

  const { encrypted, exportedPublicKey } = encrypt(data);
  const decrypted = decrypt(encrypted, exportedPublicKey);

  console.log({ 
    encrypted: encrypted.toString('base64'), 
    exportedPublicKey, 
    decrypted: decrypted.toString('utf-8') 
  });
};

main();