// src/pages/admin/categories-form.tsx
import { useState, useEffect, ChangeEvent, FormEvent, KeyboardEvent, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Plus, Upload, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';
import { baseurl } from '@/Baseurl/baseurl';

const API_URL = `${baseurl}/api`;

// Define types
interface Subcategory {
  id?: number;
  subcategory_name: string;
  created_at?: string;
}

interface CategoryData {
  id?: number;
  category_name: string;
  description: string;
  category_image: string | null;
  subcategories: Subcategory[];
  existing_image: string | null;
}

interface CategoryResponse {
  success: boolean;
  data: {
    id: number;
    category_name: string;
    description?: string;
    category_image?: string | null;
    subcategories?: Subcategory[];
    created_at: string;
    updated_at: string;
  };
  message?: string;
}

interface ApiErrorResponse {
  message: string;
}

export function CategoryForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [deleteExistingImage, setDeleteExistingImage] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<CategoryData>({
    category_name: '',
    description: '',
    category_image: null,
    subcategories: [],
    existing_image: null
  });

  const [subcategoryInput, setSubcategoryInput] = useState<string>('');

  // Load category data if editing
  useEffect(() => {
    if (id) {
      fetchCategory(id);
    } else {
      setIsEditing(false);
      setFormData({
        category_name: '',
        description: '',
        category_image: null,
        subcategories: [],
        existing_image: null
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [id]);

  const fetchCategory = async (categoryId: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await axios.get<CategoryResponse>(`${API_URL}/categories/${categoryId}`);
      
      if (response.data.success) {
        const category = response.data.data;
        setIsEditing(true);
        
        setFormData({
          category_name: category.category_name || '',
          description: category.description || '',
          category_image: category.category_image || null,
          subcategories: category.subcategories || [],
          existing_image: category.category_image || null
        });
        
        if (category.category_image) {
          setImagePreview(`${baseurl}/uploads/categories/${category.category_image}`);
        }
      } else {
        toast.error('Category not found');
        navigate('/admin/categories');
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      toast.error('Failed to load category data');
      navigate('/admin/categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      setDeleteExistingImage(false);
    }
  };

  const handleRemoveImage = (): void => {
    setImagePreview(null);
    setImageFile(null);
    if (formData.existing_image) {
      setDeleteExistingImage(true);
    }
  };

  const handleAddSubcategory = (): void => {
    const trimmed = subcategoryInput.trim();
    if (!trimmed) {
      toast.warning('Please enter a subcategory name');
      return;
    }
    
    // Check if subcategory already exists
    const exists = formData.subcategories.some(sub => 
      sub.subcategory_name.toLowerCase() === trimmed.toLowerCase()
    );
    
    if (exists) {
      toast.warning('Subcategory already exists');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      subcategories: [...prev.subcategories, { subcategory_name: trimmed, id: Date.now() }]
    }));
    setSubcategoryInput('');
  };

  const handleRemoveSubcategory = (index: number): void => {
    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index)
    }));
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSubcategory();
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!formData.category_name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('category_name', formData.category_name.trim());
      formDataToSend.append('description', formData.description || '');
      
      // Prepare subcategories for sending - only send the names
      const subcategoryNames = formData.subcategories.map(sub => sub.subcategory_name);
      formDataToSend.append('subcategories', JSON.stringify(subcategoryNames));
      
      if (imageFile) {
        formDataToSend.append('category_image', imageFile);
      }
      
      if (deleteExistingImage) {
        formDataToSend.append('delete_image', 'true');
      }

      if (isEditing) {
        const response = await axios.put<CategoryResponse>(
          `${API_URL}/categories/${id}`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (response.data.success) {
          toast.success('Category updated successfully!');
        }
      } else {
        const response = await axios.post<CategoryResponse>(
          `${API_URL}/categories`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (response.data.success) {
          toast.success('Category created successfully!');
        }
      }
      
      setTimeout(() => {
        navigate('/admin/categories');
      }, 500);

    } catch (error) {
      console.error('Error:', error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response) {
        toast.error(axiosError.response.data?.message || 'Operation failed');
      } else {
        toast.error(isEditing ? 'Failed to update category' : 'Failed to create category');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = (): void => {
    navigate('/admin/categories');
  };

  const handleUploadClick = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleCancel}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? 'Edit Category' : 'Add New Category'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEditing ? 'Update category information' : 'Create a new product category'}
            </p>
          </div>
        </div>
      </div>

      <Card className="p-6 w-full">
        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          {/* Row 1: Category Name and Subcategories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="space-y-2">
              <Label htmlFor="category_name" className="text-sm font-medium">
                Category Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="category_name"
                name="category_name"
                value={formData.category_name}
                onChange={handleChange}
                placeholder="e.g., Artificial Intelligence"
                className="w-full"
                required
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                This will be displayed as the category title
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Subcategories
              </Label>
              <div className="flex gap-2">
                <Input
                  value={subcategoryInput}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSubcategoryInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Add subcategory (e.g., Phones, Laptops, Cables)"
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={handleAddSubcategory}
                  disabled={isLoading || !subcategoryInput.trim()}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              
              {formData.subcategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.subcategories.map((sub, index) => {
                    const displayName = sub.subcategory_name;
                    return (
                      <div 
                        key={sub.id || index}
                        className="flex items-center gap-1 bg-blue-50 text-blue-700 rounded-full px-3 py-1"
                      >
                        <span className="text-sm">{displayName}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubcategory(index)}
                          className="text-blue-500 hover:text-red-500 transition-colors"
                          disabled={isLoading}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Press Enter or click Add button to add subcategories
              </p>
            </div>
          </div>

          {/* Row 2: Description and Category Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter category description..."
                className="w-full min-h-[200px] resize-none"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Category Image</Label>
              
              {imagePreview ? (
                // Image preview - full width, no content overlay
                <div className="relative w-full rounded-lg overflow-hidden border border-gray-200">
                  <img 
                    src={imagePreview} 
                    alt="Category preview" 
                    className="w-full h-[200px] object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                    disabled={isLoading}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                // Upload placeholder - full width with upload icon
                <div 
                  className="flex flex-col items-center justify-center w-full h-[200px] border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-400 transition-colors bg-gray-50 hover:bg-gray-100"
                  onClick={handleUploadClick}
                >
                  <div className="text-center pointer-events-none">
                    <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-base font-medium text-gray-600">Click to upload image</p>
                    <div className="text-xs text-muted-foreground mt-2">
                      <p>Recommended: JPG, PNG, GIF, WebP</p>
                      <p>Max size: 5MB</p>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading 
                ? (isEditing ? 'Updating...' : 'Creating...') 
                : (isEditing ? 'Update Category' : 'Create Category')
              }
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}