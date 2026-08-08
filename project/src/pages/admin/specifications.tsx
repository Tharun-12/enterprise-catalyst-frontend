// src/components/admin/AdminSpecifications.tsx
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

interface Specification {
  id: string;
  category_id: number;
  category_name?: string;
  spec_name: string;
  color_brand_mapping: { [key: string]: string[] };
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
  }, [page, pageSize]);

  const fetchSpecifications = async (): Promise<void> => {
    try {
      setIsLoading(true);
      // Use /specifications endpoint
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
    (spec.category_name && spec.category_name.toLowerCase().includes(search.toLowerCase()))
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
          <p className="text-sm text-muted-foreground">Manage product specifications, colors, and brands</p>
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
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Spec Name</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Colors & Brands</th>
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
                      <span className="text-sm">{spec.category_name || '—'}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-medium">{spec.spec_name}</span>
                    </td>
                    <td className="p-3 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {spec.color_brand_mapping && Object.keys(spec.color_brand_mapping).length > 0 ? (
                          Object.keys(spec.color_brand_mapping).slice(0, 3).map((color, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-gray-100">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color.toLowerCase() }}></span>
                              {color} ({spec.color_brand_mapping[color]?.length || 0})
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                        {spec.color_brand_mapping && Object.keys(spec.color_brand_mapping).length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100">
                            +{Object.keys(spec.color_brand_mapping).length - 3}
                          </span>
                        )}
                      </div>
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Specification Details
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Complete details for {viewingSpec?.spec_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p className="text-sm text-gray-900 mt-1">{viewingSpec?.category_name || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Specification Name</p>
                <p className="text-sm text-gray-900 mt-1">{viewingSpec?.spec_name || '—'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Colors & Brands</p>
                <div className="mt-2 space-y-2">
                  {viewingSpec?.color_brand_mapping && Object.keys(viewingSpec.color_brand_mapping).length > 0 ? (
                    Object.keys(viewingSpec.color_brand_mapping).map((color) => (
                      <div key={color} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <span 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.toLowerCase() }}
                          ></span>
                          <span className="font-medium text-sm">{color}</span>
                          <span className="text-xs text-gray-500">
                            ({viewingSpec.color_brand_mapping[color]?.length || 0} brands)
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {viewingSpec.color_brand_mapping[color]?.length > 0 ? (
                            viewingSpec.color_brand_mapping[color].map((brand, idx) => (
                              <span key={idx} className="inline-flex px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium border border-blue-200">
                                {brand}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400 italic">No brands</span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">No colors or brands configured</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={() => setViewingSpec(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}