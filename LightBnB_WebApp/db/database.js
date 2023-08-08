const { Pool } = require("pg");

const config = {
  user: "labber",
  password: "123",
  host: "localhost",
  database: "lightbnb",
};

const pool = new Pool(config);

const query = (query, params, callback) => {
  return pool.query(query, params, callback);
};

pool.connect().then(() => {
  console.log("Connected to database...");
});

module.exports = {
  query,
};
