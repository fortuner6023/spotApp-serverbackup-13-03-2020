//External Files and Packages
var express = require('express');
const validator = require('express-joi-validation').createValidator({ passError: true })
var passport = require('passport');
//Internal Files and Packages
const circle = require('./../controllers/circle');
const Joi = require('@hapi/joi');
const commonFunctions = require('../commonFunctions');
const response = require('./../responses.js');

const joiOptions = {
    joi: {
        convert: true,
        allowUnknown: true
    }
};

var router = express.Router();


const circleSchema = Joi.object({

    name: Joi.string().required(),


});

router.post('/add_circle', validator.body(circleSchema, joiOptions), function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {
            console.log("Error 1");
            res.send(commonFunctions.sendErrorResponse(info));
        } else {
            if (info.code == 200) {
                circle.add_circle(req.body, user,function(err,data) {
                   if(err){
                    res.status(400).send(err);
                   }
                   if(data){
                res.status(200).send(data);
                   }
                    
                }, function(err) {
                    console.log('error 3');
                    console.log(err);
                    res.status(400).send(err);
                })
            } else {
                console.log("++++++++++++++++++++++Invalid Or No Token++++++++++++++++++++++");
                res.status(400).send(response.INVALID_TOKEN);
            }
        }
    })(req, res, next);
});


const deletecircleSchemaValidator = Joi.object({
    circle_id: Joi.string().required()
});

router.delete('/delete_circle', validator.fields(deletecircleSchemaValidator, joiOptions), function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
      
        if (err) {
            res.status(401).send(commonFunctions.sendErrorResponse(err));
        } else {
            if (info.code == 200) {
                circle.delete_circle(req.body, user).then(function(delete_circle) {
                    res.status(200).send(delete_circle);
                }, function(err) {
                    console.log(err);
                    res.status(400).send(err);
                }).catch(function(e) {
                    res.status(400).send(e);
                });
            } else {
                console.log("++++++++++++++++++++++Invalid Or No Token++++++++++++++++++++++");
                res.status(400).send(response.INVALID_TOKEN);
            }
        }
    })(req, res, next);
});



const editcircleSchemaValidator = Joi.object({
    circle_id: Joi.string().required(),
    name: Joi.string().optional()
});

router.put('/edit_circle', validator.fields(editcircleSchemaValidator, joiOptions), function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {
            res.status(401).send(commonFunctions.sendErrorResponse(err));
        } else {
            if (info.code == 200) {
                circle.edit_circle(req.body, user).then(function(edit_circle) {
                    res.status(200).send(edit_circle);
                }, function(err) {
                    console.log(err);
                    res.status(400).send(err);
                }).catch(function(e) {
                    res.status(400).send(e);
                });
            } else {
                console.log("++++++++++++++++++++++Invalid Or No Token++++++++++++++++++++++");
                res.status(400).send(response.INVALID_TOKEN);
            }
        }
    })(req, res, next);
});



const fetchcircleSchema = Joi.object({
    circle_id: Joi.string().required()
});

router.post('/fetch_circle', validator.body(fetchcircleSchema, joiOptions), function (req, res, next) {
    passport.authenticate('jwtUser', function (err, user, info) {
        if (err) {
           
            res.send(commonFunctions.sendErrorResponse(info));
        } else {
            if (info.code == 200) {
                circle.fetch_circle(req.body, user).then(function (fetch_circle) {
                    res.status(200).send(fetch_circle);
                }, function (err) {
                    console.log('error 3');
                    console.log(err);
                    res.status(400).send(err);
                }).catch(function (e) {
                    console.log('error 2');
                    res.status(400).send(e);
                });
            } else {
                console.log("++++++++++++++++++++++Invalid Or No Token++++++++++++++++++++++");
                res.status(400).send(response.INVALID_TOKEN);
            }
        }
    })(req, res, next);
});



router.post('/show_circle', function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {
            res.status(401).send(commonFunctions.sendErrorResponse(err));
        } else {
            if (info.code == 200) {
                circle.show_circle(req.body, user).then(function(show_circle) {
                    res.status(200).send(show_circle);
                }, function(err) {
                    console.log(err);
                    res.status(400).send(err);
                }).catch(function(e) {
                    res.status(400).send(e);
                });
            } else {
                console.log("++++++++++++++++++++++Invalid Or No Token++++++++++++++++++++++");
                res.status(400).send(response.INVALID_TOKEN);
            }
        }
    })(req, res, next);
});

const joinCircleSchemaValidator = Joi.object({
    circle_id: Joi.string().optional(),
    invite_code:Joi.string().required(),

});

router.put('/join_circle', validator.fields(joinCircleSchemaValidator, joiOptions), function(req, res, next) {
    passport.authenticate('jwtUser', function(err, user, info) {
        if (err) {
            res.status(401).send(commonFunctions.sendErrorResponse(err));
        } else {
            if (info.code == 200) {
                circle.join_circle(req.body, user).then(function(join_circle) {
                    res.status(200).send(join_circle);
                }, function(err) {
                    console.log(err);
                    res.status(400).send(err);
                }).catch(function(e) {
                    res.status(400).send(e);
                });
            } else {
                console.log("++++++++++++++++++++++Invalid Or No Token++++++++++++++++++++++");
                res.status(400).send(response.INVALID_TOKEN);
            }
        }
    })(req, res, next);
});





module.exports = router;