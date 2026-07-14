import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, GitCompare, Download, FileText, Check, Star, ChevronRight,
  ZoomIn, Share2, MessageSquare, ShieldCheck, Package, ArrowLeft,
  BadgeCheck, Truck, Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ProductCard } from '@/components/product-card';
import { EmptyState } from '@/components/shared';
import { WishlistLeadModal } from '@/components/wishlist-modal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/hooks/use-app';
import { getProductBySlug, getRelatedProducts, getBrandById } from '@/data';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { PageBreadcrumb as Breadcrumb } from '@/layouts/customer-layout-wrapper';

export function ProductDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  void navigate;
  const product = slug ? getProductBySlug(slug) : undefined;
  const [activeImage, setActiveImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist, addToCompare, removeFromCompare, isInCompare, addInquiry } = useApp();

  const relatedProducts = useMemo(() => (product ? getRelatedProducts(product) : []), [product]);
  const brand = product ? getBrandById(product.brandId) : undefined;

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          icon={<Package className="w-8 h-8" />}
          title="Product not found"
          description="The product you're looking for doesn't exist or has been removed."
          action={<Button asChild><Link to="/products">Browse Products</Link></Button>}
        />
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product.id);
      setWishlistOpen(true);
    }
  };

  const handleCompare = () => {
    if (inCompare) {
      removeFromCompare(product.id);
      toast.success('Removed from comparison');
    } else {
      addToCompare(product.id);
      toast.success('Added to comparison');
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    addInquiry({
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      company: formData.get('company') as string,
      productId: product.id,
      productName: product.name,
      message: formData.get('message') as string,
    });
    toast.success('Inquiry submitted! Our team will contact you soon.');
    setInquiryOpen(false);
    form.reset();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[
        { label: 'Home', path: '/' },
        { label: 'Products', path: '/products' },
        { label: product.categoryName, path: `/products?category=${product.categoryName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')}` },
        { label: product.name }
      ]} />

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Gallery */}
        <div>
          <div
            className="relative aspect-square rounded-2xl overflow-hidden bg-muted/30 border cursor-zoom-in group"
            onMouseEnter={() => setZoomed(true)}
            onMouseLeave={() => setZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={product.gallery[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300"
              style={zoomed ? { transform: `scale(2)`, transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
            />
            {!zoomed && (
              <div className="absolute top-4 right-4 bg-black/60 text-white rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-3.5 h-3.5" /> Hover to zoom
              </div>
            )}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {product.isPopular && <Badge className="bg-accent text-accent-foreground shadow-sm">POPULAR</Badge>}
              {product.isNew && <Badge className="bg-secondary text-secondary-foreground shadow-sm">NEW</Badge>}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            {product.gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={cn(
                  'aspect-square rounded-xl overflow-hidden border-2 transition-all',
                  activeImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
                )}
              >
                <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BadgeCheck className="w-4 h-4 text-primary" />
            <Link to={`/products?category=${product.categoryName.toLowerCase()}`} className="text-sm font-medium text-primary hover:underline">
              {product.brandName}
            </Link>
            <span className="text-muted-foreground/50">·</span>
            <span className="text-sm text-muted-foreground">{product.categoryName}</span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold mb-3">{product.name}</h1>

          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={cn('w-4 h-4', s <= Math.floor(product.rating) ? 'text-accent fill-accent' : 'text-muted-foreground/30')} />
              ))}
              <span className="text-sm font-medium ml-1">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-muted-foreground">{product.reviewCount} reviews</span>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-6">{product.shortDescription}</p>

          {/* Key specs preview */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {product.specGroups[1]?.fields.slice(0, 4).map((field) => (
              <div key={field.key} className="bg-muted/40 rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-0.5">{field.label}</div>
                <div className="text-sm font-semibold">{field.value}</div>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-4 mb-6 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-green-600" /> {product.warranty} warranty
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Truck className="w-4 h-4 text-primary" /> Pan-India delivery
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Wrench className="w-4 h-4 text-secondary" /> Professional installation
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mb-4">
            <Button size="lg" className="flex-1 min-w-[160px]" onClick={() => setInquiryOpen(true)}>
              <MessageSquare className="w-4 h-4 mr-2" /> Send Inquiry
            </Button>
            <Button
              size="lg"
              variant={inWishlist ? 'default' : 'outline'}
              className={cn(inWishlist && 'bg-accent hover:bg-accent/90 text-accent-foreground')}
              onClick={handleWishlist}
            >
              <Heart className={cn('w-4 h-4 mr-2', inWishlist && 'fill-current')} />
              {inWishlist ? 'Wishlisted' : 'Wishlist'}
            </Button>
            <Button
              size="lg"
              variant={inCompare ? 'default' : 'outline'}
              onClick={handleCompare}
            >
              <GitCompare className="w-4 h-4 mr-2" />
              {inCompare ? 'Comparing' : 'Compare'}
            </Button>
          </div>

          <div className="flex gap-3">
            <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success('Link copied to clipboard'); }}>
              <Share2 className="w-4 h-4 mr-1.5" /> Share
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/products">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Products
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Specifications, Features, Downloads */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="w-full justify-start flex-wrap h-auto p-1 gap-1">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Product Description</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{product.description}</p>
            <p className="text-muted-foreground leading-relaxed">
              This product is part of the {product.categoryName} category and is manufactured by {product.brandName}, a {brand?.country}-based company known for {brand?.description.toLowerCase()}. The {product.name} is designed to meet enterprise-grade requirements with robust construction, advanced technology, and comprehensive support.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Technical Specifications</h2>
            <div className="space-y-8">
              {product.specGroups.map((group) => (
                <div key={group.groupName}>
                  <h3 className="font-semibold text-primary mb-3 pb-2 border-b">{group.groupName}</h3>
                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-0">
                    {group.fields.map((field, idx) => (
                      <div key={field.key} className={cn('flex justify-between py-2.5 border-b border-dashed', idx % 2 === 1 && 'sm:border-l sm:pl-8 sm:border-b-0 sm:border-dashed')}>
                        <span className="text-sm text-muted-foreground">{field.label}</span>
                        <span className="text-sm font-medium text-right">{field.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Key Features</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {product.features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="downloads" className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Downloads & Resources</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {product.downloads.map((dl, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border hover:shadow-md transition-all hover:border-primary/30 group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <FileText className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{dl.name}</div>
                    <div className="text-xs text-muted-foreground">PDF · {dl.size}</div>
                  </div>
                  <Button size="icon" variant="outline" onClick={() => toast.info('Download started (demo)')}>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-xl bg-accent/10 border border-accent/20 flex items-center gap-3">
              <Download className="w-5 h-5 text-accent shrink-0" />
              <div className="flex-1">
                <div className="font-semibold text-sm">Download Complete Brochure</div>
                <div className="text-xs text-muted-foreground">Get all product documents in one package</div>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast.info('Brochure download started (demo)')}>
                Download All
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Brand Info */}
      {brand && (
        <Card className="p-6 mb-12 bg-muted/30">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-card flex items-center justify-center shrink-0 shadow-sm">
              <span className="font-bold text-xl text-primary">{brand.logoText}</span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-bold text-lg mb-1">About {brand.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{brand.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground justify-center sm:justify-start">
                <span>Country: {brand.country}</span>
                <span>·</span>
                <span>Website: {brand.website}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold">Related Products</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to={`/products?category=${product.categoryName.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')}`}>
                View More <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}

      <WishlistLeadModal product={product} open={wishlistOpen} onOpenChange={setWishlistOpen} />

      {/* Inquiry Modal */}
      <Dialog open={inquiryOpen} onOpenChange={setInquiryOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Inquiry</DialogTitle>
            <DialogDescription>Send us your inquiry about <span className="font-semibold text-foreground">{product.name}</span></DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInquiry} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="iq-name" className="text-xs">Name *</Label>
                <Input id="iq-name" name="name" required placeholder="Your name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="iq-phone" className="text-xs">Phone *</Label>
                <Input id="iq-phone" name="phone" required placeholder="+91 98765 43210" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="iq-email" className="text-xs">Email *</Label>
              <Input id="iq-email" name="email" type="email" required placeholder="you@company.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="iq-company" className="text-xs">Company</Label>
              <Input id="iq-company" name="company" placeholder="Company name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="iq-message" className="text-xs">Message *</Label>
              <Textarea id="iq-message" name="message" required placeholder="Tell us about your requirements..." className="resize-none" rows={4} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setInquiryOpen(false)}>Cancel</Button>
              <Button type="submit" className="flex-1">Submit Inquiry</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
