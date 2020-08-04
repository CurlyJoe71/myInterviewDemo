const sql = require('mssql/msnodesqlv8');
const express = require('express');
const router = express.Router();
let singleDataSet = {};

// config object for database, using credentials from sqlserver login
const config = {
    user: "AALLjaime.gonzalez",
    server: "sqlserver",
    database: "Paychex",
    options: {
      trustedConnection: true,
      useUTC: true
    },
    driver: "msnodesqlv8",
    requestTimeout: 80000
};

router.get('/', (req, res) => {
    console.log("get id request made");
    let data = req.body;
    sql.connect(config).then(conn => {
        conn.query(

            `select *, ROW_NUMBER() over (  order by ProcessName ) as rn
            from daily_reports.dbo.bla('2019-11-02', '2019-11-02')` 
           
        )
        .then(recordset => {
            console.log(recordset);
            singleDataSet = recordset.recordset;
            res.send(singleDataSet);
        })
        .then(() => {
            sql.close();
        });
    });

});

module.exports = router;