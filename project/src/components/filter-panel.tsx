
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, X, Filter } from 'lucide-react';
import { categories, brands } from '@/data';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface FilterState {
  category: string | null;
  brands: string[];
  specs: Record<string, string[]>;
  search: string;
  sort: string;
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  resultCount: number;
}

export function FilterPanel({ filters, onFilterChange, resultCount }: FilterPanelProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const currentCategory = categories.find((c) => c.slug === filters.category);
  const categorySpecFields = currentCategory?.specFields || [];

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

  const clearAll = () => {
    onFilterChange({
      category: filters.category,
      brands: [],
      specs: {},
      search: filters.search,
      sort: filters.sort,
    });
  };

  const hasActiveFilters = filters.brands.length > 0 || Object.values(filters.specs).some((v) => v.length > 0);

  return (
    <div className="bg-card border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
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

      <ScrollArea className="h-[calc(100vh-280px)] min-h-[400px]">
        <div className="p-4 space-y-1">
          {/* Brands */}
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
                    <Label htmlFor={`brand-${brand.id}`} className="text-sm font-normal cursor-pointer flex-1 flex items-center justify-between">
                      <span>{brand.name}</span>
                      <span className="text-xs text-muted-foreground">{brand.productCount}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Dynamic spec filters */}
          {categorySpecFields.map((field) => (
            <Collapsible key={field.key} open={openSections[field.key] ?? true} onOpenChange={() => toggleSection(field.key)}>
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2">
                <span className="font-medium text-sm">{field.label}</span>
                <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', openSections[field.key] ?? true ? '' : 'rotate-[-90deg]')} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-2 pt-1 pb-3">
                  {field.options?.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`spec-${field.key}-${option}`}
                        checked={(filters.specs[field.key] || []).includes(option)}
                        onCheckedChange={() => toggleSpec(field.key, option)}
                      />
                      <Label htmlFor={`spec-${field.key}-${option}`} className="text-sm font-normal cursor-pointer">
                        {option}{field.unit ? ` ${field.unit}` : ''}
                      </Label>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
