const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken'); 

exports.AuthorizeToken= async(roles=[] , req, res , next)=>{
    try {
        const token = req.headers['authorization'];
        if(!token)
            return res.status(401).send({error:"Token is not exist!"});
        
        var decodedToken = jwt.verify(token,process.env.SECRET);
        
        var user={
            userId:decodedToken.userId,
            username:decodedToken.username,
            fullName:decodedToken.fullName,
            roles:decodedToken.roles
        };

        if(roles[0].trim() !== user.roles[0].trim())
            return res.status(401).send({error:"unauthorized user"});

        next();

    } catch (error) {
        console.error("Error: "+JSON.stringify(error));
        //return res.status(401).send({error:"Authentication failed!"});
    }
}