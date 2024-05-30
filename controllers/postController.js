const dotenv = require('dotenv');
dotenv.configDotenv();
const jwt = require('jsonwebtoken'); 
var { Post } = require('../models/Index');
var authorize = require('../middlewares/authorizMiddleware');
const fs = require('fs');
const path = require('path');


//Create New Post as Draft Or Immediatelt publish depending on isDraft Value
exports.create =async (req,res)=>{
    
    authorize.AuthorizeToken(['author'],req,res);

    if (!res.headersSent){
        try {

            const{title,summary,content,isDraft}=req.body;
            const coverImage = req.file.filename;

            const token = req.headers['authorization'];
            var decodedToken = jwt.verify(token,process.env.SECRET);
            var userId = decodedToken.userId;

            if(!title || !coverImage||!summary || !content)
                return res.status(500).send({error:"title , image , summary and content is required"});

            var post =await Post.create({ title, coverImage, summary, content, isDraft ,authorId:userId});

            return res.status(201).json(post);

        } catch (error) {
            console.log(error);
            return res.status(500).send({error:"Something went wrong!"});
        }
    }
}

//Update or Edit Post
exports.update =async (req,res)=>{
    
    authorize.AuthorizeToken(['author'],req,res);

    if (!res.headersSent){
        try {
            const { postId, title, summary, content } = req.body;
            const coverImage = req.file ? req.file.filename : null;
    
            const post = await Post.findByPk(postId);
    
            if (!post) 
                return res.status(404).send({ error: "Post not found" });
    
            if (coverImage) {
                const oldImagePath = path.join(__dirname, '../images', post.coverImage);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
                post.coverImage = coverImage;
            }
    
            post.title = title || post.title;
            post.summary = summary || post.summary;
            post.content = content || post.content;
    
            await post.save();
    
            return res.status(200).json(post);

        } catch (error) {
            console.error(error);
            return res.status(500).send({ error: "Something went wrong!" });
        }
    }
}


//Delete Post
exports.delete = async(req,res)=>{

    authorize.AuthorizeToken(['author'],req,res);
    if (!res.headersSent){

        try {
            const {postId} = req.query;
            console.log("Post Id : "+postId);
            const token = req.headers['authorization'];
            var decodedToken = jwt.verify(token,process.env.SECRET);
            var userId = decodedToken.userId;

            var post =await Post.findOne({
                where:{id:postId,authorId:userId}
            });

            if(!post)
                return res.status(500).send({ error: "Post not found" });

            if (post.coverImage !== undefined) {
                const oldImagePath = path.join(__dirname, '../images', post.coverImage);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            await post.destroy();
        
            return res.status(200).json({success: "Post deleted successfully"});

        } catch (error) {
            console.log(error);
            return res.status(500).send({ error: "Something went wrong!" });
        }
    }
}

//Toggle Publish Post => if it is published make Draft and if its Draft make it Publish
exports.togglePublish = async(req,res)=>{

    authorize.AuthorizeToken(['author'],req,res);

    if (!res.headersSent){
        try {
            const {postId} = req.query;
            const token = req.headers['authorization'];
            var decodedToken = jwt.verify(token,process.env.SECRET);
            var userId = decodedToken.userId;

            var post =await Post.findOne({
                where:{id:postId,authorId:userId}
            });

            if(!post)
                return res.status(500).send({ error: "Post not found" });

            post.isDraft = !post.isDraft;

            await post.save();

            return res.status(200).json(post);
            

        } catch (error) {
            return res.status(500).send({ error: "Something went wrong!" });
        }
    }
}


//Get Author's Posts with Pagination

exports.getAuthorPosts=async(req, res)=>{
    authorize.AuthorizeToken(['author'],req,res);
    if (!res.headersSent){
        try {
            const {pageNumber} = req.query;
            if(!pageNumber){
                res.status(400).send({message: 'page number is required'});
            }
            const token = req.headers['authorization'];
            var decodedToken = jwt.verify(token,process.env.SECRET);
            var userId = decodedToken.userId;

            const offset = 10 * (pageNumber - 1);
            var postCount =await Post.count();
            var numOfPages =Math.ceil(postCount/10);
            const posts = await Post.findAll({
                where: {
                    authorId: userId
                },
                order: [
                    ['createdAt', 'DESC']
                ],
                offset: offset,
                limit: 10
            });

            return res.status(200).json({
                Count:postCount,
                pageNumber:+pageNumber,
                PageCount:numOfPages,
                data :posts
            });

        } catch (error) {
            return res.status(500).send({ error: "Something went wrong!" });
        }
    }
}

//Get all recently posts for users

exports.getAllPublishedPosts=async(req,res)=>{
    try {
        const {pageNumber} = req.query;
            if(!pageNumber){
                res.status(400).send({message: 'page number is required'});
            }
            const token = req.headers['authorization'];
            var decodedToken = jwt.verify(token,process.env.SECRET);
            
            if(!token)
                return res.status(401).send({error:"unauthorized user"});

            const offset = 10 * (pageNumber - 1);
            var postCount =await Post.count();
            var numOfPages =Math.ceil(postCount/10);
            const posts = await Post.findAll({
                where: {
                    isDraft: false
                },
                order: [
                    ['createdAt', 'DESC']
                ],
                offset: offset,
                limit: 10
            });

            return res.status(200).json({
                Count:postCount,
                pageNumber:+pageNumber,
                PageCount:numOfPages,
                data :posts
            });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Something went wrong!" });
    }
}