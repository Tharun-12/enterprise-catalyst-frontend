// src/components/admin/AdminBrands.tsx
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Plus, Edit, Trash2, Loader2, Search, ChevronLeft, ChevronRight, X, Save } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';
import { baseurl } from '@/Baseurl/baseurl';

const API_URL = `${baseurl}/api`;

// Define types
interface Category {
  id: number;
  category_name: string;
  subcategories?: Subcategory[];
}

interface Subcategory {
  id: number;
  subcategory_name: string;
  category_id: number;
}

interface Brand {
  id: string;
  brand_name: string;
  category_id?: number;
  category_name?: string;
  sub_category_id?: number;
  sub_category_name?: string;
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

interface BrandResponse {
  success: boolean;
  data: Brand;
}

interface ErrorResponse {
  message?: string;
}

export function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  // Pagination and search
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Form data
  const [formData, setFormData] = useState({
    brand_name: '',
    category_id: '',
    sub_category_id: '',
  });

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

  // Handle category change - fetch subcategories for selected category
  const handleCategoryChange = (categoryId: string): void => {
    setFormData((prev) => ({
      ...prev,
      category_id: categoryId,
      sub_category_id: '', // Reset subcategory when category changes
    }));

    // Find selected category and its subcategories
    const selectedCategory = categories.find(cat => String(cat.id) === categoryId);
    if (selectedCategory && selectedCategory.subcategories) {
      setSubcategories(selectedCategory.subcategories);
    } else {
      setSubcategories([]);
    }
  };

  // Filter brands based on search
  const filteredBrands = brands.filter((brand: Brand) =>
    brand.brand_name.toLowerCase().includes(search.toLowerCase())
  );

  // Paginate filtered brands
  const paginatedBrands = filteredBrands.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(filteredBrands.length / pageSize);

  // Open modal for adding new brand
  const handleAddBrand = (): void => {
    setEditingBrand(null);
    setFormData({
      brand_name: '',
      category_id: '',
      sub_category_id: '',
    });
    setSubcategories([]);
    setIsModalOpen(true);
  };

  // Open modal for editing brand
  const handleEditBrand = (brand: Brand): void => {
    setEditingBrand(brand);
    setFormData({
      brand_name: brand.brand_name || '',
      category_id: brand.category_id ? String(brand.category_id) : '',
      sub_category_id: brand.sub_category_id ? String(brand.sub_category_id) : '',
    });

    // Load subcategories for the selected category
    if (brand.category_id) {
      const selectedCategory = categories.find(cat => cat.id === brand.category_id);
      if (selectedCategory && selectedCategory.subcategories) {
        setSubcategories(selectedCategory.subcategories);
      } else {
        setSubcategories([]);
      }
    } else {
      setSubcategories([]);
    }

    setIsModalOpen(true);
  };

  // Handle form input change
  const handleFormChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle select change
  const handleSelectChange = (value: string, field: string): void => {
    if (field === 'category_id') {
      handleCategoryChange(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.category_id || formData.category_id === 'none') {
      toast.error('Please select a category');
      return;
    }

    if (!formData.sub_category_id || formData.sub_category_id === 'none') {
      toast.error('Please select a subcategory');
      return;
    }

    if (!formData.brand_name.trim()) {
      toast.error('Brand name is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        brand_name: formData.brand_name.trim(),
        category_id: parseInt(formData.category_id),
        sub_category_id: parseInt(formData.sub_category_id),
      };

      if (editingBrand) {
        // Update existing brand
        const response = await axios.put<BrandResponse>(`${API_URL}/brands/${editingBrand.id}`, submitData);
        if (response.data.success) {
          toast.success('Brand updated successfully!');
        }
      } else {
        // Create new brand
        const response = await axios.post<BrandResponse>(`${API_URL}/brands`, submitData);
        if (response.data.success) {
          toast.success('Brand created successfully!');
        }
      }
      
      // Close modal and refresh data
      setIsModalOpen(false);
      await fetchBrands();
      setFormData({ brand_name: '', category_id: '', sub_category_id: '' });
      setSubcategories([]);
      setEditingBrand(null);

    } catch (error) {
      console.error('Error:', error);
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response?.data?.message) {
          toast.error(axiosError.response.data.message);
        } else {
          toast.error(editingBrand ? 'Failed to update brand' : 'Failed to create brand');
        }
      } else {
        toast.error(editingBrand ? 'Failed to update brand' : 'Failed to create brand');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal
  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setFormData({ brand_name: '', category_id: '', sub_category_id: '' });
    setSubcategories([]);
    setEditingBrand(null);
  };

  // Delete brand
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
          <p className="text-sm text-muted-foreground">Manage brands, categories, and subcategories</p>
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
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sub Category</th>
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
                      <span className="font-medium">{brand.brand_name}</span>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {brand.category_name || '—'}
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {brand.sub_category_name || '—'}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
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

      {/* Add/Edit Brand Modal */}
      <Dialog open={isModalOpen} onOpenChange={(v: boolean) => !v && handleCloseModal()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {editingBrand ? 'Edit Brand' : 'Add New Brand'}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {editingBrand ? 'Update brand information' : 'Create a new brand with category and subcategory'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleFormSubmit} className="space-y-6 py-4">
            <div className="space-y-4">
              {/* Category - First */}
              <div className="space-y-2">
                <Label htmlFor="category_id" className="text-sm font-medium">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category_id || ''}
                  onValueChange={(value) => handleSelectChange(value, 'category_id')}
                  disabled={isSubmitting}
                  required
                >
                  <SelectTrigger id="category_id" className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.category_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sub Category - Second */}
              <div className="space-y-2">
                <Label htmlFor="sub_category_id" className="text-sm font-medium">
                  Sub Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.sub_category_id || ''}
                  onValueChange={(value) => handleSelectChange(value, 'sub_category_id')}
                  disabled={isSubmitting || !formData.category_id || subcategories.length === 0}
                  required
                >
                  <SelectTrigger id="sub_category_id" className="w-full">
                    <SelectValue placeholder={
                      !formData.category_id 
                        ? 'Select a category first' 
                        : subcategories.length === 0 
                          ? 'No subcategories available' 
                          : 'Select a subcategory'
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((subcategory) => (
                      <SelectItem key={subcategory.id} value={String(subcategory.id)}>
                        {subcategory.subcategory_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.category_id && subcategories.length === 0 && (
                  <p className="text-xs text-amber-600">
                    No subcategories found for this category. Please add subcategories first.
                  </p>
                )}
              </div>

              {/* Brand Name - Third */}
              <div className="space-y-2">
                <Label htmlFor="brand_name" className="text-sm font-medium">
                  Brand Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="brand_name"
                  name="brand_name"
                  value={formData.brand_name}
                  onChange={handleFormChange}
                  placeholder="e.g., Hikvision"
                  className="w-full"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                className="w-full sm:w-auto sm:flex-1 order-2 sm:order-1"
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="w-full sm:w-auto sm:flex-1 order-1 sm:order-2"
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting 
                  ? (editingBrand ? 'Updating...' : 'Creating...') 
                  : (editingBrand ? 'Update Brand' : 'Create Brand')
                }
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
    </div>
  );
}