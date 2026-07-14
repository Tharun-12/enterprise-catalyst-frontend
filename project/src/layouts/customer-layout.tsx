import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, Search, Heart, GitCompare, ChevronDown, Building2, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { NAV_LINKS, COMPANY } from '@/constants';
import { useApp } from '@/hooks/use-app';
import { categories, products } from '@/data';
import { cn } from '@/lib/utils';

export function CustomerHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { wishlist, compareList } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const searchResults = searchQuery
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground text-xs hidden md:block">
        <div className="container mx-auto px-4 flex items-center justify-between h-9">
          <div className="flex items-center gap-4">
            <a href={`tel:${COMPANY.phone}`} className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Phone className="w-3 h-3" />
              {COMPANY.phone}
            </a>
            <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Mail className="w-3 h-3" />
              {COMPANY.email}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span>{COMPANY.workingHours}</span>
            <Link to="/admin" className="flex items-center gap-1.5 hover:text-accent transition-colors font-medium">
              <Building2 className="w-3 h-3" />
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={cn(
          'sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b transition-all duration-300',
          scrolled ? 'shadow-md border-border' : 'border-transparent'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                MVB
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-foreground text-base leading-tight">MV Business Solutions</div>
                <div className="text-[10px] text-muted-foreground leading-tight">Enterprise E-Catalog Platform</div>
              </div>
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-8 relative">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products, brands, categories..."
                  className="pl-10 pr-4 bg-muted/50 border-transparent focus-visible:bg-card"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowResults(true);
                  }}
                  onFocus={() => setShowResults(true)}
                  onBlur={() => setTimeout(() => setShowResults(false), 200)}
                />
                {showResults && searchResults.length > 0 && (
                  <div className="absolute top-full mt-2 w-full bg-card border rounded-lg shadow-xl overflow-hidden z-50">
                    {searchResults.map((p) => (
                      <Link
                        key={p.id}
                        to={`/products/${p.slug}`}
                        className="flex items-center gap-3 p-3 hover:bg-muted transition-colors border-b last:border-0"
                      >
                        <img src={p.gallery[0]} alt={p.name} className="w-10 h-10 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.brandName} · {p.categoryName}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Link to="/compare">
                <Button variant="ghost" size="sm" className="relative">
                  <GitCompare className="w-5 h-5" />
                  {compareList.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-[10px] bg-accent text-accent-foreground">
                      {compareList.length}
                    </Badge>
                  )}
                  <span className="hidden xl:inline ml-1.5">Compare</span>
                </Button>
              </Link>
              <Link to="/wishlist">
                <Button variant="ghost" size="sm" className="relative">
                  <Heart className="w-5 h-5" />
                  {wishlist.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-[10px] bg-accent text-accent-foreground">
                      {wishlist.length}
                    </Badge>
                  )}
                  <span className="hidden xl:inline ml-1.5">Wishlist</span>
                </Button>
              </Link>

              {/* Mobile menu */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <div className="flex items-center gap-2.5 mb-6 pt-2">
                    <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                      MVB
                    </div>
                    <div>
                      <div className="font-bold text-sm">MV Business Solutions</div>
                      <div className="text-[10px] text-muted-foreground">Enterprise E-Catalog</div>
                    </div>
                  </div>
                  <form onSubmit={handleSearch} className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="Search..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                  </form>
                  <nav className="flex flex-col gap-1">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMobileOpen(false)}
                        className="px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2 text-primary"
                    >
                      <Building2 className="w-4 h-4" />
                      Admin Portal
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center justify-center gap-1 h-12 border-t">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-muted/50 rounded-md transition-all"
              >
                {link.label}
              </Link>
            ))}
            <div className="group relative">
              <button className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-muted/50 rounded-md transition-all flex items-center gap-1">
                All Categories <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="absolute top-full left-0 mt-0 w-64 bg-card border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/products?category=${cat.slug}`}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors text-sm"
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    <div className="flex-1">
                      <div className="font-medium">{cat.name}</div>
                      <div className="text-xs text-muted-foreground">{cat.productCount} products</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}

export function CustomerFooter() {
  return (
    <footer className="bg-foreground text-background mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
                MVB
              </div>
              <div>
                <div className="font-bold">MV Business Solutions</div>
                <div className="text-xs opacity-60">Enterprise E-Catalog</div>
              </div>
            </div>
            <p className="text-sm opacity-70 leading-relaxed mb-4">
              {COMPANY.description}
            </p>
            <div className="flex gap-3">
              {['linkedin', 'twitter', 'facebook', 'youtube'].map((s) => (
                <a
                  key={s}
                  href={COMPANY.social[s as keyof typeof COMPANY.social]}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-primary flex items-center justify-center transition-colors"
                  aria-label={s}
                >
                  <span className="text-xs font-bold uppercase">{s[0]}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-90">Quick Links</h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm opacity-70 hover:opacity-100 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-90">Categories</h3>
            <ul className="space-y-2.5">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/products?category=${cat.slug}`} className="text-sm opacity-70 hover:opacity-100 hover:text-accent transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-90">Contact Us</h3>
            <ul className="space-y-3 text-sm opacity-70">
              <li className="flex items-start gap-2">
                <span className="shrink-0 mt-0.5">📍</span>
                <span>{COMPANY.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <a href={`tel:${COMPANY.phone}`} className="hover:opacity-100 hover:text-accent transition-colors">{COMPANY.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>
                <a href={`mailto:${COMPANY.email}`} className="hover:opacity-100 hover:text-accent transition-colors">{COMPANY.email}</a>
              </li>
              <li className="flex items-center gap-2">
                <span>🕐</span>
                <span>{COMPANY.workingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs opacity-60">
            © {new Date().getFullYear()} {COMPANY.name}. All rights reserved. | GSTIN: {COMPANY.gst}
          </p>
          <div className="flex gap-4 text-xs opacity-60">
            <Link to="/about" className="hover:opacity-100">Privacy Policy</Link>
            <Link to="/about" className="hover:opacity-100">Terms of Service</Link>
            <Link to="/admin" className="hover:opacity-100">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${COMPANY.whatsapp.replace(/\s/g, '')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
      aria-label="WhatsApp Chat"
    >
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    </a>
  );
}
