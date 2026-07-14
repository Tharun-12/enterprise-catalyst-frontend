import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/hooks/use-app';
import type { Product } from '@/types';
import { toast } from 'sonner';
import { CheckCircle2, User, Phone, Mail, Building, MapPin, MessageSquare } from 'lucide-react';

interface WishlistModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WishlistLeadModal({ product, open, onOpenChange }: WishlistModalProps) {
  const { addLead } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', email: '', company: '', city: '', remarks: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!form.name || !form.phone || !form.email) {
      toast.error('Please fill in name, phone, and email');
      return;
    }
    addLead({
      ...form,
      productId: product.id,
      productName: product.name,
    });
    setSubmitted(true);
    toast.success('Your details have been submitted! Our team will contact you soon.');
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', phone: '', email: '', company: '', city: '', remarks: '' });
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); else onOpenChange(v); }}>
      <DialogContent className="sm:max-w-[500px]">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Thank You!</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Your details have been submitted successfully. Our sales team will contact you within 24 hours with pricing and product information.
            </p>
            <Button onClick={handleClose}>Close</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Save to Wishlist</DialogTitle>
              <DialogDescription>
                Provide your details to save <span className="font-semibold text-foreground">{product?.name}</span> to your wishlist. Our team will contact you with pricing and information.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="wl-name" className="text-xs flex items-center gap-1"><User className="w-3 h-3" /> Name *</Label>
                  <Input id="wl-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="wl-phone" className="text-xs flex items-center gap-1"><Phone className="w-3 h-3" /> Phone *</Label>
                  <Input id="wl-phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="wl-email" className="text-xs flex items-center gap-1"><Mail className="w-3 h-3" /> Email *</Label>
                <Input id="wl-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="wl-company" className="text-xs flex items-center gap-1"><Building className="w-3 h-3" /> Company</Label>
                  <Input id="wl-company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company name" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="wl-city" className="text-xs flex items-center gap-1"><MapPin className="w-3 h-3" /> City</Label>
                  <Input id="wl-city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Your city" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="wl-remarks" className="text-xs flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Remarks</Label>
                <Textarea id="wl-remarks" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} placeholder="Any specific requirements or questions..." className="resize-none" rows={3} />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>Cancel</Button>
                <Button type="submit" className="flex-1">Submit & Save</Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
