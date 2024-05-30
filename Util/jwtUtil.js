const dotenv = require('dotenv');
dotenv.configDotenv();
const jwt = require('jsonwebtoken'); 

exports.generateToken=(userId , username,fullName,userRoles)=>{
    var token = jwt.sign({
        userId:userId,
        username:username,
        fullName:fullName,
        roles:userRoles
    },
    process.env.SECRET,
    {expiresIn:process.env.EXPIREIN}
    );
    return token;
}

exports.AuthorizeToken=(roles , req, res , next)=>{
    try {
        const{token} = req.headers;
        if(!token)
            return res.status(401).send({error:"Token is not exist!"});
        
        var decodedToken = jwt.verify(token,process.env.SECRET);
        
        req.user={
            userId:decodedToken.userId,
            username:decodedToken.username,
            fullName:decodedToken.fullName,
            roles:decodedToken.userRoles
        };

        if(roles.include[decodedToken.userRoles])
            return res.status(401).send({error:"unauthorized user"});

        next();

    } catch (error) {
        console.error("Error: "+JSON.stringify(error));
        return res.status(401).send({error:"Authentication failed!"});
    }
}