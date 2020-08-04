const sql = require('mssql/msnodesqlv8');
const express = require('express');
const router = express.Router();
const dataSet = [];

// config object for database, using credentials from sqlserver login
const config = {
    user: "AALLjaime.gonzalez",
    server: "sqlserver",
    database: "Paychex",
    options: {
      trustedConnection: true,
      useUTC: true
    },
    driver: "msnodesqlv8"
};


router.post('/', (req, res) => {
    console.log("webhook request", req.body);
})

module.exports = router;