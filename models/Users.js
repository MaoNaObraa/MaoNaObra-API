const { DataTypes } = require("sequelize")
const sequelize = require('sequelize');
const db = require("../db/conn")

const User = db.define("User", {
  id:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  image: {
    type: DataTypes.TEXT,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cellphone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  CPF: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  RG: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birthDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  completeAdress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  CEP: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  locationState: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  neighborhood: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  complement: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipoCadastro:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  descriptionAd: {
    type: DataTypes.TEXT,
  },
  servicesAd: {
    type: DataTypes.TEXT
  },
  category: {
    type: DataTypes.STRING,
  },
  picturesAd: {
    type: DataTypes.TEXT,
    defaultValue: [],
  },
  whatsappContact:{
    type: DataTypes.STRING
  },
  instagramContact:{
    type: DataTypes.STRING
  },
  telephoneContact:{
    type: DataTypes.STRING
  }
})
User.sync()
module.exports = User
