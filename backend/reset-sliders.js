import 'dotenv/config';
import sequelize from './src/config/database.js';
import Slider from './src/models/slider.js';

const sliderSeeds = [
  {
    image_url: 'https://images.unsplash.com/photo-1582719478181-2cf4e5f0c583?auto=format&fit=crop&w=1920&q=80',
    title: 'نفحات شرقية ساحرة',
    subtitle: 'اكتشف أقوى العطور الشرقية الفاخرة للمناسبات الخاصة',
    button_text: 'تصفح التشكيلة',
    button_link: '/collection',
    order: 1,
    active: true,
  },
  {
    image_url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1920&q=80',
    title: 'عطور نسائية مترفة',
    subtitle: 'عطور أنثوية بلمسات فاخرة تدوم طويلاً',
    button_text: 'تسوقي الآن',
    button_link: '/collection',
    order: 2,
    active: true,
  },
  {
    image_url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d87b?auto=format&fit=crop&w=1920&q=80',
    title: 'خصومات حصرية لهذا الأسبوع',
    subtitle: 'وفر حتى 35% على مجموعة مختارة من العطور العالمية',
    button_text: 'اغتنم العرض',
    button_link: '/offers',
    order: 3,
    active: true,
  },
  {
    image_url: 'https://images.unsplash.com/photo-1512132411229-444c2c86c369?auto=format&fit=crop&w=1920&q=80',
    title: 'هدايا فاخرة لمحبي العطور',
    subtitle: 'مجموعات هدايا أنيقة تناسب كل الأذواق',
    button_text: 'اكتشف الهدية المثالية',
    button_link: '/gifts',
    order: 4,
    active: true,
  },
  {
    image_url: 'https://images.unsplash.com/photo-1610276198568-eb7b7f52f1bc?auto=format&fit=crop&w=1920&q=80',
    title: 'روائع العطور الفرنسية',
    subtitle: 'تجربة فريدة من العطور الفرنسية الراقية',
    button_text: 'تسوق التشكيلة',
    button_link: '/collection',
    order: 5,
    active: true,
  },
];

async function resetSliders() {
  console.log('🚀 Resetting slider data...');

  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Ensure table exists in case migrations never ran
    await Slider.sync();

    await sequelize.transaction(async (transaction) => {
      const deleted = await Slider.destroy({ where: {}, force: true, transaction });
      console.log(`🧹 Removed ${deleted} existing slider${deleted === 1 ? '' : 's'}`);

      await Slider.bulkCreate(sliderSeeds, { transaction });
      console.log(`🌟 Inserted ${sliderSeeds.length} fresh slider entries`);
    });

    console.log('✨ Slider reset complete');
  } catch (error) {
    console.error('❌ Failed to reset sliders:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
    console.log('🔌 Database connection closed');
  }
}

resetSliders();
