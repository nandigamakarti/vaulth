import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { articles, Article } from '../articles'; // Assuming articles.ts is in src/
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { GradientText } from '@/components/ui/gradient-text';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BlogPostPage: React.FC = () => {
  const { articleSlug } = useParams<{ articleSlug: string }>();
  const article = articles.find((a: Article) => a.slug === articleSlug);

  if (!article) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-8">Sorry, we couldn't find the article you're looking for.</p>
        <Link to="/blog" className="text-primary hover:underline">
          &larr; Back to Blog List
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8 max-w-3xl">
      <Link 
        to="/blog" 
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 group"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to all articles
      </Link>

      <article>
        <header className="mb-8">
          <div className="mb-4">
            {article.categories.map(category => (
              <Badge key={category} variant="secondary" className="mr-2 mb-2 text-xs">{category}</Badge>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            <GradientText>{article.title}</GradientText>
          </h1>
          <p className="text-sm text-muted-foreground">
            By {article.author} on {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        <img 
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-auto max-h-[400px] object-cover rounded-lg mb-8 shadow-lg"
        />

        <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert">
          {/* Using a simple renderer. For full markdown support, use react-markdown or similar */}
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;
