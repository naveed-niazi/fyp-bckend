const multer = require('multer');
const path = require('path')
const uuid = require('uuid').v4;


const storage = multer.diskStorage({

      destination: (req, file, cb) => {
            let pathName = path.join(__dirname, '..', 'public', `${req.params.type}`)
            cb(null, pathName)
      },
      filename: (req, file, cb) => {
            cb(null, `${req.profile.email}-${file.originalname}`);
      }

});
const upload = multer({ storage: storage });
module.exports = upload;