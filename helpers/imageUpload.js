const multer = require("multer")
const path = require("path")

const imageStorage = multer.diskStorage({
    destination: function(req,file,cb){
        let folder = ""

        // Verifique o nome do campo para determinar o tipo de imagem
        if (file.fieldname === "image") {
            folder = "users"; // Pasta para fotos de perfil
        } else if (file.fieldname === "picturesAd") {
            folder = "servicos"; // Pasta para fotos de serviços
        }

        cb(null, `public/images/${folder}`)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()+ String(Math.floor(Math.random() * 1000)) + path.extname(file.originalname))
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