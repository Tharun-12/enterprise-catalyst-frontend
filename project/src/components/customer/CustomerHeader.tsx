// import { Link, useNavigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import { Menu, Search, Heart, GitCompare, ChevronDown, Building2, Phone, Mail, User, LogOut } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
//   DropdownMenuLabel,
// } from '@/components/ui/dropdown-menu';
// import { NAV_LINKS, COMPANY } from '@/constants';
// import { useApp } from '@/hooks/use-app';
// import { categories, products } from '@/data';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';
// import { useSettings } from '@/hooks/use-settings';

// interface UserSession {
//   userId: number;
//   name: string;
//   email: string;
//   mobile: string;
//   loggedIn: boolean;
//   loginTime: string;
// }

// export function CustomerHeader() {
//   const [scrolled, setScrolled] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showResults, setShowResults] = useState(false);
//   const [user, setUser] = useState<UserSession | null>(null);
//   const { wishlist, compareList } = useApp();
//   const navigate = useNavigate();
//   const { settings } = useSettings();

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 20);
//     window.addEventListener('scroll', onScroll);
//     return () => window.removeEventListener('scroll', onScroll);
//   }, []);

//   const loadUserSession = () => {
//     const session = localStorage.getItem('userSession');
//     if (session) {
//       try {
//         setUser(JSON.parse(session));
//       } catch {
//         setUser(null);
//       }
//     } else {
//       setUser(null);
//     }
//   };

//   useEffect(() => {
//     loadUserSession();
//     window.addEventListener('authChange', loadUserSession);
//     window.addEventListener('storage', loadUserSession);
//     return () => {
//       window.removeEventListener('authChange', loadUserSession);
//       window.removeEventListener('storage', loadUserSession);
//     };
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('userSession');
//     localStorage.removeItem('rememberMe');
//     setUser(null);
//     window.dispatchEvent(new Event('authChange'));
//     toast.success('Logged out successfully');
//     navigate('/');
//   };

//   const searchResults = searchQuery
//     ? products
//         .filter(
//           (p) =>
//             p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             p.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
//         )
//         .slice(0, 5)
//     : [];

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
//       setShowResults(false);
//       setSearchQuery('');
//     }
//   };

//   return (
//     <>
//       {/* Top bar */}
//       <div className="bg-primary text-primary-foreground text-xs hidden md:block">
//         <div className="container mx-auto px-4 flex items-center justify-between h-9">
//           <div className="flex items-center gap-4">
//             <a href={`tel:${settings?.phone || COMPANY.phone}`} className="flex items-center gap-1.5 hover:text-accent transition-colors">
//               <Phone className="w-3 h-3" />
//               {settings?.phone || COMPANY.phone}
//             </a>
//             <a href={`mailto:${settings?.email || COMPANY.email}`} className="flex items-center gap-1.5 hover:text-accent transition-colors">
//               <Mail className="w-3 h-3" />
//               {settings?.email || COMPANY.email}
//             </a>
//           </div>
//           <div className="flex items-center gap-4">
//             <span>{settings?.working_hours || COMPANY.workingHours}</span>
//             <Link to="/admin" className="flex items-center gap-1.5 hover:text-accent transition-colors font-medium">
//               <Building2 className="w-3 h-3" />
//               Admin Portal
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* Main header */}
//       <header
//         className={cn(
//           'sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b transition-all duration-300',
//           scrolled ? 'shadow-md border-border' : 'border-transparent'
//         )}
//       >
//         <div className="container mx-auto px-4">
//           <div className="flex items-center justify-between h-16 lg:h-18">
//             <Link to="/" className="flex items-center gap-2.5 shrink-0">
//               {settings?.logo_url ? (
//                 <img 
//                   src={`http://localhost:5000${settings.logo_url}`} 
//                   alt={settings.short_name || 'Logo'}
//                   className="w-10 h-10 object-contain"
//                 />
//               ) : (
//                 <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
//                   {settings?.short_name?.charAt(0) || 'MVB'}
//                 </div>
//               )}
//               <div className="hidden sm:block">
//                 <div className="font-bold text-foreground text-base leading-tight">
//                   {settings?.name || 'MV Business Solutions'}
//                 </div>
//               </div>
//             </Link>

