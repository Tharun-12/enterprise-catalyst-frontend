import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/shared';
import { ProductCard } from '@/components/product-card';
import { baseurl } from "@/Baseurl/baseurl";
import type { Product, Category, Brand } from '@/types';

// ---- Raw API response shapes ----
interface ApiCategory {
  id: number;
  category_name: string;
  created_at: string;
  updated_at: string;
}

interface ApiBrand {
  id: number;
  brand_name: string;
  description: string;
  product_series: string;
  conductor_type: string;
  cable_od: string;
  jacket_material: string;
  bandwidth: string;
  operating_temperature: string;
  poe_support: string;
  category_id: number;
  category_name: string;
  created_at: string;
  updated_at: string;
}

interface ApiVariant {
  id: number;
  product_id: number;
  color_name?: string;
  color_hex?: string;
  price: string;
  stock: number;
  image_url: string;
  variant_name?: string;
  part_code?: string;
  category?: string;
  brand?: string;
  description?: string;
  spec_type?: string;
  color?: string;
  size?: string;
  availability?: string;
  datasheet_url?: string;
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
  specifications?: string;
  weight?: string;
  discount: string;
  product_description: string;
  warranty: string;
  created_at: string;
  updated_at: string;
  category_name?: string;
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

// Helper function to create slug
const createSlug = (name: string): string => {
  if (!name) return '';
  return name.toLowerCase().replace(/\s+/g, '-');
};

// ---- Transform API product into the app-wide `Product` type ----
const transformProduct = (
  product: ApiProduct,
  categories: ApiCategory[],
  brands: ApiBrand[]
): Product => {
  const category = categories.find(c => c.id === product.product_category_id);
  const brand = brands.find(b => b.brand_name === product.product_brand);

  const galleryImages = product.variants?.map(v =>
    v.image_url ? `${baseurl}${v.image_url}` : null
  ).filter(Boolean) as string[] || [];

  const defaultImage = 'https://via.placeholder.com/400x400';
  const gallery = galleryImages.length > 0 ? galleryImages : [defaultImage];

  const priceNum = parseFloat(product.price) || 0;
  const discountNum = parseFloat(product.discount || '0');
  
  // Parse min and max prices from API
  const minPrice = product.min_price ? parseFloat(product.min_price) : undefined;
  const maxPrice = product.max_price ? parseFloat(product.max_price) : undefined;

  return {
    id: String(product.id),
    name: product.product_name,
    slug: product.product_name.toLowerCase().replace(/\s+/g, '-'),
    sku: product.product_code,
    brandId: String(brand?.id ?? 'unknown'),
    brandName: brand?.brand_name || product.product_brand || 'Unknown',
    categoryId: String(product.product_category_id),
    categoryName: category?.category_name || product.category_name || 'Uncategorized',
    shortDescription: product.product_description?.substring(0, 150) || '',
    description: product.product_description || '',
    gallery,
    features: product.specifications?.split(',').map(s => s.trim()).filter(Boolean) || [],
    specifications: {},
    currency: 'INR',
    relatedProductIds: [],
    specGroups: [
      {
        groupName: 'Specifications',
        fields: [
          { key: 'dimensions', label: 'Dimensions', value: product.dimensions || 'N/A' },
          { key: 'weight', label: 'Weight', value: product.weight ? `${product.weight} kg` : 'N/A' },
          { key: 'specifications', label: 'Specifications', value: product.specifications || 'N/A' },
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
    isPopular: true, // Set to true for featured products
    isNew: false,
    rating: 4.5,
    reviewCount: 0,
    downloads: product.product_details_pdf
      ? [{ name: 'Product Details', type: 'pdf' as const, size: 'PDF', url: product.product_details_pdf }]
      : [],
    createdAt: product.created_at,
    warranty: product.warranty || 'Standard warranty',
    variants: product.variants?.map(v => ({
      id: v.id,
      color_name: v.color_name || v.color || 'Default',
      color_hex: v.color_hex || '#000000',
      price: v.price,
      stock: v.stock,
      image_url: v.image_url,
    })),
    hasVariants: (product.variants?.length || 0) > 0,
    stock: product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0,
  };
};

export function FeaturedProductsSection() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch categories
        const categoriesRes = await fetch(`${baseurl}/api/categories/`);
        const categoriesData = await categoriesRes.json();
        if (!categoriesData.success) throw new Error('Failed to fetch categories');
        setCategories(categoriesData.data);

        // Fetch brands
        const brandsRes = await fetch(`${baseurl}/api/brands/`);
        const brandsData = await brandsRes.json();
        if (!brandsData.success) throw new Error('Failed to fetch brands');
        setBrands(brandsData.data);

        // Fetch products
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

  // Transform products
  const transformedProducts = products.map(p => transformProduct(p, categories, brands));
  
  // Get featured products (first 8 or all if less than 8)
  const featuredProducts = transformedProducts.slice(0, 8);

  // Loading state
  if (loading) {
    return (
      <section className="py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionHeader
            centered
            title="Featured Products"
            subtitle="Popular products chosen by our enterprise clients across various industries."
            action={<Button asChild variant="outline" size="sm"><Link to="/products">View All <ChevronRight className="w-4 h-4 ml-1" /></Link></Button>}
          />
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionHeader
            centered
            title="Featured Products"
            subtitle="Popular products chosen by our enterprise clients across various industries."
            action={<Button asChild variant="outline" size="sm"><Link to="/products">View All <ChevronRight className="w-4 h-4 ml-1" /></Link></Button>}
          />
          <div className="text-center py-20">
            <p className="text-red-600 text-lg">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  // If no products
  if (products.length === 0) {
    return (
      <section className="py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionHeader
            centered
            title="Featured Products"
            subtitle="Popular products chosen by our enterprise clients across various industries."
            action={<Button asChild variant="outline" size="sm"><Link to="/products">View All <ChevronRight className="w-4 h-4 ml-1" /></Link></Button>}
          />
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No products found</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          centered
          title="Featured Products"
          subtitle="Popular products chosen by our enterprise clients across various industries."
          action={
            <Button asChild variant="outline" size="sm" className="rounded-full">
              <Link to="/products" className="flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {featuredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="h-full"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}