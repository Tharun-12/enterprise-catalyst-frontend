import React from 'react';
import { 
  Cpu, 
  Server, 
  Shield, 
  Lock, 
  Wifi,
  ChevronRight
} from 'lucide-react';
// Remove Next.js import - use this instead:
import { useNavigate } from 'react-router-dom';

const FeaturedCategories: React.FC = () => {
  const navigate = useNavigate(); // React Router v6

  const categories = [
    { 
      name: 'Artificial Intelligence', 
      productCount: 18,
      icon: Cpu,
      color: 'from-purple-500 to-indigo-600'
    },
    { 
      name: 'Data Infrastructure', 
      productCount: 19,
      icon: Server,
      color: 'from-blue-500 to-cyan-600'
    },
    { 
      name: 'Data Security', 
      productCount: 19,
      icon: Shield,
      color: 'from-green-500 to-emerald-600'
    },
    { 
      name: 'Data Physical Security', 
      productCount: 19,
      icon: Lock,
      color: 'from-red-500 to-rose-600'
    },
    { 
      name: 'Data Cabling', 
      productCount: 19,
      icon: Wifi,
      color: 'from-orange-500 to-amber-600'
    },
  ];

  const handleViewAll = () => {
    navigate('/categories');
  };

  const handleCategoryClick = () => {
    navigate('/categories');
  };

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
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center text-center border border-gray-100 hover:border-transparent hover:-translate-y-2 cursor-pointer"
                onClick={() => handleCategoryClick()}
              >
                {/* Gradient Icon Background */}
                <div className={`mb-5 p-4 rounded-2xl bg-gradient-to-br ${category.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  <Icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>

                {/* Category Name */}
                <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>

                {/* Product Count */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">Products</span>
                  <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {category.productCount}
                  </span>
                </div>

                {/* Hover Arrow Effect */}
                <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;