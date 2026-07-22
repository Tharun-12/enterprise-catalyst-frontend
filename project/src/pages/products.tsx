import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { ProductCard } from '@/components/product-card';
import { FilterPanel, type FilterState } from '@/components/filter-panel';
import { EmptyState, ProductGridSkeleton } from '@/components/shared';
import { Package } from 'lucide-react';
import { PageBreadcrumb as Breadcrumb } from '@/layouts/customer-layout-wrapper';

// API response types
interface Category {
  id: number;
  category_name: string;
  created_at: string;
  updated_at: string;
}

interface Brand {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface Product {
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
  variants?: Variant[];
}

interface Variant {
  id: number;
  product_id: number;
  color_name: string;
  color_hex: string;
  price: string;
  stock: number;
  image_url: string;
}

// Transform API product to match ProductCard expected format
const transformProduct = (product: Product, categories: Category[], brands: Brand[]) => {
  const category = categories.find(c => c.id === product.product_category_id);
  const brand = brands.find(b => b.name === product.product_brand);
  const primaryVariant = product.variants?.[0];
  
  // Get all images from variants
  const galleryImages = product.variants?.map(v => 
    v.image_url ? `http://localhost:5000${v.image_url}` : null
  ).filter(Boolean) as string[] || [];
  
  const defaultImage = 'https://via.placeholder.com/400x400';
  const gallery = galleryImages.length > 0 ? galleryImages : [defaultImage];

  return {
    id: String(product.id),
    name: product.product_name,
    slug: product.product_name.toLowerCase().replace(/\s+/g, '-'),
    price: parseFloat(product.price),
    originalPrice: parseFloat(product.price) * (1 + parseFloat(product.discount || '0') / 100),
    discount: parseFloat(product.discount || '0'),
    rating: 4.5,
    reviewCount: 0,
    isPopular: false,
    isNew: false,
    brandId: String(brand?.id || product.product_brand || 'Unknown'),
    brandName: brand?.name || product.product_brand || 'Unknown',
    categoryId: product.product_category_id,
    categoryName: category?.category_name || product.category_name || 'Uncategorized',
    shortDescription: product.product_description?.substring(0, 150) || '',
    description: product.product_description || '',
    gallery: gallery,
    sku: product.product_code,
    specs: {
      dimensions: product.dimensions || 'N/A',
      weight: product.weight || 'N/A',
      specifications: product.specifications || 'N/A'
    },
    features: product.specifications?.split(',').map(s => s.trim()).filter(Boolean) || [],
    downloads: product.product_details_pdf ? [
      { name: 'Product Details', size: 'PDF', url: product.product_details_pdf }
    ] : [],
    status: 'active' as const,
    createdAt: product.created_at,
    warranty: product.warranty || 'Standard warranty',
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
    // Additional fields that might be expected by ProductCard
    productCode: product.product_code,
    brand: brand?.name || product.product_brand || 'Unknown',
    category: category?.category_name || product.category_name || 'Uncategorized',
    image: gallery[0] || defaultImage,
    images: gallery,
    variants: product.variants || [],
    stock: product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0,
    hasVariants: (product.variants?.length || 0) > 0,
    discountPercentage: parseFloat(product.discount || '0'),
    regularPrice: parseFloat(product.price),
    salePrice: parseFloat(product.price) * (1 - parseFloat(product.discount || '0') / 100),
  };
};

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('search') || '';

  // Helper function to create slug
  const createSlug = (name: string): string => {
    if (!name) return '';
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  // Fetch categories, brands, and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch categories
        const categoriesRes = await fetch('http://localhost:5000/api/categories/');
        const categoriesData = await categoriesRes.json();
        
        if (!categoriesData.success) {
          throw new Error('Failed to fetch categories');
        }
        setCategories(categoriesData.data);

        // Fetch brands
        const brandsRes = await fetch('http://localhost:5000/api/brands/');
        const brandsData = await brandsRes.json();
        
        if (!brandsData.success) {
          throw new Error('Failed to fetch brands');
        }
        setBrands(brandsData.data);

        // Fetch products with variants
        const productsRes = await fetch('http://localhost:5000/api/products/products-with-variants');
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

  // Transform products for display
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
      if (cat) result = result.filter((p) => p.categoryId === cat.id);
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
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[
        { label: 'Home', path: '/' }, 
        { label: 'Products', path: '/products' }, 
        ...(currentCategory ? [{ label: currentCategory.category_name }] : [])
      ]} />

      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold">
          {currentCategory ? currentCategory.category_name : 'All Products'}
        </h1>
        <p className="text-sm text-muted-foreground">
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
        >
          All Categories
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={filters.category === createSlug(cat.category_name) ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryChange(createSlug(cat.category_name))}
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
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-9 h-9"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sheet open={showMobileFilter} onOpenChange={setShowMobileFilter}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <SlidersHorizontal className="w-4 h-4 mr-1.5" /> Filters
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
                <SelectTrigger className="w-[140px] h-9">
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
              <p className="text-sm text-muted-foreground mb-4">Showing {filteredProducts.length} products</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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