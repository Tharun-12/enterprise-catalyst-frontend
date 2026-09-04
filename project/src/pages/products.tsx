// products.tsx - Fixed version with proper image handling
import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { ProductCard } from '@/components/product-card';
import { FilterPanel, type FilterState } from '@/components/filter-panel';
import { EmptyState, ProductGridSkeleton } from '@/components/shared';
import { Package } from 'lucide-react';
import { PageBreadcrumb as Breadcrumb } from '@/layouts/customer-layout-wrapper';
import { baseurl } from '@/Baseurl/baseurl';
import type { Product, Category} from '@/types';

// ---- Raw API response shapes ----
interface ApiCategory {
  id: number;
  category_name: string;
  created_at: string;
  updated_at: string;
  subcategories?: ApiSubcategory[];
}

interface ApiSubcategory {
  id: number;
  subcategory_name: string;
  created_at: string;
  updated_at: string;
}

interface ApiBrand {
  id: number;
  brand_name: string;
  category_id: number;
  category_name: string;
  sub_category_id: number;
  sub_category_name: string;
  created_at: string;
  updated_at: string;
}

interface ApiVariant {
  id: number;
  product_id: number;
  color_name?: string;
  color_hex?: string;
  price?: string | null;
  min_price?: string | null;
  max_price?: string | null;
  stock: number;
  image_url: string;
  variant_name?: string;
  part_code?: string;
  category?: string;
  sub_category?: string;
  brand?: string;
  description?: string;
  spec_type?: string;
  color?: string;
  size?: string;
  availability?: string;
  datasheet_url?: string;
  created_at?: string;
  updated_at?: string;
}

interface ApiProduct {
  id: number;
  product_name: string;
  product_code: string;
  product_category_id: number;
  product_brand: string;
  product_details_pdf: string;
  price: string;
  min_price?: string;
  max_price?: string;
  dimensions?: string;
  specifications?: string | Record<string, string>;
  weight?: string;
  discount: string;
  product_description: string;
  warranty: string;
  created_at: string;
  updated_at: string;
  category_name?: string;
  category_id?: number;
  sub_category_id?: number;
  subcategory_name?: string;
  product_series?: string;
  product_type?: string;
  conductor_type?: string;
  cable_od?: string;
  jacket_material?: string;
  bandwidth?: string;
  operating_temperature?: string;
  poe_support?: string;
  variants?: ApiVariant[];
}

// Helper function to parse numbers safely
const validNumber = (value: unknown): number | undefined => {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

/**
 * Helper function to extract image URL from variant image_url field
 * Handles both JSON array format and direct string format
 */
const extractImageUrl = (imageUrl: string | undefined | null): string | null => {
  if (!imageUrl) return null;
  
  try {
    // Try to parse as JSON array (format: "[\"/uploads/products/image.jpg\"]")
    const parsed = JSON.parse(imageUrl);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed[0];
    }
    return imageUrl;
  } catch {
    // If not JSON, treat as direct URL string
    return imageUrl;
  }
};

/**
 * Helper function to get full image URL with base URL
 */
