const db = require("../models");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const getAll = async (req, res) => {
  try {
    const users = await db.Users.findAll({
      attributes: { exclude: ["matKhau"] },
    });
    return res.status(200).json(200, users);
  } catch (error) {
    return res.status(400).json(400, { message: error.message });
  }
};
const register = async (req, res) => {
  try {
    const { email } = req.body;
    const isEmailExists = await db.Users.findOne({ where: { email } });
    if (isEmailExists) {
      return res.status(400).json(400, { message: "Email đã tồn tại" });
    }
    await db.Users.create(req.body);
    return res.status(201).json(201, "User created");
  } catch (error) {
    return res.status(400).json(400, { message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { taiKhoan, matKhau } = req.body;
    const user = await db.Users.findOne({ where: { taiKhoan } });
    if (!user) {
      return res
        .status(400)
        .json(400, { message: "Tài khoản hoặc mật khẩu không chính xác" });
    }
    const isPasswordValid = bcrypt.compareSync(matKhau, user.matKhau);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json(400, { message: "Tài khoản hoặc mật khẩu không chính xác" });
    }
    const token = generateToken(user);
    return res.status(200).json(200, { token });
  } catch (error) {
    return res.status(400).json(400, { message: error.message });
  }
};

module.exports = { register, login, getAll };
