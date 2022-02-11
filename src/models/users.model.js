const bcrypt = require("bcrypt");
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class Users extends Model {
    static associate(models) {
      Users.belongsTo(models.Companies, {
        foreignKey: "companyId",
        as: "companies",
      });
    }
  }
  Users.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
          //? Use bcrypt to hash the password
          const hashedPassword = bcrypt.hashSync(value, 12);
          this.setDataValue("password", hashedPassword);
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "User",
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "company_id",
      },
    },
    {
      sequelize,
      modelName: "Users",
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Users;
};
