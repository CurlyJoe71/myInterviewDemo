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

router.post('/prescreen/:id', (req, res) => {
    // console.log("post preScreen update made", req.params.id);
    const data = req.body;
    console.log('check notes:', data["PrescreenNotes"]);
    data["PrescreenNotes"] = data["PrescreenNotes"].replace(/'/g, "''");
    console.log('after replace,', data["PrescreenNotes"]);
    const id = req.params.id;
    // sql.connect(config).then(conn => {
    //     conn.query(
    sql.connect(config).then(conn=>{
        conn.query(
            `update paychex.dbo.hiring ` +
            `set Friendliness = ${data["Friendliness"]}, ` +
            `Effectiveness = ${data["Effectiveness"]}, ` +
            `Clarity = ${data["Clarity"]}, ` +
            `Spanish = ${data["Spanish"]}, ` +
            `English = ${data["English"]}, ` +
            `PrescreenNotes = '${data["PrescreenNotes"]}' ` +
            `where uid = '${data["UID"]}'`
        )
        .then(recordset => {
            console.log("update prescreen recordset", recordset);
            // dataSet[0] = recordset.recordset;
            // res.send(dataSet);
            res.send("Success")
        })
        .then(() => {
            sql.close();
        })
        .catch(err => {
            console.log(err);
            res.send("Error");
            sql.close();
        })
    })
})

router.post('/:id', (req, res) => {
    console.log("post root request made", req.body);
    const data = req.body
    let name = data.candName.includes("'");
    let name2 = data.candName.replace("'", "''");
    data.candName = name2;
    if (name) {
        console.log("name2", name2);
    }

    const convertDateToSQL = date => {
        if(!date) {
            return "null";
        }
        else {
            return "'" + date + "'";
        }
    }

    // if (!data.dateFirstEmail) {
    //     data.dateFirstEmail = "null";
    // }
    // else {
    //     data.dateFirstEmail = "'" + data.dateFirstEmail + "'"
    // }

    // if (!data.datePreScreen) {
    //     data.datePreScreen = "null";
    // }
    // else {
    //     data.datePreScreen = "'" + data.datePreScreen + "'"
    // }

    if (data.timePreScreen == '0:00:00' || !data.timePreScreen) {
        data.timePreScreen = "null";
    }
    else {
        data.timePreScreen = "convert(time, '" + data.timePreScreen + "')"
    }

    // if (!data.dateGenManager) {
    //     data.dateGenManager = "null";
    // }
    // else {
    //     data.dateGenManager = "'" + data.dateGenManager + "'"
    // }

    if (data.timeGenManager == '0:00:00' || !data.timeGenManager) {
        data.timeGenManager = "null"
    }
    else {
        data.timeGenManager = "convert(time, '" + data.timeGenManager + "')"
    }

    // if (!data.candRejectionLetter) {
    //     data.candRejectionLetter = "null";
    // }
    // else {
    //     data.candRejectionLetter = "'" + data.candRejectionLetter + "'"
    // }

    // if (!data.hiringDate ) {
    //     data.hiringDate = "null" 
    // }
    // else {
    //     data.hiringDate = "'" + data.hiringDate + "'"
    // }

    if (data.goNoGo1 === true) {
        data.goNoGo1 = 1
    }
    else if (data.goNoGo1 === false) {
        data.goNoGo1 = 0
    }

    if (data.goNoGo2 === true) {
        data.goNoGo2 = 1
    }
    else if (data.goNoGo2 === false) {
        data.goNoGo2 = 0
    }

    if (data.goNoGo3 === true) {
        data.goNoGo3 = 1
    }
    else if (data.goNoGo3 === false) {
        data.goNoGo3 = 0
    }

    sql.connect(config).then(conn => {
        conn.query(
            "update paychex.dbo.Hiring" +
            " set [Candidate Name] = '" + data.candName + "'" +
            ", [Email] = '" + data.candEmail + "'" +
            ", [Location] = '" + data.candLocation + "'" + 
            ", [Phone Number] = '" + data.candPhone + "'" +
            ", [Active] = '" + data.candActive + "'" +
            ", [Resume] = '" + data.candResume + "'" +
            ", [Date First Email] = " + convertDateToSQL(data.dateFirstEmail) + "" +
            ", [Date of Prescreen] = " + convertDateToSQL(data.datePreScreen) + "" +
            ", [Time of Prescreen] = " + data.timePreScreen + "" +
            ", [Referral Name] = '" + data.candReferral + "'" +
            ", [Added By] = '" + data.candAddedBy + "'" +
            ", [Rejection Letter] = " + convertDateToSQL(data.candRejectionLetter) + "" +
            ", [Hire Date] = " + convertDateToSQL(data.hiringDate) + "" +
            ", [Date Gen Manager] = " + convertDateToSQL(data.dateGenManager) + "" +
            ", [Time Gen Manager] = " + data.timeGenManager + "" +
            ", [Go or No Go 1] = " + data.goNoGo1 + "" +
            ", [Go or No Go 2] = " + data.goNoGo2 + "" +
            ", [Go or No Go 3] = " + data.goNoGo3 + "" +
            " where ID = " + data.id
        )
        .then(recordset => {
            console.log(recordset);
            dataSet[0] = recordset.recordset;
            res.send(dataSet);
        })
        .then(() => {
            sql.close();
        })
        .catch(err => {
            console.log(err);
            sql.close();
        })
    });

});

module.exports = router;