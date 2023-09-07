/** @format */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const requireLogin = require('../middleware/requireLogin');

//GET USER
router.get('/:id', userController.get_user);
//GET USERS
router.get('/', userController.get_users);
//DELETE USERS
router.delete('/:id', requireLogin, userController.delete_user);

module.exports = router;
