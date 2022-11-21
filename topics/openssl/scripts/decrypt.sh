# pbkdf2 used for prevent warning
openssl enc -d -aes-256-cbc -p -pbkdf2 -k test -in temp/encrypted.out -out temp/decrypted.txt