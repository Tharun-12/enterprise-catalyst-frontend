import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { WishlistLead, Inquiry, Product } from '@/types';
import { toast } from 'sonner';

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
  addToCompare: (productId: string) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
  addLead: (lead: Omit<WishlistLead, 'id' | 'status' | 'assignedTo' | 'notes' | 'createdAt'>) => void;
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'status' | 'createdAt'>) => void;
  fetchWishlist: (userId: number) => Promise<void>;
  clearWishlist: (userId: number) => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const API_BASE = 'http://localhost:5000/api';

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

  // Listen for auth changes
  useEffect(() => {
    const handleAuthChange = () => {
      const session = localStorage.getItem('userSession');
      if (session) {
        try {
          const user = JSON.parse(session);
          setCurrentUserId(user.userId);
          if (user.userId) {
            fetchWishlistFromAPI(user.userId);
          }
        } catch (e) {
          console.error('Error handling auth change:', e);
        }
      } else {
        setCurrentUserId(null);
        setWishlist([]);
        setWishlistProducts([]);
      }
    };

    window.addEventListener('authChange', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
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
      toast.success('Added to wishlist (login to sync)');
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
        toast.success('Added to wishlist');
        // Refresh wishlist
        await fetchWishlistFromAPI(uid);
      } else if (result.message === 'Product already exists in wishlist.') {
        toast.info('Product already in wishlist');
      } else {
        toast.error(result.message || 'Failed to add to wishlist');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add to wishlist');
    }
  }, [currentUserId]);

  const removeFromWishlist = useCallback(async (productId: string, userId?: number) => {
    const uid = userId || currentUserId;

    // If user is not logged in, remove from localStorage only
    if (!uid) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      toast.success('Removed from wishlist');
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
        toast.success('Removed from wishlist');
      } else {
        toast.error(result.message || 'Failed to remove from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
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
        toast.success('Wishlist cleared');
      } else {
        toast.error(result.message || 'Failed to clear wishlist');
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
    }
  }, []);

  const isInWishlist = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const addToCompare = useCallback((productId: string) => {
    setCompareList((prev) => {
      if (prev.includes(productId)) return prev;
      if (prev.length >= 4) {
        toast.warning('You can compare up to 4 products');
        return prev;
      }
      toast.success('Added to compare');
      return [...prev, productId];
    });
  }, []);

  const removeFromCompare = useCallback((productId: string) => {
    setCompareList((prev) => prev.filter((id) => id !== productId));
    toast.success('Removed from compare');
  }, []);

  const isInCompare = useCallback((productId: string) => compareList.includes(productId), [compareList]);

  const clearCompare = useCallback(() => setCompareList([]), []);

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