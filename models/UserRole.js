const DataTypes = require('sequelize');
const sequelize = require('../config/database');

const UserRole = sequelize.define('UserRole',
    {
        UserId:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        RoleId:{
            type:DataTypes.INTEGER,
            allowNull:false
        }
    }
);

module.exports = UserRole;