// src/components/admin/AdminLeads.tsx (renamed from .jsx)
import { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { Search, Phone, Mail, Building, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useApp } from '@/hooks/use-app';
import type { WishlistLead, LeadStatus } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { baseurl } from '@/Baseurl/baseurl';

// Logo gradient (pink -> orange -> yellow)
const brandGradient =
  'bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 text-white shadow-md hover:shadow-lg hover:opacity-95 transition-all duration-300';

// Badge colors now follow the logo palette instead of blue
const statusColors: Record<LeadStatus, string> = {
  new: 'bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 text-white border-transparent',
  contacted: 'bg-orange-100 text-orange-700 border border-orange-200',
  qualified: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  closed: 'bg-gray-100 text-gray-700 border border-gray-200',
};

// Solid dot colors for the stat cards
const statusDots: Record<LeadStatus, string> = {
  new: 'bg-pink-500',
  contacted: 'bg-orange-500',
  qualified: 'bg-yellow-500',
  closed: 'bg-gray-400',
};

interface WishlistWithUser {
  wishlist_id: number;
  user_id: number;
  wishlist_created_at: string;
  product_id: number;
  product_name: string;
  product_code: string;
  product_brand: string;
  product_details_pdf: string;
  price: string;
  dimensions: string;
  specifications: string;
  weight: string;
  discount: string;
  product_description: string;
  warranty: string;
  product_created_at: string;
  product_updated_at: string;
  category_name: string;
  variants: any[];
}

interface User {
  id: number;
  name: string;
  mobile: string;
  email: string;
  created_at: string;
}

interface GroupedWishlistData {
  user: User;
  wishlist_items: WishlistWithUser[];
}

// API Response type
interface ApiResponse {
  success: boolean;
  data: GroupedWishlistData[];
  message?: string;
}

export function AdminLeads() {
  const { leads: contextLeads } = useApp();
  const [leads, setLeads] = useState<WishlistLead[]>([]);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<WishlistLead | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [wishlistData, setWishlistData] = useState<GroupedWishlistData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Fetch wishlist data with user details
  useEffect(() => {
    fetchWishlistData();
  }, []);

  const fetchWishlistData = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>(`${baseurl}/api/wishlist/all-with-users`);
      
      if (response.data.success) {
        setWishlistData(response.data.data);
        
        // Transform data to WishlistLead format
        const transformedLeads: WishlistLead[] = [];
        response.data.data.forEach((group: GroupedWishlistData) => {
          group.wishlist_items.forEach((item) => {
            transformedLeads.push({
              id: item.wishlist_id.toString(),
              name: group.user.name,
              email: group.user.email,
              phone: group.user.mobile,
              company: item.product_brand || 'N/A',
              city: '', // Remove location
              productId: item.product_id.toString(), // Add the missing productId
              productName: item.product_name,
              assignedTo: 'Unassigned',
              status: 'new' as LeadStatus,
              createdAt: item.wishlist_created_at,
              remarks: `Interested in ${item.product_name}`,
              notes: '',
            });
          });
        });
        
        setLeads([...contextLeads, ...transformedLeads]);
      }
    } catch (error) {
      console.error('Error fetching wishlist data:', error);
      toast.error('Failed to load wishlist data');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo((): WishlistLead[] => {
    let result = [...leads];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((l) => 
        l.name.toLowerCase().includes(q) || 
        l.email.toLowerCase().includes(q) || 
        l.company.toLowerCase().includes(q) || 
        l.productName.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter((l) => l.status === statusFilter);
    }
    return result;
  }, [leads, search, statusFilter]);

  const handleViewLead = (lead: WishlistLead): void => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading wishlist data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Wishlist Leads</h2>
          <p className="text-sm text-muted-foreground">
            Manage customer leads from wishlist submissions 
            {wishlistData.length > 0 && ` (${wishlistData.length} users, ${leads.length} items)`}
          </p>
        </div>
        <Button 
          size="sm" 
          onClick={fetchWishlistData}
          disabled={loading}
          className={brandGradient}
        >
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(['new', 'contacted', 'qualified', 'closed'] as LeadStatus[]).map((status) => {
          const count = leads.filter((l) => l.status === status).length;
          return (
            <Card key={status} className="p-4 border-orange-100 hover:border-orange-300 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-xs text-muted-foreground capitalize">{status}</div>
                </div>
                <div className={cn('w-3 h-3 rounded-full', statusDots[status])} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search leads..." 
            className="pl-9 h-9 focus-visible:ring-orange-400 focus-visible:border-orange-400" 
            value={search} 
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} 
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] h-9 focus:ring-orange-400">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-pink-50 via-orange-50 to-yellow-50 border-b border-orange-100">
              <tr>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Product</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="p-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No leads found
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <tr 
                    key={lead.id} 
                    className="border-b hover:bg-orange-50/50 transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9">
                          <AvatarFallback className="bg-gradient-to-br from-pink-500 via-orange-500 to-yellow-500 text-white text-xs font-semibold">
                            {lead.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="font-medium text-sm truncate">{lead.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{lead.company}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      <div className="text-sm truncate max-w-[200px]">{lead.productName}</div>
                    </td>
                    <td className="p-3">
                      <Badge className={cn('text-xs hover:opacity-90', statusColors[lead.status])}>
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="p-3 hidden lg:table-cell text-sm text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-3 text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-orange-600 hover:text-white hover:bg-gradient-to-r hover:from-pink-500 hover:via-orange-500 hover:to-yellow-500 transition-all duration-300"
                        onClick={() => handleViewLead(lead)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Lead Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-0 gap-0 border-orange-100">
          {selectedLead && (
            <>
              {/* Brand strip */}
              <div className="h-1.5 w-full bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500" />

              <DialogHeader className="px-6 pt-5 pb-4 bg-gradient-to-r from-pink-50 via-orange-50 to-yellow-50 border-b border-orange-100">
                <DialogTitle>Lead Details</DialogTitle>
                <DialogDescription>
                  Customer information and lead management
                </DialogDescription>
              </DialogHeader>
              
              <div className="px-6 py-6 space-y-5">
                <div className="flex items-center gap-3">
                  <Avatar className="w-14 h-14 ring-2 ring-orange-200 ring-offset-2">
                    <AvatarFallback className="bg-gradient-to-br from-pink-500 via-orange-500 to-yellow-500 text-white font-semibold">
                      {selectedLead.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedLead.name}</h3>
                    <Badge className={cn('text-xs mt-1 hover:opacity-90', statusColors[selectedLead.status])}>
                      {selectedLead.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-50">
                      <Phone className="w-4 h-4 text-pink-500" />
                    </span>
                    {selectedLead.phone}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50">
                      <Mail className="w-4 h-4 text-orange-500" />
                    </span>
                    {selectedLead.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-50">
                      <Building className="w-4 h-4 text-yellow-600" />
                    </span>
                    {selectedLead.company}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-orange-50/60 border-l-4 border-orange-500">
                  <div className="text-xs text-muted-foreground mb-1">Product Interest</div>
                  <div className="font-medium text-sm">{selectedLead.productName}</div>
                </div>

                {selectedLead.remarks && (
                  <div className="p-4 rounded-lg bg-pink-50/60 border-l-4 border-pink-500">
                    <div className="text-xs text-muted-foreground mb-1">Remarks</div>
                    <div className="text-sm">{selectedLead.remarks}</div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-orange-100">
                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(selectedLead.createdAt).toLocaleString('en-IN')}
                  </div>
                  <Button
                    size="sm"
                    className={brandGradient}
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}