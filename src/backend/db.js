const mysql = require("mysql2/promise");

// Database connection
const createDbConnection = async () => {
  return await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // Add your MySQL password here if needed
    database: "agorawin",
  });
};

module.exports = { createDbConnection };
