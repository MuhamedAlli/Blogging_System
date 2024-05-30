var bcrypt = require('bcryptjs');

//Validate password
exports.isValidatePassword = (password) => {
    if (password.length < 8 || password === '') {
      return false;
    }
    return true;
  };

//compare hashed passwords
exports.compare = async(password, hashedPassword)=>{
    return await bcrypt.compareSync(password, hashedPassword);
}