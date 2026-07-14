import { useState, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, CheckSquare, Square } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { products as allProducts, categories, brands } from '@/data';
import type { Product } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>(allProducts);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState<'name' | 'createdAt'>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    let result = [...products];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.brandName.toLowerCase().includes(q));
    }
    if (categoryFilter !== 'all') {
      const cat = categories.find((c) => c.slug === categoryFilter);
      if (cat) result = result.filter((p) => p.categoryId === cat.id);
    }
    if (statusFilter !== 'all') result = result.filter((p) => p.status === statusFilter);
    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') cmp = a.name.localeCompare(b.name);
      else cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [products, search, categoryFilter, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };
  const toggleSelectAll = () => {
    setSelected(selected.length === paginated.length ? [] : paginated.map((p) => p.id));
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    toast.success(`Product "${deleteTarget.name}" deleted`);
    setDeleteTarget(null);
  };

  const handleBulkDelete = () => {
    setProducts((prev) => prev.filter((p) => !selected.includes(p.id)));
    toast.success(`${selected.length} products deleted`);
    setSelected([]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    if (editingProduct) {
      setProducts((prev) => prev.map((p) => p.id === editingProduct.id ? { ...p, name } : p));
      toast.success('Product updated');
    } else {
      toast.success('Product added');
    }
    setDrawerOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 flex-1">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => { setEditingProduct(null); setDrawerOpen(true); }}>
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
                    {selected.length === paginated.length && paginated.length > 0 ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Brand</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                  <button onClick={() => { setSortField('createdAt'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }}>Created</button>
                </th>
                <th className="p-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((product) => (
                <tr key={product.id} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-3">
                    <button onClick={() => toggleSelect(product.id)}>
                      {selected.includes(product.id) ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4 text-muted-foreground" />}
                    </button>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={product.gallery[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate max-w-[200px]">{product.name}</div>
                        <div className="text-xs text-muted-foreground">{product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 hidden md:table-cell"><Badge variant="outline" className="text-xs">{product.categoryName}</Badge></td>
                  <td className="p-3 hidden lg:table-cell text-sm">{product.brandName}</td>
                  <td className="p-3">
                    <Badge className={cn('text-xs', product.status === 'active' ? 'bg-green-100 text-green-700' : product.status === 'draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700')}>
                      {product.status}
                    </Badge>
                  </td>
                  <td className="p-3 hidden lg:table-cell text-sm text-muted-foreground">{new Date(product.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingProduct(product); setDrawerOpen(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(product)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {paginated.length} of {filtered.length} products
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm">Page {page} of {totalPages || 1}</span>
            <Button variant="outline" size="sm" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Add/Edit Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[500px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</SheetTitle>
            <SheetDescription>{editingProduct ? 'Update product information' : 'Create a new product in the catalog'}</SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSave} className="space-y-4 mt-6">
            <div className="space-y-1.5">
              <Label htmlFor="p-name" className="text-xs">Product Name *</Label>
              <Input id="p-name" name="name" required defaultValue={editingProduct?.name} placeholder="Enter product name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-sku" className="text-xs">SKU</Label>
              <Input id="p-sku" name="sku" defaultValue={editingProduct?.sku} placeholder="MV-CCT-00001" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="p-category" className="text-xs">Category</Label>
                <Select defaultValue={editingProduct?.categoryId}>
                  <SelectTrigger id="p-category"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-brand" className="text-xs">Brand</Label>
                <Select defaultValue={editingProduct?.brandId}>
                  <SelectTrigger id="p-brand"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {brands.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-short" className="text-xs">Short Description</Label>
              <Input id="p-short" name="shortDescription" defaultValue={editingProduct?.shortDescription} placeholder="Brief product description" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-desc" className="text-xs">Full Description</Label>
              <Textarea id="p-desc" name="description" defaultValue={editingProduct?.description} placeholder="Detailed product description" className="resize-none" rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="p-price" className="text-xs">Price (INR)</Label>
                <Input id="p-price" name="price" type="number" defaultValue={editingProduct?.price} placeholder="0" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="p-warranty" className="text-xs">Warranty</Label>
                <Input id="p-warranty" name="warranty" defaultValue={editingProduct?.warranty} placeholder="2 years" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="p-popular" defaultChecked={editingProduct?.isPopular} />
                <Label htmlFor="p-popular" className="text-xs">Mark as Popular</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="p-new" defaultChecked={editingProduct?.isNew} />
                <Label htmlFor="p-new" className="text-xs">Mark as New</Label>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setDrawerOpen(false)}>Cancel</Button>
              <Button type="submit" className="flex-1">{editingProduct ? 'Save Changes' : 'Add Product'}</Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>Are you sure you want to delete "{deleteTarget?.name}"? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" className="flex-1" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