//             <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-8 relative">
//               <div className="relative w-full">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search products, brands, categories..."
//                   className="pl-10 pr-4 bg-muted/50 border-transparent focus-visible:bg-card"
//                   value={searchQuery}
//                   onChange={(e) => {
//                     setSearchQuery(e.target.value);
//                     setShowResults(true);
//                   }}
//                   onFocus={() => setShowResults(true)}
//                   onBlur={() => setTimeout(() => setShowResults(false), 200)}
//                 />
//                 {showResults && searchResults.length > 0 && (
//                   <div className="absolute top-full mt-2 w-full bg-card border rounded-lg shadow-xl overflow-hidden z-50">
//                     {searchResults.map((p) => (
//                       <Link
//                         key={p.id}
//                         to={`/products/${p.slug}`}
//                         className="flex items-center gap-3 p-3 hover:bg-muted transition-colors border-b last:border-0"
//                       >
//                         <img src={p.gallery[0]} alt={p.name} className="w-10 h-10 rounded object-cover" />
//                         <div className="flex-1 min-w-0">
//                           <div className="text-sm font-medium truncate">{p.name}</div>
//                           <div className="text-xs text-muted-foreground">{p.brandName} · {p.categoryName}</div>
//                         </div>
//                       </Link>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </form>

//             <div className="flex items-center gap-1 sm:gap-2">
//               <Link to="/compare">
//                 <Button variant="ghost" size="sm" className="relative">
//                   <GitCompare className="w-5 h-5" />
//                   {compareList.length > 0 && (
//                     <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-[10px] bg-accent text-accent-foreground">
//                       {compareList.length}
//                     </Badge>
//                   )}
//                   <span className="hidden xl:inline ml-1.5">Compare</span>
//                 </Button>
//               </Link>
//               <Link to="/wishlist">
//                 <Button variant="ghost" size="sm" className="relative">
//                   <Heart className="w-5 h-5" />
//                   {wishlist.length > 0 && (
//                     <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-[10px] bg-accent text-accent-foreground">
//                       {wishlist.length}
//                     </Badge>
//                   )}
//                   <span className="hidden xl:inline ml-1.5">Wishlist</span>
//                 </Button>
//               </Link>

