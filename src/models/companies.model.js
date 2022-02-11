const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class Companies extends Model {
    static associate(models) {
      Companies.hasMany(models.Users, {
        foreignKey: "companyId",
        as: "users",
      });
    }
  }
  Companies.init(
    {
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "company_id",
        autoIncrement: true,
        primaryKey: true,
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "company_name",
      },
      manager: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Companies",
      tableName: "companies",
      timestamps: false,
    }
  );
  return Companies;
};
