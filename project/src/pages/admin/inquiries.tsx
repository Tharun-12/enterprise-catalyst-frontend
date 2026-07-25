// src/components/admin/AdminInquiries.tsx
import { useState, useMemo, useEffect } from 'react';
import { Search, Mail, Phone, Building, MessageSquare, Eye, Loader2, Calendar, User, Tag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { baseurl } from '@/Baseurl/baseurl';

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

// Extended type for UI with status
interface InquiryWithStatus extends Inquiry {
  status: InquiryStatus;
}

type InquiryStatus = 'new' | 'in-review' | 'responded' | 'closed';

// Status mapping for UI display
const statusColors: Record<InquiryStatus, string> = {
  new: 'bg-blue-100 text-blue-700 border-blue-200',
  'in-review': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  responded: 'bg-green-100 text-green-700 border-green-200',
  closed: 'bg-gray-100 text-gray-700 border-gray-200',
};

// API Response types
interface ApiResponse {
  success: boolean;
  data: Inquiry[];
  message?: string;
}

export function AdminInquiries() {
  const [inquiries, setInquiries] = useState<InquiryWithStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selected, setSelected] = useState<InquiryWithStatus | null>(null);

  // Fetch inquiries from API
  const fetchInquiries = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(`${baseurl}/api/inquiries`);
      const result: ApiResponse = await response.json();
      
      if (result.success) {
        // Add default status to each inquiry
        const inquiriesWithStatus: InquiryWithStatus[] = result.data.map(inquiry => ({
          ...inquiry,
          status: 'new' as InquiryStatus // Default status
        }));
        setInquiries(inquiriesWithStatus);
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
  const filtered = useMemo((): InquiryWithStatus[] => {
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
    
    return result.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [inquiries, search]);

  // Format date
  const formatDate = (dateString: string): string => {
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

  const formatDateTime = (dateString: string): string => {
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

  const getStatusBadge = (status: InquiryStatus) => {
    return (
      <Badge className={cn('text-xs px-2 py-1', statusColors[status])}>
        {status === 'new' && 'New'}
        {status === 'in-review' && 'In Review'}
        {status === 'responded' && 'Responded'}
        {status === 'closed' && 'Closed'}
      </Badge>
    );
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
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 flex-1">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, email, product..." 
              className="pl-9 h-9" 
              value={search} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearch(e.target.value);
              }} 
            />
          </div>
        </div>
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          {inquiries.length} inquiries found
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
                  <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">#</th>
                  <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer</th>
                  <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Product Interest</th>
                  <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Message</th>
                  <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="p-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inquiry, index) => (
                  <tr 
                    key={inquiry.id} 
                    className="border-b hover:bg-muted/30 transition-colors cursor-pointer" 
                    onClick={() => setSelected(inquiry)}
                  >
                    <td className="p-3 text-sm">{index + 1}</td>
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
                      {getStatusBadge(inquiry.status)}
                    </td>
                    <td className="p-3 hidden md:table-cell text-sm text-muted-foreground">
                      {formatDate(inquiry.created_at)}
                    </td>
                    <td className="p-3 text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={(e: React.MouseEvent) => { 
                          e.stopPropagation(); 
                          setSelected(inquiry); 
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      <Dialog open={!!selected} onOpenChange={(v: boolean) => !v && setSelected(null)}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto p-0">
          {selected && (
            <>
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 rounded-t-lg">
                <DialogHeader className="space-y-1">
                  <DialogTitle className="text-xl font-semibold text-white">Inquiry Details</DialogTitle>
                  <DialogDescription className="text-blue-100">
                    Customer inquiry information
                  </DialogDescription>
                </DialogHeader>
                {/* Status badge in header */}
                <div className="mt-3">
                  {getStatusBadge(selected.status)}
                </div>
              </div>
              
              {/* Content */}
              <div className="px-6 pb-6 pt-4 space-y-4">
                {/* Customer Info Card */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Customer Information</span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-3">
                      <Building className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs text-gray-500">Company</div>
                        <div className="text-sm font-medium">{selected.company_name || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs text-gray-500">Email</div>
                        <a href={`mailto:${selected.email}`} className="text-sm font-medium text-blue-600 hover:underline">
                          {selected.email}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs text-gray-500">Phone</div>
                        <a href={`tel:${selected.phone_number}`} className="text-sm font-medium text-blue-600 hover:underline">
                          {selected.phone_number}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Interest Card */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Product Interest</span>
                  </div>
                  <div className="bg-white rounded-md p-3 border border-gray-100">
                    <div className="text-sm font-semibold text-gray-900">{selected.product_interest}</div>
                  </div>
                </div>

                {/* Message Card */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Message</span>
                  </div>
                  <div className="bg-white rounded-md p-3 border border-gray-100">
                    <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {selected.message}
                    </div>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">Received</div>
                      <div className="text-sm text-gray-700">{formatDateTime(selected.created_at)}</div>
                      {selected.updated_at && selected.updated_at !== selected.created_at && (
                        <div className="text-xs text-gray-400 mt-1">
                          Last Updated: {formatDateTime(selected.updated_at)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}