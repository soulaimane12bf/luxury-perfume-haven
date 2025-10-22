import Slider from '../models/slider.js';

// Get all sliders
export const getAllSliders = async (req, res) => {
  try {
    const sliders = await Slider.findAll({
      order: [['order', 'ASC'], ['created_at', 'DESC']],
    });
    res.json(sliders);
  } catch (error) {
    console.error('Error fetching sliders:', error);
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
    res.json(sliders);
  } catch (error) {
    console.error('Error fetching active sliders:', error);
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
    const { id, ...sliderData } = req.body; // Remove id if present, let Sequelize generate it
    const slider = await Slider.create(sliderData);
    res.status(201).json(slider);
  } catch (error) {
    console.error('Error creating slider:', error);
    res.status(500).json({ message: 'Failed to create slider', error: error.message });
  }
};

// Update slider
export const updateSlider = async (req, res) => {
  try {
    const slider = await Slider.findByPk(req.params.id);
    if (!slider) {
      return res.status(404).json({ message: 'Slider not found' });
    }
    await slider.update(req.body);
    res.json(slider);
  } catch (error) {
    console.error('Error updating slider:', error);
    res.status(500).json({ message: 'Failed to update slider' });
  }
};

// Delete slider
export const deleteSlider = async (req, res) => {
  try {
    const slider = await Slider.findByPk(req.params.id);
    if (!slider) {
      return res.status(404).json({ message: 'Slider not found' });
    }
    await slider.destroy();
    res.json({ message: 'Slider deleted successfully' });
  } catch (error) {
    console.error('Error deleting slider:', error);
    res.status(500).json({ message: 'Failed to delete slider' });
  }
};
