import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Trash2, User, Phone, Mail, Building, MapPin, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '@/components/shared';
import { useApp } from '@/hooks/use-app';
import { getProductById } from '@/data';
import { toast } from 'sonner';
import { useState } from 'react';
import { PageBreadcrumb as Breadcrumb } from '@/layouts/customer-layout-wrapper';

export function WishlistPage() {
  const { wishlist, removeFromWishlist, addLead } = useApp();
  const wishlistProducts = wishlist.map((id) => getProductById(id)).filter((p): p is NonNullable<typeof p> => p !== undefined);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', company: '', city: '', remarks: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email) {
      toast.error('Please fill in name, phone, and email');
      return;
    }
    wishlistProducts.forEach((p) => {
      addLead({ ...form, productId: p.id, productName: p.name });
    });
    setSubmitted(true);
    toast.success(`Thank you! Your wishlist of ${wishlistProducts.length} products has been submitted. Our team will contact you soon.`);
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Wishlist' }]} />
        <EmptyState
          icon={<Heart className="w-8 h-8" />}
          title="Your wishlist is empty"
          description="Save products to your wishlist and submit your details to get personalized quotes from our sales team."
          action={<Button asChild><Link to="/products">Browse Products <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Wishlist' }]} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">My Wishlist</h1>
          <p className="text-sm text-muted-foreground mt-1">{wishlistProducts.length} products saved</p>
        </div>
        {!showForm && !submitted && (
          <Button onClick={() => setShowForm(true)}>
            Submit Lead Details
          </Button>
        )}
      </div>

      {submitted ? (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-green-600 fill-green-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">Thank You!</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Your wishlist has been submitted. Our sales team will contact you within 24 hours with pricing and product information.
          </p>
          <Button asChild variant="outline">
            <Link to="/products">Continue Browsing</Link>
          </Button>
        </Card>
      ) : showForm ? (
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Lead Generation Form</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Provide your details and we'll contact you with pricing for all {wishlistProducts.length} wishlisted products.</p>
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
              <Textarea id="wl-remarks" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} placeholder="Any specific requirements..." className="resize-none" rows={3} />
            </div>
            <Button type="submit" className="w-full">Submit Wishlist Lead</Button>
          </form>
        </Card>
      ) : null}

      {/* Wishlist items */}
      <div className="space-y-3">
        {wishlistProducts.map((product) => (
          <Card key={product.id} className="p-4 flex gap-4 items-center hover:shadow-md transition-all">
            <Link to={`/products/${product.slug}`} className="shrink-0">
              <img src={product.gallery[0]} alt={product.name} className="w-20 h-20 rounded-lg object-cover" />
            </Link>
            <div className="flex-1 min-w-0">
              <Badge variant="secondary" className="text-[10px] mb-1">{product.brandName}</Badge>
              <Link to={`/products/${product.slug}`}>
                <h3 className="font-semibold text-sm hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
              </Link>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{product.shortDescription}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge variant="outline" className="text-[10px]">{product.categoryName}</Badge>
                <span className="text-xs text-muted-foreground">★ {product.rating.toFixed(1)}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Button asChild size="sm" variant="outline">
                <Link to={`/products/${product.slug}`}>View</Link>
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => { removeFromWishlist(product.id); toast.success('Removed from wishlist'); }}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
