import { sql } from 'slonik';
import { pool } from './postgres.js';
import { formatWithOptions } from 'node:util';

class RollbackError extends Error {}

export const run = async (code) => {
  const queries = code.split(';').filter((query) => !/^\s*$/.test(query));

  try {
    await pool.transaction(async (transaction) => {
      for (const query of queries) {
        const result = await transaction.query(sql([query]));

        console.log(formatWithOptions({ depth: Infinity }, result));
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
