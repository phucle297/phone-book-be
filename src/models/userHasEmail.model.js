const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class UserHasEmail extends Model {
    static associate(models) {
      UserHasEmail.belongsTo(models.Users, {
        foreignKey: "userId",
        as: "users",
      });
      UserHasEmail.belongsTo(models.Emails, {
        foreignKey: "emailId",
        as: "emails",
      });
    }
  }
  UserHasEmail.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        field: "user_id",
      },
      emailId: {
        type: DataTypes.INTEGER,
        field: "email_id",
      },
    },
    {
      sequelize,
      modelName: "UserHasEmail",
      tableName: "user_has_email",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return UserHasEmail;
};
