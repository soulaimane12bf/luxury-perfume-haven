import sequelize from './src/config/database.js';
import Slider from './src/models/slider.js';

async function deleteAllSliders() {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected');

    console.log('🗑️  Deleting all sliders...');
    const deletedCount = await Slider.destroy({
      where: {},
      truncate: true
    });

    console.log(`✅ Successfully deleted ${deletedCount} sliders`);
    console.log('✨ Database is clean!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting sliders:', error);
    process.exit(1);
  }
}

deleteAllSliders();
