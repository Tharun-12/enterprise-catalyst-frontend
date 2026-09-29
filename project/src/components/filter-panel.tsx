// filter-panel.tsx - Fixed version with only Color in variants
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, X, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { Brand, Category } from '@/types';
import { Input } from '@/components/ui/input';

export interface FilterState {
  category: string | null;
  subcategory: string | null;
  brands: string[];
  specs: Record<string, string[]>;
  search: string;
  sort: string;
  minPrice?: number;
  maxPrice?: number;
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  resultCount: number;
  brands: Brand[];
  categories: Category[];
  subcategories?: Record<string, Category[]>; // Category ID -> Subcategories mapping
  specOptions?: Record<string, string[]>;
  variantOptions?: Record<string, string[]>;
  priceRange?: { min: number; max: number };
}

// Brand gradient
const BRAND_GRADIENT = 'bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500';
const BRAND_GRADIENT_TEXT = `${BRAND_GRADIENT} bg-clip-text text-transparent`;

// Gradient fill for checked checkboxes
const CHECKBOX_CLASS =
  'border-pink-300 data-[state=checked]:border-transparent data-[state=checked]:text-white ' +
  'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-pink-500 ' +
  'data-[state=checked]:via-orange-500 data-[state=checked]:to-yellow-500';

// Section header hover
const TRIGGER_HOVER = 'hover:text-pink-500 transition-colors';

// Variant field labels - ONLY COLOR
const variantLabels: Record<string, { label: string; icon?: string }> = {
  color: { label: 'Color', icon: '🎨' },
};

