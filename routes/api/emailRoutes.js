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
        user: 'noreply@aall.net',
        pass: 'd=X6yZuq'
    }
}

let transport = nodemailer.createTransport(options);

router.post('/onceHub', (req, res) => {
    const data = req.body;
    
    sql.connect(config).then(conn=>{
        conn.query(
            `update paychex.dbo.hiring ` +
            `set Status = '${data.status}' ` +
            `where uid = '${data.id}'`
        )
        .then(recordset => {
            res.send(recordset.recordset);
        })
        .then(() => {
            sql.close();
        })
        .then(() => {
            transport.sendMail({
                from:'AALL',
                to:['jaime.gonzalez@aall.net', data.email,'brooklyn.reyes@aall.net'],
                subject:'AALL Insurance - Interview with General Manager',
                html: `<!DOCTYPE html>
                <html>
                    <body>
                        <table>
                            <thead>
                                <tr style = 'text-align: center;'>
                                    <img src = 'https://aall.net/wp-content/uploads/aallleaves.jpg' width = '150px' />
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        Dear, ${data.firstName}.
                                        <br/><br/>
                                        Good news. You've made a good impression with your video interview. We'd like to learn a little bit more about what makes you YOU!
                                        <br/><br/>
                                        We would like you to come in for an in-person interview with our General Manager, Carmen Lopez.
                                        <br/><br/>
                                        <a href = 'https://go.oncehub.com/CarmenLopez'>Click here to schedule your interview.</a> 
                                        <br/><br/>
                                        Thank you,
                                        <br/>
                                        The AALL Hiring Team            
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </body>
                </html>`
            }, (err, info) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(info);
                }
            })
        })
        .catch(err => {
            console.log(err);
        })
    })
})

module.exports = router;