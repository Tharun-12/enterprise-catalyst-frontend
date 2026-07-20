import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SectionHeader } from '@/components/shared';
import { COMPANY } from '@/constants';
import { products } from '@/data';
import { useApp } from '@/hooks/use-app';
import { toast } from 'sonner';
import { PageBreadcrumb as Breadcrumb } from '@/layouts/customer-layout-wrapper';

export function ContactPage() {
  const { addInquiry } = useApp();
  const [form, setForm] = useState({ name: '', phone: '', email: '', company: '', productId: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    const product = products.find((p) => p.id === form.productId);
    addInquiry({
      name: form.name,
      phone: form.phone,
      email: form.email,
      company: form.company,
      productId: form.productId || 'general',
      productName: product?.name || 'General Inquiry',
      message: form.message,
    });
    toast.success('Your inquiry has been submitted! We will contact you soon.');
    setForm({ name: '', phone: '', email: '', company: '', productId: '', message: '' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Contact' }]} />
      <SectionHeader
        centered
        title="Get in Touch"
        subtitle="Have a question or need a quote? Our team is ready to help you find the right solutions for your business."
      />

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card className="p-6 text-center h-full hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Phone className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">Call Us</h3>
            <a href={`tel:${COMPANY.phone}`} className="text-sm text-muted-foreground hover:text-primary transition-colors block">{COMPANY.phone}</a>
            <p className="text-xs text-muted-foreground mt-1">{COMPANY.workingHours}</p>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6 text-center h-full hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="font-semibold mb-1">WhatsApp</h3>
            <a href={`https://wa.me/${COMPANY.whatsapp.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors block">{COMPANY.whatsapp}</a>
            <p className="text-xs text-muted-foreground mt-1">Quick responses on WhatsApp</p>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-6 text-center h-full hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-7 h-7 text-accent" />
            </div>
            <h3 className="font-semibold mb-1">Email Us</h3>
            <a href={`mailto:${COMPANY.email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors block">{COMPANY.email}</a>
            <p className="text-xs text-muted-foreground mt-1">We reply within 24 hours</p>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-1">Send Us an Inquiry</h2>
          <p className="text-sm text-muted-foreground mb-5">Fill out the form below and we'll get back to you as soon as possible.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="c-name" className="text-xs">Name *</Label>
                <Input id="c-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-phone" className="text-xs">Phone *</Label>
                <Input id="c-phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-email" className="text-xs">Email *</Label>
              <Input id="c-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="c-company" className="text-xs">Company</Label>
                <Input id="c-company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-product" className="text-xs">Product Interest</Label>
                <Select value={form.productId} onValueChange={(v) => setForm({ ...form, productId: v })}>
                  <SelectTrigger id="c-product"><SelectValue placeholder="Select product" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    {products.slice(0, 20).map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-message" className="text-xs">Message *</Label>
              <Textarea id="c-message" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your requirements..." className="resize-none" rows={4} />
            </div>
            <Button type="submit" className="w-full" size="lg">
              <Send className="w-4 h-4 mr-2" /> Submit Inquiry
            </Button>
          </form>
        </Card>

        {/* Map & Office Info */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Our Office</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Address</div>
                  <p className="text-sm text-muted-foreground">{COMPANY.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Phone</div>
                  <a href={`tel:${COMPANY.phone}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">{COMPANY.phone}</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Email</div>
                  <a href={`mailto:${COMPANY.email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">{COMPANY.email}</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">Working Hours</div>
                  <p className="text-sm text-muted-foreground">{COMPANY.workingHours}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">GSTIN</div>
                  <p className="text-sm text-muted-foreground">{COMPANY.gst}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Map placeholder */}
          <Card className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center relative">
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none' stroke='%230F4C81' stroke-width='0.5'/%3E%3C/svg%3E")`
              }} />
              <div className="text-center relative">
                <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Interactive Map</p>
                <p className="text-xs text-muted-foreground">{COMPANY.address}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}




