import { body, validationResult } from 'express-validator';

// Validation middleware helper
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Product validation rules
export const validateProduct = [
  body('name').trim().notEmpty().withMessage('Product name is required')
    .isLength({ max: 200 }).withMessage('Name must be less than 200 characters'),
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('price').isNumeric().withMessage('Price must be a number')
    .isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('old_price').optional().isNumeric().withMessage('Old price must be a number'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('type').trim().notEmpty().withMessage('Type is required'),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description too long'),
  validate
];

// Order validation rules
export const validateOrder = [
  body('customer_name').trim().notEmpty().withMessage('Customer name is required')
    .isLength({ max: 100 }).withMessage('Name too long')
    .matches(/^[\u0600-\u06FFa-zA-Z\s]+$/).withMessage('Invalid characters in name'),
  body('customer_phone').trim().notEmpty().withMessage('Phone number is required')
    .matches(/^(06|07)[0-9]{8}$/).withMessage('Invalid Moroccan phone number'),
  body('customer_address').trim().notEmpty().withMessage('Address is required')
    .isLength({ max: 500 }).withMessage('Address too long'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes too long'),
  body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
  body('items.*.product_id').notEmpty().withMessage('Product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('total_amount').isNumeric().withMessage('Total amount must be a number')
    .isFloat({ min: 0 }).withMessage('Total amount must be positive'),
  validate
];

// Slider validation rules
export const validateSlider = [
  body('title').trim().notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title too long'),
  body('subtitle').optional().trim().isLength({ max: 300 }).withMessage('Subtitle too long'),
  body('button_text').optional().trim().isLength({ max: 50 }).withMessage('Button text too long'),
  body('button_link').optional().trim().isLength({ max: 500 }).withMessage('Link too long'),
  body('order').optional().isInt().withMessage('Order must be an integer'),
  validate
];

// Category validation rules
export const validateCategory = [
  body('name').trim().notEmpty().withMessage('Category name is required')
    .isLength({ max: 100 }).withMessage('Name too long'),
  body('slug').trim().notEmpty().withMessage('Slug is required')
    .matches(/^[a-z0-9-]+$/).withMessage('Slug must contain only lowercase letters, numbers, and hyphens'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description too long'),
  validate
];

// Auth validation rules
export const validateLogin = [
  body('username').trim().notEmpty().withMessage('Username is required')
    .isLength({ max: 50 }).withMessage('Username too long'),
  body('password').notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
];
