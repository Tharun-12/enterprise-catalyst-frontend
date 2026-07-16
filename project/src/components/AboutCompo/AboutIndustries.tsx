// components/about/AboutIndustries.tsx
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/shared';
import { INDUSTRIES_SERVED } from '@/constants';

export function AboutIndustries() {
  return (
    <section className="mb-12 bg-muted/30 -mx-4 px-4 py-12 rounded-3xl">
      <div className="container mx-auto">
        <SectionHeader centered title="Industries We Serve" subtitle="Trusted by businesses across diverse sectors." />
        <div className="flex flex-wrap justify-center gap-3">
          {INDUSTRIES_SERVED.map((industry, i) => (
            <motion.div
              key={industry}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
            >
              <Badge
                variant="outline"
                className="px-4 py-2 text-sm bg-card border-border hover:border-primary hover:text-primary transition-colors cursor-default"
              >
                {industry}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}