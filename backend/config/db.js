require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mysql = require("mysql2/promise");

// --- Database Connection Pool ---
// Uses environment variables for all connection parameters.
// DB_PORT is supported for cloud providers that use non-standard ports (e.g., Railway).
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lihqet_books",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// --- Connection Test with Retry ---
// Docker containers may start before MySQL is fully ready.
// This retries the connection a few times before giving up.
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

async function testConnection(retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const connection = await pool.getConnection();
      console.log("✅ Connected to MySQL successfully!");
      connection.release();
      return;
    } catch (err) {
      console.error(
        `❌ Database connection attempt ${attempt}/${retries} failed: ${err.message}`
      );
      if (attempt < retries) {
        console.log(`   Retrying in ${RETRY_DELAY_MS / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      } else {
        console.error("❌ All connection attempts failed. Server will continue but DB queries will fail.");
      }
    }
  }
}

testConnection();

module.exports = pool;
