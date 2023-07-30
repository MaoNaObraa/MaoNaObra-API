const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('maonaobrabd', 'root', '', {
    host:'localhost',
    dialect:'mysql'
})


module.exports = sequelize