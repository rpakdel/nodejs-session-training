"use strict"

var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const session = require('express-session')
var users = require('./users.js');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser({ secret: "0GBlJZ9EKBt2Zbi2flRPvztczCewBxXK" }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: "0GBlJZ9EKBt2Zbi2flRPvztczCewBxXK",
    cookie: {
        secure: false,
        httpOnly: true,
        path: "/api/",
        maxAge: null,
    },
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    if (req.sessionID) {
        console.log('Session ID is ' + req.sessionID)

        if (req.session.user) {
            console.log("User is " + req.session.user.name)
        } else {
            console.log("Session ID " + req.sessionID + " is unknown")
        }
    } else {
        console.log("No Session ID")
    }
    next()
})

app.get('/api/login/:user', (req, res) => {
    if (req.session.user &&
        req.session.user.isloggedin &&
        req.session.user.username === req.params.user) {
        console.log("Session ID " + req.sessionID + " is already logged in.")
        res.setCode(400).send("User is already logged in.")
    } else {
        if (req.session.user) {
            delete req.session.user
        }
        console.log("Logging in user " + req.params.user + " with session ID " + req.sessionID)
        let user = users.getUser(req.params.user)
        if (user) {
            user.isloggedin = true
            req.session.user = user
            req.session.save()
            res.status(200).end()
        } else {
            res.status(400).send("No such user")
        }
    }
})

app.get('/api/user/isloggedin', (req, res) => {
    if (req.session &&
        req.session.user &&
        req.session.user.isloggedin) {
        res.json(req.session.user)
    } else {
        res.status(401).end()
    }
})

app.get('/api/logout', (req, res) => {
    if (req.session &&
        req.session.user &&
        req.session.user.isloggedin) {
        req.session.destroy()
    }
    res.status(200).end()
})

app.get('/api/user/info', (req, res) => {
    if (req.session &&
        req.session.user &&
        req.session.user.isloggedin) {
        res.json(req.session.user)
    } else {
        res.status(401).send("User not logged in")
    }
})

app.put("/api/user/:user", (req, res) => {
    if (req.sesssion && req.session.user) {
        res.status(400).send("A user is already associated with this session.")
    } else {
        if (users.getUser(req.params.user)) {
            res.status(400).send("Existing username")
        } else {
            let u = req.body
            users.addUser(u.username, u.fullname, u.age)
            res.status(200).end()
        }
    }
})

app.get('/', (req, res) => {
    console.log('redirecting')
    res.redirect("/public/index.html")
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});



// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;