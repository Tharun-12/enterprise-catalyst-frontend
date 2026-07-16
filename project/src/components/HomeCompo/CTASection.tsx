import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { COMPANY } from '@/constants';

export function CTASection() {
  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="relative bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 lg:p-12 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="text-2xl lg:text-3xl font-bold mb-3">Ready to Transform Your Business?</h2>
              <p className="text-white/80">Get expert consultation from our team. We'll help you choose the right products and solutions for your specific requirements.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link to="/contact">Get a Quote <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white">
                <a href={`tel:${COMPANY.phone}`}>Call Now</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}