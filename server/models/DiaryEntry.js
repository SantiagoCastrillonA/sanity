const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize"); // ← SIN llaves {}

const DiaryEntry = sequelize.define(
  "DiaryEntry",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    mood_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 10,
      },
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "diary_entries",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = DiaryEntry;
