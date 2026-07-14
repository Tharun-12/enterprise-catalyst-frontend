import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { WishlistLead, Inquiry } from '@/types';

interface AppContextValue {
  wishlist: string[];
  compareList: string[];
  leads: WishlistLead[];
  inquiries: Inquiry[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  addToCompare: (productId: string) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
  addLead: (lead: Omit<WishlistLead, 'id' | 'status' | 'assignedTo' | 'notes' | 'createdAt'>) => void;
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'status' | 'createdAt'>) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [leads, setLeads] = useState<WishlistLead[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  const addToWishlist = useCallback((productId: string) => {
    setWishlist((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist((prev) => prev.filter((id) => id !== productId));
  }, []);

  const isInWishlist = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const addToCompare = useCallback((productId: string) => {
    setCompareList((prev) => {
      if (prev.includes(productId)) return prev;
      if (prev.length >= 4) return prev;
      return [...prev, productId];
    });
  }, []);

  const removeFromCompare = useCallback((productId: string) => {
    setCompareList((prev) => prev.filter((id) => id !== productId));
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
        compareList,
        leads,
        inquiries,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        addLead,
        addInquiry,
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