const getFullImageUrl = (imagePath: string | null): string => {
  if (!imagePath) {
    return 'https://via.placeholder.com/400x400?text=No+Image';
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Ensure path starts with '/'
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseurl}${normalizedPath}`;
};

// ---- Transform API product into the app-wide `Product` type ----
const transformProduct = (
  product: ApiProduct,
  categories: ApiCategory[],
  brands: ApiBrand[]
): Product => {
  const category = categories.find(c => c.id === product.category_id || c.id === product.product_category_id);
  const brand = brands.find(b => b.brand_name === product.product_brand);

  // Extract images from variants - handle both JSON array and string formats
  const galleryImages = product.variants?.map(v => {
    const extracted = extractImageUrl(v.image_url);
    return extracted ? getFullImageUrl(extracted) : null;
  }).filter(Boolean) as string[] || [];

  // If no gallery images, use placeholder
  const defaultImage = 'https://via.placeholder.com/400x400?text=No+Image';
  const gallery = galleryImages.length > 0 ? galleryImages : [defaultImage];

  const discountNum = parseFloat(product.discount || '0');

  const productPrice = validNumber(product.price);
  const apiMinPrice = validNumber(product.min_price);
  const apiMaxPrice = validNumber(product.max_price);

  // Calculate price range from variants
  const variantPrices = product.variants
    ?.map((variant) => ({
      min: validNumber(variant.min_price),
      max: validNumber(variant.max_price),
      price: validNumber(variant.price),
    }))
    .filter(
      (item) =>
        item.min !== undefined ||
        item.max !== undefined ||
        item.price !== undefined
    ) || [];

  const variantMinPrices = variantPrices
    .map((item) => item.min ?? item.price)
    .filter((price): price is number => price !== undefined);

  const variantMaxPrices = variantPrices
    .map((item) => item.max ?? item.price)
    .filter((price): price is number => price !== undefined);

  const minPrice =
    apiMinPrice !== undefined
      ? apiMinPrice
      : variantMinPrices.length > 0
        ? Math.min(...variantMinPrices)
        : undefined;

  const maxPrice =
    apiMaxPrice !== undefined
      ? apiMaxPrice
      : variantMaxPrices.length > 0
        ? Math.max(...variantMaxPrices)
        : undefined;

  const priceNum =
    productPrice !== undefined
      ? productPrice
      : minPrice !== undefined
        ? minPrice
        : 0;

  // Handle specifications
  let features: string[] = [];
  let specFields: { key: string; label: string; value: string }[] = [];
  
  if (product.specifications) {
    if (typeof product.specifications === 'string') {
      features = product.specifications.split(',').map(s => s.trim()).filter(Boolean);
      specFields = features.map(f => ({
        key: f.toLowerCase().replace(/\s+/g, '_'),
        label: f,
        value: f
      }));
    } else if (typeof product.specifications === 'object' && !Array.isArray(product.specifications)) {
      const specObj = product.specifications as Record<string, string>;
      features = Object.entries(specObj).map(([key, value]) => `${key}: ${value}`);
      specFields = Object.entries(specObj).map(([key, value]) => ({
        key: key.toLowerCase().replace(/\s+/g, '_'),
        label: key,
        value: value
      }));
    }
  }

  return {
    id: String(product.id),
    name: product.product_name,
    slug: product.product_name.toLowerCase().replace(/\s+/g, '-'),
    sku: product.product_code,
    brandId: String(brand?.id ?? 'unknown'),
    brandName: brand?.brand_name || product.product_brand || 'Unknown',
    categoryId: String(product.category_id || product.product_category_id || ''),
    categoryName: category?.category_name || product.category_name || 'Uncategorized',
    subcategoryId: String(product.sub_category_id || ''),
    subcategoryName: product.subcategory_name || '',
    shortDescription: product.product_description?.substring(0, 150) || '',
    description: product.product_description || '',
    gallery,
    features: features,
    specifications: typeof product.specifications === 'object' ? product.specifications : {},
    currency: 'INR',
    relatedProductIds: [],
    specGroups: [
      {
        groupName: 'Specifications',
        fields: [
          { key: 'dimensions', label: 'Dimensions', value: product.dimensions || 'N/A' },
          { key: 'weight', label: 'Weight', value: product.weight ? `${product.weight} kg` : 'N/A' },
          ...specFields.length > 0 ? specFields : [
            { key: 'specifications', label: 'Specifications', value: product.specifications ? JSON.stringify(product.specifications) : 'N/A' }
          ],
          { key: 'warranty', label: 'Warranty', value: product.warranty || 'Standard' },
        ]
      }
    ],
    price: priceNum,
    minPrice: minPrice,
    maxPrice: maxPrice,
    originalPrice: priceNum * (1 + discountNum / 100),
    discountPercentage: discountNum,
    status: 'active',
    isPopular: false,
    isNew: false,
    rating: 4.5,
    reviewCount: 0,
    downloads: product.product_details_pdf
      ? [{ name: 'Product Details', type: 'pdf' as const, size: 'PDF', url: product.product_details_pdf }]
      : [],
    createdAt: product.created_at,
    warranty: product.warranty || 'Standard warranty',
    variants: product.variants?.map(v => {
      const extractedImage = extractImageUrl(v.image_url);
      return {
        id: v.id,
        color_name: v.color_name || v.color || 'Default',
        color: v.color || v.color_name || 'Default',
        color_hex: v.color_hex || '#CCCCCC',
        price: v.price ?? undefined,
        min_price: v.min_price ?? undefined,
        max_price: v.max_price ?? undefined,
        stock: v.stock || 0,
        image_url: extractedImage || '',
        full_image_url: extractedImage ? getFullImageUrl(extractedImage) : '',
        variant_name: v.variant_name,
        part_code: v.part_code,
        category: v.category,
        sub_category: v.sub_category,
        brand: v.brand,
        description: v.description,
        spec_type: v.spec_type,
        size: v.size,
        availability: v.availability,
        datasheet_url: v.datasheet_url,
      };
    }),
    hasVariants: (product.variants?.length || 0) > 0,
    stock: product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0,
  };
};

export function ProductsPage() {
  const [searchParams, _setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  // Ref for scrolling to products grid
  const productsGridRef = useRef<HTMLDivElement>(null);

  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('search') || '';

  const createSlug = (name: string): string => {
    if (!name) return '';
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  // Initialize filters state
  const [filters, setFilters] = useState<FilterState>({
    category: categorySlug,
    subcategory: null,
    brands: [],
    specs: {},
    search: searchQuery,
    sort: 'latest',
    minPrice: undefined,
    maxPrice: undefined,
  });

  // Scroll to products function
  const scrollToProducts = () => {
    requestAnimationFrame(() => {
      if (productsGridRef.current) {
        const yOffset = -80;
        const y = productsGridRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  };

  // Filter change handler with scroll to top
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setTimeout(scrollToProducts, 150);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
    setCurrentPage(1);
    clearTimeout((handleSearchChange as any).timeout);
    (handleSearchChange as any).timeout = setTimeout(scrollToProducts, 300);
  };

  const handleSortChange = (value: string) => {
    setFilters({ ...filters, sort: value });
    setCurrentPage(1);
    setTimeout(scrollToProducts, 150);
  };

  const handleClearFilters = () => {
    setFilters({ 
      category: filters.category, 
      subcategory: null,
      brands: [], 
      specs: {}, 
      search: '', 
      sort: 'latest',
      minPrice: undefined,
      maxPrice: undefined,
    });
    setCurrentPage(1);
    setTimeout(scrollToProducts, 150);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const categoriesRes = await fetch(`${baseurl}/api/categories/`);
        const categoriesData = await categoriesRes.json();
        if (!categoriesData.success) throw new Error('Failed to fetch categories');
        setCategories(categoriesData.data);

        const brandsRes = await fetch(`${baseurl}/api/brands/`);
        const brandsData = await brandsRes.json();
        if (!brandsData.success) throw new Error('Failed to fetch brands');
        setBrands(brandsData.data);

        const productsRes = await fetch(`${baseurl}/api/products/products-with-variants`);
        const productsData = await productsRes.json();

        if (Array.isArray(productsData)) {
          setProducts(productsData);
        } else {
          throw new Error('Invalid products data format');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Extract unique variant options from products - ONLY COLORS
  const variantOptions = useMemo(() => {
    const options: Record<string, string[]> = {
      color: [],
    };
    
    products.forEach(product => {
      if (product.variants) {
        product.variants.forEach(variant => {
          if (variant.color && !options.color.includes(variant.color)) {
            options.color.push(variant.color);
          }
        });
      }
    });

    Object.keys(options).forEach(key => {
      options[key].sort();
    });

    return options;
  }, [products]);

  // Extract unique specification values from products
  const specOptions = useMemo(() => {
    const options: Record<string, string[]> = {};
    
    products.forEach(product => {
      const specsToCheck = [
        'bandwidth', 
        'conductor_type', 
        'cable_od', 
        'jacket_material', 
        'operating_temperature', 
        'poe_support'
      ];
      
      specsToCheck.forEach(specKey => {
        const value = (product as any)[specKey];
        if (value) {
          if (!options[specKey]) options[specKey] = [];
          if (!options[specKey].includes(value)) {
            options[specKey].push(value);
          }
        }
      });

      if (product.specifications && typeof product.specifications === 'object') {
        const specObj = product.specifications as Record<string, string>;
        Object.entries(specObj).forEach(([key, value]) => {
          const normalizedKey = key.toLowerCase().replace(/\s+/g, '_');
          if (value) {
            if (!options[normalizedKey]) options[normalizedKey] = [];
            if (!options[normalizedKey].includes(value)) {
              options[normalizedKey].push(value);
            }
          }
        });
      }
    });

    Object.keys(options).forEach(key => {
      options[key].sort();
    });

    return options;
  }, [products]);

  // Calculate global price range
  const priceRange = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;

    products.forEach((product) => {
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach((variant) => {
          const variantMin = validNumber(variant.min_price) ?? validNumber(variant.price);
          const variantMax = validNumber(variant.max_price) ?? validNumber(variant.price);
          
          if (variantMin !== undefined && Number.isFinite(variantMin)) {
            min = Math.min(min, variantMin);
          }
          if (variantMax !== undefined && Number.isFinite(variantMax)) {
            max = Math.max(max, variantMax);
          }
        });
      } else {
        const prodMin = validNumber(product.min_price) ?? validNumber(product.price);
        const prodMax = validNumber(product.max_price) ?? validNumber(product.price);
        
        if (prodMin !== undefined && Number.isFinite(prodMin)) {
          min = Math.min(min, prodMin);
        }
        if (prodMax !== undefined && Number.isFinite(prodMax)) {
          max = Math.max(max, prodMax);
        }
      }
    });

    return {
      min: min === Infinity ? 0 : Math.floor(min),
      max: max === -Infinity ? 100000 : Math.ceil(max),
    };
  }, [products]);

  // Transform API categories to the format expected by FilterPanel and types
  const transformedCategories = useMemo((): Category[] => {
    return categories.map(c => ({
      id: String(c.id),
      name: c.category_name,
      slug: createSlug(c.category_name),
      icon: '',
      description: '',
      color: '#000000',
      productCount: 0,
      featured: false,
    }));
  }, [categories]);

  // Build subcategories mapping for FilterPanel
  const subcategoriesMapping = useMemo(() => {
    const mapping: Record<string, Category[]> = {};
    categories.forEach(c => {
      if (c.subcategories && c.subcategories.length > 0) {
        mapping[String(c.id)] = c.subcategories.map(sub => ({
          id: String(sub.id),
          name: sub.subcategory_name,
          slug: createSlug(sub.subcategory_name),
          icon: '',
          description: '',
          color: '#000000',
          productCount: 0,
          featured: false,
        }));
      }
    });
    return mapping;
  }, [categories]);

  // Get available brands based on selected category and subcategory
  const availableBrands = useMemo(() => {
    let filteredBrands = brands;

    if (filters.category) {
      const categoryId = parseInt(filters.category);
      filteredBrands = filteredBrands.filter(b => b.category_id === categoryId);
    }

    if (filters.subcategory) {
      const subcategoryId = parseInt(filters.subcategory);
      filteredBrands = filteredBrands.filter(b => b.sub_category_id === subcategoryId);
    }

    return filteredBrands.map(b => ({
      id: String(b.id),
      name: b.brand_name,
      slug: createSlug(b.brand_name),
      logoText: b.brand_name.charAt(0),
      country: '',
      description: '',
      website: '',
      categoryId: String(b.category_id),
      categoryName: b.category_name,
      subCategoryId: String(b.sub_category_id),
      subCategoryName: b.sub_category_name,
    }));
  }, [brands, filters.category, filters.subcategory]);

  const transformedProducts = useMemo(() => {
    return products.map(p => transformProduct(p, categories, brands));
  }, [products, categories, brands]);

  const currentCategory = categorySlug
    ? categories.find((c) => 
        createSlug(c.category_name) === categorySlug || 
        c.category_name === categorySlug
      )
    : undefined;

  useEffect(() => {
    let categoryId = null;
    if (categorySlug) {
      const foundCategory = categories.find(c => 
        createSlug(c.category_name) === categorySlug || 
        c.category_name === categorySlug
      );
      if (foundCategory) {
        categoryId = String(foundCategory.id);
      }
    }
    
    setFilters((prev) => ({
      ...prev,
      category: categoryId,
      subcategory: null,
      search: searchQuery,
      specs: {},
      brands: [],
      minPrice: undefined,
      maxPrice: undefined,
    }));
    setCurrentPage(1);
    setTimeout(scrollToProducts, 200);
  }, [categorySlug, searchQuery, categories]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [filters]);

  // Filter products based on category, subcategory, and price
 // Filter products based on category, subcategory, and price
const filteredProducts = useMemo(() => {
  let result = transformedProducts.filter((p) => p.status === 'active');

  // Filter by category
  if (filters.category) {
    result = result.filter((p) => {
      const categoryMatch = p.categoryId === filters.category;
      const categoryNameMatch = p.categoryName.toLowerCase() === 
        categories.find(c => String(c.id) === filters.category)?.category_name?.toLowerCase();
      const productApi = products.find(api => String(api.id) === p.id);
      const variantCategoryMatch = productApi?.variants?.some(v => 
        String(v.category) === filters.category || 
        v.category === categories.find(c => String(c.id) === filters.category)?.category_name
      ) || false;
      
      return categoryMatch || categoryNameMatch || variantCategoryMatch;
    });
  }

  // Filter by subcategory
  if (filters.subcategory) {
    result = result.filter((p) => {
      const subcategoryMatch = p.subcategoryId === filters.subcategory;
      const subcategoryNameMatch = p.subcategoryName?.toLowerCase() === 
        categories
          .flatMap(c => c.subcategories || [])
          .find(s => String(s.id) === filters.subcategory)
          ?.subcategory_name?.toLowerCase();
      const productApi = products.find(api => String(api.id) === p.id);
      const variantSubcategoryMatch = productApi?.variants?.some(v => 
        String(v.sub_category) === filters.subcategory ||
        v.sub_category === categories
          .flatMap(c => c.subcategories || [])
          .find(s => String(s.id) === filters.subcategory)
          ?.subcategory_name
      ) || false;
      
      return subcategoryMatch || subcategoryNameMatch || variantSubcategoryMatch;
    });
  }

  // Filter by brands
  if (filters.brands.length > 0) {
    result = result.filter((p) => filters.brands.includes(p.brandId));
  }

  // Filter by price
  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    result = result.filter((p) => {
      const productApi = products.find(api => String(api.id) === p.id);
      if (!productApi) return false;
      
      if (productApi.variants && productApi.variants.length > 0) {
        return productApi.variants.some(variant => {
          const variantMin = validNumber(variant.min_price) ?? validNumber(variant.price);
          const variantMax = validNumber(variant.max_price) ?? validNumber(variant.price);
          
          if (variantMin !== undefined && variantMax !== undefined) {
            return variantMax >= (filters.minPrice || 0);
          }
          if (variantMin !== undefined) {
            return variantMin >= (filters.minPrice || 0);
          }
          return false;
        });
      }
      
      const price = p.maxPrice ?? p.price;
      return price >= (filters.minPrice || 0);
    });
  }
  
  if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
    result = result.filter((p) => {
      const productApi = products.find(api => String(api.id) === p.id);
      if (!productApi) return false;
      
      if (productApi.variants && productApi.variants.length > 0) {
        return productApi.variants.some(variant => {
          const variantMin = validNumber(variant.min_price) ?? validNumber(variant.price);
          const variantMax = validNumber(variant.max_price) ?? validNumber(variant.price);
          
          if (variantMin !== undefined && variantMax !== undefined) {
            return variantMin <= (filters.maxPrice || Infinity);
          }
          if (variantMax !== undefined) {
            return variantMax <= (filters.maxPrice || Infinity);
          }
          return false;
        });
      }
      
      const price = p.minPrice ?? p.price;
      return price <= (filters.maxPrice || Infinity);
    });
  }

  // Filter by specifications
  if (Object.keys(filters.specs).length > 0) {
    result = result.filter((p) => {
      const productApi = products.find(api => String(api.id) === p.id);
      if (!productApi) return true;

      let matchesAll = true;
      for (const [key, values] of Object.entries(filters.specs)) {
        if (values.length === 0) continue;
        
        if (key === 'color') {
          const hasVariantMatch = productApi.variants?.some(variant => {
            const variantColor = variant.color || variant.color_name;
            return variantColor && values.includes(variantColor);
          }) || false;
          
          if (!hasVariantMatch) {
            matchesAll = false;
            break;
          }
        } else {
          let productValue = (productApi as any)[key];
          
          if (!productValue && productApi.specifications && typeof productApi.specifications === 'object') {
            const specObj = productApi.specifications as Record<string, string>;
            const matchingKey = Object.keys(specObj).find(
              k => k.toLowerCase().replace(/\s+/g, '_') === key
            );
            if (matchingKey) {
              productValue = specObj[matchingKey];
            }
          }
          
          if (!productValue || !values.includes(productValue)) {
            matchesAll = false;
            break;
          }
        }
      }
      return matchesAll;
    });
  }

  // Search filter
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brandName.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q)
    );
  }

  // Sorting - FIXED: Handle possibly undefined reviewCount
  switch (filters.sort) {
    case 'popular':
      result = [...result].sort((a, b) => {
        // Handle possibly undefined reviewCount
        const aReviews = a.reviewCount || 0;
        const bReviews = b.reviewCount || 0;
        return Number(b.isPopular) - Number(a.isPopular) || bReviews - aReviews;
      });
      break;
    case 'az':
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'price-low':
      result = [...result].sort((a, b) => (a.minPrice ?? a.price) - (b.minPrice ?? b.price));
      break;
    case 'price-high':
      result = [...result].sort((a, b) => (b.maxPrice ?? b.price) - (a.maxPrice ?? a.price));
      break;
    default:
      result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return result;
}, [filters, transformedProducts, categories, products]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (currentPage === 0 && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setTimeout(scrollToProducts, 100);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Failed to Load Products</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Breadcrumb items={[
        { label: 'Home', path: '/' },
        { label: 'Products', path: '/products' },
        ...(currentCategory ? [{ label: currentCategory.category_name }] : [])
      ]} />

      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
          {currentCategory ? currentCategory.category_name : 'All Products'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {currentCategory
            ? `Browse ${currentCategory.category_name} products`
            : 'Browse our complete catalog of enterprise products across all categories.'}
        </p>
      </div>

      <div className="flex gap-6">
        <aside className="hidden lg:block w-72 shrink-0">
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            resultCount={filteredProducts.length}
            brands={availableBrands}
            categories={transformedCategories}
            subcategories={subcategoriesMapping}
            specOptions={specOptions}
            variantOptions={variantOptions}
            priceRange={priceRange}
          />
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
              <div className="relative flex-1 sm:max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  className="pl-9 h-9 rounded-full border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary/20"
                  value={filters.search}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Sheet open={showMobileFilter} onOpenChange={setShowMobileFilter}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden rounded-full">
                    <Filter className="w-4 h-4 mr-1.5" /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
                  <SheetTitle className="sr-only">Filters</SheetTitle>
                  <FilterPanel
                    filters={filters}
                    onFilterChange={(newFilters) => {
                      handleFilterChange(newFilters);
                      setShowMobileFilter(false);
                    }}
                    resultCount={filteredProducts.length}
                    brands={availableBrands}
                    categories={transformedCategories}
                    subcategories={subcategoriesMapping}
                    specOptions={specOptions}
                    variantOptions={variantOptions}
                    priceRange={priceRange}
                  />
                </SheetContent>
              </Sheet>
              <Select value={filters.sort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[140px] h-9 rounded-full border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="az">A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div id="products-grid" ref={productsGridRef}>
            {loading ? (
              <ProductGridSkeleton count={itemsPerPage} />
            ) : currentItems.length === 0 ? (
              <EmptyState
                icon={<Package className="w-8 h-8" />}
                title="No products found"
                description="Try adjusting your filters or search query to find what you're looking for."
                action={<Button variant="outline" onClick={handleClearFilters}>Clear Filters</Button>}
              />
            ) : (
              <>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Showing <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredProducts.length)}
                  </span> of <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {filteredProducts.length}
                  </span> products
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {currentItems.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.03, 0.3) }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-9 px-3 rounded-md"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>

                      <div className="flex items-center gap-1">
                        {getPageNumbers().map((page, index) => (
                          page === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                              …
                            </span>
                          ) : (
                            <Button
                              key={page}
                              variant={currentPage === page ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => paginate(page as number)}
                              className={`h-9 w-9 p-0 rounded-md ${
                                currentPage === page 
                                  ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                              }`}
                            >
                              {page}
                            </Button>
                          )
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="h-9 px-3 rounded-md"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}