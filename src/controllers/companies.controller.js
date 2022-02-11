const db = require("../models");
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
    const { companyId } = req.body;
    const isCompanyExists = await db.Companies.findOne({
      where: { companyId },
    });
    if (!isCompanyExists) {
      return res.status(400).json(400, { message: "Company name not exists" });
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
module.exports = { createCompany, getAll, getById, editCompany, removeCompany };
