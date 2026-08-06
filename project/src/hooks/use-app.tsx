// // import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
// // import type { WishlistLead, Inquiry, Product } from '@/types';
// // import { toast } from 'sonner';
// // import { baseurl } from '@/Baseurl/baseurl';

// // interface AppContextValue {
// //   wishlist: string[];
// //   wishlistProducts: Product[];
// //   compareList: string[];
// //   leads: WishlistLead[];
// //   inquiries: Inquiry[];
// //   loadingWishlist: boolean;
// //   addToWishlist: (productId: string, userId?: number) => Promise<void>;
// //   removeFromWishlist: (productId: string, userId?: number) => Promise<void>;
// //   isInWishlist: (productId: string) => boolean;
// //   addToCompare: (productId: string) => void;
// //   removeFromCompare: (productId: string) => void;
// //   isInCompare: (productId: string) => boolean;
// //   clearCompare: () => void;
// //   addLead: (lead: Omit<WishlistLead, 'id' | 'status' | 'assignedTo' | 'notes' | 'createdAt'>) => void;
// //   addInquiry: (inquiry: Omit<Inquiry, 'id' | 'status' | 'createdAt'>) => void;
// //   fetchWishlist: (userId: number) => Promise<void>;
// //   clearWishlist: (userId: number) => Promise<void>;
// // }

// // const AppContext = createContext<AppContextValue | undefined>(undefined);

// // const API_BASE = `${baseurl}/api`;

// // export function AppProvider({ children }: { children: ReactNode }) {
// //   const [wishlist, setWishlist] = useState<string[]>([]);
// //   const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
// //   const [compareList, setCompareList] = useState<string[]>([]);
// //   const [leads, setLeads] = useState<WishlistLead[]>([]);
// //   const [inquiries, setInquiries] = useState<Inquiry[]>([]);
// //   const [loadingWishlist, setLoadingWishlist] = useState(false);
// //   const [currentUserId, setCurrentUserId] = useState<number | null>(null);

// //   // Load wishlist from localStorage on mount
// //   useEffect(() => {
// //     const savedWishlist = localStorage.getItem('wishlist');
// //     if (savedWishlist) {
// //       try {
// //         setWishlist(JSON.parse(savedWishlist));
// //       } catch (e) {
// //         console.error('Error loading wishlist from localStorage:', e);
// //       }
// //     }

// //     const savedCompare = localStorage.getItem('compareList');
// //     if (savedCompare) {
// //       try {
// //         setCompareList(JSON.parse(savedCompare));
// //       } catch (e) {
// //         console.error('Error loading compareList from localStorage:', e);
// //       }
// //     }

// //     // Load user session
// //     const session = localStorage.getItem('userSession');
// //     if (session) {
// //       try {
// //         const user = JSON.parse(session);
// //         setCurrentUserId(user.userId);
// //         // Fetch wishlist from API if user is logged in
// //         if (user.userId) {
// //           fetchWishlistFromAPI(user.userId);
// //         }
// //       } catch (e) {
// //         console.error('Error loading user session:', e);
// //       }
// //     }
// //   }, []);

// //   // Save wishlist to localStorage whenever it changes
// //   useEffect(() => {
// //     localStorage.setItem('wishlist', JSON.stringify(wishlist));
// //   }, [wishlist]);

// //   // Save compareList to localStorage whenever it changes
// //   useEffect(() => {
// //     localStorage.setItem('compareList', JSON.stringify(compareList));
// //   }, [compareList]);

// //   // Update the useEffect to fetch compare list when user logs in
// // useEffect(() => {
// //   const session = localStorage.getItem('userSession');
// //   if (session) {
// //     try {
// //       const user = JSON.parse(session);
// //       setCurrentUserId(user.userId);
// //       if (user.userId) {
// //         fetchWishlistFromAPI(user.userId);
// //         fetchCompareFromAPI(user.userId);
// //       }
// //     } catch (e) {
// //       console.error('Error loading user session:', e);
// //     }
// //   }
// // }, []);

// // // Add compareLoading state
// // // const [compareLoading, setCompareLoading] = useState(false);
  

// // const fetchWishlistFromAPI = useCallback(async (userId: number) => {
// //   try {
// //     setLoadingWishlist(true);
// //     const response = await fetch(`${API_BASE}/wishlist/${userId}`);
// //     const result = await response.json();
    
// //     if (result.success) {
// //       const productIds = result.data.map((item: any) => String(item.id));
// //       setWishlist(productIds);
// //       setWishlistProducts(result.data);
// //     }
// //   } catch (error) {
// //     console.error('Error fetching wishlist:', error);
// //   } finally {
// //     setLoadingWishlist(false);
// //   }
// // }, []);


// //   const fetchWishlist = async (userId: number) => {
// //     await fetchWishlistFromAPI(userId);
// //   };

// //   const addToWishlist = useCallback(async (productId: string, userId?: number) => {
// //     const uid = userId || currentUserId;
    
// //     // If user is not logged in, store in localStorage only
// //     if (!uid) {
// //       setWishlist((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
// //       toast.success('Added to wishlist (login to sync)');
// //       return;
// //     }

// //     try {
// //       const response = await fetch(`${API_BASE}/wishlist`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           user_id: uid,
// //           product_id: parseInt(productId),
// //         }),
// //       });

// //       const result = await response.json();

// //       if (result.success) {
// //         setWishlist((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
// //         toast.success('Added to wishlist');
// //         // Refresh wishlist
// //         await fetchWishlistFromAPI(uid);
// //       } else if (result.message === 'Product already exists in wishlist.') {
// //         toast.info('Product already in wishlist');
// //       } else {
// //         toast.error(result.message || 'Failed to add to wishlist');
// //       }
// //     } catch (error) {
// //       console.error('Error adding to wishlist:', error);
// //       toast.error('Failed to add to wishlist');
// //     }
// //   }, [currentUserId]);

