/** @format */
const { default: mongoose } = require('mongoose');

const Post = require('../models/post');

//GET SINGLE POST
const get_post = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId)
      .populate('postedBy', '_id firstName lastName')
      .populate('likes', '_id firstName lastName')
      .select('-isDisabled');
    if (!post || post.isDisabled === true) {
      res.status(404).json({ message: 'Post not found' });
    } else {
      res.status(200).json(post);
    }
  } catch (err) {
    console.log(err);
  }
};
//GET ALL POSTS
const all_posts = async (req, res) => {
  try {
    const posts = await Post.find({ isDisabled: false })
      .populate('postedBy', '_id firstName lastName')
      .sort('-createdAt')
      .select('-likes')
      .select('-isDisabled');
    res.status(200).json(posts);
    // const filteredpost = posts.filter(
    //   (post) => post.postedBy.id === req.user.id
    // );
    // res.status(200).json(filteredpost);
  } catch (err) {
    console.log(err);
  }
};
//CREATE POST
const create_post = async (req, res) => {
  try {
    const { title, body, selectedFile } = req.body;
    if (!title || !body || !selectedFile) {
      return res.status(422).json({ error: 'Please add all the fields' });
    }
    const post = new Post({
      title,
      body,
      selectedFile,
      postedBy: req.user,
    });
    await post.save().then((result) => {
      res.status(200).json({ post: result });
    });
  } catch (err) {
    console.log(err);
  }
};
//UPDATE POSTS
const update_post = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, body, selectedFile, postedBy, likes, likeCount, createdAt } =
      req.body;
    const post = await Post.findById(postId);

    if (!post || post.isDisabled === true) {
      res.status(404).json({ message: 'Post not found' });
    } else {
      const updatedPost = {
        title,
        body,
        selectedFile,
        _id: postId,
        postedBy,
        likes,
        likeCount,
        createdAt,
      };

      await Post.findByIdAndUpdate(postId, updatedPost, {
        new: true,
      }).select('-isDisabled');
      res.status(200).json(updatedPost);
    }
  } catch (err) {
    console.log(err);
  }
};

//DELETE POST
const delete_post = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate('postedBy', '_id');

    if (!post || post.isDisabled === true) {
      res.status(404).json(`No post with id: ${postId}`);
    } else {
      await post.updateOne({ isDisabled: true });
      res.status(200).json({ message: 'Post deleted successfully.' });
    }
  } catch (err) {
    console.log(err);
  }
};
const like_post = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate(
      'postedBy',
      '_id firstName lastName'
    );
    if (!post || post.isDisabled === true) {
      res.status(404).json({ message: 'Post not found' });
    } else {
      if (!post.likes.includes(req.user.id)) {
        ++post.likeCount;
        post.likes.push(req.user.id);
        await Post.findByIdAndUpdate(postId, post, {
          new: true,
        });
        res.status(200).json(post);
      } else {
        --post.likeCount;
        post.likes.pull(req.user.id);
        await Post.findByIdAndUpdate(postId, post, {
          new: true,
        });
        res.status(200).json(post);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

//Likes on post
const post_likes = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId)
      .select('-title')
      .select('-body')
      .select('-selectedFile')
      .select('-updatedAt')
      .select('-createdAt')
      .select('-postedBy')
      .select('-isDisabled')
      .select('-likeCount')
      .populate('likes', '_id firstName lastName');

    if (!post || post.isDisabled === true) {
      res.status(404).json({ message: 'Post not found' });
    } else {
      res.status(200).json(post);
    }
  } catch (err) {
    console.log(err);
  }
};

const search_post = async (req, res) => {
  try {
    const searchKey = '(?i)' + req.params.key + '(?-i)';
    const post = await Post.find({ title: { $regex: searchKey } });
    res.status(200).json(post);
  } catch (err) {
    console.log(err);
  }
};

// const plike_post = async (req, res) => {
//   try {
//     const { postId } = req.params;

//     const post = await Post.findByIdAndUpdate(
//       postId,
//       { $push: { likes: req.user.id } },
//       { new: true }
//     );
//     if (!post) {
//       res.status(404).json({ message: 'Post not found' });
//     }
//     res.status(200).json(post);
//   } catch (err) {
//     console.log(err);
//   }
// };
// const unlike_post = async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const post = await Post.findByIdAndUpdate(
//       postId,
//       { $pull: { likes: req.user.id } },
//       { new: true }
//     );

//     res.status(200).json(post);
//   } catch (err) {
//     console.log(err);
//   }
// };

module.exports = {
  search_post,
  get_post,
  create_post,
  all_posts,
  update_post,
  delete_post,
  like_post,
  post_likes,
};
