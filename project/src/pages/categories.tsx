import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/shared';
import * as Icons from 'lucide-react';
import { PageBreadcrumb as Breadcrumb } from '@/layouts/customer-layout-wrapper';
import { useState, useEffect } from 'react';

// Category interface based on your API response
interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// Define a color mapping for categories
const categoryColors: Record<string, string> = {
  'Artificial Intelligence': '#6C63FF',
  'Data Cabling': '#00B4D8',
  'Data Infrastructure': '#2D9CDB',
  'Data Physical Security': '#F2994A',
  'Data Security': '#27AE60',
  'Default': '#6B7280'
};

// Define icon mapping for categories
const categoryIcons: Record<string, keyof typeof Icons> = {
  'Artificial Intelligence': 'Brain',
  'Data Cabling': 'Network',
  'Data Infrastructure': 'Server',
  'Data Physical Security': 'Shield',
  'Data Security': 'Lock',
  'Default': 'Package'
};

// Placeholder images for categories
const categoryImages: Record<string, string> = {
  'Artificial Intelligence': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
  'Data Cabling': 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800&h=400&fit=crop',
  'Data Infrastructure': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
  'Data Physical Security': 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=400&fit=crop',
  'Data Security': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop',
  'Default': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop'
};

// Function to create slug from name
const createSlug = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '-');
};

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/categories/');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Check if the response has the expected structure
        if (data && data.success && Array.isArray(data.data)) {
          setCategories(data.data);
        } else {
          setError('Invalid data format received from API');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to fetch categories. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Loading state with skeleton
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Categories' }]} />
        <SectionHeader
          title="Product Categories"
          subtitle="Browse our comprehensive catalog of enterprise product categories, each with specialized solutions."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden h-72 animate-pulse">
              <div className="h-40 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-5">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Categories' }]} />
        <SectionHeader
          title="Product Categories"
          subtitle="Browse our comprehensive catalog of enterprise product categories, each with specialized solutions."
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Failed to Load Categories</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (categories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Categories' }]} />
        <SectionHeader
          title="Product Categories"
          subtitle="Browse our comprehensive catalog of enterprise product categories, each with specialized solutions."
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-muted-foreground text-5xl mb-4">📦</div>
            <h2 className="text-xl font-semibold mb-2">No Categories Available</h2>
            <p className="text-muted-foreground">There are no categories to display at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Categories' }]} />
      <SectionHeader
        title="Product Categories"
        subtitle="Browse our comprehensive catalog of enterprise product categories, each with specialized solutions."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat, i) => {
          // Get category color or default
          const color = categoryColors[cat.name] || categoryColors.Default;
          // Get icon name or default
          const iconName = categoryIcons[cat.name] || categoryIcons.Default;
          const Icon = (Icons as any)[iconName] || Icons.Package;
          // Get image or default
          const imageUrl = categoryImages[cat.name] || categoryImages.Default;
          const slug = createSlug(cat.name);

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group h-full flex flex-col">
                <div
                  className="h-40 relative bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${imageUrl})`,
                  }}
                >
                  <div 
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(135deg, ${color}80, ${color}40)` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className="w-16 h-16 text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 text-foreground border-0 shadow-sm backdrop-blur-sm">
                      {cat.id ? `${cat.id} Products` : 'Products'}
                    </Badge>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-3">
                    {cat.description || 'No description available'}
                  </p>
                  
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    style={{ 
                      borderColor: color,
                      color: color,
                    } as React.CSSProperties}
                  >
                    <Link to={`/products?category=${slug}`}>
                      Browse Products <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}