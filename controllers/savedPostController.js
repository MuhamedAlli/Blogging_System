const dotenv = require('dotenv');
dotenv.configDotenv();
const jwt = require('jsonwebtoken'); 
var { SavedPost , Post , User } = require('../models/Index');
var authorize = require('../middlewares/authorizMiddleware');


exports.addSavedPost = async(req , res)=>{
    try {
        const {postId} = req.query;
        console.log("Post Id : "+postId);
        const token = req.headers['authorization'];
        var decodedToken = jwt.verify(token,process.env.SECRET);
        var userId = decodedToken.userId;
        if(!token)
            return res.status(401).send({error:"unauthorized user"});

        var post =await Post.findOne({
            where:{id:postId}
        });

        if(!post)
            return res.status(500).send({ error: "Post not found" });

        await SavedPost.create({userId:userId, postId:postId});

        return res.status(200).json({success: "Post added to saved List"});

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Something went wrong!" });
    }
}

exports.removeSavedPost = async(req,res)=>{
    try {
        const {postId} = req.query;
        console.log("Post Id : "+postId);
        const token = req.headers['authorization'];
        var decodedToken = jwt.verify(token,process.env.SECRET);
        var userId = decodedToken.userId;
        if(!token)
            return res.status(401).send({error:"unauthorized user"});

        var savedPost =await SavedPost.findOne({
            where:{postId:postId,userId:userId}
        });

        if(!savedPost)
            return res.status(500).send({ error: "Post not found" });

        savedPost.destroy();

        return res.status(200).json({success: "Post removed from Saved List"});

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Something went wrong!" });
    }
}

exports.getSavedPost = async(req , res)=>{
    try {
        const {postId} = req.query;
        console.log("Post Id : "+postId);
        const token = req.headers['authorization'];
        var decodedToken = jwt.verify(token,process.env.SECRET);
        var userId = decodedToken.userId;
        if(!token)
            return res.status(401).send({error:"unauthorized user"});

        const savedPosts = await SavedPost.findAll({
            where: { userId },
            include: [
              {
                model: Post,
              },
            ],
            attributes:[]
          });

        var posts = savedPosts.map(savedPost => savedPost.Post);

       return res.status(200).json(posts);

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Something went wrong!" });
    }
}