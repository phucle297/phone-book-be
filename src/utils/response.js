const ReS = (code, data, message = "") => {
  const resp = { success: true };
  if (message) {
    resp.message = message;
  }
  return { data, ...resp };
};
const ReE = (code, err, message = "") => {
  const resp = { success: false };
  let errors = [];
  if (code) {
    resp.statusCode = code;
  }
  if (message) {
    resp.message = message;
  }
  if (Array.isArray(err) && err.length > 0) {
    errors = err.map((e) => e.message);
  } else if (typeof err === "object" && err.message) {
    errors = [err.message];
  } else {
    errors = [err];
  }
  return { errors, ...resp };
};
module.exports = {
  ReS,
  ReE,
};
