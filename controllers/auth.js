/** @format */
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');

//SIGN UP
const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!(email && password && firstName && lastName)) {
      res.status(400).send('All input is required');
    }
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send('User Already Exist. Please Login');
    }
    encryptedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    const token = jwt.sign(
      { user_id: user._id, email, firstName, lastName },
      JWT_SECRET
      // {
      //   expiresIn: '2h',
      // }
    );
    user.token = token;

    res.status(201).json({ user, token });
  } catch (err) {
    console.log(err);
  }
};

//SIGN IN
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send('All input is required');
    }
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        {
          user_id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        JWT_SECRET
      );

      user.token = token;
      console.log(token);
      res.status(200).json({ user, token });
    }
    res.status(400).send('Invalid Credentials');
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  signup,
  signin,
};
