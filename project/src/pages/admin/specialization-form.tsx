// src/components/admin/SpecificationsForm.tsx

import {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
} from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';

import { baseurl } from '@/Baseurl/baseurl';

const API_URL = `${baseurl}/api`;

/* =========================================================
   TYPES
========================================================= */

interface SubCategory {
  id: number;
  subcategory_name: string;
  created_at?: string;
}

interface Category {
  id: number;
  category_name: string;
  description?: string;
  category_image?: string;
  created_at?: string;
  updated_at?: string;
  subcategories: SubCategory[];
}

interface Brand {
  id: number;
  brand_name: string;
  category_id?: number;
  sub_category_id?: number;
  category_name?: string;
  sub_category_name?: string;
}

interface ProductSpecification {
  id: string;
  spec_name: string;
  value: string;
}

interface SpecificationData {
  category_id: string;
  sub_category_id: string;
  brand_id: string;
  spec_name: string;
  product_specifications: ProductSpecification[];
}

interface SpecificationApiData {
  id?: number | string;
  category_id?: number | string;
  category_name?: string;
  sub_category_id?: number | string | null;
  subcategory_name?: string;
  brand_id?: number | string | null;
  brand_name?: string;
  spec_name?: string;
  product_specifications?: ProductSpecification[];
  created_at?: string;
  updated_at?: string;
}

interface SpecificationResponse {
  success: boolean;
  data: SpecificationApiData;
  message?: string;
}

interface CategoriesResponse {
  success: boolean;
  data: Category[];
  message?: string;
}

interface BrandsResponse {
  success: boolean;
  data: Brand[];
  message?: string;
}

interface ErrorResponse {
  message?: string;
}

/* =========================================================
   COMPONENT
========================================================= */

