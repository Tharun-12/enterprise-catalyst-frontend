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
//                   src={`${baseurl}/${settings.logo_url}`} 
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
//                         src={`${baseurl}/${settings.logo_url}`} 
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
// import { products } from '@/data';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';
// import { useSettings } from '@/hooks/use-settings';

// import logo from '@/asstes/mvblogo.png';
// import { baseurl } from '@/Baseurl/baseurl';

// interface UserSession {
//   userId: number;
//   name: string;
//   email: string;
//   mobile: string;
//   loggedIn: boolean;
//   loginTime: string;
// }

// interface Category {
//   id: number;
//   category_name: string;
//   created_at: string;
//   updated_at: string;
// }

// export function CustomerHeader() {
//   const [scrolled, setScrolled] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showResults, setShowResults] = useState(false);
//   const [user, setUser] = useState<UserSession | null>(null);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [isLoadingCategories, setIsLoadingCategories] = useState(true);
//   const { wishlist, compareList } = useApp();
//   const navigate = useNavigate();
//   const { settings } = useSettings();

//   // Fetch categories from API
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch(`${baseurl}/api/categories/`);
//         const result = await response.json();
        
//         if (result.success) {
//           setCategories(result.data);
//         } else {
//           console.error('Failed to fetch categories:', result.message);
//         }
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//       } finally {
//         setIsLoadingCategories(false);
//       }
//     };

//     fetchCategories();
//   }, []);

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

//   // Get product count for a category (you may want to fetch this from API)
//   // const getProductCount = (categoryName: string) => {
//   //   return products.filter(p => p.categoryName === categoryName).length;
//   // };

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
//       {/* Top bar with gradient */}
//       {/* <div className="bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 text-white text-xs hidden md:block">
//         <div className="container mx-auto px-4 flex items-center justify-between h-9">
//           <div className="flex items-center gap-4">
//             <a href={`tel:${settings?.phone || COMPANY.phone}`} className="flex items-center gap-1.5 hover:text-yellow-200 transition-colors">
//               <Phone className="w-3 h-3" />
//               {settings?.phone || COMPANY.phone}
//             </a>
//             <a href={`mailto:${settings?.email || COMPANY.email}`} className="flex items-center gap-1.5 hover:text-yellow-200 transition-colors">
//               <Mail className="w-3 h-3" />
//               {settings?.email || COMPANY.email}
//             </a>
//           </div>
//           <div className="flex items-center gap-4">
//             <span>{settings?.working_hours || COMPANY.workingHours}</span>
//             <Link to="/admin" className="flex items-center gap-1.5 hover:text-yellow-200 transition-colors font-medium">
//               <Building2 className="w-3 h-3" />
//               Admin Portal
//             </Link>
//           </div>
//         </div>
//       </div> */}

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
//                   src={`${baseurl}${settings.logo_url}`} 
//                   alt={settings.short_name || 'Logo'}
//                   className="w-10 h-10 object-contain"
//                 />
//               ) : (
//                 <img 
//                   src={logo} 
//                   alt={settings?.short_name || 'Logo'}
//                   className="w-10 h-10 object-contain"
//                 />
//               )}
//               <div className="hidden sm:block">
//                 <div className="font-bold text-foreground text-base leading-tight">
//                   {settings?.name || 'MV Business Solutions'}
//                 </div>
//               </div>
//             </Link>

//             <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-8 relative">
//               <div className="relative w-full">
//                 {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
//                 /> */}
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
//                         src={`${baseurl}${settings.logo_url}`} 
//                         alt={settings.short_name || 'Logo'}
//                         className="w-10 h-10 object-contain"
//                       />
//                     ) : (
//                       <img 
//                         src={logo} 
//                         alt={settings?.short_name || 'Logo'}
//                         className="w-10 h-10 object-contain"
//                       />
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

//           {/* Navigation with dynamic categories */}
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
//               {/* <button className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-muted/50 rounded-md transition-all flex items-center gap-1">
//                 All Categories <ChevronDown className="w-3.5 h-3.5" />
//               </button> */}
//               <div className="absolute top-full left-0 mt-0 w-64 bg-card border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-2">
//                 {isLoadingCategories ? (
//                   <div className="px-4 py-3 text-sm text-muted-foreground">
//                     Loading categories...
//                   </div>
//                 ) : categories.length > 0 ? (
//                   categories.map((cat) => {
//                     // const productCount = getProductCount(cat.category_name);
//                     return (
//                       <Link
//                         key={cat.id}
//                         to={`/products?category=${encodeURIComponent(cat.category_name)}`}
//                         className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors text-sm"
//                       >
//                         <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-orange-500" />
//                         <div className="flex-1">
//                           <div className="font-medium">{cat.category_name}</div>
//                           {/* <div className="text-xs text-muted-foreground">{productCount} products</div> */}
//                         </div>
//                       </Link>
//                     );
//                   })
//                 ) : (
//                   <div className="px-4 py-3 text-sm text-muted-foreground">
//                     No categories found
//                   </div>
//                 )}
//               </div>
//             </div>
//           </nav>
//         </div>
//       </header>
//     </>
//   );
// }



// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import { Menu, Search, Heart, GitCompare, ChevronDown, Building2, Phone, Mail, User, LogOut, Home, Package, Info, PhoneCall, ShoppingBag } from 'lucide-react';
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
// import { products } from '@/data';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';
// import { useSettings } from '@/hooks/use-settings';

