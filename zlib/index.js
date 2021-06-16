const { createGzip, createGunzip } = require('zlib');
const { pipeline } = require('stream');
const { promisify } = require('util');
const { createReadStream, createWriteStream, promises } = require('fs');

const pipe = promisify(pipeline);
const access = promises.access;
const removeFile = promises.rm;

const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch (error) {
    return false;
  }
};

const readAndWrite = async (input, output, ...transformers) => {
  if( !await exists(input) ) throw new Error(`${input} is not exists!`);
  if( await exists(output) ) {
    await removeFile(output);
  }

  const source = createReadStream(input);
  const destination = createWriteStream(output);

  await pipe(source, ...transformers, destination);
}

const to_gzip = async (input, output) => {
  const gzip = createGzip();

  await readAndWrite(input, output, gzip);
};

const from_gzip = async (input, output) => {
  const gunzip = createGunzip();

  await readAndWrite(input, output, gunzip);
};

const main = async () => {
  await to_gzip('text.txt', 'text.txt.gz');
  await from_gzip('text.txt.gz', 'text.txt.raw');
};

main();
