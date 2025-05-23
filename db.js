require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.connect()
    .then(() => console.log("✅ PostgreSQL connected"))
    .catch((err) => console.error("❌ Database connection error:", err));

module.exports = pool;
