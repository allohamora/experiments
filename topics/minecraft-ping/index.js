const util = require('minecraft-server-util');

const main = async () => {
  console.log(await util.status('mc.hypixel.net'));
};

main();
