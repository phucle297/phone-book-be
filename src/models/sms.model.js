const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class Sms extends Model {
    static associate(models) {
      Sms.hasOne(models.UserHasSms, {
        foreignKey: "smsId",
        as: "userHasSms",
      });
      Sms.belongsTo(models.Users, {
        foreignKey: "userId",
        allowNull: true,
        as: "users",
      });
    }
  }
  Sms.init(
    {
      smsId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "sms_id",
        autoIncrement: true,
        primaryKey: true,
      },
      smsContent: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "sms_content",
      },
      userId: {
        type: DataTypes.INTEGER,
        field: "sender",
      },
    },
    {
      sequelize,
      modelName: "Sms",
      tableName: "sms",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Sms;
};