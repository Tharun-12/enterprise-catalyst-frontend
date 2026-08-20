// src/components/admin/AdminSpecifications.tsx
import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Loader2, Search, ChevronLeft, ChevronRight, Eye, Layers, Tag, FolderTree } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import axios from 'axios';
import { baseurl } from '@/Baseurl/baseurl';

const API_URL = `${baseurl}/api`;

// Define types based on actual API response
interface ProductSpecification {
  id: string;
  spec_name: string;
  value: string;
}

interface Specification {
  id: string;
  category_id: number;
  category_name?: string;
  sub_category_id: number;
  subcategory_name?: string;
  spec_name: string;
  product_specifications: ProductSpecification[];
  created_at?: string;
  updated_at?: string;
}

interface SpecificationsResponse {
  success: boolean;
  data: Specification[];
}

interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

interface Category {
  id: number;
  category_name: string;
}

interface DeleteResponse {
  success: boolean;
  message?: string;
}

export function AdminSpecifications() {
  const navigate = useNavigate();
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [_categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<Specification | null>(null);
  const [viewingSpec, setViewingSpec] = useState<Specification | null>(null);

  // Pagination and search
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Fetch specifications and categories
  useEffect(() => {
    fetchSpecifications();
    fetchCategories();
  }, []);

  const fetchSpecifications = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await axios.get<SpecificationsResponse>(`${API_URL}/specifications`);
      if (response.data.success) {
        setSpecifications(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching specifications:', error);
      toast.error('Failed to load specifications');
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

  // Filter specifications based on search
  const filteredSpecs = specifications.filter((spec: Specification) =>
    spec.spec_name.toLowerCase().includes(search.toLowerCase()) ||
    (spec.category_name && spec.category_name.toLowerCase().includes(search.toLowerCase())) ||
    (spec.subcategory_name && spec.subcategory_name.toLowerCase().includes(search.toLowerCase()))
  );

  // Paginate filtered specifications
  const paginatedSpecs = filteredSpecs.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(filteredSpecs.length / pageSize);

  // Navigate to add specification page
  const handleAddSpec = (): void => {
    navigate('/admin/specifications/add');
  };

  // Navigate to edit specification page
  const handleEditSpec = (spec: Specification): void => {
    navigate(`/admin/specifications/edit/${spec.id}`);
  };

  const handleDelete = async (): Promise<void> => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      const response = await axios.delete<DeleteResponse>(`${API_URL}/specifications/${deleteTarget.id}`);
      if (response.data.success) {
        toast.success('Specification deleted successfully');
        await fetchSpecifications();
        setDeleteTarget(null);
      } else {
        toast.error(response.data.message || 'Failed to delete specification');
      }
    } catch (error) {
      console.error('Error deleting specification:', error);
      toast.error('Failed to delete specification');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (value: string): void => {
    setPageSize(Number(value));
    setPage(1);
  };

  // View specification details
  const handleViewSpec = (spec: Specification): void => {
    setViewingSpec(spec);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading specifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Specifications Management</h2>
          <p className="text-sm text-muted-foreground">Manage product specifications and their values</p>
        </div>
        <Button onClick={handleAddSpec}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Specification
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search specifications..."
            className="pl-9 h-9"
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredSpecs.length} specifications found
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">#</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sub Category</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Spec Name</th>
                <th className="p-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSpecs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    {search ? 'No specifications match your search.' : 'No specifications found. Click "Add Specification" to create one.'}
                  </td>
                </tr>
              ) : (
                paginatedSpecs.map((spec, index) => (
                  <tr key={spec.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-3 text-sm">
                      {(page - 1) * pageSize + index + 1}
                    </td>
                    <td className="p-3">
                      <span className="text-sm font-medium">{spec.category_name || '—'}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-sm">{spec.subcategory_name || '—'}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-sm">{spec.spec_name}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleViewSpec(spec)}
                          aria-label={`View ${spec.spec_name}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditSpec(spec)}
                          aria-label={`Edit ${spec.spec_name}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(spec)}
                          aria-label={`Delete ${spec.spec_name}`}
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
        {filteredSpecs.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, filteredSpecs.length)} of {filteredSpecs.length} specifications
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
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
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
            <DialogTitle className="text-xl font-semibold text-gray-900">Delete Specification</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete "<span className="font-semibold text-gray-900">{deleteTarget?.spec_name}</span>"?
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

      {/* View Specification Dialog */}
      <Dialog open={!!viewingSpec} onOpenChange={(v: boolean) => !v && setViewingSpec(null)}>
        <DialogContent className="sm:max-w-[640px] p-0 gap-0 overflow-hidden max-h-[85vh] flex flex-col">
          {/* Header */}
          <DialogHeader className="px-6 py-5 border-b bg-gradient-to-br from-blue-50 to-white shrink-0">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-lg font-semibold text-gray-900 truncate">
                  {viewingSpec?.spec_name || 'Specification Details'}
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500">
                  Complete specification details and values
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Scrollable body */}
          <div className="overflow-y-auto px-6 py-5 space-y-5">
            {/* Meta info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1">
                  <FolderTree className="w-3.5 h-3.5" />
                  Category
                </div>
                <p className="text-sm font-semibold text-gray-900 truncate">{viewingSpec?.category_name || '—'}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1">
                  <Tag className="w-3.5 h-3.5" />
                  Sub Category
                </div>
                <p className="text-sm font-semibold text-gray-900 truncate">{viewingSpec?.subcategory_name || '—'}</p>
              </div>
            </div>

            {/* Product Specifications - grid based, guaranteed side-by-side */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-800">Product Specifications</p>
                {viewingSpec?.product_specifications && viewingSpec.product_specifications.length > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                    {viewingSpec.product_specifications.length}
                  </span>
                )}
              </div>

              {viewingSpec?.product_specifications && viewingSpec.product_specifications.length > 0 ? (
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  {/* Column headers */}
                  <div className="grid grid-cols-2 bg-gray-100">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Specification
                    </div>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-l border-gray-200">
                      Value
                    </div>
                  </div>
                  {/* Rows */}
                  <div className="divide-y divide-gray-200">
                    {viewingSpec.product_specifications.map((ps, idx) => (
                      <div
                        key={ps.id || idx}
                        className={`grid grid-cols-2 ${idx % 2 === 1 ? 'bg-gray-50/60' : 'bg-white'} hover:bg-blue-50/40 transition-colors`}
                      >
                        <div className="px-4 py-2.5 text-sm font-medium text-gray-700 break-words">
                          {ps.spec_name}
                        </div>
                        <div className="px-4 py-2.5 text-sm text-gray-600 break-words border-l border-gray-200">
                          {ps.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-400 bg-gray-50 rounded-lg p-4 border border-dashed border-gray-200 text-center">
                  No product specifications configured
                </div>
              )}
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
              <div>
                <p className="text-xs font-medium text-gray-400">Created At</p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {viewingSpec?.created_at ? new Date(viewingSpec.created_at).toLocaleString() : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-400">Updated At</p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {viewingSpec?.updated_at ? new Date(viewingSpec.updated_at).toLocaleString() : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end px-6 py-4 border-t bg-white shrink-0">
            <Button onClick={() => setViewingSpec(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}