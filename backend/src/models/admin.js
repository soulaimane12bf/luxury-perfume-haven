import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database.js';

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  smtp_email: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Email account used to send notifications (SMTP)'
  },
  smtp_password: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'App password for SMTP email'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'super-admin'),
    allowNull: false,
    defaultValue: 'admin'
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'admins',
  hooks: {
    beforeCreate: async (admin) => {
      if (admin.password) {
        admin.password = await bcrypt.hash(admin.password, 10);
      }
    },
    beforeUpdate: async (admin) => {
      if (admin.changed('password')) {
        admin.password = await bcrypt.hash(admin.password, 10);
      }
    }
  }
});

// Instance method to compare passwords
Admin.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default Admin;
