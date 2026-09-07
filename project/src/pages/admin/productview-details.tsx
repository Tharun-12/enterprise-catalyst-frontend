// src/pages/admin/product-view.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Edit,
  Loader2,
  Tag,
  Layers,
  BadgeCheck,
  ShieldCheck,
  CalendarDays,
  Weight,
  Ruler,
  FileText,
  PackageSearch,
  ImageOff,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  price?: string; // Made optional as it might not be in API
  min_price?: string;
  max_price?: string;
  availability?: string;
  datasheet_url?: string;
  image_url: string | string[];
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
  subcategory_name: string;
  product_details_pdf: string;
  dimensions: string;
  specifications: Record<string, string> | string;
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

      // Parse image_url for each variant if it's a JSON string
      if (data.variants) {
        data.variants = data.variants.map((variant: Variant) => ({
          ...variant,
          image_url: parseImageUrl(variant.image_url),
        }));
      }

      setProduct(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load product details';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to parse image_url
  const parseImageUrl = (imageUrl: string | string[]): string[] => {
    if (!imageUrl) {
      return ['/placeholder-image.jpg'];
    }

    if (Array.isArray(imageUrl)) {
      return imageUrl.length > 0 ? imageUrl : ['/placeholder-image.jpg'];
    }

    if (typeof imageUrl === 'string') {
      if (imageUrl.startsWith('[') && imageUrl.endsWith(']')) {
        try {
          const parsed = JSON.parse(imageUrl);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (e) {
          // If parsing fails, treat as single URL
        }
      }

      return [imageUrl];
    }

    return ['/placeholder-image.jpg'];
  };

  const getImageUrl = (imageUrl: string | string[]): string => {
    if (!imageUrl) {
      return '/placeholder-image.jpg';
    }

    let url: string;

    if (Array.isArray(imageUrl)) {
      url = imageUrl.length > 0 ? imageUrl[0] : '/placeholder-image.jpg';
    } else {
      url = imageUrl;
    }

    if (!url || url === '/placeholder-image.jpg') {
      return '/placeholder-image.jpg';
    }

    if (url.startsWith('http')) {
      return url;
    }

    const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
    return `${baseurl}${normalizedUrl}`;
  };

  // Get all image URLs for a variant
  const getImageUrls = (imageUrl: string | string[]): string[] => {
    if (!imageUrl) {
      return ['/placeholder-image.jpg'];
    }

    if (Array.isArray(imageUrl)) {
      return imageUrl.length > 0 ? imageUrl : ['/placeholder-image.jpg'];
    }

    return [imageUrl];
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
    if (!amount) return '₹0';
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

  const hasValidValue = (value: string | null | undefined): boolean => {
    if (!value) return false;
    const trimmed = value.trim();
    return trimmed !== '' && trimmed !== 'N/A' && trimmed !== 'n/a' && trimmed !== 'NA';
  };

  const getDisplayValue = (value: string | null | undefined, suffix: string = ''): string => {
    if (!hasValidValue(value)) return '';
    return `${value}${suffix}`;
  };

  const getSpecifications = (product: Product): Array<{ label: string; value: string }> => {
    const specs = [];

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

  // Stock level -> tone, used consistently across the page
  const getStockTone = (stock: number): { label: string; classes: string } => {
    if (stock <= 0) return { label: 'Out of stock', classes: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200' };
    if (stock <= 10) return { label: `${stock} units`, classes: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200' };
    return { label: `${stock} units`, classes: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-teal-700 mx-auto" />
          <p className="mt-4 text-sm text-slate-500">Loading product details…</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-rose-600 text-base mb-4">{error || 'Product not found'}</p>
          <Button onClick={() => navigate('/admin/products')} className="bg-teal-700 hover:bg-teal-800">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const specifications = getSpecifications(product);
  const heroImage = product.variants?.length ? getImageUrl(product.variants[0].image_url) : '/placeholder-image.jpg';
  const discountValue = parseFloat(product.discount);

  return (
    <div className="min-h-screen bg-slate-50/60">
      <div className="container mx-auto max-w-6xl px-4 py-6 space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/products')}
              className="mt-0.5 text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
            </Button>
            <div className="border-l border-slate-200 pl-3">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{product.product_name}</h1>
              <p className="mt-1 text-sm text-slate-500">
                {product.product_code || 'No product code'} · {product.category_name || 'Uncategorised'}
                {product.subcategory_name ? ` / ${product.subcategory_name}` : ''}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit} className="border-slate-300">
              <Edit className="w-4 h-4 mr-2" /> Edit product
            </Button>
            {product.product_details_pdf && (
              <Button
                onClick={() => handleDownloadPDF(product.product_details_pdf)}
                className="bg-teal-700 hover:bg-teal-800"
              >
                <Download className="w-4 h-4 mr-2" /> Download PDF
              </Button>
            )}
          </div>
        </div>

        {/* Overview: hero image + key facts + price */}
        <div className="grid gap-5 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
              {heroImage !== '/placeholder-image.jpg' ? (
                <img
                  src={heroImage}
                  alt={product.product_name}
                  className="h-full w-full object-cover"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-300">
                  <ImageOff className="h-10 w-10" />
                  <span className="text-xs text-slate-400">No image available</span>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-5">
            {/* Price block */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <div>
                  {/* <p className="text-sm text-slate-500">Price range</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight text-amber-700">
                    {formatCurrency(product.min_price)}
                    <span className="mx-1.5 text-slate-300 font-normal">–</span>
                    {formatCurrency(product.max_price)}
                  </p> */}
                </div>
                {/* {discountValue > 0 && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                    {product.discount}% off
                  </span>
                )} */}
              </div>
              {hasValidValue(product.product_description) && (
                <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-600">
                  {product.product_description}
                </p>
              )}
            </div>

            {/* Key facts */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Fact icon={Tag} label="Brand" value={product.product_brand || '—'} />
              <Fact icon={Layers} label="Category" value={product.category_name || '—'} />
              <Fact icon={BadgeCheck} label="Sub-category" value={product.subcategory_name || '—'} />
              <Fact icon={ShieldCheck} label="Warranty" value={product.warranty || '—'} />
              {hasValidValue(product.weight) && (
                <Fact icon={Weight} label="Weight" value={getDisplayValue(product.weight, ' kg')} />
              )}
              {hasValidValue(product.dimensions) && (
                <Fact icon={Ruler} label="Dimensions" value={product.dimensions} />
              )}
              <Fact icon={CalendarDays} label="Added" value={formatDate(product.created_at)} />
              {product.product_details_pdf ? (
                <button
                  onClick={() => handleDownloadPDF(product.product_details_pdf)}
                  className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white p-3 text-left hover:border-teal-300 hover:bg-teal-50/40 transition-colors"
                >
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                  <span>
                    <span className="block text-xs text-slate-500">Datasheet</span>
                    <span className="block text-sm font-medium text-teal-700">View PDF</span>
                  </span>
                </button>
              ) : (
                <Fact icon={FileText} label="Datasheet" value="Not available" />
              )}
            </div>
          </div>
        </div>

        {/* Specifications */}
        {specifications.length > 0 && (
          <Card className="border-slate-200 shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900">Technical specifications</CardTitle>
              <CardDescription>Detailed product specifications and technical data</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid gap-x-8 sm:grid-cols-2">
                {specifications.map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-baseline justify-between gap-4 border-b border-slate-100 py-2.5 last:border-0 sm:last:[&:nth-last-child(2)]:border-0"
                  >
                    <span className="text-sm text-slate-500">{spec.label}</span>
                    <span className="text-right text-sm font-medium text-slate-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Variants */}
        {product.variants && product.variants.length > 0 && (
          <div>
            <div className="mb-4 flex items-baseline justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Variants <span className="font-normal text-slate-400">({product.variants.length})</span>
                </h2>
                <p className="text-sm text-slate-500">Available color options and stock details</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.variants.map((variant) => {
                const imageUrls = getImageUrls(variant.image_url);
                const firstImage = getImageUrl(variant.image_url);
                const stock = getStockTone(variant.stock);

                return (
                  <div
                    key={variant.id}
                    className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-sm"
                  >
                    <div className="relative aspect-[4/3] w-full bg-slate-50">
                      {firstImage !== '/placeholder-image.jpg' ? (
                        <img
                          src={firstImage}
                          alt={`${variant.color || 'Default'} variant`}
                          className="h-full w-full object-cover"
                          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-300">
                          <ImageOff className="h-8 w-8" />
                        </div>
                      )}

                      {imageUrls.length > 1 && (
                        <div className="absolute bottom-2 right-2 flex gap-1">
                          {imageUrls.slice(1, 4).map((url, idx) => (
                            <div
                              key={idx}
                              className="h-8 w-8 overflow-hidden rounded-md border-2 border-white bg-slate-100 shadow-sm"
                            >
                              <img
                                src={url}
                                alt={`${variant.color || 'Default'} variant ${idx + 2}`}
                                className="h-full w-full object-cover"
                                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                          ))}
                          {imageUrls.length > 4 && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-white bg-slate-800/80 text-[11px] font-medium text-white shadow-sm">
                              +{imageUrls.length - 4}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col gap-3 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-4 w-4 shrink-0 rounded-full ring-1 ring-inset ring-black/10"
                            style={{ backgroundColor: variant.color || '#808080' }}
                          />
                          <span className="text-sm font-medium text-slate-900">{variant.color || 'Default'}</span>
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${stock.classes}`}>
                          {stock.label}
                        </span>
                      </div>

                      {variant.spec_type && (
                        <p className="text-xs text-slate-500">{variant.spec_type}</p>
                      )}

                      <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-3">
                        <div>
                          <p className="text-xs text-slate-500">Price range</p>
                          <p className="text-sm font-semibold text-amber-700">
                            {formatCurrency(variant.min_price || '0')}
                            <span className="mx-1 text-slate-300 font-normal">–</span>
                            {formatCurrency(variant.max_price || '0')}
                          </p>
                        </div>
                        {variant.size && (
                          <div className="text-right">
                            <p className="text-xs text-slate-500">Size</p>
                            <p className="text-sm font-medium text-slate-900">{variant.size}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {product.variants && product.variants.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 py-12 text-center">
            <PackageSearch className="h-8 w-8 text-slate-300" />
            <p className="text-sm text-slate-500">No variants have been added for this product yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-white p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
      <span>
        <span className="block text-xs text-slate-500">{label}</span>
        <span className="block text-sm font-medium text-slate-900">{value}</span>
      </span>
    </div>
  );
}