import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (items.length <= 1) return null;

  return (
    <nav className={cn('py-4', className)} aria-label="Breadcrumb">
      <div className="container mx-auto px-4">
        <ol className="flex items-center space-x-2 text-sm">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <svg
                  className="w-4 h-4 mx-2 text-secondary-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              
              {index === items.length - 1 ? (
                <span className="text-secondary-600 font-medium">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-secondary-500 hover:text-primary-600 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
