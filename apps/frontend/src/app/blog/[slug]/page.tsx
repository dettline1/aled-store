'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/types';
import { getBlogPostBySlug, getRecentBlogPosts } from '@/lib/api';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/common/Loader';
import { ErrorMessage, NotFoundError } from '@/components/common/ErrorMessage';
import { formatDate, getImagePlaceholder } from '@/lib/utils';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const [fetchedPost, fetchedRecentPosts] = await Promise.all([
          getBlogPostBySlug(slug),
          getRecentBlogPosts(3),
        ]);
        
        if (fetchedPost) {
          setPost(fetchedPost);
          setRecentPosts(fetchedRecentPosts.filter(p => p.id !== fetchedPost.id));
        } else {
          setError('Статья не найдена');
        }
      } catch (err) {
        setError('Ошибка загрузки статьи');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Loader size="lg" text="Загрузка статьи..." />
      </div>
    );
  }

  if (error === 'Статья не найдена') {
    return (
      <NotFoundError
        title="Статья не найдена"
        message="Запрашиваемая статья не существует или была удалена."
        showHomeButton={false}
      />
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <ErrorMessage message={error || 'Ошибка загрузки статьи'} />
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Блог', href: '/blog' },
    { label: post.title, href: `/blog/${post.slug}` },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Article header */}
          <header className="mb-12">
            <div className="mb-6">
              <div className="flex items-center gap-4 text-sm text-secondary-500 mb-4">
                <span>{formatDate(post.publishedAt)}</span>
                <span>•</span>
                <span>{post.readTime} мин чтения</span>
                <span>•</span>
                <span>{post.author}</span>
              </div>
              
              <h1 className="text-3xl lg:text-5xl font-bold text-secondary-900 mb-6 leading-tight">
                {post.title}
              </h1>
              
              <p className="text-xl text-secondary-600 leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Featured image */}
            <div className="relative aspect-video bg-secondary-100 rounded-lg overflow-hidden">
              <Image
                src={post.image || getImagePlaceholder(800, 450, 'Article Image')}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            </div>
          </header>

          {/* Article content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
              className="text-secondary-700 leading-relaxed whitespace-pre-line"
            />
          </div>

          {/* Article footer */}
          <footer className="border-t border-secondary-200 pt-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-primary-600">
                    {post.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900">{post.author}</h3>
                  <p className="text-sm text-secondary-500">Автор статьи</p>
                </div>
              </div>

              <Button asChild variant="outline">
                <Link href="/blog">
                  ← Все статьи
                </Link>
              </Button>
            </div>
          </footer>
        </div>

        {/* Related posts */}
        {recentPosts.length > 0 && (
          <div className="max-w-6xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-secondary-900 mb-8 text-center">
              Другие статьи
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.slice(0, 3).map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group"
                >
                  <div className="bg-white border border-secondary-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative aspect-video bg-secondary-100">
                      <Image
                        src={relatedPost.image || getImagePlaceholder(400, 225, 'Blog Post')}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {relatedPost.title}
                      </h3>
                      
                      <p className="text-sm text-secondary-600 mb-3 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      
                      <div className="text-xs text-secondary-500">
                        {formatDate(relatedPost.publishedAt)} • {relatedPost.readTime} мин
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
