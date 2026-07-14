import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/shared';
import { categories, products } from '@/data';
import * as Icons from 'lucide-react';
import { PageBreadcrumb as Breadcrumb } from '@/layouts/customer-layout-wrapper';

export function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Categories' }]} />
      <SectionHeader
        title="Product Categories"
        subtitle="Browse our comprehensive catalog of enterprise product categories, each with specialized solutions."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat, i) => {
          const Icon = (Icons as any)[cat.icon] || Icons.Package;
          const catProducts = products.filter((p) => p.categoryId === cat.id);
          const catBrands = [...new Set(catProducts.map((p) => p.brandName))];
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group h-full flex flex-col">
                <div
                  className="h-32 flex items-center justify-center relative"
                  style={{ background: `linear-gradient(135deg, ${cat.color}15, ${cat.color}05)` }}
                >
                  <Icon className="w-14 h-14" style={{ color: cat.color }} />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/80 text-foreground border-0 shadow-sm">{cat.productCount} Products</Badge>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg mb-2">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-3">{cat.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {catBrands.slice(0, 4).map((brand) => (
                      <Badge key={brand} variant="secondary" className="text-[10px] font-normal">{brand}</Badge>
                    ))}
                    {catBrands.length > 4 && (
                      <Badge variant="outline" className="text-[10px] font-normal">+{catBrands.length - 4}</Badge>
                    )}
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Link to={`/products?category=${cat.slug}`}>
                      Browse Products <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
