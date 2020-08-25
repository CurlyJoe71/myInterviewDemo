const sql = require("mssql/msnodesqlv8");
let dataSet = [];
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

exports.getManagers = (req, res) => {
    sql.connect(config)
    .then(conn => {
        conn
        .query(
            "select emp2.firstname, emp2.lastname,o.manager, o.email, oh.oncehublink " +
            "from lobby_queue.dbo.office_managers o " +
            "left join paychex.dbo.oncehub_links oh on oh.manager = o.manager " +
            "cross apply ( " +
            "select top 1 * from daily_reports.dbo.employees emp " +
            "where emp.[instar initials] = o.manager " +
            "order by emp.effdate desc " +
            ") emp2 " +
            "where o.enddate is null " +
            "and oh.oncehublink is not null " +
            "and emp2.firstname is not null " +
            "group by o.manager, o.email, oh.oncehublink, emp2.firstname, emp2.lastname"
        )
        .then(recordset => {
            console.log('get man recordset:', recordset.recordset);
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
}

exports.get = (req, res) => {
    console.log('controller id req made');
    console.log(req.params.id);

    sql.connect(config).then(conn => {
        conn.query(
            "SELECT ratingAvg = (h.Friendliness + h.Clarity + h.Effectiveness + h.English + h.Spanish) / 5, " +
            " fullName = det.FirstName + ' ' + det.LastName, * from paychex.dbo.Hiring h " +
            "left join paychex.dbo.HiringDetails det on h.uID = det.id " +
            "where h.uid = '" + req.params.id + "'"
        )
        .then(recordset => {
            singleDataSet = recordset.recordset;
            res.send(singleDataSet);
        })
        .then(() => {
            sql.close();
        })
        .catch(err => {
            console.log(err);
            sql.close();
        })

    });
}

exports.getAll = (req, res) => {
    console.log('controller req made, getAll');

    sql.connect(config).then(conn => {
        conn
        .query(
            "Select h.id, " +
            "ratingAvg = (h.Friendliness + h.Clarity + h.Effectiveness + h.English + h.Spanish) / 5, " +
            "* from paychex.dbo.Hiring h " +
            "left join paychex.dbo.hiringdetails d on d.id = h.uid " +
            "order by h.ID DESC"
        )
        .then(recordset => {
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

    })
}

exports.getPage = (req, res) => {
    console.log("req.body", req.params);

    let perPage = req.params.perPage;
    let offset = req.params.offset;

    console.log("offset, perPage", offset, perPage);

    sql.connect(config).then(conn => {
        conn
        .query(
            "select *, (select count(ID) from paychex.dbo.hiring) as Count from paychex.dbo.hiring" +
            " order by Active DESC, [dateCreated] desc, ID desc" +
            " offset " + offset + " rows" + 
            " fetch next " + perPage + " rows only"
        )
        .then(recordset => {
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

    })
}


exports.addNew = () => {
    console.log("add new path");
}

exports.getQuestions = (req, res) => {
    console.log("getting questions");

    sql.connect(config).then(conn => {
        conn
        .query(
            `select * from paychex.dbo.hiringquestions`
        )
        .then(recordset => {
            dataSet[0] = recordset.recordset;
            res.send(dataSet)
        })
        .then(() => {
            sql.close();
        })
        .catch(err => {
            console.log(err);
            sql.close();
        })

    })
}

exports.getPreScreenCandidates = (req, res) => {
    console.log("getting prescreen candidates");

    sql.connect(config).then(conn => {
        conn
        .query(
            `select h.[Candidate Name]` + 
            `, h.[ID]` +
            `, h.[Resume]` +
            `, h.[Date of Prescreen]` +
            `, h.[Time of Prescreen]` +
            `, h.[Phone Number]` +
            `, h.[Source]` +
            `, h.[Referral Name]` +
            `, h.[Date First Email]` +
            `, h.[Active]` +
            `, h.[Location]` +
            `, h.[Added By]` +
            `, h.[Email]` +
            ` from paychex.dbo.hiring h` +
            // ` left join paychex.dbo.hiringpreresponses pre on pre.CandID = h.ID` +
            ` where h.[Date of Prescreen] is not null` +
            // ` and pre.[pre13_Recommend] is null` +
            ` and h.[Go or No Go] is null` +
            ` order by h.[Candidate Name]`
        )
        .then(recordset => {
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
    })
}

