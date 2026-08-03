// src/components/admin/AdminBrands.tsx
import { useState, useEffect, ChangeEvent } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Loader2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
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
interface Brand {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

interface BrandsResponse {
  success: boolean;
  data: Brand[];
}

interface DeleteResponse {
  success: boolean;
  message?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export function AdminBrands() {
  // const navigate = useNavigate();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);
  
  // State for add/edit modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandName, setBrandName] = useState<string>('');
  const [brandDescription, setBrandDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Pagination and search
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Fetch brands from API
  useEffect(() => {
    fetchBrands();
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

  // Filter brands based on search
  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(search.toLowerCase()) ||
    (brand.description && brand.description.toLowerCase().includes(search.toLowerCase()))
  );

  // Paginate filtered brands
  const paginatedBrands = filteredBrands.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(filteredBrands.length / pageSize);

  // Open modal for adding new brand
  const handleOpenAddModal = (): void => {
    setEditingBrand(null);
    setBrandName('');
    setBrandDescription('');
    setIsModalOpen(true);
  };

  // Open modal for editing brand
  const handleOpenEditModal = (brand: Brand): void => {
    setEditingBrand(brand);
    setBrandName(brand.name);
    setBrandDescription(brand.description || '');
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setEditingBrand(null);
    setBrandName('');
    setBrandDescription('');
  };

  // Handle form submit for add/edit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    const trimmedName = brandName.trim();
    if (!trimmedName) {
      toast.error('Brand name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingBrand) {
        // Update existing brand
        const response = await axios.put<ApiResponse<Brand>>(
          `${API_URL}/brands/${editingBrand.id}`,
          { 
            name: trimmedName,
            description: brandDescription.trim() || undefined
          }
        );

        if (response.data.success) {
          toast.success('Brand updated successfully!');
          await fetchBrands();
          handleCloseModal();
        } else {
          toast.error(response.data.message || 'Failed to update brand');
        }
      } else {
        // Add new brand
        const response = await axios.post<ApiResponse<Brand>>(
          `${API_URL}/brands`,
          { 
            name: trimmedName,
            description: brandDescription.trim() || undefined
          }
        );

        if (response.data.success) {
          toast.success('Brand added successfully!');
          await fetchBrands();
          // Go to last page to show new brand
          const newTotalPages = Math.ceil((filteredBrands.length + 1) / pageSize);
          setPage(newTotalPages);
          handleCloseModal();
        } else {
          toast.error(response.data.message || 'Failed to add brand');
        }
      }
    } catch (error) {
      console.error('Error saving brand:', error);
      toast.error('Failed to save brand');
    } finally {
      setIsSubmitting(false);
    }
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
    setPage(1); // Reset to first page when changing page size
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
          <p className="text-sm text-muted-foreground">Manage brands and manufacturers</p>
        </div>
        <Button onClick={handleOpenAddModal}>
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
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Description</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Created At</th>
                <th className="p-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBrands.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
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
                      <span className="font-medium">{brand.name}</span>
                    </td>
                    <td className="p-3 hidden md:table-cell text-sm text-muted-foreground max-w-[200px] truncate">
                      {brand.description || '—'}
                    </td>
                    <td className="p-3 hidden lg:table-cell text-sm text-muted-foreground">
                      {brand.created_at ? new Date(brand.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      }) : '—'}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => handleOpenEditModal(brand)}
                          aria-label={`Edit ${brand.name}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive" 
                          onClick={() => setDeleteTarget(brand)}
                          aria-label={`Delete ${brand.name}`}
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

      {/* Add/Edit Brand Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open: boolean) => !open && handleCloseModal()}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {editingBrand ? 'Edit Brand' : 'Add New Brand'}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {editingBrand 
                ? `Update the brand information for "${editingBrand.name}"` 
                : 'Enter the brand details'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div>
                <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="brandName"
                  placeholder="Enter brand name..."
                  value={brandName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setBrandName(e.target.value)}
                  disabled={isSubmitting}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="brandDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <Input
                  id="brandDescription"
                  placeholder="Enter brand description..."
                  value={brandDescription}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setBrandDescription(e.target.value)}
                  disabled={isSubmitting}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t">
              <Button 
                type="button"
                variant="outline" 
                className="flex-1 border-gray-300 hover:bg-gray-50" 
                onClick={handleCloseModal}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting || !brandName.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingBrand ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  editingBrand ? 'Update Brand' : 'Add Brand'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(v: boolean) => !v && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Delete Brand</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete "<span className="font-semibold text-gray-900">{deleteTarget?.name}</span>"? 
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
    </div>
  );
}