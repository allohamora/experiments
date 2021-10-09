const Dataloader = require('dataloader');

const users = Array.from({ length: 10 }, (_, i) => ({ id: i, name: i }));

const usersDataloader = new Dataloader(async (ids) => {
  console.log('batch-function');
  console.log(ids);

  const state = ids.reduce((state, id) => {
    state[id] = null;

    return state;
  }, {});

  users.forEach((user) => {
    if (state[user.id] === undefined) return;

    state[user.id] = user;
  });

  return ids.map((id) => state[id]);
});

(async () => {
  const data = await Promise.all([usersDataloader.load(0), usersDataloader.load(5), usersDataloader.load(8)]);

  console.log('task-1');
  console.log(data);
})();

(async () => {
  const data = await usersDataloader.loadMany([0, 4, 2]);

  console.log('task-2');
  console.log(data);
})();
