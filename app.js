require('dotenv').config()
const   express         = require('express'),
        app             = express(),
        api             = require('./api'),
        passport        = require('passport'),
        flash           = require('connect-flash'),
        cookieParser    = require('cookie-parser'),
        session         = require('express-session');

// Express setup
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.PASSPORT_SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    }
));
app.use(flash());
app.set('view engine', 'ejs');

// Passport setup
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Public assets
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/js', express.static(__dirname + '/node_modules/popper.js/dist/umd'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use(express.static(__dirname + '/public'));

// Routes
app.use('/api', api);
require('./routes.js')(app, passport);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`listening on port ${port}...`);
});

module.exports = app;