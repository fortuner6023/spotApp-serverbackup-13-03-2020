const User = require('./models/user');
const commonFunctions = require('./commonFunctions.js');
const response = require('./responses.js');
// require('dotenv').config();
var services = {};

services.checkDuplicateEmail = function(req, res, next) {
    var query = {
        email: req.body.email
    }
    console.log("Query", query);
    User.findOne(query, function(err, user) {
        if (err) {
            return commonFunctions.sendErrorResponse(err);
        } else if (user) {
            console.log("In services");
            res.status(400).send(commonFunctions.sendErrorResponse(response.EMAIL_ALREADY_EXISTS));
        } else {
            next();
        }
    });
}


module.exports = services;