import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import { AdminLogin } from '@/pages/admin/login';
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
import { BrandForm } from '@/pages/admin/brand-form';

import { RegisterPage } from '@/pages/auth/Register';
import { LoginPage } from '@/pages/auth/Login';

// Protected Route component - checks if admin exists in localStorage
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
  const adminId = localStorage.getItem('adminId');
  
  // Check if both auth flag and admin ID exist
  if (!isAuthenticated || !adminId) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
            {/* Auth routes */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

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
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            {/* Dashboard - Changed to use path="dashboard" instead of index */}
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/add" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="categories/add" element={<CategoryForm />} />
            <Route path="categories/add/:id" element={<CategoryForm />} />
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