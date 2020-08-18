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

router.get('/checkID/:uid', (req, res) => {
    id = req.params.uid;
    
    console.log('checking id:', id);
    sql.connect(config).then(conn => {
        conn.query(
            `select valid = case when exists ` +
            `(select * from paychex.dbo.hiring where uid = '${id}') ` +
            `then 'TRUE' else 'FALSE' end`
        )
        .then(recordset => {
            res.send(recordset.recordset);
        })
        .then(() => {
            sql.close();
        })
        .catch(err => {
            console.log('err:', err);
            sql.close();
        })
    })
    // checkUID((bool, sqlRes)=>{
    //     // console.log('callback?', bool, sqlRes)
    //     let validation = sqlRes.valid;
    //     if (validation === 'TRUE') {
    //         // res.render(`home`, {
    //         //     helpers: {
    //         //         firstName: () => {return firstName;},
    //         //         lastName: () => {return lastName;}
    //         //     }
    //         // })
    //         res.send('TRUE');
    //     }
    //     else {
    //         res.send("Not looking good...")
    //     }
    // });
    // console.log('validation:', validation);
});

router.post('/update', (req, res) => {
    const data = req.body;
    console.log('incoming data:', data);
    console.log('testing id value in server', id);
    const pool = new sql.ConnectionPool(config);
    const request = new sql.Request(pool);
    try {
        pool.connect(()=>{
            request.query(
                `update paychex.dbo.hiring ` +
                `set videoid = '${data.testVideoID}' ` +
                `where uid = '${data.candUID}'`
            , (err, res) => {
                if(err) {
                    console.log('err');
                }
                else {
                    // console.log('res:', res.recordset[0]);
                }
            })
        })
    }
    catch (err) {
        console.log('err', err);
    }

    res.json({sentKey1:"sentvalue1"})
});

function checkUID(callBack) {
    console.log('id start of checkUID:', id);
    const pool = new sql.ConnectionPool(config);
    const request =  new sql.Request(pool);
    try {
        pool.connect(() => {
            request.query(
                `select valid = case when exists ` +
            `(select * from paychex.dbo.hiring where uid = '${id}') ` +
            `then 'TRUE' else 'FALSE' end`
            , (err, res) => {
                if(err) {
                    callBack(err);
                }
                else{
                    // console.log(res.recordset);
                    callBack(false,res.recordset[0]);
                }
            });
        });
    }
    catch (error) {
        console.log('error', error);
        callBack(error);
    }
};

// router.get('/:id', (req, res) => {
//     console.log('PARAMS', req.params.id);
//     const userID = req.params.id;

//     sql.connect(config)
//     .then(conn => {
//         conn.query(
//             `select valid = case when exists ` +
//             `(select * from paychex.dbo.hiring where uid = '${userID}') ` +
//             `then 'TRUE' else 'FALSE' end`
//         )
//         .then(recordset => {
//             res.send(recordset.recordset[0]);
//         })
//         .then(() => {
//             sql.close();
//         })
//         .catch(err => {
//             console.log(err);
//             sql.close();
//         })
//     })
// })

// router.post('/update/:id', (req, res) => {
//     console.log('posting PARMAMS ID: ', req.params.id);
//     console.log('here is body object:', req.body);
//     const userID = req.params.id;
//     const videoID = req.body.videoID;

//     sql.connect(config)
//     .then(conn => {
//         conn.query(
//             `update paychex.dbo.hiring ` +
//             `set VideoID = '${videoID}' where UID = '${userID}'`
//         )
//     })
//     .then(recordset => {
//         res.send(recordset.recordset);
//     })
//     .then(() => {
//         sql.close();
//     })
//     .catch(err => {
//         console.log('posting err', err);
//         sql.close();
//     })
// })

module.exports = router;