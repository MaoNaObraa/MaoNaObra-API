const jwt = require('jsonwebtoken')

const createUserToken = async(user, req, res) => {

    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, "logInScrettoken")
    
    res.status(200).json({
        message:"Voce esta autenticado",
        token: token,
        userId: user._id
    })
}

module.exports = createUserToken