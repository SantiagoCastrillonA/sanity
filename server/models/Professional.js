const { DataTypes, Model } = require('sequelize');

class Professional extends Model {
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
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      servicios_especialistas: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Servicios o especialidades del profesional'
      },
      NC_profesional: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Número de colegiatura profesional'
      },
      certificados: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Array de certificados del profesional'
      },
      experiencia_laboral: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Experiencia laboral del profesional'
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
      tableName: 'professionals',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    });
  }

  static associate(models) {
    // Relación con el usuario
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  }
}

module.exports = Professional; 