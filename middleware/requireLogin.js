/** @format */

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');
const mongoose = require('mongoose');
const User = mongoose.model('User');
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: 'you must be logged in' });
  }
  const token = authorization.replace('Bearer ', '');

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: 'you must be logged in' });
    }
    const { user_id } = payload;
    User.findById(user_id).then((userdata) => {
      req.user = userdata;
      if (req.user === null) {
        return res.status(498).json({ error: 'Invalid token' });
      }
      next();
    });
  });
};
