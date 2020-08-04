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

const pool1 = new sql.ConnectionPool(config);
const pool2 = new sql.ConnectionPool(config);
const pool3 = new sql.ConnectionPool(config);
let conn1 = pool1;
let conn2 = pool2;
let conn3 = pool3;

router.post('/', (req, res) => {
    console.log("post request made", req.body);
    let data = req.body;
    if (data.candActive === true) {
        data.candActive = 1;
    }
    else {
        data.candActive = 0
    }

    conn1.connect().then(() => {
        let req1 = new sql.Request(conn1);
        req1.query(
            "if exists (select * from paychex.dbo.hiring where [Candidate Name] = '" + data.candName + "' and [Phone Number] = '" + data.candPhone + 
            "' and email = '" + data.candEmail + "')" + " select top 1 * from paychex.dbo.hiring" + 

            " else insert into paychex.dbo.Hiring ([Candidate Name], [Email], [Location], [Phone Number], [Resume], [Active], [Source], [Referral Name], [Added By], [Date First Email]) " +
            "values ('" + data.candName + "', '" + data.candEmail + "', '" + data.candLocation + "', '" + data.candPhone
             + "', '" + data.candResume + "', " + data.candActive + ", '" + data.candSource + "', '" + data.candReferral + "', '" + data.candAddedBy + "', getdate())"
        )
        .then(recordset => {
            console.log("this is the post recordset", recordset);
            console.log("reowsAffected", recordset.rowsAffected[0]);
            dataSet[0] = recordset.recordset;
            dataSet[1] = recordset.rowsAffected[0];
            res.send(dataSet);
            conn1.close();
        })
        .catch((err) => {
            console.log(err);
            conn1.close();
        })
    })
    .catch(err => {
        console.log(err);
        conn1.close();
    })

    // sql.connect(config).then(conn => {
    //     conn1.query(

    //         "if exists (select * from paychex.dbo.hiring where [Candidate Name] = '" + data.candName + "' and [Phone Number] = '" + data.candPhone + 
    //         "' and email = '" + data.candEmail + "')" + " select top 1 * from paychex.dbo.hiring" + 

    //         " else insert into paychex.dbo.Hiring ([Candidate Name], [Email], [Location], [Phone Number], [Resume], [Active]) " +
    //         "values ('" + data.candName + "', '" + data.candEmail + "', '" + data.candLocation + "', '" + data.candPhone
    //          + "', " + "'" + data.candResume + "', " + data.candActive + ")"
           
    //     )
    //     .then(recordset => {
    //         console.log("this is the recordset", recordset);
    //         console.log("rowsAffected", recordset.rowsAffected[0]);
    //         dataSet[0] = recordset.recordset;
    //         dataSet[1] = recordset.rowsAffected[0];
    //         // dataSet[0] = recordset.rowsAffected[0];
    //         res.send(dataSet);
    //     })
    //     .then(() => {
    //         sql.close();
    //     })
    //     .catch(err => {
    //         res.send(err);
    //     })
    // });

});

router.post('/emailNewCandidate', (req, res) => {
    console.log("rec'd email new cand request", req.body);
    let data = req.body;

    conn1.connect().then(() => {
        let req1 = new sql.Request(conn1);
        req1.query(
            `EXEC Daily_Reports.dbo.SendEmailWithTemplate 
            @profile_name='AALL', 
            @subject='AALL Insurance Employment Interest', 
            @body=
            '<!DOCTYPE html><html><head></head><body><p>Good Morning,<br />Thank you for your interest in working for aall.net. We received your resume in response to our job posting for a Bilingual - Customer Service Respresentative. Your background and skillset are impressive and we are excited about a potential opportunity. Join a growing company that is a leader in the insurance industry! We would like to schedule an <strong>initial phone interview</strong> with you.</p>
            <p><strong>Please click on the following link to book a time that works for you within our schedule - </strong><a href="https://calendly.com/dulce-morales/prescreen">Click here to schedule.</a>
            <p>A hiring team member will call you at the time you select. We look forward to speaking with you soon.</p>
            <p>Best Regards,</p><p><strong>AALL Hiring Team</strong></p></body></html>', 
            @body_format='HTML', 
            @recipients='${data.candEmail}';`
        )
        .then(recordset => {
            console.log("this is recordset from emailing", recordset);
            res.send(recordset);
            conn1.close();
        })
        .catch(err => {
            console.log(err);
            conn1.close();
        })
    })
    .catch(err => {
        console.log(err);
        conn1.close();
    })

    // sql.connect(config).then(conn => {
    //    conn1.query(
    //         `EXEC Daily_Reports.dbo.SendEmailWithTemplate 
    //         @profile_name='AALL', 
    //         @subject='AALL Insurance Employment Interest', 
    //         @body=
    //         '<!DOCTYPE html><html><head></head><body><p>Good Morning,<br />Thank you for your interest in working for aall.net. We received your resume in response to our job posting for a Bilingual - Customer Service Respresentative. Your background and skillset are impressive and we are excited about a potential opportunity. Join a growing company that is a leader in the insurnace industry! We would like to schedule an <strong>initial phone interview</strong> with you.</p>
    //         <p><strong>Please click on the following link to book a time that works for you within our schedule - </strong><a href="https://calendly.com/dulce-morales/prescreen">Click here to schedule.</a>
    //         <p>A hiring team member will call you at the time you select. We look forward to speaking with you soon.</p>
    //         <p>Best Regards,</p><p><strong>AALL Hiring Team</strong></p></body></html>', 
    //         @body_format='HTML', 
    //         @recipients='${data.candEmail}';`
    //     )
    //     .then(recordset => {
    //         console.log("this is the recordset from emailing", recordset);
    //         dataSet[0] = recordset.recordset;
    //         dataSet[1] = recordset.rowsAffected[0];
    //         res.send(dataSet);
    //     })
    //     .then(() => {
    //         sql.close();
    //     })
    // })
})

