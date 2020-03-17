//External Files and Packages
 const bodyParser = require('body-parser');
const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
require('./config/passport');
var cors = require('cors');
//Internal Files and Packages
const User = require('./models/user');
const userRouting = require('./routes/user.js');
const Circle = require('./models/circle');
const circleRouting = require('./routes/circle.js');




module.exports = function(app) {
    app.use(cors());
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept , authorization, publicAccessKey");
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        next();
    });

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit:50000}));

    //app.use(session({ secret: 'somesecretpasswordcomeshere' }));
    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    app.use('/user', userRouting);
    app.use('/circle', circleRouting);
   
    app.use((err, req, res, next) => {
        if (err.error != undefined) {
            if (err.error.isJoi) {
                res.status(400).json({
                    type: err.type,
                    error: err.error.toString()
                });
            }
        } else {
            next(err);
        }
    });

    app.get('/', function(request, response) {
        response.json('App root');
    });
}