// src/pages/admin/product-view.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Edit, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { baseurl } from '@/Baseurl/baseurl';

interface Variant {
  id: number;
  product_id: number;
  variant_name?: string;
  part_code?: string;
  category?: string;
  sub_category?: string;
  brand?: string;
  description?: string;
  spec_type?: string;
  color?: string;
  size?: string;
  price: string;
  min_price?: string;
  max_price?: string;
  availability?: string;
  datasheet_url?: string;
  image_url: string;
  stock: number;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: number;
  product_name: string;
  product_code: string;
  product_category_id: number;
  product_brand: string;
  product_description: string;
  price: string;
  min_price: string;
  max_price: string;
  warranty: string;
  created_at: string;
  updated_at: string;
  category_name: string;
  subcategory_name: string; // Added subcategory_name
  product_details_pdf: string;
  dimensions: string;
  specifications: Record<string, string> | string; // Changed to accept object or string
  weight: string;
  discount: string;
  product_series?: string;
  product_type?: string;
  conductor_type?: string;
  cable_od?: string;
  jacket_material?: string;
  bandwidth?: string;
  operating_temperature?: string;
  poe_support?: string;
  variants: Variant[];
}

export function ProductView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${baseurl}/api/products/products-with-variants/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found');
        }
        throw new Error('Failed to fetch product details');
      }
      
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load product details';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageUrl: string): string => {
    if (!imageUrl || imageUrl === '/placeholder-image.jpg') {
      return '/placeholder-image.jpg';
    }
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    const normalizedUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    return `${baseurl}${normalizedUrl}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: string): string => {
    return `₹${parseFloat(amount).toLocaleString('en-IN')}`;
  };

  const handleDownloadPDF = (pdfFilename: string) => {
    if (!pdfFilename) {
      toast.error('No PDF available for this product');
      return;
    }
    const pdfUrl = `${baseurl}/uploads/pdfs/${pdfFilename}`;
    window.open(pdfUrl, '_blank');
  };

  const handleEdit = () => {
    navigate(`/admin/products/edit/${id}`);
  };

  // Helper function to check if a value is empty or N/A
  const hasValidValue = (value: string | null | undefined): boolean => {
    if (!value) return false;
    const trimmed = value.trim();
    return trimmed !== '' && trimmed !== 'N/A' && trimmed !== 'n/a' && trimmed !== 'NA';
  };

  // Helper to get display value
  const getDisplayValue = (value: string | null | undefined, suffix: string = ''): string => {
    if (!hasValidValue(value)) return '';
    return `${value}${suffix}`;
  };

  // Get all specification fields from the specifications object
  const getSpecifications = (product: Product): Array<{ label: string; value: string }> => {
    const specs = [];
    
    // Check if specifications is an object
    if (product.specifications && typeof product.specifications === 'object') {
      const specObj = product.specifications as Record<string, string>;
      for (const [key, value] of Object.entries(specObj)) {
        if (hasValidValue(value)) {
          specs.push({ label: key, value: value });
        }
      }
    } else if (typeof product.specifications === 'string' && hasValidValue(product.specifications)) {
      specs.push({ label: 'Additional Specifications', value: product.specifications });
    }
    
    // Also check individual fields as fallback
    if (specs.length === 0) {
      if (hasValidValue(product.product_series)) {
        specs.push({ label: 'Product Series', value: product.product_series! });
      }
      if (hasValidValue(product.product_type)) {
        specs.push({ label: 'Product Type', value: product.product_type! });
      }
      if (hasValidValue(product.conductor_type)) {
        specs.push({ label: 'Conductor Type', value: product.conductor_type! });
      }
      if (hasValidValue(product.cable_od)) {
        specs.push({ label: 'Cable OD', value: product.cable_od! });
      }
      if (hasValidValue(product.jacket_material)) {
        specs.push({ label: 'Jacket Material', value: product.jacket_material! });
      }
      if (hasValidValue(product.bandwidth)) {
        specs.push({ label: 'Bandwidth', value: product.bandwidth! });
      }
      if (hasValidValue(product.operating_temperature)) {
        specs.push({ label: 'Operating Temperature', value: product.operating_temperature! });
      }
      if (hasValidValue(product.poe_support)) {
        specs.push({ label: 'PoE Support', value: product.poe_support! });
      }
    }
    
    return specs;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error || 'Product not found'}</p>
          <Button onClick={() => navigate('/admin/products')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const specifications = getSpecifications(product);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/products')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{product.product_name}</h1>
            <p className="text-sm text-muted-foreground">
              Product Code: {product.product_code || 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="w-4 h-4 mr-2" /> Edit Product
          </Button>
          {product.product_details_pdf && (
            <Button variant="outline" onClick={() => handleDownloadPDF(product.product_details_pdf)}>
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Product Name</span>
              <span className="font-medium">{product.product_name}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Product Code</span>
              <span className="font-medium">{product.product_code || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Category</span>
              <Badge variant="outline">{product.category_name || 'N/A'}</Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Sub Category</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {product.subcategory_name || 'N/A'}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Brand</span>
              <span className="font-medium">{product.product_brand || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Warranty</span>
              <span className="font-medium">{product.warranty || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Created At</span>
              <span className="text-sm">{formatDate(product.created_at)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Dimensions - REMOVED PRICE RANGE */}
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {parseFloat(product.discount) > 0 && (
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Discount</span>
                <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
                  {product.discount}% OFF
                </Badge>
              </div>
            )}
            {/* Only show Weight if it has a valid value */}
            {hasValidValue(product.weight) && (
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Weight</span>
                <span className="font-medium">{getDisplayValue(product.weight, ' kg')}</span>
              </div>
            )}
            {/* Only show Dimensions if it has a valid value */}
            {hasValidValue(product.dimensions) && (
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Dimensions</span>
                <span className="font-medium text-sm">{product.dimensions}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">PDF Document</span>
              {product.product_details_pdf ? (
                <Button 
                  variant="link" 
                  className="px-0 h-auto" 
                  onClick={() => handleDownloadPDF(product.product_details_pdf)}
                >
                  View PDF
                </Button>
              ) : (
                <span className="text-sm text-muted-foreground">No PDF available</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground whitespace-pre-wrap">
            {product.product_description || 'No description provided'}
          </p>
        </CardContent>
      </Card>

      {/* Specifications - Always show if there are any */}
      {specifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Technical Specifications</CardTitle>
            <CardDescription>Detailed product specifications and technical data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {specifications.map((spec, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center py-2 border-b last:border-0"
                >
                  <span className="text-sm text-muted-foreground">{spec.label}</span>
                  <span className="font-medium text-sm text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Variants */}
      {product.variants && product.variants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Variants ({product.variants.length})</CardTitle>
            <CardDescription>Available color options and stock details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {product.variants.map((variant) => (
                <div
                  key={variant.id}
                  className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-gray-200 shrink-0"
                      style={{ backgroundColor: variant.color || '#808080' }}
                    />
                    <div>
                      <p className="font-medium">{variant.color || 'Default'}</p>
                      {variant.spec_type && (
                        <p className="text-xs text-muted-foreground">Type: {variant.spec_type}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium ml-1">{formatCurrency(variant.price)}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Stock:</span>
                      <Badge 
                        variant={variant.stock > 10 ? "default" : "destructive"} 
                        className="ml-1"
                      >
                        {variant.stock} units
                      </Badge>
                    </div>
                  </div>
                  
                  {variant.size && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Size: </span>
                      <span className="font-medium">{variant.size}</span>
                    </div>
                  )}
                  
                  {variant.image_url && (
                    <div className="relative h-32 w-full rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={getImageUrl(variant.image_url)}
                        alt={`${variant.color || 'Default'} variant`}
                        className="w-full h-full object-cover"
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}