import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, CheckSquare, Square, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';

// Updated interface to match API response
interface Product {
  id: number;
  product_name: string;
  product_code: string;
  product_category_id: number;
  product_brand: string;
  product_description: string;
  price: string;
  warranty: string;
  created_at: string;
  updated_at: string;
  category_name: string;
  product_details_pdf: string;
  dimensions: string;
  specifications: string;
  weight: string;
  discount: string;
  variants?: Array<{
    id: number;
    product_id: number;
    color_name: string;
    color_hex: string;
    price: string;
    stock: number;
    image_url: string;
  }>;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface AdminProductsProps {
  onEditProduct?: (productId: number) => void;
}

export function AdminProducts({ onEditProduct }: AdminProductsProps) {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortField, setSortField] = useState<'name' | 'createdAt'>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  // Fetch products and categories
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [search, categoryFilter, page]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories/');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      let url = `http://localhost:5000/api/products/products-with-variants?page=${page}&limit=${pageSize}`;
      
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      if (categoryFilter !== 'all') {
        url += `&categoryId=${categoryFilter}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
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

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
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

  const toggleSelect = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };
  
  const toggleSelectAll = () => {
    setSelected(selected.length === paginated.length ? [] : paginated.map((p) => p.id));
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/products/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
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

  const handleBulkDelete = async () => {
    try {
      const promises = selected.map((id) =>
        fetch(`http://localhost:5000/api/products/${id}`, {
          method: 'DELETE',
        })
      );
      
      await Promise.all(promises);
      toast.success(`${selected.length} products deleted`);
      setSelected([]);
      fetchProducts();
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      toast.error('Failed to delete products');
    }
  };

  const getProductImage = (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      return product.variants[0].image_url;
    }
    return '/placeholder-image.jpg';
  };

  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl || imageUrl === '/placeholder-image.jpg') {
      return '/placeholder-image.jpg';
    }
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    const normalizedUrl = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    return `http://localhost:5000${normalizedUrl}`;
  };

  const handleEditClick = (productId: number) => {
    if (onEditProduct) {
      onEditProduct(productId);
    } else {
      // Navigate to edit page with product ID
      navigate(`/admin/products/edit/${productId}`);
    }
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
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 flex-1">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search products..." 
              className="pl-9 h-9" 
              value={search} 
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }} 
            />
          </div>
          <Select value={categoryFilter} onValueChange={(value) => {
            setCategoryFilter(value);
            setPage(1);
          }}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => navigate('/admin/products/add')}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Product
        </Button>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <span className="text-sm font-medium">{selected.length} selected</span>
          <Button variant="outline" size="sm" onClick={handleBulkDelete} className="text-destructive hover:text-destructive">
            <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete Selected
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setSelected([])}>Clear</Button>
        </div>
      )}

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="p-3 w-10">
                  <button onClick={toggleSelectAll}>
                    {selected.length === paginated.length && paginated.length > 0 ? 
                      <CheckSquare className="w-4 h-4 text-primary" /> : 
                      <Square className="w-4 h-4 text-muted-foreground" />
                    }
                  </button>
                </th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Brand</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
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
                paginated.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <button onClick={() => toggleSelect(product.id)}>
                        {selected.includes(product.id) ? 
                          <CheckSquare className="w-4 h-4 text-primary" /> : 
                          <Square className="w-4 h-4 text-muted-foreground" />
                        }
                      </button>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                          <img 
                            src={getImageUrl(getProductImage(product))} 
                            alt={product.product_name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-sm truncate max-w-[200px]">{product.product_name}</div>
                          <div className="text-xs text-muted-foreground">{product.product_code || 'No SKU'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      <Badge variant="outline" className="text-xs">{product.category_name}</Badge>
                    </td>
                    <td className="p-3 hidden lg:table-cell text-sm">{product.product_brand}</td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="font-medium">₹{parseFloat(product.price).toLocaleString('en-IN')}</span>
                        {parseFloat(product.discount) > 0 && (
                          <span className="text-xs text-green-600">-{product.discount}%</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 hidden lg:table-cell text-sm text-muted-foreground">
                      {new Date(product.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => handleEditClick(product.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive" 
                          onClick={() => setDeleteTarget(product)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {paginated.length} of {totalProducts} products
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
      </Card>

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteTarget?.product_name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" className="flex-1" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}