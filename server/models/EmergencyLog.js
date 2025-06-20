const { DataTypes, Model } = require('sequelize');

class EmergencyLog extends Model {
  static init(sequelize) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      trigger_message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      contact_method: {
        type: DataTypes.ENUM('emergency_contact', 'crisis_line', 'both'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('triggered', 'contacted', 'resolved'),
        defaultValue: 'triggered',
      },
      response_time: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Response time in seconds',
      },
      notes: {
        type: DataTypes.TEXT,
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
    }, {
      sequelize,
      tableName: 'emergency_logs',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    });
  }

  static associate(models) {
    EmergencyLog.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  }
}

module.exports = EmergencyLog;
