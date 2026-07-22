// // src/components/admin/CategoryForm.jsx
// import { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { ArrowLeft, Save, X } from 'lucide-react';
// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { toast } from 'sonner';
// import axios from 'axios';

// const API_URL = 'http://localhost:5000/api';

// export function CategoryForm() {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [isLoading, setIsLoading] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     category_name: '', // Changed from 'name' to match database column
//   });

//   // Load category data if editing
//   useEffect(() => {
//     if (id) {
//       fetchCategory(id);
//     } else {
//       setIsEditing(false);
//       setFormData({
//         category_name: '',
//       });
//     }
//   }, [id]);

//   const fetchCategory = async (categoryId) => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get(`${API_URL}/categories/${categoryId}`);
      
//       if (response.data.success) {
//         const category = response.data.data;
//         setIsEditing(true);
//         setFormData({
//           category_name: category.category_name || category.name || '', // Handle both possible field names
//         });
//       } else {
//         toast.error('Category not found');
//         navigate('/admin/categories');
//       }
//     } catch (error) {
//       console.error('Error fetching category:', error);
//       toast.error('Failed to load category data');
//       navigate('/admin/categories');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate required fields
//     if (!formData.category_name.trim()) {
//       toast.error('Category name is required');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       if (isEditing) {
//         // Update existing category
//         const response = await axios.put(`${API_URL}/categories/${id}`, {
//           category_name: formData.category_name.trim(), // Match database column name
//         });

//         if (response.data.success) {
//           toast.success('Category updated successfully!');
//         }
//       } else {
//         // Create new category
//         const response = await axios.post(`${API_URL}/categories`, {
//           category_name: formData.category_name.trim(), // Match database column name
//         });

//         if (response.data.success) {
//           toast.success('Category created successfully!');
//         }
//       }
      
//       // Navigate back to categories list
//       setTimeout(() => {
//         navigate('/admin/categories');
//       }, 500);

//     } catch (error) {
//       console.error('Error:', error);
//       if (error.response) {
//         toast.error(error.response.data.message || 'Operation failed');
//       } else {
//         toast.error(isEditing ? 'Failed to update category' : 'Failed to create category');
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     navigate('/admin/categories');
//   };

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
//               {isEditing ? 'Edit Category' : 'Add New Category'}
//             </h1>
//             <p className="text-sm text-muted-foreground">
//               {isEditing ? 'Update category information' : 'Create a new product category'}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Form */}
//       <Card className="p-6">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Category Name */}
//           <div className="space-y-2">
//             <Label htmlFor="category_name" className="text-sm font-medium">
//               Category Name <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               id="category_name"
//               name="category_name"
//               value={formData.category_name}
//               onChange={handleChange}
//               placeholder="e.g., CCTV & Surveillance"
//               className="w-full"
//               required
//               disabled={isLoading}
//             />
//             <p className="text-xs text-muted-foreground">
//               This will be used as the display name for your category
//             </p>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-3 pt-4 border-t">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={handleCancel}
//               className="flex-1"
//               disabled={isLoading}
//             >
//               <X className="h-4 w-4 mr-2" />
//               Cancel
//             </Button>
//             <Button 
//               type="submit" 
//               className="flex-1"
//               disabled={isLoading}
//             >
//               <Save className="h-4 w-4 mr-2" />
//               {isLoading 
//                 ? (isEditing ? 'Updating...' : 'Creating...') 
//                 : (isEditing ? 'Update Category' : 'Create Category')
//               }
//             </Button>
//           </div>
//         </form>
//       </Card>
//     </div>
//   );
// }