import Slider from '../models/slider.js';
import { uploadImageToVercel, deleteImageFromVercel } from '../config/vercelBlob.js';

// Get all sliders (Admin only)
export const getAllSliders = async (req, res) => {
  try {
    const sliders = await Slider.findAll({
      order: [['order', 'ASC'], ['created_at', 'DESC']],
    });
    
    console.log(`✅ Fetched ${sliders.length} sliders for admin`);
    res.json(sliders);
  } catch (error) {
    console.error('❌ Error fetching sliders:', error);
    res.status(500).json({ message: 'Failed to fetch sliders' });
  }
};

// Get active sliders only (for public display)
export const getActiveSliders = async (req, res) => {
  try {
    const sliders = await Slider.findAll({
      where: { active: true },
      order: [['order', 'ASC']],
    });
    
    // Validate that all sliders have required fields
    const validSliders = sliders.filter(slider => {
      const isValid = slider.id && slider.image_url && slider.title;
      if (!isValid) {
        console.warn(`⚠️ Invalid slider found: ${slider.id}`);
      }
      return isValid;
    });
    
    console.log(`✅ Fetched ${validSliders.length} active sliders (${sliders.length} total active)`);
    res.json(validSliders);
  } catch (error) {
    console.error('❌ Error fetching active sliders:', error);
    res.status(500).json({ message: 'Failed to fetch active sliders' });
  }
};

// Get single slider
export const getSliderById = async (req, res) => {
  try {
    const slider = await Slider.findByPk(req.params.id);
    if (!slider) {
      return res.status(404).json({ message: 'Slider not found' });
    }
    res.json(slider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new slider
export const createSlider = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        message: 'Image file is required' 
      });
    }

    // Validate required fields
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ 
        message: 'Title is required' 
      });
    }

    // Upload image to Vercel Blob
    console.log('📤 Uploading slider image to Vercel Blob...');
    const imageUrl = await uploadImageToVercel(req.file, 'sliders');

    // Create slider with Vercel Blob URL
    const sliderData = {
      image_url: imageUrl,
      title: req.body.title || '',
      subtitle: req.body.subtitle || '',
      button_text: req.body.button_text || '',
      button_link: req.body.button_link || '',
      order: parseInt(req.body.order) || 0,
      active: req.body.active === 'true' || req.body.active === true,
    };

    const slider = await Slider.create(sliderData);
    console.log(`✅ Created new slider: ${slider.id} with image: ${imageUrl}`);
    res.status(201).json(slider);
  } catch (error) {
    console.error('❌ Error creating slider:', error);
    res.status(500).json({ 
      message: 'Failed to create slider', 
      error: error.message 
    });
  }
};

// Update slider
export const updateSlider = async (req, res) => {
  try {
    const slider = await Slider.findByPk(req.params.id);
    if (!slider) {
      return res.status(404).json({ message: 'Slider not found' });
    }

    const updateData = {
      title: req.body.title || slider.title,
      subtitle: req.body.subtitle || slider.subtitle,
      button_text: req.body.button_text || slider.button_text,
      button_link: req.body.button_link || slider.button_link,
      order: req.body.order !== undefined ? parseInt(req.body.order) : slider.order,
      active: req.body.active !== undefined ? (req.body.active === 'true' || req.body.active === true) : slider.active,
    };

    // If new file uploaded, upload to Vercel and delete old image
    if (req.file) {
      console.log('📤 Uploading new slider image to Vercel Blob...');
      const newImageUrl = await uploadImageToVercel(req.file, 'sliders');
      
      // Delete old image from Vercel Blob
      if (slider.image_url) {
        await deleteImageFromVercel(slider.image_url);
      }
      
      updateData.image_url = newImageUrl;
    }

    await slider.update(updateData);
    console.log(`✅ Updated slider: ${slider.id}`);
    res.json(slider);
  } catch (error) {
    console.error('❌ Error updating slider:', error);
    res.status(500).json({ 
      message: 'Failed to update slider',
      error: error.message 
    });
  }
};

// Delete slider
export const deleteSlider = async (req, res) => {
  try {
    const slider = await Slider.findByPk(req.params.id);
    if (!slider) {
      return res.status(404).json({ message: 'Slider not found' });
    }

    // Delete image from Vercel Blob before deleting slider
    if (slider.image_url) {
      await deleteImageFromVercel(slider.image_url);
    }

    await slider.destroy();
    console.log(`✅ Deleted slider: ${req.params.id}`);
    res.json({ message: 'Slider deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting slider:', error);
    res.status(500).json({ message: 'Failed to delete slider' });
  }
};
