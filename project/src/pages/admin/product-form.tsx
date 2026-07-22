import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Pencil, Trash2, X, Plus, FileText, ExternalLink } from 'lucide-react';
import './product-form.css';

const API_URL = 'http://localhost:5000';

// Type definitions
interface Category {
  id: number;
  category_name: string;
  created_at?: string;
  updated_at?: string;
}

interface Brand {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
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
}

interface Variant {
  id?: number;
  color_name: string;
  color_hex: string;
  price: string;
  stock: string;
  images: File[];
  existingImages?: string[];
  _isNew?: boolean; // Flag to track if this is a new variant
}

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  // State for form data
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
  });

  // State for variants
  const [variants, setVariants] = useState<Variant[]>([]);
  const [currentVariant, setCurrentVariant] = useState<Variant>({
    color_name: '',
    color_hex: '#000000',
    price: '',
    stock: '100',
    images: [],
    existingImages: [],
  });
  const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(null);

  // State for dropdown data
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // State to track if images are selected
  const [selectedFileNames, setSelectedFileNames] = useState<string>('');

  // Guard against double-submits
  const isSubmittingRef = useRef<boolean>(false);

  // Fetch categories and brands on component mount
  useEffect(() => {
    fetchCategories();
    fetchBrands();
    if (isEditMode) {
      fetchProductData();
    }
  }, [id]);

  // Fetch product data for edit mode
  const fetchProductData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch product details
      const productResponse = await axios.get(`${API_URL}/api/products/${id}`);
      const productData = productResponse.data;

      console.log('Product data:', productData);

      // Populate form data
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
      });

      // Fetch variants
      try {
        const variantsResponse = await axios.get(`${API_URL}/api/products/variants/${id}`);
        const variantsData = variantsResponse.data;

        console.log('Variants data:', variantsData);

        if (Array.isArray(variantsData) && variantsData.length > 0) {
          const formattedVariants = variantsData.map((v: any) => ({
            id: v.id,
            color_name: v.color_name || '',
            color_hex: v.color_hex || '#000000',
            price: String(v.price) || '',
            stock: String(v.stock) || '100',
            images: [],
            existingImages: v.image_url ? [v.image_url] : [],
            _isNew: false,
          }));
          setVariants(formattedVariants);
        }
      } catch (variantError) {
        console.error('Error fetching variants:', variantError);
      }

    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async (): Promise<void> => {
    try {
      console.log('Fetching categories...');
      const response = await axios.get(`${API_URL}/api/categories/`);
      if (response.data.success) {
        console.log('Categories loaded:', response.data.data.length);
        setCategories(response.data.data);
      } else {
        console.warn('Categories fetch returned success:false', response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch brands
  const fetchBrands = async (): Promise<void> => {
    try {
      console.log('Fetching brands...');
      const response = await axios.get(`${API_URL}/api/brands/`);
      if (response.data.success) {
        console.log('Brands loaded:', response.data.data.length);
        setBrands(response.data.data);
      } else {
        console.warn('Brands fetch returned success:false', response.data);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] || null;
    console.log('Product PDF selected:', file ? file.name : 'none');
    setFormData((prev) => ({
      ...prev,
      product_details_pdf: file,
    }));
  };

  // Handle variant input changes
  const handleVariantChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setCurrentVariant((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle variant image upload
  const handleVariantImages = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files || []);
    console.log('Variant images selected:', files.map((f) => f.name));
    setCurrentVariant((prev) => ({
      ...prev,
      images: files,
    }));

    if (files.length > 0) {
      setSelectedFileNames(files.map((f) => f.name).join(', '));
    } else {
      setSelectedFileNames('');
    }
  };

  // Add or update variant
  const handleAddOrUpdateVariant = (): void => {
    console.log('handleAddOrUpdateVariant called with:', currentVariant);

    if (!currentVariant.color_name || !currentVariant.price) {
      setError('Please fill in color name and price for the variant');
      return;
    }

    if (isNaN(parseFloat(currentVariant.price))) {
      setError('Variant price must be a valid number');
      return;
    }

    if (editingVariantIndex !== null) {
      // Update existing variant - keep the ID
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
      // Add new variant
      setVariants((prev) => [...prev, { ...currentVariant, _isNew: true }]);
      setSuccess('Variant added successfully');
    }

    // Reset current variant form
    setCurrentVariant({
      color_name: '',
      color_hex: '#000000',
      price: '',
      stock: '100',
      images: [],
      existingImages: [],
    });
    setSelectedFileNames('');
    setError('');
  };

  // Edit variant - populate form with variant data
  const handleEditVariant = (index: number): void => {
    const variant = variants[index];
    setCurrentVariant({
      ...variant,
      images: [],
    });
    setEditingVariantIndex(index);
    setSelectedFileNames('');
    // Scroll to variant form
    document.querySelector('.variant-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Cancel editing
  const cancelEdit = (): void => {
    setEditingVariantIndex(null);
    setCurrentVariant({
      color_name: '',
      color_hex: '#000000',
      price: '',
      stock: '100',
      images: [],
      existingImages: [],
    });
    setSelectedFileNames('');
    setError('');
  };

  // Remove variant from list
  const removeVariant = (index: number): void => {
    console.log('Removing variant at index', index);
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
    if (editingVariantIndex === index) {
      setEditingVariantIndex(null);
      setCurrentVariant({
        color_name: '',
        color_hex: '#000000',
        price: '',
        stock: '100',
        images: [],
        existingImages: [],
      });
    }
  };

  // Get image URL for display
  const getImageUrl = (imagePath: string): string => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${API_URL}${cleanPath}`;
  };

  // Get PDF URL
  const getPdfUrl = (pdfPath: string): string => {
    if (!pdfPath) return '';
    if (pdfPath.startsWith('http')) return pdfPath;
    return `${API_URL}/uploads/pdfs/${pdfPath}`;
  };

  // Submit a single variant with POST
  const submitVariant = async (productId: number, variant: Variant) => {
    const fd = new FormData();

    fd.append("product_id", String(productId));
    fd.append("color_name", variant.color_name);
    fd.append("color_hex", variant.color_hex);
    fd.append("price", variant.price);
    fd.append("stock", variant.stock);

    if (variant.images && variant.images.length > 0) {
      variant.images.forEach((img) => {
        fd.append("images", img);
      });
    }

    const response = await axios.post(`${API_URL}/api/products/variants`, fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response;
  };

  // Update existing variant with PUT
  const updateVariant = async (variantId: number, variant: Variant, keepImage: boolean = true) => {
    const fd = new FormData();

    fd.append("color_name", variant.color_name);
    fd.append("color_hex", variant.color_hex);
    fd.append("price", variant.price);
    fd.append("stock", variant.stock);
    fd.append("keep_image", String(keepImage));

    if (variant.images && variant.images.length > 0) {
      variant.images.forEach((img) => {
        fd.append("images", img);
      });
    }

    const response = await axios.put(`${API_URL}/api/products/variants/${variantId}`, fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response;
  };

  // Delete variant
  const deleteVariant = async (variantId: number) => {
    return axios.delete(`${API_URL}/api/products/variants/${variantId}`);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("========== PRODUCT SUBMIT ==========");
      console.log("Mode:", isEditMode ? "Edit" : "Create");
      console.log("Variants:", variants);

      let productId: number;

      if (isEditMode) {
        // Update Product
        const productFormData = new FormData();

        if (formData.product_name) productFormData.append("product_name", formData.product_name);
        if (formData.product_code) productFormData.append("product_code", formData.product_code);
        if (formData.product_category_id) productFormData.append("product_category_id", String(formData.product_category_id));
        if (formData.product_brand) productFormData.append("product_brand", formData.product_brand);
        if (formData.price) productFormData.append("price", formData.price);
        if (formData.dimensions) productFormData.append("dimensions", formData.dimensions);
        if (formData.specifications) productFormData.append("specifications", formData.specifications);
        if (formData.weight) productFormData.append("weight", formData.weight);
        if (formData.discount) productFormData.append("discount", formData.discount);
        if (formData.product_description) productFormData.append("product_description", formData.product_description);
        if (formData.warranty) productFormData.append("warranty", formData.warranty);
        if (formData.existing_pdf) productFormData.append("existing_pdf", formData.existing_pdf);
        
        if (formData.product_details_pdf) {
          productFormData.append("product_details_pdf", formData.product_details_pdf);
        }

        console.log("Updating product...");

        const productResponse = await axios.put(
          `${API_URL}/api/products/${id}`,
          productFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Product Update Response:", productResponse.data);

        if (productResponse.status !== 200 && !productResponse.data.message) {
          throw new Error("Product update failed");
        }

        productId = parseInt(id!);
        setSuccess("Product updated successfully.");

        // Get existing variants from database
        const existingVariantsResponse = await axios.get(`${API_URL}/api/products/variants/${productId}`);
        const existingVariants = existingVariantsResponse.data;
        console.log("Existing variants in DB:", existingVariants);

        // Track which variants to keep
        const existingIds = existingVariants.map((v: any) => v.id);
        const currentIds = variants.filter(v => v.id).map(v => v.id);

        console.log("Existing IDs:", existingIds);
        console.log("Current IDs:", currentIds);

        // Delete variants that are in DB but not in current list
        for (const existingId of existingIds) {
          if (!currentIds.includes(existingId)) {
            console.log(`Deleting variant ${existingId}`);
            await deleteVariant(existingId);
          }
        }

        // Update or create variants
        for (const variant of variants) {
          if (variant.id) {
            // Update existing variant
            console.log(`Updating variant ${variant.id}`);
            const keepImage = !(variant.images && variant.images.length > 0);
            await updateVariant(variant.id, variant, keepImage);
          } else {
            // Create new variant
            console.log("Creating new variant");
            await submitVariant(productId, variant);
          }
        }

      } else {
        // Create Product
        const productFormData = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== "" && key !== 'existing_pdf') {
            productFormData.append(key, value as any);
          }
        });

        console.log("Creating product...");

        const productResponse = await axios.post(
          `${API_URL}/api/products`,
          productFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Product Response:", productResponse.data);

        if (!productResponse.data.success) {
          throw new Error("Product creation failed");
        }

        productId = productResponse.data.id;

        if (!productId) {
          throw new Error("Product id missing from response");
        }

        setSuccess("Product added successfully.");

        // Upload Variants
        if (variants.length > 0) {
          console.log("Uploading variants...");
          for (let i = 0; i < variants.length; i++) {
            const variant = variants[i];
            await submitVariant(productId, variant);
          }
        }
      }

      // Navigate to products page after success
      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);

    } catch (err: any) {
      console.error("Error in handleSubmit:", err);
      if (axios.isAxiosError(err)) {
        console.log("Response data:", err.response?.data);
        console.log("Status:", err.response?.status);
        setError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            "Request Failed"
        );
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
        {/* Product Details Section */}
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
                {categories.map((category) => (
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
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.name}>
                    {brand.name}
                  </option>
                ))}
              </select>
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
              <label htmlFor="weight">Weight</label>
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
                placeholder="e.g., 1 Year"
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

        {/* Variants Section */}
        <div className="form-section">
          <h3>Product Variants</h3>

          <div className="variant-form">
            <div className="variant-form-grid">
              <div className="form-group">
                <label>Color Name *</label>
                <input
                  type="text"
                  name="color_name"
                  value={currentVariant.color_name}
                  onChange={handleVariantChange}
                  placeholder="e.g., Black"
                />
              </div>

              <div className="form-group">
                <label>Color Hex</label>
                <input
                  type="color"
                  name="color_hex"
                  value={currentVariant.color_hex}
                  onChange={handleVariantChange}
                />
              </div>

              <div className="form-group">
                <label>Variant Price *</label>
                <input
                  type="number"
                  name="price"
                  value={currentVariant.price}
                  onChange={handleVariantChange}
                  step="0.01"
                  placeholder="0.00"
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
                <small className="file-hint">Upload images for this variant (only first image will be stored)</small>
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

          {/* Variants List */}
          {variants.length > 0 && (
            <div className="variants-list">
              <h4>Added Variants ({variants.length})</h4>
              <div className="variants-grid">
                {variants.map((variant, index) => (
                  <div key={index} className={`variant-card ${editingVariantIndex === index ? 'editing' : ''}`}>
                    <div className="variant-color" style={{ backgroundColor: variant.color_hex }}></div>
                    <div className="variant-info">
                      <strong>{variant.color_name}</strong>
                      <span>Price: ₹{parseFloat(variant.price).toLocaleString('en-IN')}</span>
                      <span>Stock: {variant.stock}</span>
                      {variant.existingImages && variant.existingImages.length > 0 && (
                        <div className="variant-images-preview">
                          <span className="image-count">Images: {variant.existingImages.length}</span>
                          <div className="mini-images">
                            {variant.existingImages.slice(0, 2).map((img, idx) => (
                              <img 
                                key={idx}
                                src={getImageUrl(img)} 
                                alt={`${variant.color_name} ${idx + 1}`}
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
                      {variant.images.length > 0 && (
                        <span className="new-images">New Images: {variant.images.length}</span>
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

        {/* Submit Button */}
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