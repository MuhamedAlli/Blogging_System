const User = require('./User');
const Role = require('./Role');
const UserRole = require('./UserRole');
const Post = require('./Post');
const Category = require('./Category');
const SavedPost = require('./savedPost');

const sequelize = require('../config/database');
const { FORCE } = require('sequelize/lib/index-hints');

//User(role : auther) - Post Relationship (onr to many) #Creation Posts
User.hasMany(Post);
Post.belongsTo(User, { as: 'author', foreignKey: 'authorId' });

//User(role : user) - Posts (many to many) #Saved Posts
User.belongsToMany(Post, { through: SavedPost, as: 'savedPosts', foreignKey: 'userId' });
Post.belongsToMany(User, { through: SavedPost, as: 'savers', foreignKey: 'postId' });

SavedPost.belongsTo(User, { foreignKey: 'userId' });
SavedPost.belongsTo(Post, { foreignKey: 'postId' });

//Post-Category Relationship (many to many)
Post.belongsToMany(Category,{through:"PostCategory"});
Category.belongsToMany(Post,{through:"PostCategory"});

//User-Role Relationship (many to many)
User.belongsToMany(Role,{through:UserRole});
Role.belongsToMany(User,{through:UserRole});

//Sync database
sequelize.sync({ force: false, alter:false }).then(() => {
    console.log('Database synced');
  }).catch(err => {
    console.error('Failed to sync database:', err);
  });

//Role.create({name:"user"});
//Role.create({name:"author"});

module.exports={sequelize , User , Post , Role , Category , SavedPost , UserRole};