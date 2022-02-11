const jwt = require("jsonwebtoken");
const config = require("../config");
const db = require("../models");
const { verifyToken } = require("../utils/jwt");
const { ReE } = require("../utils/response");

const extractTokenFromHeaderString = (token = "") => {
  if (token === "") return [null, "Token is missing"];
  const parts = token?.split(" ");
  if (parts.length < 2 || parts[0] !== "Bearer" || parts[1] === "") {
    return [null, "Token invalid"];
  }
  return [parts[1], null];
};
const authenticate = async (req, res, next) => {
  try {
    const [token, error] = extractTokenFromHeaderString(
      req.header("Authorization")
    );
    if (error) {
      return res.status(401).json(401, error);
    }
    let payload = jwt.verify(token, config.SECRET_KEY);
    const { email } = payload;
    const user = await db.Users.findOne({ where: { email } });
    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json(400, error.message);
  }
};
const authorize =
  (...allowRoles) =>
  async (req, res, next) => {
    let maLoaiNguoiDung;
    await verifyToken(req).then(
      (decoded) => (maLoaiNguoiDung = decoded.maLoaiNguoiDung)
    );
    if (!allowRoles.includes(maLoaiNguoiDung))
      return res.status(403).json(403, "Forbidden");
    next();
  };
module.exports = { authenticate, authorize };
