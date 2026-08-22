import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Package, Brain, Network, Server, Shield, Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/shared';
import { PageBreadcrumb as Breadcrumb } from '@/layouts/customer-layout-wrapper';
import { useState, useEffect } from 'react';
import { baseurl } from '@/Baseurl/baseurl';

// Updated Category interface based on your API response
interface Subcategory {
  id: number;
  subcategory_name: string;
  created_at: string;
}

interface Category {
  id: number;
  category_name: string;
  description: string;
  category_image: string;
  created_at: string;
  updated_at: string;
  subcategories: Subcategory[];
}

// Define a color mapping for categories
const categoryColors: Record<string, string> = {
  'Artifical Intelligence': '#6C63FF', // Note: Fixed spelling to match API
  'Artificial Intelligence': '#6C63FF',
  'Data Cabling': '#00B4D8',
  'Data Infrastructure': '#2D9CDB',
  'Data Physical Security': '#F2994A',
  'Data Security': '#27AE60',
  'Default': '#6B7280'
};

// Define icon mapping for categories
const categoryIcons: Record<string, React.ElementType> = {
  'Artifical Intelligence': Brain,
  'Artificial Intelligence': Brain,
  'Data Cabling': Network,
  'Data Infrastructure': Server,
  'Data Physical Security': Shield,
  'Data Security': Lock,
  'Default': Package
};

// Function to create slug from name with fallback
const createSlug = (name: string): string => {
  if (!name) return 'uncategorized';
  return name.toLowerCase().replace(/\s+/g, '-');
};

// Skeleton Card Component
const SkeletonCard = () => (
  <Card className="overflow-hidden h-72 animate-pulse">
    <div className="h-40 bg-gray-200 dark:bg-gray-700"></div>
    <div className="p-5">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  </Card>
);

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseurl}/api/categories/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Categories' }]} />
        <SectionHeader
          title="Product Categories"
          subtitle="Browse our comprehensive catalog of enterprise product categories, each with specialized solutions."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Categories' }]} />
      
      <SectionHeader
        title="Product Categories"
        subtitle="Browse our comprehensive catalog of enterprise product categories, each with specialized solutions."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, index) => {
          const categoryName = cat.category_name;
          
          // Get category color or default
          const color = categoryColors[categoryName] || categoryColors.Default;
          // Get icon component or default
          const Icon = categoryIcons[categoryName] || categoryIcons.Default;
          // Use actual category image from API
          const imageUrl = cat.category_image 
            ? `${baseurl}/uploads/categories/${cat.category_image}`
            : 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop';
          
          const slug = createSlug(categoryName);
          
          // Get subcategory names for display
          const subcategoryNames = cat.subcategories?.map(sub => sub.subcategory_name) || [];

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="h-full"
            >
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group h-full flex flex-col border-0 shadow-lg">
                {/* Image Section */}
                <div
                  className="h-48 relative bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${imageUrl})`,
                  }}
                >
                  {/* Gradient Overlay */}
                  <div 
                    className="absolute inset-0"
                    style={{ 
                      background: `linear-gradient(135deg, ${color}cc, ${color}66)` 
                    }}
                  />
                  
                  {/* Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className="w-20 h-20 text-white drop-shadow-lg opacity-90 group-hover:scale-110 transition-transform duration-300" />
                  </div>

                  {/* Subcategories Badge */}
                  {subcategoryNames.length > 0 && (
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-black/30 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                        {subcategoryNames.slice(0, 2).join(' • ')}
                        {subcategoryNames.length > 2 && ` +${subcategoryNames.length - 2}`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1 bg-white dark:bg-gray-800">
                  <h3 className="font-bold text-xl mb-2 line-clamp-1 text-gray-900 dark:text-white">
                    {categoryName}
                  </h3>
                  
                  {/* Use actual description from API */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 flex-1 line-clamp-3">
                    {cat.description || `Explore our comprehensive range of ${categoryName.toLowerCase()} solutions designed for enterprise needs.`}
                  </p>
                  
                  {/* Subcategories Tags */}
                  {subcategoryNames.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {subcategoryNames.slice(0, 3).map((name, idx) => (
                        <span 
                          key={idx}
                          className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                        >
                          {name}
                        </span>
                      ))}
                      {subcategoryNames.length > 3 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                          +{subcategoryNames.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Browse Products Button */}
                  <Link to={`/products?category=${slug}`} className="w-full mt-auto">
                    <Button 
                      className="w-full group-hover:shadow-lg transition-all duration-300"
                      style={{ 
                        backgroundColor: color,
                        color: 'white',
                        border: 'none'
                      }}
                    >
                      Browse Products 
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}