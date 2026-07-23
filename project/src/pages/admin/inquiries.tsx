import { useState, useMemo, useEffect } from 'react';
import { Search, Mail, Phone, Building, MessageSquare, Eye, Loader2, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Types matching backend API
interface Inquiry {
  id: number;
  full_name: string;
  phone_number: string;
  email: string;
  company_name: string;
  product_interest: string;
  message: string;
  created_at: string;
  updated_at: string;
}

type InquiryStatus = 'new' | 'in-review' | 'responded' | 'closed';

// Status mapping for UI display
const statusColors: Record<InquiryStatus, string> = {
  new: 'bg-blue-100 text-blue-700',
  'in-review': 'bg-yellow-100 text-yellow-700',
  responded: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700',
};

export function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [updating, setUpdating] = useState(false);

  // Fetch inquiries from API
  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/inquiries');
      const result = await response.json();
      
      if (result.success) {
        setInquiries(result.data);
      } else {
        toast.error('Failed to fetch inquiries');
        console.error('API Error:', result.message);
      }
    } catch (error) {
      toast.error('Error fetching inquiries');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchInquiries();
  }, []);

  // Filtered inquiries
  const filtered = useMemo(() => {
    let result = [...inquiries];
    
    // Search filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((i) => 
        i.full_name.toLowerCase().includes(q) || 
        i.email.toLowerCase().includes(q) || 
        i.product_interest.toLowerCase().includes(q) || 
        i.message.toLowerCase().includes(q) ||
        i.company_name.toLowerCase().includes(q)
      );
    }
    
    // Status filter (using a simple status mapping based on UI needs)
    // Since backend doesn't have status field, we'll add a default 'new' status
    // You can implement your own status logic here
    if (statusFilter !== 'all') {
      // For demo, we'll filter based on some logic
      // You can modify this based on your requirements
      const statusMap: Record<string, string[]> = {
        'new': ['new'],
        'in-review': ['in-review'],
        'responded': ['responded'],
        'closed': ['closed']
      };
      // For now, we'll just show all if status filter is not 'all'
      // You can implement actual status logic here
    }
    
    return result.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [inquiries, search, statusFilter]);

  // Update inquiry status (since backend doesn't have status, we'll store it locally)
  const updateStatus = (inquiry: Inquiry, status: InquiryStatus) => {
    // In a real implementation, you'd make an API call to update status
    // For now, we'll store status in local state
    // You'll need to add a status field to your backend or create a separate status tracking
    
    // For demo, let's just update the local state
    toast.success(`Inquiry marked as ${status}`);
    
    // If you want to persist status locally
    const updatedInquiries = inquiries.map((i) => 
      i.id === inquiry.id ? { ...i, status: status as any } : i
    );
    setInquiries(updatedInquiries as Inquiry[]);
    setSelected({ ...inquiry, status: status as any });
  };

  // Helper function to get status (with default fallback)
  const getStatus = (inquiry: Inquiry): InquiryStatus => {
    // If you have a status field in your data, use it
    // Otherwise, return a default status
    return (inquiry as any).status || 'new';
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Inquiry Management</h2>
          <p className="text-sm text-muted-foreground">Manage customer inquiries and responses</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchInquiries}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Refresh'
          )}
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, email, product..." 
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
            <SelectItem value="in-review">In Review</SelectItem>
            <SelectItem value="responded">Responded</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center text-sm text-muted-foreground">
          Total: {inquiries.length} inquiries
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Mail className="w-12 h-12 text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No inquiries found</p>
            {search && <p className="text-sm text-muted-foreground">Try adjusting your search</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer</th>
                  <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Product Interest</th>
                  <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Message</th>
                  <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="p-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inquiry) => {
                  const status = getStatus(inquiry);
                  return (
                    <tr 
                      key={inquiry.id} 
                      className="border-b hover:bg-muted/30 transition-colors cursor-pointer" 
                      onClick={() => setSelected(inquiry)}
                    >
                      <td className="p-3">
                        <div className="font-medium text-sm">{inquiry.full_name}</div>
                        <div className="text-xs text-muted-foreground">{inquiry.email}</div>
                        {inquiry.company_name && (
                          <div className="text-xs text-muted-foreground mt-0.5">{inquiry.company_name}</div>
                        )}
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        <div className="text-sm truncate max-w-[180px]">{inquiry.product_interest}</div>
                      </td>
                      <td className="p-3 hidden lg:table-cell">
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">{inquiry.message}</div>
                      </td>
                      <td className="p-3">
                        <Badge className={cn('text-xs', statusColors[status] || statusColors.new)}>
                          {status}
                        </Badge>
                      </td>
                      <td className="p-3 hidden md:table-cell text-sm text-muted-foreground">
                        {formatDate(inquiry.created_at)}
                      </td>
                      <td className="p-3 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setSelected(inquiry); 
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Detail Modal - Replacing Sheet with Dialog */}
      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Inquiry Details</DialogTitle>
                <DialogDescription>
                  Customer inquiry information
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4 space-y-5">
                {/* Customer Info Card */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="w-4 h-4 text-blue-600" /> 
                      <span className="font-medium">{selected.company_name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-blue-600" /> 
                      <a href={`mailto:${selected.email}`} className="text-blue-600 hover:underline">
                        {selected.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-blue-600" /> 
                      <a href={`tel:${selected.phone_number}`} className="text-blue-600 hover:underline">
                        {selected.phone_number}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Product Interest Card */}
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Product Interest
                  </div>
                  <div className="font-semibold text-gray-900">{selected.product_interest}</div>
                </div>

                {/* Message Card */}
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Message
                  </div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-md">
                    {selected.message}
                  </div>
                </div>

                {/* Status Update */}
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Update Status
                    </label>
                    <Select 
                      value={getStatus(selected)} 
                      onValueChange={(v) => updateStatus(selected, v as InquiryStatus)}
                      disabled={updating}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in-review">In Review</SelectItem>
                        <SelectItem value="responded">Responded</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded-md">
                  <div>Received: {formatDateTime(selected.created_at)}</div>
                  {selected.updated_at && selected.updated_at !== selected.created_at && (
                    <div className="mt-1">Last Updated: {formatDateTime(selected.updated_at)}</div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}