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
import { categories, products } from '@/data';
import { Package } from 'lucide-react';
import { PageBreadcrumb as Breadcrumb } from '@/layouts/customer-layout-wrapper';

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('search') || '';

  const currentCategory = categories.find((c) => c.slug === categorySlug);

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
    let result = products.filter((p) => p.status === 'active');

    if (filters.category) {
      const cat = categories.find((c) => c.slug === filters.category);
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

    Object.entries(filters.specs).forEach(([key, values]) => {
      if (values.length > 0) {
        result = result.filter((p) => {
          const specValue = p.specifications[key];
          return specValue && values.some((v) => specValue.includes(v) || v.includes(specValue));
        });
      }
    });

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
  }, [filters]);

  const handleCategoryChange = (slug: string | null) => {
    if (slug) {
      setSearchParams({ category: slug });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Products', path: '/products' }, ...(currentCategory ? [{ label: currentCategory.name }] : [])]} />

      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold">
          {currentCategory ? currentCategory.name : 'All Products'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {currentCategory ? currentCategory.description : 'Browse our complete catalog of enterprise products across all categories.'}
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
            variant={filters.category === cat.slug ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryChange(cat.slug)}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Desktop filter */}
        <aside className="hidden lg:block w-72 shrink-0">
          <FilterPanel filters={filters} onFilterChange={setFilters} resultCount={filteredProducts.length} />
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
                  <FilterPanel filters={filters} onFilterChange={setFilters} resultCount={filteredProducts.length} />
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
