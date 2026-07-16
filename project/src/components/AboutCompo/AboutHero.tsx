// components/about/AboutHero.tsx
import { Badge } from '@/components/ui/badge';
import { COMPANY } from '@/constants';

export function AboutHero() {
  return (
    <div className="relative bg-gradient-to-br from-primary to-[#0a3a63] text-white rounded-3xl p-8 lg:p-12 mb-12 overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent/20 blur-3xl" />
      <div className="relative max-w-2xl">
        <Badge className="bg-white/15 text-white border-white/20 mb-4">About MVB</Badge>
        <h1 className="text-3xl lg:text-4xl font-bold mb-4">Empowering Businesses Since {COMPANY.established}</h1>
        <p className="text-white/80 leading-relaxed">{COMPANY.description}</p>
      </div>
    </div>
  );
}



