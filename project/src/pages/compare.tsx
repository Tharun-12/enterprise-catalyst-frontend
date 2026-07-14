import { Link } from 'react-router-dom';
import { X, GitCompare, Plus, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared';
import { useApp } from '@/hooks/use-app';
import { getProductById } from '@/data';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { PageBreadcrumb as Breadcrumb } from '@/layouts/customer-layout-wrapper';

export function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useApp();
  const compareProducts = compareList.map((id) => getProductById(id)).filter((p): p is NonNullable<typeof p> => p !== undefined);

  if (compareProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Compare' }]} />
        <EmptyState
          icon={<GitCompare className="w-8 h-8" />}
          title="No products to compare"
          description="Add products to comparison to see them side by side. You can compare up to 4 products at once."
          action={<Button asChild><Link to="/products">Browse Products <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>}
        />
      </div>
    );
  }

  // Collect all spec group names
  const allSpecGroups = compareProducts[0]?.specGroups || [];
  const allSpecKeys = new Set<string>();
  compareProducts.forEach((p) => {
    p.specGroups.forEach((g) => g.fields.forEach((field: { key: string }) => allSpecKeys.add(field.key)));
  });

  // Get all specs as flat key-value pairs
  const getSpecValue = (product: any, key: string): string => {
    for (const group of product.specGroups) {
      const field = group.fields.find((field: { key: string }) => field.key === key);
      if (field) return field.value;
    }
    return '—';
  };

  // Find best value for numeric specs
  const findBestValue = (key: string, products: any[]): string | null => {
    const values = products.map((p) => getSpecValue(p, key));
    // Try to parse as numbers
    const numeric = values.map((v) => {
      const match = v.match(/[\d.]+/);
      return match ? parseFloat(match[0]) : null;
    });
    if (numeric.every((n) => n !== null) && numeric.length > 1) {
      const max = Math.max(...numeric);
      const maxIdx = numeric.indexOf(max);
      return values[maxIdx];
    }
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Compare' }]} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Compare Products</h1>
          <p className="text-sm text-muted-foreground mt-1">Compare {compareProducts.length} products side by side</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { clearCompare(); toast.success('Comparison cleared'); }}>
          <X className="w-4 h-4 mr-1.5" /> Clear All
        </Button>
      </div>

      {compareProducts.length < 2 && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20 mb-4 text-sm">
          <AlertCircle className="w-4 h-4 text-accent shrink-0" />
          <span>Add at least 2 products to see a meaningful comparison.</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="min-w-full inline-block">
          {/* Product header row */}
          <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `200px repeat(${compareProducts.length}, minmax(250px, 1fr))` }}>
            <div className="flex items-end">
              <span className="text-sm font-semibold text-muted-foreground">Product</span>
            </div>
            {compareProducts.map((product) => (
              <Card key={product.id} className="p-4 relative group">
                <button
                  onClick={() => { removeFromCompare(product.id); toast.success('Removed from comparison'); }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-muted hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <Link to={`/products/${product.slug}`} className="block">
                  <img src={product.gallery[0]} alt={product.name} className="w-full aspect-square rounded-lg object-cover mb-3" />
                  <Badge variant="secondary" className="text-[10px] mb-1.5">{product.brandName}</Badge>
                  <h3 className="font-semibold text-sm leading-snug line-clamp-2 hover:text-primary transition-colors">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.shortDescription}</p>
                </Link>
                <Button asChild size="sm" className="w-full mt-3">
                  <Link to={`/products/${product.slug}`}>View Details</Link>
                </Button>
              </Card>
            ))}
            {compareProducts.length < 4 && (
              <Card className="p-4 flex flex-col items-center justify-center border-dashed">
                <div className="w-full aspect-square rounded-lg border-2 border-dashed flex items-center justify-center mb-3">
                  <Plus className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <p className="text-xs text-muted-foreground text-center mb-3">Add more products to compare</p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/products">Add Product</Link>
                </Button>
              </Card>
            )}
          </div>

          {/* Spec groups */}
          {allSpecGroups.map((group) => (
            <div key={group.groupName} className="mb-6">
              <div className="bg-primary text-primary-foreground px-4 py-2.5 rounded-t-lg font-semibold text-sm sticky top-16 z-10">
                {group.groupName}
              </div>
              <div className="border border-t-0 rounded-b-lg overflow-hidden">
                {group.fields.map((field, fieldIdx) => {
                  const bestValue = findBestValue(field.key, compareProducts);
                  return (
                    <div
                      key={field.key}
                      className={cn('grid gap-4', fieldIdx % 2 === 0 ? 'bg-muted/30' : 'bg-card')}
                      style={{ gridTemplateColumns: `200px repeat(${compareProducts.length}, minmax(250px, 1fr))` }}
                    >
                      <div className="p-3 text-sm font-medium text-muted-foreground border-r">
                        {field.label}
                      </div>
                      {compareProducts.map((product) => {
                        const value = getSpecValue(product, field.key);
                        const isBest = bestValue !== null && value === bestValue;
                        return (
                          <div key={product.id} className="p-3 text-sm relative">
                            <span className={cn(isBest && 'font-semibold text-green-600')}>{value}</span>
                            {isBest && (
                              <Badge className="ml-1.5 text-[9px] bg-green-100 text-green-700 border-0">BEST</Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