// //   const removeFromWishlist = useCallback(async (productId: string, userId?: number) => {
// //     const uid = userId || currentUserId;

// //     // If user is not logged in, remove from localStorage only
// //     if (!uid) {
// //       setWishlist((prev) => prev.filter((id) => id !== productId));
// //       toast.success('Removed from wishlist');
// //       return;
// //     }

// //     try {
// //       const response = await fetch(
// //         `${API_BASE}/wishlist/user/${uid}/product/${parseInt(productId)}`,
// //         {
// //           method: 'DELETE',
// //         }
// //       );

// //       const result = await response.json();

// //       if (result.success) {
// //         setWishlist((prev) => prev.filter((id) => id !== productId));
// //         setWishlistProducts((prev) => prev.filter((p) => String(p.id) !== productId));
// //         toast.success('Removed from wishlist');
// //       } else {
// //         toast.error(result.message || 'Failed to remove from wishlist');
// //       }
// //     } catch (error) {
// //       console.error('Error removing from wishlist:', error);
// //       toast.error('Failed to remove from wishlist');
// //     }
// //   }, [currentUserId]);

// //   const clearWishlist = useCallback(async (userId: number) => {
// //     try {
// //       const response = await fetch(`${API_BASE}/wishlist/clear/${userId}`, {
// //         method: 'DELETE',
// //       });

// //       const result = await response.json();

// //       if (result.success) {
// //         setWishlist([]);
// //         setWishlistProducts([]);
// //         toast.success('Wishlist cleared');
// //       } else {
// //         toast.error(result.message || 'Failed to clear wishlist');
// //       }
// //     } catch (error) {
// //       console.error('Error clearing wishlist:', error);
// //       toast.error('Failed to clear wishlist');
// //     }
// //   }, []);

// //   const isInWishlist = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

// //  const addToCompare = useCallback(async (productId: string, userId?: number) => {
// //   const uid = userId || currentUserId;
  
// //   // If user is not logged in, store in localStorage only
// //   if (!uid) {
// //     setCompareList((prev) => {
// //       if (prev.includes(productId)) return prev;
// //       if (prev.length >= 4) {
// //         toast.warning('You can compare up to 4 products');
// //         return prev;
// //       }
// //       return [...prev, productId];
// //     });
// //     toast.success('Added to compare (login to sync)');
// //     return;
// //   }

// //   try {
// //     const response = await fetch(`${API_BASE}/compare`, {
// //       method: 'POST',
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //       body: JSON.stringify({
// //         user_id: uid,
// //         product_id: parseInt(productId),
// //       }),
// //     });

// //     const result = await response.json();

// //     if (result.success) {
// //       setCompareList((prev) => {
// //         if (prev.includes(productId)) return prev;
// //         if (prev.length >= 4) {
// //           toast.warning('You can compare up to 4 products');
// //           return prev;
// //         }
// //         return [...prev, productId];
// //       });
// //       toast.success(result.message || 'Added to compare');
// //     } else {
// //       toast.error(result.message || 'Failed to add to compare');
// //     }
// //   } catch (error) {
// //     console.error('Error adding to compare:', error);
// //     toast.error('Failed to add to compare');
// //   }
// // }, [currentUserId]);

// //   const removeFromCompare = useCallback(async (productId: string, userId?: number) => {
// //   const uid = userId || currentUserId;

// //   if (!uid) {
// //     setCompareList((prev) => prev.filter((id) => id !== productId));
// //     toast.success('Removed from compare');
// //     return;
// //   }

// //   try {
// //     const response = await fetch(
// //       `${API_BASE}/compare/${uid}/${parseInt(productId)}`,
// //       {
// //         method: 'DELETE',
// //       }
// //     );

// //     const result = await response.json();

// //     if (result.success) {
// //       setCompareList((prev) => prev.filter((id) => id !== productId));
// //       toast.success(result.message || 'Removed from compare');
// //     } else {
// //       toast.error(result.message || 'Failed to remove from compare');
// //     }
// //   } catch (error) {
// //     console.error('Error removing from compare:', error);
// //     toast.error('Failed to remove from compare');
// //   }
// // }, [currentUserId]);

// //   const isInCompare = useCallback((productId: string) => compareList.includes(productId), [compareList]);

// //   const clearCompare = useCallback(async (userId?: number) => {
// //   const uid = userId || currentUserId;

// //   if (!uid) {
// //     setCompareList([]);
// //     toast.success('Compare list cleared');
// //     return;
// //   }

// //   try {
// //     const response = await fetch(`${API_BASE}/compare/clear/${uid}`, {
// //       method: 'DELETE',
// //     });

// //     const result = await response.json();

// //     if (result.success) {
// //       setCompareList([]);
// //       toast.success(result.message || 'Compare list cleared');
// //     } else {
// //       toast.error(result.message || 'Failed to clear compare list');
// //     }
// //   } catch (error) {
// //     console.error('Error clearing compare:', error);
// //     toast.error('Failed to clear compare list');
// //   }
// // }, [currentUserId]);

// // // Add this function to sync compare from API when user logs in
// // const fetchCompareFromAPI = useCallback(async (userId: number) => {
// //   try {
// //     const response = await fetch(`${API_BASE}/compare/${userId}`);
// //     const result = await response.json();
    
// //     if (result.success) {
// //       const productIds = result.data.map((item: any) => String(item.product_id));
// //       setCompareList(productIds);
// //     }
// //   } catch (error) {
// //     console.error('Error fetching compare list:', error);
// //   }
// // }, []);

