# pbkdf2 used for prevent warning
openssl enc -e -aes-256-cbc -p -pbkdf2 -k test -in data/secret.txt -out temp/encrypted.out