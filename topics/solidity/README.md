# solidity truffle 06.04.2022

- For start development blockchain server run:

```bash
$ npm run develop
```

- For deploy contracts to dev blockchain server run:

```bash
$ npm run migrate
```

- After each development server you need migrate your contracts to it and import new private key to metamask
- Develop server always uses develop network
- Migrate script uses development network by default
- If function doesn't work with states/side effects/etc (pure function) call anyway consts money
- If function doesn't work with states/side effects/etc (pure function) and has view modifier call doesn't cost money
- If client has wrong contract schemas server will throw expection (with code 500)
- Contracts states are global everyone can interact with it, read, write, delete and etc. In this example tasks is a shared (global) state. One user can write to it, another read it value
- Read public view data doesn't cost anything. But not the pure function call costs
- Front end side of web3 super raw, doesn't have normal bundles for fron-end (web3, @truffle/contract) which not requers node inner modules like buffer/net. Also doesn't have normal types for these packages
- Metamask can't switch network to test network and can't add not https: network
- All web3 libraries binds something (window.web3, window.ethereum, window.TruffleContract) to window
- Web3 has 2 flow to connect wallet old (window.web3) and modern (window.ethereum)
- Truffle has so many vulnerabilities (31 vulnerabilities (4 moderate, 24 high, 3 critical))

## Conclusion

Web3 is very perspective technology because idea of authentefication and pay by crypto wallet on many sitest and app is so comfortably and easy. But 06.04.2022 contract development is fifty fifty (not easy and comfortably but ok) and front end is full hell (main dependencies (web3, @truffle/contract) has broken bundles (only for nodejs) and one file in dist without correct types for front, if you write on js you can to endure that, but on ts you will suicide earlier than you will write full app)
