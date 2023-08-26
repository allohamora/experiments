import { baseline, group, bench, run } from 'mitata';

const array = Array.from({ length: 100 }, () => `${Math.random()}`);
const set = new Set(array);

const start = array[0];
const middle = array[Math.round(array.length / 2)];
const end = array.at(-1);

group('array.includes vs set.has start', () => {
  baseline('array.includes', () => array.includes(start));
  bench('set.has', () => set.has(start));
});

group('array.includes vs set.has middle', () => {
  baseline('array.includes', () => array.includes(middle));
  bench('set.has', () => set.has(middle));
});

group('array.includes vs set.has end', () => {
  baseline('array.includes', () => array.includes(end));
  bench('set.has', () => set.has(end));
});

group('array.includes vs set.has all', () => {
  baseline('array.includes', () => {
    for (const value of array) {
      array.includes(value)
    }
  });
  bench('set.has', () => {
    for (const value of array) {
      set.has(value)
    }
  });
});

run();