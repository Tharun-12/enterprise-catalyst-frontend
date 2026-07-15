// src/components/admin/BrandForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export function BrandForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  // Load brand data if editing
  useEffect(() => {
    if (id) {
      fetchBrand(id);
    } else {
      setIsEditing(false);
      setFormData({
        name: '',
        description: '',
      });
    }
  }, [id]);

  const fetchBrand = async (brandId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/brands/${brandId}`);
      
      if (response.data.success) {
        const brand = response.data.data;
        setIsEditing(true);
        setFormData({
          name: brand.name,
          description: brand.description || '',
        });
      } else {
        toast.error('Brand not found');
        navigate('/admin/brands');
      }
    } catch (error) {
      console.error('Error fetching brand:', error);
      toast.error('Failed to load brand data');
      navigate('/admin/brands');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      toast.error('Brand name is required');
      return;
    }

    setIsLoading(true);

    try {
      if (isEditing) {
        // Update existing brand
        const response = await axios.put(`${API_URL}/brands/${id}`, {
          name: formData.name.trim(),
          description: formData.description.trim(),
        });

        if (response.data.success) {
          toast.success('Brand updated successfully!');
        }
      } else {
        // Create new brand
        const response = await axios.post(`${API_URL}/brands`, {
          name: formData.name.trim(),
          description: formData.description.trim(),
        });

        if (response.data.success) {
          toast.success('Brand created successfully!');
        }
      }
      
      // Navigate back to brands list
      setTimeout(() => {
        navigate('/admin/brands');
      }, 500);

    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        toast.error(error.response.data.message || 'Operation failed');
      } else {
        toast.error(isEditing ? 'Failed to update brand' : 'Failed to create brand');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/brands');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
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
              {isEditing ? 'Edit Brand' : 'Add New Brand'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEditing ? 'Update brand information' : 'Create a new brand'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Brand Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Brand Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Hikvision"
              className="w-full"
              required
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              This will be used as the display name for your brand
            </p>
          </div>

          {/* Brand Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Brand Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the brand and its products..."
              className="w-full min-h-[120px] resize-none"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Provide a brief description of this brand (optional)
            </p>
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
                : (isEditing ? 'Update Brand' : 'Create Brand')
              }
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}