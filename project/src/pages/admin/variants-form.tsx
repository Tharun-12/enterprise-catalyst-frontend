// // src/components/admin/VariantForm.tsx
// import { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { ArrowLeft, Save, X, Upload, Image } from 'lucide-react';
// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { toast } from 'sonner';
// import axios, { AxiosError } from 'axios';

// const API_URL = 'http://localhost:5000/api';

// // Define types
// interface Product {
//   id: number;
//   name: string;
// }

// interface VariantFormData {
//   product_id: string;
//   color_name: string;
//   color_hex: string;
//   price: string;
//   stock: string;
//   image_url: string;
// }

// interface ApiResponse<T> {
//   success: boolean;
//   data: T;
//   message?: string;
// }

// export function VariantForm() {
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isEditing, setIsEditing] = useState<boolean>(false);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
//   const [formData, setFormData] = useState<VariantFormData>({
//     product_id: '',
//     color_name: '',
//     color_hex: '#000000',
//     price: '',
//     stock: '100',
//     image_url: '',
//   });

//   // Load products for dropdown
//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // Load variant data if editing
//   useEffect(() => {
//     if (id) {
//       fetchVariant(id);
//     } else {
//       setIsEditing(false);
//       setFormData({
//         product_id: '',
//         color_name: '',
//         color_hex: '#000000',
//         price: '',
//         stock: '100',
//         image_url: '',
//       });
//     }
//   }, [id]);

//   const fetchProducts = async (): Promise<void> => {
//     try {
//       setIsLoadingProducts(true);
//       const response = await axios.get<ApiResponse<Product[]>>(`${API_URL}/products`);
//       if (response.data.success) {
//         setProducts(response.data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error);
//       toast.error('Failed to load products');
//     } finally {
//       setIsLoadingProducts(false);
//     }
//   };

//   const fetchVariant = async (variantId: string): Promise<void> => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get<ApiResponse<any>>(`${API_URL}/variants/${variantId}`);
      
//       if (response.data.success) {
//         const variant = response.data.data;
//         setIsEditing(true);
//         setFormData({
//           product_id: variant.product_id.toString(),
//           color_name: variant.color_name,
//           color_hex: variant.color_hex,
//           price: variant.price.toString(),
//           stock: variant.stock.toString(),
//           image_url: variant.image_url || '',
//         });
//       } else {
//         toast.error('Variant not found');
//         navigate('/admin/variants');
//       }
//     } catch (error: unknown) {
//       console.error('Error fetching variant:', error);
//       toast.error('Failed to load variant data');
//       navigate('/admin/variants');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSelectChange = (value: string): void => {
//     setFormData(prev => ({
//       ...prev,
//       product_id: value
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
//     e.preventDefault();
    
//     // Validate required fields
//     if (!formData.product_id) {
//       toast.error('Please select a product');
//       return;
//     }
//     if (!formData.color_name.trim()) {
//       toast.error('Color name is required');
//       return;
//     }
//     if (!formData.color_hex) {
//       toast.error('Color hex code is required');
//       return;
//     }
//     if (!formData.price || parseFloat(formData.price) <= 0) {
//       toast.error('Valid price is required');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const payload = {
//         product_id: parseInt(formData.product_id),
//         color_name: formData.color_name.trim(),
//         color_hex: formData.color_hex,
//         price: parseFloat(formData.price),
//         stock: parseInt(formData.stock) || 0,
//         image_url: formData.image_url.trim() || null,
//       };

//       let response;
//       if (isEditing) {
//         response = await axios.put(`${API_URL}/variants/${id}`, payload);
//       } else {
//         response = await axios.post(`${API_URL}/variants`, payload);
//       }

//       if (response.data.success) {
//         toast.success(isEditing ? 'Variant updated successfully!' : 'Variant created successfully!');
//         setTimeout(() => {
//           navigate('/admin/variants');
//         }, 500);
//       } else {
//         toast.error(response.data.message || 'Operation failed');
//       }
//     } catch (error: unknown) {
//       console.error('Error:', error);
//       const axiosError = error as AxiosError<{ message: string }>;
//       toast.error(axiosError.response?.data?.message || (isEditing ? 'Failed to update variant' : 'Failed to create variant'));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCancel = (): void => {
//     navigate('/admin/variants');
//   };

