// src/components/admin/AdminCategories.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export function AdminCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Fetch categories from API
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/categories`);
      if (response.data.success) {
        setCategories(response.data.data);
      } else {
        toast.error('Failed to load categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = () => {
    navigate('/admin/categories/add');
  };

  const handleEditCategory = (category) => {
    navigate(`/admin/categories/add/${category.id}`);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    
    try {
      setIsDeleting(true);
      const response = await axios.delete(`${API_URL}/categories/${deleteTarget.id}`);
      
      if (response.data.success) {
        toast.success('Category deleted successfully');
        // Update state only after successful deletion
        setCategories(prevCategories => prevCategories.filter(c => c.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        toast.error(response.data.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete category';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteTarget(null);
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Category Management</h2>
          <p className="text-sm text-muted-foreground">Manage product categories</p>
        </div>
        <Button onClick={handleAddCategory}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No categories found</p>
          <Button onClick={handleAddCategory} className="mt-4">
            <Plus className="w-4 h-4 mr-1.5" /> Add Your First Category
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Card key={cat.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {cat.description || 'No description'}
                  </p>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => handleEditCategory(cat)}
                    aria-label={`Edit ${cat.name}`}
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive hover:text-destructive" 
                    onClick={() => setDeleteTarget(cat)}
                    aria-label={`Delete ${cat.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                ID: {cat.id}
              </Badge>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && handleCancelDelete()}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteTarget?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={handleCancelDelete}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              className="flex-1" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
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