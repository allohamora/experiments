import fsp from 'node:fs/promises';

export const fileWatcher = async (path, onChange) => {
  try {
    const watcher = fsp.watch(path);
    const runChangeHandler = async () => await Promise.resolve(onChange()).catch(console.error);

    await runChangeHandler();

    for await (const event of watcher) {
      await runChangeHandler();
    }
  } catch (error) {
    console.log(error);
  }
};
