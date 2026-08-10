// products.tsx
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { ProductCard } from '@/components/product-card';
import { FilterPanel, type FilterState } from '@/components/filter-panel';
import { EmptyState, ProductGridSkeleton } from '@/components/shared';
import { Package } from 'lucide-react';
import { PageBreadcrumb as Breadcrumb } from '@/layouts/customer-layout-wrapper';
import { baseurl } from '@/Baseurl/baseurl';
import type { Product, Category, Brand } from '@/types';

// ---- Raw API response shapes ----
interface ApiCategory {
  id: number;
  category_name: string;
  created_at: string;
  updated_at: string;
}

interface ApiBrand {
  id: number;
  brand_name: string;
  description: string;
  product_series: string;
  conductor_type: string;
  cable_od: string;
  jacket_material: string;
  bandwidth: string;
  operating_temperature: string;
  poe_support: string;
  category_id: number;
  category_name: string;
  created_at: string;
  updated_at: string;
}

interface ApiVariant {
  id: number;
  product_id: number;
  color_name?: string;
  color_hex?: string;
  price: string;
  stock: number;
  image_url: string;
  variant_name?: string;
  part_code?: string;
  category?: string;
  brand?: string;
  description?: string;
  spec_type?: string;
  color?: string;
  size?: string;
  availability?: string;
  datasheet_url?: string;
}

interface ApiProduct {
  id: number;
  product_name: string;
  product_code: string;
  product_category_id: number;
  product_brand: string;
  product_details_pdf: string;
  price: string;
  min_price?: string;
  max_price?: string;
  dimensions?: string;
  specifications?: string;
  weight?: string;
  discount: string;
  product_description: string;
  warranty: string;
  created_at: string;
  updated_at: string;
  category_name?: string;
  product_series?: string;
  product_type?: string;
  conductor_type?: string;
  cable_od?: string;
  jacket_material?: string;
  bandwidth?: string;
  operating_temperature?: string;
  poe_support?: string;
  variants?: ApiVariant[];
}

// ---- Transform API product into the app-wide `Product` type ----
const transformProduct = (
  product: ApiProduct,
  categories: ApiCategory[],
  brands: ApiBrand[]
): Product => {
  const category = categories.find(c => c.id === product.product_category_id);
  const brand = brands.find(b => b.brand_name === product.product_brand);

  const galleryImages = product.variants?.map(v =>
    v.image_url ? `${baseurl}${v.image_url}` : null
  ).filter(Boolean) as string[] || [];

  const defaultImage = 'https://via.placeholder.com/400x400';
  const gallery = galleryImages.length > 0 ? galleryImages : [defaultImage];

  const priceNum = parseFloat(product.price);
  const discountNum = parseFloat(product.discount || '0');
  
  // Parse min and max prices from API
  const minPrice = product.min_price ? parseFloat(product.min_price) : undefined;
  const maxPrice = product.max_price ? parseFloat(product.max_price) : undefined;

  return {
    id: String(product.id),
    name: product.product_name,
    slug: product.product_name.toLowerCase().replace(/\s+/g, '-'),
    sku: product.product_code,
    brandId: String(brand?.id ?? 'unknown'),
    brandName: brand?.brand_name || product.product_brand || 'Unknown',
    categoryId: String(product.product_category_id),
    categoryName: category?.category_name || product.category_name || 'Uncategorized',
    shortDescription: product.product_description?.substring(0, 150) || '',
    description: product.product_description || '',
    gallery,
    features: product.specifications?.split(',').map(s => s.trim()).filter(Boolean) || [],
    specifications: {},
    currency: 'INR',
    relatedProductIds: [],
    specGroups: [
      {
        groupName: 'Specifications',
        fields: [
          { key: 'dimensions', label: 'Dimensions', value: product.dimensions || 'N/A' },
          { key: 'weight', label: 'Weight', value: product.weight ? `${product.weight} kg` : 'N/A' },
          { key: 'specifications', label: 'Specifications', value: product.specifications || 'N/A' },
          { key: 'warranty', label: 'Warranty', value: product.warranty || 'Standard' },
        ]
      }
    ],
    price: priceNum,
    minPrice: minPrice,
    maxPrice: maxPrice,
    originalPrice: priceNum * (1 + discountNum / 100),
    discountPercentage: discountNum,
    status: 'active',
    isPopular: false,
    isNew: false,
    rating: 4.5,
    reviewCount: 0,
    downloads: product.product_details_pdf
      ? [{ name: 'Product Details', type: 'pdf' as const, size: 'PDF', url: product.product_details_pdf }]
      : [],
    createdAt: product.created_at,
    warranty: product.warranty || 'Standard warranty',
    variants: product.variants?.map(v => ({
      id: v.id,
      color_name: v.color_name || v.color || 'Default',
      color_hex: v.color_hex || '#000000',
      price: v.price,
      stock: v.stock,
      image_url: v.image_url,
    })),
    hasVariants: (product.variants?.length || 0) > 0,
    stock: product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0,
  };
};

