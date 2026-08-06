// src/components/admin/QuotationView.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import axios from 'axios';
import { baseurl } from '@/Baseurl/baseurl';
import { cn } from '@/lib/utils'; // Add this import

type QuotationStatus = 'Pending' | 'Approved' | 'Rejected';

interface QuotationItem {
  id: number;
  productName: string;
  productCode: string;
  brand: string;
  quantity: number;
  price: number;
  discount: number;
  finalPrice: number;
  subtotal: number;
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
  product_name: string;
  product_code: string;
  brand: string;
  quantity: number;
  price: string;
  discount: string;
  final_price: string;
  subtotal: string;
}

const statusBadgeStyles: Record<QuotationStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Approved: 'bg-green-100 text-green-700 border-green-200',
  Rejected: 'bg-red-100 text-red-700 border-red-200',
};

export function QuotationView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchQuotationDetails(id);
    }
  }, [id]);

  const mapStatus = (apiStatus: string): QuotationStatus => {
    const statusMap: Record<string, QuotationStatus> = {
      'Pending': 'Pending',
      'Approved': 'Approved',
      'Rejected': 'Rejected',
    };
    return statusMap[apiStatus] || 'Pending';
  };

  const fetchQuotationDetails = async (quotationId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${baseurl}/api/quotations/${quotationId}`);
      
      if (response.data && response.data.success) {
        const apiQuotation = response.data.quotation;
        const apiItems = response.data.items || [];
        
        const totalDiscountPercentage = apiItems.reduce((sum: number, item: ApiQuotationDetail) => {
          return sum + (parseFloat(item.discount) || 0);
        }, 0);
        
        const transformedData: Quotation = {
          id: apiQuotation.id.toString(),
          quotationNumber: apiQuotation.quotation_no,
          customerName: apiQuotation.customer_name,
          customerEmail: apiQuotation.customer_email,
          customerPhone: apiQuotation.customer_mobile,
          status: mapStatus(apiQuotation.status),
          items: apiItems.map((item: ApiQuotationDetail) => ({
            id: item.id,
            productName: item.product_name,
            productCode: item.product_code,
            brand: item.brand || 'N/A',
            quantity: item.quantity,
            price: parseFloat(item.price) || 0,
            discount: parseFloat(item.discount) || 0,
            finalPrice: parseFloat(item.final_price) || 0,
            subtotal: parseFloat(item.subtotal) || 0,
          })),
          totalItems: apiQuotation.total_items || apiItems.length || 0,
          totalAmount: parseFloat(apiQuotation.total_amount) || 0,
          totalDiscount: totalDiscountPercentage,
          grandTotal: parseFloat(apiQuotation.grand_total) || 0,
          createdAt: apiQuotation.created_at,
          updatedAt: apiQuotation.updated_at,
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          notes: apiQuotation.remarks || '',
        };
        
        setQuotation(transformedData);
      } else {
        throw new Error('Invalid API response structure');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load quotation details';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching quotation:', err);
    } finally {
      setLoading(false);
    }
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

  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const formatDiscount = (discountPercent: number): string => {
    if (discountPercent === 0) return '0%';
    return `${discountPercent.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading quotation details...</p>
        </div>
      </div>
    );
  }

  if (error || !quotation) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error || 'Quotation not found'}</p>
          <Button onClick={() => navigate('/admin/quotations')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Quotations
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/quotations')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Quotation Details</h1>
            <p className="text-sm text-muted-foreground">
              {quotation.quotationNumber}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge 
            className={cn(
              "text-sm px-4 py-1 border-2 font-medium",
              statusBadgeStyles[quotation.status]
            )}
          >
            {quotation.status}
          </Badge>
        </div>
      </div>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
          <CardDescription>Customer details for this quotation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xl">
                {getInitials(quotation.customerName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold">{quotation.customerName}</p>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{quotation.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{quotation.customerPhone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products */}
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>Items included in this quotation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quotation.items.length > 0 ? (
              <>
                {quotation.items.map((item, index) => (
                  <div key={item.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-base">{item.productName}</h4>
                          <Badge variant="outline" className="text-xs">
                            {item.brand}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1 space-y-1">
                          <p>Code: {item.productCode}</p>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Unit Price</p>
                          <p className="font-medium">{formatCurrency(item.price)}</p>
                        </div>
                        {item.discount > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground">Discount</p>
                            <p className="font-medium text-green-600">
                              {formatDiscount(item.discount)}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-muted-foreground">Final Price</p>
                          <p className="font-medium text-primary">{formatCurrency(item.finalPrice)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Subtotal</p>
                          <p className="font-semibold">{formatCurrency(item.subtotal)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No products available</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Total Items</p>
              <p className="text-lg font-semibold">{quotation.totalItems}</p>
            </div>
            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Total Amount</p>
              <p className="text-lg font-semibold">{formatCurrency(quotation.totalAmount)}</p>
            </div>
            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Total Discount</p>
              <p className="text-lg font-semibold text-green-600">
                {quotation.totalDiscount > 0 ? formatDiscount(quotation.totalDiscount) : '0%'}
              </p>
            </div>
            <div className="bg-primary/5 p-3 rounded-lg border-2 border-primary/20">
              <p className="text-xs text-muted-foreground">Grand Total</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(quotation.grandTotal)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {quotation.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{quotation.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}