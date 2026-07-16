// components/about/AboutValues.tsx
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { SectionHeader } from '@/components/shared';
import { COMPANY_VALUES } from '@/constants';
import { Heart } from 'lucide-react';

export function AboutValues() {
  return (
    <section className="mb-12">
      <SectionHeader centered title="Our Core Values" subtitle="The principles that guide everything we do." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {COMPANY_VALUES.map((value, i) => (
          <motion.div
            key={value.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-6 h-full hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
                <Heart className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">{value.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}