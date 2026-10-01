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
  variantImage: string | null; // normalized single image path
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
  // Old format: "/uploads/..."  |  New format: '["/uploads/..."]' (string) or a real array
  variant_image: string | string[] | null;
  // JSON string (or already-parsed array/object)
  variant_details: string | any[] | null;
  created_at: string;
}

const statusBadgeStyles: Record<QuotationStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Approved: 'bg-green-100 text-green-700 border-green-200',
  Rejected: 'bg-red-100 text-red-700 border-red-200',
};

/* -------------------------------------------------------------------------- */
/*                               Helper functions                             */
/* -------------------------------------------------------------------------- */

/** Safe JSON.parse that returns the fallback instead of throwing. */
const safeParse = <T,>(value: unknown, fallback: T): T => {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value !== 'string') return value as T; // already parsed
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

/**
 * Normalizes ANY supported image format into a single image path/URL string.
 *
 * Handles:
 *  - "/uploads/products/a.jpg"               (old format)
 *  - '["/uploads/products/a.jpg"]'           (JSON string array)
 *  - ["/uploads/products/a.jpg"]             (real array)
 *  - '"/uploads/products/a.jpg"'             (JSON-encoded string)
 *  - "a.jpg"                                 (bare filename)
 *  - "https://cdn.example.com/a.jpg"         (full URL)
 *  - null / "" / "[]"                        (-> null)
 */
const extractImagePath = (raw: unknown, depth = 0): string | null => {
  if (raw === null || raw === undefined || depth > 3) return null;

  // Real array -> first usable entry
  if (Array.isArray(raw)) {
    for (const entry of raw) {
      const found = extractImagePath(entry, depth + 1);
      if (found) return found;
    }
    return null;
  }

  if (typeof raw !== 'string') return null;

  const value = raw.trim();
  if (!value || value === '[]' || value === 'null') return null;

  // JSON string array or JSON-encoded string: '["..."]' or '"..."'
  if (value.startsWith('[') || value.startsWith('"')) {
    try {
      return extractImagePath(JSON.parse(value), depth + 1);
    } catch {
      // Malformed JSON: strip brackets/quotes manually as a last resort
      const cleaned = value.replace(/^[\[\s"']+|[\]\s"']+$/g, '').trim();
      return cleaned || null;
    }
  }

  // Plain path or URL
  return value;
};

/** Builds a full image URL from a normalized path. */
const buildImageUrl = (imagePath: string | null): string | null => {
  if (!imagePath) return null;

  // Already a full URL
  if (/^https?:\/\//i.test(imagePath)) return imagePath;

  const base = String(baseurl).replace(/\/+$/, '');
  const path = imagePath.replace(/\\/g, '/'); // Windows-style slashes

  if (path.startsWith('/')) return `${base}${path}`;
  if (path.startsWith('uploads/')) return `${base}/${path}`;
  return `${base}/uploads/products/${path}`;
};

/* -------------------------------------------------------------------------- */
/*                               Product image                                */
/* -------------------------------------------------------------------------- */

/**
 * Product image with a safe, local fallback (no external placeholder requests).
 * If the image fails to load, it switches once to the icon placeholder.
 */
function ProductImage({ src, alt }: { src: string | null; alt: string }) {
  const [failed, setFailed] = useState(false);

  // Reset the failed state whenever the source changes
  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200">
        <ImageIcon className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      loading="lazy"
      onError={() => {
        console.warn('Image failed to load:', src);
        setFailed(true);
      }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */

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

        const transformedData: Quotation = {
          id: apiQuotation.id.toString(),
          quotationNumber: apiQuotation.quotation_no,
          customerName: apiQuotation.customer_name,
          customerEmail: apiQuotation.customer_email,
          customerPhone: apiQuotation.customer_mobile,
          status: mapStatus(apiQuotation.status),
          items: apiItems.map((item: ApiQuotationDetail): QuotationItem => {
            // Parse variant details safely (string, array, or null)
            const parsedDetails = safeParse<any>(item.variant_details, null);
            const firstVariant = Array.isArray(parsedDetails) ? parsedDetails[0] : parsedDetails;

            // Prefer variant_image; fall back to image_url inside variant_details
            const imagePath =
              extractImagePath(item.variant_image) ??
              extractImagePath(firstVariant?.image_url);

            return {
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
              variantImage: imagePath,
              variantDetails: parsedDetails,
            };
          }),
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
      maximumFractionDigits: 2,
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
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/quotations')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Quotation Details</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge
            className={cn(
              'text-sm px-4 py-1 border-2 font-medium',
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
                  const imageUrl = buildImageUrl(item.variantImage);

                  return (
                    <div key={item.id}>
                      {index > 0 && <Separator className="my-4" />}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-4">
                          {/* Product Image */}
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border">
                            <ProductImage src={imageUrl} alt={item.productName} />
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
    </div>
  );
}