// //   const addLead = useCallback((lead: Omit<WishlistLead, 'id' | 'status' | 'assignedTo' | 'notes' | 'createdAt'>) => {
// //     const newLead: WishlistLead = {
// //       ...lead,
// //       id: `wl-${Date.now()}`,
// //       status: 'new',
// //       assignedTo: 'Unassigned',
// //       notes: '',
// //       createdAt: new Date().toISOString(),
// //     };
// //     setLeads((prev) => [newLead, ...prev]);
// //   }, []);

// //   const addInquiry = useCallback((inquiry: Omit<Inquiry, 'id' | 'status' | 'createdAt'>) => {
// //     const newInquiry: Inquiry = {
// //       ...inquiry,
// //       id: `iq-${Date.now()}`,
// //       status: 'new',
// //       createdAt: new Date().toISOString(),
// //     };
// //     setInquiries((prev) => [newInquiry, ...prev]);
// //   }, []);

// //   return (
// //     <AppContext.Provider
// //       value={{
// //         wishlist,
// //         wishlistProducts,
// //         compareList,
// //         leads,
// //         inquiries,
// //         loadingWishlist,
// //         addToWishlist,
// //         removeFromWishlist,
// //         isInWishlist,
// //         addToCompare,
// //         removeFromCompare,
// //         isInCompare,
// //         clearCompare,
// //         addLead,
// //         addInquiry,
// //         fetchWishlist,
// //         clearWishlist,
// //       }}
// //     >
// //       {children}
// //     </AppContext.Provider>
// //   );
// // }

// // export function useApp() {
// //   const ctx = useContext(AppContext);
// //   if (!ctx) throw new Error('useApp must be used within AppProvider');
// //   return ctx;
// // }



// import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
// import type { WishlistLead, Inquiry, Product } from '@/types';
// import { toast } from 'sonner';
// import { baseurl } from '@/Baseurl/baseurl';

// interface AppContextValue {
//   wishlist: string[];
//   wishlistProducts: Product[];
//   compareList: string[];
//   leads: WishlistLead[];
//   inquiries: Inquiry[];
//   loadingWishlist: boolean;
//   addToWishlist: (productId: string, userId?: number) => Promise<void>;
//   removeFromWishlist: (productId: string, userId?: number) => Promise<void>;
//   isInWishlist: (productId: string) => boolean;
//   addToCompare: (productId: string) => void;
//   removeFromCompare: (productId: string) => void;
//   isInCompare: (productId: string) => boolean;
//   clearCompare: () => void;
//   addLead: (lead: Omit<WishlistLead, 'id' | 'status' | 'assignedTo' | 'notes' | 'createdAt'>) => void;
//   addInquiry: (inquiry: Omit<Inquiry, 'id' | 'status' | 'createdAt'>) => void;
//   fetchWishlist: (userId: number) => Promise<void>;
//   clearWishlist: (userId: number) => Promise<void>;
// }

// const AppContext = createContext<AppContextValue | undefined>(undefined);

// const API_BASE = `${baseurl}/api`;

// export function AppProvider({ children }: { children: ReactNode }) {
//   const [wishlist, setWishlist] = useState<string[]>([]);
//   const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
//   const [compareList, setCompareList] = useState<string[]>([]);
//   const [leads, setLeads] = useState<WishlistLead[]>([]);
//   const [inquiries, setInquiries] = useState<Inquiry[]>([]);
//   const [loadingWishlist, setLoadingWishlist] = useState(false);
//   const [currentUserId, setCurrentUserId] = useState<number | null>(null);

//   // Load wishlist from localStorage on mount
//   useEffect(() => {
//     const savedWishlist = localStorage.getItem('wishlist');
//     if (savedWishlist) {
//       try {
//         setWishlist(JSON.parse(savedWishlist));
//       } catch (e) {
//         console.error('Error loading wishlist from localStorage:', e);
//       }
//     }

//     const savedCompare = localStorage.getItem('compareList');
//     if (savedCompare) {
//       try {
//         setCompareList(JSON.parse(savedCompare));
//       } catch (e) {
//         console.error('Error loading compareList from localStorage:', e);
//       }
//     }

//     // Load user session
//     const session = localStorage.getItem('userSession');
//     if (session) {
//       try {
//         const user = JSON.parse(session);
//         setCurrentUserId(user.userId);
//         // Fetch wishlist from API if user is logged in
//         if (user.userId) {
//           fetchWishlistFromAPI(user.userId);
//         }
//       } catch (e) {
//         console.error('Error loading user session:', e);
//       }
//     }
//   }, []);

//   // Save wishlist to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem('wishlist', JSON.stringify(wishlist));
//   }, [wishlist]);

//   // Save compareList to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem('compareList', JSON.stringify(compareList));
//   }, [compareList]);

//   // Update the useEffect to fetch compare list when user logs in
//   useEffect(() => {
//     const session = localStorage.getItem('userSession');
//     if (session) {
//       try {
//         const user = JSON.parse(session);
//         setCurrentUserId(user.userId);
//         if (user.userId) {
//           fetchWishlistFromAPI(user.userId);
//           fetchCompareFromAPI(user.userId);
//         }
//       } catch (e) {
//         console.error('Error loading user session:', e);
//       }
//     }
//   }, []);

//   const fetchWishlistFromAPI = useCallback(async (userId: number) => {
//     try {
//       setLoadingWishlist(true);
//       const response = await fetch(`${API_BASE}/wishlist/${userId}`);
//       const result = await response.json();
      
//       if (result.success) {
//         const productIds = result.data.map((item: any) => String(item.id));
//         setWishlist(productIds);
//         setWishlistProducts(result.data);
//       }
//     } catch (error) {
//       console.error('Error fetching wishlist:', error);
//     } finally {
//       setLoadingWishlist(false);
//     }
//   }, []);

//   const fetchWishlist = async (userId: number) => {
//     await fetchWishlistFromAPI(userId);
//   };

//   const addToWishlist = useCallback(async (productId: string, userId?: number) => {
//     const uid = userId || currentUserId;
    
