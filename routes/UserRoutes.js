const router = require('express').Router()
const UserController = require('../controllers/UserController')

const verifyToken = require('../helpers/verifyToken')
const {imageUpload} = require("../helpers/imageUpload")

router.post('/register', imageUpload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'picturesAd', maxCount: 5 }
]), UserController.register);
router.post('/login', UserController.login)
router.get('/checkuser', UserController.checkUser)
router.get('/:id', UserController.getUserById)
router.patch('/edit/:id',verifyToken,imageUpload.single("image"), imageUpload.array("picturesAd"), UserController.editUser)
router.patch('/editAd/:id',verifyToken,imageUpload.array("picturesAd"), UserController.editAd)
router.get('/', UserController.getAll)

module.exports = router