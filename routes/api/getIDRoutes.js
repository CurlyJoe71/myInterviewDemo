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
    driver: "msnodesqlv8"
};

router.get('/', (req, res) => {
    console.log("get id request made");
    let data = req.body;
    sql.connect(config).then(conn => {
        conn.query(

            `select top 1 *
            from Paychex.dbo.Hiring
            order by ID desc` 
           
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

router.get('/:candName/:candEmail/:candPhone', (req, res) => {
    console.log("request for id of existing made");
    let data = req.params;
    console.log("req.params", req.params);
    sql.connect(config).then(conn => {
        conn.query(

            `select id from paychex.dbo.hiring where [Candidate Name ] = '${data.candName}' and Email = '${data.candEmail}' and [Phone Number] = '${data.candPhone}'`
        )
        .then(recordset => {
           // console.log("recordset", recordset);
            res.send(recordset.recordset);
        })
        .then(() => {
            sql.close();
        })
    })
})

module.exports = router;