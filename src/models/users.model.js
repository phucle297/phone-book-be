const bcrypt = require("bcrypt");
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class Users extends Model {
    static associate(models) {
      Users.belongsTo(models.Companies, {
        foreignKey: "companyId",
        as: "companies",
      });
      Users.hasMany(models.UserHasEmail, {
        foreignKey: {
          name: "userId",
          allowNull: true,
        },
        as: "userHasEmails",
      });
      Users.hasMany(models.UserHasSms, {
        foreignKey: {
          name: "userId",
          allowNull: true,
        },
        as: "userHasSms",
      });
      Users.hasMany(models.Emails, {
        foreignKey: {
          name: "userId",
          allowNull: true,
        },
        as: "emails",
      });
      Users.hasMany(models.Sms, {
        foreignKey: {
          name: "userId",
          allowNull: true,
        },
        as: "sms",
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
      address: {
        type: DataTypes.STRING,
        allowNull: true,
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
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
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
