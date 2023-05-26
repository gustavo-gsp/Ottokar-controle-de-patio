const express = require('express');
const path = require('path'); 
const routes = require('./routes/routes')
const connectToDb = require("./database/db");
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const { authenticate } = require('passport');
const app = express();

require('./auth')(passport);
connectToDb();

app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded());
app.use(session({
    secret: '123',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 240 * 60 * 1000}
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);


app.listen(9090, ()=> 
console.log(`Servidor iniciado em http://localhost:9090`)
);
