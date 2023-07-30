const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const User = require('./Users')

const Adress = db.define('Adress', {
    adress:{
        type: DataTypes.STRING,
        allowNull: false
    },
    CEP:{
        type: DataTypes.STRING,
        allowNull: false
    },
    number:{
        type: DataTypes.STRING,
        allowNull: false
    },
    locationState:{
        type: DataTypes.STRING,
        allowNull: false
    },
    neighborhood:{
        type:DataTypes.STRING,
        allowNull: false
    },
    city:{
        type:DataTypes.STRING,
        allowNull: false
    },
    complement:{
        type:DataTypes.STRING,
        allowNull: false
    }
})

Adress.belongsTo(User)

module.exports = Adress