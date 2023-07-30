const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const Adverts = db.define('Adverts', {
    description:{
        type: DataTypes.STRING,
        allowNull: false
    },
    servicesAd:{
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    },
    category:{
        type:DataTypes.STRING,
        allowNull: false
    },
    picturesAd:{
        type: DataTypes.ARRAY(DataTypes.STRING)
    }
})

module.exports = Adverts