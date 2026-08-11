// src/components/admin/QuotationView.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
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
  discountAmount: number;
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

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/')) {
      return `${baseurl}${imagePath}`;
    }
    return `${baseurl}/uploads/products/${imagePath}`;
  };

  const fetchQuotationDetails = async (quotationId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${baseurl}/api/quotations/${quotationId}`);
      
      if (response.data && response.data.success) {
        const apiQuotation = response.data.quotation;
        const apiItems = response.data.items || [];
        
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
            minPrice: item.min_price ? parseFloat(item.min_price) : null,
            maxPrice: item.max_price ? parseFloat(item.max_price) : null,
            discount: parseFloat(item.discount) || 0,
            discountAmount: parseFloat(item.discount_amount) || 0,
            finalPrice: parseFloat(item.final_price) || 0,
            subtotal: parseFloat(item.subtotal) || 0,
            variantImage: item.variant_image || null,
            variantDetails: item.variant_details ? JSON.parse(item.variant_details) : null,
          })),
          totalItems: apiQuotation.total_items || apiItems.length || 0,
          totalAmount: parseFloat(apiQuotation.total_amount) || 0,
          totalDiscount: parseFloat(apiQuotation.total_discount) || 0,
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
                {quotation.items.map((item, index) => {
                  const imageUrl = getImageUrl(item.variantImage);
                  
                  return (
                    <div key={item.id}>
                      {index > 0 && <Separator className="my-4" />}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-4">
                          {/* Product Image */}
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border">
                            {imageUrl ? (
                              <img 
                                src={imageUrl} 
                                alt={item.productName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x80?text=No+Image';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          
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
                        </div>
                        
                        {/* Price Information with Min/Max */}
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                          {/* Min Price */}
                          {item.minPrice !== null && (
                            <div className="bg-blue-50/50 rounded-lg px-3 py-5 text-center border border-blue-100">
                              <p className="text-xs text-muted-foreground">Min Price</p>
                              <p className="font-semibold text-blue-700 text-sm">
                                {formatCurrency(item.minPrice)}
                              </p>
                            </div>
                          )}
                          
                          {/* Max Price */}
                          {item.maxPrice !== null && (
                            <div className="bg-purple-50/50 rounded-lg px-3 py-5 text-center border border-purple-100">
                              <p className="text-xs text-muted-foreground">Max Price</p>
                              <p className="font-semibold text-purple-700 text-sm">
                                {formatCurrency(item.maxPrice)}
                              </p>
                            </div>
                          )}
                          
                          {/* Final Price */}
                          {/* <div className="bg-primary/5 rounded-lg px-3 py-2 text-center border border-primary/20">
                            <p className="text-xs text-muted-foreground">Final Price</p>
                            <p className="font-semibold text-primary text-sm">
                              {formatCurrency(item.finalPrice)}
                            </p>
                          </div> */}
                          
                          {/* Subtotal */}
                          {/* <div className="bg-gray-50 rounded-lg px-3 py-2 text-center border">
                            <p className="text-xs text-muted-foreground">Subtotal</p>
                            <p className="font-semibold text-sm">
                              {formatCurrency(item.subtotal)}
                            </p>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No products available</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {/* <div className="flex justify-end">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Items</span>
                <span className="text-lg font-semibold">{quotation.totalItems}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center bg-primary/5 p-3 rounded-lg border-2 border-primary/20">
                <span className="text-sm font-medium">Grand Total</span>
                <span className="text-2xl font-bold text-primary">{formatCurrency(quotation.grandTotal)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}

      {/* Notes */}
      {/* {quotation.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{quotation.notes}</p>
          </CardContent>
        </Card>
      )} */}
    </div>
  );
}