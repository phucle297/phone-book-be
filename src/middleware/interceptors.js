const { ReS, ReE } = require("../utils/response");

const reponseInterceptor = (req, res, next) => {
  const originalJson = res.json;
  res.json = function (code = 400, payload, message = "") {
    if (code >= 200 && code < 300) {
      const formattedData = ReS(code, payload, message);
      return originalJson.call(res, formattedData);
    }
    const formattedData = ReE(code, payload, message);
    return originalJson.call(res, formattedData);
  };
  next();
};

module.exports = reponseInterceptor;
