const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.NEON_DB_URL,
  ssl: { rejectUnauthorized: false }
});

const API_KEY = process.env.API_KEY;

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const key = event.headers["x-api-key"];
  if (key !== API_KEY) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  const { name, email, message } = JSON.parse(event.body);

  try {
    await pool.query(
      "INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message]
    );
    return { statusCode: 200, body: "Message saved!" };
  } catch (err) {
    return { statusCode: 500, body: "Database error: " + err.message };
  }
};
