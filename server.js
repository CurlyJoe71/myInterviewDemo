const express = require('express');
const sql = require('mssql/msnodesqlv8');
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const port = 7581;

let id;
let firstName;
let lastName;
const jsonParser = bodyParser.json();
const urlencodeParser = bodyParser.urlencoded({extended:true});

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/video/:uid.:firstName.:lastName', (req, res) => {
    id = req.params.uid;
    firstName = req.params.firstName;
    lastName = req.params.lastName;
    
    console.log('app.get id:', id);
    checkUID((bool, sqlRes)=>{
        // console.log('callback?', bool, sqlRes)
        let validation = sqlRes.valid;
        if (validation === 'TRUE') {
            res.render(`home`, {
                helpers: {
                    firstName: () => {return firstName;},
                    lastName: () => {return lastName;}
                }
            })
        }
        else {
            res.send("Not looking good...")
        }
    });
    // console.log('validation:', validation);
});

app.post('/update', (req, res) => {
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

app.listen(port, () => console.log(`Running on http://localhost:${port}`));