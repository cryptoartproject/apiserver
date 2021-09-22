const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000
const routes = require("./conf/endpoints.js");

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

routes(app);

app.listen(port,  () => {
  console.log("app running on port. All OK", port);
});

module.exports = app
