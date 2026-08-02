const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Ignacio1$',
  database: 'hiveedu_eraport',
});

async function getMSE() {
  try {
    await client.connect();
    const res = await client.query('SELECT mse FROM mlr_run_history ORDER BY "createdAt" DESC LIMIT 1');
    if (res.rows.length > 0) {
      console.log('Latest MSE:', res.rows[0].mse);
    } else {
      console.log('No MLR history found.');
    }
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

getMSE();