export function FilterPanel({ 
  filters, 
  onFilterChange, 
  resultCount, 
  brands,
  categories = [],
  subcategories = {},
  variantOptions = {},
  priceRange = { min: 0, max: 100000 }
}: FilterPanelProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    subcategory: true,
    brands: true,
    price: true,
    variants: true,
    color: false,
  });

  const [localMinPrice, setLocalMinPrice] = useState<string>(filters.minPrice?.toString() || '');
  const [localMaxPrice, setLocalMaxPrice] = useState<string>(filters.maxPrice?.toString() || '');

  useEffect(() => {
    setLocalMinPrice(filters.minPrice?.toString() || '');
    setLocalMaxPrice(filters.maxPrice?.toString() || '');
  }, [filters.minPrice, filters.maxPrice]);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCategory = (categoryId: string) => {
    // If clicking the same category, deselect it
    if (filters.category === categoryId) {
      onFilterChange({
        ...filters,
        category: null,
        subcategory: null, // Clear subcategory when category is deselected
        brands: [], // Clear brands when category changes
      });
    } else {
      onFilterChange({
        ...filters,
        category: categoryId,
        subcategory: null, // Clear subcategory when category changes
        brands: [], // Clear brands when category changes
      });
    }
  };

  const toggleSubcategory = (subcategoryId: string) => {
    onFilterChange({
      ...filters,
      subcategory: filters.subcategory === subcategoryId ? null : subcategoryId,
      brands: [], // Clear brands when subcategory changes
    });
  };

  const toggleBrand = (brandId: string) => {
    onFilterChange({
      ...filters,
      brands: filters.brands.includes(brandId)
        ? filters.brands.filter((b) => b !== brandId)
        : [...filters.brands, brandId],
    });
  };

  const toggleSpec = (key: string, value: string) => {
    const current = filters.specs[key] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({
      ...filters,
      specs: { ...filters.specs, [key]: updated },
    });
  };

  const handlePriceChange = () => {
    const min = localMinPrice ? parseFloat(localMinPrice) : undefined;
    const max = localMaxPrice ? parseFloat(localMaxPrice) : undefined;
    onFilterChange({
      ...filters,
      minPrice: min,
      maxPrice: max,
    });
  };

  const clearPriceFilter = () => {
    setLocalMinPrice('');
    setLocalMaxPrice('');
    onFilterChange({
      ...filters,
      minPrice: undefined,
      maxPrice: undefined,
    });
  };

  const clearAll = () => {
    setLocalMinPrice('');
    setLocalMaxPrice('');
    onFilterChange({
      category: null,
      subcategory: null,
      brands: [],
      specs: {},
      search: filters.search,
      sort: filters.sort,
      minPrice: undefined,
      maxPrice: undefined,
    });
  };

  const hasActiveFilters = filters.brands.length > 0 || 
    Object.values(filters.specs).some((v) => v.length > 0) ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.category !== null ||
    filters.subcategory !== null;

  // Get active variant sections (only color)
  const activeVariantSections = Object.keys(variantOptions).filter(key => variantOptions[key]?.length > 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get subcategories for selected category
  const selectedCategorySubcategories = filters.category ? subcategories[filters.category] || [] : [];

  return (
    <div className="bg-card border rounded-xl overflow-hidden h-full flex flex-col">
      {/* Gradient accent strip */}
      <div className={cn('h-1 shrink-0', BRAND_GRADIENT)} />

      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-pink-500/10 via-orange-500/10 to-yellow-500/10 shrink-0">
        <div className="flex items-center gap-2">
          <span className={cn('w-7 h-7 rounded-full flex items-center justify-center shadow-sm', BRAND_GRADIENT)}>
            <Filter className="w-3.5 h-3.5 text-white" />
          </span>
          <h3 className={cn('font-semibold text-sm', BRAND_GRADIENT_TEXT)}>Filters</h3>
          <span className="text-xs text-muted-foreground">({resultCount} results)</span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs hover:bg-pink-500/10 hover:text-pink-600"
            onClick={clearAll}
          >
            <X className="w-3 h-3 mr-1" /> Clear
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-1">
          {/* Price Range Section */}
          <Collapsible open={openSections['price'] ?? true} onOpenChange={() => toggleSection('price')}>
            <CollapsibleTrigger className={cn('flex items-center justify-between w-full py-2 group', TRIGGER_HOVER)}>
              <span className="font-medium text-sm">Price Range</span>
              <ChevronDown className={cn('w-4 h-4 text-pink-500 transition-transform', openSections['price'] ?? true ? '' : 'rotate-[-90deg]')} />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-3 pt-1 pb-3">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Min</Label>
                    <Input
                      type="number"
                      placeholder="Min"
                      value={localMinPrice}
                      onChange={(e) => setLocalMinPrice(e.target.value)}
                      className="h-8 text-sm focus-visible:ring-pink-500"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Max</Label>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={localMaxPrice}
                      onChange={(e) => setLocalMaxPrice(e.target.value)}
                      className="h-8 text-sm focus-visible:ring-pink-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className={cn('h-8 flex-1 text-xs text-white border-0 shadow-md hover:opacity-90 hover:shadow-lg transition-all', BRAND_GRADIENT)}
                    onClick={handlePriceChange}
                  >
                    Apply
                  </Button>
                  {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 text-xs border-pink-300 text-pink-600 hover:bg-pink-500/10 hover:text-pink-600"
                      onClick={clearPriceFilter}
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  Range: {formatCurrency(priceRange.min)} - {formatCurrency(priceRange.max)}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Category Section */}
          {categories.length > 0 && (
            <>
              <Collapsible open={openSections['category'] ?? true} onOpenChange={() => toggleSection('category')}>
                <CollapsibleTrigger className={cn('flex items-center justify-between w-full py-2 group', TRIGGER_HOVER)}>
                  <span className="font-medium text-sm">Category</span>
                  <ChevronDown className={cn('w-4 h-4 text-pink-500 transition-transform', openSections['category'] ?? true ? '' : 'rotate-[-90deg]')} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-2 pt-1 pb-3">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category.id}`}
                          className={CHECKBOX_CLASS}
                          checked={filters.category === category.id}
                          onCheckedChange={() => toggleCategory(category.id)}
                        />
                        <Label
                          htmlFor={`category-${category.id}`}
                          className={cn(
                            'text-sm font-normal cursor-pointer flex-1 hover:text-pink-500 transition-colors',
                            filters.category === category.id && 'font-medium text-pink-600'
                          )}
                        >
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator />
            </>
          )}

          {/* Subcategory Section (only show if a category is selected) */}
          {filters.category && selectedCategorySubcategories.length > 0 && (
            <>
              <Collapsible open={openSections['subcategory'] ?? true} onOpenChange={() => toggleSection('subcategory')}>
                <CollapsibleTrigger className={cn('flex items-center justify-between w-full py-2 group', TRIGGER_HOVER)}>
                  <span className="font-medium text-sm">Subcategory</span>
                  <ChevronDown className={cn('w-4 h-4 text-pink-500 transition-transform', openSections['subcategory'] ?? true ? '' : 'rotate-[-90deg]')} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-2 pt-1 pb-3">
                    {selectedCategorySubcategories.map((subcategory) => (
                      <div key={subcategory.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`subcategory-${subcategory.id}`}
                          className={CHECKBOX_CLASS}
                          checked={filters.subcategory === subcategory.id}
                          onCheckedChange={() => toggleSubcategory(subcategory.id)}
                        />
                        <Label
                          htmlFor={`subcategory-${subcategory.id}`}
                          className={cn(
                            'text-sm font-normal cursor-pointer flex-1 hover:text-pink-500 transition-colors',
                            filters.subcategory === subcategory.id && 'font-medium text-pink-600'
                          )}
                        >
                          {subcategory.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator />
            </>
          )}

          {/* Brands Section - Shows only brands relevant to selected category/subcategory */}
          {brands.length > 0 && (
            <>
              <Collapsible open={openSections['brands'] ?? true} onOpenChange={() => toggleSection('brands')}>
                <CollapsibleTrigger className={cn('flex items-center justify-between w-full py-2 group', TRIGGER_HOVER)}>
                  <span className="font-medium text-sm">
                    Brands
                    {filters.category && (
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        ({brands.length} available)
                      </span>
                    )}
                  </span>
                  <ChevronDown className={cn('w-4 h-4 text-pink-500 transition-transform', openSections['brands'] ?? true ? '' : 'rotate-[-90deg]')} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-2 pt-1 pb-3">
                    {brands.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        No brands available for this category
                      </p>
                    ) : (
                      brands.map((brand) => (
                        <div key={brand.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`brand-${brand.id}`}
                            className={CHECKBOX_CLASS}
                            checked={filters.brands.includes(brand.id)}
                            onCheckedChange={() => toggleBrand(brand.id)}
                          />
                          <Label
                            htmlFor={`brand-${brand.id}`}
                            className={cn(
                              'text-sm font-normal cursor-pointer flex-1 hover:text-pink-500 transition-colors',
                              filters.brands.includes(brand.id) && 'font-medium text-pink-600'
                            )}
                          >
                            {brand.name}
                          </Label>
                        </div>
                      ))
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator />
            </>
          )}

          {/* Variants Section - ONLY COLOR */}
          {activeVariantSections.length > 0 && (
            <>
              <Collapsible open={openSections['variants'] ?? true} onOpenChange={() => toggleSection('variants')}>
                <CollapsibleTrigger className={cn('flex items-center justify-between w-full py-2 group', TRIGGER_HOVER)}>
                  <span className="font-medium text-sm">Variants</span>
                  <ChevronDown className={cn('w-4 h-4 text-pink-500 transition-transform', openSections['variants'] ?? true ? '' : 'rotate-[-90deg]')} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-4 pt-1 pb-3">
                    {activeVariantSections.map((key) => {
                      const options = variantOptions[key] || [];
                      const variantInfo = variantLabels[key] || { label: key };
                      const isOpen = openSections[key] ?? false;
                      
                      return (
                        <Collapsible 
                          key={key} 
                          open={isOpen} 
                          onOpenChange={() => toggleSection(key)}
                        >
                          <CollapsibleTrigger className="flex items-center justify-between w-full py-1 text-sm hover:bg-pink-500/10 px-2 rounded-md transition-colors">
                            <span className="text-sm font-medium">
                              {variantInfo.icon && <span className="mr-2">{variantInfo.icon}</span>}
                              {variantInfo.label}
                              {filters.specs[key]?.length > 0 && (
                                <span className={cn('ml-2 text-xs text-white px-1.5 py-0.5 rounded-full', BRAND_GRADIENT)}>
                                  {filters.specs[key].length}
                                </span>
                              )}
                            </span>
                            <ChevronDown className={cn('w-3 h-3 text-pink-500 transition-transform', isOpen ? '' : 'rotate-[-90deg]')} />
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="space-y-1.5 pt-2 pl-2">
                              {options.map((option) => (
                                <div key={option} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`variant-${key}-${option}`}
                                    className={CHECKBOX_CLASS}
                                    checked={(filters.specs[key] || []).includes(option)}
                                    onCheckedChange={() => toggleSpec(key, option)}
                                  />
                                  <Label
                                    htmlFor={`variant-${key}-${option}`}
                                    className={cn(
                                      'text-sm font-normal cursor-pointer hover:text-pink-500 transition-colors',
                                      (filters.specs[key] || []).includes(option) && 'font-medium text-pink-600'
                                    )}
                                  >
                                    {option}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}