// import logo from '@/asstes/mvblogo.png';
// import { baseurl } from '@/Baseurl/baseurl';

// interface UserSession {
//   userId: number;
//   name: string;
//   email: string;
//   mobile: string;
//   loggedIn: boolean;
//   loginTime: string;
// }

// interface Category {
//   id: number;
//   category_name: string;
//   created_at: string;
//   updated_at: string;
// }

// export function CustomerHeader() {
//   const [scrolled, setScrolled] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showResults, setShowResults] = useState(false);
//   const [user, setUser] = useState<UserSession | null>(null);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [isLoadingCategories, setIsLoadingCategories] = useState(true);
//   const { wishlist, compareList } = useApp();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { settings } = useSettings();

//   // Fetch categories from API
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch(`${baseurl}/api/categories/`);
//         const result = await response.json();
        
//         if (result.success) {
//           setCategories(result.data);
//         } else {
//           console.error('Failed to fetch categories:', result.message);
//         }
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//       } finally {
//         setIsLoadingCategories(false);
//       }
//     };

//     fetchCategories();
//   }, []);

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

//   // Check if link is active
//   const isActive = (path: string) => {
//     if (path === '/') {
//       return location.pathname === '/';
//     }
//     return location.pathname.startsWith(path);
//   };

//   // Get gradient border style for active link
//   const getActiveStyles = (path: string) => {
//     if (isActive(path)) {
//       return 'text-transparent bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text font-bold relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-pink-500 after:via-orange-500 after:via-yellow-400 after:to-blue-600';
//     }
//     return 'text-foreground/70 hover:text-foreground';
//   };

//   return (
//     <>
//       {/* Top bar with gradient - ENHANCED */}
//       {/* <div className="bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 text-white text-xs hidden md:block relative overflow-hidden">
//         <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
//         <div className="container mx-auto px-4 flex items-center justify-between h-9 relative z-10">
//           <div className="flex items-center gap-6">
//             <a href={`tel:${settings?.phone || COMPANY.phone}`} className="flex items-center gap-1.5 hover:text-yellow-200 transition-colors duration-300">
//               <Phone className="w-3 h-3" />
//               {settings?.phone || COMPANY.phone}
//             </a>
//             <a href={`mailto:${settings?.email || COMPANY.email}`} className="flex items-center gap-1.5 hover:text-yellow-200 transition-colors duration-300">
//               <Mail className="w-3 h-3" />
//               {settings?.email || COMPANY.email}
//             </a>
//           </div>
//           <div className="flex items-center gap-6">
//             <span className="flex items-center gap-1.5">
//               <span className="animate-pulse">●</span>
//               {settings?.working_hours || COMPANY.workingHours}
//             </span>
//             <Link to="/admin" className="flex items-center gap-1.5 hover:text-yellow-200 transition-colors duration-300 font-medium">
//               <Building2 className="w-3 h-3" />
//               Admin Portal
//             </Link>
//           </div>
//         </div>
//       </div> */}

//       {/* Main header */}
//       <header
//         className={cn(
//           'sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b transition-all duration-300',
//           scrolled ? 'shadow-lg border-gray-200' : 'border-transparent'
//         )}
//       >
//         <div className="container mx-auto px-4">
//           <div className="flex items-center justify-between h-16 lg:h-20">
//             {/* Logo */}
//             <Link to="/" className="flex items-center gap-3 shrink-0 group">
//               <div className="relative">
//                 {settings?.logo_url ? (
//                   <img 
//                     src={`${baseurl}${settings.logo_url}`} 
//                     alt={settings.short_name || 'Logo'}
//                     className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-105"
//                   />
//                 ) : (
//                   <img 
//                     src={logo} 
//                     alt={settings?.short_name || 'Logo'}
//                     className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-105"
//                   />
//                 )}
//                 <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
//               </div>
//               <div className="hidden sm:block">
//                 <div className="font-bold text-lg text-gray-800 leading-tight">
//                   {settings?.name || 'MV Business Solutions'}
//                 </div>
//                 <div className="text-[10px] text-transparent bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text font-medium">
//                   Enterprise E-Catalog
//                 </div>
//               </div>
//             </Link>

//             {/* Search */}
//             <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl mx-8 relative">
//               <div className="relative w-full">
//                 {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <Input
//                   placeholder="Search products, brands, categories..."
//                   className="pl-10 pr-4 bg-gray-50 border-gray-200 focus:border-transparent focus:ring-2 focus:ring-orange-400 rounded-full transition-all duration-300"
//                   value={searchQuery}
//                   onChange={(e) => {
//                     setSearchQuery(e.target.value);
//                     setShowResults(true);
//                   }}
//                   onFocus={() => setShowResults(true)}
//                   onBlur={() => setTimeout(() => setShowResults(false), 200)}
//                 /> */}
//                 {showResults && searchResults.length > 0 && (
//                   <div className="absolute top-full mt-2 w-full bg-white border rounded-xl shadow-2xl overflow-hidden z-50">
//                     {searchResults.map((p) => (
//                       <Link
//                         key={p.id}
//                         to={`/products/${p.slug}`}
//                         className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-pink-50 hover:via-orange-50 hover:to-blue-50 transition-colors duration-200 border-b last:border-0"
//                       >
//                         <img src={p.gallery[0]} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
//                         <div className="flex-1 min-w-0">
//                           <div className="text-sm font-medium text-gray-800 truncate">{p.name}</div>
//                           <div className="text-xs text-gray-500">{p.brandName} · {p.categoryName}</div>
//                         </div>
//                         <div className="text-xs font-semibold text-transparent bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text">
//                           View →
//                         </div>
//                       </Link>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </form>

