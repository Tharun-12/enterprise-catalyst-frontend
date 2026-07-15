import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Category {
  id: number;
  name: string;
  description: string;
}

interface Brand {
  id: number;
  name: string;
  description: string;
}

interface ProductImage {
  id: number;
  image_url: string;
  is_primary: number;
  sort_order: number;
}

interface ProductFormData {
  name: string;
  sku: string;
  categoryId: string;
  brandId: string;
  description: string;
  price: string;
  warranty: string;
  images: File[];
}

export function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    sku: '',
    categoryId: '',
    brandId: '',
    description: '',
    price: '',
    warranty: '',
    images: [],
  });

  // Fetch categories and brands
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesResponse = await fetch('http://localhost:5000/api/categories/');
        const categoriesData = await categoriesResponse.json();
        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }

        // Fetch brands
        const brandsResponse = await fetch('http://localhost:5000/api/brands/');
        const brandsData = await brandsResponse.json();
        if (brandsData.success) {
          setBrands(brandsData.data);
        }

        // If edit mode, fetch product data
        if (isEditMode) {
          const productResponse = await fetch(`http://localhost:5000/api/products/${id}`);
          const productData = await productResponse.json();
          if (productData.success) {
            const product = productData.data;
            setFormData({
              name: product.name,
              sku: product.sku || '',
              categoryId: String(product.category_id),
              brandId: String(product.brand_id),
              description: product.description || '',
              price: String(product.price),
              warranty: product.warranty || '',
              images: [],
            });
            
            // Load existing images
            if (product.images && product.images.length > 0) {
              setExistingImages(product.images);
              const existingPreviews = product.images.map((img: any) => 
                `http://localhost:5000${img.image_url}`
              );
              setImagePreviews(existingPreviews);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isEditMode, id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file size (max 5MB per file)
    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Create preview URLs
    const previews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...validFiles],
    }));

    // Reset input
    e.target.value = '';
  };

  const removeImage = async (index: number) => {
    // Check if this is an existing image (from database)
    if (isEditMode && index < existingImages.length) {
      const imageToDelete = existingImages[index];
      if (imageToDelete) {
        // Delete from database
        try {
          const response = await fetch(
            `http://localhost:5000/api/products/${id}/images/${imageToDelete.id}`,
            {
              method: 'DELETE',
            }
          );
          
          const result = await response.json();
          
          if (result.success) {
            toast.success('Image deleted successfully');
            // Remove from existing images
            setExistingImages(prev => prev.filter((_, i) => i !== index));
            // Remove from previews
            setImagePreviews(prev => prev.filter((_, i) => i !== index));
          } else {
            toast.error(result.message || 'Failed to delete image');
          }
        } catch (error) {
          console.error('Error deleting image:', error);
          toast.error('Failed to delete image');
        }
      }
    } else {
      // Remove new image (not yet saved to database)
      const adjustedIndex = index - existingImages.length;
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== adjustedIndex),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!formData.categoryId) {
      toast.error('Please select a category');
      return;
    }
    if (!formData.brandId) {
      toast.error('Please select a brand');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      setSubmitting(true);

      // Prepare form data for API submission
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('sku', formData.sku);
      submitData.append('categoryId', formData.categoryId);
      submitData.append('brandId', formData.brandId);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('warranty', formData.warranty);

      // Append images
      formData.images.forEach((image) => {
        submitData.append('images', image);
      });

      // Send deleted image IDs
      if (imagesToDelete.length > 0) {
        submitData.append('deletedImages', JSON.stringify(imagesToDelete));
      }

      const url = isEditMode 
        ? `http://localhost:5000/api/products/${id}`
        : 'http://localhost:5000/api/products';
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: submitData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success(isEditMode ? 'Product updated successfully!' : 'Product created successfully!');
        navigate('/admin/products');
      } else {
        toast.error(result.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/products')}
          className="h-9 w-9"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isEditMode ? 'Update product information' : 'Create a new product in the catalog'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6">
          <div className="grid gap-6">
            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Product Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
              />
            </div>

            {/* SKU */}
            <div className="space-y-2">
              <Label htmlFor="sku" className="text-sm font-medium">SKU</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="Enter SKU (e.g., PROD-001)"
              />
            </div>

            {/* Category and Brand */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoryId" className="text-sm font-medium">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => handleSelectChange('categoryId', value)}
                >
                  <SelectTrigger id="categoryId">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brandId" className="text-sm font-medium">
                  Brand <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.brandId}
                  onValueChange={(value) => handleSelectChange('brandId', value)}
                >
                  <SelectTrigger id="brandId">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={String(brand.id)}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Full Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Detailed product description"
                className="min-h-[120px] resize-y"
              />
            </div>

            {/* Price and Warranty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium">
                  Price (INR) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warranty" className="text-sm font-medium">
                  Warranty
                </Label>
                <Input
                  id="warranty"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleInputChange}
                  placeholder="e.g., 2 years, 12 months"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Product Images</Label>
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-accent transition-colors">
                  <Upload className="h-4 w-4" />
                  Upload Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-xs text-muted-foreground">
                  Max 5MB per image
                </span>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                        <img
                          src={preview}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {isEditMode && index < existingImages.length && (
                        <div className="absolute bottom-2 left-2 bg-primary/80 text-white text-xs px-2 py-0.5 rounded">
                          Saved
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex items-center gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/products')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditMode ? 'Update Product' : 'Create Product'
                )}
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
}