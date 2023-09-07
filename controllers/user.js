/** @format */

const User = require('../models/user');
const Post = require('../models/post');

//GET USER
const get_user = async (req, res) => {
  User.findOne({ _id: req.params.id })
    .select('-password')
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .find({ isDisabled: false })
        .populate('postedBy', '_id firstName lastName')
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: 'User not found' });
    });
};
//GET USERS
const get_users = async (req, res) => {
  try {
    const user = await User.find({ isDisabled: false });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
};
//DELETE USER
const delete_user = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    console.log(user);
    if (user) {
      if (req.params.id === req.user.id) {
        if (user.isDisabled === true) {
          res.status(404).send(`The user has deleted the account`);
        } else {
          await user.updateOne({ isDisabled: true });

          res.json({ message: 'User deleted successfully.' });
        }
      } else {
        res.json({ message: 'You cannot delete other users' });
      }
    } else {
      res.status(404).send(`User not found `);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  get_user,
  get_users,
  delete_user,
};
