const Sequelize = require("sequelize");
const config = require("../config");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

// const sequelize = new Sequelize(
//   config.RDS_DB_NAME,
//   config.RDS_USERNAME,
//   config.RDS_PASSWORD,
//   {
//     host: config.RDS_HOSTNAME,
//     maxConcurrentQueries: 100,
//     dialect: config.DIALECT,
//     port: config.RDS_PORT,
//     pool: {
//       max: 10,
//       min: 0,
//       idle: 20000,
//     },
//   }
// );

const sequelize = new Sequelize(
  config.DATABASE,
  config.USERNAME,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.DIALECT,
    port: config.PORT,
  }
);

const db = {};
const basename = path.basename(__filename);
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file.slice(-3) === ".js" && file !== basename
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize);
    db[model.name] = model;
  });

Object.keys(db).forEach((model) => {
  if (db[model].associate) {
    db[model].associate(db);
  }
});
db.sequelize = sequelize;
db.sequelize.sync({ force: true });
module.exports = db;
