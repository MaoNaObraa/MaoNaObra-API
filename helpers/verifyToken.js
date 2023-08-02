const jwt = require('jsonwebtoken')
const getToken = require('./getToken')

const verifyToken = (req, res, next) => {
    if(!req.headers.authorization) {
        res.status(401).json({ message: "Acesso negado" })
    }

    const token = getToken(req);

    if(!token) {
        res.status(401).json({ message: "Acesso negado" })
    }
    
    try {
        req.User = jwt.verify(token, "logInScrettoken")
        next()
    } catch(err) {
        res.status(400).json({ message: "Token inválido" })
    }
}

module.exports = verifyToken