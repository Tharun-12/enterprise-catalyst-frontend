import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Server,
  Shield,
  Lock,
  Wifi,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { baseurl } from '@/Baseurl/baseurl';

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

const BRAND_GRADIENT =
  'bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500';

// const _BRAND_GRADIENT_HOVER =
//   'hover:bg-gradient-to-r hover:from-pink-500 hover:via-orange-500 hover:to-yellow-500';

const FeaturedCategories: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategory, _setExpandedCategory] = useState<number | null>(
    null
  );

  // =========================================================
  // CATEGORY ICON MAPPING
  // =========================================================

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();

    if (name.includes('artificial') || name.includes('ai')) {
      return {
        icon: Cpu,
        color: 'from-violet-500 to-indigo-600',
      };
    } else if (name.includes('infrastructure')) {
      return {
        icon: Server,
        color: 'from-blue-500 to-blue-700',
      };
    } else if (name.includes('security')) {
      return {
        icon: Shield,
        color: 'from-emerald-500 to-green-600',
      };
    } else if (name.includes('physical')) {
      return {
        icon: Lock,
        color: 'from-red-500 to-red-700',
      };
    } else if (name.includes('cabling')) {
      return {
        icon: Wifi,
        color: 'from-orange-500 to-amber-600',
      };
    }

    return {
      icon: Cpu,
      color: 'from-slate-500 to-slate-700',
    };
  };

  // =========================================================
  // FETCH CATEGORIES
  // =========================================================

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
        setError(
          err instanceof Error
            ? err.message
            : 'An error occurred while fetching categories'
        );

        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // =========================================================
  // NAVIGATION
  // =========================================================

  const handleViewAll = () => {
    navigate('/categories');
  };

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  const handleSubcategoryClick = (
    categoryName: string,
    _subcategoryName: string
  ) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <section className="fc-loading-section bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <div
              className={`mb-3 h-1 w-10 rounded-full ${BRAND_GRADIENT}`}
            />

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Featured Categories
            </h2>

            <p className="mt-3 max-w-2xl text-base text-slate-500">
              Explore our comprehensive range of enterprise product
              categories.
            </p>
          </div>

          <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-9 w-9 animate-spin text-orange-500" />

              <span className="text-sm font-medium text-slate-500">
                Loading categories...
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================
  // ERROR STATE
  // =========================================================

  if (error) {
    return (
      <section className="fc-error-section bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <div
              className={`mb-3 h-1 w-10 rounded-full ${BRAND_GRADIENT}`}
            />

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Featured Categories
            </h2>

            <p className="mt-3 text-base text-slate-500">
              Explore our comprehensive range of enterprise product
              categories.
            </p>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50/50 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-lg font-bold text-red-600">
              !
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              Unable to load categories
            </h3>

            <p className="mt-2 text-sm text-red-600">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================
  // MAIN COMPONENT
  // =========================================================

  return (
    <section className="fc-section bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <div className="mb-10 flex flex-col gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">

            {/* Brand heading */}
            <div className="mb-3 flex items-center gap-2">
              <span
                className={`h-1 w-8 rounded-full ${BRAND_GRADIENT}`}
              />

              <span className="bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 bg-clip-text text-xs font-semibold uppercase tracking-[0.16em] text-transparent">
                Product Categories
              </span>
            </div>

            {/* Main heading */}
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Featured{' '}
              <span className="bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Categories
              </span>
            </h2>

            {/* Description */}
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
              Explore our comprehensive range of enterprise infrastructure,
              security, networking and technology solutions.
            </p>
          </div>

          {/* View All */}
          <button
            onClick={handleViewAll}
            className="fc-view-all-button group inline-flex w-fit shrink-0 items-center gap-2 rounded-lg border border-orange-400 bg-white px-5 py-2.5 text-sm font-semibold text-orange-600 transition-all duration-200 hover:border-transparent hover:bg-gradient-to-r hover:from-pink-500 hover:via-orange-500 hover:to-yellow-500 hover:text-white"
          >
            <span>View All</span>

            <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

        {/* =====================================================
            CATEGORY GRID
        ===================================================== */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const { icon: Icon, color } = getCategoryIcon(
              category.category_name
            );

            const isExpanded = expandedCategory === category.id;

            return (
              <div
                key={category.id}
                className="fc-category-card group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_12px_30px_rgba(15,23,42,0.09)]"
              >
                {/* Brand gradient top line */}
                <div className="absolute left-0 right-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 transition-transform duration-300 group-hover:scale-x-100" />

                {/* Card */}
                <div
                  onClick={() =>
                    handleCategoryClick(category.category_name)
                  }
                  className="relative flex min-h-[290px] cursor-pointer flex-col p-7"
                >
                  {/* Icon + Arrow row */}
                  <div className="flex items-start justify-between">

                    {/* Icon */}
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-md transition-transform duration-300 group-hover:-translate-y-1`}
                    >
                      <Icon
                        className="h-7 w-7 text-white"
                        strokeWidth={1.8}
                      />
                    </div>

                    {/* Arrow */}
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-all duration-300 group-hover:border-orange-200 group-hover:bg-orange-50 group-hover:text-orange-500">
                      <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </div>
                  </div>

                  {/* Category information */}
                  <div className="mt-7">
                    <h3 className="text-xl font-semibold text-slate-900 transition-colors duration-200 group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:via-orange-500 group-hover:to-yellow-500 group-hover:bg-clip-text group-hover:text-transparent">
                      {category.category_name}
                    </h3>

                    {category.description && (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                        {category.description}
                      </p>
                    )}
                  </div>

                  {/* Bottom */}
                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 transition-colors duration-200 group-hover:text-orange-500">
                      Explore Products
                    </span>

                    <span className="text-xs font-medium text-slate-400">
                      {category.subcategories?.length || 0}{' '}
                      {category.subcategories?.length === 1
                        ? 'Subcategory'
                        : 'Subcategories'}
                    </span>
                  </div>
                </div>

                {/* =================================================
                    SUBCATEGORIES
                ================================================= */}

                {isExpanded &&
                  category.subcategories &&
                  category.subcategories.length > 0 && (
                    <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        {category.subcategories.map((sub) => (
                          <span
                            key={sub.id}
                            className="cursor-pointer rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-all duration-200 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                            onClick={() =>
                              handleSubcategoryClick(
                                category.category_name,
                                sub.subcategory_name
                              )
                            }
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

        {/* =====================================================
            BOTTOM INFORMATION
        ===================================================== */}

        {categories.length > 0 && (
          <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-center sm:flex-row sm:text-left">
            <p className="text-sm text-slate-500">
              Showing{' '}
              <span className="font-semibold text-slate-700">
                {categories.length}
              </span>{' '}
              featured categories
            </p>

            <button
              onClick={handleViewAll}
              className="fc-bottom-link group inline-flex items-center gap-1.5 bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 bg-clip-text text-sm font-semibold text-transparent"
            >
              Browse all categories

              <ChevronRight className="h-4 w-4 text-orange-500 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCategories;