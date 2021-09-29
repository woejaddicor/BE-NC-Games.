const {fetchUsers, fetchUserByUsername} = require('../models/users.model');

exports.getUsers = (req, res, next) => {
    fetchUsers().then((users) => {
        res.status(200).send({users: users})
    })
    .catch((err) => {
        next(err);
    })
}

exports.getUserByUsername = (req, res, next) => {
    const username = req.params;
    fetchUserByUsername(username).then((users) => {
        res.status(200).send({users: users})
    })
    .catch((err) => {
        next(err);
    })
}