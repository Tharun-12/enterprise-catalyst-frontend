import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Pencil, Trash2, X, Plus, FileText, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import './product-form.css';
import { baseurl } from '@/Baseurl/baseurl';

const API_URL = baseurl;

// Type definitions
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
  // New fields
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
  color_name: string;
  color_hex: string;
  price: string;
  stock: string;
  images: File[];
  existingImages?: string[];
  _isNew?: boolean;
  // New variant fields
  variant_size: string;
  part_code: string;
  description: string;
  datasheet_url: string;
  availability: string;
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

  const [variants, setVariants] = useState<Variant[]>([]);
  const [currentVariant, setCurrentVariant] = useState<Variant>({
    color_name: '',
    color_hex: '#000000',
    price: '',
    stock: '100',
    images: [],
    existingImages: [],
    variant_size: '',
    part_code: '',
    description: '',
    datasheet_url: '',
    availability: ''
  });
  const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [selectedFileNames, setSelectedFileNames] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [showVariantAdvanced, setShowVariantAdvanced] = useState<boolean>(false);

  const isSubmittingRef = useRef<boolean>(false);

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    if (isEditMode) {
      fetchProductData();
    }
  }, [id]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      setError('');

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

      if (productData.variants && Array.isArray(productData.variants) && productData.variants.length > 0) {
        const formattedVariants = productData.variants.map((v: any) => ({
          id: v.id,
          color_name: v.color_name || '',
          color_hex: v.color_hex || '#000000',
          price: String(v.price) || '',
          stock: String(v.stock) || '100',
          images: [],
          existingImages: v.image_url ? [v.image_url] : [],
          _isNew: false,
          variant_size: v.variant_size || '',
          part_code: v.part_code || '',
          description: v.description || '',
          datasheet_url: v.datasheet_url || '',
          availability: v.availability || ''
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      product_details_pdf: file,
    }));
  };

  const handleVariantChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setCurrentVariant((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVariantImages = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files || []);
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

  const handleAddOrUpdateVariant = (): void => {
    if (!currentVariant.color_name || !currentVariant.price) {
      setError('Please fill in color name and price for the variant');
      return;
    }

    if (isNaN(parseFloat(currentVariant.price))) {
      setError('Variant price must be a valid number');
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
      setVariants((prev) => [...prev, { ...currentVariant, _isNew: true }]);
      setSuccess('Variant added successfully');
    }

    setCurrentVariant({
      color_name: '',
      color_hex: '#000000',
      price: '',
      stock: '100',
      images: [],
      existingImages: [],
      variant_size: '',
      part_code: '',
      description: '',
      datasheet_url: '',
      availability: ''
    });
    setSelectedFileNames('');
    setError('');
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
      color_name: '',
      color_hex: '#000000',
      price: '',
      stock: '100',
      images: [],
      existingImages: [],
      variant_size: '',
      part_code: '',
      description: '',
      datasheet_url: '',
      availability: ''
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
        color_name: '',
        color_hex: '#000000',
        price: '',
        stock: '100',
        images: [],
        existingImages: [],
        variant_size: '',
        part_code: '',
        description: '',
        datasheet_url: '',
        availability: ''
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

  const submitVariant = async (productId: number, variant: Variant) => {
    const fd = new FormData();
    fd.append("product_id", String(productId));
    fd.append("color_name", variant.color_name);
    fd.append("color_hex", variant.color_hex);
    fd.append("price", variant.price);
    fd.append("stock", variant.stock);
    fd.append("variant_size", variant.variant_size || '');
    fd.append("part_code", variant.part_code || '');
    fd.append("description", variant.description || '');
    fd.append("datasheet_url", variant.datasheet_url || '');
    fd.append("availability", variant.availability || '');

    if (variant.images && variant.images.length > 0) {
      variant.images.forEach((img) => {
        fd.append("images", img);
      });
    }

    const response = await axios.post(`${API_URL}/api/products/variants`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  };

  const updateVariant = async (variantId: number, variant: Variant, keepImage: boolean = true) => {
    const fd = new FormData();
    fd.append("color_name", variant.color_name);
    fd.append("color_hex", variant.color_hex);
    fd.append("price", variant.price);
    fd.append("stock", variant.stock);
    fd.append("keep_image", String(keepImage));
    fd.append("variant_size", variant.variant_size || '');
    fd.append("part_code", variant.part_code || '');
    fd.append("description", variant.description || '');
    fd.append("datasheet_url", variant.datasheet_url || '');
    fd.append("availability", variant.availability || '');

    if (variant.images && variant.images.length > 0) {
      variant.images.forEach((img) => {
        fd.append("images", img);
      });
    }

    const response = await axios.put(`${API_URL}/api/products/variants/${variantId}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  };

  const deleteVariant = async (variantId: number) => {
    return axios.delete(`${API_URL}/api/products/variants/${variantId}`);
  };

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
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== "" && key !== 'existing_pdf') {
            productFormData.append(key, value as any);
          }
        });
        if (formData.existing_pdf) productFormData.append("existing_pdf", formData.existing_pdf);
        if (formData.product_details_pdf) {
          productFormData.append("product_details_pdf", formData.product_details_pdf);
        }

        const productResponse = await axios.put(
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
            await deleteVariant(existingId);
          }
        }

        for (const variant of variants) {
          if (variant.id) {
            const keepImage = !(variant.images && variant.images.length > 0);
            await updateVariant(variant.id, variant, keepImage);
          } else {
            await submitVariant(productId, variant);
          }
        }

      } else {
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

        if (variants.length > 0) {
          for (const variant of variants) {
            await submitVariant(productId, variant);
          }
        }
      }

      setTimeout(() => {
        navigate('/admin/products');
      }, 1500);

    } catch (err: any) {
      console.error("Error in handleSubmit:", err);
      if (axios.isAxiosError(err)) {
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

        {/* Advanced Product Specifications Section */}
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
                  placeholder="e.g., 24 AWG Solid, 28 AWG Stranded"
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
                  placeholder="e.g., Standard pair separation, Improved pair separation and crosstalk control"
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
                  placeholder="e.g., Data Centers, High-Speed Networks, Enterprise Backbone"
                />
              </div>
            </div>
          )}
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
                  placeholder="e.g., Black, Red, Blue"
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

              <div className="form-group">
                <label>Variant Size</label>
                <input
                  type="text"
                  name="variant_size"
                  value={currentVariant.variant_size}
                  onChange={handleVariantChange}
                  placeholder="e.g., 1M, 2M, 3M, 5M, 22U, 42U"
                />
              </div>

              <div className="form-group">
                <label>Part Code</label>
                <input
                  type="text"
                  name="part_code"
                  value={currentVariant.part_code}
                  onChange={handleVariantChange}
                  placeholder="e.g., CPCSSX2-01M001"
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

              <div className="form-group full-width">
                <label>Variant Description</label>
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
                      {variant.variant_size && <span>Size: {variant.variant_size}</span>}
                      {variant.part_code && <span>Part: {variant.part_code}</span>}
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