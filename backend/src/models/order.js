import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: () => `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  },
  // Customer Information
  customer_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customer_email: {
    type: DataTypes.STRING,
    allowNull: true, // Optional
    validate: {
      isEmail: true,
    },
  },
  customer_phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customer_address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // Order Details
  items: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Array of {product_id, name, price, quantity, image_url}',
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  // Order Status
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending',
  },
  // Notes
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // WhatsApp notification URL
  whatsapp_url: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'WhatsApp notification URL for admin',
  },
}, {
  tableName: 'orders',
  timestamps: true,
  underscored: true,
});

export default Order;
