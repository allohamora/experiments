import util from 'util';

const createDebug = (section) =>
  util.debug(section, (fn) => {
    fn('%s debug enabled', section);
  });

const debugSum = createDebug('math.sum');
const debugLog = createDebug('log');
const debugRest = createDebug('rest');

const debug = (...debugFuncs) => {
  for (const debugFun of debugFuncs) {
    debugFun('debug');
  }
};

debug(debugSum, debugLog, debugRest);
