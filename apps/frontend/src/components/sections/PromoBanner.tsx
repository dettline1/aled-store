import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { getImagePlaceholder } from '@/lib/utils';

interface PromoBannerProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function PromoBanner({
  title,
  subtitle,
  buttonText,
  buttonLink,
  backgroundImage,
  variant = 'primary',
  className = '',
}: PromoBannerProps) {
  const isPrimary = variant === 'primary';

  return (
    <section className={`relative overflow-hidden ${className}`}>
      <div className={`${isPrimary ? 'bg-gradient-to-r from-primary-600 to-primary-800' : 'bg-gradient-to-r from-secondary-800 to-secondary-900'} relative`}>
        {/* Background image */}
        {backgroundImage && (
          <div className="absolute inset-0">
            <Image
              src={backgroundImage || getImagePlaceholder(1200, 400, 'Promo Banner')}
              alt="Промо баннер"
              fill
              className="object-cover opacity-20"
            />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-12 lg:py-16">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight">
              {title}
            </h2>
            
            <p className="text-lg lg:text-xl mb-8 text-opacity-90">
              {subtitle}
            </p>
            
            <Button
              size="lg"
              asChild
              className={isPrimary ? 'bg-yellow-500 hover:bg-yellow-600 text-black font-semibold' : 'bg-white text-secondary-900 hover:bg-secondary-100 font-semibold'}
            >
              <Link href={buttonLink}>
                {buttonText}
              </Link>
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full">
          <div className="absolute inset-0 bg-gradient-to-l from-yellow-400/10 to-transparent"></div>
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/5 rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-white/5 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}

// Готовые варианты промо баннеров
export function DiscountBanner() {
  return (
    <PromoBanner
      title="Скидки до 30%"
      subtitle="На все LED ленты и профили. Акция действует до конца месяца!"
      buttonText="Смотреть акции"
      buttonLink="/catalog?discount=true"
      variant="primary"
    />
  );
}

export function NewProductsBanner() {
  return (
    <PromoBanner
      title="Новые поступления"
      subtitle="Ознакомьтесь с последними новинками в нашем каталоге"
      buttonText="Смотреть новинки"
      buttonLink="/catalog?isNew=true"
      variant="secondary"
    />
  );
}
