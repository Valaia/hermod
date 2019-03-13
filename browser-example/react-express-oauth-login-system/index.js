const express = require('express');
const bodyParser= require('body-parser')
const cookieParser = require('cookie-parser');
var session = require('express-session')

const proxy = require('http-proxy-middleware')
const path = require('path');
const fs = require('fs'),
    http = require('http'),
    https = require('https')
const mosca = require("mosca");
const passport = require("passport");

let app = express();
var flash = require('connect-flash');

//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(flash());
app.use(session({ secret: 'board GOAT' , cookie: { secure: true }}));
app.use(passport.initialize());
app.use(passport.session());

var router = express.Router();

// ENDPOINTS
// login system
router.use('/api/login',require('./routes/passport.js'));
// optional oauth server implementation
//router.use('/api/oauth',require('./routes/oauth.js'));

// An api endpoint that returns a short list of items
router.get('/api/getList', (req,res) => {
	var list = ["item1", "item2", "item3"];
	res.json(list);
	console.log('Sent list of items');
});


app.use(router);
// Development, proxy to local create-react-app
app.use('/', proxy({ target: 'http://localhost:3000' }))
// production - Serve the static files from the React app
//app.use(express.static(path.join(__dirname, 'client/build')));


// SSL
// allow self generated certs
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var options = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./certificate.pem'),
};
let port='443'
var webServer = https.createServer(options, app).listen(port, function(){
  console.log("Express server listening on port " + port);
});