//   // Common color presets
//   const colorPresets = [
//     '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
//     '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
//     '#008000', '#800000', '#000080', '#808080', '#C0C0C0',
//   ];

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <Button 
//             variant="ghost" 
//             size="icon" 
//             onClick={handleCancel}
//             className="h-9 w-9"
//           >
//             <ArrowLeft className="h-4 w-4" />
//           </Button>
//           <div>
//             <h1 className="text-2xl font-bold">
//               {isEditing ? 'Edit Variant' : 'Add New Variant'}
//             </h1>
//             <p className="text-sm text-gray-500">
//               {isEditing ? 'Update product variant information' : 'Create a new product variant'}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Form */}
//       <Card className="p-6">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Product Selection */}
//           <div className="space-y-2">
//             <Label htmlFor="product_id" className="text-sm font-medium">
//               Product <span className="text-red-500">*</span>
//             </Label>
//             <Select
//               value={formData.product_id}
//               onValueChange={handleSelectChange}
//               disabled={isLoading || isLoadingProducts}
//             >
//               <SelectTrigger className="w-full border-gray-300">
//                 <SelectValue placeholder="Select a product..." />
//               </SelectTrigger>
//               <SelectContent>
//                 {products.map((product) => (
//                   <SelectItem key={product.id} value={product.id.toString()}>
//                     {product.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <p className="text-xs text-gray-500">
//               Select the product this variant belongs to
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Color Name */}
//             <div className="space-y-2">
//               <Label htmlFor="color_name" className="text-sm font-medium">
//                 Color Name <span className="text-red-500">*</span>
//               </Label>
//               <Input
//                 id="color_name"
//                 name="color_name"
//                 value={formData.color_name}
//                 onChange={handleChange}
//                 placeholder="e.g., Black, White, Red"
//                 className="w-full border-gray-300"
//                 required
//                 disabled={isLoading}
//               />
//               <p className="text-xs text-gray-500">
//                 Name of the color variant
//               </p>
//             </div>

//             {/* Color Hex */}
//             <div className="space-y-2">
//               <Label htmlFor="color_hex" className="text-sm font-medium">
//                 Color Hex Code <span className="text-red-500">*</span>
//               </Label>
//               <div className="flex gap-3">
//                 <div className="flex-1">
//                   <Input
//                     id="color_hex"
//                     name="color_hex"
//                     value={formData.color_hex}
//                     onChange={handleChange}
//                     placeholder="#000000"
//                     className="w-full border-gray-300 font-mono"
//                     required
//                     disabled={isLoading}
//                   />
//                 </div>
//                 <div className="flex items-center">
//                   <div
//                     className="w-10 h-10 rounded-md border border-gray-300 shadow-sm"
//                     style={{ backgroundColor: formData.color_hex }}
//                   />
//                 </div>
//               </div>
//               <div className="flex flex-wrap gap-1 mt-1">
//                 {colorPresets.map((color) => (
//                   <button
//                     key={color}
//                     type="button"
//                     className="w-6 h-6 rounded-full border border-gray-200 hover:ring-2 hover:ring-blue-400 transition-all"
//                     style={{ backgroundColor: color }}
//                     onClick={() => setFormData(prev => ({ ...prev, color_hex: color }))}
//                     aria-label={`Select color ${color}`}
//                   />
//                 ))}
//               </div>
//               <p className="text-xs text-gray-500">
//                 Click a preset color or enter a custom hex code
//               </p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Price */}
//             <div className="space-y-2">
//               <Label htmlFor="price" className="text-sm font-medium">
//                 Price <span className="text-red-500">*</span>
//               </Label>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
//                 <Input
//                   id="price"
//                   name="price"
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   value={formData.price}
//                   onChange={handleChange}
//                   placeholder="0.00"
//                   className="w-full border-gray-300 pl-7"
//                   required
//                   disabled={isLoading}
//                 />
//               </div>
//               <p className="text-xs text-gray-500">
//                 Price for this variant
//               </p>
//             </div>

//             {/* Stock */}
//             <div className="space-y-2">
//               <Label htmlFor="stock" className="text-sm font-medium">
//                 Stock Quantity
//               </Label>
//               <Input
//                 id="stock"
//                 name="stock"
//                 type="number"
//                 min="0"
//                 value={formData.stock}
//                 onChange={handleChange}
//                 placeholder="100"
//                 className="w-full border-gray-300"
//                 disabled={isLoading}
//               />
//               <p className="text-xs text-gray-500">
//                 Available quantity in stock
//               </p>
//             </div>
//           </div>

//           {/* Image URL */}
//           <div className="space-y-2">
//             <Label htmlFor="image_url" className="text-sm font-medium">
//               Image URL
//             </Label>
//             <div className="flex gap-3">
//               <div className="flex-1">
//                 <Input
//                   id="image_url"
//                   name="image_url"
//                   value={formData.image_url}
//                   onChange={handleChange}
//                   placeholder="https://example.com/image.jpg"
//                   className="w-full border-gray-300"
//                   disabled={isLoading}
//                 />
//               </div>
//               {formData.image_url && (
//                 <div className="flex items-center">
//                   <div className="w-12 h-12 rounded border border-gray-200 overflow-hidden">
//                     <img 
//                       src={formData.image_url} 
//                       alt="Variant preview"
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         (e.target as HTMLImageElement).src = '/placeholder-image.png';
//                       }}
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//             <p className="text-xs text-gray-500">
//               URL to the variant image (optional)
//             </p>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-3 pt-4 border-t">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={handleCancel}
//               className="flex-1 border-gray-300 hover:bg-gray-50"
//               disabled={isLoading}
//             >
//               <X className="h-4 w-4 mr-2" />
//               Cancel
//             </Button>
//             <Button 
//               type="submit" 
//               className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
//               disabled={isLoading}
//             >
//               <Save className="h-4 w-4 mr-2" />
//               {isLoading 
//                 ? (isEditing ? 'Updating...' : 'Creating...') 
//                 : (isEditing ? 'Update Variant' : 'Create Variant')
//               }
//             </Button>
//           </div>
//         </form>
//       </Card>
//     </div>
//   );
// }