//     // If user is not logged in, store in localStorage only
//     if (!uid) {
//       setWishlist((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
//       toast.success('Added to wishlist (login to sync)');
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE}/wishlist`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           user_id: uid,
//           product_id: parseInt(productId),
//         }),
//       });

//       const result = await response.json();

//       if (result.success) {
//         setWishlist((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
//         toast.success('Added to wishlist');
//         // Refresh wishlist
//         await fetchWishlistFromAPI(uid);
//       } else if (result.message === 'Product already exists in wishlist.') {
//         toast.info('Product already in wishlist');
//       } else {
//         toast.error(result.message || 'Failed to add to wishlist');
//       }
//     } catch (error) {
//       console.error('Error adding to wishlist:', error);
//       toast.error('Failed to add to wishlist');
//     }
//   }, [currentUserId, fetchWishlistFromAPI]);

//   const removeFromWishlist = useCallback(async (productId: string, userId?: number) => {
//     const uid = userId || currentUserId;

//     // If user is not logged in, remove from localStorage only
//     if (!uid) {
//       setWishlist((prev) => prev.filter((id) => id !== productId));
//       setWishlistProducts((prev) => prev.filter((p) => String(p.id) !== productId));
//       toast.success('Removed from wishlist');
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${API_BASE}/wishlist/user/${uid}/product/${parseInt(productId)}`,
//         {
//           method: 'DELETE',
//         }
//       );

//       const result = await response.json();

//       if (result.success) {
//         setWishlist((prev) => prev.filter((id) => id !== productId));
//         setWishlistProducts((prev) => prev.filter((p) => String(p.id) !== productId));
//         toast.success(result.message || 'Removed from wishlist');
//       } else {
//         // Only show error toast, don't update state
//         toast.error(result.message || 'Failed to remove from wishlist');
//         // Refresh wishlist to ensure consistency
//         if (uid) {
//           await fetchWishlistFromAPI(uid);
//         }
//       }
//     } catch (error) {
//       console.error('Error removing from wishlist:', error);
//       toast.error('Failed to remove from wishlist');
//       // Refresh wishlist to ensure consistency
//       if (uid) {
//         await fetchWishlistFromAPI(uid);
//       }
//     }
//   }, [currentUserId, fetchWishlistFromAPI]);

//   const clearWishlist = useCallback(async (userId: number) => {
//     try {
//       const response = await fetch(`${API_BASE}/wishlist/clear/${userId}`, {
//         method: 'DELETE',
//       });

//       const result = await response.json();

//       if (result.success) {
//         setWishlist([]);
//         setWishlistProducts([]);
//         toast.success('Wishlist cleared');
//       } else {
//         toast.error(result.message || 'Failed to clear wishlist');
//       }
//     } catch (error) {
//       console.error('Error clearing wishlist:', error);
//       toast.error('Failed to clear wishlist');
//     }
//   }, []);

//   const isInWishlist = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

//   const addToCompare = useCallback(async (productId: string, userId?: number) => {
//     const uid = userId || currentUserId;
    
//     // If user is not logged in, store in localStorage only
//     if (!uid) {
//       setCompareList((prev) => {
//         if (prev.includes(productId)) return prev;
//         if (prev.length >= 4) {
//           toast.warning('You can compare up to 4 products');
//           return prev;
//         }
//         return [...prev, productId];
//       });
//       toast.success('Added to compare (login to sync)');
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE}/compare`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           user_id: uid,
//           product_id: parseInt(productId),
//         }),
//       });

//       const result = await response.json();

//       if (result.success) {
//         setCompareList((prev) => {
//           if (prev.includes(productId)) return prev;
//           if (prev.length >= 4) {
//             toast.warning('You can compare up to 4 products');
//             return prev;
//           }
//           return [...prev, productId];
//         });
//         toast.success(result.message || 'Added to compare');
//       } else {
//         toast.error(result.message || 'Failed to add to compare');
//       }
//     } catch (error) {
//       console.error('Error adding to compare:', error);
//       toast.error('Failed to add to compare');
//     }
//   }, [currentUserId]);

//   const removeFromCompare = useCallback(async (productId: string, userId?: number) => {
//     const uid = userId || currentUserId;

//     if (!uid) {
//       setCompareList((prev) => prev.filter((id) => id !== productId));
//       toast.success('Removed from compare');
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${API_BASE}/compare/${uid}/${parseInt(productId)}`,
//         {
//           method: 'DELETE',
//         }
//       );

//       const result = await response.json();

//       if (result.success) {
//         setCompareList((prev) => prev.filter((id) => id !== productId));
//         toast.success(result.message || 'Removed from compare');
//       } else {
//         toast.error(result.message || 'Failed to remove from compare');
//         // Refresh compare list to ensure consistency
//         if (uid) {
//           await fetchCompareFromAPI(uid);
//         }
//       }
//     } catch (error) {
//       console.error('Error removing from compare:', error);
//       toast.error('Failed to remove from compare');
//       // Refresh compare list to ensure consistency
//       if (uid) {
//         await fetchCompareFromAPI(uid);
//       }
//     }
//   }, [currentUserId]);

//   const isInCompare = useCallback((productId: string) => compareList.includes(productId), [compareList]);

//   const clearCompare = useCallback(async (userId?: number) => {
//     const uid = userId || currentUserId;

