const multer = require('multer');

// Create a timestamp for the filename without special characters
const currentDate = new Date();
const currentSystemFileDate = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000).toISOString().replace(/[:.]/g, '-')  // Replace colons and periods with dashes
// Getting this datetime -> 2024-10-26T21:07:12.486Z
// Convert date to a filename-safe format by replacing ':' and '.' with '-' to avoid errors on filesystems that don't allow these characters.

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './public/temp');
    },
    filename: function (req, file, cb) {
        cb(null, `${file.originalname}-${currentSystemFileDate}`);
    }
});


// Initialize multer with the storage configuration
let upload = multer({ storage });

module.exports = upload;
