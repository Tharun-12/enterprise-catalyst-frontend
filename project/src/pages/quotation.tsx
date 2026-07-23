import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Download, Printer, Mail, Calendar, Package, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageBreadcrumb as Breadcrumb } from '@/layouts/customer-layout-wrapper';
import { format, formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

type QuotationStatus = 'Pending' | 'Approved' | 'Rejected';

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
  status: QuotationStatus;
  remarks: string;
  created_at: string;
  updated_at: string;
  details: QuotationDetail[];
}

interface StatusColor {
  bg: string;
  text: string;
  label: string;
}

const statusColors: Record<QuotationStatus, StatusColor> = {
  Pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Pending' },
  Approved: { bg: 'bg-green-50', text: 'text-green-700', label: 'Approved' },
  Rejected: { bg: 'bg-red-50', text: 'text-red-700', label: 'Rejected' },
};

export function QuotationPage() {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [expandedQuotation, setExpandedQuotation] = useState<number | null>(null);

  // Get user ID from localStorage
  useEffect(() => {
    const session = localStorage.getItem('userSession');
    if (session) {
      try {
        const user = JSON.parse(session);
        setUserId(user.userId);
      } catch (e) {
        console.error('Error loading user session:', e);
      }
    }
  }, []);

  // Fetch quotations when userId is available
  useEffect(() => {
    if (userId) {
      fetchQuotations();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/quotations/user/${userId}`);
      
      if (response.data.success) {
        setQuotations(response.data.data);
      }
    } catch (error: any) {
      console.error('Error fetching quotations:', error);
      toast.error('Failed to load quotations');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedQuotation(expandedQuotation === id ? null : id);
  };

  const handleViewQuotation = (id: number): void => {
    const quotation = quotations.find(q => q.id === id);
    if (quotation) {
      console.log('Quotation Details:', quotation);
      console.log('Products:', quotation.details);
      
      // You can navigate to a detail page or open a modal
      navigate(`/quotations/${id}`);
    }
  };

  const handleDownload = (id: number): void => {
    const quotation = quotations.find(q => q.id === id);
    if (quotation) {
      // Generate PDF or download as JSON
      const data = {
        quotation: quotation,
        products: quotation.details
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${quotation.quotation_no}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Quotation downloaded successfully');
    }
  };

  const handlePrint = (id: number): void => {
    window.print();
  };

  const handleEmail = (id: number): void => {
    console.log('Email quotation:', id);
    toast.success('Quotation sent to your email');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Quotations' }]} />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Quotations' }]} />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">My Quotations</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {quotations.length > 0 
              ? `You have ${quotations.length} quotation(s)` 
              : 'No quotations generated yet'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/wishlist')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Wishlist
          </Button>
          <Button variant="outline" size="sm" onClick={fetchQuotations}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Quotations List */}
      <div className="space-y-4">
        {quotations.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Quotations Found</h3>
            <p className="text-sm text-muted-foreground">
              You haven't generated any quotations yet. 
              Add products to your wishlist and request a quotation.
            </p>
            <Button className="mt-4" onClick={() => navigate('/wishlist')}>
              Go to Wishlist
            </Button>
          </Card>
        ) : (
          quotations.map((quotation) => (
            <Card key={quotation.id} className="p-6 hover:shadow-lg transition-shadow">
              {/* Quotation Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{quotation.quotation_no}</h3>
                    <Badge className={statusColors[quotation.status].bg + ' ' + statusColors[quotation.status].text}>
                      {statusColors[quotation.status].label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(quotation.created_at), 'MMM d, yyyy')}
                    </span>
                    <span>({formatDistanceToNow(new Date(quotation.created_at), { addSuffix: true })})</span>
                    <span className="font-medium text-foreground">₹{parseFloat(quotation.grand_total).toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleViewQuotation(quotation.id)}
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleDownload(quotation.id)}
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handlePrint(quotation.id)}
                    title="Print"
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleEmail(quotation.id)}
                    title="Email"
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mt-3 text-sm">
                <span className="font-semibold">Customer:</span>
                <span className="ml-2">{quotation.customer_name}</span>
                <span className="mx-2">|</span>
                <span>{quotation.customer_mobile}</span>
                <span className="mx-2">|</span>
                <span className="text-muted-foreground">{quotation.customer_email}</span>
              </div>

              {/* Order Summary */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Order Summary</h4>
                    <div className="text-sm space-y-1">
                      <p>Total Items: <span className="font-medium">{quotation.total_items}</span></p>
                      <p>Total Amount: <span className="font-medium">₹{parseFloat(quotation.total_amount).toFixed(2)}</span></p>
                      <p>Total Discount: <span className="font-medium text-green-600">-₹{parseFloat(quotation.total_discount).toFixed(2)}</span></p>
                    </div>
                    {quotation.remarks && (
                      <div className="mt-2 p-2 bg-muted/30 rounded text-sm">
                        <span className="font-semibold">Remarks:</span> {quotation.remarks}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-right">
                      <p className="text-muted-foreground text-xs">Grand Total</p>
                      <p className="text-xl font-bold text-primary">₹{parseFloat(quotation.grand_total).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details - Expandable Section */}
              {quotation.details && quotation.details.length > 0 && (
                <div className="mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full flex items-center justify-between hover:bg-muted/50"
                    onClick={() => toggleExpand(quotation.id)}
                  >
                    <span className="font-medium">
                      View Products ({quotation.details.length} items)
                    </span>
                    {expandedQuotation === quotation.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>

                  {expandedQuotation === quotation.id && (
                    <div className="mt-3 space-y-3">
                      {quotation.details.map((detail) => (
                        <div key={detail.id} className="bg-muted/20 rounded-lg p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h5 className="font-semibold text-sm">{detail.product_name}</h5>
                                <Badge variant="outline" className="text-xs">
                                  {detail.brand}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                <span>Code: {detail.product_code}</span>
                                <span className="mx-2">|</span>
                                <span>Qty: {detail.quantity}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground text-xs">Price</p>
                                <p className="font-medium">₹{parseFloat(detail.price).toFixed(2)}</p>
                              </div>
                              {parseFloat(detail.discount) > 0 && (
                                <div>
                                  <p className="text-muted-foreground text-xs">Discount</p>
                                  <p className="font-medium text-green-600">-₹{parseFloat(detail.discount).toFixed(2)}</p>
                                </div>
                              )}
                              <div>
                                <p className="text-muted-foreground text-xs">Final Price</p>
                                <p className="font-medium text-primary">₹{parseFloat(detail.final_price).toFixed(2)}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Subtotal</p>
                                <p className="font-semibold">₹{parseFloat(detail.subtotal).toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Archive Button */}
              <div className="mt-4 pt-4 border-t flex justify-end">
                <Button variant="outline" size="sm" disabled>
                  ARCHIVE ORDER
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}