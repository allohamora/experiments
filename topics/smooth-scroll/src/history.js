/**
 *
 * @param {string} hash
 * @returns {void}
 */
export const replaceHash = (hash) => history.replaceState(null, document.title, hash);