export function SpecificationsForm() {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  /* =======================================================
     STATE
  ======================================================= */

  const [isLoading, setIsLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);

  const [brands, setBrands] = useState<Brand[]>([]);

  const [isLoadingCategories, setIsLoadingCategories] =
    useState(false);

  const [isLoadingBrands, setIsLoadingBrands] = useState(false);

  const [formData, setFormData] =
    useState<SpecificationData>({
      category_id: '',
      sub_category_id: '',
      brand_id: '',
      spec_name: '',
      product_specifications: [],
    });

  const [newSpecName, setNewSpecName] =
    useState('');

  const [newSpecValue, setNewSpecValue] =
    useState('');

  /* =======================================================
     SELECTED CATEGORY
  ======================================================= */

  const selectedCategory = categories.find(
    (category) =>
      String(category.id) === formData.category_id
  );

  /* =======================================================
     FILTERED SUBCATEGORIES
  ======================================================= */

  const filteredSubCategories: SubCategory[] =
    selectedCategory?.subcategories || [];

  /* =======================================================
     FILTERED BRANDS
  ======================================================= */

  const filteredBrands = brands.filter(
    (brand) =>
      brand.category_id === Number(formData.category_id) &&
      brand.sub_category_id === Number(formData.sub_category_id)
  );

  /* =======================================================
     DEBUG
  ======================================================= */

  useEffect(() => {
    console.log('========== SPECIFICATION FORM DEBUG ==========');

    console.log(
      'Form Category ID:',
      formData.category_id
    );

    console.log(
      'Form Sub Category ID:',
      formData.sub_category_id
    );

    console.log(
      'Form Brand ID:',
      formData.brand_id
    );

    console.log(
      'Selected Category:',
      selectedCategory
    );

    console.log(
      'Filtered Sub Categories:',
      filteredSubCategories
    );

    console.log(
      'Filtered Brands:',
      filteredBrands
    );

    console.log(
      '=============================================='
    );
  }, [
    formData.category_id,
    formData.sub_category_id,
    formData.brand_id,
    categories,
    filteredBrands,
  ]);

  /* =======================================================
     LOAD DATA
     
     IMPORTANT:
     1. Load categories.
     2. Load brands.
     3. Then load specification.
     4. Convert BOTH IDs to strings.
     5. Set form data.
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        setIsLoadingCategories(true);
        setIsLoadingBrands(true);

        if (id) {
          setIsLoading(true);
        }

        /* -----------------------------------------------
           STEP 1: GET CATEGORIES
        ------------------------------------------------ */

        const categoriesResponse =
          await axios.get<CategoriesResponse>(
            `${API_URL}/categories/`
          );

        if (cancelled) return;

        if (!categoriesResponse.data.success) {
          throw new Error(
            categoriesResponse.data.message ||
              'Failed to load categories'
          );
        }

        const categoryData =
          categoriesResponse.data.data || [];

        console.log(
          'CATEGORIES API:',
          categoryData
        );

        setCategories(categoryData);

        /* -----------------------------------------------
           STEP 2: GET BRANDS
        ------------------------------------------------ */

        const brandsResponse =
          await axios.get<BrandsResponse>(
            `${API_URL}/brands/`
          );

        if (cancelled) return;

        if (!brandsResponse.data.success) {
          throw new Error(
            brandsResponse.data.message ||
              'Failed to load brands'
          );
        }

        const brandData =
          brandsResponse.data.data || [];

        console.log(
          'BRANDS API:',
          brandData
        );

        setBrands(brandData);

        /* -----------------------------------------------
           STEP 3: ADD MODE
        ------------------------------------------------ */

        if (!id) {
          setIsEditing(false);

          setFormData({
            category_id: '',
            sub_category_id: '',
            brand_id: '',
            spec_name: '',
            product_specifications: [],
          });

          return;
        }

        /* -----------------------------------------------
           STEP 4: EDIT MODE - GET SPECIFICATION
        ------------------------------------------------ */

        const specificationResponse =
          await axios.get<SpecificationResponse>(
            `${API_URL}/specifications/${id}`
          );

        if (cancelled) return;

        console.log(
          'SPECIFICATION API:',
          specificationResponse.data
        );

        if (
          !specificationResponse.data.success ||
          !specificationResponse.data.data
        ) {
          toast.error('Specification not found');

          navigate('/admin/specifications');

          return;
        }

        const spec =
          specificationResponse.data.data;

        /* -----------------------------------------------
           IMPORTANT:
           API:
             category_id = 21
             sub_category_id = 6
             brand_id = 1

           Convert:
             "21"
             "6"
             "1"

           Radix Select values MUST be strings.
        ------------------------------------------------ */

        const categoryId =
          spec.category_id !== undefined &&
          spec.category_id !== null
            ? String(spec.category_id)
            : '';

        const subCategoryId =
          spec.sub_category_id !== undefined &&
          spec.sub_category_id !== null
            ? String(spec.sub_category_id)
            : '';

        const brandId =
          spec.brand_id !== undefined &&
          spec.brand_id !== null
            ? String(spec.brand_id)
            : '';

        console.log(
          'API Category ID:',
          spec.category_id
        );

        console.log(
          'API Sub Category ID:',
          spec.sub_category_id
        );

        console.log(
          'API Brand ID:',
          spec.brand_id
        );

        console.log(
          'Converted Category ID:',
          categoryId
        );

        console.log(
          'Converted Sub Category ID:',
          subCategoryId
        );

        console.log(
          'Converted Brand ID:',
          brandId
        );

        /* -----------------------------------------------
           VERIFY CATEGORY
        ------------------------------------------------ */

        const matchingCategory =
          categoryData.find(
            (category) =>
              String(category.id) === categoryId
          );

        console.log(
          'MATCHING CATEGORY:',
          matchingCategory
        );

        /* -----------------------------------------------
           VERIFY SUBCATEGORY
        ------------------------------------------------ */

        const matchingSubCategory =
          matchingCategory?.subcategories?.find(
            (sub) =>
              String(sub.id) === subCategoryId
          );

        console.log(
          'MATCHING SUB CATEGORY:',
          matchingSubCategory
        );

        /* -----------------------------------------------
           VERIFY BRAND
        ------------------------------------------------ */

        const matchingBrand =
          brandData.find(
            (brand) =>
              String(brand.id) === brandId &&
              brand.category_id === Number(categoryId) &&
              brand.sub_category_id === Number(subCategoryId)
          );

        console.log(
          'MATCHING BRAND:',
          matchingBrand
        );

        if (!matchingCategory) {
          console.error(
            `Category ${categoryId} was not found in categories API`
          );
        }

        if (
          subCategoryId &&
          !matchingSubCategory
        ) {
          console.error(
            `Sub Category ${subCategoryId} was not found inside Category ${categoryId}`
          );
        }

        if (
          brandId &&
          !matchingBrand
        ) {
          console.error(
            `Brand ${brandId} was not found for Category ${categoryId} and Sub Category ${subCategoryId}`
          );
        }

        /* -----------------------------------------------
           STEP 5: SET COMPLETE FORM DATA
        ------------------------------------------------ */

        setIsEditing(true);

        setFormData({
          category_id: categoryId,

          sub_category_id:
            matchingSubCategory
              ? subCategoryId
              : '',

          brand_id:
            matchingBrand
              ? brandId
              : '',

          spec_name:
            spec.spec_name || '',

          product_specifications:
            Array.isArray(
              spec.product_specifications
            )
              ? spec.product_specifications
              : [],
        });

      } catch (error) {
        if (cancelled) return;

        console.error(
          'Error loading specification form:',
          error
        );

        if (axios.isAxiosError(error)) {
          const axiosError =
            error as AxiosError<ErrorResponse>;

          console.error(
            'API ERROR:',
            axiosError.response?.data
          );
        }

        toast.error(
          id
            ? 'Failed to load specification data'
            : 'Failed to load categories or brands'
        );

        if (id) {
          navigate('/admin/specifications');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setIsLoadingCategories(false);
          setIsLoadingBrands(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  /* =======================================================
     INPUT CHANGE
  ======================================================= */

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =======================================================
     CATEGORY CHANGE
  ======================================================= */

  const handleCategoryChange = (
    value: string
  ): void => {
    console.log(
      'Category changed:',
      value
    );

    setFormData((prev) => ({
      ...prev,

      category_id: value,

      // Reset subcategory and brand when category changes
      sub_category_id: '',
      brand_id: '',
    }));
  };

  /* =======================================================
     SUBCATEGORY CHANGE
  ======================================================= */

  const handleSubCategoryChange = (
    value: string
  ): void => {
    console.log(
      'Sub Category changed:',
      value
    );

    setFormData((prev) => ({
      ...prev,

      sub_category_id: value,

      // Reset brand when subcategory changes
      brand_id: '',
    }));
  };

  /* =======================================================
     BRAND CHANGE
  ======================================================= */

  const handleBrandChange = (
    value: string
  ): void => {
    console.log(
      'Brand changed:',
      value
    );

    setFormData((prev) => ({
      ...prev,

      brand_id: value,
    }));
  };

  /* =======================================================
     ADD PRODUCT SPECIFICATION
  ======================================================= */

  const handleAddSpecification = (): void => {
    const name =
      newSpecName.trim();

    const value =
      newSpecValue.trim();

    if (!name || !value) {
      toast.error(
        'Please enter both specification name and value'
      );

      return;
    }

    const duplicate =
      formData.product_specifications.some(
        (spec) =>
          spec.spec_name.toLowerCase() ===
          name.toLowerCase()
      );

    if (duplicate) {
      toast.error(
        'Specification already exists'
      );

      return;
    }

    const newSpec: ProductSpecification = {
      id: Date.now().toString(),
      spec_name: name,
      value,
    };

    setFormData((prev) => ({
      ...prev,

      product_specifications: [
        ...prev.product_specifications,
        newSpec,
      ],
    }));

    setNewSpecName('');
    setNewSpecValue('');
  };

  /* =======================================================
     REMOVE PRODUCT SPECIFICATION
  ======================================================= */

  const handleRemoveSpecification = (
    specificationId: string
  ): void => {
    setFormData((prev) => ({
      ...prev,

      product_specifications:
        prev.product_specifications.filter(
          (spec) =>
            spec.id !== specificationId
        ),
    }));
  };

  /* =======================================================
     UPDATE PRODUCT SPECIFICATION
  ======================================================= */

  const handleUpdateSpecification = (
    specificationId: string,
    field: 'spec_name' | 'value',
    value: string
  ): void => {
    setFormData((prev) => ({
      ...prev,

      product_specifications:
        prev.product_specifications.map(
          (spec) =>
            spec.id === specificationId
              ? {
                  ...spec,
                  [field]: value,
                }
              : spec
        ),
    }));
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!formData.category_id) {
      toast.error(
        'Please select a category'
      );

      return;
    }

    if (!formData.sub_category_id) {
      toast.error(
        'Please select a subcategory'
      );

      return;
    }

    if (!formData.brand_id) {
      toast.error(
        'Please select a brand'
      );

      return;
    }

    if (!formData.spec_name.trim()) {
      toast.error(
        'Specification name is required'
      );

      return;
    }

    if (
      formData.product_specifications.length === 0
    ) {
      toast.error(
        'Please add at least one product specification'
      );

      return;
    }

    const hasEmptySpecs =
      formData.product_specifications.some(
        (spec) =>
          !spec.spec_name.trim() ||
          !spec.value.trim()
      );

    if (hasEmptySpecs) {
      toast.error(
        'Please fill in all product specification fields'
      );

      return;
    }

    setIsLoading(true);

    try {
      const submitData = {
        category_id:
          Number(formData.category_id),

        sub_category_id:
          Number(formData.sub_category_id),

        brand_id:
          Number(formData.brand_id),

        spec_name:
          formData.spec_name.trim(),

        product_specifications:
          formData.product_specifications,
      };

      console.log(
        'SUBMIT DATA:',
        submitData
      );

      if (isEditing) {
        const response =
          await axios.put<SpecificationResponse>(
            `${API_URL}/specifications/${id}`,
            submitData
          );

        if (response.data.success) {
          toast.success(
            'Specification updated successfully!'
          );
        }
      } else {
        const response =
          await axios.post<SpecificationResponse>(
            `${API_URL}/specifications`,
            submitData
          );

        if (response.data.success) {
          toast.success(
            'Specification created successfully!'
          );
        }
      }

      setTimeout(() => {
        navigate('/admin/specifications');
      }, 500);

    } catch (error) {
      console.error(
        'Error saving specification:',
        error
      );

      if (axios.isAxiosError(error)) {
        const axiosError =
          error as AxiosError<ErrorResponse>;

        toast.error(
          axiosError.response?.data?.message ||
            (
              isEditing
                ? 'Failed to update specification'
                : 'Failed to create specification'
            )
        );
      } else {
        toast.error(
          isEditing
            ? 'Failed to update specification'
            : 'Failed to create specification'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* =======================================================
     CANCEL
  ======================================================= */

  const handleCancel = (): void => {
    navigate('/admin/specifications');
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-center gap-4 mb-6">

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          className="h-10 w-10 shrink-0 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing
              ? 'Edit Specification'
              : 'Add New Specification'}
          </h1>

          <p className="text-sm text-gray-500">
            {isEditing
              ? 'Update specification information'
              : 'Create a new product specification'}
          </p>
        </div>

      </div>

      {/* =================================================
          FORM
      ================================================= */}

      <Card className="w-full border-0 shadow-sm">

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6"
        >

          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <div className="space-y-4">

            <h3 className="text-base font-semibold text-gray-800 border-b pb-2">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* =================================================
                  CATEGORY
              ================================================= */}

              <div className="space-y-2">

                <Label
                  htmlFor="category_id"
                  className="text-sm font-medium text-gray-700"
                >
                  Category{' '}
                  <span className="text-red-500">
                    *
                  </span>
                </Label>

                <Select
                  value={formData.category_id}
                  onValueChange={
                    handleCategoryChange
                  }
                  disabled={
                    isLoading ||
                    isLoadingCategories
                  }
                >

                  <SelectTrigger
                    id="category_id"
                    className="w-full h-10 bg-white border-gray-200"
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>

                  <SelectContent>

                    {categories.map(
                      (category) => (
                        <SelectItem
                          key={category.id}
                          value={String(
                            category.id
                          )}
                        >
                          {category.category_name}
                        </SelectItem>
                      )
                    )}

                  </SelectContent>

                </Select>

              </div>

              {/* =================================================
                  SUB CATEGORY
              ================================================= */}

              <div className="space-y-2">

                <Label
                  htmlFor="sub_category_id"
                  className="text-sm font-medium text-gray-700"
                >
                  Sub Category{' '}
                  <span className="text-red-500">
                    *
                  </span>
                </Label>

                <Select
                  /*
                    IMPORTANT:

                    key forces Radix Select to
                    recreate itself when category
                    or subcategory list changes.

                    This prevents the Radix Select
                    from keeping an old internal
                    placeholder state.
                  */
                  key={`${formData.category_id}-${formData.sub_category_id}-${filteredSubCategories.length}`}
                  value={
                    formData.sub_category_id
                  }
                  onValueChange={
                    handleSubCategoryChange
                  }
                  disabled={
                    isLoading ||
                    isLoadingCategories ||
                    !formData.category_id ||
                    filteredSubCategories.length === 0
                  }
                >

                  <SelectTrigger
                    id="sub_category_id"
                    className="w-full h-10 bg-white border-gray-200"
                  >

                    <SelectValue
                      placeholder={
                        !formData.category_id
                          ? 'Select a category first'
                          : filteredSubCategories.length ===
                              0
                            ? 'No subcategories available'
                            : 'Select a subcategory'
                      }
                    />

                  </SelectTrigger>

                  <SelectContent>

                    {filteredSubCategories.map(
                      (subCategory) => (
                        <SelectItem
                          key={
                            subCategory.id
                          }
                          value={String(
                            subCategory.id
                          )}
                        >
                          {
                            subCategory.subcategory_name
                          }
                        </SelectItem>
                      )
                    )}

                  </SelectContent>

                </Select>

              </div>

            </div>

            {/* =================================================
                BRAND - New Row
            ================================================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="space-y-2">

                <Label
                  htmlFor="brand_id"
                  className="text-sm font-medium text-gray-700"
                >
                  Brand{' '}
                  <span className="text-red-500">
                    *
                  </span>
                </Label>

                <Select
                  key={`${formData.category_id}-${formData.sub_category_id}-${formData.brand_id}-${filteredBrands.length}`}
                  value={formData.brand_id}
                  onValueChange={handleBrandChange}
                  disabled={
                    isLoading ||
                    isLoadingBrands ||
                    !formData.category_id ||
                    !formData.sub_category_id ||
                    filteredBrands.length === 0
                  }
                >

                  <SelectTrigger
                    id="brand_id"
                    className="w-full h-10 bg-white border-gray-200"
                  >

                    <SelectValue
                      placeholder={
                        !formData.category_id
                          ? 'Select a category first'
                          : !formData.sub_category_id
                            ? 'Select a subcategory first'
                            : filteredBrands.length === 0
                              ? 'No brands available for this selection'
                              : 'Select a brand'
                      }
                    />

                  </SelectTrigger>

                  <SelectContent>

                    {filteredBrands.map(
                      (brand) => (
                        <SelectItem
                          key={brand.id}
                          value={String(
                            brand.id
                          )}
                        >
                          {brand.brand_name}
                        </SelectItem>
                      )
                    )}

                  </SelectContent>

                </Select>

                {formData.category_id && formData.sub_category_id && filteredBrands.length === 0 && (
                  <p className="text-xs text-amber-600">
                    No brands found for this category and subcategory. Please add brands first.
                  </p>
                )}

              </div>

              {/* =================================================
                  SPECIFICATION NAME
              ================================================= */}

              <div className="space-y-2">

                <Label
                  htmlFor="spec_name"
                  className="text-sm font-medium text-gray-700"
                >
                  Specification Name{' '}
                  <span className="text-red-500">
                    *
                  </span>
                </Label>

                <Input
                  id="spec_name"
                  name="spec_name"
                  value={formData.spec_name}
                  onChange={handleChange}
                  placeholder="e.g., CAT6 Data Cabling"
                  className="w-full h-10 bg-white border-gray-200"
                  required
                  disabled={isLoading}
                />

              </div>

            </div>

          </div>

          {/* =================================================
              PRODUCT SPECIFICATIONS
          ================================================= */}

          <div className="space-y-4">

            <h3 className="text-base font-semibold text-gray-800 border-b pb-2">
              Product Specifications
            </h3>

            {/* =================================================
                EXISTING SPECIFICATIONS
            ================================================= */}

            <div className="space-y-2">

              {formData.product_specifications
                .length === 0 ? (

                <div className="text-sm text-gray-400 bg-gray-50 rounded-lg p-4 border border-gray-200 text-center">
                  No specifications added yet.
                  Add a specification below.
                </div>

              ) : (

                formData.product_specifications.map(
                  (spec) => (

                    <div
                      key={spec.id}
                      className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
                    >

                      <div className="flex-1">

                        <Input
                          value={
                            spec.spec_name
                          }
                          onChange={(e) =>
                            handleUpdateSpecification(
                              spec.id,
                              'spec_name',
                              e.target.value
                            )
                          }
                          className="h-9 bg-white border-gray-200 text-sm"
                          placeholder="Specification name"
                          disabled={isLoading}
                        />

                      </div>

                      <div className="flex-1">

                        <Input
                          value={spec.value}
                          onChange={(e) =>
                            handleUpdateSpecification(
                              spec.id,
                              'value',
                              e.target.value
                            )
                          }
                          className="h-9 bg-white border-gray-200 text-sm"
                          placeholder="Value"
                          disabled={isLoading}
                        />

                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleRemoveSpecification(
                            spec.id
                          )
                        }
                        className="text-gray-400 hover:text-red-500 shrink-0"
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                    </div>

                  )
                )

              )}

            </div>

            {/* =================================================
                ADD SPECIFICATION
            ================================================= */}

            <div className="flex gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200">

              <div className="flex-1">

                <Input
                  value={newSpecName}
                  onChange={(e) =>
                    setNewSpecName(
                      e.target.value
                    )
                  }
                  placeholder="Specification name..."
                  className="w-full h-9 bg-white border-gray-200 text-sm"
                  disabled={isLoading}
                />

              </div>

              <div className="flex-1">

                <Input
                  value={newSpecValue}
                  onChange={(e) =>
                    setNewSpecValue(
                      e.target.value
                    )
                  }
                  placeholder="Value..."
                  className="w-full h-9 bg-white border-gray-200 text-sm"
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Enter'
                    ) {
                      e.preventDefault();

                      handleAddSpecification();
                    }
                  }}
                />

              </div>

              <Button
                type="button"
                onClick={
                  handleAddSpecification
                }
                disabled={
                  isLoading ||
                  !newSpecName.trim() ||
                  !newSpecValue.trim()
                }
                className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>

            </div>

          </div>

          {/* =================================================
              ACTION BUTTONS
          ================================================= */}

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
                ? isEditing
                  ? 'Updating...'
                  : 'Creating...'
                : isEditing
                  ? 'Update Specification'
                  : 'Create Specification'}
            </Button>

          </div>

        </form>

      </Card>

    </div>
  );
}