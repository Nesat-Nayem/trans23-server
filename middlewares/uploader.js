const multer =require("multer");

const path = require("path")

const storage = multer.diskStorage({
    destination:"images/",
    filename: function (req, file, cb) {

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null,uniqueSuffix + '-' + file.originalname )

      }
})
const uploader = multer({
    storage, 
    fileFilter:(req,file,cb)=>{
        const extension = path.extname(file.originalname)
        cb(null, true);
    },
    limits:{
        fieldSize:5000000,
    }
})

module.exports = uploader

