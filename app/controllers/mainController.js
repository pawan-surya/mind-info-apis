const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModels');


// This is for cretae user
exports.createUser = ((req, res) => {
    if (!req.body.phone) {
        res.status(400).send({
            errors: {
                message: "Contact can't be empty!"
            }
        });
        return;
    }

    if (!req.body.email) {
        res.status(400).send({
            errors: {
                message: "Email can't be empty!"
            }
        });
        return;
    }

    User.find({
            $or: [{
                phone: req.body.phone
            }, {
                email: req.body.email
            }]
        })
        .exec()
        .then(user => {
            if (user.length > 1) {
                return res.status(409).json({
                    message: "Email or Phone Already exists."
                });
            } else {
                bcryptjs.hash(req.body.password, 10, (err, hash) => {
                    console.log(err)
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            name: req.body.name,
                            email: req.body.email,
                            phone: req.body.phone,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                res.status(201).json({
                                    status_code: 201,
                                    message: "User created"
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });

});


// This is for user edit 
exports.userEdit = ((req, res) => {
    const id = req.params.userId
    console.log(req.body)
    User.update({
            _id: id
        }, {
            $set: req.body
        }).exec()
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: 'User updted.',
                status_code: 201
            })
        }).catch(err => {
            res.status(500).json({
                error: err.message
            })
        })
});



exports.userIndex = ((req, res) => {
    User.find()
        .select('name phone email  _id')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                status_code: 200,
                user: docs.map(doc => {
                    return {
                        _id: doc.id,
                        name: doc.name,
                        email: doc.email,
                        phone: doc.phone,
                        createdAt: doc.registerDate,
                    }
                })
            })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
})
