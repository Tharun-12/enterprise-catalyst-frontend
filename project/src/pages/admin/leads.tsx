import { useState, useEffect, useMemo } from 'react';
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

const statusColors: Record<LeadStatus, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  qualified: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700',
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

export function AdminLeads() {
  const { leads: contextLeads } = useApp();
  const [leads, setLeads] = useState<WishlistLead[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<WishlistLead | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlistData, setWishlistData] = useState<GroupedWishlistData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch wishlist data with user details
  useEffect(() => {
    fetchWishlistData();
  }, []);

  const fetchWishlistData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/wishlist/all-with-users');
      
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

  const filtered = useMemo(() => {
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

  const updateStatus = (lead: WishlistLead, status: LeadStatus) => {
    setLeads((prev) => prev.map((l) => 
      l.id === lead.id ? { ...l, status } : l
    ));
    setSelectedLead({ ...lead, status });
    toast.success(`Lead marked as ${status}`);
  };

  const handleViewLead = (lead: WishlistLead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
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
          variant="outline" 
          size="sm" 
          onClick={fetchWishlistData}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(['new', 'contacted', 'qualified', 'closed'] as LeadStatus[]).map((status) => {
          const count = leads.filter((l) => l.status === status).length;
          return (
            <Card key={status} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-xs text-muted-foreground capitalize">{status}</div>
                </div>
                <div className={cn('w-3 h-3 rounded-full', 
                  statusColors[status].split(' ')[0].replace('bg-', 'bg-')
                )} />
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
            className="pl-9 h-9" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] h-9">
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
            <thead className="bg-muted/50 border-b">
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
                    className="border-b hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
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
                      <Badge className={cn('text-xs', statusColors[lead.status])}>
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
                        className="h-8 w-8"
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
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle>Lead Details</DialogTitle>
                <DialogDescription>
                  Customer information and lead management
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-6 space-y-5">
                <div className="flex items-center gap-3">
                  <Avatar className="w-14 h-14">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {selectedLead.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedLead.name}</h3>
                    <Badge className={cn('text-xs mt-1', statusColors[selectedLead.status])}>
                      {selectedLead.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" /> 
                    {selectedLead.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" /> 
                    {selectedLead.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="w-4 h-4 text-muted-foreground" /> 
                    {selectedLead.company}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-1">Product Interest</div>
                  <div className="font-medium text-sm">{selectedLead.productName}</div>
                </div>

                {selectedLead.remarks && (
                  <div className="p-4 rounded-lg bg-muted/30">
                    <div className="text-xs text-muted-foreground mb-1">Remarks</div>
                    <div className="text-sm">{selectedLead.remarks}</div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground pt-2 border-t">
                  Created: {new Date(selectedLead.createdAt).toLocaleString('en-IN')}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}