// src/components/admin/AdminBrands.tsx (renamed from .jsx)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
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
  createdAt?: string;
  updatedAt?: string;
}

interface BrandsResponse {
  success: boolean;
  data: Brand[];
}

interface DeleteResponse {
  success: boolean;
  message?: string;
}

export function AdminBrands() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);

  // Fetch brands from API
  useEffect(() => {
    fetchBrands();
  }, []);

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

  const handleAddBrand = (): void => {
    navigate('/admin/brands/add');
  };

  const handleEditBrand = (brand: Brand): void => {
    navigate(`/admin/brands/add/${brand.id}`);
  };

  const handleDelete = async (): Promise<void> => {
    if (!deleteTarget) return;
    
    try {
      const response = await axios.delete<DeleteResponse>(`${API_URL}/brands/${deleteTarget.id}`);
      if (response.data.success) {
        toast.success('Brand deleted successfully');
        setBrands(brands.filter(b => b.id !== deleteTarget.id));
        setDeleteTarget(null);
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
      toast.error('Failed to delete brand');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading brands...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Brand Management</h2>
          <p className="text-sm text-muted-foreground">Manage brands and manufacturers</p>
        </div>
        <Button onClick={handleAddBrand}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Brand
        </Button>
      </div>

      {brands.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No brands found</p>
          <Button onClick={handleAddBrand} className="mt-4">
            <Plus className="w-4 h-4 mr-1.5" /> Add Your First Brand
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((brand: Brand) => (
            <Card key={brand.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{brand.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{brand.description || 'No description'}</p>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => handleEditBrand(brand)}
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive hover:text-destructive" 
                    onClick={() => setDeleteTarget(brand)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              {/* <Badge variant="secondary" className="text-xs">
                ID: {brand.id}
              </Badge> */}
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(v: boolean) => !v && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Brand</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteTarget?.name}"?
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