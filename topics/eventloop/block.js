const SIZE = 90000000;

const hardwork = () => {
  for (let i = 0; i < SIZE; i++) {}
}

let chain = () => console.log('done');

for (let i = 0; i < 100; i++) {
  const original = chain;

  chain = () => {
    console.log(`hardwork iteration ${i + 1}`);

    const fn = () => {
      hardwork();
      original();
    };

    // block the event loop because of the PromiseJobs queue that executed all resolved promises after the same phase
    // Promise.resolve().then(fn);

    // the same, because not just promises are related to PromiseJobs queue, but all microtasks
    // queueMicrotask(fn);

    // without blocking, because setTimeout is a macrotask
    setTimeout(fn);
  }
}

chain();

console.log('start');

setInterval(() => {
  console.log('tick');
}, 100);
