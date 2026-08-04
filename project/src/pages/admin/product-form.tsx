// src/components/admin/ProductForm.tsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Pencil, Trash2, X, Plus, FileText, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import './product-form.css';
import { baseurl } from '@/Baseurl/baseurl';

const API_URL = baseurl;

// Type Definitions
interface Category {
    id: number;
    category_name: string;
}

interface Brand {
    id: number;
    brand_name: string;
    category_id: number;
    description?: string;
    product_series?: string;
    conductor_type?: string;
    cable_od?: string;
    jacket_material?: string;
    bandwidth?: string;
    operating_temperature?: string;
    poe_support?: string;
    category_name?: string;
    created_at?: string;
    updated_at?: string;
}

interface Specialization {
    id: number;
    category_id: number;
    category_name?: string;
    spec_name: string;
    spec_value: string;
    color_brand_mapping: { [key: string]: string[] };
}

interface FormData {
    product_name: string;
    product_code: string;
    price: string;
    discount: string;
    product_description: string;
    warranty: string;
    product_details_pdf: File | null;
    existing_pdf?: string;
    product_series: string;
    product_type: string;
}

interface Variant {
    id?: number;
    variant_name: string;
    part_code: string;
    category: string;
    brand: string;
    description: string;
    spec_type: string;
    color: string;
    size: string;
    price: string;
    availability: string;
    datasheet_url: string;
    stock: string;
    images: File[];
    existingImages?: string[];
    _isNew?: boolean;
}

interface SpecComparison {
    id?: number;
    spec_type: string;
    bandwidth: string;
    max_data_rate: string;
    internal_design: string;
    typical_applications: string;
}

const ProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;

    const [formData, setFormData] = useState<FormData>({
        product_name: '',
        product_code: '',
        price: '',
        discount: '0',
        product_description: '',
        warranty: '',
        product_details_pdf: null,
        existing_pdf: '',
        product_series: '',
        product_type: ''
    });

    // Variants State
    const [variants, setVariants] = useState<Variant[]>([]);
    const [currentVariant, setCurrentVariant] = useState<Variant>({
        variant_name: '',
        part_code: '',
        category: '',
        brand: '',
        description: '',
        spec_type: '',
        color: '',
        size: '',
        price: '',
        availability: '',
        datasheet_url: '',
        stock: '100',
        images: [],
        existingImages: []
    });
    const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(null);

    // Spec Comparison State
    const [specComparisons, setSpecComparisons] = useState<SpecComparison[]>([]);
    const [currentSpecComparison, setCurrentSpecComparison] = useState<SpecComparison>({
        spec_type: '',
        bandwidth: '',
        max_data_rate: '',
        internal_design: '',
        typical_applications: ''
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [specializations, setSpecializations] = useState<Specialization[]>([]);
    const [specTypes, setSpecTypes] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [selectedFileNames, setSelectedFileNames] = useState<string>('');
    const [showSpecComparison, setShowSpecComparison] = useState<boolean>(false);
    const [showVariantForm, setShowVariantForm] = useState<boolean>(false);

    const isSubmittingRef = useRef<boolean>(false);

    // Fetch data on load
    useEffect(() => {
        fetchCategories();
        fetchBrands();
        fetchSpecializations();
        if (isEditMode) {
            fetchProductData();
            fetchSpecComparisons();
        }
    }, [id]);

    // REMOVED: Filter brands and specs when category changes (no longer needed for main form)

    // Extract spec types from specializations for comparison dropdown
    useEffect(() => {
        const types = specializations.map((spec: Specialization) => spec.spec_name);
        setSpecTypes([...new Set<string>(types)]);
    }, [specializations]);

    const fetchCategories = async (): Promise<void> => {
        try {
            const response = await axios.get(`${API_URL}/api/categories/`);
            if (response.data.success) {
                setCategories(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchBrands = async (): Promise<void> => {
        try {
            const response = await axios.get(`${API_URL}/api/brands/`);
            if (response.data.success) {
                setBrands(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    const fetchSpecializations = async (): Promise<void> => {
        try {
            const response = await axios.get(`${API_URL}/api/specializations/`);
            if (response.data.success) {
                setSpecializations(response.data.data);
                const types = response.data.data.map((spec: Specialization) => spec.spec_name);
                setSpecTypes([...new Set<string>(types)]);
            }
        } catch (error) {
            console.error('Error fetching specializations:', error);
        }
    };

    const fetchProductData = async () => {
        try {
            setLoading(true);
            const productResponse = await axios.get(`${API_URL}/api/products/products-with-variants/${id}`);
            const productData = productResponse.data;

            setFormData({
                product_name: productData.product_name || '',
                product_code: productData.product_code || '',
                price: productData.price || '',
                discount: productData.discount || '0',
                product_description: productData.product_description || '',
                warranty: productData.warranty || '',
                product_details_pdf: null,
                existing_pdf: productData.product_details_pdf || '',
                product_series: productData.product_series || '',
                product_type: productData.product_type || ''
            });

            if (productData.variants && Array.isArray(productData.variants)) {
                const formattedVariants = productData.variants.map((v: any) => ({
                    id: v.id,
                    variant_name: v.variant_name || '',
                    part_code: v.part_code || '',
                    category: v.category || '',
                    brand: v.brand || '',
                    description: v.description || '',
                    spec_type: v.spec_type || '',
                    color: v.color || '',
                    size: v.size || '',
                    price: String(v.price) || '',
                    availability: v.availability || '',
                    datasheet_url: v.datasheet_url || '',
                    stock: String(v.stock) || '100',
                    images: [],
                    existingImages: v.image_url ? [v.image_url] : [],
                    _isNew: false
                }));
                setVariants(formattedVariants);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            setError('Failed to load product data');
        } finally {
            setLoading(false);
        }
    };

    const fetchSpecComparisons = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/products/spec-comparison/${id}`);
            const data = response.data;
            const comparisons = [];
            if (data.CAT6) {
                comparisons.push({ ...data.CAT6, spec_type: 'CAT6' });
            }
            if (data.CAT6A) {
                comparisons.push({ ...data.CAT6A, spec_type: 'CAT6A' });
            }
            setSpecComparisons(comparisons);
        } catch (error) {
            console.error('Error fetching spec comparisons:', error);
        }
    };

    // ============================================
    // SPEC COMPARISON HANDLERS
    // ============================================
    const handleSpecComparisonChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrentSpecComparison(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSpecComparison = () => {
        if (!currentSpecComparison.spec_type) {
            setError('Please select a spec type');
            return;
        }

        const exists = specComparisons.some(s => s.spec_type === currentSpecComparison.spec_type);
        if (exists) {
            setError(`Spec comparison for ${currentSpecComparison.spec_type} already exists. Please edit it instead.`);
            return;
        }

        setSpecComparisons(prev => [...prev, { ...currentSpecComparison }]);
        setCurrentSpecComparison({
            spec_type: '',
            bandwidth: '',
            max_data_rate: '',
            internal_design: '',
            typical_applications: ''
        });
        setSuccess('Spec comparison added successfully');
        setTimeout(() => setSuccess(''), 3000);
    };

    const handleEditSpecComparison = (index: number) => {
        setCurrentSpecComparison({ ...specComparisons[index] });
        const updated = specComparisons.filter((_, i) => i !== index);
        setSpecComparisons(updated);
    };

    const handleRemoveSpecComparison = (index: number) => {
        const spec = specComparisons[index];
        if (spec.id) {
            axios.delete(`${API_URL}/api/products/spec-comparison/${id}/${spec.spec_type}`)
                .then(() => {
                    const updated = specComparisons.filter((_, i) => i !== index);
                    setSpecComparisons(updated);
                    setSuccess('Spec comparison removed');
                    setTimeout(() => setSuccess(''), 3000);
                })
                .catch(err => console.error('Error deleting spec comparison:', err));
        } else {
            const updated = specComparisons.filter((_, i) => i !== index);
            setSpecComparisons(updated);
        }
    };

    // ============================================
    // VARIANT HANDLERS
    // ============================================
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setFormData(prev => ({ ...prev, product_details_pdf: file }));
        }
    };

    const handleVariantChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
        setCurrentVariant(prev => ({ ...prev, [name]: value }));
    };

    const handleVariantImages = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const files = Array.from(e.target.files || []);
        setCurrentVariant(prev => ({ ...prev, images: files }));
        if (files.length > 0) {
            setSelectedFileNames(files.map(f => f.name).join(', '));
        } else {
            setSelectedFileNames('');
        }
    };

    const handleAddOrUpdateVariant = (): void => {
        if (!currentVariant.variant_name || !currentVariant.part_code || !currentVariant.brand || !currentVariant.price) {
            setError('Please fill in variant name, part code, brand, and price');
            return;
        }

        if (editingVariantIndex !== null) {
            const updatedVariants = [...variants];
            updatedVariants[editingVariantIndex] = {
                ...currentVariant,
                id: variants[editingVariantIndex].id,
                _isNew: false
            };
            setVariants(updatedVariants);
            setEditingVariantIndex(null);
            setSuccess('Variant updated successfully');
        } else {
            setVariants(prev => [...prev, { ...currentVariant, _isNew: true }]);
            setSuccess('Variant added successfully');
        }

        setCurrentVariant({
            variant_name: '',
            part_code: '',
            category: '',
            brand: '',
            description: '',
            spec_type: '',
            color: '',
            size: '',
            price: '',
            availability: '',
            datasheet_url: '',
            stock: '100',
            images: [],
            existingImages: []
        });
        setSelectedFileNames('');
        setError('');
        setShowVariantForm(false);
        setTimeout(() => setSuccess(''), 3000);
    };

    const handleEditVariant = (index: number): void => {
        const variant = variants[index];
        setCurrentVariant({
            ...variant,
            images: [],
        });
        setEditingVariantIndex(index);
        setSelectedFileNames('');
        setShowVariantForm(true);
        document.querySelector('.variant-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const cancelEdit = (): void => {
        setEditingVariantIndex(null);
        setCurrentVariant({
            variant_name: '',
            part_code: '',
            category: '',
            brand: '',
            description: '',
            spec_type: '',
            color: '',
            size: '',
            price: '',
            availability: '',
            datasheet_url: '',
            stock: '100',
            images: [],
            existingImages: []
        });
        setSelectedFileNames('');
        setError('');
        setShowVariantForm(false);
    };

    const removeVariant = (index: number): void => {
        const newVariants = variants.filter((_, i) => i !== index);
        setVariants(newVariants);
        if (editingVariantIndex === index) {
            setEditingVariantIndex(null);
            setCurrentVariant({
                variant_name: '',
                part_code: '',
                category: '',
                brand: '',
                description: '',
                spec_type: '',
                color: '',
                size: '',
                price: '',
                availability: '',
                datasheet_url: '',
                stock: '100',
                images: [],
                existingImages: []
            });
        }
    };

    // Get filtered brands by category
    const getFilteredBrandsByCategory = (categoryId: string) => {
        if (!categoryId) return brands;
        return brands.filter(brand => brand.category_id === parseInt(categoryId));
    };

    // Get filtered specs for variant based on selected category
    const getFilteredSpecsForVariant = (categoryId: string) => {
        if (!categoryId) return specializations;
        return specializations.filter(spec => spec.category_id === parseInt(categoryId));
    };

    // Get colors from selected spec for variant
    const getColorsFromSpec = (specName: string, categoryId: string) => {
        if (!specName || !categoryId) return [];
        const spec = specializations.find(
            s => s.spec_name === specName && s.category_id === parseInt(categoryId)
        );
        if (spec && spec.color_brand_mapping) {
            return Object.keys(spec.color_brand_mapping);
        }
        return [];
    };

    // Get brands for a specific color from spec
    const getBrandsForColor = (specName: string, categoryId: string, color: string) => {
        if (!specName || !categoryId || !color) return [];
        const spec = specializations.find(
            s => s.spec_name === specName && s.category_id === parseInt(categoryId)
        );
        if (spec && spec.color_brand_mapping && spec.color_brand_mapping[color]) {
            return spec.color_brand_mapping[color];
        }
        return [];
    };

    const getImageUrl = (imagePath: string): string => {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
        return `${API_URL}${cleanPath}`;
    };

    const getPdfUrl = (pdfPath: string): string => {
        if (!pdfPath) return '';
        if (pdfPath.startsWith('http')) return pdfPath;
        return `${API_URL}/uploads/pdfs/${pdfPath}`;
    };

    // ============================================
    // SUBMIT HANDLER - UPDATED WITH PRODUCT_CODE
    // ============================================
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (isSubmittingRef.current) return;
        isSubmittingRef.current = true;

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            let productId: number;

            // Get category and brand from the first variant if available
            const firstVariant = variants.length > 0 ? variants[0] : null;
            const categoryId = firstVariant?.category || '';
            const brand = firstVariant?.brand || '';

            if (isEditMode) {
                // Update product
                const productFormData = new FormData();
                
                // Add all form fields including product_code
                const formFields = {
                    product_name: formData.product_name,
                    product_code: formData.product_code,
                    price: formData.price,
                    discount: formData.discount,
                    product_description: formData.product_description,
                    warranty: formData.warranty,
                    product_series: formData.product_series,
                    product_type: formData.product_type
                };
                
                Object.entries(formFields).forEach(([key, value]) => {
                    if (value !== null && value !== "") {
                        productFormData.append(key, String(value));
                    }
                });
                
                // Add category and brand from variant
                if (categoryId) {
                    productFormData.append('product_category_id', categoryId);
                }
                if (brand) {
                    productFormData.append('product_brand', brand);
                }
                
                // Handle PDF upload
                if (formData.product_details_pdf) {
                    productFormData.append("product_details_pdf", formData.product_details_pdf);
                } else if (formData.existing_pdf) {
                    productFormData.append("existing_pdf", formData.existing_pdf);
                }

                await axios.put(
                    `${API_URL}/api/products/${id}`,
                    productFormData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                productId = parseInt(id!);
                setSuccess("Product updated successfully.");

                // Handle variants - Get existing variants
                const existingVariantsResponse = await axios.get(`${API_URL}/api/products/variants/${productId}`);
                const existingVariants = existingVariantsResponse.data;
                const existingIds = existingVariants.map((v: any) => v.id);
                const currentIds = variants.filter(v => v.id).map(v => v.id);

                // Delete removed variants
                for (const existingId of existingIds) {
                    if (!currentIds.includes(existingId)) {
                        await axios.delete(`${API_URL}/api/products/variants/${existingId}`);
                    }
                }

                // Update or create variants
                for (const variant of variants) {
                    const variantData = new FormData();
                    
                    // Append all variant fields explicitly
                    variantData.append('product_id', String(productId));
                    variantData.append('variant_name', variant.variant_name || '');
                    variantData.append('part_code', variant.part_code || '');
                    variantData.append('category', variant.category || '');
                    variantData.append('brand', variant.brand || '');
                    variantData.append('description', variant.description || '');
                    variantData.append('spec_type', variant.spec_type || '');
                    variantData.append('color', variant.color || '');
                    variantData.append('size', variant.size || '');
                    variantData.append('price', variant.price || '0');
                    variantData.append('availability', variant.availability || '');
                    variantData.append('datasheet_url', variant.datasheet_url || '');
                    variantData.append('stock', variant.stock || '100');

                    // Append images if any
                    if (variant.images && variant.images.length > 0) {
                        variant.images.forEach(img => {
                            variantData.append('images', img);
                        });
                    }

                    if (variant.id) {
                        variantData.append('keep_image', String(!(variant.images && variant.images.length > 0)));
                        await axios.put(
                            `${API_URL}/api/products/variants/${variant.id}`,
                            variantData,
                            { headers: { "Content-Type": "multipart/form-data" } }
                        );
                    } else {
                        await axios.post(
                            `${API_URL}/api/products/variants`,
                            variantData,
                            { headers: { "Content-Type": "multipart/form-data" } }
                        );
                    }
                }

                // Save spec comparisons
                await axios.delete(`${API_URL}/api/products/spec-comparison/${productId}/all`);
                for (const spec of specComparisons) {
                    await axios.post(`${API_URL}/api/products/spec-comparison`, {
                        product_id: productId,
                        spec_type: spec.spec_type,
                        bandwidth: spec.bandwidth || '',
                        max_data_rate: spec.max_data_rate || '',
                        internal_design: spec.internal_design || '',
                        typical_applications: spec.typical_applications || ''
                    });
                }

            } else {
                // Create new product
                const productFormData = new FormData();
                
                // Add all form fields including product_code
                const formFields = {
                    product_name: formData.product_name,
                    product_code: formData.product_code,
                    price: formData.price,
                    discount: formData.discount,
                    product_description: formData.product_description,
                    warranty: formData.warranty,
                    product_series: formData.product_series,
                    product_type: formData.product_type
                };
                
                Object.entries(formFields).forEach(([key, value]) => {
                    if (value !== null && value !== "") {
                        productFormData.append(key, String(value));
                    }
                });
                
                // Add category and brand from variant
                if (categoryId) {
                    productFormData.append('product_category_id', categoryId);
                }
                if (brand) {
                    productFormData.append('product_brand', brand);
                }

                // Handle PDF upload
                if (formData.product_details_pdf) {
                    productFormData.append("product_details_pdf", formData.product_details_pdf);
                }

                const productResponse = await axios.post(
                    `${API_URL}/api/products`,
                    productFormData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                productId = productResponse.data.id;

                // Create variants
                for (const variant of variants) {
                    const variantData = new FormData();
                    
                    // Append all variant fields explicitly
                    variantData.append('product_id', String(productId));
                    variantData.append('variant_name', variant.variant_name || '');
                    variantData.append('part_code', variant.part_code || '');
                    variantData.append('category', variant.category || '');
                    variantData.append('brand', variant.brand || '');
                    variantData.append('description', variant.description || '');
                    variantData.append('spec_type', variant.spec_type || '');
                    variantData.append('color', variant.color || '');
                    variantData.append('size', variant.size || '');
                    variantData.append('price', variant.price || '0');
                    variantData.append('availability', variant.availability || '');
                    variantData.append('datasheet_url', variant.datasheet_url || '');
                    variantData.append('stock', variant.stock || '100');

                    // Append images if any
                    if (variant.images && variant.images.length > 0) {
                        variant.images.forEach(img => {
                            variantData.append('images', img);
                        });
                    }

                    await axios.post(
                        `${API_URL}/api/products/variants`,
                        variantData,
                        { headers: { "Content-Type": "multipart/form-data" } }
                    );
                }

                // Save spec comparisons
                for (const spec of specComparisons) {
                    await axios.post(`${API_URL}/api/products/spec-comparison`, {
                        product_id: productId,
                        spec_type: spec.spec_type,
                        bandwidth: spec.bandwidth || '',
                        max_data_rate: spec.max_data_rate || '',
                        internal_design: spec.internal_design || '',
                        typical_applications: spec.typical_applications || ''
                    });
                }
            }

            setSuccess(`${isEditMode ? 'Product updated' : 'Product added'} successfully!`);
            setTimeout(() => navigate('/admin/products'), 1500);

        } catch (err: any) {
            console.error("Error in handleSubmit:", err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || err.response?.data?.message || "Request Failed");
            } else {
                setError(err.message || "An unexpected error occurred");
            }
        } finally {
            setLoading(false);
            isSubmittingRef.current = false;
        }
    };

    if (loading && isEditMode) {
        return (
            <div className="product-form-container">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading product data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="product-form-container">
            <h2>{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>

            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit} className="product-form">
                {/* ============================================
                    PRODUCT DETAILS SECTION
                    ============================================ */}
                <div className="form-section">
                    <h3>Product Details</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="product_name">Product Name *</label>
                            <input
                                type="text"
                                id="product_name"
                                name="product_name"
                                value={formData.product_name}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter product name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="product_code">Product Code *</label>
                            <input
                                type="text"
                                id="product_code"
                                name="product_code"
                                value={formData.product_code}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g., CPC3312-01M001"
                            />
                            <small>Enter a unique product code</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="product_type">Product Type</label>
                            <input
                                type="text"
                                id="product_type"
                                name="product_type"
                                value={formData.product_type}
                                onChange={handleInputChange}
                                placeholder="e.g., Patch Cord, Cable, Panel"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="product_series">Product Series</label>
                            <input
                                type="text"
                                id="product_series"
                                name="product_series"
                                value={formData.product_series}
                                onChange={handleInputChange}
                                placeholder="e.g., GigaSPEED X10D"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="product_description">Description *</label>
                            <input
                                type="text"
                                id="product_description"
                                name="product_description"
                                value={formData.product_description}
                                onChange={handleInputChange}
                                required
                                placeholder="e.g., GigaSPEED X10D® Cat 6A U/UTP Patch Cord, Non-Plenum 1 Mtr Black"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="warranty">Availability/Warranty</label>
                            <input
                                type="text"
                                id="warranty"
                                name="warranty"
                                value={formData.warranty}
                                onChange={handleInputChange}
                                placeholder="e.g., 1 to 3 Weeks, In Stock"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="price">Price (INR) *</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                                step="0.01"
                                placeholder="0.00"
                            />
                            <small>For Discounts reach us out @ sales</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="discount">Discount (%)</label>
                            <input
                                type="number"
                                id="discount"
                                name="discount"
                                value={formData.discount}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                max="100"
                                placeholder="0"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="product_details_pdf">Data Sheet (PDF)</label>
                            <input
                                type="file"
                                id="product_details_pdf"
                                name="product_details_pdf"
                                onChange={handleFileChange}
                                accept=".pdf"
                            />
                            <small className="file-hint">Upload product datasheet PDF (max 5MB)</small>
                            {isEditMode && formData.existing_pdf && (
                                <div className="file-existing-container">
                                    <FileText className="file-icon" size={16} />
                                    <span className="file-existing">
                                        Current PDF: {formData.existing_pdf}
                                        {formData.product_details_pdf && (
                                            <span className="file-will-replace"> (will be replaced)</span>
                                        )}
                                    </span>
                                    <a
                                        href={getPdfUrl(formData.existing_pdf)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="file-link"
                                    >
                                        <ExternalLink size={14} /> View PDF
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ============================================
                    SPEC COMPARISON SECTION
                    ============================================ */}
                <div className="form-section">
                    <button
                        type="button"
                        className="section-toggle"
                        onClick={() => setShowSpecComparison(!showSpecComparison)}
                    >
                        <span>📊 Comparison of Specifications</span>
                        {showSpecComparison ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>

                    {showSpecComparison && (
                        <div className="comparison-container">
                            <div className="comparison-form">
                                <h4>Add Spec Comparison</h4>
                                <div className="form-grid comparison-grid">
                                    <div className="form-group">
                                        <label>Spec Type *</label>
                                        <select
                                            name="spec_type"
                                            value={currentSpecComparison.spec_type}
                                            onChange={handleSpecComparisonChange}
                                        >
                                            <option value="">Select Spec Type</option>
                                            {specTypes.map((type) => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Bandwidth</label>
                                        <input
                                            type="text"
                                            name="bandwidth"
                                            value={currentSpecComparison.bandwidth}
                                            onChange={handleSpecComparisonChange}
                                            placeholder="e.g., 250 MHz"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Max Data Rate</label>
                                        <input
                                            type="text"
                                            name="max_data_rate"
                                            value={currentSpecComparison.max_data_rate}
                                            onChange={handleSpecComparisonChange}
                                            placeholder="e.g., 1 Gbps (100 m)"
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Internal Design</label>
                                        <input
                                            type="text"
                                            name="internal_design"
                                            value={currentSpecComparison.internal_design}
                                            onChange={handleSpecComparisonChange}
                                            placeholder="e.g., Standard pair separation"
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Typical Applications</label>
                                        <input
                                            type="text"
                                            name="typical_applications"
                                            value={currentSpecComparison.typical_applications}
                                            onChange={handleSpecComparisonChange}
                                            placeholder="e.g., Offices, LAN, CCTV"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAddSpecComparison}
                                    className="btn btn-secondary"
                                >
                                    <Plus className="icon-sm" /> Add Spec Comparison
                                </button>
                            </div>

                            {specComparisons.length > 0 && (
                                <div className="comparison-list">
                                    <h4>Spec Comparisons</h4>
                                    <table className="comparison-table">
                                        <thead>
                                            <tr>
                                                <th>Spec Type</th>
                                                <th>Bandwidth</th>
                                                <th>Max Data Rate</th>
                                                <th>Internal Design</th>
                                                <th>Typical Applications</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {specComparisons.map((spec, index) => (
                                                <tr key={index}>
                                                    <td><strong>{spec.spec_type}</strong></td>
                                                    <td>{spec.bandwidth}</td>
                                                    <td>{spec.max_data_rate}</td>
                                                    <td>{spec.internal_design}</td>
                                                    <td>{spec.typical_applications}</td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEditSpecComparison(index)}
                                                            className="btn btn-edit btn-sm"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={14} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveSpecComparison(index)}
                                                            className="btn btn-danger btn-sm"
                                                            title="Remove"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ============================================
                    VARIANTS SECTION
                    ============================================ */}
                <div className="form-section">
                    <div className="section-header">
                        <h3>Product Variants</h3>
                        <button
                            type="button"
                            onClick={() => setShowVariantForm(!showVariantForm)}
                            className="btn btn-secondary btn-sm"
                        >
                            {showVariantForm ? 'Cancel' : '+ Add Variant'}
                        </button>
                    </div>

                    {showVariantForm && (
                        <div className="variant-form">
                            <div className="variant-form-grid">
                                <div className="form-group">
                                    <label>Variant Name *</label>
                                    <input
                                        type="text"
                                        name="variant_name"
                                        value={currentVariant.variant_name}
                                        onChange={handleVariantChange}
                                        placeholder="e.g., CAT6A Patch Cord 1M Black"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Part Code *</label>
                                    <input
                                        type="text"
                                        name="part_code"
                                        value={currentVariant.part_code}
                                        onChange={handleVariantChange}
                                        placeholder="e.g., CPC3312-01M001"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Category *</label>
                                    <select
                                        name="category"
                                        value={currentVariant.category}
                                        onChange={handleVariantChange}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={String(category.id)}>
                                                {category.category_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Spec Type *</label>
                                    <select
                                        name="spec_type"
                                        value={currentVariant.spec_type}
                                        onChange={handleVariantChange}
                                        required
                                    >
                                        <option value="">Select Spec Type</option>
                                        {getFilteredSpecsForVariant(currentVariant.category).map(spec => (
                                            <option key={spec.id} value={spec.spec_name}>
                                                {spec.spec_name} - {spec.spec_value}
                                            </option>
                                        ))}
                                    </select>
                                    {getFilteredSpecsForVariant(currentVariant.category).length === 0 && currentVariant.category && (
                                        <small className="text-gray-500">No specifications available for this category</small>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Color *</label>
                                    <select
                                        name="color"
                                        value={currentVariant.color}
                                        onChange={handleVariantChange}
                                        required
                                    >
                                        <option value="">Select Color</option>
                                        {getColorsFromSpec(currentVariant.spec_type, currentVariant.category).map((color) => (
                                            <option key={color} value={color}>
                                                {color}
                                            </option>
                                        ))}
                                    </select>
                                    {getColorsFromSpec(currentVariant.spec_type, currentVariant.category).length === 0 && currentVariant.spec_type && (
                                        <small className="text-gray-500">No colors available for this spec type</small>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Brand *</label>
                                    <select
                                        name="brand"
                                        value={currentVariant.brand}
                                        onChange={handleVariantChange}
                                        required
                                    >
                                        <option value="">Select Brand</option>
                                        {/* Show all brands from the selected category */}
                                        {getFilteredBrandsByCategory(currentVariant.category).map((brand) => (
                                            <option key={brand.id} value={brand.brand_name}>
                                                {brand.brand_name}
                                            </option>
                                        ))}
                                    </select>
                                    {getFilteredBrandsByCategory(currentVariant.category).length === 0 && currentVariant.category && (
                                        <small className="text-gray-500">No brands available for this category</small>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Size</label>
                                    <input
                                        type="text"
                                        name="size"
                                        value={currentVariant.size}
                                        onChange={handleVariantChange}
                                        placeholder="e.g., 1 Mtrs, 2 Mtrs, 22U"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Price (INR) *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={currentVariant.price}
                                        onChange={handleVariantChange}
                                        step="0.01"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Availability</label>
                                    <input
                                        type="text"
                                        name="availability"
                                        value={currentVariant.availability}
                                        onChange={handleVariantChange}
                                        placeholder="e.g., In Stock, 2-4 Weeks"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Stock</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={currentVariant.stock}
                                        onChange={handleVariantChange}
                                        placeholder="100"
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Description</label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={currentVariant.description}
                                        onChange={handleVariantChange}
                                        placeholder="e.g., GigaSPEED X10D Cat 6A U/UTP Patch Cord, Non-Plenum 1 Mtr Black"
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Datasheet URL</label>
                                    <input
                                        type="url"
                                        name="datasheet_url"
                                        value={currentVariant.datasheet_url}
                                        onChange={handleVariantChange}
                                        placeholder="https://example.com/datasheet.pdf"
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>Variant Images</label>
                                    <input
                                        type="file"
                                        name="images"
                                        onChange={handleVariantImages}
                                        accept="image/*"
                                        multiple
                                    />
                                    {selectedFileNames && (
                                        <small className="file-selected">{selectedFileNames}</small>
                                    )}
                                    {currentVariant.existingImages && currentVariant.existingImages.length > 0 && (
                                        <div className="current-images-container">
                                            <small className="file-existing">Current images:</small>
                                            <div className="current-images-grid">
                                                {currentVariant.existingImages.map((img, idx) => (
                                                    <div key={idx} className="current-image-item">
                                                        <img
                                                            src={getImageUrl(img)}
                                                            alt={`Variant ${idx + 1}`}
                                                            className="current-image-thumb"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="variant-actions">
                                <button
                                    type="button"
                                    onClick={handleAddOrUpdateVariant}
                                    className="btn btn-primary"
                                >
                                    {editingVariantIndex !== null ? (
                                        <>
                                            <Pencil className="icon-sm" /> Update Variant
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="icon-sm" /> Add Variant
                                        </>
                                    )}
                                </button>
                                {editingVariantIndex !== null && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="btn btn-outline"
                                    >
                                        <X className="icon-sm" /> Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {variants.length > 0 && (
                        <div className="variants-list">
                            <h4>Added Variants ({variants.length})</h4>
                            <div className="variants-grid">
                                {variants.map((variant, index) => (
                                    <div key={index} className={`variant-card ${editingVariantIndex === index ? 'editing' : ''}`}>
                                        <div className="variant-info">
                                            <strong>{variant.variant_name}</strong>
                                            <span>Part: {variant.part_code}</span>
                                            <span>Category: {categories.find(c => c.id === parseInt(variant.category))?.category_name || variant.category || '-'}</span>
                                            {variant.spec_type && <span className="spec-badge">{variant.spec_type}</span>}
                                            {variant.color && <span>Color: {variant.color}</span>}
                                            {variant.brand && <span>Brand: {variant.brand}</span>}
                                            {variant.size && <span>Size: {variant.size}</span>}
                                            <span>Price: ₹{parseFloat(variant.price).toLocaleString('en-IN')}</span>
                                            <span>Stock: {variant.stock}</span>
                                            {variant.availability && <span className="availability-badge">{variant.availability}</span>}
                                            {variant.existingImages && variant.existingImages.length > 0 && (
                                                <div className="variant-images-preview">
                                                    <span className="image-count">Images: {variant.existingImages.length}</span>
                                                    <div className="mini-images">
                                                        {variant.existingImages.slice(0, 2).map((img, idx) => (
                                                            <img
                                                                key={idx}
                                                                src={getImageUrl(img)}
                                                                alt={`${variant.variant_name} ${idx + 1}`}
                                                                className="mini-image"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                                                                }}
                                                            />
                                                        ))}
                                                        {variant.existingImages.length > 2 && (
                                                            <span className="more-images">+{variant.existingImages.length - 2}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            {variant._isNew && (
                                                <span className="badge-new">New</span>
                                            )}
                                        </div>
                                        <div className="variant-actions-buttons">
                                            <button
                                                type="button"
                                                onClick={() => handleEditVariant(index)}
                                                className="btn btn-edit"
                                                title="Edit variant"
                                            >
                                                <Pencil className="icon-sm" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeVariant(index)}
                                                className="btn btn-danger"
                                                title="Remove variant"
                                            >
                                                <Trash2 className="icon-sm" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? (isEditMode ? 'Updating Product...' : 'Adding Product...') : (isEditMode ? 'Update Product' : 'Add Product')}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/products')}
                        className="btn btn-secondary"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export { ProductForm };