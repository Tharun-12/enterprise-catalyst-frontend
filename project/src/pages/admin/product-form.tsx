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
    name: string;
}

interface FormData {
    product_name: string;
    product_code: string;
    product_category_id: string | number;
    product_brand: string;
    price: string;
    dimensions: string;
    specifications: string;
    weight: string;
    discount: string;
    product_description: string;
    warranty: string;
    product_details_pdf: File | null;
    existing_pdf?: string;
    bandwidth: string;
    max_data_rate: string;
    internal_design: string;
    typical_applications: string;
    conductor_type: string;
    cable_od: string;
    jacket_material: string;
    operating_temperature: string;
    poe_support: string;
    product_series: string;
    rack_type: string;
    static_load: string;
    mounting_type: string;
    rack_standard: string;
    construction_type: string;
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
    spec_type: 'CAT6' | 'CAT6A';
    bandwidth: string;
    max_data_rate: string;
    internal_design: string;
    typical_applications: string;
}

interface BrandComparison {
    id?: number;
    brand: string;
    product_series: string;
    conductor_type: string;
    cable_od: string;
    jacket_material: string;
    bandwidth: string;
    operating_temperature: string;
    poe_support: string;
}

const ProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;

    const [formData, setFormData] = useState<FormData>({
        product_name: '',
        product_code: '',
        product_category_id: '',
        product_brand: '',
        price: '',
        dimensions: '',
        specifications: '',
        weight: '',
        discount: '0',
        product_description: '',
        warranty: '',
        product_details_pdf: null,
        existing_pdf: '',
        bandwidth: '',
        max_data_rate: '',
        internal_design: '',
        typical_applications: '',
        conductor_type: '',
        cable_od: '',
        jacket_material: '',
        operating_temperature: '',
        poe_support: '',
        product_series: '',
        rack_type: '',
        static_load: '',
        mounting_type: '',
        rack_standard: '',
        construction_type: ''
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
        spec_type: 'CAT6',
        bandwidth: '',
        max_data_rate: '',
        internal_design: '',
        typical_applications: ''
    });

    // Brand Comparison State
    const [brandComparisons, setBrandComparisons] = useState<BrandComparison[]>([]);
    const [currentBrandComparison, setCurrentBrandComparison] = useState<BrandComparison>({
        brand: '',
        product_series: '',
        conductor_type: '',
        cable_od: '',
        jacket_material: '',
        bandwidth: '',
        operating_temperature: '',
        poe_support: ''
    });
    const [editingBrandIndex, setEditingBrandIndex] = useState<number | null>(null);

    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [selectedFileNames, setSelectedFileNames] = useState<string>('');
    const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
    const [showSpecComparison, setShowSpecComparison] = useState<boolean>(false);
    const [showBrandComparison, setShowBrandComparison] = useState<boolean>(false);

    const isSubmittingRef = useRef<boolean>(false);

    // Fetch data on load
    useEffect(() => {
        fetchCategories();
        fetchBrands();
        if (isEditMode) {
            fetchProductData();
            fetchSpecComparisons();
            fetchBrandComparisons();
        }
    }, [id]);

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

    const fetchProductData = async () => {
        try {
            setLoading(true);
            const productResponse = await axios.get(`${API_URL}/api/products/products-with-variants/${id}`);
            const productData = productResponse.data;

            setFormData({
                product_name: productData.product_name || '',
                product_code: productData.product_code || '',
                product_category_id: productData.product_category_id || '',
                product_brand: productData.product_brand || '',
                price: productData.price || '',
                dimensions: productData.dimensions || '',
                specifications: productData.specifications || '',
                weight: productData.weight || '',
                discount: productData.discount || '0',
                product_description: productData.product_description || '',
                warranty: productData.warranty || '',
                product_details_pdf: null,
                existing_pdf: productData.product_details_pdf || '',
                bandwidth: productData.bandwidth || '',
                max_data_rate: productData.max_data_rate || '',
                internal_design: productData.internal_design || '',
                typical_applications: productData.typical_applications || '',
                conductor_type: productData.conductor_type || '',
                cable_od: productData.cable_od || '',
                jacket_material: productData.jacket_material || '',
                operating_temperature: productData.operating_temperature || '',
                poe_support: productData.poe_support || '',
                product_series: productData.product_series || '',
                rack_type: productData.rack_type || '',
                static_load: productData.static_load || '',
                mounting_type: productData.mounting_type || '',
                rack_standard: productData.rack_standard || '',
                construction_type: productData.construction_type || ''
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

    const fetchBrandComparisons = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/products/brand-comparisons/${id}`);
            setBrandComparisons(response.data);
        } catch (error) {
            console.error('Error fetching brand comparisons:', error);
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
            setError('Please select CAT6 or CAT6A');
            return;
        }

        const exists = specComparisons.some(s => s.spec_type === currentSpecComparison.spec_type);
        if (exists) {
            setError(`Spec comparison for ${currentSpecComparison.spec_type} already exists. Please edit it instead.`);
            return;
        }

        setSpecComparisons(prev => [...prev, { ...currentSpecComparison }]);
        setCurrentSpecComparison({
            spec_type: 'CAT6',
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
    // BRAND COMPARISON HANDLERS
    // ============================================
    const handleBrandComparisonChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCurrentBrandComparison(prev => ({ ...prev, [name]: value }));
    };

    const handleAddBrandComparison = () => {
        if (!currentBrandComparison.brand) {
            setError('Please select a brand');
            return;
        }

        if (editingBrandIndex !== null) {
            const updated = [...brandComparisons];
            updated[editingBrandIndex] = { ...currentBrandComparison, id: brandComparisons[editingBrandIndex].id };
            setBrandComparisons(updated);
            setEditingBrandIndex(null);
            setSuccess('Brand comparison updated');
        } else {
            setBrandComparisons(prev => [...prev, { ...currentBrandComparison }]);
            setSuccess('Brand comparison added');
        }

        setCurrentBrandComparison({
            brand: '',
            product_series: '',
            conductor_type: '',
            cable_od: '',
            jacket_material: '',
            bandwidth: '',
            operating_temperature: '',
            poe_support: ''
        });
        setTimeout(() => setSuccess(''), 3000);
    };

    const handleEditBrandComparison = (index: number) => {
        setCurrentBrandComparison({ ...brandComparisons[index] });
        setEditingBrandIndex(index);
    };

    const handleRemoveBrandComparison = (index: number) => {
        const item = brandComparisons[index];
        if (item.id) {
            axios.delete(`${API_URL}/api/products/brand-comparisons/${item.id}`)
                .then(() => {
                    const updated = brandComparisons.filter((_, i) => i !== index);
                    setBrandComparisons(updated);
                    setSuccess('Brand comparison removed');
                    setTimeout(() => setSuccess(''), 3000);
                })
                .catch(err => console.error('Error deleting brand comparison:', err));
        } else {
            const updated = brandComparisons.filter((_, i) => i !== index);
            setBrandComparisons(updated);
        }
    };

    const cancelBrandEdit = () => {
        setEditingBrandIndex(null);
        setCurrentBrandComparison({
            brand: '',
            product_series: '',
            conductor_type: '',
            cable_od: '',
            jacket_material: '',
            bandwidth: '',
            operating_temperature: '',
            poe_support: ''
        });
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
        setFormData(prev => ({ ...prev, product_details_pdf: file }));
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
    // SUBMIT HANDLER
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

            if (isEditMode) {
                // Update product
                const productFormData = new FormData();
                Object.entries(formData).forEach(([key, value]) => {
                    if (value !== null && value !== "" && key !== 'existing_pdf') {
                        productFormData.append(key, value as any);
                    }
                });
                if (formData.existing_pdf) productFormData.append("existing_pdf", formData.existing_pdf);
                if (formData.product_details_pdf) {
                    productFormData.append("product_details_pdf", formData.product_details_pdf);
                }

                await axios.put(
                    `${API_URL}/api/products/${id}`,
                    productFormData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                productId = parseInt(id!);
                setSuccess("Product updated successfully.");

                // Handle variants
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
                    Object.entries(variant).forEach(([key, value]) => {
                        if (key !== 'id' && key !== 'images' && key !== 'existingImages' && key !== '_isNew' && value !== null && value !== '') {
                            variantData.append(key, String(value));
                        }
                    });

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
                        variantData.append('product_id', String(productId));
                        await axios.post(
                            `${API_URL}/api/products/variants`,
                            variantData,
                            { headers: { "Content-Type": "multipart/form-data" } }
                        );
                    }
                }

                // Save spec comparisons
                for (const spec of specComparisons) {
                    await axios.post(`${API_URL}/api/products/spec-comparison`, {
                        product_id: productId,
                        ...spec
                    });
                }

                // Save brand comparisons
                for (const brand of brandComparisons) {
                    await axios.post(`${API_URL}/api/products/brand-comparisons`, {
                        product_id: productId,
                        ...brand
                    });
                }

            } else {
                // Create new product
                const productFormData = new FormData();
                Object.entries(formData).forEach(([key, value]) => {
                    if (value !== null && value !== "" && key !== 'existing_pdf') {
                        productFormData.append(key, value as any);
                    }
                });

                const productResponse = await axios.post(
                    `${API_URL}/api/products`,
                    productFormData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                productId = productResponse.data.id;

                // Create variants
                for (const variant of variants) {
                    const variantData = new FormData();
                    variantData.append('product_id', String(productId));
                    Object.entries(variant).forEach(([key, value]) => {
                        if (key !== 'id' && key !== 'images' && key !== 'existingImages' && key !== '_isNew' && value !== null && value !== '') {
                            variantData.append(key, String(value));
                        }
                    });

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
                        ...spec
                    });
                }

                // Save brand comparisons
                for (const brand of brandComparisons) {
                    await axios.post(`${API_URL}/api/products/brand-comparisons`, {
                        product_id: productId,
                        ...brand
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
                                placeholder="Enter product code"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="product_category_id">Category *</label>
                            <select
                                id="product_category_id"
                                name="product_category_id"
                                value={String(formData.product_category_id)}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.category_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="product_brand">Brand</label>
                            <select
                                id="product_brand"
                                name="product_brand"
                                value={formData.product_brand}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Brand</option>
                                {brands.map(brand => (
                                    <option key={brand.id} value={brand.name}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="product_series">Product Series</label>
                            <input
                                type="text"
                                id="product_series"
                                name="product_series"
                                value={formData.product_series}
                                onChange={handleInputChange}
                                placeholder="e.g., GigaSPEED X10D, TX6A-28"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="price">Price *</label>
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

                        <div className="form-group">
                            <label htmlFor="weight">Weight (kg)</label>
                            <input
                                type="number"
                                id="weight"
                                name="weight"
                                value={formData.weight}
                                onChange={handleInputChange}
                                step="0.01"
                                placeholder="0.00"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="dimensions">Dimensions</label>
                            <input
                                type="text"
                                id="dimensions"
                                name="dimensions"
                                value={formData.dimensions}
                                onChange={handleInputChange}
                                placeholder="e.g., 10x20x30 cm"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="product_description">Product Description</label>
                            <textarea
                                id="product_description"
                                name="product_description"
                                value={formData.product_description}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="Enter product description"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="specifications">Specifications</label>
                            <textarea
                                id="specifications"
                                name="specifications"
                                value={formData.specifications}
                                onChange={handleInputChange}
                                rows={4}
                                placeholder="Enter product specifications"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="warranty">Warranty</label>
                            <input
                                type="text"
                                id="warranty"
                                name="warranty"
                                value={formData.warranty}
                                onChange={handleInputChange}
                                placeholder="e.g., 2 Years"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="product_details_pdf">Product PDF</label>
                            <input
                                type="file"
                                id="product_details_pdf"
                                name="product_details_pdf"
                                onChange={handleFileChange}
                                accept=".pdf"
                            />
                            <small className="file-hint">Upload product details PDF (max 5MB)</small>
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
                    ADVANCED SPECIFICATIONS SECTION
                    ============================================ */}
                <div className="form-section">
                    <button
                        type="button"
                        className="section-toggle"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                    >
                        <span>Advanced Specifications</span>
                        {showAdvanced ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>

                    {showAdvanced && (
                        <div className="form-grid advanced-grid">
                            <div className="form-group">
                                <label htmlFor="bandwidth">Bandwidth</label>
                                <input
                                    type="text"
                                    id="bandwidth"
                                    name="bandwidth"
                                    value={formData.bandwidth}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 500 MHz"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="max_data_rate">Max Data Rate</label>
                                <input
                                    type="text"
                                    id="max_data_rate"
                                    name="max_data_rate"
                                    value={formData.max_data_rate}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 10 Gbps (100 m)"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="conductor_type">Conductor Type</label>
                                <input
                                    type="text"
                                    id="conductor_type"
                                    name="conductor_type"
                                    value={formData.conductor_type}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 24 AWG Solid"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="cable_od">Cable OD</label>
                                <input
                                    type="text"
                                    id="cable_od"
                                    name="cable_od"
                                    value={formData.cable_od}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 7.24 mm"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="jacket_material">Jacket Material</label>
                                <input
                                    type="text"
                                    id="jacket_material"
                                    name="jacket_material"
                                    value={formData.jacket_material}
                                    onChange={handleInputChange}
                                    placeholder="e.g., PVC, LSZH"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="operating_temperature">Operating Temperature</label>
                                <input
                                    type="text"
                                    id="operating_temperature"
                                    name="operating_temperature"
                                    value={formData.operating_temperature}
                                    onChange={handleInputChange}
                                    placeholder="e.g., -10°C to +60°C"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="poe_support">PoE Support</label>
                                <input
                                    type="text"
                                    id="poe_support"
                                    name="poe_support"
                                    value={formData.poe_support}
                                    onChange={handleInputChange}
                                    placeholder="e.g., IEEE 802.3bt Type 4 (90W)"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="rack_type">Rack Type</label>
                                <select
                                    id="rack_type"
                                    name="rack_type"
                                    value={formData.rack_type}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Rack Type</option>
                                    <option value="floor_mount">Floor Mount</option>
                                    <option value="wall_mount">Wall Mount</option>
                                    <option value="open_rack">Open Rack</option>
                                    <option value="closed_rack">Closed Rack</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="static_load">Static Load</label>
                                <input
                                    type="text"
                                    id="static_load"
                                    name="static_load"
                                    value={formData.static_load}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 1500 Kg"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="mounting_type">Mounting Type</label>
                                <input
                                    type="text"
                                    id="mounting_type"
                                    name="mounting_type"
                                    value={formData.mounting_type}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Grouting, Wall Mount"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="rack_standard">Rack Standard</label>
                                <input
                                    type="text"
                                    id="rack_standard"
                                    name="rack_standard"
                                    value={formData.rack_standard}
                                    onChange={handleInputChange}
                                    placeholder="e.g., EIA/DIN 41494"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="construction_type">Construction Type</label>
                                <input
                                    type="text"
                                    id="construction_type"
                                    name="construction_type"
                                    value={formData.construction_type}
                                    onChange={handleInputChange}
                                    placeholder="e.g., CRCA Steel, Aluminium"
                                />
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="internal_design">Internal Design</label>
                                <textarea
                                    id="internal_design"
                                    name="internal_design"
                                    value={formData.internal_design}
                                    onChange={handleInputChange}
                                    rows={2}
                                    placeholder="e.g., Standard pair separation, Improved pair separation"
                                />
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="typical_applications">Typical Applications</label>
                                <textarea
                                    id="typical_applications"
                                    name="typical_applications"
                                    value={formData.typical_applications}
                                    onChange={handleInputChange}
                                    rows={2}
                                    placeholder="e.g., Data Centers, High-Speed Networks"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* ============================================
                    SPEC COMPARISON SECTION (CAT6 vs CAT6A)
                    ============================================ */}
                <div className="form-section">
                    <button
                        type="button"
                        className="section-toggle"
                        onClick={() => setShowSpecComparison(!showSpecComparison)}
                    >
                        <span>📊 CAT6 vs CAT6A Comparison</span>
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
                                            <option value="CAT6">CAT6</option>
                                            <option value="CAT6A">CAT6A</option>
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
                                                <tr key={index} className={spec.spec_type === 'CAT6' ? 'cat6-row' : 'cat6a-row'}>
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
                    BRAND COMPARISON SECTION
                    ============================================ */}
                <div className="form-section">
                    <button
                        type="button"
                        className="section-toggle"
                        onClick={() => setShowBrandComparison(!showBrandComparison)}
                    >
                        <span>🏷️ Add to Compare - Brand Specifications</span>
                        {showBrandComparison ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>

                    {showBrandComparison && (
                        <div className="comparison-container">
                            <div className="comparison-form">
                                <h4>{editingBrandIndex !== null ? 'Edit' : 'Add'} Brand Comparison</h4>
                                <div className="form-grid comparison-grid">
                                    <div className="form-group">
                                        <label>Brand *</label>
                                        <select
                                            name="brand"
                                            value={currentBrandComparison.brand}
                                            onChange={handleBrandComparisonChange}
                                        >
                                            <option value="">Select Brand</option>
                                            {brands.map(brand => (
                                                <option key={brand.id} value={brand.name}>
                                                    {brand.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Product Series</label>
                                        <input
                                            type="text"
                                            name="product_series"
                                            value={currentBrandComparison.product_series}
                                            onChange={handleBrandComparisonChange}
                                            placeholder="e.g., GigaSPEED X10D"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Conductor Type</label>
                                        <input
                                            type="text"
                                            name="conductor_type"
                                            value={currentBrandComparison.conductor_type}
                                            onChange={handleBrandComparisonChange}
                                            placeholder="e.g., 24 AWG Solid"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Cable OD</label>
                                        <input
                                            type="text"
                                            name="cable_od"
                                            value={currentBrandComparison.cable_od}
                                            onChange={handleBrandComparisonChange}
                                            placeholder="e.g., 7.24 mm"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Jacket Material</label>
                                        <input
                                            type="text"
                                            name="jacket_material"
                                            value={currentBrandComparison.jacket_material}
                                            onChange={handleBrandComparisonChange}
                                            placeholder="e.g., PVC, LSZH"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Bandwidth</label>
                                        <input
                                            type="text"
                                            name="bandwidth"
                                            value={currentBrandComparison.bandwidth}
                                            onChange={handleBrandComparisonChange}
                                            placeholder="e.g., 500 MHz"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Operating Temperature</label>
                                        <input
                                            type="text"
                                            name="operating_temperature"
                                            value={currentBrandComparison.operating_temperature}
                                            onChange={handleBrandComparisonChange}
                                            placeholder="e.g., -10°C to +60°C"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>PoE Support</label>
                                        <input
                                            type="text"
                                            name="poe_support"
                                            value={currentBrandComparison.poe_support}
                                            onChange={handleBrandComparisonChange}
                                            placeholder="e.g., IEEE 802.3bt Type 4"
                                        />
                                    </div>
                                </div>

                                <div className="comparison-actions">
                                    <button
                                        type="button"
                                        onClick={handleAddBrandComparison}
                                        className="btn btn-secondary"
                                    >
                                        {editingBrandIndex !== null ? (
                                            <>
                                                <Pencil className="icon-sm" /> Update Brand
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="icon-sm" /> Add Brand Comparison
                                            </>
                                        )}
                                    </button>
                                    {editingBrandIndex !== null && (
                                        <button
                                            type="button"
                                            onClick={cancelBrandEdit}
                                            className="btn btn-outline"
                                        >
                                            <X className="icon-sm" /> Cancel
                                        </button>
                                    )}
                                </div>
                            </div>

                            {brandComparisons.length > 0 && (
                                <div className="comparison-list">
                                    <h4>Brand Comparisons ({brandComparisons.length})</h4>
                                    <div className="brand-comparison-grid">
                                        {brandComparisons.map((brand, index) => (
                                            <div key={index} className="brand-comparison-card">
                                                <div className="brand-header">
                                                    <strong>{brand.brand}</strong>
                                                    <div className="brand-actions">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEditBrandComparison(index)}
                                                            className="btn btn-edit btn-sm"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={14} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveBrandComparison(index)}
                                                            className="btn btn-danger btn-sm"
                                                            title="Remove"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="brand-details">
                                                    <span><strong>Series:</strong> {brand.product_series || '-'}</span>
                                                    <span><strong>Conductor:</strong> {brand.conductor_type || '-'}</span>
                                                    <span><strong>Cable OD:</strong> {brand.cable_od || '-'}</span>
                                                    <span><strong>Jacket:</strong> {brand.jacket_material || '-'}</span>
                                                    <span><strong>Bandwidth:</strong> {brand.bandwidth || '-'}</span>
                                                    <span><strong>Temp:</strong> {brand.operating_temperature || '-'}</span>
                                                    <span><strong>PoE:</strong> {brand.poe_support || '-'}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ============================================
                    VARIANTS SECTION
                    ============================================ */}
                <div className="form-section">
                    <h3>Product Variants</h3>

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
                                <label>Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={currentVariant.category}
                                    onChange={handleVariantChange}
                                    placeholder="e.g., Data Cabeling"
                                />
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
                                    {brands.map(brand => (
                                        <option key={brand.id} value={brand.name}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Spec Type</label>
                                <select
                                    name="spec_type"
                                    value={currentVariant.spec_type}
                                    onChange={handleVariantChange}
                                >
                                    <option value="">Select Spec Type</option>
                                    <option value="CAT6">CAT6</option>
                                    <option value="CAT6A">CAT6A</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Color</label>
                                <input
                                    type="text"
                                    name="color"
                                    value={currentVariant.color}
                                    onChange={handleVariantChange}
                                    placeholder="e.g., Black, Red, Blue"
                                />
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
                                <label>Price *</label>
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
                                className="btn btn-secondary"
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

                    {variants.length > 0 && (
                        <div className="variants-list">
                            <h4>Added Variants ({variants.length})</h4>
                            <div className="variants-grid">
                                {variants.map((variant, index) => (
                                    <div key={index} className={`variant-card ${editingVariantIndex === index ? 'editing' : ''}`}>
                                        <div className="variant-info">
                                            <strong>{variant.variant_name}</strong>
                                            <span>Part: {variant.part_code}</span>
                                            {variant.brand && <span>Brand: {variant.brand}</span>}
                                            {variant.spec_type && <span className="spec-badge">{variant.spec_type}</span>}
                                            {variant.size && <span>Size: {variant.size}</span>}
                                            {variant.color && <span>Color: {variant.color}</span>}
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