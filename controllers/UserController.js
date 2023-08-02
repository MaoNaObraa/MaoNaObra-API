const { where } = require("sequelize");
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
    } = req.body;

    if (!name) {
      res.status(422).json({ message: "o nome é obrigatório" });
      return;
    }
    if (!email) {
      res.status(422).json({ message: "o email é obrigatório" });
      return;
    }
    if (!cellphone) {
      res.status(422).json({ message: "o celular é obrigatório" });
      return;
    }
    if (!password) {
      res.status(422).json({ message: "a senha é obrigatório" });
      return;
    }
    if (!confirmPassword) {
      res.status(422).json({ message: "a confirmação de senha é obrigatório" });
      return;
    }
    if (password !== confirmPassword) {
      res.status(422).json({ message: "as senhas não conferem" });
      return;
    }
    if (!CPF) {
      res.status(422).json({ message: "o CPF é obrigatório" });
      return;
    }
    if (!RG) {
      res.status(422).json({ message: "o RG é obrigatório" });
      return;
    }
    if (!birthDate) {
      res.status(422).json({ message: "a data de nascimento é obrigatório" });
      return;
    }
    if (!completeAdress) {
      res.status(422).json({ message: "O endereço é obrigatório" });
      return;
    }
    if (!CEP) {
      res.status(422).json({ message: "O endereço completo é obrigatorio" });
      return;
    }
    if (!number) {
      res.status(422).json({ message: "O número do endereço é obrigatório" });
      return;
    }
    if (!locationState) {
      res.status(422).json({ message: "O estado do endereço é obrigatório" });
      return;
    }
    if (!neighborhood) {
      res.status(422).json({ message: "O bairro do endereço é obrigatório" });
      return;
    }
    if (!city) {
      res.status(422).json({ message: "A cidade do endereço é obrigatória" });
      return;
    }
    if (!complement) {
      res
        .status(422)
        .json({ message: "O complemento do endereço é obrigatório" });
      return;
    }
    if (!tipoCadastro) {
      res.status(422).json({ message: "O tipo de cadastro é obrigatório" });
      return;
    }

    const userExist = await User.findOne({
      where: { email: email },
    });

    if (userExist) {
      res.status(422).json({ message: "esse email já esta sendo utilizado" });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    try {
      const newUser = await User.create({
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
        picturesAd,
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
      console.log(decoded);

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
    } = req.body;
  
    if (!name || !email || !cellphone || !CPF || !RG || !birthDate || !completeAdress || !CEP || !number || !locationState || !neighborhood || !city || !complement || !tipoCadastro) {
      res.status(422).json({ message: "Campos obrigatórios não foram preenchidos" });
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
      descriptionAd,
      servicesAd,
      category,
      picturesAd,
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
  
};
