const express = require("express");
const usersRoutes = express.Router();
const userController = require("../controllers/users.controller");
const { authenticate, authorize } = require("../middleware/authentication");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
usersRoutes.post("/register", userController.register);
usersRoutes.post("/login", userController.login);
usersRoutes.get(
  "/get-all",
  authenticate,
  authorize("Admin"),
  userController.getAll
);
usersRoutes.get(
  "/get-by-id/:userId",
  authenticate,
  authorize("Admin"),
  userController.getById
);
usersRoutes.put("/edit", authenticate, userController.editUser);
usersRoutes.delete(
  "/delete/:userId",
  authenticate,
  authorize("Admin"),
  userController.removeUser
);
usersRoutes.post(
  "/upload-avatar",
  upload.single("avatar"),
  authenticate,
  userController.uploadAvatar
);
module.exports = usersRoutes;
