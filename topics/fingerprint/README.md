# fingerprint

- @fingerprintjs/fingerprintjs is good library but:
  - doesn't work with cdn (when you run .get() from cdn version the library can't send a request to its own server and only generates disposable id that changes on refresh) but good work with local (npm/node_modules) version
  - has a paid pro version
- clientjs is not bad library but:
  - block eventloop on something like 5 second when you run getFingerprint() method and doesn't have async version and
  - last release Oct 25, 2021
