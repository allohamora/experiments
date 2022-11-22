# mkcert

To use self signed certificate with mkcert firstly you need to install mkcert CA certificate by command:

```bash
mkcert -install
```

After that you need to create certificate and private key by command:

```bash
mkcert {{domain}}
```

If you don't need mkcert and his certificates you can uninstall his CA certificate by command:

```bash
mkcert -uninstall
```