export function ProductsPage() {
  const [searchParams, _setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('search') || '';

  const createSlug = (name: string): string => {
    if (!name) return '';
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const categoriesRes = await fetch(`${baseurl}/api/categories/`);
        const categoriesData = await categoriesRes.json();
        if (!categoriesData.success) throw new Error('Failed to fetch categories');
        setCategories(categoriesData.data);

        const brandsRes = await fetch(`${baseurl}/api/brands/`);
        const brandsData = await brandsRes.json();
        if (!brandsData.success) throw new Error('Failed to fetch brands');
        setBrands(brandsData.data);

        const productsRes = await fetch(`${baseurl}/api/products/products-with-variants`);
        const productsData = await productsRes.json();

        if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else {
          throw new Error('Invalid products data format');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Extract unique variant options from products
  const variantOptions = useMemo(() => {
    const options: Record<string, string[]> = {
      spec_type: [],
      color: [],
      size: [],
      part_code: [],
    };
    
    products.forEach(product => {
      if (product.variants) {
        product.variants.forEach(variant => {
          if (variant.spec_type && !options.spec_type.includes(variant.spec_type)) {
            options.spec_type.push(variant.spec_type);
          }
          if (variant.color && !options.color.includes(variant.color)) {
            options.color.push(variant.color);
          }
          if (variant.size && !options.size.includes(variant.size)) {
            options.size.push(variant.size);
          }
          if (variant.part_code && !options.part_code.includes(variant.part_code)) {
            options.part_code.push(variant.part_code);
          }
        });
      }
    });

    Object.keys(options).forEach(key => {
      options[key].sort();
    });

    return options;
  }, [products]);

  // Extract unique specification values from products
  const specOptions = useMemo(() => {
    const options: Record<string, string[]> = {};
    
    products.forEach(product => {
      if (product.bandwidth) {
        if (!options.bandwidth) options.bandwidth = [];
        if (!options.bandwidth.includes(product.bandwidth)) {
          options.bandwidth.push(product.bandwidth);
        }
      }
      if (product.conductor_type) {
        if (!options.conductor_type) options.conductor_type = [];
        if (!options.conductor_type.includes(product.conductor_type)) {
          options.conductor_type.push(product.conductor_type);
        }
      }
      if (product.cable_od) {
        if (!options.cable_od) options.cable_od = [];
        if (!options.cable_od.includes(product.cable_od)) {
          options.cable_od.push(product.cable_od);
        }
      }
      if (product.jacket_material) {
        if (!options.jacket_material) options.jacket_material = [];
        if (!options.jacket_material.includes(product.jacket_material)) {
          options.jacket_material.push(product.jacket_material);
        }
      }
      if (product.operating_temperature) {
        if (!options.operating_temperature) options.operating_temperature = [];
        if (!options.operating_temperature.includes(product.operating_temperature)) {
          options.operating_temperature.push(product.operating_temperature);
        }
      }
      if (product.poe_support) {
        if (!options.poe_support) options.poe_support = [];
        if (!options.poe_support.includes(product.poe_support)) {
          options.poe_support.push(product.poe_support);
        }
      }
    });

    Object.keys(options).forEach(key => {
      options[key].sort();
    });

    return options;
  }, [products]);

  // Calculate global price range
  const priceRange = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    
    products.forEach(p => {
      const pMin = p.min_price ? parseFloat(p.min_price) : parseFloat(p.price);
      const pMax = p.max_price ? parseFloat(p.max_price) : parseFloat(p.price);
      if (pMin < min) min = pMin;
      if (pMax > max) max = pMax;
    });
    
    return { min: min === Infinity ? 0 : min, max: max === -Infinity ? 100000 : max };
  }, [products]);

  // Transform API brands to the format expected by FilterPanel and types
  const transformedBrands = useMemo((): Brand[] => {
    return brands.map(b => ({
      id: String(b.id),
      name: b.brand_name,
      slug: createSlug(b.brand_name),
      logoText: b.brand_name.charAt(0),
      country: '',
      description: b.description || '',
      website: '',
    }));
  }, [brands]);

  // Transform API categories to the format expected by FilterPanel and types
  const transformedCategories = useMemo((): Category[] => {
    return categories.map(c => ({
      id: String(c.id),
      name: c.category_name,
      slug: createSlug(c.category_name),
      icon: '',
      description: '',
      color: '#000000',
      productCount: 0,
      featured: false,
    }));
  }, [categories]);

  const transformedProducts = useMemo(() => {
    return products.map(p => transformProduct(p, categories, brands));
  }, [products, categories, brands]);

  const currentCategory = categorySlug
    ? categories.find((c) => createSlug(c.category_name) === categorySlug)
    : undefined;

  const [filters, setFilters] = useState<FilterState>({
    category: categorySlug,
    brands: [],
    specs: {},
    search: searchQuery,
    sort: 'latest',
    minPrice: undefined,
    maxPrice: undefined,
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: categorySlug,
      search: searchQuery,
      specs: {},
      brands: [],
      minPrice: undefined,
      maxPrice: undefined,
    }));
    setCurrentPage(1);
  }, [categorySlug, searchQuery]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [filters]);

  const filteredProducts = useMemo(() => {
    let result = transformedProducts.filter((p) => p.status === 'active');

    if (filters.category) {
      const cat = categories.find((c) => createSlug(c.category_name) === filters.category);
      if (cat) result = result.filter((p) => p.categoryId === String(cat.id));
    }

    if (filters.brands.length > 0) {
      result = result.filter((p) => filters.brands.includes(p.brandId));
    }

    // Price range filter
    if (filters.minPrice !== undefined && filters.minPrice > 0) {
      result = result.filter((p) => {
        const price = p.minPrice ?? p.price;
        return price >= (filters.minPrice || 0);
      });
    }
    if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
      result = result.filter((p) => {
        const price = p.maxPrice ?? p.price;
        return price <= (filters.maxPrice || Infinity);
      });
    }

    // Filter by specifications (product-level and variant-level)
    if (Object.keys(filters.specs).length > 0) {
      result = result.filter((p) => {
        const productApi = products.find(api => String(api.id) === p.id);
        if (!productApi) return true;

        let matchesAll = true;
        for (const [key, values] of Object.entries(filters.specs)) {
          if (values.length === 0) continue;
          
          // Check if this is a variant-level filter
          if (['spec_type', 'color', 'size', 'part_code'].includes(key)) {
            // Check if any variant matches the filter
            const hasVariantMatch = productApi.variants?.some(variant => {
              const variantValue = (variant as any)[key];
              return variantValue && values.includes(variantValue);
            }) || false;
            
            if (!hasVariantMatch) {
              matchesAll = false;
              break;
            }
          } else {
            // Product-level spec filter
            const productValue = (productApi as any)[key];
            if (!productValue || !values.includes(productValue)) {
              matchesAll = false;
              break;
            }
          }
        }
        return matchesAll;
      });
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brandName.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      );
    }

    switch (filters.sort) {
      case 'popular':
        result = [...result].sort((a, b) => Number(b.isPopular) - Number(a.isPopular) || b.reviewCount - a.reviewCount);
        break;
      case 'az':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        result = [...result].sort((a, b) => (a.minPrice ?? a.price) - (b.minPrice ?? b.price));
        break;
      case 'price-high':
        result = [...result].sort((a, b) => (b.maxPrice ?? b.price) - (a.maxPrice ?? a.price));
        break;
      default:
        result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [filters, transformedProducts, categories, products]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (currentPage === 0 && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of products grid
    const gridElement = document.getElementById('products-grid');
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // const handleCategoryChange = (slug: string | null) => {
  //   if (slug) {
  //     setSearchParams({ category: slug });
  //   } else {
  //     setSearchParams({});
  //   }
  //   setCurrentPage(1);
  // };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Failed to Load Products</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Breadcrumb items={[
        { label: 'Home', path: '/' },
        { label: 'Products', path: '/products' },
        ...(currentCategory ? [{ label: currentCategory.category_name }] : [])
      ]} />

      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
          {currentCategory ? currentCategory.category_name : 'All Products'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {currentCategory
            ? `Browse ${currentCategory.category_name} products`
            : 'Browse our complete catalog of enterprise products across all categories.'}
        </p>
      </div>

      <div className="flex gap-6">
        {/* Desktop filter - Left Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            resultCount={filteredProducts.length}
            brands={transformedBrands}
            categories={transformedCategories}
            specOptions={specOptions}
            variantOptions={variantOptions}
            priceRange={priceRange}
          />
        </aside>

        {/* Main content - Right side */}
        <div className="flex-1 min-w-0">
          {/* Toolbar - Removed pagination from here */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
              <div className="relative flex-1 sm:max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  className="pl-9 h-9 rounded-full border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20"
                  value={filters.search}
                  onChange={(e) => {
                    setFilters({ ...filters, search: e.target.value });
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Sheet open={showMobileFilter} onOpenChange={setShowMobileFilter}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden rounded-full">
                    <Filter className="w-4 h-4 mr-1.5" /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
                  <SheetTitle className="sr-only">Filters</SheetTitle>
                  <FilterPanel
                    filters={filters}
                    onFilterChange={setFilters}
                    resultCount={filteredProducts.length}
                    brands={transformedBrands}
                    categories={transformedCategories}
                    specOptions={specOptions}
                    variantOptions={variantOptions}
                    priceRange={priceRange}
                  />
                </SheetContent>
              </Sheet>
              <Select value={filters.sort} onValueChange={(v) => {
                setFilters({ ...filters, sort: v });
                setCurrentPage(1);
              }}>
                <SelectTrigger className="w-[140px] h-9 rounded-full border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="az">A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products grid */}
          <div id="products-grid">
            {loading ? (
              <ProductGridSkeleton count={itemsPerPage} />
            ) : currentItems.length === 0 ? (
              <EmptyState
                icon={<Package className="w-8 h-8" />}
                title="No products found"
                description="Try adjusting your filters or search query to find what you're looking for."
                action={<Button variant="outline" onClick={() => {
                  setFilters({ 
                    category: filters.category, 
                    brands: [], 
                    specs: {}, 
                    search: '', 
                    sort: 'latest',
                    minPrice: undefined,
                    maxPrice: undefined,
                  });
                  setCurrentPage(1);
                }}>Clear Filters</Button>}
              />
            ) : (
              <>
                {/* Products count */}
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Showing <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredProducts.length)}
                  </span> of <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {filteredProducts.length}
                  </span> products
                </p>
                
                {/* Products grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {currentItems.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.03, 0.3) }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination - Below products */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Previous Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-9 px-3 rounded-md"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-1">
                        {getPageNumbers().map((page, index) => (
                          page === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                              …
                            </span>
                          ) : (
                            <Button
                              key={page}
                              variant={currentPage === page ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => paginate(page as number)}
                              className={`h-9 w-9 p-0 rounded-md ${
                                currentPage === page 
                                  ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                              }`}
                            >
                              {page}
                            </Button>
                          )
                        ))}
                      </div>

                      {/* Next Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="h-9 px-3 rounded-md"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}