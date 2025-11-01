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
    validate: {
      isEmail: true
    }
  },
  smtp_password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  instagram: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Optional admin Instagram handle/URL'
  },
  facebook: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Optional admin Facebook handle/URL'
  },
  role: {
    type: DataTypes.ENUM('admin', 'super-admin'),
    allowNull: false,
    defaultValue: 'admin'
  },
  reset_token: {
    type: DataTypes.STRING,
    allowNull: true
  },
  reset_token_expires: {
    type: DataTypes.BIGINT,
    allowNull: true
  }
  ,
  // Timestamp (ms) indicating tokens issued before this time are invalid.
  // Set this when the admin changes password or an admin reset occurs.
  token_invalid_before: {
    type: DataTypes.BIGINT,
    allowNull: true,
    comment: 'Invalidate tokens issued before this timestamp (ms)'
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
