const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const User = db.define('User', {
    pictureProfile:{
        type: DataTypes.STRING
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false
    },
    cellphone:{
        type: DataTypes.STRING,
        allowNull: false
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    CPF:{
        type: DataTypes.STRING,
        allowNull: false
    },
    RG:{
        type: DataTypes.STRING,
        allowNull: false
    },
    birthDate:{
        type: DataTypes.DATE,
        allowNull: false
    },
    adress:{
        type: DataTypes.JSON,
        allowNull: false
    }
})

module.exports = User