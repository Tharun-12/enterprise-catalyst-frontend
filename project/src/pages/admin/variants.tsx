// // src/components/admin/AdminVariants.tsx
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Plus, Edit, Trash2, Loader2, Eye } from 'lucide-react';
// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
// import { toast } from 'sonner';
// import axios, { AxiosError } from 'axios';

// const API_URL = 'http://localhost:5000/api';

// // Define the Variant type
// interface Variant {
//   id: number;
//   product_id: number;
//   color_name: string;
//   color_hex: string;
//   price: number;
//   stock: number;
//   image_url: string | null;
//   created_at?: string;
//   updated_at?: string;
//   product_name?: string; // For displaying product name
// }

// // Define API response types
// interface ApiResponse<T> {
//   success: boolean;
//   data: T;
//   message?: string;
// }

// export function AdminVariants() {
//   const navigate = useNavigate();
//   const [variants, setVariants] = useState<Variant[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [isDeleting, setIsDeleting] = useState<boolean>(false);
//   const [deleteTarget, setDeleteTarget] = useState<Variant | null>(null);
  
//   // State for search
//   const [searchTerm, setSearchTerm] = useState<string>('');

//   // Fetch variants from API
//   useEffect(() => {
//     fetchVariants();
//   }, []);

//   const fetchVariants = async (): Promise<void> => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get<ApiResponse<Variant[]>>(`${API_URL}/variants`);
//       if (response.data.success) {
//         setVariants(response.data.data);
//       } else {
//         toast.error('Failed to load variants');
//       }
//     } catch (error: unknown) {
//       console.error('Error fetching variants:', error);
//       toast.error('Failed to load variants. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAddVariant = (): void => {
//     navigate('/admin/variants/add');
//   };

//   const handleEditVariant = (variant: Variant): void => {
//     navigate(`/admin/variants/edit/${variant.id}`);
//   };

//   const handleDelete = async (): Promise<void> => {
//     if (!deleteTarget) return;
    
//     try {
//       setIsDeleting(true);
//       const response = await axios.delete<ApiResponse<null>>(`${API_URL}/variants/${deleteTarget.id}`);
      
