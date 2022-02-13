const express = require("express");
const companiesRoutes = express.Router();
const companiesControllers = require("../controllers/companies.controller.js");
const { authenticate, authorize } = require("../middleware/authentication");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

companiesRoutes.post(
  "/create",
  // authorize("CANNOT_USE"),
  companiesControllers.createCompany
);
companiesRoutes.get(
  "/get-all",
  // authorize("CANNOT_USE"),
  companiesControllers.getAll
);
companiesRoutes.get(
  "/get-by-id/:companyId",
  // authorize("CANNOT_USE"),
  companiesControllers.getById
);
companiesRoutes.put(
  "/edit",
  authenticate,
  authorize("Admin"),
  companiesControllers.editCompany
);
companiesRoutes.delete(
  "/delete/:companyId",
  companiesControllers.removeCompany
);
companiesRoutes.post(
  "/upload-image",
  upload.single("image"),
  authenticate,
  authorize("Admin"),
  companiesControllers.uploadImage
);

module.exports = companiesRoutes;
