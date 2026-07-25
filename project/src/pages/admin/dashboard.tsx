import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, FolderTree, Award, Heart, MessageSquare, TrendingUp, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import axios from 'axios';

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Type definitions
interface Category {
  id: number;
  category_name: string;
  created_at: string;
  updated_at: string;
}

interface Brand {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: number;
  product_name: string;
  product_code: string;
  product_category_id: number;
  product_brand: string;
  product_details_pdf: string;
  price: string;
  dimensions: string;
  specifications: string;
  weight: string;
  discount: string;
  product_description: string;
  warranty: string;
  created_at: string;
  updated_at: string;
}

interface Wishlist {
  id: number;
  // Add other wishlist fields as needed
}

interface Inquiry {
  id: number;
  full_name: string;
  phone_number: string;
  email: string;
  company_name: string;
  product_interest: string;
  message: string;
  created_at: string;
  updated_at: string;
}

interface DashboardData {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  wishlist: Wishlist[];
  inquiries: Inquiry[];
  loading: boolean;
  error: string | null;
}

interface CategoryDistribution {
  name: string;
  value: number;
  color: string;
}

interface LeadGraphData {
  month: string;
  leads: number;
  inquiries: number;
}

interface CategoryMap {
  [key: number]: {
    name: string;
    count: number;
    color: string;
  };
}

interface CategoryColors {
  [key: string]: string;
}

