const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class Sms extends Model {
    static associate(models) {
      Sms.hasOne(models.UserHasSms, {
        foreignKey: "smsId",
        as: "userHasSms",
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
      sender: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      smsContent: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "sms_content",
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        as: "sender",
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
