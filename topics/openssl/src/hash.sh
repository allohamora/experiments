# if we want to verify that hash - we need to pass private key
openssl dgst -sha512 -sign temp/private-key.pem -out temp/hashed.out data/secret.txt