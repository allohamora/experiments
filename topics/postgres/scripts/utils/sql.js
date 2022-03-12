import { sql } from 'slonik';
import { pool } from './postgres.js';

class RollbackError extends Error {}

export const run = async (code) => {
  const queries = code.split(';').filter((query) => !/^\s*$/.test(query));

  try {
    await pool.transaction(async (transaction) => {
      for (const query of queries) {
        console.log(await transaction.query(sql([query])));
      }

      throw new RollbackError('rollback');
    });
  } catch (err) {
    if (err instanceof RollbackError) {
      return console.log(err.message);
    }

    throw err;
  }
};