router.post('/checkEmailStatus', (req, res) => {
    let date = new Date();

    console.log('starting the checkEmail function', date);
    let data = req.body;

    conn1.connect().then(() => {
        let req1 = new sql.Request(conn1);
        setTimeout(() => {
            req1.query(
                `declare @recipients varchar(50) = '${data.candEmail}';` +
                `select msdb.sent_status from msdb.dbo.sysmail_faileditems msdb where msdb.recipients = @recipients and convert(date, msdb.sent_date) = convert(date, getdate())`
            )
            .then(recordset => {
                let sentStatus;
                console.log("checkEmail done at: ", new Date());
                // console.log("recordset.set_status", recordset.recordset.sent_status);
                // console.log("dataset 0 0 sent_status", dataSet[0][0].sent_status);
                dataSet[0] = recordset.recordset;
                console.log("successful dataset[0] length", dataSet[0].length);
                if (dataSet[0].length === 0) {
                    sentStatus = 'succeeded';
                }
                else {
                    sentStatus = dataSet[0][0].sent_status;
                }

                if (sentStatus == 'failed') {
                    console.log("sentStatus is failed");
                    conn2.connect().then(() => {
                        let req2 = new sql.Request(conn2);

                        req2.query(
                            `update paychex.dbo.hiring set [Date First Email] = null where id = ${data.candID}`
                        )
                        .then(recordset => {
                            console.log("failed email sent to Hiring");

                            conn3.connect().then(() => {
                                let req3 = new sql.Request(conn3);

                                req3.query(
                                    `EXEC Daily_Reports.dbo.SendEmailWithTemplate 
                                    @profile_name='AALL', 
                                    @subject='New Candidate Added; FAILED Email', 
                                    @body=
                                    '<!DOCTYPE html><html><head></head><body><p>Hello,<br />This email is intended to inform you that a new candidate has been added to the database but the "Welcome" email failed to send.</p>
                                    <p>Please check the email address and update the database.</p>
                                    <p>Candidate''s name: ${data.candName}</p>
                                    <p>Candidate''s email: ${data.candEmail}</p>
                                    <p><strong>Thank you!</strong></p></body></html>', 
                                    @body_format='HTML', 
                                    @recipients='jaime.gonzalez@aall.net'`
                                )
                                .then(recordset => {
                                    res.send({status: "failed"})
                                    conn3.close();
                                })
                                .catch(err => {
                                    console.log(err);
                                    conn3.close();
                                })
                            })
                            // res.send({status: "failed"});
                            conn2.close();
                        })
                        .catch(err => {
                            console.log(err);
                            conn2.close();
                        })
                    })
                }
                else {
                    console.log("sentStatus is undefined");
                    conn2.connect().then(() => {
                        let req2 = new sql.Request(conn2);

                        req2.query(
                            `update paychex.dbo.hiring set [Date First Email] = getDate() where id = ${data.candID}`

                        )
                        .then(recordset => {

                            conn3.connect().then(() => {
                                let req3 = new sql.Request(conn3);

                                req3.query(
                                            
                                    `EXEC Daily_Reports.dbo.SendEmailWithTemplate 
                                    @profile_name='AALL', 
                                    @subject='New Candidate Added & Emailed', 
                                    @body=
                                    '<!DOCTYPE html><html><head></head><body><p>Hello,<br />This email is intended to inform you that a new candidate has been added to the database and the "Welcome" email was successfully sent.</p>
                                    <p>Candidate''s name: ${data.candName}</p>
                                    <p>Candidate''s email: ${data.candEmail}</p>
                                    <p><strong>Thank you!</strong></p></body></html>', 
                                    @body_format='HTML', 
                                    @recipients='jaime.gonzalez@aall.net';`
                                )
                                .then(recordset => {
                                    res.send({status: "success"})
                                    conn3.close();
                                })
                                .catch(err => {
                                    console.log(err);
                                    conn3.close();
                                })
                            })
                            // console.log("success email sent to Hiring");
                            // res.send({status: "success"});
                            conn2.close();
                        })
                        .catch(err => {
                            console.log(err);
                            conn2.close();
                        })
                    })
                }
                // res.status(200).send({ sent: "did this get sent?"})
                conn1.close();
            })
            .catch(err => {
                console.log(err);
                conn1.close();
            })

        }, 68000)
    })
    .catch(err => {
        console.log(err);
        conn1.close();
    })
    // setTimeout(() => {
    //     console.log("checking data is valid in setTimeout:", data);
    //     sql.connect(config).then(conn => {
    //        conn1.query(
    //             `declare @recipients varchar(50) = '${data.candEmail}';` +
    //             `select msdb.sent_status from msdb.dbo.sysmail_faileditems msdb where msdb.recipients = @recipients and convert(date, msdb.sent_date) = convert(date, getdate())`
    //         )
    //         })
    //         .then(recordset => {
    //             date = new Date();
    //             console.log("checkEmail done at: ", date)
    //             console.log("response from checkEmail: ", recordset);
    //             res.send(recordset)
    //         })
    //         // .then(() => {
    //         //     sql.close();
    //         // })
    //         // .catch(err => {
    //         //     console.log(err);
    //         // })
            
    // }, 60000);

})

module.exports = router;