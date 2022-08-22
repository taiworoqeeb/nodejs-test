const express = require('express');
const router = express.Router()
const article = require('../controller/article')


router.post('/addComment/:postId', article.createComment);
router.post('/addReply/:commentId', article.createReply);
router.get('/getPostById/:postId', article.getPostById);
router.put('/vote/:commentId', article.voteComment);
router.get('/getPosts', article.getPosts);
router.delete('/deleteComment/:commentId', article.deleteComment);
router.delete('/deleteReply/:replyId', article.deleteReply);
router.put('/updateComment/:commentId', article.updateComment);
router.put('/updateReply/:replyId', article.updateReply);





module.exports = router