//     if (!uid) {
//       setCompareList([]);
//       toast.success('Compare list cleared');
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE}/compare/clear/${uid}`, {
//         method: 'DELETE',
//       });

//       const result = await response.json();

//       if (result.success) {
//         setCompareList([]);
//         toast.success(result.message || 'Compare list cleared');
//       } else {
//         toast.error(result.message || 'Failed to clear compare list');
//       }
//     } catch (error) {
//       console.error('Error clearing compare:', error);
//       toast.error('Failed to clear compare list');
//     }
//   }, [currentUserId]);

//   // Add this function to sync compare from API when user logs in
//   const fetchCompareFromAPI = useCallback(async (userId: number) => {
//     try {
//       const response = await fetch(`${API_BASE}/compare/${userId}`);
//       const result = await response.json();
      
//       if (result.success) {
//         const productIds = result.data.map((item: any) => String(item.product_id));
//         setCompareList(productIds);
//       }
//     } catch (error) {
//       console.error('Error fetching compare list:', error);
//     }
//   }, []);

//   const addLead = useCallback((lead: Omit<WishlistLead, 'id' | 'status' | 'assignedTo' | 'notes' | 'createdAt'>) => {
//     const newLead: WishlistLead = {
//       ...lead,
//       id: `wl-${Date.now()}`,
//       status: 'new',
//       assignedTo: 'Unassigned',
//       notes: '',
//       createdAt: new Date().toISOString(),
//     };
//     setLeads((prev) => [newLead, ...prev]);
//   }, []);

//   const addInquiry = useCallback((inquiry: Omit<Inquiry, 'id' | 'status' | 'createdAt'>) => {
//     const newInquiry: Inquiry = {
//       ...inquiry,
//       id: `iq-${Date.now()}`,
//       status: 'new',
//       createdAt: new Date().toISOString(),
//     };
//     setInquiries((prev) => [newInquiry, ...prev]);
//   }, []);

//   return (
//     <AppContext.Provider
//       value={{
//         wishlist,
//         wishlistProducts,
//         compareList,
//         leads,
//         inquiries,
//         loadingWishlist,
//         addToWishlist,
//         removeFromWishlist,
//         isInWishlist,
//         addToCompare,
//         removeFromCompare,
//         isInCompare,
//         clearCompare,
//         addLead,
//         addInquiry,
//         fetchWishlist,
//         clearWishlist,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// }

// export function useApp() {
//   const ctx = useContext(AppContext);
//   if (!ctx) throw new Error('useApp must be used within AppProvider');
//   return ctx;
// }



// import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
// import type { WishlistLead, Inquiry, Product } from '@/types';
// import { toast } from 'sonner';
// import { baseurl } from '@/Baseurl/baseurl';

// interface AppContextValue {
//   wishlist: string[];
//   wishlistProducts: Product[];
//   compareList: string[];
//   leads: WishlistLead[];
//   inquiries: Inquiry[];
//   loadingWishlist: boolean;
//   addToWishlist: (productId: string, userId?: number) => Promise<void>;
//   removeFromWishlist: (productId: string, userId?: number) => Promise<void>;
//   isInWishlist: (productId: string) => boolean;
//   addToCompare: (productId: string) => void;
//   removeFromCompare: (productId: string) => void;
//   isInCompare: (productId: string) => boolean;
//   clearCompare: () => void;
//   addLead: (lead: Omit<WishlistLead, 'id' | 'status' | 'assignedTo' | 'notes' | 'createdAt'>) => void;
//   addInquiry: (inquiry: Omit<Inquiry, 'id' | 'status' | 'createdAt'>) => void;
//   fetchWishlist: (userId: number) => Promise<void>;
//   clearWishlist: (userId: number) => Promise<void>;
// }

// const AppContext = createContext<AppContextValue | undefined>(undefined);

// const API_BASE = `${baseurl}/api`;

// export function AppProvider({ children }: { children: ReactNode }) {
//   const [wishlist, setWishlist] = useState<string[]>([]);
//   const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
//   const [compareList, setCompareList] = useState<string[]>([]);
//   const [leads, setLeads] = useState<WishlistLead[]>([]);
//   const [inquiries, setInquiries] = useState<Inquiry[]>([]);
//   const [loadingWishlist, setLoadingWishlist] = useState(false);
//   const [currentUserId, setCurrentUserId] = useState<number | null>(null);

//   // Load wishlist from localStorage on mount
//   useEffect(() => {
//     const savedWishlist = localStorage.getItem('wishlist');
//     if (savedWishlist) {
//       try {
//         setWishlist(JSON.parse(savedWishlist));
//       } catch (e) {
//         console.error('Error loading wishlist from localStorage:', e);
//       }
//     }

//     const savedCompare = localStorage.getItem('compareList');
//     if (savedCompare) {
//       try {
//         setCompareList(JSON.parse(savedCompare));
//       } catch (e) {
//         console.error('Error loading compareList from localStorage:', e);
//       }
//     }

//     // Load user session
//     const session = localStorage.getItem('userSession');
//     if (session) {
//       try {
//         const user = JSON.parse(session);
//         setCurrentUserId(user.userId);
//         // Fetch wishlist from API if user is logged in
//         if (user.userId) {
//           fetchWishlistFromAPI(user.userId);
//         }
//       } catch (e) {
//         console.error('Error loading user session:', e);
//       }
//     }
//   }, []);

//   // Save wishlist to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem('wishlist', JSON.stringify(wishlist));
//   }, [wishlist]);

//   // Save compareList to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem('compareList', JSON.stringify(compareList));
//   }, [compareList]);

//   // Update the useEffect to fetch compare list when user logs in
//   useEffect(() => {
//     const session = localStorage.getItem('userSession');
//     if (session) {
//       try {
//         const user = JSON.parse(session);
//         setCurrentUserId(user.userId);
//         if (user.userId) {
//           fetchWishlistFromAPI(user.userId);
//           fetchCompareFromAPI(user.userId);
//         }
//       } catch (e) {
//         console.error('Error loading user session:', e);
//       }
//     }
//   }, []);

//   const fetchWishlistFromAPI = useCallback(async (userId: number) => {
//     try {
//       setLoadingWishlist(true);
//       const response = await fetch(`${API_BASE}/wishlist/${userId}`);
//       const result = await response.json();
      
//       if (result.success) {
//         const productIds = result.data.map((item: any) => String(item.id));
//         setWishlist(productIds);
//         setWishlistProducts(result.data);
//       }
//     } catch (error) {
//       console.error('Error fetching wishlist:', error);
//     } finally {
//       setLoadingWishlist(false);
//     }
//   }, []);

//   const fetchWishlist = async (userId: number) => {
//     await fetchWishlistFromAPI(userId);
//   };

//   const addToWishlist = useCallback(async (productId: string, userId?: number) => {
//     const uid = userId || currentUserId;
    
//     // If user is not logged in, store in localStorage only
//     if (!uid) {
//       setWishlist((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
//       toast.success('Added to wishlist (login to sync)');
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE}/wishlist`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           user_id: uid,
//           product_id: parseInt(productId),
//         }),
//       });

