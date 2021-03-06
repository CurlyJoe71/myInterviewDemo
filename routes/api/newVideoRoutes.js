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
            `if exists ` +
            `(select 1 where '${id}' like replace('00000000-0000-0000-0000-000000000000', '0', '[0-9a-fA-F]')) ` +
            `if exists ` +
            `(select * from paychex.dbo.hiring where uid = '${id}') ` +
            `select Area, Valid = 'TRUE' ` +
            `from paychex.dbo.hiringdetails where id = '${id}' ` +
            `else ` +
            `select Valid = 'FALSE' ` +
            `else ` +
            `select Valid = 'FALSE'`
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
    const reviewLink = 'https://hiringadmin.aall.net:7161/video-interview/review/' + data.id;

    transport.sendMail({
        from: 'AALL Hiring Team',
        to: ['jaime.gonzalez@aall.net','perla.navarro@aall.net', 'brooklyn.reyes@aall.net'],
        // to: ['jaime.gonzalez@aall.net'],
        subject: 'Video Update Made',
        html: `<!DOCTYPE html><html><body><table><thead><tr style="text-align:center"><img src="https://aall.net/wp-content/uploads/aallleaves.jpg" width="150px" alt="AALL Hiring Logo" border="0"></tr></thead></table>` +
        `<br/>${data.firstName} ${data.lastName} has completed their video interview.` +
        `You can go to the Prescreen page: <a href='https://hiringadmin.aall.net:7161/prescreen' target="_blank">ATS Prescreen Page</a><br/>` +
        `You can go directly to the Review page: <a href=${reviewLink} target="_blank">Review ${data.firstName}'s Video</a><br/>` +
        `<br/>Note for Dev Team: User id:${data.id}; VideoID = ${data.videoID}.</body></html>`,
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
            `set videoid = '${data.videoID}', VideoAdded = getdate(), Status = 'Pending Prescreen Review' ` +
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
});

router.post('/updateSouth/:id', (req, res) => {
    const data = req.body;
    console.log('incoming data:', data);
    console.log('testing id value in server', id);
    const reviewLink = 'https://hiringadmin.aall.net:7161/video-interview/review/' + data.id;

    transport.sendMail({
        from: 'AALL Hiring Team',
        to: ['jaime.gonzalez@aall.net','perla.navarro@aall.net', 'brooklyn.reyes@aall.net', 'brenda.sanchez@aall.net'],
        // to: ['jaime.gonzalez@aall.net'],
        subject: `${data.area} Candidate - Video Update Made`,
        html: `<!DOCTYPE html><html><body><table><thead><tr style="text-align:center"><img src="https://aall.net/wp-content/uploads/aallleaves.jpg" width="150px" alt="AALL Hiring Logo" border="0"></tr></thead></table>` +
        `<br/>${data.firstName} ${data.lastName} has completed their video interview and have indicated in their application that they're interested in working with the ${data.area} team.` +
        `We are bypassing the Prescreening and General Manager reviews. ` +
        `<br/>` +
        `You can go directly to the Manager page to review and send them your OnceHub link: <a href="https://hiringadmin.aall.net:7161/manager" target="_blank">Go to Manager page.</a><br/>` +
        `<br/>Note for Dev Team: User id:${data.id}; VideoID = ${data.videoID}.</body></html>`,
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
            `set videoid = '${data.videoID}', VideoAdded = getdate(), Status = 'Pending Manager Invitation', ManagerRef = 'BSAN' ` +
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
});

router.post('/updateGGD/:id', (req, res) => {
    const data = req.body;
    console.log('incoming data:', data);
    console.log('testing id value in server', id);
    const reviewLink = 'https://hiringadmin.aall.net:7161/video-interview/review/' + data.id;

    transport.sendMail({
        from: 'AALL Hiring Team',
        to: ['jaime.gonzalez@aall.net','perla.navarro@aall.net, brooklyn.reyes@aall.net','maria@aall.net'],
        // to: ['jaime.gonzalez@aall.net'],
        subject: 'GGD Candidate - Video Update Made',
        html: `<!DOCTYPE html><html><body><table><thead><tr style="text-align:center"><img src="https://aall.net/wp-content/uploads/aallleaves.jpg" width="150px" alt="AALL Hiring Logo" border="0"></tr></thead></table>` +
        `<br/>${data.firstName} ${data.lastName} has completed their video interview and have indicated in their application that they're interested in working with the GGD team.` +
        `Per your request, this Candidate is bypassing the Prescreening and General Manager reviews. ` +
        `<br/>` +
        `You can go directly to the Manager page to review and send them your OnceHub link: <a href="https://hiringadmin.aall.net:7161/manager" target="_blank">Go to Manager page.</a><br/>` +
        `<br/>Note for Dev Team: User id:${data.id}; VideoID = ${data.videoID}.</body></html>`,
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
            `set videoid = '${data.videoID}', VideoAdded = getdate(), Status = 'Pending Manager Invitation', ManagerRef = 'MRE' ` +
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
});

// function checkUID(callBack) {
//     console.log('id start of checkUID:', id);
//     const pool = new sql.ConnectionPool(config);
//     const request =  new sql.Request(pool);
//     try {
//         pool.connect(() => {
//             request.query(
//                 `select valid = case when exists ` +
//             `(select * from paychex.dbo.hiring where uid = '${id}') ` +
//             `then 'TRUE' else 'FALSE' end`
//             , (err, res) => {
//                 if(err) {
//                     callBack(err);
//                 }
//                 else{
//                     // console.log(res.recordset);
//                     callBack(false,res.recordset[0]);
//                 }
//             });
//         });
//     }
//     catch (error) {
//         console.log('error', error);
//         callBack(error);
//     }
// };

// function testEmail() {
//     transport.sendMail({
//         from: 'AALL Hiring Team',
//         to: ['jaime.gonzalez@aall.net'],
//         subject: 'Video Update Made',
//         html: `<!DOCTYPE html><html><body><table><thead><tr style="text-align:center"><img src="https://aall.net/wp-content/uploads/aallleaves.jpg" width="150px" alt="AALL Hiring Logo" border="0"></tr></thead></table>` +
//         `<br/></body></html>`,
//         attachments: []
//     }, (err, info) => {
//         if (err) {
//             console.log('smtp err', err);
//         }
//         else {
//             console.log('smtp info', info);
//         }
//     })

// }

// testEmail();

module.exports = router;