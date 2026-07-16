// components/about/AboutTimeline.tsx
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/shared';
import { TIMELINE } from '@/constants';

export function AboutTimeline() {
  return (
    <section>
      <SectionHeader centered title="Our Journey" subtitle="Key milestones in our growth story." />
      <div className="relative max-w-3xl mx-auto">
        <div className="absolute left-4 lg:left-1/2 lg:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-border" />
        {TIMELINE.map((item, i) => (
          <motion.div
            key={item.year}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className={`relative flex gap-6 mb-8 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
          >
            <div className="hidden lg:block flex-1" />
            <div className="absolute left-4 lg:left-1/2 lg:-translate-x-1/2 w-3 h-3 rounded-full bg-primary ring-4 ring-background mt-2" />
            <div className="flex-1 lg:px-6">
              <Card className="p-5">
                <Badge className="bg-primary/10 text-primary border-0 mb-2">{item.year}</Badge>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </Card>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}