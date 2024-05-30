var express = require('express');
const router= express.Router();
var postCtrl = require('../controllers/postController');
var upload = require('../middlewares/uploadFileMiddleware');

router.post('/post/create',upload.single('coverImage'),postCtrl.create);
router.post('/post/update',upload.single('coverImage'),postCtrl.update);
router.delete('/post/delete',postCtrl.delete);
router.put('/post/togglePublish',postCtrl.togglePublish);
router.get('/post/getAuthorPosts',postCtrl.getAuthorPosts);
router.get('/post/getAllPublishedPosts',postCtrl.getAllPublishedPosts);

module.exports = router;