//       const result = await response.json();

//       if (result.success) {
//         setWishlist((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
//         toast.success('Added to wishlist');
//         // Refresh wishlist
//         await fetchWishlistFromAPI(uid);
//       } else if (result.message === 'Product already exists in wishlist.') {
//         toast.info('Product already in wishlist');
//       } else {
//         toast.error(result.message || 'Failed to add to wishlist');
//       }
//     } catch (error) {
//       console.error('Error adding to wishlist:', error);
//       toast.error('Failed to add to wishlist');
//     }
//   }, [currentUserId]);

//   const removeFromWishlist = useCallback(async (productId: string, userId?: number) => {
//     const uid = userId || currentUserId;

//     // If user is not logged in, remove from localStorage only
//     if (!uid) {
//       setWishlist((prev) => prev.filter((id) => id !== productId));
//       toast.success('Removed from wishlist', {
//         duration: 2000,
//         style: {
//           background: '#10B981',
//           color: 'white',
//           border: 'none',
//         },
//       });
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${API_BASE}/wishlist/user/${uid}/product/${parseInt(productId)}`,
//         {
//           method: 'DELETE',
//         }
//       );

//       const result = await response.json();

//       if (result.success) {
//         setWishlist((prev) => prev.filter((id) => id !== productId));
//         setWishlistProducts((prev) => prev.filter((p) => String(p.id) !== productId));
//         toast.success('Removed from wishlist', {
//           duration: 2000,
//           style: {
//             background: '#10B981',
//             color: 'white',
//             border: 'none',
//           },
//         });
//       } else {
//         toast.error(result.message || 'Failed to remove from wishlist');
//       }
//     } catch (error) {
//       console.error('Error removing from wishlist:', error);
//       toast.error('Failed to remove from wishlist');
//     }
//   }, [currentUserId]);

//   const clearWishlist = useCallback(async (userId: number) => {
//     try {
//       const response = await fetch(`${API_BASE}/wishlist/clear/${userId}`, {
//         method: 'DELETE',
//       });

//       const result = await response.json();

//       if (result.success) {
//         setWishlist([]);
//         setWishlistProducts([]);
//         toast.success('Wishlist cleared');
//       } else {
//         toast.error(result.message || 'Failed to clear wishlist');
//       }
//     } catch (error) {
//       console.error('Error clearing wishlist:', error);
//       toast.error('Failed to clear wishlist');
//     }
//   }, []);

//   const isInWishlist = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

//   const addToCompare = useCallback(async (productId: string, userId?: number) => {
//     const uid = userId || currentUserId;
    
//     // If user is not logged in, store in localStorage only
//     if (!uid) {
//       setCompareList((prev) => {
//         if (prev.includes(productId)) return prev;
//         if (prev.length >= 4) {
//           toast.warning('You can compare up to 4 products');
//           return prev;
//         }
//         return [...prev, productId];
//       });
//       toast.success('Added to compare (login to sync)');
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE}/compare`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           user_id: uid,
//           product_id: parseInt(productId),
//         }),
//       });

//       const result = await response.json();

//       if (result.success) {
//         setCompareList((prev) => {
//           if (prev.includes(productId)) return prev;
//           if (prev.length >= 4) {
//             toast.warning('You can compare up to 4 products');
//             return prev;
//           }
//           return [...prev, productId];
//         });
//         toast.success(result.message || 'Added to compare');
//       } else {
//         toast.error(result.message || 'Failed to add to compare');
//       }
//     } catch (error) {
//       console.error('Error adding to compare:', error);
//       toast.error('Failed to add to compare');
//     }
//   }, [currentUserId]);

//   const removeFromCompare = useCallback(async (productId: string, userId?: number) => {
//     const uid = userId || currentUserId;

