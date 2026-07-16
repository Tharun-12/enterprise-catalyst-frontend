import { Card } from '@/components/ui/card';
import { MapPin, Phone, Mail } from 'lucide-react';
import { COMPANY } from '@/constants';

export function ContactInfoSection() {
  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-5">
          <Card className="p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Visit Us</h3>
              <p className="text-sm text-muted-foreground">{COMPANY.address}</p>
            </div>
          </Card>
          <Card className="p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Call Us</h3>
              <a href={`tel:${COMPANY.phone}`} className="text-sm text-muted-foreground hover:text-primary transition-colors block">{COMPANY.phone}</a>
              <p className="text-sm text-muted-foreground">{COMPANY.workingHours}</p>
            </div>
          </Card>
          <Card className="p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Email Us</h3>
              <a href={`mailto:${COMPANY.email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">{COMPANY.email}</a>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}