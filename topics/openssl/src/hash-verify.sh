# to verify hash we need public-key
openssl dgst -sha512 -verify temp/public-key.pem -signature temp/hashed.out data/secret.txt