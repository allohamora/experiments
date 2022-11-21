openssl req -x509 -nodes -new -sha256 -days 365 -key temp/private-key.pem -out temp/ca.crt -subj "/C=US/CN=Example-Root-CA"

# with separated keys
# openssl req -x509 -nodes -new -sha256 -days 1024 -newkey rsa:2048 -keyout temp/ca.private-key.pem -out temp/ca.pem -subj "/C=US/CN=Example-Root-CA"
# openssl x509 -outform pem -in temp/ca.pem -out temp/ca.crt