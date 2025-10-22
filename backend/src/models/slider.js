import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Slider = sequelize.define('Slider', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: () => `slider-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  },
  image_url: {
    type: DataTypes.STRING(500), // Store Vercel Blob URL (shorter than base64)
    allowNull: false,
    comment: 'Vercel Blob Storage URL of the slider image'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Main heading text displayed on the slide'
  },
  subtitle: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Secondary text or description on the slide'
  },
  button_text: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'CTA button text'
  },
  button_link: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Link for the CTA button'
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Display order (lower numbers appear first)'
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Whether this slide is active/visible'
  }
}, {
  tableName: 'sliders',
  timestamps: true,
  underscored: true,
});

export default Slider;
