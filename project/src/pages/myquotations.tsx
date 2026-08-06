// pages/myquotations.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, FileText, Calendar, User, Mail, Phone, Package, DollarSign, Percent, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { baseurl } from '@/Baseurl/baseurl';
import { toast } from 'sonner';

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
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading quotations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text text-transparent">
            My Quotations
          </h1>
          <p className="text-muted-foreground mt-1">
            View all your quotation requests and their status
          </p>
        </div>
        {/* <Button 
          onClick={() => navigate('/products')}
          className="bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 text-white"
        >
          <FileText className="w-4 h-4 mr-2" />
          Request New Quotation
        </Button> */}
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
          {quotations.map((quotation) => (
            <Card key={quotation.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{quotation.quotation_no}</h3>
                      {getStatusBadge(quotation.status)}
                    </div>
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
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Grand Total</div>
                      <div className="text-xl font-bold text-primary">
                        {formatCurrency(quotation.grand_total)}
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedQuotation(quotation);
                        setIsDetailOpen(true);
                      }}
                      className="bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 text-white"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
                              <span className="flex items-center justify-end gap-1 text-green-600">
                                <Percent className="w-3 h-3" />
                                {detail.discount}%
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(detail.final_price)}</TableCell>
                            <TableCell className="text-right font-semibold">{formatCurrency(detail.subtotal)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2 p-4 bg-muted/30 rounded-lg">
                  <div className="flex justify-between w-full max-w-sm">
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span className="font-medium">{formatCurrency(selectedQuotation.total_amount)}</span>
                  </div>
                  <div className="flex justify-between w-full max-w-sm text-green-600">
                    <span>Total Discount:</span>
                    <span className="font-medium">- {formatCurrency(selectedQuotation.total_discount)}</span>
                  </div>
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