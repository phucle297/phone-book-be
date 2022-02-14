const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  class AttachedFiles extends Model {
    static associate(models) {
      AttachedFiles.belongsTo(models.Emails, {
        foreignKey: "emailId",
        as: "email",
      });
    }
  }
  AttachedFiles.init(
    {
      attachedFileId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "attached_file_id",
        autoIncrement: true,
        primaryKey: true,
      },
      fileName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "file_name",
      },
      filePath: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "file_path",
      },
      emailId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "email_id",
      },
    },
    {
      sequelize,
      modelName: "AttachedFiles",
      tableName: "attached_files",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return AttachedFiles;
};
