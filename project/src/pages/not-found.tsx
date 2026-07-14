import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageBreadcrumb as Breadcrumb } from '@/layouts/customer-layout-wrapper';

export function NotFoundPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: '404' }]} />
      <div className="flex flex-col items-center justify-center text-center py-20">
        <div className="text-8xl font-bold text-primary/20 mb-4">404</div>
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          The page you're looking for doesn't exist or has been moved. Try searching for products or browse our categories.
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link to="/"><Home className="w-4 h-4 mr-2" /> Go Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/products"><Search className="w-4 h-4 mr-2" /> Browse Products</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
