const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./conf/endpoints.js");
const app = express();

/*
AFTER RESTORING
*/

/*
const msisdn = require('express-msisdn');
app.use(msisdn());
*/






const cors = require('cors')

app.use(cors())



app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header("X-Frame-Options", "*")
    res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Credentials", "true")
    next();
});


app.use('/files', express.static(__dirname + '/public'));
app.use('/logos', express.static(__dirname + '/images_logos'));
app.use('/lands_logos', express.static(__dirname + '/uploads'));
app.use('/qr', express.static(__dirname + '/QR'));
app.use('/docs', express.static(__dirname + '/DOCS'));

routes(app);

const server = app.listen(5000,  () => {
    console.log("app running on port. All OK", server.address().port);
});

//serverio.listen(3000);