const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/sequelize");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    googleId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    names: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    lastnames: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    profile_pick: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    accountType: {
      type: DataTypes.ENUM('Usuario', 'Profesional'),
      allowNull: true,
    },
    verify_email: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    emergency_contact_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    emergency_contact_phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = User;
