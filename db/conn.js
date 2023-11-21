const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('railway', 'root', 'g4A15BEBcd6a1-ACeG61bfEhC2hbggEf', {
    host: 'roundhouse.proxy.rlwy.net',
    port: 40168,
    dialect: 'mysql',
    protocol: 'tcp'
  })


module.exports = sequelize