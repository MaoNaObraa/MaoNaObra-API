const { where, Op, Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getToken = require("../helpers/getToken");
const createUserToken = require("../helpers/userToken");
const getUserByToken = require("../helpers/getUserByToken");

const User = require("../models/Users");

module.exports = class UserController {
  //register
  static async register(req, res) {
    const {
      image,
      name,
      email,
      cellphone,
      password,
      confirmPassword,
      CPF,
      RG,
      birthDate,
      completeAdress,
      CEP,
      number,
      neighborhood,
      locationState,
      complement,
      city,
      tipoCadastro,
      descriptionAd,
      servicesAd,
      category,
      picturesAd,
      whatsappContact,
      instagramContact,
      telephoneContact,
    } = req.body;

    if (
      !name ||
      !email ||
      !cellphone ||
      !password ||
      !confirmPassword ||
      password !== confirmPassword ||
      !CPF ||
      !RG ||
      !birthDate ||
      !completeAdress ||
      !CEP ||
      !number ||
      !locationState ||
      !neighborhood ||
      !city ||
      !complement ||
      !tipoCadastro
    ) {
      res
        .status(422)
        .json({
          message: "Preencha todos os campos obrigatórios corretamente",
        });
      return;
    }

    const userExist = await User.findOne({
      where: { email: email },
    });

    if (userExist) {
      res.status(422).json({ message: "esse email já esta sendo utilizado" });
      return;
    }
    let profileImage = "";
  
    if (req.files.image) {
      profileImage = req.files.image[0].filename;
    }

    let picturesAdArray = [];
    if (req.files.picturesAd) {
      const images = Object.values(req.files.picturesAd);

      images.forEach((image) => {
        picturesAdArray.push(image.filename);
      });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    try {
      const newUser = await User.create({
        image: profileImage,
        name,
        email,
        cellphone,
        password: passwordHash,
        CPF,
        RG,
        birthDate,
        completeAdress,
        CEP,
        number,
        neighborhood,
        locationState,
        complement,
        city,
        tipoCadastro,
        descriptionAd,
        servicesAd,
        category,
        picturesAd: JSON.stringify(picturesAdArray),
        whatsappContact,
        instagramContact,
        telephoneContact,
      });
      await createUserToken(newUser, req, res);
    } catch (error) {
      res.status(500).json({ message: "deu erro", error });
    }
  }

  //login
  static async login(req, res) {
    const { email, password } = req.body;
    if (!email) {
      res.status(422).json({ message: "o email é obrigatório" });
      return;
    }
    if (!password) {
      res.status(422).json({ message: "a senha é obrigatório" });
      return;
    }
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      res
        .status(422)
        .json({ message: "Não há usuário cadastrado com esse email" });
      return;
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      res.status(422).json({ message: "a senha esta incorreta" });
      return;
    }

    await createUserToken(user, req, res);
  }

  static async checkUser(req, res) {
    let currentUser;

    if (req.headers.authorization) {
      const token = getToken(req);
      const decoded = jwt.verify(token, "logInScrettoken");
      currentUser = await User.findByPk(decoded.id);

      currentUser.password = undefined;
    } else {
      currentUser = null;
    }

    res.status(200).json(currentUser);
  }

  static async getUserById(req, res) {
    const id = req.params.id;

    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      res.status(422).json({ message: "Usuario nao encontrado" });
      return;
    }

    res.status(200).json({ user });
  }

  static async editUser(req, res) {
    const userId = req.params.id;
    const token = getToken(req);
    const user = await getUserByToken(token);

    const {
      name,
      email,
      cellphone,
      password,
      confirmPassword,
      CPF,
      RG,
      birthDate,
      completeAdress,
      CEP,
      number,
      neighborhood,
      locationState,
      complement,
      city,
      tipoCadastro,
      descriptionAd,
      servicesAd,
      category,
      picturesAd,
      whatsappContact,
      instagramContact,
      telephoneContact,
    } = req.body;

    if (req.file) {
      user.image = req.file.filename;
    }

    const images = req.files;
    if (images) {
      const imageFilenames = images.map((image) => image.filename);
      user.picturesAd = imageFilenames;
    }

    if (
      !name ||
      !email ||
      !cellphone ||
      !CPF ||
      !RG ||
      !birthDate ||
      !completeAdress ||
      !CEP ||
      !number ||
      !locationState ||
      !neighborhood ||
      !city ||
      !complement ||
      !tipoCadastro
    ) {
      res
        .status(422)
        .json({ message: "Campos obrigatórios não foram preenchidos" });
      return;
    }

    if (password !== confirmPassword) {
      res.status(422).json({ message: "As senhas não conferem" });
      return;
    }

    const userExist = await User.findOne({ where: { email: email } });
    if (userExist && user.email !== email) {
      res.status(422).json({ message: "Por favor utilize outro email" });
      return;
    }

    const updatedData = {
      image: user.image,
      name,
      email,
      cellphone,
      CPF,
      RG,
      birthDate,
      completeAdress,
      CEP,
      number,
      neighborhood,
      locationState,
      complement,
      city,
      tipoCadastro,
      picturesAd: user.picturesAd,
      descriptionAd,
      servicesAd,
      category,
      whatsappContact,
      instagramContact,
      telephoneContact,
    };

    if (password) {
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);
      updatedData.password = passwordHash;
    }

    try {
      await User.update(updatedData, { where: { id: userId } });
      res.status(200).json({ message: "Usuário atualizado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar usuário", error });
    }
  }

  static async getAll(req, res){
    const prestadoresDeServico = await User.findAll({
      where: {
        tipoCadastro: 'prestadorServico',
      },
      attributes: {
        include: [
          'image',
          'descriptionAd',
          'servicesAd',
          'category',
          'picturesAd',
          'whatsappContact',
          'instagramContact',
          'telephoneContact'
        ]
      },
      order: [['createdAt', 'DESC']],

    });

    res.status(200).json({
      users: prestadoresDeServico,
    })
  }

  static async getPrestadorServico(){
    const id = req.params.id
    if (!id) {
      res.status(400).json({
        message: 'ID não fornecido.',
      });
      return;
    }

    const prestadorServico = await User.findByPk(id)

    if(!prestadorServico){
      res.status(404).json({
        message: 'O prestador de serviço não encontrado.',
      });
      return;
    }

    res.status(200).json({
      prestadorServico: prestadorServico
    })
  }

  static async searchService(req, res) {
    const query = req.params.query; // Valor pesquisado
  
    if (!query) {
      res.status(400).json({ message: 'Valor de pesquisa não fornecido' });
      return;
    }
  
    try {
      const users = await User.findAll({
        where: {
          [Op.or]: [
            { servicesAd: { [Op.like]: `%${query}%` } }, 
          ],
        },
      });
  
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar usuários', error });
    }
  }
  
};
