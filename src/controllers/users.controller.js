const db = require("../models");
const bcrypt = require("bcrypt");
const { generateToken, verifyToken } = require("../utils/jwt");
const config = require("../config");
const aws = require("aws-sdk");
const { TrunkContext } = require("twilio/lib/rest/trunking/v1/trunk");
const s3 = new aws.S3({
  accessKeyId: config.S3_ACCESS_KEY_ID,
  secretAccessKey: config.S3_SECRET_KEY,
});
const getAll = async (req, res) => {
  try {
    const users = await db.Users.findAll({
      attributes: { exclude: ["password"] },
    });
    return res.status(200).json(200, users);
  } catch (error) {
    return res.status(400).json(400, { message: error.message });
  }
};
const getAllUser = async (req, res) => {
  try {
    let userToken;
    await verifyToken(req).then((data) => (userToken = data));
    const user = await db.Users.findOne({ where: { userId: userToken.id } });
    const users = await db.Users.findAll({
      where: { companyId: user.companyId },
      attributes: { exclude: ["password"] },
    });
    return res.status(200).json(200, users);
  } catch (error) {
    return res.status(400).json(400, { message: error.message });
  }
};
const getMyData = async (req, res) => {
  try {
    let userToken;
    await verifyToken(req).then((data) => (userToken = data));
    const user = await db.Users.findOne({ where: { userId: userToken.id } });
    return res.status(200).json(200, user);
  } catch (error) {
    return res.status(400).json(400, { message: error.message });
  }
};
const register = async (req, res) => {
  try {
    for (let i = 0; i < 100; i++) {
      const email = `user${i}@gmail.com`;
      const name = `user${i}`;
      const address = `address ${i}`;
      const password = `user1234`;
      const companyId = (i % 3) + 1;
      let phone;
      if (i < 10) phone = `080812300${i}`;
      else if (i < 100) phone = `08081230${i}`;
      await db.Users.create({
        name,
        phone,
        email,
        password,
        companyId,
        address,
      });
    }
    // const { email, phone } = req.body;
    // const isEmailExists = await db.Users.findOne({ where: { email } });
    // const isPhoneExists = await db.Users.findOne({ where: { phone } });
    // if (isEmailExists || isPhoneExists) {
    //   return res
    //     .status(400)
    //     .json(400, { message: "Email or Phone number already exists" });
    // }
    // await db.Users.create(req.body);
    return res.status(201).json(201, "User created");
  } catch (error) {
    return res.status(400).json(400, { message: error.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.Users.findOne({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .json(400, { message: "Email or Password is incorrect" });
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json(400, { message: "Email or Password is incorrect" });
    }
    const token = generateToken(user);
    return res.status(200).json(200, { token });
  } catch (error) {
    return res.status(400).json(400, { message: error.message });
  }
};
const getById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await db.Users.findOne({
      where: { userId },
      attributes: { exclude: ["password"] },
    });
    return res.status(200).json(200, user);
  } catch (error) {
    return res.status(400).json(400, { message: error.message });
  }
};
const editUser = async (req, res) => {
  try {
    const { userId, email, phone, password, companyId, role } = req.body;
    const user = await db.Users.findOne({ where: { userId } });
    if (!user) {
      return res.status(400).json(400, { message: "User not found" });
    }
    if (user.role === "User" && role) {
      return res
        .status(400)
        .json(400, { message: "You can't change your role" });
    }
    if (user.email !== email && email) {
      const isEmailExists = await db.Users.findOne({ where: { email } });
      if (isEmailExists) {
        return res.status(400).json(400, { message: "Email already exists" });
      }
    }
    if (user.phone !== phone && phone) {
      const isPhoneExists = await db.Users.findOne({ where: { phone } });
      if (isPhoneExists) {
        return res
          .status(400)
          .json(400, { message: "Phone number already exists" });
      }
    }
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      req.body.password = hash;
    }
    if (user.companyId !== companyId) {
      return res.status(400).json(400, { message: "You can't change company" });
    }
    await db.Users.update(req.body, { where: { userId } });
    return res.status(200).json(200, "User updated");
  } catch (error) {
    return res.status(400).json(400, { message: error.message });
  }
};
const removeUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await db.Users.findOne({ where: { userId } });
    if (!user) {
      return res.status(400).json(400, { message: "User not found" });
    }
    if (user.role === "Admin") {
      return res.status(400).json(400, { message: "You can't delete admin" });
    }
    await db.Users.destroy({ where: { userId } });
    return res.status(200).json(200, "User deleted");
  } catch (error) {
    return res.status(400).json(400, { message: error.message });
  }
};
const uploadAvatar = async (req, res) => {
  try {
    const { buffer, originalname, mimetype } = req.file;
    const dst = `users/${Date.now()}_${originalname}`;
    const params = {
      Bucket: config.S3_BUCKET_NAME,
      Key: dst,
      Body: buffer,
      ContentType: mimetype,
    };
    s3.putObject(params, async (err, data) => {
      if (err) {
        return res
          .status(400)
          .json(400, { message: "Server error, couldn't upload" });
      } else {
        const url = `${config.S3_DOMAIN_NAME}/${dst}`;
        let userToken;
        await verifyToken(req).then((data) => (userToken = data));
        const user = await db.Users.findOne({
          where: { userId: userToken.id },
        });
        const userUpdated = { ...user, avatar: url };
        await db.Users.update(userUpdated, { where: { userId: user.userId } });
        return res
          .status(201)
          .json(201, { message: "Add avatar success!", url });
      }
    });
  } catch (error) {
    return res.status(400).json(400, { message: error.message });
  }
};
const assignCompany = async (req, res) => {
  try {
    const { companyId, userId } = req.body;
    let userToken;
    await verifyToken(req).then((data) => (userToken = data));
    const user = await db.Users.findOne({ where: { email: userToken.email } });
    if (user.companyId !== companyId) {
      return res
        .status(400)
        .json(400, { message: "You only can assign user to your company" });
    }
    const isUserExists = await db.Users.findOne({ where: { userId } });
    if (!isUserExists) {
      return res.status(400).json(400, { message: "User not found" });
    }
    const isCompanyExists = await db.Companies.findOne({
      where: { companyId },
    });
    if (!isCompanyExists) {
      return res.status(400).json(400, { message: "Company not found" });
    }
    await db.Users.update({ companyId }, { where: { userId: userId } });
    return res.status(200).json(200, "User assigned");
  } catch (error) {
    return res.status(400).json(400, { message: error.message });
  }
};
module.exports = {
  register,
  login,
  getAll,
  getById,
  editUser,
  removeUser,
  uploadAvatar,
  assignCompany,
  getAllUser,
  getMyData,
};
