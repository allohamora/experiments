const { helloWorld, sum } = require('../build/Release/addon.node');

console.log('helloWorld(): ', helloWorld());
console.log('sum(1, 2): ', sum(1, 2));
