const net = new brain.NeuralNetwork();

const trainingSample = [
  { input: [255, 255, 255], output: { white: 1 } },
  { input: [0, 0, 0], output: { black: 1 } },
];

net.train(trainingSample);

const output = net.run([255, 255, 255]);
console.log(output);
