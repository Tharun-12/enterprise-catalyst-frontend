import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Package, Loader2, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageBreadcrumb as Breadcrumb } from '@/layouts/customer-layout-wrapper';
import { format, formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { baseurl } from '@/Baseurl/baseurl';

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
  discount_amount?: string; // Added for the calculated discount amount
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
      const response = await axios.get(`${baseurl}/api/quotations/user/${userId}`);

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

  // Calculate total discount percentage - SUM of all individual discount percentages
  // const calculateTotalDiscountPercentage = (quotation: Quotation) => {
  //   if (!quotation.details || quotation.details.length === 0) return 0;

  //   let totalDiscountPercent = 0;

  //   quotation.details.forEach(detail => {
  //     const discountPercent = parseFloat(detail.discount);
  //     totalDiscountPercent += discountPercent;
  //   });

  //   return totalDiscountPercent;
  // };

  // Calculate total discount amount in rupees
  // const calculateTotalDiscountAmount = (quotation: Quotation) => {
  //   if (!quotation.details || quotation.details.length === 0) return 0;

  //   let totalDiscountAmount = 0;

  //   quotation.details.forEach(detail => {
  //     const price = parseFloat(detail.price);
  //     const discountPercent = parseFloat(detail.discount);
  //     const discountAmount = (price * discountPercent) / 100;
  //     totalDiscountAmount += discountAmount;
  //   });

  //   return totalDiscountAmount;
  // };

  // Calculate discount amount for a single product
  // const calculateProductDiscountAmount = (detail: QuotationDetail) => {
  //   const price = parseFloat(detail.price);
  //   const discountPercent = parseFloat(detail.discount);
  //   return (price * discountPercent) / 100;
  // };

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
          quotations.map((quotation) => {
            // const discountPercentage = calculateTotalDiscountPercentage(quotation);
            // const discountAmount = calculateTotalDiscountAmount(quotation);

            return (
              <Card key={quotation.id} className="p-6 hover:shadow-lg transition-shadow">
                {/* Quotation Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      {/* <h3 className="text-lg font-semibold">{quotation.quotation_no}</h3> */}
                      {/* <Badge variant={
                        quotation.status === 'Pending' ? 'default' :
                          quotation.status === 'Approved' ? 'secondary' : 'destructive'
                      }>
                        {quotation.status}
                      </Badge> */}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(quotation.created_at), 'MMM d, yyyy')}
                      </span>
                      <span>({formatDistanceToNow(new Date(quotation.created_at), { addSuffix: true })})</span>
                      {/* <span className="font-medium text-foreground">₹{parseFloat(quotation.grand_total).toFixed(2)}</span> */}
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Order Summary</h4>
                      <div className="text-sm space-y-1">
                        <p>Total Items: <span className="font-medium">{quotation.total_items}</span></p>
                        {/* <p>Total Amount: <span className="font-medium">₹{parseFloat(quotation.total_amount).toFixed(2)}</span></p> */}
                        {/* <p>Total Discount: <span className="font-medium text-green-600">{discountPercentage.toFixed(1)}% off (₹{discountAmount.toFixed(2)})</span></p> */}
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

                {/* Product Details - Expandable Section with Better UI */}
                {quotation.details && quotation.details.length > 0 && (
                  <div className="mt-4">
                    {/* View Products Button - Improved Design */}
                    <div
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all duration-200",
                        expandedQuotation === quotation.id
                          ? "border-primary bg-primary/5 hover:bg-primary/10"
                          : "border-dashed border-gray-300 dark:border-gray-600 hover:border-primary/50 hover:bg-muted/30"
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
                          <Eye className="w-4 h-4" />
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

                    {/* Products List - Improved Design */}
                    {expandedQuotation === quotation.id && (
                      <div className="mt-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                        {quotation.details.map((detail) => {
                          // Calculate discount amount for each product
                          // const discountPercent = parseFloat(detail.discount);
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
                                    <p className="font-semibold text-foreground">₹{price.toFixed(2)}</p>
                                  </div>
                                  {discountPercent > 0 && (
                                    <div className="bg-green-50 dark:bg-green-950/20 rounded-lg px-3 py-1.5 text-center">
                                      <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Discount</p>
                                      <p className="font-semibold text-green-600 dark:text-green-400">
                                        {discountPercent}% (₹{discountAmount.toFixed(2)})
                                      </p>
                                    </div>
                                  )}
                                  <div className="bg-primary/5 rounded-lg px-3 py-1.5 text-center">
                                    <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Final Price</p>
                                    <p className="font-semibold text-primary">₹{finalPrice.toFixed(2)}</p>
                                  </div>
                                  <div className="bg-muted/30 rounded-lg px-3 py-1.5 text-center">
                                    <p className="text-muted-foreground text-[10px] uppercase tracking-wider">Subtotal</p>
                                    <p className="font-bold text-foreground">₹{parseFloat(detail.subtotal).toFixed(2)}</p>
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
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

// Add this if you don't have cn utility
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}