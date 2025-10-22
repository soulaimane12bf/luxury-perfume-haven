import Slider from './src/models/slider.js';
import sequelize from './src/config/database.js';

const sliderImages = [
  {
    id: 'slider-1761096480606-fqa5uo093',
    image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1920&q=80',
    title: 'عطور رجالية راقية',
    subtitle: 'اكتشف تشكيلة واسعة من أرقى العطور الرجالية العالمية'
  },
  {
    id: 'slider-1761094322858-1prg29gfi',
    image_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1920&q=80',
    title: 'خصومات حصرية',
    subtitle: '🔥 خصم يصل إلى 30% على مجموعة مختارة من العطور 🔥'
  },
  {
    id: 'slider-1761094322857-isyypgwks',
    image_url: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=1920&q=80',
    title: 'عطور فاخرة أصلية',
    subtitle: '✨ اكتشف مجموعتنا الحصرية من أفخم العطور العالمية ✨'
  },
  {
    id: 'slider-1761094322858-5o8vogq7y',
    image_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1920&q=80',
    title: 'عطور نسائية راقية',
    subtitle: 'تشكيلة أنيقة من العطور النسائية الفاخرة'
  },
  {
    id: 'slider-1761095704876-50v041b5b',
    image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1920&q=80',
    title: 'هدايا مميزة',
    subtitle: 'اختر الهدية المثالية من مجموعتنا الفاخرة'
  },
  {
    id: 'slider-1761095880591-pbmtbcsd9',
    image_url: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=1920&q=80',
    title: 'عطور عربية أصيلة',
    subtitle: 'روائح شرقية فاخرة تأسر القلوب'
  }
];

async function updateSliderImages() {
  try {
    await sequelize.sync();
    console.log('Connected to database');

    for (const sliderData of sliderImages) {
      const slider = await Slider.findByPk(sliderData.id);
      if (slider) {
        await slider.update({
          image_url: sliderData.image_url,
          title: sliderData.title,
          subtitle: sliderData.subtitle
        });
        console.log(`✅ Updated slider: ${sliderData.title}`);
      } else {
        console.log(`❌ Slider not found: ${sliderData.id}`);
      }
    }

    console.log('\n✨ All sliders updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating sliders:', error);
    process.exit(1);
  }
}

updateSliderImages();
