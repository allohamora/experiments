import { fromEvent, map } from 'rxjs';

const createId = () => `${Math.random()}`;

const setButton = document.querySelector('.set') as Element;

fromEvent(setButton, 'click')
  .pipe(
    map(() => {
      const key = createId();
      localStorage.setItem(key, 'test');

      return key;
    }),
  )
  .subscribe((key) => console.log(`new key: ${key}`));

const getButton = document.querySelector('.get') as Element;

fromEvent(getButton, 'click')
  .pipe(map(() => localStorage))
  .subscribe(console.log);

fromEvent<StorageEvent>(window, 'storage')
  .pipe(map((event) => event.key))
  .subscribe((key) => console.log(`changed key from another tab: ${key}`));
