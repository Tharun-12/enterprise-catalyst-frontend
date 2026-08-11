// src/pages/admin/AdminQuotations.tsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge'; // Added missing import
import { toast } from 'sonner';
import axios from 'axios';
import { baseurl } from '@/Baseurl/baseurl';
import { cn } from '@/lib/utils';

type QuotationStatus = 'Pending' | 'Approved' | 'Rejected';

interface QuotationItem {
  id: number;
  productName: string;
  productCode: string;
  brand: string;
  quantity: number;
  price: number;
  minPrice: number | null;
  maxPrice: number | null;
  discount: number;
  finalPrice: number;
  subtotal: number;
  variantImage: string | null;
  variantDetails: any | null;
}

interface Quotation {
  id: string;
  quotationNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: QuotationStatus;
  items: QuotationItem[];
  totalItems: number;
  totalAmount: number;
  totalDiscount: number;
  grandTotal: number;
  createdAt: string;
  updatedAt: string;
  validUntil: string;
  notes: string;
}

interface ApiQuotationDetail {
  id: number;
  product_id: number;
  product_name: string;
  product_code: string;
  brand: string;
  quantity: number;
  price: string;
  min_price: string | null;
  max_price: string | null;
  discount: string;
  discount_amount: string;
  final_price: string;
  subtotal: string;
  variant_image: string | null;
  variant_details: string | null;
  created_at: string;
}

interface ApiQuotation {
  id: number;
  quotation_no: string;
  user_id: number;
  customer_name: string;
  customer_mobile: string;
  customer_email: string;
  total_items: number;
  total_amount: string;
  total_discount: string;
  grand_total: string;
  status: string;
  remarks: string;
  created_at: string;
  updated_at: string;
  details: ApiQuotationDetail[];
}

export function AdminQuotations() {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const transformApiData = (apiData: ApiQuotation[]): Quotation[] => {
    return apiData.map((item) => ({
      id: item.id.toString(),
      quotationNumber: item.quotation_no,
      customerName: item.customer_name,
      customerEmail: item.customer_email,
      customerPhone: item.customer_mobile,
      status: mapStatus(item.status),
      items: item.details?.map((detail) => ({
        id: detail.id,
        productName: detail.product_name,
        productCode: detail.product_code,
        brand: detail.brand || 'N/A',
        quantity: detail.quantity,
        price: parseFloat(detail.price) || 0,
        minPrice: detail.min_price ? parseFloat(detail.min_price) : null,
        maxPrice: detail.max_price ? parseFloat(detail.max_price) : null,
        discount: parseFloat(detail.discount) || 0,
        finalPrice: parseFloat(detail.final_price) || 0,
        subtotal: parseFloat(detail.subtotal) || 0,
        variantImage: detail.variant_image || null,
        variantDetails: detail.variant_details ? JSON.parse(detail.variant_details) : null,
      })) || [],
      totalItems: item.total_items || item.details?.length || 0,
      totalAmount: parseFloat(item.total_amount) || 0,
      totalDiscount: parseFloat(item.total_discount) || 0,
      grandTotal: parseFloat(item.grand_total) || 0,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      notes: item.remarks || '',
    }));
  };

  const mapStatus = (apiStatus: string): QuotationStatus => {
    const statusMap: Record<string, QuotationStatus> = {
      'Pending': 'Pending',
      'Approved': 'Approved',
      'Rejected': 'Rejected',
    };
    return statusMap[apiStatus] || 'Pending';
  };

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseurl}/api/quotations`);

      if (response.data.success && response.data.data) {
        const transformedData = transformApiData(response.data.data);
        setQuotations(transformedData);
        toast.success(`Loaded ${transformedData.length} quotations`);
      } else {
        toast.error('Failed to load quotations');
        setQuotations([]);
      }
    } catch (error) {
      console.error('Error fetching quotations:', error);
      toast.error('Failed to load quotations');
      setQuotations([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let result = [...quotations];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((item) =>
        item.customerName.toLowerCase().includes(q) ||
        item.customerEmail.toLowerCase().includes(q) ||
        item.customerPhone.includes(q) ||
        item.quotationNumber.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter((item) => item.status.toLowerCase() === statusFilter.toLowerCase());
    }
    return result;
  }, [quotations, search, statusFilter]);

  const paginatedQuotations = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(filtered.length / pageSize);

  const handleViewQuotation = (quotation: Quotation) => {
    navigate(`/admin/quotations/view/${quotation.id}`);
  };

  const handlePageSizeChange = (value: string): void => {
    setPageSize(Number(value));
    setPage(1);
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Removed unused getImageUrl function since it's not used in this component

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading quotations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Quotations</h2>
          <p className="text-sm text-muted-foreground">
            Manage customer quotations and pricing
            {quotations.length > 0 && ` (${quotations.length} quotations)`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchQuotations}
            disabled={loading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 flex-1">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, phone..."
              className="pl-9 h-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          {filtered.length} quotations found
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">#</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Phone</th>
                {/* <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Amount</th> */}
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="p-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedQuotations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    No quotations found
                  </td>
                </tr>
              ) : (
                paginatedQuotations.map((quotation, index) => (
                  <tr
                    key={quotation.id}
                    className="border-b hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-3 text-sm">
                      {(page - 1) * pageSize + index + 1}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {getInitials(quotation.customerName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{quotation.customerName}</div>
                          <div className="text-xs text-muted-foreground">{quotation.totalItems} items</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      <div className="text-sm">{quotation.customerEmail}</div>
                    </td>
                    <td className="p-3 hidden lg:table-cell">
                      <div className="text-sm">{quotation.customerPhone || '—'}</div>
                    </td>
                    {/* <td className="p-3">
                      <div className="text-sm font-medium">₹{quotation.grandTotal.toLocaleString()}</div>
                    </td> */}
                    <td className="p-3">
                      <Badge className={cn(
                        "text-xs font-medium",
                        quotation.status === 'Pending' && "bg-yellow-100 text-yellow-700",
                        quotation.status === 'Approved' && "bg-green-100 text-green-700",
                        quotation.status === 'Rejected' && "bg-red-100 text-red-700"
                      )}>
                        {quotation.status}
                      </Badge>
                    </td>
                    <td className="p-3 hidden lg:table-cell text-sm text-muted-foreground">
                      {new Date(quotation.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleViewQuotation(quotation)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, filtered.length)} of {filtered.length} quotations
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show</span>
                <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
                  <SelectTrigger className="w-[70px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">entries</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === 1} 
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm">Page {page} of {totalPages || 1}</span>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === totalPages || totalPages === 0} 
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}