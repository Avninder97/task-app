const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: 'task_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
// console.log("in db file");
// console.log(pool);

module.exports = pool;