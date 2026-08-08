// // src/components/admin/BrandForm.tsx
// import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { ArrowLeft, Save, X } from 'lucide-react';
// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { toast } from 'sonner';
// import axios, { AxiosError } from 'axios';
// import { baseurl } from '@/Baseurl/baseurl';

// const API_URL = `${baseurl}/api`;

// // Define types
// interface Category {
//   id: number;
//   category_name: string;
// }

// interface BrandData {
//   brand_name: string;
//   category_id: string;
// }

// interface BrandResponse {
//   success: boolean;
//   data: BrandData & { category_name?: string };
// }

// interface CategoriesResponse {
//   success: boolean;
//   data: Category[];
// }

// interface ErrorResponse {
//   message?: string;
// }

// export function BrandForm() {
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false);
//   const [formData, setFormData] = useState<BrandData>({
//     brand_name: '',
//     category_id: '',
//   });

//   // Load categories
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Load brand data if editing
//   useEffect(() => {
//     if (id) {
//       fetchBrand(id);
//     } else {
//       setIsEditing(false);
//       setFormData({
//         brand_name: '',
//         category_id: '',
//       });
//     }
//   }, [id]);

//   const fetchCategories = async (): Promise<void> => {
//     try {
//       setIsLoadingCategories(true);
//       const response = await axios.get<CategoriesResponse>(`${API_URL}/categories`);
//       if (response.data.success) {
//         setCategories(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching categories:', error);
//       toast.error('Failed to load categories');
//     } finally {
//       setIsLoadingCategories(false);
//     }
//   };

//   const fetchBrand = async (brandId: string): Promise<void> => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get<BrandResponse>(`${API_URL}/brands/${brandId}`);
      
//       if (response.data.success) {
//         const brand = response.data.data;
//         setIsEditing(true);
//         setFormData({
//           brand_name: brand.brand_name || '',
//           category_id: brand.category_id || '',
//         });
//       } else {
//         toast.error('Brand not found');
//         navigate('/admin/brands');
//       }
//     } catch (error) {
//       console.error('Error fetching brand:', error);
//       toast.error('Failed to load brand data');
//       navigate('/admin/brands');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
//     const { name, value } = e.target;
//     setFormData((prev: BrandData) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSelectChange = (value: string): void => {
//     setFormData((prev: BrandData) => ({
//       ...prev,
//       category_id: value
//     }));
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
//     e.preventDefault();
    
//     // Validate required fields
//     if (!formData.brand_name.trim()) {
//       toast.error('Brand name is required');
//       return;
//     }

//     // Validate category is selected
//     if (!formData.category_id || formData.category_id === 'none') {
//       toast.error('Please select a category');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Prepare data for submission
//       const submitData = {
//         brand_name: formData.brand_name.trim(),
//         category_id: parseInt(formData.category_id),
//       };

//       if (isEditing) {
//         // Update existing brand
//         const response = await axios.put<BrandResponse>(`${API_URL}/brands/${id}`, submitData);

//         if (response.data.success) {
//           toast.success('Brand updated successfully!');
//         }
//       } else {
//         // Create new brand
//         const response = await axios.post<BrandResponse>(`${API_URL}/brands`, submitData);

//         if (response.data.success) {
//           toast.success('Brand created successfully!');
//         }
//       }
      
//       // Navigate back to brands list
//       setTimeout(() => {
//         navigate('/admin/brands');
//       }, 500);

//     } catch (error) {
//       console.error('Error:', error);
      
//       // Handle Axios error properly with type checking
//       if (axios.isAxiosError(error)) {
//         const axiosError = error as AxiosError<ErrorResponse>;
//         if (axiosError.response?.data?.message) {
//           toast.error(axiosError.response.data.message);
//         } else {
//           toast.error(isEditing ? 'Failed to update brand' : 'Failed to create brand');
//         }
//       } else {
//         toast.error(isEditing ? 'Failed to update brand' : 'Failed to create brand');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCancel = (): void => {
//     navigate('/admin/brands');
//   };

//   return (
//     <div className="w-full px-4 py-6">
//       {/* Header */}
//       <div className="flex items-center gap-3 mb-6">
//         <Button 
//           variant="ghost" 
//           size="icon" 
//           onClick={handleCancel}
//           className="h-9 w-9 shrink-0"
//         >
//           <ArrowLeft className="h-4 w-4" />
//         </Button>
//         <div className="min-w-0">
//           <h1 className="text-2xl font-bold truncate">
//             {isEditing ? 'Edit Brand' : 'Add New Brand'}
//           </h1>
//           <p className="text-sm text-muted-foreground">
//             {isEditing ? 'Update brand information' : 'Create a new brand'}
//           </p>
//         </div>
//       </div>

//       {/* Form */}
//       <Card className="w-full">
//         <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
//           {/* Brand Information */}
//           <div className="space-y-4">
//             <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">Brand Information</h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Brand Name */}
//               <div className="space-y-2">
//                 <Label htmlFor="brand_name" className="text-sm font-medium">
//                   Brand Name <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="brand_name"
//                   name="brand_name"
//                   value={formData.brand_name}
//                   onChange={handleChange}
//                   placeholder="e.g., Hikvision"
//                   className="w-full"
//                   required
//                   disabled={isLoading}
//                 />
//                 {/* <p className="text-xs text-muted-foreground">
//                   This will be used as the display name for your brand
//                 </p> */}
//               </div>

//               {/* Category - Mandatory */}
//               <div className="space-y-2">
//                 <Label htmlFor="category_id" className="text-sm font-medium">
//                   Category <span className="text-red-500">*</span>
//                 </Label>
//                 <Select
//                   value={formData.category_id || ''}
//                   onValueChange={handleSelectChange}
//                   disabled={isLoading || isLoadingCategories}
//                   required
//                 >
//                   <SelectTrigger id="category_id" className="w-full">
//                     <SelectValue placeholder="Select a category" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {categories.map((category) => (
//                       <SelectItem key={category.id} value={String(category.id)}>
//                         {category.category_name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {/* <p className="text-xs text-muted-foreground">
//                   Select a category for this brand
//                 </p> */}
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={handleCancel}
//               className="w-full sm:w-auto sm:flex-1 order-2 sm:order-1"
//               disabled={isLoading}
//             >
//               <X className="h-4 w-4 mr-2" />
//               Cancel
//             </Button>
//             <Button 
//               type="submit" 
//               className="w-full sm:w-auto sm:flex-1 order-1 sm:order-2"
//               disabled={isLoading}
//             >
//               <Save className="h-4 w-4 mr-2" />
//               {isLoading 
//                 ? (isEditing ? 'Updating...' : 'Creating...') 
//                 : (isEditing ? 'Update Brand' : 'Create Brand')
//               }
//             </Button>
//           </div>
//         </form>
//       </Card>
//     </div>
//   );
// }