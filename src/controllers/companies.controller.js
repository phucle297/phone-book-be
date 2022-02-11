const db = require("../models");
const config = require("../config");
const aws = require("aws-sdk");
const { verifyToken } = require("../utils/jwt");
const s3 = new aws.S3({
  accessKeyId: config.S3_ACCESS_KEY_ID,
  secretAccessKey: config.S3_SECRET_KEY,
});
const createCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    const isCompanyExists = await db.Companies.findOne({
      where: { companyName },
    });
    if (isCompanyExists) {
      return res
        .status(400)
        .json(400, { message: "Company name already exists" });
    }
    await db.Companies.create(req.body);
    return res.status(201).json(201, "Company created");
  } catch (error) {
    return res.status(400).json(400, { message: error.message });
  }
};
const getAll = async (req, res) => {
  try {
    const companies = await db.Companies.findAll();
    return res.status(200).json(200, companies);
  } catch (error) {
    return res.status(400).json(400, { message: error.message });
  }
};
const getById = async (req, res) => {
  try {
    const { companyId } = req.params;
    const company = await db.Companies.findOne({
      where: { companyId },
    });
    return res.status(200).json(200, company);
  } catch (error) {
    return res.status(400).json(400, { message: error.message });
  }
};
const editCompany = async (req, res) => {
  try {
    const { companyId, companyName } = req.body;
    const isCompanyExists = await db.Companies.findOne({
      where: { companyId },
    });
    const isCompanyNameExists = await db.Companies.findOne({
      where: { companyName },
    });
    console.log(isCompanyNameExists);
    if (!isCompanyExists) {
      return res.status(400).json(400, { message: "Company is not exists" });
    }
    if (isCompanyNameExists) {
      return res.status(400).json(400, { message: "Company name is exists" });
    }

    await db.Companies.update(req.body, { where: { companyId } });
    return res.status(200).json(200, "Company updated");
  } catch (error) {
    return res.status(400).json(400, { message: error.message });
  }
};
const removeCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const isCompanyExists = await db.Companies.findOne({
      where: { companyId },
    });
    if (!isCompanyExists) {
      return res.status(400).json(400, { message: "Company id not exists" });
    }
    await db.Companies.destroy({ where: { companyId } });
    return res.status(200).json(200, "Company deleted");
  } catch (error) {
    return res.status(400).json(400, { message: error.message });
  }
};
const uploadImage = async (req, res) => {
  try {
    const { companyId } = req.body;

    const { buffer, originalname, mimetype } = req.file;
    const dst = `companies/${Date.now()}_${originalname}`;
    const params = {
      Bucket: config.S3_BUCKET_NAME,
      Key: dst,
      Body: buffer,
      ContentType: mimetype,
    };
    let userToken;
    await verifyToken(req).then((data) => (userToken = data));
    const user = await db.Users.findOne({
      where: { email: userToken.email },
    });
    if (user.companyId.toString() !== companyId.toString()) {
      return res.status(400).json(400, {
        message: "You are not authorized to upload avatar",
      });
    }
    s3.putObject(params, async (err, data) => {
      if (err) {
        return res
          .status(400)
          .json(400, { message: "Server error, couldn't upload" });
      } else {
        const url = `${config.S3_DOMAIN_NAME}/${dst}`;
        const company = await db.Companies.findOne({
          where: {
            companyId,
          },
        });
        const companyUpdated = { ...company, image: url };
        await db.Companies.update(companyUpdated, { where: { companyId } });
        return res.status(201).json(201, { message: "Add image success!" });
      }
    });
  } catch (error) {
    throw error;
  }
};
module.exports = {
  createCompany,
  getAll,
  getById,
  editCompany,
  removeCompany,
  uploadImage,
};
