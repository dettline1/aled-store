import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: {
    default: 'ALED - LED освещение для дома и бизнеса',
    template: '%s | ALED',
  },
  description: 'Широкий выбор светодиодных лент, профилей, контроллеров и аксессуаров. Качественные LED решения с доставкой по всей России.',
  keywords: ['LED ленты', 'светодиодные ленты', 'LED освещение', 'контроллеры RGB', 'алюминиевые профили', 'блоки питания'],
  authors: [{ name: 'ALED' }],
  creator: 'ALED',
  publisher: 'ALED',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://aled.ru'),
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'ALED',
    title: 'ALED - LED освещение для дома и бизнеса',
    description: 'Широкий выбор светодиодных лент, профилей, контроллеров и аксессуаров.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ALED - LED освещение',
    description: 'Качественные LED решения для вашего дома',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