export function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    products: [],
    categories: [],
    brands: [],
    wishlist: [],
    inquiries: [],
    loading: true,
    error: null
  });

  const [leadGraphData, setLeadGraphData] = useState<LeadGraphData[]>([
    { month: 'Jan', leads: 0, inquiries: 0 },
    { month: 'Feb', leads: 0, inquiries: 0 },
    { month: 'Mar', leads: 0, inquiries: 0 },
    { month: 'Apr', leads: 0, inquiries: 0 },
    { month: 'May', leads: 0, inquiries: 0 },
    { month: 'Jun', leads: 0, inquiries: 0 },
    { month: 'Jul', leads: 0, inquiries: 0 },
  ]);

  const [categoryDistribution, setCategoryDistribution] = useState<CategoryDistribution[]>([]);

  // Process category distribution for pie chart
  const processCategoryDistribution = (categories: Category[], products: Product[]) => {
    const categoryColors: CategoryColors = {
      'Artifical Intelligence': '#0F4C81',
      'Data Cabling': '#1E88E5',
      'Data Infrastructure': '#42A5F5',
      'Data Physical Security': '#64B5F6',
      'Data Security': '#90CAF9',
    };

    const categoryMap: CategoryMap = {};
    categories.forEach((cat: Category) => {
      categoryMap[cat.id] = {
        name: cat.category_name,
        count: 0,
        color: categoryColors[cat.category_name] || '#0F4C81'
      };
    });

    products.forEach((product: Product) => {
      if (product.product_category_id && categoryMap[product.product_category_id]) {
        categoryMap[product.product_category_id].count++;
      }
    });

    const distribution: CategoryDistribution[] = Object.values(categoryMap).map((item) => ({
      name: item.name,
      value: item.count,
      color: item.color
    }));

    setCategoryDistribution(distribution);
  };

  // Process lead graph data from inquiries
  const processLeadGraphData = (inquiries: Inquiry[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    // Get last 7 months
    const last7Months: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      last7Months.push(months[monthIndex]);
    }

    const monthlyData: LeadGraphData[] = last7Months.map((month) => ({
      month,
      leads: 0,
      inquiries: 0
    }));

    // Count inquiries by month
    inquiries.forEach((inquiry: Inquiry) => {
      const date = new Date(inquiry.created_at);
      const monthName = months[date.getMonth()];
      const dataPoint = monthlyData.find((d) => d.month === monthName);
      if (dataPoint) {
        dataPoint.inquiries++;
      }
    });

    // Add leads data based on inquiries (you can modify this logic)
    monthlyData.forEach((data) => {
      data.leads = data.inquiries + Math.floor(Math.random() * 5) + 2;
    });

    setLeadGraphData(monthlyData);
  };

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, categoriesRes, brandsRes, wishlistRes, inquiriesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/products/only-products`),
          axios.get(`${API_BASE_URL}/categories/`),
          axios.get(`${API_BASE_URL}/brands/`),
          axios.get(`${API_BASE_URL}/wishlist/with-all-users`),
          axios.get(`${API_BASE_URL}/inquiries`)
        ]);

        const products = productsRes.data || [];
        const categories = categoriesRes.data?.data || [];
        const brands = brandsRes.data?.data || [];
        const wishlist = wishlistRes.data?.data || [];
        const inquiries = inquiriesRes.data?.data || [];

        setDashboardData({
          products,
          categories,
          brands,
          wishlist,
          inquiries,
          loading: false,
          error: null
        });

        // Process data for category distribution chart
        processCategoryDistribution(categories, products);
        
        // Process data for lead graph (monthly inquiries)
        processLeadGraphData(inquiries);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setDashboardData((prev) => ({
          ...prev,
          loading: false,
          error: 'Failed to load dashboard data'
        }));
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate stats
  const stats = [
    { 
      label: 'Total Products', 
      value: dashboardData.products.length, 
      icon: Package, 
      change: '+12%', 
      trend: 'up' as const, 
      color: 'bg-primary' 
    },
    { 
      label: 'Categories', 
      value: dashboardData.categories.length, 
      icon: FolderTree, 
      change: '+2', 
      trend: 'up' as const, 
      color: 'bg-secondary' 
    },
    { 
      label: 'Brands', 
      value: dashboardData.brands.length, 
      icon: Award, 
      change: '+3', 
      trend: 'up' as const, 
      color: 'bg-accent' 
    },
    { 
      label: 'Wishlist Leads', 
      value: dashboardData.wishlist.length, 
      icon: Heart, 
      change: '+8', 
      trend: 'up' as const, 
      color: 'bg-green-600' 
    },
    { 
      label: "Today's Inquiries", 
      value: dashboardData.inquiries.filter((i: Inquiry) => 
        new Date(i.created_at).toDateString() === new Date().toDateString()
      ).length, 
      icon: MessageSquare, 
      change: '+15%', 
      trend: 'up' as const, 
      color: 'bg-purple-600' 
    },
    { 
      label: 'Monthly Leads', 
      value: dashboardData.inquiries.length, 
      icon: TrendingUp, 
      change: '+20%', 
      trend: 'up' as const, 
      color: 'bg-blue-600' 
    },
  ];

  // Get recent activities from inquiries
  const recentActivities = dashboardData.inquiries
    .slice(-5)
    .reverse()
    .map((inquiry: Inquiry) => ({
      id: inquiry.id,
      type: 'inquiry' as const,
      message: `New inquiry from ${inquiry.full_name} - ${inquiry.product_interest}`,
      timestamp: inquiry.created_at
    }));

  // Get latest products
  const latestProducts = dashboardData.products
    .slice(-5)
    .reverse();

  if (dashboardData.loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (dashboardData.error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-500">{dashboardData.error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-white', stat.color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={cn('flex items-center gap-0.5 text-xs font-medium', stat.trend === 'up' ? 'text-green-600' : 'text-red-600')}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </Card>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Lead graph */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Leads & Inquiries Overview</h3>
              <p className="text-xs text-muted-foreground">Monthly trend for the last 7 months</p>
            </div>
            <Badge variant="outline" className="text-xs">{new Date().getFullYear()}</Badge>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={leadGraphData}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F4C81" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0F4C81" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorInquiries" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E88E5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1E88E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
              <Area type="monotone" dataKey="leads" stroke="#0F4C81" strokeWidth={2} fill="url(#colorLeads)" name="Leads" />
              <Area type="monotone" dataKey="inquiries" stroke="#1E88E5" strokeWidth={2} fill="url(#colorInquiries)" name="Inquiries" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Category distribution */}
        <Card className="p-6">
          <h3 className="font-semibold mb-1">Category Distribution</h3>
          <p className="text-xs text-muted-foreground mb-4">Products per category</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={categoryDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                {categoryDistribution.map((entry: CategoryDistribution, index: number) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {categoryDistribution.slice(0, 4).map((c: CategoryDistribution) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-muted-foreground">{c.name}</span>
                </div>
                <span className="font-medium">{c.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent activities */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> Recent Activities</h3>
            <Button variant="ghost" size="sm" className="text-xs">View All</Button>
          </div>
          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => {
                const Icon = MessageSquare;
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(activity.timestamp).toLocaleString('en-IN', { 
                          day: 'numeric', 
                          month: 'short', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No recent activities</p>
            )}
          </div>
        </Card>

        {/* Latest products */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Latest Products</h3>
            <Button variant="ghost" size="sm" className="text-xs">View All</Button>
          </div>
          <div className="space-y-3">
            {latestProducts.length > 0 ? (
              latestProducts.map((p: Product) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{p.product_name}</div>
                    <div className="text-xs text-muted-foreground">{p.product_brand || 'No Brand'}</div>
                  </div>
                  <Badge variant="default" className="text-[10px]">Active</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No products available</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}