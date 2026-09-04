// src/components/admin/AdminProducts.tsx
import { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Loader2, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { baseurl } from '@/Baseurl/baseurl';

// Updated Product interface with proper variant structure
interface Product {
  id: number;
  product_name: string;
  product_code: string;
  product_category_id: number | null;
  product_brand: string;
  product_description: string;
  min_price: string | null;
  max_price: string | null;
  warranty: string;
  created_at: string;
  updated_at: string;
  category_name: string;
  subcategory_name: string;
  product_details_pdf: string;
  discount: string;
  specifications: any;
  variants?: Array<{
    id: number;
    product_id: number;
    variant_name: string;
    part_code: string;
    color: string;
    size: string;
    availability: string;
    image_url: string; // Can be JSON string or direct URL
    stock: number;
    min_price: string;
    max_price: string;
    category_id: number;
    sub_category_id: number;
  }>;
}

interface Category {
  id: number;
  category_name: string;
  created_at: string;
  updated_at: string;
}

interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface CategoryResponse {
  success: boolean;
  data: Category[];
}

interface DeleteResponse {
  success: boolean;
  message?: string;
}

type SortField = 'name' | 'createdAt';
type SortDirection = 'asc' | 'desc';

interface AdminProductsProps {
  onEditProduct?: (productId: number) => void;
  onViewProduct?: (productId: number) => void;
}

export function AdminProducts({ onEditProduct, onViewProduct }: AdminProductsProps) {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [search, categoryFilter, page, pageSize]);

  const fetchCategories = async (): Promise<void> => {
    try {
      const response = await fetch(`${baseurl}/api/categories/`);
      const data: CategoryResponse = await response.json();
      if (data.success) {
        console.log('Fetched categories:', data.data);
        setCategories(data.data);
      } else {
        console.error('Failed to fetch categories:', data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    }
  };

  const fetchProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      
      let url = `${baseurl}/api/products/products-with-variants?page=${page}&limit=${pageSize}`;
      
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      if (categoryFilter !== 'all') {
        url += `&categoryId=${categoryFilter}`;
      }

      const response = await fetch(url);
      const data: ProductsResponse | Product[] = await response.json();
      
      if (Array.isArray(data)) {
        setProducts(data);
        setTotalProducts(data.length);
      } else if (data.success && Array.isArray(data.data)) {
        setProducts(data.data);
        setTotalProducts(data.pagination?.total || data.data.length);
      } else {
        console.error('Unexpected API response format:', data);
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedProducts = useMemo((): Product[] => {
    let result = [...products];
    
    if (search && products.length > 0) {
      const q = search.toLowerCase();
      result = result.filter((p) => 
        p.product_name.toLowerCase().includes(q) || 
        p.product_code?.toLowerCase().includes(q) || 
        p.product_brand?.toLowerCase().includes(q)
      );
    }
    
    if (categoryFilter !== 'all') {
      result = result.filter((p) => 
        p.product_category_id === parseInt(categoryFilter)
      );
    }
    
    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') {
        cmp = a.product_name.localeCompare(b.product_name);
      } else {
        cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    
    return result;
  }, [products, search, categoryFilter, sortField, sortDir]);

  const totalPages = Math.ceil(totalProducts / pageSize);
  const paginated = filteredAndSortedProducts;

  const handleDelete = async (): Promise<void> => {
    if (!deleteTarget) return;
    
    try {
      const response = await fetch(`${baseurl}/api/products/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      
      const data: DeleteResponse = await response.json();
      
      if (data.success) {
        toast.success(`Product "${deleteTarget.product_name}" deleted`);
        setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        setDeleteTarget(null);
        fetchProducts();
      } else {
        toast.error(data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  /**
   * Extract the first variant image URL from a product
   * Handles both JSON array format and direct string format
   */
  const getFirstVariantImage = (product: Product): string => {
    if (!product.variants || product.variants.length === 0) {
      return '/placeholder-image.jpg';
    }

    const firstVariant = product.variants[0];
    const imageUrl = firstVariant.image_url;
    
    if (!imageUrl) {
      return '/placeholder-image.jpg';
    }

    try {
      // Try to parse as JSON array (format: "[\"/uploads/products/image.jpg\"]")
      const parsed = JSON.parse(imageUrl);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0]; // Return first image from array
      }
      return imageUrl; // If parsed but not an array, return as is
    } catch {
      // If not JSON, treat as direct URL string
      return imageUrl;
    }
  };

  /**
   * Get the full image URL with base URL
   */
  const getImageUrl = (imagePath: string): string => {
    if (!imagePath || imagePath === '/placeholder-image.jpg') {
      return '/placeholder-image.jpg';
    }
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Ensure path starts with '/'
    const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${baseurl}${normalizedPath}`;
  };

  /**
   * Get product display image with error handling
   */
  const getProductDisplayImage = (product: Product): string => {
    const imageKey = `product-${product.id}`;
    
    // If we already had an error loading this image, use placeholder
    if (imageErrors[imageKey]) {
      return '/placeholder-image.jpg';
    }

    const firstVariantImage = getFirstVariantImage(product);
    return getImageUrl(firstVariantImage);
  };

  /**
   * Handle image load errors
   */
  const handleImageError = (productId: number): void => {
    const imageKey = `product-${productId}`;
    setImageErrors(prev => ({ ...prev, [imageKey]: true }));
  };

  const handleEditClick = (productId: number): void => {
    if (onEditProduct) {
      onEditProduct(productId);
    } else {
      navigate(`/admin/products/edit/${productId}`);
    }
  };

  const handleViewClick = (productId: number): void => {
    if (onViewProduct) {
      onViewProduct(productId);
    } else {
      navigate(`/admin/products/view/${productId}`);
    }
  };

  const handlePageSizeChange = (value: string): void => {
    setPageSize(Number(value));
    setPage(1);
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Product Management</h2>
          <p className="text-sm text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button onClick={() => navigate('/admin/products/add')}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Product
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 flex-1">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-9 h-9" 
              value={search} 
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setSearch(e.target.value);
                setPage(1);
              }} 
            />
          </div>
          <Select value={categoryFilter} onValueChange={(value: string) => {
            setCategoryFilter(value);
            setPage(1);
          }}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.category_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortField} onValueChange={(value: SortField) => setSortField(value)}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="createdAt">Date</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9"
            onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
          >
            {sortDir === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          {totalProducts} products found
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">#</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Sub Category</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Brand</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Created</th>
                <th className="p-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No products found. Click "Add Product" to create one.
                  </td>
                </tr>
              ) : (
                paginated.map((product, index) => {
                  const displayImage = getProductDisplayImage(product);
                  const imageKey = `product-${product.id}`;
                  const hasError = imageErrors[imageKey] || false;
                  
                  return (
                    <tr key={product.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 text-sm">
                        {(page - 1) * pageSize + index + 1}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                            {!hasError ? (
                              <img 
                                src={displayImage}
                                alt={product.product_name}
                                className="w-full h-full object-cover"
                                onError={() => handleImageError(product.id)}
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-xs">
                                No Image
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-sm truncate max-w-[200px]">{product.product_name}</div>
                            <div className="text-xs text-muted-foreground">{product.product_code || 'No SKU'}</div>
                            {product.variants && product.variants.length > 0 && (
                              <div className="text-xs text-muted-foreground">
                                {product.variants.length} variant{product.variants.length > 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        <Badge variant="outline" className="text-xs">{product.category_name || 'N/A'}</Badge>
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          {product.subcategory_name || 'N/A'}
                        </Badge>
                      </td>
                      <td className="p-3 hidden lg:table-cell text-sm">{product.product_brand || 'N/A'}</td>
                      <td className="p-3 hidden lg:table-cell text-sm text-muted-foreground">
                        {new Date(product.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => handleViewClick(product.id)}
                            title="View Product Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => handleEditClick(product.id)}
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive" 
                            onClick={() => setDeleteTarget(product)}
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalProducts > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, totalProducts)} of {totalProducts} products
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Show</span>
                <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
                  <SelectTrigger className="w-[70px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">entries</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === 1} 
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm">Page {page} of {totalPages || 1}</span>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page === totalPages || totalPages === 0} 
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(v: boolean) => !v && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Delete Product</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete "<span className="font-semibold text-gray-900">{deleteTarget?.product_name}</span>"? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1 border-gray-300 hover:bg-gray-50" 
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              className="flex-1 bg-red-600 hover:bg-red-700" 
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}