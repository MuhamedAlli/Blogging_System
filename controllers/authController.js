var bcrypt = require('bcryptjs');
var {User , Role} = require('../models/Index');
var validationUtil = require('../Util/validation');
var jwtUtil = require('../Util/jwtUtil');


//Register Logic
exports.register = async(req , res)=>{
    try {
    var createdBy = "admin";
    var createdOn = new Date();
    // req.body

    const{username,password,fullname,roleId}=req.body;

    if(!username || !password ||  !fullname || !roleId)
        return res.status(500).send({ error: 'username , password , fullname and roleId are required , can not empty '+req.body.fullname})

    var isUserExists =await User.findOne({
        where:{username:username}
    });

    if(isUserExists !== null)
        return res.status(400).send({error:"User already Exists"});

    if(!validationUtil.isValidatePassword(password))
        return res.status(500).send({ error: 'Password is not valid' })

    //we come in here then everythings is okay
    var hashedPassword = await bcrypt.hash(password, 10);

    //Create or Register new user
    const user  = await User.create({username:username,password:hashedPassword,fullName:fullname});

    //Add Role To user
    // const userRole =await UserRole.create({UserId:user.id , RoleId:roleId});
    const role = await Role.findByPk(roleId);
    if (!role) {
        return res.status(404).send({ error: 'Role not found' });
    }

    // Add role to the user
    await user.addRole(role);

    console.log(`Role ${roleId} added to user ${user.id}`);

    return res.status(201).send("Successfully register new user");

    } catch (error) {
        console.error("Error: "+error);
    }
    
}


//Login logic
exports.logIn = async(req , res)=>{
    try {
        const {username ,password} = req.body;

        //validate Credentials is not empty
        if(!username || !password)
            return res.status(500).send({error:"username and password are required"});

        //get user by name and password
        const user = await User.findOne(
            {
                where:{username:username}
            }
        );

        if(user === null)
            return res.status(404).send({error:"user is not found!"});

        //validate user using password
       var isPasswordValid= validationUtil.compare(password, user.password);
       
       if(!isPasswordValid)
            return res.status(401).send({error:"unauthorized user"});

       //get user roles
       var roles = await this.getUserRoles(user.id);

       //generate JWT Token
       var token =jwtUtil.generateToken(user.id , user.username, user.fullname , roles);

       return res.status(200).send(JSON.stringify(token));

    } catch (error) {
        return res.status(500).send({error:"failed to login"});
    }
}

exports.getUserRoles =async (userID)=>{
    try {
        const userRoles = await User.findOne({
            where: { id: userID },
            include: {
                model: Role,
                attributes: ['name'], 
            }
        });

        if (!userRoles) {
            return []; // Return an empty array if no user or roles are found
        }

        // Extract role names from the result
        const roles = userRoles.Roles.map(role => role.name);

        return roles;
    }  catch (error) {
     console.error(error);
   }
}

