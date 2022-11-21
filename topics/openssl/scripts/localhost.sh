openssl req -new -nodes -key temp/private-key.pem -out temp/localhost.csr -subj "/C=US/ST=YourState/L=YourCity/O=Example-Certificates/CN=localhost.local"
openssl x509 -req -sha256 -days 1024 -in temp/localhost.csr -CA temp/ca.crt -CAkey temp/private-key.pem -CAcreateserial -extfile data/localhost.ext -out temp/localhost.crt

# with separated keys
# openssl req -new -nodes -newkey rsa:2048 -keyout temp/localhost.private-key.pem -out temp/localhost.csr -subj "/C=US/ST=YourState/L=YourCity/O=Example-Certificates/CN=localhost.local"
# openssl x509 -req -sha256 -days 1024 -in temp/localhost.csr -CA temp/ca.crt -CAkey temp/ca.private-key.pem -CAcreateserial -extfile data/localhost.ext -out temp/localhost.crt