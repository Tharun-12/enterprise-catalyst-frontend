import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/hooks/use-app';
import { Toaster } from 'sonner';
import { CustomerLayout } from '@/layouts/customer-layout-wrapper';
import { AdminLayout } from '@/layouts/admin-layout';
import { HomePage } from '@/pages/home';
import { CategoriesPage } from '@/pages/categories';
import { ProductsPage } from '@/pages/products';
import { ProductDetailsPage } from '@/pages/product-details';
import { ComparePage } from '@/pages/compare';
import { WishlistPage } from '@/pages/wishlist';
import { ContactPage } from '@/pages/contact';
import { AboutPage } from '@/pages/about';
import { NotFoundPage } from '@/pages/not-found';
import { AdminDashboard } from '@/pages/admin/dashboard';
import { AdminProducts } from '@/pages/admin/products';
import { ProductForm } from '@/pages/admin/product-form';
import { AdminCategories } from '@/pages/admin/categories';
import { CategoryForm } from '@/pages/admin/categories-form';
import { AdminBrands } from '@/pages/admin/brands';
import { AdminSpecifications } from '@/pages/admin/specifications';
import { AdminLeads } from '@/pages/admin/leads';
import { AdminInquiries } from '@/pages/admin/inquiries';
import { AdminSettings } from '@/pages/admin/settings';
import { BrandForm } from './pages/admin/brand-form';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Customer routes */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetailsPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/add" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />

              {/* Categories Routes */}
            <Route path="categories" element={<AdminCategories />} />
             <Route path="categories/add" element={<CategoryForm />} />
            <Route path="categories/add/:id" element={<CategoryForm />} />
              {/* Brands Routes */}
            <Route path="brands" element={<AdminBrands />} />
            <Route path="brands/add" element={<BrandForm />} />
            <Route path="brands/add/:id" element={<BrandForm />} />

            <Route path="specifications" element={<AdminSpecifications />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
    </AppProvider>
  );
}
