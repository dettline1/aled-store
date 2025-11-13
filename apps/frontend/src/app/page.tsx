import { BannerCarousel } from '@/components/sections/BannerCarousel';
import { CategoriesSection } from '@/components/sections/CategoriesSection';
import { FeaturedProducts } from '@/components/sections/FeaturedProducts';
import { AdvantagesSection } from '@/components/sections/AdvantagesSection';

export const metadata = {
  title: 'ALED - Автомобильное LED освещение',
  description: 'Би-LED линзы, ксеноновые комплекты, LED лампы для автомобилей. Профессиональная установка в 4 городах России. Гарантия качества.',
};

export default function HomePage() {
  return (
    <>
      <BannerCarousel />
      <CategoriesSection />
      <FeaturedProducts title="Рекомендуемые товары" limit={8} />
      <AdvantagesSection />
    </>
  );
}
