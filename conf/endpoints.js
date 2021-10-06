const axios = require('axios')
const creds = require('./creds.js')
const moment = require('moment')
const Web3 = require('web3')
const jwt = require('jsonwebtoken');
const randomstring = require("randomstring");

const testnet = 'https://data-seed-prebsc-1-s1.binance.org:8545'
const mainnet = 'https://bsc-dataseed1.binance.org:443'

async function main() {

    const web3 = new Web3(testnet);

    const account = await web3.eth.accounts.create();
    console.log(account);
}

//main()
/* address: '0x17A67ad9844a8f4e34482Bb78844CF704b22303B',
  privateKey: '0x738ec021b8b7018274dc688d023eef6bbc0c82ae5876a3ef3623f44aca667101', */


async function bal() {
    const addr = '0x17A67ad9844a8f4e34482Bb78844CF704b22303B'
    const web3 = new Web3(testnet);
    const balance = await web3.eth.getBalance(addr)
    const transactions = await web3.eth.getTransactionCount(addr)
    const chain = await web3.eth.getChainId()
    console.log((balance/(10**18)).toFixed(8), transactions, chain)
} 


//bal()


/* const web3 = new Web3(testnet);
web3.eth.getBalance('0x17A67ad9844a8f4e34482Bb78844CF704b22303B')
.then(res => {
    console.log(res,'balance')
}) */



const ensureToken = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    console.log(req.headers.authorization,bearerHeader,'BEARER')
    
    
    if (typeof req.headers.authorization != undefined) {
        req.token = req.headers.authorization;
        next()
    } else {
        res.json({
            protected: 'NO access'
        })
    }
}

//commit


//operation, table, data, conditions

const queryDB = ({...x}) =>{

    const dbDataSelect = JSON.stringify({
        "operation": x.operation,
        "sql": x.conditions
        //"SELECT * FROM dev.dog WHERE id = 1"
    })

    const dbDataUpsert = JSON.stringify({
        "operation": x.operation,
        "schema": "dev",
        "table": x.table,
        "records": x.data
    })

    const dbData = (x.operation === 'sql') ? dbDataSelect : dbDataUpsert

    return {
    method: 'post',
    url: creds.url,
    headers: creds.headers,
    data : dbData
  };
} 

const workWithBase = (x) => {
    return new Promise((resolve, reject) => {
        axios(x)
            .then( (response) => {
                console.log(JSON.stringify(response.data));
                resolve(response.data)
            })
            .catch( (error) => {
                console.log(error);
                reject(error)
            });
    })
}


const testDB = {
    operation: 'sql', //insert, 
    table: 'users',
    data:[{email:'user@user.com', date:moment().format('DD.MM.YYYY HH:mm:ss')}],
    conditions: "SELECT * FROM dev.users WHERE email = 'user@user.com'"
}


/* workWithBase(queryDB(testDB))
.then(res => {
    console.log(res,'PROMISE DB')
})   */






/* const data = JSON.stringify({
    "operation": "create_table",
    "schema": "dev",
    "table": "breed",
    "hash_attribute": "id"
});

const configDB = (data) => {
    return{
        method: 'post',
        url: creds.url,
        headers: creds.headers,
        data : data
    }
};

axios(configDB(data))
.then( (response) =>{
  console.log(JSON.stringify(response.data));
})
.catch( (error) => {
  console.log(error);
}); */
  
const protected = randomstring.generate(100);
console.log(protected)

const appRouter = (app, next) => {

    app.get('/',(req,res)=>{
        res.json({
            answer:'welcome api'
        })
    })

    app.post('/test',(req,res)=>{
        console.log(req.body)
        res.json({
            req:req.body,
            time: moment().format('HH:mm:ss DD/MM/YYYY'),
            answer:'ok'
        })
    })

    app.post('/login', async (req, res) => {
        
        const login = req.body.login
        const pass = req.body.pass
        console.log(login, pass)
        
        const checkUser = await workWithBase(queryDB({
            operation: 'sql',
            conditions: `SELECT * FROM dev.users WHERE email = '${login}' AND pass = '${pass}'`
        }))

        const isExist = (checkUser.length > 0) ? true : false
        const token = (checkUser.length > 0) ? jwt.sign({id: checkUser[0].id}, protected) : false

       
        


        console.log(isExist,'CHECK USER')
        res.json({
           data:req.body,
           user:checkUser[0].id,
           isExist,
           token
        })
    })


    app.post('/signup', async(req, res) => {

        const login = req.body.login
        const pass = req.body.pass
        console.log(login, pass)
        
        const checkUser = await workWithBase(queryDB({
            operation: 'sql',
            conditions: `SELECT * FROM dev.users WHERE email = '${login}'`
        }))

        const isExist = (checkUser.length > 0) ? true : false
        
        if(!isExist){
            const regUser = await workWithBase(queryDB({
                operation: 'insert',
                table: 'users',
                data:[{email:login, pass:pass, date:moment().format('DD.MM.YYYY HH:mm:ss')}],
            }))
            res.json({
                data: regUser,
                answer: 'Successfully reg!'
            })
        }else{
            res.json({
                answer:'Alredy Exist!'
            })
        }

    })


    app.post('/protected',ensureToken, async (req, res) => {
        jwt.verify(req.token, protected,  (err, data) => {
            
            if (!err) {
                console.log(data)
                const userId = data.id
                
                console.log(req.body,'body')
                
                res.json({
                    user: userId,
                    answer: 'PROTECTED AREA'
                })
            }else{
                console.log(err)
            }
        })    
    })

    /* app.get("/api/protected", ensureToken,  (req, res) => {
        jwt.verify(req.token, secret_key, function (err, data) {
            if (err) {
                //res.sendStatus(403)
                res.json({
                    answer: false
                })
            } else {
                console.log('FIRST TIME DATA LOADING.... for user')
                const userId = data.user.id
                mysql.createConnection(db)
                    .then((conn) => {
                        connect = conn;
                        return connect.query(adminData(userId))
                    })
                    .then((rows) => {
                        const AllData = rows[0]

                        console.log(AllData,'IAM USERDATA..')
                        res.json({
                            answer: true,
                            userdata: AllData,
                            data: data
                        })
                        console.log('accept module')
                        connect.end()
                    })

                
                res.json({
                    protected: 'protected area api',
                    data: data
                })
                
            }
        })
    }); */

}

module.exports = appRouter;