//             {/* Actions */}
//             <div className="flex items-center gap-1 sm:gap-2">
//               <Link to="/compare">
//                 <Button variant="ghost" size="sm" className="relative hover:bg-gradient-to-r hover:from-pink-50 hover:via-orange-50 hover:to-blue-50 transition-all duration-300">
//                   <GitCompare className="w-5 h-5 text-gray-600" />
//                   {compareList.length > 0 && (
//                     <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-[10px] bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 text-white border-0">
//                       {compareList.length}
//                     </Badge>
//                   )}
//                   <span className="hidden xl:inline ml-1.5 text-gray-600">Compare</span>
//                 </Button>
//               </Link>
//               <Link to="/wishlist">
//                 <Button variant="ghost" size="sm" className="relative hover:bg-gradient-to-r hover:from-pink-50 hover:via-orange-50 hover:to-blue-50 transition-all duration-300">
//                   <Heart className="w-5 h-5 text-gray-600" />
//                   {wishlist.length > 0 && (
//                     <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-[10px] bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 text-white border-0">
//                       {wishlist.length}
//                     </Badge>
//                   )}
//                   <span className="hidden xl:inline ml-1.5 text-gray-600">Wishlist</span>
//                 </Button>
//               </Link>

//               {user ? (
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="hidden md:flex items-center gap-1.5 border-0 bg-gradient-to-r from-pink-50 via-orange-50 to-blue-50 text-gray-700 hover:shadow-md transition-all duration-300 rounded-full px-4"
//                     >
//                       <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
//                         {user.name.charAt(0).toUpperCase()}
//                       </div>
//                       <span className="max-w-[100px] truncate font-medium">{user.name}</span>
//                       <ChevronDown className="w-3.5 h-3.5" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end" className="w-56 p-2">
//                     <DropdownMenuLabel>
//                       <div className="flex flex-col">
//                         <span className="font-semibold text-gray-800 truncate">{user.name}</span>
//                         <span className="text-xs text-gray-500 truncate">{user.email}</span>
//                       </div>
//                     </DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer hover:bg-gradient-to-r hover:from-pink-50 hover:via-orange-50 hover:to-blue-50">
//                       <User className="w-4 h-4 mr-2" />
//                       My Profile
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:bg-red-50 focus:text-red-600">
//                       <LogOut className="w-4 h-4 mr-2" />
//                       Logout
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               ) : (
//                 <Link to="/register">
//                   <Button
//                     size="sm"
//                     className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 text-white hover:shadow-lg transition-all duration-300 rounded-full px-5"
//                   >
//                     <User className="w-4 h-4" />
//                     <span>Register / Login</span>
//                   </Button>
//                 </Link>
//               )}

//               <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
//                 <SheetTrigger asChild>
//                   <Button variant="ghost" size="icon" className="lg:hidden hover:bg-gradient-to-r hover:from-pink-50 hover:via-orange-50 hover:to-blue-50">
//                     <Menu className="w-5 h-5 text-gray-600" />
//                   </Button>
//                 </SheetTrigger>
//                 <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-white">
//                   <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
//                   <div className="flex items-center gap-2.5 mb-6 pt-2">
//                     {settings?.logo_url ? (
//                       <img 
//                         src={`${baseurl}${settings.logo_url}`} 
//                         alt={settings.short_name || 'Logo'}
//                         className="w-10 h-10 object-contain"
//                       />
//                     ) : (
//                       <img 
//                         src={logo} 
//                         alt={settings?.short_name || 'Logo'}
//                         className="w-10 h-10 object-contain"
//                       />
//                     )}
//                     <div>
//                       <div className="font-bold text-sm text-gray-800">
//                         {settings?.short_name || 'MV Business Solutions'}
//                       </div>
//                       <div className="text-[10px] text-transparent bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text font-medium">
//                         Enterprise E-Catalog
//                       </div>
//                     </div>
//                   </div>

//                   {user ? (
//                     <div className="mb-2">
//                       <button
//                         onClick={() => { setMobileOpen(false); navigate('/profile'); }}
//                         className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-pink-50 via-orange-50 to-blue-50 mb-1 hover:shadow-md transition-all duration-300"
//                       >
//                         <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
//                           {user.name.charAt(0).toUpperCase()}
//                         </div>
//                         <div className="flex-1 min-w-0 text-left">
//                           <div className="text-sm font-semibold text-gray-800 truncate">{user.name}</div>
//                           <div className="text-xs text-gray-500 truncate">{user.email}</div>
//                         </div>
//                       </button>
//                       <button
//                         onClick={() => { setMobileOpen(false); handleLogout(); }}
//                         className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-300"
//                       >
//                         <LogOut className="w-4 h-4" />
//                         Logout
//                       </button>
//                     </div>
//                   ) : (
//                     <Link
//                       to="/register"
//                       onClick={() => setMobileOpen(false)}
//                       className="flex items-center gap-2 px-4 py-3 mb-2 rounded-lg bg-gradient-to-r from-pink-50 via-orange-50 to-blue-50 text-gray-700 font-medium hover:shadow-md transition-all duration-300"
//                     >
//                       <User className="w-4 h-4" />
//                       Register / Login
//                     </Link>
//                   )}

//                   <form onSubmit={handleSearch} className="mb-4">
//                     <div className="relative">
//                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                       <Input placeholder="Search..." className="pl-10 bg-gray-50 border-gray-200 rounded-full" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
//                     </div>
//                   </form>
//                   <nav className="flex flex-col gap-1">
//                     {NAV_LINKS.map((link) => (
//                       <Link
//                         key={link.path}
//                         to={link.path}
//                         onClick={() => setMobileOpen(false)}
//                         className={cn(
//                           "px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300",
//                           isActive(link.path)
//                             ? "text-transparent bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text font-bold bg-gray-50"
//                             : "text-gray-600 hover:bg-gray-50"
//                         )}
//                       >
//                         {link.label}
//                       </Link>
//                     ))}
//                     <Link
//                       to="/admin"
//                       onClick={() => setMobileOpen(false)}
//                       className="px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-300 flex items-center gap-2 text-transparent bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text"
//                     >
//                       <Building2 className="w-4 h-4" />
//                       Admin Portal
//                     </Link>
//                   </nav>
//                 </SheetContent>
//               </Sheet>
//             </div>
//           </div>

//           {/* Navigation with dynamic categories - ENHANCED */}
//           <nav className="hidden lg:flex items-center justify-center gap-1 h-14 border-t border-gray-100">
//             {NAV_LINKS.map((link) => {
//               const active = isActive(link.path);
//               return (
//                 <Link
//                   key={link.path}
//                   to={link.path}
//                   className={cn(
//                     "px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 relative",
//                     active
//                       ? "text-transparent bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text font-bold"
//                       : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
//                     "hover:scale-105"
//                   )}
//                 >
//                   {link.label}
//                   {active && (
//                     <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 rounded-full"></span>
//                   )}
//                 </Link>
//               );
//             })}
//             <div className="group relative">
//               {/* <button className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-300 flex items-center gap-1 hover:scale-105">
//                 All Categories <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
//               </button> */}
//               <div className="absolute top-full left-0 mt-0 w-72 bg-white border border-gray-100 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pt-2 overflow-hidden">
//                 {isLoadingCategories ? (
//                   <div className="px-4 py-3 text-sm text-gray-500">
//                     Loading categories...
//                   </div>
//                 ) : categories.length > 0 ? (
//                   categories.map((cat) => {
//                     return (
//                       <Link
//                         key={cat.id}
//                         to={`/products?category=${encodeURIComponent(cat.category_name)}`}
//                         className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-pink-50 hover:via-orange-50 hover:to-blue-50 transition-colors duration-200 text-sm border-b border-gray-50 last:border-0"
//                       >
//                         <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600" />
//                         <div className="flex-1">
//                           <div className="font-medium text-gray-700">{cat.category_name}</div>
//                         </div>
//                         <div className="text-xs text-transparent bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text font-semibold">
//                           →
//                         </div>
//                       </Link>
//                     );
//                   })
//                 ) : (
//                   <div className="px-4 py-3 text-sm text-gray-500">
//                     No categories found
//                   </div>
//                 )}
//               </div>
//             </div>
//           </nav>
//         </div>
//       </header>
//     </>
//   );
// }





// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import { 
//   Menu, Search, Heart, GitCompare, ChevronDown, Building2, 
//   User, LogOut, Home, Package, Info, PhoneCall, ShoppingBag, 
//   LayoutGrid, Headphones, Truck, Award, Shield 
// } from 'lucide-react';
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
// import { NAV_LINKS } from '@/constants';
// import { useApp } from '@/hooks/use-app';
// // import { products } from '@/data';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';
// import { useSettings } from '@/hooks/use-settings';

// import logo from '@/asstes/mvblogo.png';
// import { baseurl } from '@/Baseurl/baseurl';

// interface UserSession {
//   userId: number;
//   name: string;
//   email: string;
//   mobile: string;
//   loggedIn: boolean;
//   loginTime: string;
// }

// // Map of icons for navigation links - ICONS ARE ALWAYS VISIBLE
// const navIcons: Record<string, React.ReactNode> = {
//   '/': <Home className="w-4 h-4 flex-shrink-0" />,
//   '/products': <Package className="w-4 h-4 flex-shrink-0" />,
//   '/about': <Info className="w-4 h-4 flex-shrink-0" />,
//   '/contact': <PhoneCall className="w-4 h-4 flex-shrink-0" />,
//   '/brands': <LayoutGrid className="w-4 h-4 flex-shrink-0" />,
//   '/services': <Headphones className="w-4 h-4 flex-shrink-0" />,
//   '/shipping': <Truck className="w-4 h-4 flex-shrink-0" />,
//   '/warranty': <Award className="w-4 h-4 flex-shrink-0" />,
//   '/guarantee': <Shield className="w-4 h-4 flex-shrink-0" />,
//   '/shop': <ShoppingBag className="w-4 h-4 flex-shrink-0" />,
// };

// export function CustomerHeader() {
//   const [scrolled, setScrolled] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   // REMOVED: const [showResults, setShowResults] = useState(false);
//   const [user, setUser] = useState<UserSession | null>(null);
//   const { wishlist, compareList } = useApp();
//   const navigate = useNavigate();
//   const location = useLocation();
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

//   // const searchResults = searchQuery
//   //   ? products
//   //       .filter(
//   //         (p) =>
//   //           p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//   //           p.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
//   //           p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
//   //       )
//   //       .slice(0, 5)
//   //   : [];

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
//       // REMOVED: setShowResults(false);
//       setSearchQuery('');
//     }
//   };

//   // Check if link is active
//   const isActive = (path: string) => {
//     if (path === '/') {
//       return location.pathname === '/';
//     }
//     return location.pathname.startsWith(path);
//   };

//   return (
//     <>
//       {/* Main header */}
//       <header
//         className={cn(
//           'sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b transition-all duration-300',
//           scrolled ? 'shadow-lg border-gray-200' : 'border-transparent'
//         )}
//       >
//         <div className="container mx-auto px-4">
//           <div className="flex items-center justify-between h-16 lg:h-20">
//             {/* Logo */}
//             <Link to="/" className="flex items-center gap-3 shrink-0 group">
//               <div className="relative">
//                 {settings?.logo_url ? (
//                   <img 
//                     src={`${baseurl}${settings.logo_url}`} 
//                     alt={settings.short_name || 'Logo'}
//                     className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-105"
//                   />
//                 ) : (
//                   <img 
//                     src={logo} 
//                     alt={settings?.short_name || 'Logo'}
//                     className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-105"
//                   />
//                 )}
//                 <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
//               </div>
//               <div className="hidden sm:block">
//                 <div className="font-bold text-lg text-gray-800 leading-tight">
//                   {settings?.name || 'MV Business Solutions'}
//                 </div>
//                 <div className="text-[10px] text-transparent bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text font-medium">
//                   Enterprise E-Catalog
//                 </div>
//               </div>
//             </Link>

//             {/* Navigation Links - Desktop - ICONS ALWAYS VISIBLE */}
//             <nav className="hidden lg:flex items-center gap-1">
//               {NAV_LINKS.map((link) => {
//                 const active = isActive(link.path);
//                 return (
//                   <Link
//                     key={link.path}
//                     to={link.path}
//                     className={cn(
//                       "px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 relative flex items-center gap-2 group",
//                       active ? "bg-gray-50/50" : "hover:bg-gray-50"
//                     )}
//                   >
//                     {/* ICON - ALWAYS VISIBLE */}
//                     <span className={cn(
//                       "flex-shrink-0 transition-all duration-300",
//                       active 
//                         ? "text-transparent bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text" 
//                         : "text-gray-600 group-hover:text-gray-900"
//                     )}>
//                       {navIcons[link.path] || <LayoutGrid className="w-4 h-4 flex-shrink-0" />}
//                     </span>
                    
//                     {/* TEXT - ALWAYS VISIBLE */}
//                     <span className={cn(
//                       "transition-all duration-300",
//                       active 
//                         ? "text-transparent bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text font-bold" 
//                         : "text-gray-600 group-hover:text-gray-900"
//                     )}>
//                       {link.label}
//                     </span>
                    
//                     {/* Active indicator - only for active link */}
//                     {active && (
//                       <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 rounded-full"></span>
//                     )}
//                   </Link>
//                 );
//               })}
//             </nav>

//             {/* Actions */}
//             <div className="flex items-center gap-1 sm:gap-2">
//               <Link to="/compare">
//                 <Button variant="ghost" size="sm" className="relative hover:bg-gradient-to-r hover:from-pink-50 hover:via-orange-50 hover:to-blue-50 transition-all duration-300">
//                   <GitCompare className="w-5 h-5 text-gray-600" />
//                   {compareList.length > 0 && (
//                     <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-[10px] bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 text-white border-0">
//                       {compareList.length}
//                     </Badge>
//                   )}
//                   <span className="hidden xl:inline ml-1.5 text-gray-600">Compare</span>
//                 </Button>
//               </Link>
//               <Link to="/wishlist">
//                 <Button variant="ghost" size="sm" className="relative hover:bg-gradient-to-r hover:from-pink-50 hover:via-orange-50 hover:to-blue-50 transition-all duration-300">
//                   <Heart className="w-5 h-5 text-gray-600" />
//                   {wishlist.length > 0 && (
//                     <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-[10px] bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 text-white border-0">
//                       {wishlist.length}
//                     </Badge>
//                   )}
//                   <span className="hidden xl:inline ml-1.5 text-gray-600">Wishlist</span>
//                 </Button>
//               </Link>

//               {user ? (
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="hidden md:flex items-center gap-1.5 border-0 bg-gradient-to-r from-pink-50 via-orange-50 to-blue-50 text-gray-700 hover:shadow-md transition-all duration-300 rounded-full px-4"
//                     >
//                       <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
//                         {user.name.charAt(0).toUpperCase()}
//                       </div>
//                       <span className="max-w-[100px] truncate font-medium">{user.name}</span>
//                       <ChevronDown className="w-3.5 h-3.5" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end" className="w-56 p-2">
//                     <DropdownMenuLabel>
//                       <div className="flex flex-col">
//                         <span className="font-semibold text-gray-800 truncate">{user.name}</span>
//                         <span className="text-xs text-gray-500 truncate">{user.email}</span>
//                       </div>
//                     </DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer hover:bg-gradient-to-r hover:from-pink-50 hover:via-orange-50 hover:to-blue-50">
//                       <User className="w-4 h-4 mr-2" />
//                       My Profile
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:bg-red-50 focus:text-red-600">
//                       <LogOut className="w-4 h-4 mr-2" />
//                       Logout
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               ) : (
//                 <Link to="/register">
//                   <Button
//                     size="sm"
//                     className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 text-white hover:shadow-lg transition-all duration-300 rounded-full px-5"
//                   >
//                     <User className="w-4 h-4" />
//                     <span>Register / Login</span>
//                   </Button>
//                 </Link>
//               )}

//               <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
//                 <SheetTrigger asChild>
//                   <Button variant="ghost" size="icon" className="lg:hidden hover:bg-gradient-to-r hover:from-pink-50 hover:via-orange-50 hover:to-blue-50">
//                     <Menu className="w-5 h-5 text-gray-600" />
//                   </Button>
//                 </SheetTrigger>
//                 <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-white">
//                   <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
//                   <div className="flex items-center gap-2.5 mb-6 pt-2">
//                     {settings?.logo_url ? (
//                       <img 
//                         src={`${baseurl}${settings.logo_url}`} 
//                         alt={settings.short_name || 'Logo'}
//                         className="w-10 h-10 object-contain"
//                       />
//                     ) : (
//                       <img 
//                         src={logo} 
//                         alt={settings?.short_name || 'Logo'}
//                         className="w-10 h-10 object-contain"
//                       />
//                     )}
//                     <div>
//                       <div className="font-bold text-sm text-gray-800">
//                         {settings?.short_name || 'MV Business Solutions'}
//                       </div>
//                       <div className="text-[10px] text-transparent bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text font-medium">
//                         Enterprise E-Catalog
//                       </div>
//                     </div>
//                   </div>

//                   {user ? (
//                     <div className="mb-2">
//                       <button
//                         onClick={() => { setMobileOpen(false); navigate('/profile'); }}
//                         className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-pink-50 via-orange-50 to-blue-50 mb-1 hover:shadow-md transition-all duration-300"
//                       >
//                         <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
//                           {user.name.charAt(0).toUpperCase()}
//                         </div>
//                         <div className="flex-1 min-w-0 text-left">
//                           <div className="text-sm font-semibold text-gray-800 truncate">{user.name}</div>
//                           <div className="text-xs text-gray-500 truncate">{user.email}</div>
//                         </div>
//                       </button>
//                       <button
//                         onClick={() => { setMobileOpen(false); handleLogout(); }}
//                         className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-300"
//                       >
//                         <LogOut className="w-4 h-4" />
//                         Logout
//                       </button>
//                     </div>
//                   ) : (
//                     <Link
//                       to="/register"
//                       onClick={() => setMobileOpen(false)}
//                       className="flex items-center gap-2 px-4 py-3 mb-2 rounded-lg bg-gradient-to-r from-pink-50 via-orange-50 to-blue-50 text-gray-700 font-medium hover:shadow-md transition-all duration-300"
//                     >
//                       <User className="w-4 h-4" />
//                       Register / Login
//                     </Link>
//                   )}

//                   <form onSubmit={handleSearch} className="mb-4">
//                     <div className="relative">
//                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                       <Input placeholder="Search..." className="pl-10 bg-gray-50 border-gray-200 rounded-full" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
//                     </div>
//                   </form>
                  
//                   {/* Mobile Navigation - ICONS ALWAYS VISIBLE */}
//                   <nav className="flex flex-col gap-1">
//                     {NAV_LINKS.map((link) => {
//                       const active = isActive(link.path);
//                       return (
//                         <Link
//                           key={link.path}
//                           to={link.path}
//                           onClick={() => setMobileOpen(false)}
//                           className={cn(
//                             "px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-3 group",
//                             active ? "bg-gray-50" : "hover:bg-gray-50"
//                           )}
//                         >
//                           {/* ICON - ALWAYS VISIBLE in mobile */}
//                           <span className={cn(
//                             "flex-shrink-0 transition-all duration-300",
//                             active 
//                               ? "text-transparent bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text" 
//                               : "text-gray-600 group-hover:text-gray-900"
//                           )}>
//                             {navIcons[link.path] || <LayoutGrid className="w-4 h-4 flex-shrink-0" />}
//                           </span>
                          
//                           {/* TEXT - ALWAYS VISIBLE in mobile */}
//                           <span className={cn(
//                             "transition-all duration-300",
//                             active 
//                               ? "text-transparent bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text font-bold" 
//                               : "text-gray-600 group-hover:text-gray-900"
//                           )}>
//                             {link.label}
//                           </span>
//                         </Link>
//                       );
//                     })}
//                     <Link
//                       to="/admin"
//                       onClick={() => setMobileOpen(false)}
//                       className="px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-300 flex items-center gap-2 text-transparent bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text"
//                     >
//                       <Building2 className="w-4 h-4" />
//                       Admin Portal
//                     </Link>
//                   </nav>
//                 </SheetContent>
//               </Sheet>
//             </div>
//           </div>
//         </div>
//       </header>
//     </>
//   );
// }



import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Menu, Search, Heart, GitCompare, ChevronDown, Building2, 
  User, LogOut, Home, Package, Info, PhoneCall, ShoppingBag, 
  LayoutGrid, Headphones, Truck, Award, Shield, FileText
} from 'lucide-react';
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
import { NAV_LINKS } from '@/constants';
import { useApp } from '@/hooks/use-app';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useSettings } from '@/hooks/use-settings';