//               {user ? (
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="hidden md:flex items-center gap-1.5 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
//                     >
//                       <User className="w-4 h-4" />
//                       <span className="max-w-[100px] truncate">{user.name}</span>
//                       <ChevronDown className="w-3.5 h-3.5" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end" className="w-56">
//                     <DropdownMenuLabel>
//                       <div className="flex flex-col">
//                         <span className="font-semibold truncate">{user.name}</span>
//                         <span className="text-xs text-muted-foreground truncate">{user.email}</span>
//                       </div>
//                     </DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem onClick={() => navigate('/profile')}>
//                       <User className="w-4 h-4 mr-2" />
//                       My Profile
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
//                       <LogOut className="w-4 h-4 mr-2" />
//                       Logout
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               ) : (
//                 <Link to="/register">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="hidden md:flex items-center gap-1.5 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
//                   >
//                     <User className="w-4 h-4" />
//                     <span>Register / Login</span>
//                   </Button>
//                 </Link>
//               )}

//               <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
//                 <SheetTrigger asChild>
//                   <Button variant="ghost" size="icon" className="lg:hidden">
//                     <Menu className="w-5 h-5" />
//                   </Button>
//                 </SheetTrigger>
//                 <SheetContent side="right" className="w-[300px] sm:w-[350px]">
//                   <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
//                   <div className="flex items-center gap-2.5 mb-6 pt-2">
//                     {settings?.logo_url ? (
//                       <img 
//                         src={`http://localhost:5000${settings.logo_url}`} 
//                         alt={settings.short_name || 'Logo'}
//                         className="w-10 h-10 object-contain"
//                       />
//                     ) : (
//                       <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
//                         {settings?.short_name?.charAt(0) || 'MVB'}
//                       </div>
//                     )}
//                     <div>
//                       <div className="font-bold text-sm">
//                         {settings?.short_name || 'MV Business Solutions'}
//                       </div>
//                       <div className="text-[10px] text-muted-foreground">
//                         Enterprise E-Catalog
//                       </div>
//                     </div>
//                   </div>

//                   {user ? (
//                     <div className="mb-2">
//                       <button
//                         onClick={() => { setMobileOpen(false); navigate('/profile'); }}
//                         className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-primary/10 mb-1 hover:bg-primary/20 transition-colors"
//                       >
//                         <User className="w-4 h-4 text-primary shrink-0" />
//                         <div className="flex-1 min-w-0 text-left">
//                           <div className="text-sm font-semibold text-primary truncate">{user.name}</div>
//                           <div className="text-xs text-muted-foreground truncate">{user.email}</div>
//                         </div>
//                       </button>
//                       <button
//                         onClick={() => { setMobileOpen(false); handleLogout(); }}
//                         className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
//                       >
//                         <LogOut className="w-4 h-4" />
//                         Logout
//                       </button>
//                     </div>
//                   ) : (
//                     <Link
//                       to="/register"
//                       onClick={() => setMobileOpen(false)}
//                       className="flex items-center gap-2 px-4 py-3 mb-2 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
//                     >
//                       <User className="w-4 h-4" />
//                       Register / Login
//                     </Link>
//                   )}

//                   <form onSubmit={handleSearch} className="mb-4">
//                     <div className="relative">
//                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                       <Input placeholder="Search..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
//                     </div>
//                   </form>
//                   <nav className="flex flex-col gap-1">
//                     {NAV_LINKS.map((link) => (
//                       <Link
//                         key={link.path}
//                         to={link.path}
//                         onClick={() => setMobileOpen(false)}
//                         className="px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
//                       >
//                         {link.label}
//                       </Link>
//                     ))}
//                     <Link
//                       to="/admin"
//                       onClick={() => setMobileOpen(false)}
//                       className="px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2 text-primary"
//                     >
//                       <Building2 className="w-4 h-4" />
//                       Admin Portal
//                     </Link>
//                   </nav>
//                 </SheetContent>
//               </Sheet>
//             </div>
//           </div>

//           <nav className="hidden lg:flex items-center justify-center gap-1 h-12 border-t">
//             {NAV_LINKS.map((link) => (
//               <Link
//                 key={link.path}
//                 to={link.path}
//                 className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-muted/50 rounded-md transition-all"
//               >
//                 {link.label}
//               </Link>
//             ))}
//             <div className="group relative">
//               <button className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-muted/50 rounded-md transition-all flex items-center gap-1">
//                 All Categories <ChevronDown className="w-3.5 h-3.5" />
//               </button>
//               <div className="absolute top-full left-0 mt-0 w-64 bg-card border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-2">
//                 {categories.map((cat) => (
//                   <Link
//                     key={cat.id}
//                     to={`/products?category=${cat.slug}`}
//                     className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors text-sm"
//                   >
//                     <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
//                     <div className="flex-1">
//                       <div className="font-medium">{cat.name}</div>
//                       <div className="text-xs text-muted-foreground">{cat.productCount} products</div>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           </nav>
//         </div>
//       </header>
//     </>
//   );
// }

import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, Search, Heart, GitCompare, ChevronDown, Building2, Phone, Mail, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { NAV_LINKS, COMPANY } from '@/constants';
import { useApp } from '@/hooks/use-app';
import { products } from '@/data';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useSettings } from '@/hooks/use-settings';

import logo from '@/asstes/mvblogo.png';

interface UserSession {
  userId: number;
  name: string;
  email: string;
  mobile: string;
  loggedIn: boolean;
  loginTime: string;
}

interface Category {
  id: number;
  category_name: string;
  created_at: string;
  updated_at: string;
}

