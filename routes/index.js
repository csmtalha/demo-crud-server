/** @format */

const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./user');
const postRoutes = require('./post');
const requireLogin = require('../middleware/requireLogin');

router.use('/api/auth', authRoutes);
router.use('/api/users', userRoutes);
router.use('/api/posts', requireLogin, postRoutes);

module.exports = router;
