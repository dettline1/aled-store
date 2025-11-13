import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Каталог',
      links: [
        { href: '/catalog/bi-led-lenses', label: 'Би-LED линзы' },
        { href: '/catalog/led-lamps', label: 'LED лампы' },
        { href: '/catalog/xenon', label: 'Ксенон' },
        { href: '/catalog/fog-lenses', label: 'Линзы для ПТФ' },
        { href: '/catalog/drl', label: 'Дневные ходовые огни' },
      ],
    },
    {
      title: 'Информация',
      links: [
        { href: '/about', label: 'О компании' },
        { href: '/blog', label: 'Блог' },
        { href: '/contact', label: 'Контакты' },
        { href: '/delivery', label: 'Доставка и оплата' },
        { href: '/warranty', label: 'Гарантия' },
      ],
    },
    {
      title: 'Наши сервисы',
      links: [
        { href: '/services/installation', label: 'Установка линз' },
        { href: '/services/repair', label: 'Ремонт фар' },
        { href: '/services/glass', label: 'Замена стекол' },
        { href: '/services/polishing', label: 'Полировка фар' },
        { href: '/contact', label: 'Записаться на установку' },
      ],
    },
  ];

  return (
    <footer className="bg-secondary-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">ALED</h3>
                <p className="text-sm text-secondary-300">Автомобильное освещение</p>
              </div>
            </div>
            <p className="text-secondary-300 text-sm mb-4">
              Би-LED линзы, ксеноновые комплекты, LED лампы для автомобилей. 
              Профессиональная установка в 4 городах России.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span>📞</span>
                <span>+7 (963) 444 35 22</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📧</span>
                <span>info@aled.ru</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🕒</span>
                <span>10:00 — 20:00 (местное время)</span>
              </div>
            </div>
          </div>

          {/* Footer sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-secondary-300 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Us Button */}
        <div className="mt-8 pt-8 border-t border-secondary-700 text-center">
          <a
            href="https://t.me/aaled_ru"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            Связаться с нами в Telegram
          </a>
          <p className="text-secondary-400 text-sm mt-3">
            Ответим на все вопросы и поможем с выбором
          </p>
        </div>

        {/* Cities section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 pt-8 border-t border-secondary-700">
          <div>
            <h4 className="font-semibold mb-3 text-primary-400">Пермь</h4>
            <p className="text-secondary-300 text-sm">ул. Крисанова, 73А</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-primary-400">Екатеринбург</h4>
            <p className="text-secondary-300 text-sm">Луганская ул., 59, корп. 1Б</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-primary-400">Челябинск</h4>
            <p className="text-secondary-300 text-sm">Механическая ул., 115Б</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-primary-400">Набережные Челны</h4>
            <p className="text-secondary-300 text-sm">Звоните для уточнения адреса</p>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-secondary-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-400 text-sm">
              © {currentYear} ALED. Все права защищены.
            </p>
            
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              {/* Social links */}
              <div className="flex items-center space-x-4">
                <a
                  href="#"
                  className="text-secondary-400 hover:text-white transition-colors"
                  aria-label="ВКонтакте"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1.033-1.49-.117-1.49.439v1.39c0 .378-.122.588-.943.588-1.836 0-3.86-1.113-5.281-3.193C4.715 10.029 3.533 6.715 5.7 6.715c.85 0 1.143.175 1.537 1.14.175.43.525 1.33.788 1.988.263.658.525.613.7.175.263-.613.875-2.1.875-3.133 0-.875-.263-1.05-1.05-1.05h-.175c-.35 0-.613-.175-.613-.613 0-.35.175-.525.438-.525h2.625c.7 0 .945.35.945 1.312v2.363c0 .525.175.7.35.7.35 0 .613-.175 1.225-.788 1.05-1.05 1.75-2.625 1.75-2.625.175-.35.438-.613.875-.613h1.75c1.05 0 .7 1.575.175 2.275-.175.263-.438.613-.788 1.05-.613.788-1.4 1.575-1.4 2.188 0 .525.7 1.312 1.575 2.188 1.05 1.05 1.575 1.925.613 2.625z"/>
                  </svg>
                </a>
                <a
                  href="https://t.me/aaled_ru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-400 hover:text-white transition-colors"
                  aria-label="Telegram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-secondary-400 hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
