import React from 'react';
import { Link } from 'react-router-dom';
import { articles, Article } from '../articles'; // Assuming articles.ts is in src/
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { GradientText } from '@/components/ui/gradient-text';

const BlogListPage: React.FC = () => {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
      <Link 
        to="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 group"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Home
      </Link>
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          <GradientText>HabitVault Insights</GradientText>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore articles on habit formation, productivity, mindfulness, and personal growth.
        </p>
      </header>

      {articles.length === 0 ? (
        <p className="text-center text-muted-foreground">No articles available yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article: Article) => (
            <Card key={article.slug} className="flex flex-col overflow-hidden h-full hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <CardHeader className="p-0">
                <img 
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
              </CardHeader>
              <CardContent className="p-6 flex-grow">
                <div className="mb-2">
                  {article.categories.map(category => (
                    <Badge key={category} variant="secondary" className="mr-2 mb-2 text-xs">{category}</Badge>
                  ))}
                </div>
                <CardTitle className="text-xl font-semibold mb-2 leading-tight">
                  {article.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground mb-3">
                  By {article.author} on {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {article.summary}
                </p>
              </CardContent>
              <CardFooter className="p-6 pt-0 mt-auto">
                <Link 
                  to={`/blog/${article.slug}`}
                  className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogListPage;
