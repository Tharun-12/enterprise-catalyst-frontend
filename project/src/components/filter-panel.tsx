// filter-panel.tsx
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
  specOptions?: Record<string, string[]>;
  variantOptions?: Record<string, string[]>;
  priceRange?: { min: number; max: number };
}

// Specification field labels and icons
const specLabels: Record<string, { label: string; icon?: string }> = {
  bandwidth: { label: 'Bandwidth', icon: '📶' },
  conductor_type: { label: 'Conductor Type', icon: '⚡' },
  cable_od: { label: 'Cable OD', icon: '📏' },
  jacket_material: { label: 'Jacket Material', icon: '🧵' },
  operating_temperature: { label: 'Operating Temperature', icon: '🌡️' },
  poe_support: { label: 'PoE Support', icon: '🔌' },
};

// Variant field labels and icons
const variantLabels: Record<string, { label: string; icon?: string }> = {
  spec_type: { label: 'Spec Type', icon: '📋' },
  color: { label: 'Color', icon: '🎨' },
  size: { label: 'Size', icon: '📐' },
  part_code: { label: 'Part Code', icon: '🔢' },
};

export function FilterPanel({ 
  filters, 
  onFilterChange, 
  resultCount, 
  brands,
  specOptions = {},
  variantOptions = {},
  priceRange = { min: 0, max: 100000 }
}: FilterPanelProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    brands: true,
    price: true,
    specifications: true,
    variants: true,
    bandwidth: false,
    conductor_type: false,
    cable_od: false,
    jacket_material: false,
    operating_temperature: false,
    poe_support: false,
    spec_type: false,
    color: false,
    size: false,
    part_code: false,
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
      category: filters.category,
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
    filters.maxPrice !== undefined;

  // Get active spec sections (those that have options)
  const activeSpecSections = Object.keys(specOptions).filter(key => specOptions[key]?.length > 0);
  const activeVariantSections = Object.keys(variantOptions).filter(key => variantOptions[key]?.length > 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-card border rounded-xl overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-muted/30 shrink-0">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Filters</h3>
          <span className="text-xs text-muted-foreground">({resultCount} results)</span>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={clearAll}>
            <X className="w-3 h-3 mr-1" /> Clear
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-1">
          {/* Price Range Section */}
          <Collapsible open={openSections['price'] ?? true} onOpenChange={() => toggleSection('price')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 group">
              <span className="font-medium text-sm">Price Range</span>
              <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', openSections['price'] ?? true ? '' : 'rotate-[-90deg]')} />
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
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Max</Label>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={localMaxPrice}
                      onChange={(e) => setLocalMaxPrice(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="h-8 flex-1 text-xs"
                    onClick={handlePriceChange}
                  >
                    Apply
                  </Button>
                  {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 text-xs"
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

          {/* Brands Section */}
          {brands.length > 0 && (
            <>
              <Collapsible open={openSections['brands'] ?? true} onOpenChange={() => toggleSection('brands')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 group">
                  <span className="font-medium text-sm">Brands</span>
                  <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', openSections['brands'] ?? true ? '' : 'rotate-[-90deg]')} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-2 pt-1 pb-3">
                    {brands.map((brand) => (
                      <div key={brand.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`brand-${brand.id}`}
                          checked={filters.brands.includes(brand.id)}
                          onCheckedChange={() => toggleBrand(brand.id)}
                        />
                        <Label htmlFor={`brand-${brand.id}`} className="text-sm font-normal cursor-pointer flex-1">
                          {brand.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <Separator />
            </>
          )}

          {/* Variants Section - Added */}
          {activeVariantSections.length > 0 && (
            <>
              <Collapsible open={openSections['variants'] ?? true} onOpenChange={() => toggleSection('variants')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 group">
                  <span className="font-medium text-sm">Variants</span>
                  <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', openSections['variants'] ?? true ? '' : 'rotate-[-90deg]')} />
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
                          <CollapsibleTrigger className="flex items-center justify-between w-full py-1 text-sm hover:bg-muted/50 px-2 rounded-md">
                            <span className="text-sm font-medium">
                              {variantInfo.icon && <span className="mr-2">{variantInfo.icon}</span>}
                              {variantInfo.label}
                              {filters.specs[key]?.length > 0 && (
                                <span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                  {filters.specs[key].length}
                                </span>
                              )}
                            </span>
                            <ChevronDown className={cn('w-3 h-3 text-muted-foreground transition-transform', isOpen ? '' : 'rotate-[-90deg]')} />
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="space-y-1.5 pt-2 pl-2">
                              {options.map((option) => (
                                <div key={option} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`variant-${key}-${option}`}
                                    checked={(filters.specs[key] || []).includes(option)}
                                    onCheckedChange={() => toggleSpec(key, option)}
                                  />
                                  <Label htmlFor={`variant-${key}-${option}`} className="text-sm font-normal cursor-pointer">
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

              <Separator />
            </>
          )}

          {/* Specifications Section - Grouped */}
          {activeSpecSections.length > 0 && (
            <>
              <Collapsible open={openSections['specifications'] ?? true} onOpenChange={() => toggleSection('specifications')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 group">
                  <span className="font-medium text-sm">Specifications</span>
                  <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', openSections['specifications'] ?? true ? '' : 'rotate-[-90deg]')} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="space-y-4 pt-1 pb-3">
                    {activeSpecSections.map((key) => {
                      const options = specOptions[key] || [];
                      const specInfo = specLabels[key] || { label: key };
                      const isOpen = openSections[key] ?? false;
                      
                      return (
                        <Collapsible 
                          key={key} 
                          open={isOpen} 
                          onOpenChange={() => toggleSection(key)}
                        >
                          <CollapsibleTrigger className="flex items-center justify-between w-full py-1 text-sm hover:bg-muted/50 px-2 rounded-md">
                            <span className="text-sm font-medium">
                              {specInfo.icon && <span className="mr-2">{specInfo.icon}</span>}
                              {specInfo.label}
                              {filters.specs[key]?.length > 0 && (
                                <span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                  {filters.specs[key].length}
                                </span>
                              )}
                            </span>
                            <ChevronDown className={cn('w-3 h-3 text-muted-foreground transition-transform', isOpen ? '' : 'rotate-[-90deg]')} />
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="space-y-1.5 pt-2 pl-2">
                              {options.map((option) => (
                                <div key={option} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`spec-${key}-${option}`}
                                    checked={(filters.specs[key] || []).includes(option)}
                                    onCheckedChange={() => toggleSpec(key, option)}
                                  />
                                  <Label htmlFor={`spec-${key}-${option}`} className="text-sm font-normal cursor-pointer">
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