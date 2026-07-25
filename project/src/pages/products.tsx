import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Search, Filter } from 'lucide-react';
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
import type { Product } from '@/types';

// ---- Raw API response shapes ----
interface ApiCategory {
  id: number;
  category_name: string;
  created_at: string;
  updated_at: string;
}

interface ApiBrand {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface ApiVariant {
  id: number;
  product_id: number;
  color_name: string;
  color_hex: string;
  price: string;
  stock: number;
  image_url: string;
}

interface ApiProduct {
  id: number;
  product_name: string;
  product_code: string;
  product_category_id: number;
  product_brand: string;
  product_details_pdf: string;
  price: string;
  dimensions: string;
  specifications: string;
  weight: string;
  discount: string;
  product_description: string;
  warranty: string;
  created_at: string;
  updated_at: string;
  category_name?: string;
  variants?: ApiVariant[];
}

// ---- Transform API product into the app-wide `Product` type ----
const transformProduct = (
  product: ApiProduct,
  categories: ApiCategory[],
  brands: ApiBrand[]
): Product => {
  const category = categories.find(c => c.id === product.product_category_id);
  const brand = brands.find(b => b.name === product.product_brand);

  const galleryImages = product.variants?.map(v =>
    v.image_url ? `${baseurl}${v.image_url}` : null
  ).filter(Boolean) as string[] || [];

  const defaultImage = 'https://via.placeholder.com/400x400';
  const gallery = galleryImages.length > 0 ? galleryImages : [defaultImage];

  // Use variant price if available, otherwise use product price
  const variantPrices = product.variants?.map(v => parseFloat(v.price)) || [];
  const lowestVariantPrice = variantPrices.length > 0 ? Math.min(...variantPrices) : parseFloat(product.price);
  const highestVariantPrice = variantPrices.length > 0 ? Math.max(...variantPrices) : parseFloat(product.price);
  
  const priceNum = parseFloat(product.price);
  const discountNum = parseFloat(product.discount || '0');

  return {
    id: String(product.id),
    name: product.product_name,
    slug: product.product_name.toLowerCase().replace(/\s+/g, '-'),
    sku: product.product_code,
    brandId: String(brand?.id ?? product.product_brand ?? 'unknown'),
    brandName: brand?.name || product.product_brand || 'Unknown',
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
    originalPrice: priceNum * (1 + discountNum / 100),
    discountPercentage: discountNum,
    status: 'active',
    isPopular: false,
    isNew: false,
    rating: 4.5,
    reviewCount: 0,
    downloads: product.product_details_pdf
      ? [{ name: 'Product Details', type: 'pdf', size: 'PDF', url: product.product_details_pdf }]
      : [],
    createdAt: product.created_at,
    warranty: product.warranty || 'Standard warranty',
    variants: product.variants,
    hasVariants: (product.variants?.length || 0) > 0,
    stock: product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0,
    // Add price range for variants
    lowestPrice: lowestVariantPrice,
    highestPrice: highestVariantPrice,
  };
};

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

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
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: categorySlug,
      search: searchQuery,
      specs: {},
      brands: [],
    }));
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
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      default:
        result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [filters, transformedProducts, categories]);

  const handleCategoryChange = (slug: string | null) => {
    if (slug) {
      setSearchParams({ category: slug });
    } else {
      setSearchParams({});
    }
  };

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

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={!filters.category ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleCategoryChange(null)}
          className="rounded-full"
        >
          All Categories
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={filters.category === createSlug(cat.category_name) ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryChange(createSlug(cat.category_name))}
            className="rounded-full"
          >
            {cat.category_name}
          </Button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Desktop filter */}
        <aside className="hidden lg:block w-72 shrink-0">
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            resultCount={filteredProducts.length}
            brands={brands}
            categories={categories}
          />
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
              <div className="relative flex-1 sm:max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  className="pl-9 h-9 rounded-full border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
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
                    brands={brands}
                    categories={categories}
                  />
                </SheetContent>
              </Sheet>
              <Select value={filters.sort} onValueChange={(v) => setFilters({ ...filters, sort: v })}>
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
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              icon={<Package className="w-8 h-8" />}
              title="No products found"
              description="Try adjusting your filters or search query to find what you're looking for."
              action={<Button variant="outline" onClick={() => setFilters({ category: filters.category, brands: [], specs: {}, search: '', sort: 'latest' })}>Clear Filters</Button>}
            />
          ) : (
            <>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{filteredProducts.length}</span> products
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
                {filteredProducts.map((product, i) => (
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}