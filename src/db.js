import knex from 'knex';
import { readConfigFileSync } from './helpers';

const config = readConfigFileSync();

const db = knex({
  client: 'mssql',
  connection: {
    host: config.app.db.host,
    user: config.app.db.username,
    password: config.app.db.password,
    database: config.app.db.database
  }
});

export default db;