import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {   Calendar, User, Mail, Phone, Package, Percent, CheckCircle, Clock, XCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
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
  discount: string;
  final_price: string;
  subtotal: string;
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
  const [selectedQuotation, _setSelectedQuotation] = useState<Quotation | null>(null);
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

  // const calculateProductDiscountAmount = (detail: QuotationDetail) => {
  //   const price = parseFloat(detail.price);
  //   const discountPercent = parseFloat(detail.discount);
  //   return (price * discountPercent) / 100;
  // };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
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
            {/* <FileText className="w-16 h-16 text-muted-foreground/30 mb-4" /> */}
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
            // Calculate total discount percentage
            let totalDiscountPercent = 0;
            let totalDiscountAmount = 0;
            
            if (quotation.details && quotation.details.length > 0) {
              quotation.details.forEach(detail => {
                const discountPercent = parseFloat(detail.discount);
                totalDiscountPercent += discountPercent;
                const price = parseFloat(detail.price);
                totalDiscountAmount += (price * discountPercent) / 100;
              });
            }

            return (
              <Card key={quotation.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  {/* Quotation Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      {/* <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-semibold">{quotation.quotation_no}</h3>
                        {getStatusBadge(quotation.status)}
                      </div> */}
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
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                      {/* <div className="text-right">
                        <div className="text-sm text-muted-foreground">Grand Total</div>
                        <div className="text-xl font-bold text-primary">
                          {formatCurrency(quotation.grand_total)}
                        </div>
                      </div> */}
                      {/* <Button
                        onClick={() => {
                          setSelectedQuotation(quotation);
                          setIsDetailOpen(true);
                        }}
                        className="bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 text-white"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button> */}
                    </div>
                  </div>

                  {/* Quotation Request Summary - Collapsible */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Quotation Request Summary</h4>
                        <div className="text-sm space-y-1">
                          <p>Total Items: <span className="font-medium">{quotation.total_items}</span></p>
                          {/* <p>Total Amount: <span className="font-medium">{formatCurrency(quotation.total_amount)}</span></p>
                          {totalDiscountPercent > 0 && (
                            <p>Total Discount: <span className="font-medium text-green-600">{totalDiscountPercent.toFixed(1)}% off ({formatCurrency(totalDiscountAmount.toString())})</span></p>
                          )} */}
                        </div>
                        {/* {quotation.remarks && (
                          <div className="mt-2 p-2 bg-muted/30 rounded text-sm">
                            <span className="font-semibold">Remarks:</span> {quotation.remarks}
                          </div>
                        )} */}
                      </div>
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
                            // const discountAmount = calculateProductDiscountAmount(detail);
                            // const price = parseFloat(detail.price);
                            // const finalPrice = parseFloat(detail.final_price);
                            
                            return (
                              <div key={detail.id} className="bg-gradient-to-r from-muted/10 to-muted/5 rounded-xl p-4 border border-muted/20 hover:border-primary/30 transition-all hover:shadow-sm">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
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
                                  {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm w-full md:w-auto">
                                    <div className="bg-background/50 rounded-lg px-3 py-1.5 text-center">
                                      <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Price</p>
                                      <p className="font-semibold text-foreground">{formatCurrency(detail.price)}</p>
                                    </div>
                                    {parseFloat(detail.discount) > 0 && (
                                      <div className="bg-green-50 rounded-lg px-3 py-1.5 text-center">
                                        <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Discount</p>
                                        <p className="font-semibold text-green-600">
                                          {detail.discount}% ({formatCurrency(discountAmount.toString())})
                                        </p>
                                      </div>
                                    )}
                                    <div className="bg-primary/5 rounded-lg px-3 py-1.5 text-center">
                                      <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Final Price</p>
                                      <p className="font-semibold text-primary">{formatCurrency(detail.final_price)}</p>
                                    </div>
                                    <div className="bg-muted/30 rounded-lg px-3 py-1.5 text-center">
                                      <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Subtotal</p>
                                      <p className="font-bold text-foreground">{formatCurrency(detail.subtotal)}</p>
                                    </div>
                                  </div> */}
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
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Discount</TableHead>
                          <TableHead className="text-right">Final Price</TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedQuotation.details.map((detail) => (
                          <TableRow key={detail.id}>
                            <TableCell className="font-medium">{detail.product_name}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{detail.product_code}</TableCell>
                            <TableCell className="text-sm">{detail.brand}</TableCell>
                            <TableCell className="text-center">{detail.quantity}</TableCell>
                            <TableCell className="text-right">{formatCurrency(detail.price)}</TableCell>
                            <TableCell className="text-right">
                              {parseFloat(detail.discount) > 0 ? (
                                <span className="flex items-center justify-end gap-1 text-green-600">
                                  <Percent className="w-3 h-3" />
                                  {detail.discount}%
                                </span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(detail.final_price)}</TableCell>
                            <TableCell className="text-right font-semibold">{formatCurrency(detail.subtotal)}</TableCell>
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