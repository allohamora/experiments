import { Test } from "./test.js";

const test = new Test();

setInterval(() => {
  test.tick();
}, 2000);

console.log('start');