import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/shared';
import { categories } from '@/data';
import { iconMap } from '@/lib/Map';

export function FeaturedCategoriesSection() {
  const featuredCategories = categories.filter((c) => c.featured);

  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <SectionHeader
          centered
          title="Featured Categories"
          subtitle="Explore our comprehensive range of enterprise product categories."
          action={<Button asChild variant="outline" size="sm"><Link to="/categories">View All <ChevronRight className="w-4 h-4 ml-1" /></Link></Button>}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredCategories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || ShieldCheck;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/products?category=${cat.slug}`}>
                  <Card className="p-5 hover:shadow-lg transition-all hover:-translate-y-1 h-full group text-center">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${cat.color}15` }}
                    >
                      <Icon className="w-7 h-7" style={{ color: cat.color }} />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground">{cat.productCount} products</p>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}