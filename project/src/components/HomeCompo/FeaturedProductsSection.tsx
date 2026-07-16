import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/shared';
import { ProductCard } from '@/components/product-card';
import { products } from '@/data';

export function FeaturedProductsSection() {
  const featuredProducts = products.filter((p) => p.isPopular).slice(0, 8);

  return (
    <section className="py-16 lg:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          centered
          title="Featured Products"
          subtitle="Popular products chosen by our enterprise clients across various industries."
          action={<Button asChild variant="outline" size="sm"><Link to="/products">View All <ChevronRight className="w-4 h-4 ml-1" /></Link></Button>}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {featuredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}