//       if (response.data.success) {
//         toast.success('Variant deleted successfully');
//         setVariants(prevVariants => prevVariants.filter(v => v.id !== deleteTarget.id));
//         setDeleteTarget(null);
//       } else {
//         toast.error(response.data.message || 'Failed to delete variant');
//       }
//     } catch (error: unknown) {
//       console.error('Error deleting variant:', error);
//       const axiosError = error as AxiosError<{ message: string }>;
//       const errorMessage = axiosError.response?.data?.message || 'Failed to delete variant';
//       toast.error(errorMessage);
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const handleCancelDelete = (): void => {
//     setDeleteTarget(null);
//   };

//   // Filter variants based on search
//   const filteredVariants = variants.filter((variant) =>
//     variant.color_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     variant.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     variant.id.toString().includes(searchTerm)
//   );

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
//           <p className="mt-4 text-gray-500">Loading variants...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Product Variants</h2>
//           <p className="text-sm text-gray-500">Manage product variants, colors, and pricing</p>
//         </div>
//         <div className="flex gap-2 w-full sm:w-auto">
//           <div className="flex-1 sm:w-64">
//             <Input
//               placeholder="Search variants..."
//               value={searchTerm}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
//               className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//             />
//           </div>
//           <Button 
//             onClick={handleAddVariant}
//             className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white"
//           >
//             <Plus className="w-4 h-4 mr-1.5" />
//             Add Variant
//           </Button>
//         </div>
//       </div>

//       {/* Variants Table */}
//       {filteredVariants.length === 0 ? (
//         <Card className="p-16 text-center border-2 border-dashed border-gray-300">
//           <div className="flex flex-col items-center">
//             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//               <Plus className="w-8 h-8 text-gray-400" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-700 mb-2">
//               {searchTerm ? 'No variants found matching your search' : 'No variants yet'}
//             </h3>
//             <p className="text-sm text-gray-500 mb-4">
//               {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first product variant'}
//             </p>
//             {!searchTerm && (
//               <Button onClick={handleAddVariant} className="bg-blue-600 hover:bg-blue-700 text-white">
//                 <Plus className="w-4 h-4 mr-1.5" /> Add Your First Variant
//               </Button>
//             )}
//           </div>
//         </Card>
//       ) : (
//         <Card className="overflow-hidden border border-gray-200">
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow className="bg-gray-50 border-b border-gray-200">
//                   <TableHead className="font-semibold text-gray-700">ID</TableHead>
//                   <TableHead className="font-semibold text-gray-700">Product</TableHead>
//                   <TableHead className="font-semibold text-gray-700">Color</TableHead>
//                   <TableHead className="font-semibold text-gray-700">Color Preview</TableHead>
//                   <TableHead className="font-semibold text-gray-700 text-right">Price</TableHead>
//                   <TableHead className="font-semibold text-gray-700 text-center">Stock</TableHead>
//                   <TableHead className="font-semibold text-gray-700 text-center">Image</TableHead>
//                   <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredVariants.map((variant) => (
//                   <TableRow 
//                     key={variant.id} 
//                     className="hover:bg-gray-50 transition-colors border-b border-gray-100"
//                   >
//                     <TableCell className="font-medium text-gray-900">{variant.id}</TableCell>
//                     <TableCell className="text-gray-700">
//                       {variant.product_name || 'N/A'}
//                     </TableCell>
//                     <TableCell className="text-gray-700">{variant.color_name}</TableCell>
//                     <TableCell>
//                       <div className="flex items-center gap-2">
//                         <div
//                           className="w-8 h-8 rounded-full border border-gray-200 shadow-sm"
//                           style={{ backgroundColor: variant.color_hex }}
//                         />
//                         <span className="text-xs text-gray-500 font-mono">{variant.color_hex}</span>
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-right font-medium text-gray-900">
//                       ${variant.price.toFixed(2)}
//                     </TableCell>
//                     <TableCell className="text-center">
//                       <Badge 
//                         variant={variant.stock > 10 ? 'default' : variant.stock > 0 ? 'warning' : 'destructive'}
//                         className={
//                           variant.stock > 10 
//                             ? 'bg-green-100 text-green-800 hover:bg-green-100' 
//                             : variant.stock > 0 
//                             ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
//                             : 'bg-red-100 text-red-800 hover:bg-red-100'
//                         }
//                       >
//                         {variant.stock}
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="text-center">
//                       {variant.image_url ? (
//                         <div className="flex justify-center">
//                           <div className="w-10 h-10 rounded border border-gray-200 overflow-hidden">
//                             <img 
//                               src={variant.image_url} 
//                               alt={variant.color_name}
//                               className="w-full h-full object-cover"
//                               onError={(e) => {
//                                 (e.target as HTMLImageElement).src = '/placeholder-image.png';
//                               }}
//                             />
//                           </div>
//                         </div>
//                       ) : (
//                         <span className="text-xs text-gray-400">No image</span>
//                       )}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex justify-end gap-1">
//                         <Button 
//                           variant="ghost" 
//                           size="icon" 
//                           className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600" 
//                           onClick={() => handleEditVariant(variant)}
//                           aria-label={`Edit ${variant.color_name}`}
//                         >
//                           <Edit className="w-3.5 h-3.5" />
//                         </Button>
//                         <Button 
//                           variant="ghost" 
//                           size="icon" 
//                           className="h-8 w-8 hover:bg-red-50 hover:text-red-600" 
//                           onClick={() => setDeleteTarget(variant)}
//                           aria-label={`Delete ${variant.color_name}`}
//                         >
//                           <Trash2 className="w-3.5 h-3.5" />
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//           {/* Table Footer with count */}
//           <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
//             <p className="text-sm text-gray-600">
//               Showing {filteredVariants.length} of {variants.length} variants
//             </p>
//           </div>
//         </Card>
//       )}

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={!!deleteTarget} onOpenChange={(open: boolean) => !open && handleCancelDelete()}>
//         <DialogContent className="sm:max-w-[400px]">
//           <DialogHeader>
//             <DialogTitle className="text-xl font-semibold text-gray-900">Delete Variant</DialogTitle>
//             <DialogDescription className="text-gray-600">
//               Are you sure you want to delete the variant "
//               <span className="font-semibold text-gray-900">{deleteTarget?.color_name}</span>"? 
//               This action cannot be undone.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="flex gap-3 pt-4">
//             <Button 
//               variant="outline" 
//               className="flex-1 border-gray-300 hover:bg-gray-50" 
//               onClick={handleCancelDelete}
//               disabled={isDeleting}
//             >
//               Cancel
//             </Button>
//             <Button 
//               variant="destructive" 
//               className="flex-1 bg-red-600 hover:bg-red-700" 
//               onClick={handleDelete}
//               disabled={isDeleting}
//             >
//               {isDeleting ? (
//                 <>
//                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                   Deleting...
//                 </>
//               ) : (
//                 'Delete'
//               )}
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }