var express = require("express");
var bodyParser = require("body-parser");
var passport = require("passport");
var flash = require("connect-flash");
var morgan = require("morgan");
var cookieParser = require("cookie-Parser");
var session = require("express-session");
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var exphbs = require("express-handlebars");

var mysql = require("mysql");
var connection;
// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// if (process.env.JAWSDB_URL) {
//   connction = mysql.createConnection(process.env.JAWSDB_URL);
// } else {
//   connection = mysql.createConnection({
//     host:'localhost',
//     user:'root',
//     password:'root',
//     database:'MSFGA'

//   })
// }

// connection.connect();





// Requiring our models for syncing
var db = require("./models");

require('./config/passport')(passport);

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(morgan('dev'));
app.use(cookieParser());


// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.text());
app.use(bodyParser.json({
  type: "application/vnd.api+json"
}));

//passport config;
app.use(session({secret: 'nottellingyou'}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash()); // use connect-flash for flash messages stored in session
// Static directory
app.use(express.static("public"));

// Routes
// =============================================================
require("./routes/api-routes.js")(app, passport);
require("./routes/html-routes.js")(app, passport);





// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({
}).then(function () {
  app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
  });
});
