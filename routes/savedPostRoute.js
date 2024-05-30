var express = require('express');
const router = express.Router();
const savedPostCtrl = require('../controllers/savedPostController');


router.put('/savedPost/addSavedPost',savedPostCtrl.addSavedPost);
router.put('/savedPost/removeSavedPost',savedPostCtrl.removeSavedPost);
router.get('/savedPost/getSavedPost',savedPostCtrl.getSavedPost);


module.exports=router;
