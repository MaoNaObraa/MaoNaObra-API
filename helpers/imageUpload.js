const multer = require("multer")
const path = require("path")

const imageStorage = multer.diskStorage({
    destination: function(req,file,cb){
        let folder =""

        if(req.baseUrl.includes("users")){
            folder = "users"
        }else if(req.baseUrl.includes("servicos")){
            folder = "servicos"
        }

        cb(null, `public/images/${folder}`)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }

})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb){
        if(file.originalname.match(/\.png(png|jpg)$/)){
            return cb(new Error("Porfavor envie apenas jpg ou png!"))
        }
        cb(undefined,true)
    }
})

module.exports = { imageUpload }