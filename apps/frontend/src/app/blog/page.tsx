'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types';
import { getBlogPosts } from '@/lib/api';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/common/Pagination';
import { Loader } from '@/components/common/Loader';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { formatDate, getImagePlaceholder } from '@/lib/utils';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const { posts: fetchedPosts, pagination: paginationInfo } = await getBlogPosts(1);
        setPosts(fetchedPosts);
        setPagination(paginationInfo);
      } catch (err) {
        setError('Ошибка загрузки статей');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Блог', href: '/blog' },
  ];

  if (loading) {
    return (
      <>
        <Breadcrumbs items={breadcrumbs} />
        <div className="container mx-auto px-4 py-12">
          <Loader size="lg" text="Загрузка статей..." />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Breadcrumbs items={breadcrumbs} />
        <div className="container mx-auto px-4 py-12">
          <ErrorMessage message={error} />
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-secondary-900 mb-6">
              Блог
            </h1>
            <p className="text-xl text-secondary-600">
              Полезные статьи о LED освещении, советы по выбору и установке
            </p>
          </div>

          {/* Blog posts */}
          <div className="space-y-12">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group border-b border-secondary-200 pb-12 last:border-b-0"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="grid md:grid-cols-3 gap-8">
                    {/* Image */}
                    <div className="md:col-span-1">
                      <div className="relative aspect-video bg-secondary-100 rounded-lg overflow-hidden">
                        <Image
                          src={post.image || getImagePlaceholder(400, 300, 'Blog Post')}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="md:col-span-2">
                      <div className="mb-3">
                        <div className="flex items-center gap-4 text-sm text-secondary-500">
                          <span>{formatDate(post.publishedAt)}</span>
                          <span>•</span>
                          <span>{post.readTime} мин чтения</span>
                          <span>•</span>
                          <span>{post.author}</span>
                        </div>
                      </div>

                      <h2 className="text-2xl lg:text-3xl font-bold text-secondary-900 mb-4 group-hover:text-primary-600 transition-colors">
                        {post.title}
                      </h2>

                      <p className="text-secondary-600 mb-6 leading-relaxed">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="default" size="sm">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <span className="text-primary-600 font-medium group-hover:text-primary-700 transition-colors">
                          Читать далее →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {pagination && (
            <div className="mt-12">
              <Pagination pagination={pagination} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
