import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Server, 
  Shield, 
  Lock, 
  Wifi,
  ChevronRight,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {baseurl} from "@/Baseurl/baseurl"

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

interface ApiResponse {
  success: boolean;
  data: Category[];
}

const FeaturedCategories: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  // Map category names to icons and colors
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('artificial') || name.includes('ai')) {
      return { icon: Cpu, color: 'from-purple-500 to-indigo-600' };
    } else if (name.includes('infrastructure')) {
      return { icon: Server, color: 'from-blue-500 to-cyan-600' };
    } else if (name.includes('security')) {
      return { icon: Shield, color: 'from-green-500 to-emerald-600' };
    } else if (name.includes('physical')) {
      return { icon: Lock, color: 'from-red-500 to-rose-600' };
    } else if (name.includes('cabling')) {
      return { icon: Wifi, color: 'from-orange-500 to-amber-600' };
    }
    // Default icon and color
    return { icon: Cpu, color: 'from-gray-500 to-gray-600' };
  };

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${baseurl}/api/categories/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result: ApiResponse = await response.json();
        
        if (result.success) {
          setCategories(result.data);
        } else {
          throw new Error('Failed to fetch categories');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching categories');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleViewAll = () => {
    navigate('/categories');
  };

  const handleCategoryClick = () => {
    // Navigate to products without any query parameters
    navigate('/products');
  };

  const handleSubcategoryClick = () => {
    // Navigate to products without any query parameters
    navigate('/products');
  };

  const toggleSubcategories = (categoryId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the category click
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-14 gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                Featured Categories
              </h2>
              <p className="text-gray-600 text-lg">
                Explore our comprehensive range of enterprise product categories.
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-14 gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                Featured Categories
              </h2>
              <p className="text-gray-600 text-lg">
                Explore our comprehensive range of enterprise product categories.
              </p>
            </div>
          </div>
          <div className="text-center py-20">
            <p className="text-red-600 text-lg">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header with View All button */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-14 gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              Featured Categories
            </h2>
            <p className="text-gray-600 text-lg">
              Explore our comprehensive range of enterprise product categories.
            </p>
          </div>
          
          {/* View All Button with navigation */}
          <button 
            onClick={handleViewAll}
            className="group flex items-center gap-2 px-6 py-3 bg-transparent hover:bg-blue-50 text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:border-blue-700 transition-all duration-300 whitespace-nowrap cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {categories.map((category) => {
            const { icon: Icon, color } = getCategoryIcon(category.category_name);
            const isExpanded = expandedCategory === category.id;
            
            return (
              <div
                key={category.id}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-transparent"
              >
                {/* Main Category Card */}
                <div 
                  className="p-8 flex flex-col items-center text-center cursor-pointer hover:-translate-y-1 transition-transform duration-300"
                  onClick={handleCategoryClick}
                >
                  {/* Gradient Icon Background */}
                  <div className={`mb-5 p-4 rounded-2xl bg-gradient-to-br ${color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <Icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                  </div>

                  {/* Category Name */}
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {category.category_name}
                  </h3>

                  {/* Description (truncated) */}
                  {category.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  {/* Subcategory toggle button */}
                  {/* {category.subcategories && category.subcategories.length > 0 && (
                    <button
                      onClick={(e) => toggleSubcategories(category.id, e)}
                      className="mt-4 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <span>{isExpanded ? 'Hide' : 'Show'} Subcategories</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  )} */}

                  {/* Hover Arrow Effect */}
                  <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>

                {/* Subcategories List (expandable) */}
                {isExpanded && category.subcategories && category.subcategories.length > 0 && (
                  <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {category.subcategories.map((sub) => (
                        <span
                          key={sub.id}
                          className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-gray-200 hover:border-blue-400 hover:text-blue-600 transition-colors cursor-pointer"
                          onClick={handleSubcategoryClick}
                        >
                          {sub.subcategory_name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;