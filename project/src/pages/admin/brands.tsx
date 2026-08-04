// src/components/admin/AdminBrands.tsx
import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Loader2, Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import axios from 'axios';
import { baseurl } from '@/Baseurl/baseurl';

const API_URL = `${baseurl}/api`;

// Define types
interface Category {
  id: number;
  category_name: string;
}

interface Brand {
  id: string;
  brand_name: string;
  description?: string;
  product_series?: string;
  conductor_type?: string;
  cable_od?: string;
  jacket_material?: string;
  bandwidth?: string;
  operating_temperature?: string;
  poe_support?: string;
  category_id?: number;
  category_name?: string;
  created_at?: string;
  updated_at?: string;
}

interface BrandsResponse {
  success: boolean;
  data: Brand[];
}

interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

interface DeleteResponse {
  success: boolean;
  message?: string;
}

export function AdminBrands() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [_categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);
  const [viewingBrand, setViewingBrand] = useState<Brand | null>(null);

  // Pagination and search
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Fetch brands and categories from API
  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, [page, pageSize]);

  const fetchBrands = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await axios.get<BrandsResponse>(`${API_URL}/brands`);
      if (response.data.success) {
        setBrands(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Failed to load brands');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async (): Promise<void> => {
    try {
      const response = await axios.get<CategoriesResponse>(`${API_URL}/categories`);
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  // Filter brands based on search
  const filteredBrands = brands.filter((brand: Brand) =>
    brand.brand_name.toLowerCase().includes(search.toLowerCase()) ||
    (brand.description && brand.description.toLowerCase().includes(search.toLowerCase()))
  );

  // Paginate filtered brands
  const paginatedBrands = filteredBrands.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(filteredBrands.length / pageSize);

  // Navigate to add brand page
  const handleAddBrand = (): void => {
    navigate('/admin/brands/add');
  };

  // Navigate to edit brand page
  const handleEditBrand = (brand: Brand): void => {
    navigate(`/admin/brands/add/${brand.id}`);
  };

  const handleDelete = async (): Promise<void> => {
    if (!deleteTarget) return;
    
    try {
      setIsDeleting(true);
      const response = await axios.delete<DeleteResponse>(`${API_URL}/brands/${deleteTarget.id}`);
      if (response.data.success) {
        toast.success('Brand deleted successfully');
        await fetchBrands();
        setDeleteTarget(null);
      } else {
        toast.error(response.data.message || 'Failed to delete brand');
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
      toast.error('Failed to delete brand');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (value: string): void => {
    setPageSize(Number(value));
    setPage(1);
  };

  // View brand details
  const handleViewBrand = (brand: Brand): void => {
    setViewingBrand(brand);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading brands...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Brand Management</h2>
          <p className="text-sm text-muted-foreground">Manage brands and their specifications</p>
        </div>
        <Button onClick={handleAddBrand}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Brand
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search brands..." 
            className="pl-9 h-9" 
            value={search} 
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setSearch(e.target.value);
              setPage(1);
            }} 
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredBrands.length} brands found
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">#</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Brand Name</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Product Series</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden xl:table-cell">Conductor Type</th>
                <th className="p-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBrands.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    {search ? 'No brands match your search.' : 'No brands found. Click "Add Brand" to create one.'}
                  </td>
                </tr>
              ) : (
                paginatedBrands.map((brand, index) => (
                  <tr key={brand.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-3 text-sm">
                      {(page - 1) * pageSize + index + 1}
                    </td>
                    <td className="p-3">
                      <span className="font-medium">{brand.brand_name}</span>
                    </td>
                    <td className="p-3 hidden md:table-cell text-sm text-muted-foreground">
                      {brand.category_name || '—'}
                    </td>
                    <td className="p-3 hidden lg:table-cell text-sm text-muted-foreground max-w-[150px] truncate">
                      {brand.product_series || '—'}
                    </td>
                    <td className="p-3 hidden xl:table-cell text-sm text-muted-foreground max-w-[150px] truncate">
                      {brand.conductor_type || '—'}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => handleViewBrand(brand)}
                          aria-label={`View ${brand.brand_name}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => handleEditBrand(brand)}
                          aria-label={`Edit ${brand.brand_name}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive" 
                          onClick={() => setDeleteTarget(brand)}
                          aria-label={`Delete ${brand.brand_name}`}
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
        {filteredBrands.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, filteredBrands.length)} of {filteredBrands.length} brands
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(v: boolean) => !v && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Delete Brand</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete "<span className="font-semibold text-gray-900">{deleteTarget?.brand_name}</span>"? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1 border-gray-300 hover:bg-gray-50" 
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              className="flex-1 bg-red-600 hover:bg-red-700" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Brand Dialog */}
      <Dialog open={!!viewingBrand} onOpenChange={(v: boolean) => !v && setViewingBrand(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Brand Details
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Complete specifications for {viewingBrand?.brand_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Brand Name</p>
                <p className="text-sm text-gray-900 mt-1">{viewingBrand?.brand_name || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p className="text-sm text-gray-900 mt-1">{viewingBrand?.category_name || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Product Series</p>
                <p className="text-sm text-gray-900 mt-1">{viewingBrand?.product_series || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Conductor Type</p>
                <p className="text-sm text-gray-900 mt-1">{viewingBrand?.conductor_type || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Cable OD</p>
                <p className="text-sm text-gray-900 mt-1">{viewingBrand?.cable_od || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Jacket Material</p>
                <p className="text-sm text-gray-900 mt-1">{viewingBrand?.jacket_material || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Bandwidth</p>
                <p className="text-sm text-gray-900 mt-1">{viewingBrand?.bandwidth || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Operating Temperature</p>
                <p className="text-sm text-gray-900 mt-1">{viewingBrand?.operating_temperature || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">PoE Support</p>
                <p className="text-sm text-gray-900 mt-1">{viewingBrand?.poe_support || '—'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="text-sm text-gray-900 mt-1">{viewingBrand?.description || 'No description available'}</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={() => setViewingBrand(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}