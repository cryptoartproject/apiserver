const axios = require('axios')
const creds = require('./conf/creds')

const ensureToken = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader != undefined) {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next()
    } else {
        res.json({
            protected: 'NO access'
        })
    }
}

//commit


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
  


const appRouter = (app, next) => {


    app.post('/test',(req,res)=>{
        console.log(req.body)
        res.json({
            req:req.body,
            answer:'ok'
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