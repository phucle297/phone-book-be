const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class Emails extends Model {
    static associate(models) {
      Emails.hasOne(models.UserHasEmail, {
        foreignKey: "emailId",
        as: "userHasEmail",
      });
      Emails.hasMany(models.AttachedFiles, {
        foreignKey: {
          name: "emailId",
          allowNull: true,
        },
        as: "attachedFiles",
      });
    }
  }
  Emails.init(
    {
      emailId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "email_id",
        autoIncrement: true,
        primaryKey: true,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      emailContent: {
        type: DataTypes.STRING,
        field: "email_content",
      },
      sender: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Emails",
      tableName: "emails",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Emails;
};
