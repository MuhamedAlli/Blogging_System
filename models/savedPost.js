const DataTypes = require('sequelize');
const sequelize = require('../config/database');

const SavedPost = sequelize.define('SavedPost',
    {
        userId:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        postId:{
            type:DataTypes.INTEGER,
            allowNull:false
        }
    }
);

module.exports = SavedPost;