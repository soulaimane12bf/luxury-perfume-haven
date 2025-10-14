import Review from '../models/review.js';
import Product from '../models/product.js';

// Get reviews by product
export const getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.findAll({ 
      where: { 
        product_id: req.params.productId, 
        approved: true 
      },
      order: [['created_at', 'DESC']]
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reviews (admin only)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({ order: [['created_at', 'DESC']] });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new review
export const createReview = async (req, res) => {
  try {
    const { product_id, name, rating, comment } = req.body;
    
    // Check if product exists
    const product = await Product.findOne({ where: { id: product_id } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const reviewData = {
      id: `review-${Date.now()}`,
      product_id,
      name,
      rating,
      comment,
      approved: false
    };
    
    const review = await Review.create(reviewData);
    
    // Update product rating
    await updateProductRating(product_id);
    
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Approve review
export const approveReview = async (req, res) => {
  try {
    const [updated] = await Review.update(
      { approved: true },
      { where: { id: req.params.id } }
    );
    
    if (!updated) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    const review = await Review.findOne({ where: { id: req.params.id } });
    
    // Update product rating
    await updateProductRating(review.product_id);
    
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({ where: { id: req.params.id } });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    const product_id = review.product_id;
    await review.destroy();
    
    // Update product rating
    await updateProductRating(product_id);
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to update product rating
async function updateProductRating(productId) {
  const reviews = await Review.findAll({ 
    where: { product_id: productId, approved: true } 
  });
  const product = await Product.findOne({ where: { id: productId } });
  
  if (product) {
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      product.rating = Math.round((totalRating / reviews.length) * 10) / 10;
      product.reviewCount = reviews.length;
    } else {
      product.rating = 0;
      product.reviewCount = 0;
    }
    await product.save();
  }
}