//     if (!uid) {
//       setCompareList((prev) => prev.filter((id) => id !== productId));
//       toast.success('Removed from compare');
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${API_BASE}/compare/${uid}/${parseInt(productId)}`,
//         {
//           method: 'DELETE',
//         }
//       );

//       const result = await response.json();

//       if (result.success) {
//         setCompareList((prev) => prev.filter((id) => id !== productId));
//         toast.success(result.message || 'Removed from compare');
//       } else {
//         toast.error(result.message || 'Failed to remove from compare');
//       }
//     } catch (error) {
//       console.error('Error removing from compare:', error);
//       toast.error('Failed to remove from compare');
//     }
//   }, [currentUserId]);

//   const isInCompare = useCallback((productId: string) => compareList.includes(productId), [compareList]);

//   const clearCompare = useCallback(async (userId?: number) => {
//     const uid = userId || currentUserId;

//     if (!uid) {
//       setCompareList([]);
//       toast.success('Compare list cleared');
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE}/compare/clear/${uid}`, {
//         method: 'DELETE',
//       });

//       const result = await response.json();

//       if (result.success) {
//         setCompareList([]);
//         toast.success(result.message || 'Compare list cleared');
//       } else {
//         toast.error(result.message || 'Failed to clear compare list');
//       }
//     } catch (error) {
//       console.error('Error clearing compare:', error);
//       toast.error('Failed to clear compare list');
//     }
//   }, [currentUserId]);

//   // Add this function to sync compare from API when user logs in
//   const fetchCompareFromAPI = useCallback(async (userId: number) => {
//     try {
//       const response = await fetch(`${API_BASE}/compare/${userId}`);
//       const result = await response.json();
      
//       if (result.success) {
//         const productIds = result.data.map((item: any) => String(item.product_id));
//         setCompareList(productIds);
//       }
//     } catch (error) {
//       console.error('Error fetching compare list:', error);
//     }
//   }, []);

//   const addLead = useCallback((lead: Omit<WishlistLead, 'id' | 'status' | 'assignedTo' | 'notes' | 'createdAt'>) => {
//     const newLead: WishlistLead = {
//       ...lead,
//       id: `wl-${Date.now()}`,
//       status: 'new',
//       assignedTo: 'Unassigned',
//       notes: '',
//       createdAt: new Date().toISOString(),
//     };
//     setLeads((prev) => [newLead, ...prev]);
//   }, []);

//   const addInquiry = useCallback((inquiry: Omit<Inquiry, 'id' | 'status' | 'createdAt'>) => {
//     const newInquiry: Inquiry = {
//       ...inquiry,
//       id: `iq-${Date.now()}`,
//       status: 'new',
//       createdAt: new Date().toISOString(),
//     };
//     setInquiries((prev) => [newInquiry, ...prev]);
//   }, []);

//   return (
//     <AppContext.Provider
//       value={{
//         wishlist,
//         wishlistProducts,
//         compareList,
//         leads,
//         inquiries,
//         loadingWishlist,
//         addToWishlist,
//         removeFromWishlist,
//         isInWishlist,
//         addToCompare,
//         removeFromCompare,
//         isInCompare,
//         clearCompare,
//         addLead,
//         addInquiry,
//         fetchWishlist,
//         clearWishlist,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// }

// export function useApp() {
//   const ctx = useContext(AppContext);
//   if (!ctx) throw new Error('useApp must be used within AppProvider');
//   return ctx;
// }



import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { WishlistLead, Inquiry, Product } from '@/types';
import { toast } from 'sonner';
import { baseurl } from '@/Baseurl/baseurl';

interface AppContextValue {
  wishlist: string[];
  wishlistProducts: Product[];
  compareList: string[];
  leads: WishlistLead[];
  inquiries: Inquiry[];
  loadingWishlist: boolean;
  addToWishlist: (productId: string, userId?: number) => Promise<void>;
  removeFromWishlist: (productId: string, userId?: number) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  addToCompare: (productId: string, userId?: number) => Promise<void>;
  removeFromCompare: (productId: string, userId?: number) => Promise<void>;
  isInCompare: (productId: string) => boolean;
  clearCompare: (userId?: number) => Promise<void>;
  addLead: (lead: Omit<WishlistLead, 'id' | 'status' | 'assignedTo' | 'notes' | 'createdAt'>) => void;
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'status' | 'createdAt'>) => void;
  fetchWishlist: (userId: number) => Promise<void>;
  clearWishlist: (userId: number) => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const API_BASE = `${baseurl}/api`;

export function AppProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [leads, setLeads] = useState<WishlistLead[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('Error loading wishlist from localStorage:', e);
      }
    }

    const savedCompare = localStorage.getItem('compareList');
    if (savedCompare) {
      try {
        setCompareList(JSON.parse(savedCompare));
      } catch (e) {
        console.error('Error loading compareList from localStorage:', e);
      }
    }

    // Load user session
    const session = localStorage.getItem('userSession');
    if (session) {
      try {
        const user = JSON.parse(session);
        setCurrentUserId(user.userId);
        // Fetch wishlist from API if user is logged in
        if (user.userId) {
          fetchWishlistFromAPI(user.userId);
        }
      } catch (e) {
        console.error('Error loading user session:', e);
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Save compareList to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }, [compareList]);

  // Update the useEffect to fetch compare list when user logs in
  useEffect(() => {
    const session = localStorage.getItem('userSession');
    if (session) {
      try {
        const user = JSON.parse(session);
        setCurrentUserId(user.userId);
        if (user.userId) {
          fetchWishlistFromAPI(user.userId);
          fetchCompareFromAPI(user.userId);
        }
      } catch (e) {
        console.error('Error loading user session:', e);
      }
    }
  }, []);

  const fetchWishlistFromAPI = useCallback(async (userId: number) => {
    try {
      setLoadingWishlist(true);
      const response = await fetch(`${API_BASE}/wishlist/${userId}`);
      const result = await response.json();
      
      if (result.success) {
        const productIds = result.data.map((item: any) => String(item.id));
        setWishlist(productIds);
        setWishlistProducts(result.data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoadingWishlist(false);
    }
  }, []);

  const fetchWishlist = async (userId: number) => {
    await fetchWishlistFromAPI(userId);
  };

  const addToWishlist = useCallback(async (productId: string, userId?: number) => {
    const uid = userId || currentUserId;
    
    // If user is not logged in, store in localStorage only
    if (!uid) {
      setWishlist((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
      toast.success('Added to wishlist (login to sync)', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          marginTop: '70px', // This pushes it down below the header
        },
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: uid,
          product_id: parseInt(productId),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setWishlist((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
        toast.success('Added to wishlist', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#10B981',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            marginTop: '70px',
          },
        });
        // Refresh wishlist
        await fetchWishlistFromAPI(uid);
      } else if (result.message === 'Product already exists in wishlist.') {
        toast.info('Product already in wishlist', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#3B82F6',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            marginTop: '70px',
          },
        });
      } else {
        toast.error(result.message || 'Failed to add to wishlist', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            marginTop: '70px',
          },
        });
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          marginTop: '70px',
        },
      });
    }
  }, [currentUserId, fetchWishlistFromAPI]);

  const removeFromWishlist = useCallback(async (productId: string, userId?: number) => {
    const uid = userId || currentUserId;

    // If user is not logged in, remove from localStorage only
    if (!uid) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      toast.success('Removed from wishlist', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          marginTop: '70px',
        },
      });
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/wishlist/user/${uid}/product/${parseInt(productId)}`,
        {
          method: 'DELETE',
        }
      );

      const result = await response.json();

      if (result.success) {
        setWishlist((prev) => prev.filter((id) => id !== productId));
        setWishlistProducts((prev) => prev.filter((p) => String(p.id) !== productId));
        toast.success('Removed from wishlist', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            marginTop: '70px',
          },
        });
      } else {
        toast.error(result.message || 'Failed to remove from wishlist', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            marginTop: '70px',
          },
        });
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          marginTop: '70px',
        },
      });
    }
  }, [currentUserId]);

  const clearWishlist = useCallback(async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE}/wishlist/clear/${userId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setWishlist([]);
        setWishlistProducts([]);
        toast.success('Wishlist cleared', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#10B981',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            marginTop: '70px',
          },
        });
      } else {
        toast.error(result.message || 'Failed to clear wishlist', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            marginTop: '70px',
          },
        });
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          marginTop: '70px',
        },
      });
    }
  }, []);

  const isInWishlist = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const addToCompare = useCallback(async (productId: string, userId?: number) => {
    const uid = userId || currentUserId;
    
    // If user is not logged in, store in localStorage only
    if (!uid) {
      setCompareList((prev) => {
        if (prev.includes(productId)) return prev;
        if (prev.length >= 4) {
          toast.warning('You can compare up to 4 products', {
            duration: 3000,
            position: 'top-right',
            style: {
              background: '#F59E0B',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              marginTop: '70px',
            },
          });
          return prev;
        }
        return [...prev, productId];
      });
      toast.success('Added to compare (login to sync)', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          marginTop: '70px',
        },
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/compare`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: uid,
          product_id: parseInt(productId),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setCompareList((prev) => {
          if (prev.includes(productId)) return prev;
          if (prev.length >= 4) {
            toast.warning('You can compare up to 4 products', {
              duration: 3000,
              position: 'top-right',
              style: {
                background: '#F59E0B',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                marginTop: '70px',
              },
            });
            return prev;
          }
          return [...prev, productId];
        });
        toast.success(result.message || 'Added to compare', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#10B981',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            marginTop: '70px',
          },
        });
      } else {
        toast.error(result.message || 'Failed to add to compare', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            marginTop: '70px',
          },
        });
      }
    } catch (error) {
      console.error('Error adding to compare:', error);
      toast.error('Failed to add to compare', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          marginTop: '70px',
        },
      });
    }
  }, [currentUserId]);

  const removeFromCompare = useCallback(async (productId: string, userId?: number) => {
    const uid = userId || currentUserId;

    if (!uid) {
      setCompareList((prev) => prev.filter((id) => id !== productId));
      toast.success('Removed from compare', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          marginTop: '70px',
        },
      });
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/compare/${uid}/${parseInt(productId)}`,
        {
          method: 'DELETE',
        }
      );

      const result = await response.json();

      if (result.success) {
        setCompareList((prev) => prev.filter((id) => id !== productId));
        toast.success(result.message || 'Removed from compare', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            marginTop: '70px',
          },
        });
      } else {
        toast.error(result.message || 'Failed to remove from compare', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            marginTop: '70px',
          },
        });
      }
    } catch (error) {
      console.error('Error removing from compare:', error);
      toast.error('Failed to remove from compare', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          marginTop: '70px',
        },
      });
    }
  }, [currentUserId]);

  const isInCompare = useCallback((productId: string) => compareList.includes(productId), [compareList]);

  const clearCompare = useCallback(async (userId?: number) => {
    const uid = userId || currentUserId;

    if (!uid) {
      setCompareList([]);
      toast.success('Compare list cleared', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          marginTop: '70px',
        },
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/compare/clear/${uid}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setCompareList([]);
        toast.success(result.message || 'Compare list cleared', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#10B981',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            marginTop: '70px',
          },
        });
      } else {
        toast.error(result.message || 'Failed to clear compare list', {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            marginTop: '70px',
          },
        });
      }
    } catch (error) {
      console.error('Error clearing compare:', error);
      toast.error('Failed to clear compare list', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          marginTop: '70px',
        },
      });
    }
  }, [currentUserId]);

  // Add this function to sync compare from API when user logs in
  const fetchCompareFromAPI = useCallback(async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE}/compare/${userId}`);
      const result = await response.json();
      
      if (result.success) {
        const productIds = result.data.map((item: any) => String(item.product_id));
        setCompareList(productIds);
      }
    } catch (error) {
      console.error('Error fetching compare list:', error);
    }
  }, []);

  const addLead = useCallback((lead: Omit<WishlistLead, 'id' | 'status' | 'assignedTo' | 'notes' | 'createdAt'>) => {
    const newLead: WishlistLead = {
      ...lead,
      id: `wl-${Date.now()}`,
      status: 'new',
      assignedTo: 'Unassigned',
      notes: '',
      createdAt: new Date().toISOString(),
    };
    setLeads((prev) => [newLead, ...prev]);
  }, []);

  const addInquiry = useCallback((inquiry: Omit<Inquiry, 'id' | 'status' | 'createdAt'>) => {
    const newInquiry: Inquiry = {
      ...inquiry,
      id: `iq-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    setInquiries((prev) => [newInquiry, ...prev]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        wishlist,
        wishlistProducts,
        compareList,
        leads,
        inquiries,
        loadingWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        addLead,
        addInquiry,
        fetchWishlist,
        clearWishlist,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}