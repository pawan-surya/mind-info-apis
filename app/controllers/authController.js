const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken');
const User = require('../models/userModels');

// This is Login User

exports.Login = (req, res, next) => {
    User.find({
            $or: [{
                phone: req.body.username
            }, {
                email: req.body.username
            }]
        })
        .exec()
        .then(user => {
            console.log(user)
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Email or Phone is invalid !"
                });
            }
            bcryptjs.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed2"
                    });
                }
                if (result) {
                    const token = jwt.sign({
                            email: user[0].email,
                            phone: user[0].phone,
                            userId: user[0]._id
                        },
                        'secretkey', {
                            expiresIn: "1h"
                        }
                    );
                    stroreToken(token, user[0]._id)
                    return res.status(200).json({
                        message: "Auth successful",
                        token: token,
                        status_code: "200"
                    });
                }
                res.status(401).json({
                    message: "Auth failed3"
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

const stroreToken = function (token, id) {
    User.updateOne({
        _id: id
    }, {
        $set: {
            token: token
        }
    }).exec()
};