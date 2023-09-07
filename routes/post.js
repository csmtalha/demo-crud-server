/** @format */

const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');

router.get('/:postId', postController.get_post);
router.post('/', postController.create_post);
router.get('/', postController.all_posts);
router.put('/:postId', postController.update_post);
router.delete('/:postId', postController.delete_post);
router.put('/:postId/like', postController.like_post);
router.get('/:postId/likes', postController.post_likes);
router.get('/search/:key', postController.search_post);

// router.patch('/:postId/plike', postController.plike_post);

// router.patch('/:postId/unlike', postController.unlike_post);

module.exports = router;
