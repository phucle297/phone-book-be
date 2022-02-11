const express = require("express");
const companiesRoutes = express.Router();
const companies = require("../controllers/companies.controller.js");
const { authenticate, authorize } = require("../middleware/authentication");
companiesRoutes.post("/create", companies.createCompany);
companiesRoutes.get("/get-all", companies.getAll);
companiesRoutes.get("/get-by-id/:companyId", companies.getById);
companiesRoutes.put("/edit", companies.editCompany);
companiesRoutes.delete("/delete/:companyId", companies.removeCompany);

module.exports = companiesRoutes;
