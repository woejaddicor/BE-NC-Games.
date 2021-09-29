const express = require('express');
const { getUsers, getUserByUsername } = require('../controllers/users.controller');

const usersRouter = express.Router();

usersRouter.get('/', getUsers);
usersRouter.get('/:username', getUserByUsername)

module.exports = usersRouter