// src/components/admin/SpecializationForm.tsx
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Plus, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';
import { baseurl } from '@/Baseurl/baseurl';

const API_URL = `${baseurl}/api`;

// Define types
interface Category {
  id: number;
  category_name: string;
}

interface Brand {
  id: number;
  brand_name: string;
  category_id: number;
}

interface ColorBrandMapping {
  [color: string]: string[];
}

interface SpecializationData {
  category_id: string;
  spec_name: string;
  spec_value: string;
  color_brand_mapping: ColorBrandMapping;
}

interface SpecializationResponse {
  success: boolean;
  data: SpecializationData & { category_name?: string };
}

interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

interface BrandsResponse {
  success: boolean;
  data: Brand[];
}

interface ErrorResponse {
  message?: string;
}

export function SpecificationsForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false);
  const [isLoadingBrands, setIsLoadingBrands] = useState<boolean>(false);
  const [formData, setFormData] = useState<SpecializationData>({
    category_id: '',
    spec_name: '',
    spec_value: '',
    color_brand_mapping: {},
  });

  // Temporary inputs for adding new items
  const [newColor, setNewColor] = useState<string>('');
  const [selectedColorForBrand, setSelectedColorForBrand] = useState<string>('');
  const [customBrandInput, setCustomBrandInput] = useState<string>('');
  const [selectedBrandForColor, setSelectedBrandForColor] = useState<string>('');

  // Load categories and brands
  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  // Load specialization data if editing
  useEffect(() => {
    if (id) {
      fetchSpecialization(id);
    } else {
      setIsEditing(false);
      setFormData({
        category_id: '',
        spec_name: '',
        spec_value: '',
        color_brand_mapping: {},
      });
    }
  }, [id]);

  // Filter brands when category changes
  useEffect(() => {
    if (formData.category_id) {
      const filtered = brands.filter(
        brand => brand.category_id === parseInt(formData.category_id)
      );
      setFilteredBrands(filtered);
    } else {
      setFilteredBrands([]);
    }
  }, [formData.category_id, brands]);

  const fetchCategories = async (): Promise<void> => {
    try {
      setIsLoadingCategories(true);
      const response = await axios.get<CategoriesResponse>(`${API_URL}/categories`);
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const fetchBrands = async (): Promise<void> => {
    try {
      setIsLoadingBrands(true);
      const response = await axios.get<BrandsResponse>(`${API_URL}/brands`);
      if (response.data.success) {
        setBrands(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Failed to load brands');
    } finally {
      setIsLoadingBrands(false);
    }
  };

  const fetchSpecialization = async (specId: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await axios.get<SpecializationResponse>(`${API_URL}/specializations/${specId}`);
      
      if (response.data.success) {
        const spec = response.data.data;
        setIsEditing(true);
        setFormData({
          category_id: spec.category_id || '',
          spec_name: spec.spec_name || '',
          spec_value: spec.spec_value || '',
          color_brand_mapping: spec.color_brand_mapping || {},
        });
      } else {
        toast.error('Specialization not found');
        navigate('/admin/specifications');
      }
    } catch (error) {
      console.error('Error fetching specialization:', error);
      toast.error('Failed to load specialization data');
      navigate('/admin/specifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev: SpecializationData) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string): void => {
    setFormData((prev: SpecializationData) => ({
      ...prev,
      category_id: value
    }));
  };

  // Color management
  const handleAddColor = (): void => {
    if (!newColor.trim()) {
      toast.error('Please enter a color');
      return;
    }
    if (formData.color_brand_mapping[newColor.trim()] !== undefined) {
      toast.error('Color already exists');
      return;
    }
    setFormData((prev: SpecializationData) => ({
      ...prev,
      color_brand_mapping: {
        ...prev.color_brand_mapping,
        [newColor.trim()]: []
      }
    }));
    setNewColor('');
  };

  const handleRemoveColor = (color: string): void => {
    const newMapping = { ...formData.color_brand_mapping };
    delete newMapping[color];
    setFormData((prev: SpecializationData) => ({
      ...prev,
      color_brand_mapping: newMapping
    }));
  };

  // Brand management for specific color
  const handleAddBrandToColor = (): void => {
    if (!selectedColorForBrand) {
      toast.error('Please select a color first');
      return;
    }
    
    let brandToAdd = selectedBrandForColor;
    
    // If no brand selected from dropdown, try custom brand input
    if (!brandToAdd && customBrandInput.trim()) {
      brandToAdd = customBrandInput.trim();
    }
    
    if (!brandToAdd) {
      toast.error('Please select or enter a brand name');
      return;
    }
    
    const currentBrands = formData.color_brand_mapping[selectedColorForBrand] || [];
    if (currentBrands.includes(brandToAdd)) {
      toast.error('Brand already exists for this color');
      return;
    }
    
    setFormData((prev: SpecializationData) => ({
      ...prev,
      color_brand_mapping: {
        ...prev.color_brand_mapping,
        [selectedColorForBrand]: [...currentBrands, brandToAdd]
      }
    }));
    setSelectedBrandForColor('');
    setCustomBrandInput('');
  };

  const handleRemoveBrandFromColor = (color: string, brand: string): void => {
    const currentBrands = formData.color_brand_mapping[color] || [];
    setFormData((prev: SpecializationData) => ({
      ...prev,
      color_brand_mapping: {
        ...prev.color_brand_mapping,
        [color]: currentBrands.filter(b => b !== brand)
      }
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!formData.category_id) {
      toast.error('Please select a category');
      return;
    }
    if (!formData.spec_name.trim()) {
      toast.error('Specification name is required');
      return;
    }
    // if (!formData.spec_value.trim()) {
    //   toast.error('Specification value is required');
    //   return;
    // }
    
    const colors = Object.keys(formData.color_brand_mapping);
    if (colors.length === 0) {
      toast.error('Please add at least one color');
      return;
    }

    // Check if any color has brands
    let hasBrands = false;
    for (const color of colors) {
      if (formData.color_brand_mapping[color].length > 0) {
        hasBrands = true;
        break;
      }
    }
    if (!hasBrands) {
      toast.error('Please add at least one brand for a color');
      return;
    }

    setIsLoading(true);

    try {
      const submitData = {
        ...formData,
        category_id: parseInt(formData.category_id)
      };

      if (isEditing) {
        const response = await axios.put<SpecializationResponse>(`${API_URL}/specializations/${id}`, submitData);
        if (response.data.success) {
          toast.success('Specialization updated successfully!');
        }
      } else {
        const response = await axios.post<SpecializationResponse>(`${API_URL}/specializations`, submitData);
        if (response.data.success) {
          toast.success('Specialization created successfully!');
        }
      }
      
      setTimeout(() => {
        navigate('/admin/specifications');
      }, 500);

    } catch (error) {
      console.error('Error:', error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response?.data?.message) {
          toast.error(axiosError.response.data.message);
        } else {
          toast.error(isEditing ? 'Failed to update specialization' : 'Failed to create specialization');
        }
      } else {
        toast.error(isEditing ? 'Failed to update specialization' : 'Failed to create specialization');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = (): void => {
    navigate('/admin/specifications');
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleCancel}
          className="h-10 w-10 shrink-0 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Specialization' : 'Add New Specialization'}
          </h1>
          <p className="text-sm text-gray-500">
            {isEditing ? 'Update specialization information' : 'Create a new product specialization'}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="w-full border-0 shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category_id" className="text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category_id}
                  onValueChange={handleSelectChange}
                  disabled={isLoading || isLoadingCategories}
                >
                  <SelectTrigger id="category_id" className="w-full h-10 bg-white border-gray-200">
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

              <div className="space-y-2">
                <Label htmlFor="spec_name" className="text-sm font-medium text-gray-700">
                  Specification Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="spec_name"
                  name="spec_name"
                  value={formData.spec_name}
                  onChange={handleChange}
                  placeholder="e.g., CAT6"
                  className="w-full h-10 bg-white border-gray-200"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* <div className="space-y-2 md:col-span-2">
                <Label htmlFor="spec_value" className="text-sm font-medium text-gray-700">
                  Specification Value 
                </Label>
                <Input
                  id="spec_value"
                  name="spec_value"
                  value={formData.spec_value}
                  onChange={handleChange}
                  placeholder="e.g., CAT6, CAT6A, etc."
                  className="w-full h-10 bg-white border-gray-200"
                  disabled={isLoading}
                />
              </div> */}
            </div>
          </div>

          {/* Colors & Brands */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-800 border-b pb-2">Colors & Brands</h3>
            
            {/* Add Color */}
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  placeholder="Enter color name..."
                  className="w-full h-10 bg-white border-gray-200"
                  disabled={isLoading}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddColor())}
                />
              </div>
              <Button 
                type="button" 
                onClick={handleAddColor}
                disabled={isLoading || !newColor.trim()}
                variant="outline"
                className="h-10 px-4 border-gray-200 hover:bg-gray-50"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Color
              </Button>
            </div>

            {/* Color Cards with Brands */}
            <div className="space-y-4">
              {Object.keys(formData.color_brand_mapping).length === 0 ? (
                <div className="text-sm text-gray-400 bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
                  No colors added yet. Add a color above to get started.
                </div>
              ) : (
                Object.keys(formData.color_brand_mapping).map((color) => (
                  <div
                    key={color}
                    className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span 
                          className="w-5 h-5 rounded-full border border-gray-300 shadow-sm"
                          style={{ backgroundColor: color.toLowerCase() }}
                        ></span>
                        <span className="font-semibold text-gray-800">{color}</span>
                        <span className="text-sm text-gray-500">
                          ({formData.color_brand_mapping[color]?.length || 0} brands)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveColor(color)}
                        className="text-gray-400 hover:text-red-500"
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Brands for this color */}
                    <div className="flex flex-wrap gap-2 mb-3 min-h-[2.5rem] items-center">
                      {formData.color_brand_mapping[color]?.length > 0 ? (
                        formData.color_brand_mapping[color].map((brand) => (
                          <span
                            key={brand}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                          >
                            {brand}
                            <button
                              type="button"
                              onClick={() => handleRemoveBrandFromColor(color, brand)}
                              className="text-blue-400 hover:text-red-500 transition-colors"
                              disabled={isLoading}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-400 italic">No brands added for this color</span>
                      )}
                    </div>

                    {/* Add brand to this color - Two column layout */}
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-xs font-medium text-gray-500 mb-2">Add brands to {color}:</p>
                      
                      {/* Two column layout: Dropdown and Custom Input side by side */}
                      <div className="grid grid-cols-2 gap-2">
                        {/* Select Brand Dropdown - Left Column */}
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Select
                              value={selectedColorForBrand === color ? selectedBrandForColor : ''}
                              onValueChange={(value) => {
                                setSelectedColorForBrand(color);
                                setSelectedBrandForColor(value);
                                setCustomBrandInput('');
                              }}
                              disabled={isLoading || !formData.category_id}
                            >
                              <SelectTrigger className="w-full h-9 bg-white border-gray-200 text-sm">
                                <SelectValue placeholder="Select existing..." />
                              </SelectTrigger>
                              <SelectContent>
                                {filteredBrands.map((brand) => (
                                  <SelectItem key={brand.id} value={brand.brand_name}>
                                    {brand.brand_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            type="button"
                            onClick={() => {
                              setSelectedColorForBrand(color);
                              handleAddBrandToColor();
                            }}
                            disabled={isLoading || !selectedBrandForColor}
                            variant="default"
                            size="sm"
                            className="h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
                          >
                            <Plus className="h-3.5 w-3.5 mr-1" /> Add
                          </Button>
                        </div>

                        {/* Custom Brand Input - Right Column */}
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Input
                              value={selectedColorForBrand === color ? customBrandInput : ''}
                              onChange={(e) => {
                                setSelectedColorForBrand(color);
                                setCustomBrandInput(e.target.value);
                                setSelectedBrandForColor('');
                              }}
                              onFocus={() => setSelectedColorForBrand(color)}
                              placeholder="Enter custom..."
                              className="w-full h-9 bg-white border-gray-200 text-sm"
                              disabled={isLoading}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBrandToColor())}
                            />
                          </div>
                          <Button
                            type="button"
                            onClick={() => {
                              setSelectedColorForBrand(color);
                              handleAddBrandToColor();
                            }}
                            disabled={isLoading || !customBrandInput.trim()}
                            variant="outline"
                            size="sm"
                            className="h-9 px-3 border-gray-300 hover:bg-gray-100 whitespace-nowrap"
                          >
                            <Plus className="h-3.5 w-3.5 mr-1" /> Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1 h-11 border-gray-200 hover:bg-gray-50"
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading 
                ? (isEditing ? 'Updating...' : 'Creating...') 
                : (isEditing ? 'Update Specialization' : 'Create Specialization')
              }
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}