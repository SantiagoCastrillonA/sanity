const { DataTypes, Model } = require('sequelize');

class User extends Model {
  static init(sequelize) {
    super.init(
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
        document: {
          type: DataTypes.STRING(15),
          allowNull: true,
          unique: true,
        },
        phone: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        token: {
          type: DataTypes.STRING(255),
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
        sequelize,
        tableName: "users",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
      }
    );
  }
    static associate(models) {
      // Relación con el usuario
      this.hasMany(models.DiaryEntry, {
        foreignKey: 'user_id',
        as: 'diaryEntries'
      });
      this.hasMany(models.EmergencyLog, {
        foreignKey: 'user_id',
        as: 'emergencyLogs'
      });
    }
}

module.exports = User;
