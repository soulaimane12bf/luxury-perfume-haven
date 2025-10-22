import sequelize from './src/config/database.js';
import Slider from './src/models/slider.js';

async function syncSliders() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Sync only the Slider model
    await Slider.sync({ alter: true });
    console.log('✅ Slider table created/updated successfully');
    
    // Seed some sample sliders
    const count = await Slider.count();
    if (count === 0) {
      await Slider.bulkCreate([
        {
          image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1600&h=900&fit=crop',
          title: 'عطور فاخرة أصلية',
          subtitle: '✨ اكتشف مجموعتنا الحصرية من أفخم العطور العالمية ✨',
          button_text: '🛍️ تسوق الآن',
          button_link: '/collection',
          order: 1,
          active: true
        },
        {
          image_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1600&h=900&fit=crop',
          title: 'عطور رجالية راقية',
          subtitle: 'تشكيلة واسعة من أرقى العطور الرجالية العالمية',
          button_text: 'اكتشف المزيد',
          button_link: '/collection',
          order: 2,
          active: true
        },
        {
          image_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1600&h=900&fit=crop',
          title: 'خصومات حصرية',
          subtitle: '🔥 خصم يصل إلى 30% على مجموعة مختارة من العطور 🔥',
          button_text: 'تسوق العروض',
          button_link: '/collection',
          order: 3,
          active: true
        }
      ]);
      console.log('✅ Seeded 3 sample sliders');
    } else {
      console.log(`ℹ️  Table already has ${count} sliders`);
    }
    
    await sequelize.close();
    console.log('✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

syncSliders();
