const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class UserHasSms extends Model {
    static associate(models) {
      UserHasSms.belongsTo(models.Sms, {
        foreignKey: "smsId",
        as: "sms",
      });
      UserHasSms.belongsTo(models.Users, {
        foreignKey: "userId",
        as: "users",
      });
    }
  }
  UserHasSms.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        field: "user_id",
      },
      smsId: {
        type: DataTypes.INTEGER,
        field: "sms_id",
      },
    },
    {
      sequelize,
      modelName: "UserHasSms",
      tableName: "user_has_sms",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return UserHasSms;
};
