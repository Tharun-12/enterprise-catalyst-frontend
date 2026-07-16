// components/about/AboutMissionVision.tsx
import { Card } from '@/components/ui/card';
import { Target, Eye } from 'lucide-react';

export function AboutMissionVision() {
  return (
    <section className="mb-12">
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-8 bg-primary text-white">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
            <Target className="w-7 h-7 text-accent" />
          </div>
          <h3 className="text-xl font-bold mb-3">Our Mission</h3>
          <p className="text-white/80 leading-relaxed">
            To empower businesses with reliable, enterprise-grade technology solutions that enhance security, efficiency, and sustainability. We strive to be the bridge between global technology brands and Indian enterprises, delivering genuine products with professional service.
          </p>
        </Card>
        <Card className="p-8 bg-secondary text-white">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
            <Eye className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-3">Our Vision</h3>
          <p className="text-white/80 leading-relaxed">
            To become India's most trusted enterprise solutions marketplace, where businesses can discover, compare, and procure the best technology products with confidence. We envision a future where every business has access to world-class infrastructure solutions.
          </p>
        </Card>
      </div>
    </section>
  );
}