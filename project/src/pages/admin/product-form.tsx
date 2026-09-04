import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Pencil, Trash2, X, Plus, FileText, ExternalLink } from 'lucide-react';
import './product-form.css';
import { baseurl } from '@/Baseurl/baseurl';

const API_URL = baseurl;

// Type Definitions
interface Category {
    id: number;
    category_name: string;
    description?: string;
    category_image?: string;
    subcategories?: SubCategory[];
}

interface SubCategory {
    id: number;
    subcategory_name: string;
    created_at?: string;
}

interface Brand {
    id: number;
    brand_name: string;
    category_id: number;
    sub_category_id: number;
    category_name?: string;
    sub_category_name?: string;
}

interface Specification {
    id: string;
    spec_name: string;
    value: string;
}

interface ProductSpecifications {
    [key: string]: string;
}

interface FormData {
    product_name: string;
    product_code: string;
    product_description: string;
    extra_information: string;
    warranty: string;
    product_details_pdf: File | null;
    existing_pdf?: string;
    category_id: string;
    sub_category_id: string;
    product_brand: string;
    product_series: string;
    discount: string;
    specifications: ProductSpecifications;
}

interface Variant {
    id?: number;
    variant_name: string;
    part_code: string;
    description: string;
    spec_type: string;
    color: string;
    size: string;
    min_price: string;
    max_price: string;
    availability: string;
    datasheet_url: string;
    stock: string;
    images: File[];
    existingImages?: string[];
    pendingImagePreviews?: string[];
    _isNew?: boolean;
    category_name?: string;
    sub_category_name?: string;
    brand_name?: string;
}

// Field-level errors for the variant sub-form
interface VariantFieldErrors {
    variant_name?: string;
    part_code?: string;
    min_price?: string;
    max_price?: string;
}

const EMPTY_VARIANT: Variant = {
    variant_name: '',
    part_code: '',
    description: '',
    spec_type: '',
    color: '',
    size: '',
    min_price: '',
    max_price: '',
    availability: '',
    datasheet_url: '',
    stock: '100',
    images: [],
    existingImages: []
};

// Parses image_url which may be: null, a single legacy path string,
// or a JSON-encoded array of paths (new multi-image format).
const parseImageUrls = (raw?: string | null): string[] => {
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
        return [raw];
    } catch {
        return [raw];
    }
};

const ProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;

    const [formData, setFormData] = useState<FormData>({
        product_name: '',
        product_code: '',
        product_description: '',
        extra_information: '',
        warranty: '',
        product_details_pdf: null,
        existing_pdf: '',
        category_id: '',
        sub_category_id: '',
        product_brand: '',
        product_series: '',
        discount: '',
        specifications: {}
    });

    // Variants State
    const [variants, setVariants] = useState<Variant[]>([]);
    const [currentVariant, setCurrentVariant] = useState<Variant>({ ...EMPTY_VARIANT });
    const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(null);
    const [variantFieldErrors, setVariantFieldErrors] = useState<VariantFieldErrors>({});

    const [categories, setCategories] = useState<Category[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
    const [_specTypes, setSpecTypes] = useState<string[]>([]);
    const [selectedSpecifications, setSelectedSpecifications] = useState<Specification[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingSpecs, setLoadingSpecs] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [selectedFileNames, setSelectedFileNames] = useState<string>('');
    const [showVariantForm, setShowVariantForm] = useState<boolean>(false);
    const [hasSpecifications, setHasSpecifications] = useState<boolean>(false);

    // Local object-URL previews for images picked but not yet uploaded
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

    // "Add New Brand" modal state
    const [showBrandModal, setShowBrandModal] = useState<boolean>(false);
    const [newBrandName, setNewBrandName] = useState<string>('');
    const [brandSubmitting, setBrandSubmitting] = useState<boolean>(false);
    const [brandError, setBrandError] = useState<string>('');

    const isSubmittingRef = useRef<boolean>(false);
    const errorAlertRef = useRef<HTMLDivElement | null>(null);
    const variantsRef = useRef<Variant[]>(variants);
    
    useEffect(() => {
        variantsRef.current = variants;
    }, [variants]);

    // Fetch data on load
    useEffect(() => {
        fetchCategories();
        fetchBrands();
        if (isEditMode) {
            fetchProductData();
        }
    }, [id]);

    // Revoke object URLs on unmount to avoid memory leaks
    useEffect(() => {
        return () => {
            newImagePreviews.forEach(url => URL.revokeObjectURL(url));
            variantsRef.current.forEach(v => {
                (v.pendingImagePreviews || []).forEach(url => URL.revokeObjectURL(url));
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Refresh lookups when window gets focus
    useEffect(() => {
        const refreshLookups = () => {
            fetchCategories();
            fetchBrands();
        };
        window.addEventListener('focus', refreshLookups);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') refreshLookups();
        });
        return () => {
            window.removeEventListener('focus', refreshLookups);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update sub categories when category changes
    useEffect(() => {
        if (formData.category_id) {
            const selectedCategory = categories.find(c => c.id === parseInt(formData.category_id));
            if (selectedCategory && selectedCategory.subcategories) {
                setSubCategories(selectedCategory.subcategories);
            } else {
                setSubCategories([]);
            }
        } else {
            setSubCategories([]);
        }
    }, [formData.category_id, categories]);

    // Fetch specifications when sub_category changes
    useEffect(() => {
        if (formData.category_id && formData.sub_category_id) {
            fetchSpecificationsByCategoryAndSubCategory(formData.category_id, formData.sub_category_id);
        } else {
            setSelectedSpecifications([]);
            setSpecTypes([]);
            setLoadingSpecs(false);
            setHasSpecifications(false);
        }
    }, [formData.sub_category_id, formData.category_id]);

    // Filter brands when category/sub-category changes
    useEffect(() => {
        filterBrands();
    }, [formData.category_id, formData.sub_category_id, brands]);

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

    const fetchSpecificationsByCategoryAndSubCategory = async (categoryId: string, subCategoryId: string) => {
        try {
            if (!categoryId || !subCategoryId) {
                setSelectedSpecifications([]);
                setSpecTypes([]);
                setLoadingSpecs(false);
                setHasSpecifications(false);
                return;
            }

            setLoadingSpecs(true);
            const response = await axios.get(
                `${API_URL}/api/products/specifications/category/${categoryId}/subcategory/${subCategoryId}`
            );

            if (response.data.success && response.data.data && response.data.data.product_specifications) {
                const specs = response.data.data;
                const productSpecs = specs.product_specifications;

                if (productSpecs && productSpecs.length > 0) {
                    setSelectedSpecifications(productSpecs);
                    setHasSpecifications(true);

                    if (specs.spec_name) {
                        setSpecTypes([specs.spec_name]);
                    } else {
                        setSpecTypes([]);
                    }

                    if (!isEditMode || Object.keys(formData.specifications).length === 0) {
                        const defaultSpecs: ProductSpecifications = {};
                        productSpecs.forEach((spec: Specification) => {
                            defaultSpecs[spec.spec_name] = spec.value || '';
                        });
                        setFormData(prev => ({
                            ...prev,
                            specifications: defaultSpecs
                        }));
                    }
                } else {
                    setSelectedSpecifications([]);
                    setSpecTypes([]);
                    setHasSpecifications(false);
                }
            } else {
                setSelectedSpecifications([]);
                setSpecTypes([]);
                setHasSpecifications(false);
            }
        } catch (error) {
            console.error('Error fetching specifications:', error);
            setSelectedSpecifications([]);
            setSpecTypes([]);
            setHasSpecifications(false);
        } finally {
            setLoadingSpecs(false);
        }
    };

    const filterBrands = () => {
        let filtered = [...brands];
        if (formData.category_id) {
            filtered = filtered.filter(b => b.category_id === parseInt(formData.category_id));
        }
        if (formData.sub_category_id) {
            filtered = filtered.filter(b => b.sub_category_id === parseInt(formData.sub_category_id));
        }
        setFilteredBrands(filtered);
    };

    const fetchProductData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/products/products-with-variants/${id}`);
            const productData = response.data;

            const specs = productData.specifications || {};

            setFormData({
                product_name: productData.product_name || '',
                product_code: productData.product_code || '',
                product_description: productData.product_description || '',
                extra_information: productData.extra_information || '',
                warranty: productData.warranty || '',
                product_details_pdf: null,
                existing_pdf: productData.product_details_pdf || '',
                category_id: productData.category_id ? String(productData.category_id) : '',
                sub_category_id: productData.sub_category_id ? String(productData.sub_category_id) : '',
                product_brand: productData.product_brand || '',
                product_series: productData.product_series || '',
                discount: productData.discount || '',
                specifications: specs
            });

            if (productData.category_id && productData.sub_category_id) {
                await fetchSpecificationsByCategoryAndSubCategory(
                    String(productData.category_id),
                    String(productData.sub_category_id)
                );
            }

            if (productData.variants && Array.isArray(productData.variants)) {
                const formattedVariants = productData.variants.map((v: any) => ({
                    id: v.id,
                    variant_name: v.variant_name || '',
                    part_code: v.part_code || '',
                    description: v.description || '',
                    spec_type: v.spec_type || '',
                    color: v.color || '',
                    size: v.size || '',
                    min_price: String(v.min_price) || '',
                    max_price: String(v.max_price) || '',
                    availability: v.availability || '',
                    datasheet_url: v.datasheet_url || '',
                    stock: String(v.stock) || '100',
                    images: [],
                    existingImages: parseImageUrls(v.image_url),
                    _isNew: false,
                    category_name: productData.category_name,
                    sub_category_name: productData.subcategory_name,
                    brand_name: productData.product_brand
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

    // ============================================
    // SPECIFICATION HANDLERS
    // ============================================
    const handleSpecificationChange = (specName: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            specifications: {
                ...prev.specifications,
                [specName]: value
            }
        }));
    };

    // ============================================
    // GENERAL FORM HANDLERS
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

    // ============================================
    // CATEGORY / SUB CATEGORY "+" HANDLERS
    // ============================================
    const confirmLeaveIfDirty = (): boolean => {
        const hasUnsavedWork =
            formData.product_name.trim() !== '' ||
            formData.product_code.trim() !== '' ||
            variants.length > 0;
        if (!hasUnsavedWork) return true;
        return window.confirm(
            'Leaving this page will discard any unsaved product details. Continue to add a category?'
        );
    };

    const handleAddCategoryClick = (): void => {
        if (!confirmLeaveIfDirty()) return;
        navigate('/admin/categories/add');
    };

    const handleAddSubCategoryClick = (): void => {
        if (!formData.category_id) return;
        if (!confirmLeaveIfDirty()) return;
        navigate(`/admin/categories/edit/${formData.category_id}`);
    };

    // ============================================
    // BRAND HANDLERS
    // ============================================
    const openBrandModal = (): void => {
        setNewBrandName('');
        setBrandError('');
        setShowBrandModal(true);
    };

    const closeBrandModal = (): void => {
        setShowBrandModal(false);
        setNewBrandName('');
        setBrandError('');
    };

    const handleCreateBrand = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        if (!formData.category_id || !formData.sub_category_id) {
            setBrandError('Please select a category and sub category on the product form first.');
            return;
        }
        if (!newBrandName.trim()) {
            setBrandError('Brand name is required.');
            return;
        }

        setBrandSubmitting(true);
        setBrandError('');

        try {
            const response = await axios.post(`${API_URL}/api/brands`, {
                brand_name: newBrandName.trim(),
                category_id: parseInt(formData.category_id),
                sub_category_id: parseInt(formData.sub_category_id)
            });

            if (response.data.success) {
                await fetchBrands();
                setFormData(prev => ({ ...prev, product_brand: response.data.data.brand_name }));
                setSuccess('Brand created successfully');
                setTimeout(() => setSuccess(''), 3000);
                closeBrandModal();
            }
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                setBrandError(err.response?.data?.message || 'Failed to create brand');
            } else {
                setBrandError('Failed to create brand');
            }
        } finally {
            setBrandSubmitting(false);
        }
    };

    // ============================================
    // VARIANT HANDLERS
    // ============================================
    const handleVariantChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
        setCurrentVariant(prev => ({ ...prev, [name]: value }));
        if (variantFieldErrors[name as keyof VariantFieldErrors]) {
            setVariantFieldErrors(prev => {
                const updated = { ...prev };
                delete updated[name as keyof VariantFieldErrors];
                return updated;
            });
        }
    };

    // FIX #7: Build live previews for every selected file
    const handleVariantImages = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const files = Array.from(e.target.files || []);

        // Revoke previous preview URLs before creating new ones
        newImagePreviews.forEach(url => URL.revokeObjectURL(url));

        setCurrentVariant(prev => ({ ...prev, images: files }));

        if (files.length > 0) {
            setSelectedFileNames(files.map(f => f.name).join(', '));
            const previews = files.map(f => URL.createObjectURL(f));
            setNewImagePreviews(previews);
        } else {
            setSelectedFileNames('');
            setNewImagePreviews([]);
        }
    };

    const resetVariantForm = (): void => {
        newImagePreviews.forEach(url => URL.revokeObjectURL(url));
        setNewImagePreviews([]);
        setCurrentVariant({ ...EMPTY_VARIANT });
        setSelectedFileNames('');
        setVariantFieldErrors({});
    };

    const validateVariant = (): VariantFieldErrors => {
        const errors: VariantFieldErrors = {};

        if (!currentVariant.variant_name.trim()) {
            errors.variant_name = 'Variant name is required';
        }
        if (!currentVariant.part_code.trim()) {
            errors.part_code = 'Part code is required';
        }
        if (currentVariant.min_price === '' || currentVariant.min_price === null || currentVariant.min_price === undefined) {
            errors.min_price = 'Min price is required';
        }
        if (currentVariant.max_price === '' || currentVariant.max_price === null || currentVariant.max_price === undefined) {
            errors.max_price = 'Max price is required';
        }
        if (
            !errors.min_price &&
            !errors.max_price &&
            parseFloat(currentVariant.min_price) > parseFloat(currentVariant.max_price)
        ) {
            errors.max_price = 'Max price must be greater than or equal to min price';
        }

        return errors;
    };

    const handleAddOrUpdateVariant = (): void => {
        const errors = validateVariant();

        if (Object.keys(errors).length > 0) {
            setVariantFieldErrors(errors);
            setError('Please fix the highlighted field(s) below before adding this variant.');
            errorAlertRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        setVariantFieldErrors({});

        // Store the current preview URLs and images
        const stagedPreviews = [...newImagePreviews];
        const stagedImages = [...currentVariant.images];

        if (editingVariantIndex !== null) {
            const updatedVariants = [...variants];
            const previousPreviews = updatedVariants[editingVariantIndex].pendingImagePreviews || [];

            // Release previews that are no longer used
            previousPreviews.forEach(url => {
                if (!stagedPreviews.includes(url)) URL.revokeObjectURL(url);
            });

            updatedVariants[editingVariantIndex] = {
                ...currentVariant,
                images: stagedImages,
                pendingImagePreviews: stagedPreviews,
                id: variants[editingVariantIndex].id,
                _isNew: false
            };
            setVariants(updatedVariants);
            setEditingVariantIndex(null);
            setSuccess('Variant updated successfully');
        } else {
            setVariants(prev => [...prev, {
                ...currentVariant,
                images: stagedImages,
                pendingImagePreviews: stagedPreviews,
                _isNew: true,
                category_name: getCategoryNameById(formData.category_id),
                sub_category_name: getSubCategoryNameById(formData.sub_category_id),
                brand_name: formData.product_brand
            }]);
            setSuccess('Variant added successfully');
        }

        // Reset the sub-form but KEEP the preview URLs and images (they're now owned by the variant)
        setCurrentVariant({ ...EMPTY_VARIANT });
        setSelectedFileNames('');
        setVariantFieldErrors({});
        setNewImagePreviews([]);
        setError('');
        setShowVariantForm(false);
        setTimeout(() => setSuccess(''), 3000);
    };

    const handleEditVariant = (index: number): void => {
        const variant = variants[index];
        // Don't revoke previews - keep them
        // Instead, set the current variant with the stored previews
        setCurrentVariant({
            ...variant,
            images: variant.images || [],
        });
        setNewImagePreviews(variant.pendingImagePreviews || []);
        setEditingVariantIndex(index);
        setSelectedFileNames('');
        setVariantFieldErrors({});
        setShowVariantForm(true);
        document.querySelector('.variant-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const cancelEdit = (): void => {
        // Only revoke previews that aren't stored in any variant
        const original = editingVariantIndex !== null ? variants[editingVariantIndex] : null;
        const originalPreviews = original?.pendingImagePreviews || [];
        newImagePreviews.forEach(url => {
            if (!originalPreviews.includes(url)) URL.revokeObjectURL(url);
        });

        setEditingVariantIndex(null);
        setCurrentVariant({ ...EMPTY_VARIANT });
        setSelectedFileNames('');
        setVariantFieldErrors({});
        setNewImagePreviews([]);
        setError('');
        setShowVariantForm(false);
    };

    const removeVariant = (index: number): void => {
        const target = variants[index];
        (target.pendingImagePreviews || []).forEach(url => URL.revokeObjectURL(url));

        const newVariants = variants.filter((_, i) => i !== index);
        setVariants(newVariants);
        if (editingVariantIndex === index) {
            setEditingVariantIndex(null);
            resetVariantForm();
        }
    };

    // Helper functions to get category/subcategory names from the product data
    const getCategoryNameById = (categoryId: string): string => {
        if (!categoryId) return '-';
        const category = categories.find(c => c.id === parseInt(categoryId));
        return category ? category.category_name : categoryId;
    };

    const getSubCategoryNameById = (subCategoryId: string): string => {
        if (!subCategoryId) return '-';
        for (const category of categories) {
            if (category.subcategories) {
                const sub = category.subcategories.find(s => s.id === parseInt(subCategoryId));
                if (sub) return sub.subcategory_name;
            }
        }
        return subCategoryId;
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
                const productFormData = new FormData();

                const formFields = {
                    product_name: formData.product_name,
                    product_code: formData.product_code,
                    product_description: formData.product_description,
                    extra_information: formData.extra_information,
                    warranty: formData.warranty,
                    product_series: formData.product_series,
                    category_id: formData.category_id,
                    sub_category_id: formData.sub_category_id,
                    product_brand: formData.product_brand,
                    discount: formData.discount,
                    specifications: JSON.stringify(formData.specifications)
                };

                Object.entries(formFields).forEach(([key, value]) => {
                    if (value !== null && value !== "") {
                        productFormData.append(key, String(value));
                    }
                });

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

                const existingVariantsResponse = await axios.get(`${API_URL}/api/products/variants/${productId}`);
                const existingVariants = existingVariantsResponse.data;
                const existingIds = existingVariants.map((v: any) => v.id);
                const currentIds = variants.filter(v => v.id).map(v => v.id);

                for (const existingId of existingIds) {
                    if (!currentIds.includes(existingId)) {
                        await axios.delete(`${API_URL}/api/products/variants/${existingId}`);
                    }
                }

                for (const variant of variants) {
                    const variantData = new FormData();

                    variantData.append('product_id', String(productId));
                    variantData.append('variant_name', variant.variant_name || '');
                    variantData.append('part_code', variant.part_code || '');
                    variantData.append('description', variant.description || '');
                    variantData.append('spec_type', variant.spec_type || '');
                    variantData.append('color', variant.color || '');
                    variantData.append('size', variant.size || '');
                    variantData.append('min_price', variant.min_price || '0');
                    variantData.append('max_price', variant.max_price || '0');
                    variantData.append('availability', variant.availability || '');
                    variantData.append('datasheet_url', variant.datasheet_url || '');
                    variantData.append('stock', variant.stock || '100');
                    variantData.append('category_id', formData.category_id || '');
                    variantData.append('sub_category_id', formData.sub_category_id || '');
                    variantData.append('brand_name', formData.product_brand || '');

                    // Append every selected image
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
            } else {
                const productFormData = new FormData();

                const formFields = {
                    product_name: formData.product_name,
                    product_code: formData.product_code,
                    product_description: formData.product_description,
                    extra_information: formData.extra_information,
                    warranty: formData.warranty,
                    product_series: formData.product_series,
                    category_id: formData.category_id,
                    sub_category_id: formData.sub_category_id,
                    product_brand: formData.product_brand,
                    discount: formData.discount,
                    specifications: JSON.stringify(formData.specifications)
                };

                Object.entries(formFields).forEach(([key, value]) => {
                    if (value !== null && value !== "") {
                        productFormData.append(key, String(value));
                    }
                });

                if (formData.product_details_pdf) {
                    productFormData.append("product_details_pdf", formData.product_details_pdf);
                }

                const productResponse = await axios.post(
                    `${API_URL}/api/products`,
                    productFormData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                productId = productResponse.data.id;

                for (const variant of variants) {
                    const variantData = new FormData();

                    variantData.append('product_id', String(productId));
                    variantData.append('variant_name', variant.variant_name || '');
                    variantData.append('part_code', variant.part_code || '');
                    variantData.append('description', variant.description || '');
                    variantData.append('spec_type', variant.spec_type || '');
                    variantData.append('color', variant.color || '');
                    variantData.append('size', variant.size || '');
                    variantData.append('min_price', variant.min_price || '0');
                    variantData.append('max_price', variant.max_price || '0');
                    variantData.append('availability', variant.availability || '');
                    variantData.append('datasheet_url', variant.datasheet_url || '');
                    variantData.append('stock', variant.stock || '100');
                    variantData.append('category_id', formData.category_id || '');
                    variantData.append('sub_category_id', formData.sub_category_id || '');
                    variantData.append('brand_name', formData.product_brand || '');

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
            errorAlertRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

            {error && <div className="alert alert-error" ref={errorAlertRef}>{error}</div>}
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
                        </div>

                        <div className="form-group">
                            <label htmlFor="category_id">Category *</label>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                <select
                                    id="category_id"
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleInputChange}
                                    required
                                    style={{ flex: 1 }}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={String(category.id)}>
                                            {category.category_name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    onClick={handleAddCategoryClick}
                                    title="Add new category"
                                    style={{ flexShrink: 0, padding: '8px 10px' }}
                                >
                                    <Plus className="icon-sm" />
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="sub_category_id">Sub Category *</label>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                <select
                                    id="sub_category_id"
                                    name="sub_category_id"
                                    value={formData.sub_category_id}
                                    onChange={handleInputChange}
                                    required
                                    disabled={!formData.category_id}
                                    style={{ flex: 1 }}
                                >
                                    <option value="">Select Sub Category</option>
                                    {subCategories.map(sub => (
                                        <option key={sub.id} value={String(sub.id)}>
                                            {sub.subcategory_name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    onClick={handleAddSubCategoryClick}
                                    disabled={!formData.category_id}
                                    title="Add new sub category"
                                    style={{ flexShrink: 0, padding: '8px 10px' }}
                                >
                                    <Plus className="icon-sm" />
                                </button>
                            </div>
                            {!formData.category_id && (
                                <small className="text-muted">Please select a category first</small>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="product_brand">Brand *</label>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                <select
                                    id="product_brand"
                                    name="product_brand"
                                    value={formData.product_brand}
                                    onChange={handleInputChange}
                                    required
                                    disabled={!formData.category_id || !formData.sub_category_id}
                                    style={{ flex: 1 }}
                                >
                                    <option value="">Select Brand</option>
                                    {filteredBrands.map(brand => (
                                        <option key={brand.id} value={brand.brand_name}>
                                            {brand.brand_name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    onClick={openBrandModal}
                                    disabled={!formData.category_id || !formData.sub_category_id}
                                    title="Add new brand"
                                    style={{ flexShrink: 0, padding: '8px 10px' }}
                                >
                                    <Plus className="icon-sm" />
                                </button>
                            </div>
                            {(!formData.category_id || !formData.sub_category_id) && (
                                <small className="text-muted">Please select category and subcategory first</small>
                            )}
                            {filteredBrands.length === 0 && formData.category_id && formData.sub_category_id && (
                                <small className="text-muted">
                                    No brands available for this selection — click "+" to add one.
                                </small>
                            )}
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
                                placeholder="e.g., 10"
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

                        <div className="form-group full-width">
                            <label htmlFor="product_details_pdf">Data Sheet (PDF)</label>
                            <input
                                type="file"
                                id="product_details_pdf"
                                name="product_details_pdf"
                                onChange={handleFileChange}
                                accept=".pdf"
                            />
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

                        <div className="form-group full-width">
                            <label htmlFor="extra_information">Extra Information</label>
                            <textarea
                                id="extra_information"
                                name="extra_information"
                                value={formData.extra_information}
                                onChange={handleInputChange}
                                placeholder="Enter any additional information about the product..."
                                rows={4}
                                className="textarea-field"
                            />
                        </div>
                    </div>
                </div>

                {/* ============================================
                    PRODUCT SPECIFICATIONS SECTION - DYNAMIC
                    ============================================ */}
                <div className="form-section">
                    <h3>Product Specifications</h3>
                    <div className="form-grid">
                        {(!formData.category_id || !formData.sub_category_id) ? (
                            <div className="form-group full-width">
                                <p className="text-muted" style={{ margin: '10px 0', color: '#666' }}>
                                    Select a category and sub category to see available specifications.
                                </p>
                            </div>
                        ) : loadingSpecs ? (
                            <div className="form-group full-width">
                                <p className="text-muted" style={{ margin: '10px 0', color: '#666' }}>
                                    Loading specifications...
                                </p>
                            </div>
                        ) : hasSpecifications && selectedSpecifications.length > 0 ? (
                            selectedSpecifications.map((spec) => {
                                const specValue = formData.specifications[spec.spec_name];
                                return (
                                    <div className="form-group" key={spec.id}>
                                        <label htmlFor={`spec_${spec.id}`}>{spec.spec_name}</label>
                                        <input
                                            type="text"
                                            id={`spec_${spec.id}`}
                                            value={specValue !== undefined ? specValue : (spec.value || '')}
                                            onChange={(e) => handleSpecificationChange(spec.spec_name, e.target.value)}
                                            placeholder={`Enter ${spec.spec_name}`}
                                        />
                                    </div>
                                );
                            })
                        ) : (
                            <div className="form-group full-width">
                                <p className="text-muted" style={{ margin: '10px 0', color: '#666' }}>
                                    No specifications available for this selection
                                </p>
                            </div>
                        )}
                    </div>
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
                                        style={variantFieldErrors.variant_name ? { borderColor: '#dc2626' } : undefined}
                                    />
                                    {variantFieldErrors.variant_name && (
                                        <small style={{ color: '#dc2626', display: 'block', marginTop: '4px' }}>
                                            {variantFieldErrors.variant_name}
                                        </small>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Part Code *</label>
                                    <input
                                        type="text"
                                        name="part_code"
                                        value={currentVariant.part_code}
                                        onChange={handleVariantChange}
                                        placeholder="e.g., CPC3312-01M001"
                                        style={variantFieldErrors.part_code ? { borderColor: '#dc2626' } : undefined}
                                    />
                                    {variantFieldErrors.part_code && (
                                        <small style={{ color: '#dc2626', display: 'block', marginTop: '4px' }}>
                                            {variantFieldErrors.part_code}
                                        </small>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Color</label>
                                    <input
                                        type="text"
                                        name="color"
                                        value={currentVariant.color}
                                        onChange={handleVariantChange}
                                        placeholder="e.g., Black, Blue, White"
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
                                    <label>Min Price (INR) *</label>
                                    <input
                                        type="number"
                                        name="min_price"
                                        value={currentVariant.min_price}
                                        onChange={handleVariantChange}
                                        step="0.01"
                                        placeholder="0.00"
                                        style={variantFieldErrors.min_price ? { borderColor: '#dc2626' } : undefined}
                                    />
                                    {variantFieldErrors.min_price && (
                                        <small style={{ color: '#dc2626', display: 'block', marginTop: '4px' }}>
                                            {variantFieldErrors.min_price}
                                        </small>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label>Max Price (INR) *</label>
                                    <input
                                        type="number"
                                        name="max_price"
                                        value={currentVariant.max_price}
                                        onChange={handleVariantChange}
                                        step="0.01"
                                        placeholder="0.00"
                                        style={variantFieldErrors.max_price ? { borderColor: '#dc2626' } : undefined}
                                    />
                                    {variantFieldErrors.max_price && (
                                        <small style={{ color: '#dc2626', display: 'block', marginTop: '4px' }}>
                                            {variantFieldErrors.max_price}
                                        </small>
                                    )}
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

                                    {newImagePreviews.length > 0 && (
                                        <div className="current-images-container">
                                            <small className="file-existing">New images to upload:</small>
                                            <div className="current-images-grid">
                                                {newImagePreviews.map((url, idx) => (
                                                    <div key={idx} className="current-image-item">
                                                        <img
                                                            src={url}
                                                            alt={`New selection ${idx + 1}`}
                                                            className="current-image-thumb"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
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
                                            <span>Category: {variant.category_name || getCategoryNameById(formData.category_id)}</span>
                                            <span>Sub Category: {variant.sub_category_name || getSubCategoryNameById(formData.sub_category_id)}</span>
                                            <span>Brand: {variant.brand_name || formData.product_brand || '-'}</span>
                                            {variant.color && <span>Color: {variant.color}</span>}
                                            {variant.size && <span>Size: {variant.size}</span>}
                                            <span>Min Price: ₹{parseFloat(variant.min_price).toLocaleString('en-IN')}</span>
                                            <span>Max Price: ₹{parseFloat(variant.max_price).toLocaleString('en-IN')}</span>
                                            <span>Stock: {variant.stock}</span>
                                            {variant.availability && <span className="availability-badge">{variant.availability}</span>}
                                            {variant.pendingImagePreviews && variant.pendingImagePreviews.length > 0 ? (
                                                <div className="variant-images-preview">
                                                    <span className="image-count">
                                                        New images: {variant.pendingImagePreviews.length} (will replace current on save)
                                                    </span>
                                                    <div className="mini-images">
                                                        {variant.pendingImagePreviews.slice(0, 2).map((url, idx) => (
                                                            <img
                                                                key={idx}
                                                                src={url}
                                                                alt={`${variant.variant_name} new ${idx + 1}`}
                                                                className="mini-image"
                                                            />
                                                        ))}
                                                        {variant.pendingImagePreviews.length > 2 && (
                                                            <span className="more-images">+{variant.pendingImagePreviews.length - 2}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                variant.existingImages && variant.existingImages.length > 0 && (
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
                                                )
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

            {/* Add New Brand Modal */}
            {showBrandModal && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}
                    onClick={closeBrandModal}
                >
                    <div
                        style={{
                            background: '#fff',
                            borderRadius: '8px',
                            padding: '24px',
                            width: '90%',
                            maxWidth: '440px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h3 style={{ margin: 0 }}>Add New Brand</h3>
                                <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>
                                    Create a new brand for {getCategoryNameById(formData.category_id)} / {getSubCategoryNameById(formData.sub_category_id)}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeBrandModal}
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {brandError && (
                            <div className="alert alert-error" style={{ marginTop: '16px' }}>{brandError}</div>
                        )}

                        <form onSubmit={handleCreateBrand} style={{ marginTop: '20px' }}>
                            <div className="form-group">
                                <label>Category</label>
                                <input
                                    type="text"
                                    value={getCategoryNameById(formData.category_id)}
                                    disabled
                                />
                            </div>
                            <div className="form-group" style={{ marginTop: '12px' }}>
                                <label>Sub Category</label>
                                <input
                                    type="text"
                                    value={getSubCategoryNameById(formData.sub_category_id)}
                                    disabled
                                />
                            </div>
                            <div className="form-group" style={{ marginTop: '12px' }}>
                                <label>Brand Name *</label>
                                <input
                                    type="text"
                                    value={newBrandName}
                                    onChange={(e) => setNewBrandName(e.target.value)}
                                    placeholder="e.g., Hikvision"
                                    autoFocus
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    style={{ flex: 1 }}
                                    onClick={closeBrandModal}
                                    disabled={brandSubmitting}
                                >
                                    <X className="icon-sm" /> Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ flex: 1 }}
                                    disabled={brandSubmitting}
                                >
                                    {brandSubmitting ? 'Creating...' : 'Create Brand'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export { ProductForm };