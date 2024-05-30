const {DataTypes, HasOne} = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    username:{
        type:DataTypes.STRING,
        allowNull :false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    fullName:{
        type:DataTypes.STRING
    }
});

module.exports = User;