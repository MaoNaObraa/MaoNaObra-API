const { where } = require('sequelize')
const createUserToken = require('../helpers/userToken')
const User = require('../models/Users')
const bcrypt = require('bcrypt')

module.exports = class UserController {
    static async register(req, res){
        const {name, email, cellphone, password, confirmPassword, CPF, RG, birthDate} = req.body

        if(!name){
            res.status(422).json({message:"o nome é obrigatório"})
            return
        }
        if(!email){
            res.status(422).json({message:"o email é obrigatório"})
            return
        }
        if(!cellphone){
            res.status(422),json({message:"o celular é obrigatório"})
            return
        }
        if(!password){
            res.status(422).json({message:"a senha é obrigatório"})
            return
        }
        if(!confirmPassword){
            res.status(422).json({message:"a confirmação de senha é obrigatório"})
            return
        }
        if(password !== confirmPassword){
            res.status(422).json({message:"as senhas não conferem"})
            return
        }
        if(!CPF){
            res.status(422).json({message:"o CPF é obrigatório"})
            return
        }
        if(!RG){
            res.status(422).json({message:"o RG é obrigatório"})
            return
        }
        if(!birthDate){
            res.status(422).json({message:"a data de nascimento é obrigatório"})
            return
        }
        
        const userExist = await User.findOne({where:{email: email, password: password}})

        if(userExist){
            res.status(422).json({message: "esse email já esta sendo utilizado"})
            return
        }

        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        try {
            const newUser = await User.create({name, email, cellphone, password: passwordHash, CPF, RG, birthDate})
            await createUserToken(newUser, req, res)
        } catch (error) {
            res.status(500).json({message: "deu erro", error})
        }
    }
}