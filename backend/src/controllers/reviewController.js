import Review from '../models/review.js';
import Product from '../models/product.js';
import { put } from '@vercel/blob';

// Get reviews by product
export const getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.findAll({ 
      where: { 
        product_id: req.params.productId, 
        is_approved: true 
      },
      order: [['likes', 'DESC'], ['created_at', 'DESC']]
    });
    
    // Transform to match frontend expectations
    const transformedReviews = reviews.map(review => {
      const data = review.toJSON();
      return {
        ...data,
        name: data.customer_name,
        approved: data.is_approved
      };
    });
    
    res.json(transformedReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reviews (admin only)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({ order: [['created_at', 'DESC']] });
    
    // Transform to match frontend expectations
    const transformedReviews = reviews.map(review => {
      const data = review.toJSON();
      return {
        ...data,
        name: data.customer_name, // Map customer_name to name for frontend
        approved: data.is_approved // Map is_approved to approved for frontend
      };
    });
    
    res.json(transformedReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new review
export const createReview = async (req, res) => {
  try {
    const { product_id, name, rating, comment } = req.body;
    const files = req.files || [];
    
    // Check if product exists
    const product = await Product.findOne({ where: { id: product_id } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Upload images to Vercel Blob if provided
    const imageUrls = [];
    if (files && files.length > 0) {
      for (const file of files.slice(0, 3)) { // Max 3 images per review
        const blob = await put(`reviews/${Date.now()}-${file.originalname}`, file.buffer, {
          access: 'public',
          addRandomSuffix: true,
        });
        imageUrls.push(blob.url);
      }
    }
    
    const reviewData = {
      product_id,
      customer_name: name,
      rating,
      comment,
      images: imageUrls,
      is_approved: false,
      likes: 0,
      dislikes: 0
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
      { is_approved: true },
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

// Like a review
export const likeReview = async (req, res) => {
  try {
    const review = await Review.findOne({ where: { id: req.params.id } });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    review.likes = (review.likes || 0) + 1;
    await review.save();
    
    res.json({ likes: review.likes, dislikes: review.dislikes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dislike a review
export const dislikeReview = async (req, res) => {
  try {
    const review = await Review.findOne({ where: { id: req.params.id } });
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    review.dislikes = (review.dislikes || 0) + 1;
    await review.save();
    
    res.json({ likes: review.likes, dislikes: review.dislikes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to update product rating
async function updateProductRating(productId) {
  const reviews = await Review.findAll({ 
    where: { product_id: productId, is_approved: true } 
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