export function CustomerHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const { wishlist, compareList } = useApp();
  const navigate = useNavigate();
  const { settings } = useSettings();

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories/');
        const result = await response.json();
        
        if (result.success) {
          setCategories(result.data);
        } else {
          console.error('Failed to fetch categories:', result.message);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const loadUserSession = () => {
    const session = localStorage.getItem('userSession');
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUserSession();
    window.addEventListener('authChange', loadUserSession);
    window.addEventListener('storage', loadUserSession);
    return () => {
      window.removeEventListener('authChange', loadUserSession);
      window.removeEventListener('storage', loadUserSession);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    localStorage.removeItem('rememberMe');
    setUser(null);
    window.dispatchEvent(new Event('authChange'));
    toast.success('Logged out successfully');
    navigate('/');
  };

  // Get product count for a category (you may want to fetch this from API)
  const getProductCount = (categoryName: string) => {
    return products.filter(p => p.categoryName === categoryName).length;
  };

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
      {/* Top bar with gradient */}
      <div className="bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 text-white text-xs hidden md:block">
        <div className="container mx-auto px-4 flex items-center justify-between h-9">
          <div className="flex items-center gap-4">
            <a href={`tel:${settings?.phone || COMPANY.phone}`} className="flex items-center gap-1.5 hover:text-yellow-200 transition-colors">
              <Phone className="w-3 h-3" />
              {settings?.phone || COMPANY.phone}
            </a>
            <a href={`mailto:${settings?.email || COMPANY.email}`} className="flex items-center gap-1.5 hover:text-yellow-200 transition-colors">
              <Mail className="w-3 h-3" />
              {settings?.email || COMPANY.email}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span>{settings?.working_hours || COMPANY.workingHours}</span>
            <Link to="/admin" className="flex items-center gap-1.5 hover:text-yellow-200 transition-colors font-medium">
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
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              {settings?.logo_url ? (
                <img 
                  src={`http://localhost:5000${settings.logo_url}`} 
                  alt={settings.short_name || 'Logo'}
                  className="w-10 h-10 object-contain"
                />
              ) : (
                <img 
                  src={logo} 
                  alt={settings?.short_name || 'Logo'}
                  className="w-10 h-10 object-contain"
                />
              )}
              <div className="hidden sm:block">
                <div className="font-bold text-foreground text-base leading-tight">
                  {settings?.name || 'MV Business Solutions'}
                </div>
              </div>
            </Link>

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

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hidden md:flex items-center gap-1.5 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span className="max-w-[100px] truncate">{user.name}</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="font-semibold truncate">{user.name}</span>
                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="w-4 h-4 mr-2" />
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/register">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden md:flex items-center gap-1.5 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Register / Login</span>
                  </Button>
                </Link>
              )}

              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <div className="flex items-center gap-2.5 mb-6 pt-2">
                    {settings?.logo_url ? (
                      <img 
                        src={`http://localhost:5000${settings.logo_url}`} 
                        alt={settings.short_name || 'Logo'}
                        className="w-10 h-10 object-contain"
                      />
                    ) : (
                      <img 
                        src={logo} 
                        alt={settings?.short_name || 'Logo'}
                        className="w-10 h-10 object-contain"
                      />
                    )}
                    <div>
                      <div className="font-bold text-sm">
                        {settings?.short_name || 'MV Business Solutions'}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        Enterprise E-Catalog
                      </div>
                    </div>
                  </div>

                  {user ? (
                    <div className="mb-2">
                      <button
                        onClick={() => { setMobileOpen(false); navigate('/profile'); }}
                        className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-primary/10 mb-1 hover:bg-primary/20 transition-colors"
                      >
                        <User className="w-4 h-4 text-primary shrink-0" />
                        <div className="flex-1 min-w-0 text-left">
                          <div className="text-sm font-semibold text-primary truncate">{user.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                        </div>
                      </button>
                      <button
                        onClick={() => { setMobileOpen(false); handleLogout(); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 mb-2 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Register / Login
                    </Link>
                  )}

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

          {/* Navigation with dynamic categories */}
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
                {isLoadingCategories ? (
                  <div className="px-4 py-3 text-sm text-muted-foreground">
                    Loading categories...
                  </div>
                ) : categories.length > 0 ? (
                  categories.map((cat) => {
                    const productCount = getProductCount(cat.category_name);
                    return (
                      <Link
                        key={cat.id}
                        to={`/products?category=${encodeURIComponent(cat.category_name)}`}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors text-sm"
                      >
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-orange-500" />
                        <div className="flex-1">
                          <div className="font-medium">{cat.category_name}</div>
                          {/* <div className="text-xs text-muted-foreground">{productCount} products</div> */}
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="px-4 py-3 text-sm text-muted-foreground">
                    No categories found
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}