const sql = require('mssql/msnodesqlv8');
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
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

const options = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'hiringapps@aall.net',
        pass: '*2uAg4Nu'
    }
}

let transport = nodemailer.createTransport(options);

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
});

router.post('/update/:id', (req, res) => {
    const data = req.body;
    console.log('incoming data:', data);
    console.log('testing id value in server', id);
    const reviewLink = 'http://hiring.aall.net:444/video-interview/review/' + data.id;

    transport.sendMail({
        from: 'AALL Hiring Team',
        to: ['jaime.gonzalez@aall.net'],
            // perla.navarro@aall.net, brooklyn.reyes@aall.net]',
        subject: 'Video Update Made',
        html: `<img src='url("/images/aallleaves.jpg")' /><br/>` +
        `${data.firstName} ${data.lastName} has completed their video interview.` +
        `You can go to the Prescreen page (inside terminal): <a href='http://hiring.aall.net:444/prescreen' target="_blank">ATS Prescreen Page</a><br/>` +
        `You can go directly to the Review page (inside terminal): <a href=${reviewLink} target="_blank">Review ${data.firstName}'s Video</a><br/>` +
        `<br/>Note for Dev Team: User id:${data.id}; VideoID = ${data.videoID}.`,
        attachments: []
    }, (err, info) => {
        if (err) {
            console.log('smtp err', err);
        }
        else {
            console.log('smtp info', info);
        }
    })

    sql.connect(config).then(conn => {
        conn.query(
            `update paychex.dbo.hiring ` +
            `set videoid = '${data.videoID}', VideoAdded = getdate() ` +
            `where uid = '${data.id}'`
        )
        .then(recordset => {
            res.send(recordset.recordset);
        })
        .then(()=>{
            sql.close();
        })
        .catch(err => {
            console.log('err:', err);
            sql.close();
        })
    })
    // const pool = new sql.ConnectionPool(config);
    // const request = new sql.Request(pool);
    // try {
    //     pool.connect(()=>{
    //         request.query(
    //             `update paychex.dbo.hiring ` +
    //             `set videoid = '${data.videoID}' ` +
    //             `where uid = '${data.id}'`
    //         , (err, res) => {
    //             if(err) {
    //                 console.log('err');
    //             }
    //             else {
    //                 // console.log('res:', res.recordset[0]);
    //             }
    //         })
    //     })
    // }
    // catch (err) {
    //     console.log('err', err);
    // }

    // res.json({sentKey1:"sentvalue1"})
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