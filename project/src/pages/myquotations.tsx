// my-quotations.tsx - Updated to show min/max prices at top right of card

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, User, Mail, Phone, Package, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp, Loader, Percent, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { baseurl } from '@/Baseurl/baseurl';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface QuotationDetail {
  id: number;
  quotation_id: number;
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

interface Quotation {
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
  details: QuotationDetail[];
}

export function MyQuotations() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [expandedQuotation, setExpandedQuotation] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      const session = localStorage.getItem('userSession');
      if (!session) {
        toast.error('Please login to view quotations');
        navigate('/register');
        return;
      }

      const user = JSON.parse(session);
      const response = await fetch(`${baseurl}/api/quotations/user/${user.userId}`);
      const result = await response.json();

      if (result.success) {
        setQuotations(result.data);
      } else {
        toast.error('Failed to fetch quotations');
      }
    } catch (error) {
      console.error('Error fetching quotations:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
      'Pending': { variant: 'secondary', icon: <Clock className="w-3 h-3" /> },
      'Approved': { variant: 'default', icon: <CheckCircle className="w-3 h-3" /> },
      'Rejected': { variant: 'destructive', icon: <XCircle className="w-3 h-3" /> },
      'Completed': { variant: 'outline', icon: <CheckCircle className="w-3 h-3" /> },
    };

    const statusInfo = statusMap[status] || statusMap['Pending'];
    return (
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        {statusInfo.icon}
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(parseFloat(amount));
  };

  const toggleExpand = (id: number) => {
    setExpandedQuotation(expandedQuotation === id ? null : id);
  };

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/')) {
      return `${baseurl}${imagePath}`;
    }
    return `${baseurl}/uploads/products/${imagePath}`;
  };

  // Calculate min and max prices for a quotation
  const getQuotationPriceRange = (details: QuotationDetail[]) => {
    let minPrice: number | null = null;
    let maxPrice: number | null = null;

    details.forEach(detail => {
      if (detail.min_price) {
        const price = parseFloat(detail.min_price);
        if (minPrice === null || price < minPrice) minPrice = price;
      }
      if (detail.max_price) {
        const price = parseFloat(detail.max_price);
        if (maxPrice === null || price > maxPrice) maxPrice = price;
      }
    });

    return { minPrice, maxPrice };
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading quotations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text text-transparent">
            My Quotations
          </h1>
          <p className="text-muted-foreground mt-1">
            {quotations.length > 0 
              ? `You have ${quotations.length} quotation(s)` 
              : 'No quotations generated yet'}
          </p>
        </div>
        <Button 
          onClick={() => navigate('/products')}
          className="bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 text-white"
        >
          Browse Products
        </Button>
      </div>

      {quotations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No quotations found</h3>
            <p className="text-muted-foreground text-sm mt-1">You haven't requested any quotations yet</p>
            <Button 
              onClick={() => navigate('/products')}
              className="mt-4 bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 text-white"
            >
              Browse Products
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {quotations.map((quotation) => {
            const { minPrice, maxPrice } = getQuotationPriceRange(quotation.details);
            
            return (
              <Card key={quotation.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  {/* Quotation Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {quotation.customer_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          {quotation.customer_email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          {quotation.customer_mobile}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="w-3.5 h-3.5" />
                          {quotation.total_items} items
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(quotation.created_at)}
                        </span>
                      </div>
                    </div>
                    {/* Price Range at Top Right */}
                    <div className="flex flex-col items-end gap-1">
                      {minPrice !== null && maxPrice !== null && minPrice !== maxPrice ? (
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Price Range</div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-blue-600">
                              {formatCurrency(String(minPrice))}
                            </span>
                            <span className="text-xs text-muted-foreground">to</span>
                            <span className="text-sm font-semibold text-purple-600">
                              {formatCurrency(String(maxPrice))}
                            </span>
                          </div>
                        </div>
                      ) : minPrice !== null ? (
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Price</div>
                          <span className="text-sm font-semibold text-primary">
                            {formatCurrency(String(minPrice))}
                          </span>
                        </div>
                      ) : (
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Price</div>
                          <span className="text-sm font-semibold text-primary">
                            {formatCurrency(quotation.grand_total)}
                          </span>
                        </div>
                      )}
                      {/* Status Badge */}
                      {/* <div className="mt-1">
                        {getStatusBadge(quotation.status)}
                      </div> */}
                    </div>
                  </div>

                  {/* Product Details - Expandable */}
                  {quotation.details && quotation.details.length > 0 && (
                    <div className="mt-4">
                      <div 
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all duration-200",
                          expandedQuotation === quotation.id 
                            ? "border-primary bg-primary/5 hover:bg-primary/10" 
                            : "border-dashed border-gray-300 hover:border-primary/50 hover:bg-muted/30"
                        )}
                        onClick={() => toggleExpand(quotation.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-full transition-colors",
                            expandedQuotation === quotation.id 
                              ? "bg-primary text-white" 
                              : "bg-muted/50 text-muted-foreground"
                          )}>
                            <Package className="w-4 h-4" />
                          </div>
                          <div className="text-left">
                            <span className="font-semibold text-sm">
                              View Products
                            </span>
                            <span className="ml-2 text-xs text-muted-foreground">
                              ({quotation.details.length} items)
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {expandedQuotation === quotation.id ? 'Hide details' : 'Show details'}
                          </span>
                          {expandedQuotation === quotation.id ? (
                            <ChevronUp className="h-4 w-4 text-primary" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>

                      {expandedQuotation === quotation.id && (
                        <div className="mt-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                          {quotation.details.map((detail) => {
                            const imageUrl = getImageUrl(detail.variant_image);
                            
                            return (
                              <div key={detail.id} className="bg-gradient-to-r from-muted/10 to-muted/5 rounded-xl p-4 border border-muted/20 hover:border-primary/30 transition-all hover:shadow-sm">
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                  {/* Product Image */}
                                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                    {imageUrl ? (
                                      <img 
                                        src={imageUrl} 
                                        alt={detail.product_name}
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

                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h5 className="font-semibold text-sm">{detail.product_name}</h5>
                                      <Badge variant="outline" className="text-xs bg-primary/5">
                                        {detail.brand}
                                      </Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1.5 flex items-center gap-3 flex-wrap">
                                      <span className="flex items-center gap-1">
                                        <span className="font-medium">Code:</span> {detail.product_code}
                                      </span>
                                      <span className="w-px h-3 bg-muted-foreground/20 hidden sm:block" />
                                      <span className="flex items-center gap-1">
                                        <span className="font-medium">Qty:</span> {detail.quantity}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Min/Max Price for individual product */}
                                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm w-full md:w-auto">
                                    {detail.min_price && (
                                      <div className="bg-blue-50/50 rounded-lg px-3 py-1.5 text-center border border-blue-100">
                                        <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Min</p>
                                        <p className="font-semibold text-blue-700 text-sm">{formatCurrency(detail.min_price)}</p>
                                      </div>
                                    )}
                                    {detail.max_price && (
                                      <div className="bg-purple-50/50 rounded-lg px-3 py-1.5 text-center border border-purple-100">
                                        <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Max</p>
                                        <p className="font-semibold text-purple-700 text-sm">{formatCurrency(detail.max_price)}</p>
                                      </div>
                                    )}
                                    <div className="bg-primary/5 rounded-lg px-3 py-1.5 text-center border border-primary/20">
                                      <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Final</p>
                                      <p className="font-semibold text-primary text-sm">{formatCurrency(detail.final_price)}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Quotation Details Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedQuotation && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text text-transparent">
                  Quotation Details
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Customer Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <div className="text-sm text-muted-foreground">Quotation Number</div>
                    <div className="font-semibold">{selectedQuotation.quotation_no}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div>{getStatusBadge(selectedQuotation.status)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Customer</div>
                    <div className="font-medium">{selectedQuotation.customer_name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Contact</div>
                    <div className="font-medium">{selectedQuotation.customer_mobile}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="font-medium">{selectedQuotation.customer_email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Created</div>
                    <div className="font-medium">{formatDate(selectedQuotation.created_at)}</div>
                  </div>
                  {selectedQuotation.remarks && (
                    <div className="col-span-2">
                      <div className="text-sm text-muted-foreground">Remarks</div>
                      <div className="font-medium">{selectedQuotation.remarks}</div>
                    </div>
                  )}
                </div>

                {/* Products Table */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Products ({selectedQuotation.total_items})
                  </h4>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Code</TableHead>
                          <TableHead>Brand</TableHead>
                          <TableHead className="text-center">Qty</TableHead>
                          <TableHead className="text-right">Min Price</TableHead>
                          <TableHead className="text-right">Max Price</TableHead>
                          <TableHead className="text-right">Final Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedQuotation.details.map((detail) => (
                          <TableRow key={detail.id}>
                            <TableCell className="font-medium">{detail.product_name}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{detail.product_code}</TableCell>
                            <TableCell className="text-sm">{detail.brand}</TableCell>
                            <TableCell className="text-center">{detail.quantity}</TableCell>
                            <TableCell className="text-right text-blue-700">
                              {detail.min_price ? formatCurrency(detail.min_price) : '-'}
                            </TableCell>
                            <TableCell className="text-right text-purple-700">
                              {detail.max_price ? formatCurrency(detail.max_price) : '-'}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-primary">
                              {formatCurrency(detail.final_price)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Total Summary */}
                <div className="flex flex-col items-end space-y-2 p-4 bg-muted/30 rounded-lg">
                  <div className="flex justify-between w-full max-w-sm">
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span className="font-medium">{formatCurrency(selectedQuotation.total_amount)}</span>
                  </div>
                  {parseFloat(selectedQuotation.total_discount) > 0 && (
                    <div className="flex justify-between w-full max-w-sm text-green-600">
                      <span>Total Discount:</span>
                      <span className="font-medium">- {formatCurrency(selectedQuotation.total_discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between w-full max-w-sm text-lg font-bold pt-2 border-t">
                    <span>Grand Total:</span>
                    <span className="text-primary">{formatCurrency(selectedQuotation.grand_total)}</span>
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