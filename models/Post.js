const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
 const Category = require('./Category');
const Post = sequelize.define('Post',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    title:{
        type:DataTypes.STRING,
        allowNull:false
    },
    coverImage:{
        type:DataTypes.STRING,
        allowNull:true
    },
    summary:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    content:{
        type:DataTypes.STRING,
        allowNull:false
    },
    isDraft:{
        type:DataTypes.BOOLEAN,
        allowNull:false
    }
});

module.exports=Post;