import logo from '@/asstes/mvblogo.png';
import { baseurl } from '@/Baseurl/baseurl';

interface UserSession {
  userId: number;
  name: string;
  email: string;
  mobile: string;
  loggedIn: boolean;
  loginTime: string;
}

// Map of icons for navigation links
const navIcons: Record<string, React.ReactNode> = {
  '/': <Home className="w-4 h-4 flex-shrink-0" />,
  '/products': <Package className="w-4 h-4 flex-shrink-0" />,
  '/about': <Info className="w-4 h-4 flex-shrink-0" />,
  '/contact': <PhoneCall className="w-4 h-4 flex-shrink-0" />,
  '/brands': <LayoutGrid className="w-4 h-4 flex-shrink-0" />,
  '/services': <Headphones className="w-4 h-4 flex-shrink-0" />,
  '/shipping': <Truck className="w-4 h-4 flex-shrink-0" />,
  '/warranty': <Award className="w-4 h-4 flex-shrink-0" />,
  '/guarantee': <Shield className="w-4 h-4 flex-shrink-0" />,
  '/shop': <ShoppingBag className="w-4 h-4 flex-shrink-0" />,
};

export function CustomerHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('success');
  const [user, setUser] = useState<UserSession | null>(null);
  const { wishlist, compareList } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useSettings();

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
    showAutoDismissAlert('Logged out successfully', 'success');
    navigate('/');
  };

  // Auto-dismiss alert function
  const showAutoDismissAlert = (message: string, type: 'success' | 'error' | 'info' = 'success', duration: number = 3000) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    
    // Auto dismiss after duration
    setTimeout(() => {
      setShowAlert(false);
    }, duration);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Get alert styles based on type
  const getAlertStyles = () => {
    switch(alertType) {
      case 'success':
        return {
          bg: 'bg-green-100',
          icon: 'text-green-600',
          border: 'border-green-200',
          progress: 'bg-green-500'
        };
      case 'error':
        return {
          bg: 'bg-red-100',
          icon: 'text-red-600',
          border: 'border-red-200',
          progress: 'bg-red-500'
        };
      case 'info':
        return {
          bg: 'bg-blue-100',
          icon: 'text-blue-600',
          border: 'border-blue-200',
          progress: 'bg-blue-500'
        };
      default:
        return {
          bg: 'bg-green-100',
          icon: 'text-green-600',
          border: 'border-green-200',
          progress: 'bg-green-500'
        };
    }
  };

  const alertStyles = getAlertStyles();

  return (
    <>
      {/* Main header */}
      <header
        className={cn(
          'sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b transition-all duration-300',
          scrolled ? 'shadow-lg border-gray-200' : 'border-transparent'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
              <div className="relative">
                {settings?.logo_url ? (
                  <img 
                    src={`${baseurl}${settings.logo_url}`} 
                    alt={settings.short_name || 'Logo'}
                    className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <img 
                    src={logo} 
                    alt={settings?.short_name || 'Logo'}
                    className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-lg text-gray-800 leading-tight">
                  {settings?.name || 'MV Business Solutions'}
                </div>
                {/* <div className="text-[10px] text-transparent bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text font-medium">
                  Enterprise E-Catalog
                </div> */}
                <div className="text-[10px] text-pink-500 font-medium">
  Enterprise E-Catalog
</div>
              </div>
            </Link>

            {/* Navigation Links - Desktop */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 relative flex items-center gap-2 group",
                      active ? "bg-gray-50/50" : "hover:bg-gray-50"
                    )}
                  >
                    <span className={cn(
                      "flex-shrink-0 transition-all duration-300",
                      active 
                        ? "text-transparent bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text" 
                        : "text-gray-600 group-hover:text-gray-900"
                    )}>
                      {navIcons[link.path] || <LayoutGrid className="w-4 h-4 flex-shrink-0" />}
                    </span>
                    
                    <span className={cn(
                      "transition-all duration-300",
                      active 
                        ? "text-transparent bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text font-bold" 
                        : "text-gray-600 group-hover:text-gray-900"
                    )}>
                      {link.label}
                    </span>
                    
                    {active && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 rounded-full"></span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Link to="/compare">
                <Button variant="ghost" size="sm" className="relative hover:bg-gradient-to-r hover:from-pink-50 hover:via-orange-50 hover:to-blue-50 transition-all duration-300">
                  <GitCompare className="w-5 h-5 text-gray-600" />
                  {compareList.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-[10px] bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 text-white border-0">
                      {compareList.length}
                    </Badge>
                  )}
                  <span className="hidden xl:inline ml-1.5 text-gray-600">Compare</span>
                </Button>
              </Link>
              <Link to="/wishlist">
                <Button variant="ghost" size="sm" className="relative hover:bg-gradient-to-r hover:from-pink-50 hover:via-orange-50 hover:to-blue-50 transition-all duration-300">
                  <Heart className="w-5 h-5 text-gray-600" />
                  {wishlist.length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center text-[10px] bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 text-white border-0">
                      {wishlist.length}
                    </Badge>
                  )}
                  <span className="hidden xl:inline ml-1.5 text-gray-600">Wishlist</span>
                </Button>
              </Link>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hidden md:flex items-center gap-1.5 border-0 bg-gradient-to-r from-pink-50 via-orange-50 to-blue-50 text-gray-700 hover:shadow-md transition-all duration-300 rounded-full px-4 py-2"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="max-w-[100px] truncate font-medium">{user.name}</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800 truncate">{user.name}</span>
                        <span className="text-xs text-gray-500 truncate">{user.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    {/* My Profile */}
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer hover:bg-gradient-to-r hover:from-pink-50 hover:via-orange-50 hover:to-blue-50">
                      <User className="w-4 h-4 mr-2" />
                      My Profile
                    </DropdownMenuItem>
                    
                    {/* My Quotations - NEW ITEM BELOW MY PROFILE */}
                    <DropdownMenuItem onClick={() => navigate('/my-quotations')} className="cursor-pointer hover:bg-gradient-to-r hover:from-pink-50 hover:via-orange-50 hover:to-blue-50">
                      <FileText className="w-4 h-4 mr-2" />
                      My Quotations
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:bg-red-50 focus:text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="relative">
                  <Link to="/register">
                    <Button
                      size="default"
                      className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 hover:from-pink-600 hover:via-orange-600 hover:to-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 rounded-full px-6 py-2.5"
                    >
                      <User className="w-4 h-4" />
                      <span>Register / Login</span>
                    </Button>
                  </Link>
                  
                  {/* Alert positioned exactly below the button */}
                  {showAlert && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max min-w-[280px] z-[100] animate-in slide-in-from-top-2 duration-300">
                      <div className={`bg-white rounded-lg shadow-2xl border ${alertStyles.border} p-3 flex items-center gap-2.5`}>
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full ${alertStyles.bg} flex items-center justify-center`}>
                          {alertType === 'success' && (
                            <svg className={`w-5 h-5 ${alertStyles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          )}
                          {alertType === 'error' && (
                            <svg className={`w-5 h-5 ${alertStyles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          )}
                          {alertType === 'info' && (
                            <svg className={`w-5 h-5 ${alertStyles.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{alertMessage}</p>
                        </div>
                        <button 
                          onClick={() => setShowAlert(false)}
                          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </div>
                      {/* Progress bar for auto-dismiss */}
                      <div className="mt-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${alertStyles.progress} rounded-full animate-progress`} style={{ animationDuration: '3s' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden hover:bg-gradient-to-r hover:from-pink-50 hover:via-orange-50 hover:to-blue-50">
                    <Menu className="w-5 h-5 text-gray-600" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-white">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <div className="flex items-center gap-2.5 mb-6 pt-2">
                    {settings?.logo_url ? (
                      <img 
                        src={`${baseurl}${settings.logo_url}`} 
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
                      <div className="font-bold text-sm text-gray-800">
                        {settings?.short_name || 'MV Business Solutions'}
                      </div>
                      <div className="text-[10px] text-transparent bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text font-medium">
                        Enterprise E-Catalog
                      </div>
                    </div>
                  </div>

                  {user ? (
                    <div className="mb-2">
                      <button
                        onClick={() => { setMobileOpen(false); navigate('/profile'); }}
                        className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-pink-50 via-orange-50 to-blue-50 mb-1 hover:shadow-md transition-all duration-300"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="text-sm font-semibold text-gray-800 truncate">{user.name}</div>
                          <div className="text-xs text-gray-500 truncate">{user.email}</div>
                        </div>
                      </button>
                      
                      {/* My Quotations in mobile menu */}
                      <button
                        onClick={() => { setMobileOpen(false); navigate('/my-quotations'); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:via-orange-50 hover:to-blue-50 transition-colors duration-300"
                      >
                        <FileText className="w-4 h-4" />
                        My Quotations
                      </button>
                      
                      <button
                        onClick={() => { setMobileOpen(false); handleLogout(); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-300"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 text-white font-medium hover:shadow-lg transition-all duration-300"
                    >
                      <User className="w-4 h-4" />
                      Register / Login
                    </Link>
                  )}

                  <form onSubmit={handleSearch} className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input placeholder="Search..." className="pl-10 bg-gray-50 border-gray-200 rounded-full" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                  </form>
                  
                  <nav className="flex flex-col gap-1">
                    {NAV_LINKS.map((link) => {
                      const active = isActive(link.path);
                      return (
                        <Link
                          key={link.path}
                          to={link.path}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-3 group",
                            active ? "bg-gray-50" : "hover:bg-gray-50"
                          )}
                        >
                          <span className={cn(
                            "flex-shrink-0 transition-all duration-300",
                            active 
                              ? "text-transparent bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text" 
                              : "text-gray-600 group-hover:text-gray-900"
                          )}>
                            {navIcons[link.path] || <LayoutGrid className="w-4 h-4 flex-shrink-0" />}
                          </span>
                          
                          <span className={cn(
                            "transition-all duration-300",
                            active 
                              ? "text-transparent bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text font-bold" 
                              : "text-gray-600 group-hover:text-gray-900"
                          )}>
                            {link.label}
                          </span>
                        </Link>
                      );
                    })}
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-300 flex items-center gap-2 text-transparent bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text"
                    >
                      <Building2 className="w-4 h-4" />
                      Admin Portal
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* CSS for animations */}
      <style>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-progress {
          animation: progress 3s linear forwards;
        }
        .animate-in {
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-5px) translateX(-50%);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(-50%);
          }
        }
      `}</style>
    </>
  );
}