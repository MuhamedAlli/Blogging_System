const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,path.join(__dirname,"../images"));
    },
    filename: function (req, file, cb) {
        const uniqueFilename = new Date().toISOString().replace(/:/g,'-') + file.originalname;
        cb(null, uniqueFilename);
    }
});

// Initialize upload
const upload = multer({ storage: storage });

module.exports = upload;