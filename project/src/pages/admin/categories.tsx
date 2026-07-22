// src/components/admin/AdminCategories.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Loader2, X, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:5000/api';

// Define the Category type
interface Category {
  id: number;
  category_name: string;
  created_at: string;
  updated_at: string;
}

// Define API response types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export function AdminCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  
  // State for quick add
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // State for inline editing
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Fetch categories from API
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await axios.get<ApiResponse<Category[]>>(`${API_URL}/categories`);
      if (response.data.success) {
        setCategories(response.data.data);
      } else {
        toast.error('Failed to load categories');
      }
    } catch (error: unknown) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = (): void => {
    navigate('/admin/categories/add');
  };

  // Start inline editing - prefill the header input
  const startEditing = (category: Category): void => {
    setEditingId(category.id);
    setEditingName(category.category_name);
    setNewCategoryName(category.category_name); // Prefill the header input
  };

  // Cancel inline editing
  const cancelEditing = (): void => {
    setEditingId(null);
    setEditingName('');
    setNewCategoryName(''); // Clear the header input
  };

  // Save inline editing
  const saveEditing = async (): Promise<void> => {
    if (!editingId) return;
    
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) {
      toast.error('Category name is required');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await axios.put<ApiResponse<Category>>(`${API_URL}/categories/${editingId}`, {
        category_name: trimmedName,
      });

      if (response.data.success) {
        toast.success('Category updated successfully!');
        setCategories(prevCategories =>
          prevCategories.map(cat =>
            cat.id === editingId ? { ...cat, category_name: trimmedName } : cat
          )
        );
        setEditingId(null);
        setEditingName('');
        setNewCategoryName(''); // Clear the input after saving
      } else {
        toast.error(response.data.message || 'Failed to update category');
      }
    } catch (error: unknown) {
      console.error('Error updating category:', error);
      const axiosError = error as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || 'Failed to update category');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!deleteTarget) return;
    
    try {
      setIsDeleting(true);
      const response = await axios.delete<ApiResponse<null>>(`${API_URL}/categories/${deleteTarget.id}`);
      
      if (response.data.success) {
        toast.success('Category deleted successfully');
        setCategories(prevCategories => prevCategories.filter(c => c.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        toast.error(response.data.message || 'Failed to delete category');
      }
    } catch (error: unknown) {
      console.error('Error deleting category:', error);
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Failed to delete category';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = (): void => {
    setDeleteTarget(null);
  };

  // Handle quick add category
  const handleQuickAdd = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // If editing mode is active, save the edit instead
    if (editingId !== null) {
      await saveEditing();
      return;
    }
    
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) {
      toast.error('Category name is required');
      return;
    }

    setIsAdding(true);
    try {
      const response = await axios.post<ApiResponse<Category>>(`${API_URL}/categories`, {
        category_name: trimmedName,
      });

      if (response.data.success) {
        toast.success('Category added successfully!');
        setNewCategoryName('');
        // Refresh categories list
        await fetchCategories();
      } else {
        toast.error(response.data.message || 'Failed to add category');
      }
    } catch (error: unknown) {
      console.error('Error adding category:', error);
      const axiosError = error as AxiosError<{ message: string }>;
      if (axiosError.response) {
        toast.error(axiosError.response.data?.message || 'Failed to add category');
      } else {
        toast.error('Failed to add category');
      }
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Quick Add / Edit */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
          <p className="text-sm text-gray-500">
            {editingId !== null ? `Editing: ${editingName}` : 'Manage your product categories'}
          </p>
        </div>
        
        {/* Quick Add / Edit Form - Inline with header */}
        <form onSubmit={handleQuickAdd} className="flex w-full sm:w-auto gap-2">
          <div className="flex-1 sm:w-72">
            <Input
              placeholder={editingId !== null ? "Edit category name..." : "Enter category name..."}
              value={newCategoryName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCategoryName(e.target.value)}
              disabled={isAdding || isUpdating}
              className={`w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                editingId !== null ? 'border-yellow-500 bg-yellow-50' : ''
              }`}
              autoFocus={editingId !== null}
            />
          </div>
          <Button 
            type="submit" 
            disabled={isAdding || isUpdating || !newCategoryName.trim()}
            className={`whitespace-nowrap ${
              editingId !== null 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isAdding || isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {editingId !== null ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              <>
                {editingId !== null ? (
                  <>
                    <Check className="w-4 h-4 mr-1.5" />
                    Update Category
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-1.5" />
                    Add Category
                  </>
                )}
              </>
            )}
          </Button>
          {editingId !== null && (
            <Button 
              type="button"
              variant="outline"
              onClick={cancelEditing}
              disabled={isUpdating}
              className="whitespace-nowrap border-gray-300 hover:bg-gray-100"
            >
              <X className="w-4 h-4 mr-1.5" />
              Cancel
            </Button>
          )}
        </form>
      </div>

      {categories.length === 0 ? (
        <Card className="p-16 text-center border-2 border-dashed border-gray-300">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No categories yet</h3>
            <p className="text-sm text-gray-500 mb-4">Get started by adding your first category</p>
            <Button onClick={handleAddCategory} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-1.5" /> Add Your First Category
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat: Category) => (
            <Card 
              key={cat.id} 
              className={`group p-4 hover:shadow-lg transition-all duration-200 border ${
                editingId === cat.id 
                  ? 'border-yellow-400 bg-yellow-50/50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {cat.category_name}
                  </h3>
                  {/* <Badge variant="secondary" className="mt-1 text-xs bg-gray-100 text-gray-600">
                    ID: {cat.id}
                  </Badge> */}
                </div>
                <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600" 
                    onClick={() => startEditing(cat)}
                    aria-label={`Edit ${cat.category_name}`}
                    disabled={editingId !== null}
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 hover:bg-red-50 hover:text-red-600" 
                    onClick={() => setDeleteTarget(cat)}
                    aria-label={`Delete ${cat.category_name}`}
                    disabled={editingId !== null}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Created: {new Date(cat.created_at).toLocaleDateString()}
                </p>
              </div>
              {editingId === cat.id && (
                <div className="mt-2 pt-2 border-t border-yellow-200">
                  {/* <p className="text-xs text-yellow-600 font-medium">
                    ✏️ Editing in progress...
                  </p> */}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open: boolean) => !open && handleCancelDelete()}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Delete Category</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete "<span className="font-semibold text-gray-900">{deleteTarget?.category_name}</span>"? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1 border-gray-300 hover:bg-gray-50" 
              onClick={handleCancelDelete}
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