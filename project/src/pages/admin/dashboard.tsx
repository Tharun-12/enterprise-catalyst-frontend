import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, FolderTree, Award, Heart, MessageSquare, TrendingUp, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { products, categories, brands, wishlistLeads, inquiries, recentActivities } from '@/data';
import { cn } from '@/lib/utils';

const leadGraphData = [
  { month: 'Jan', leads: 12, inquiries: 8 },
  { month: 'Feb', leads: 18, inquiries: 14 },
  { month: 'Mar', leads: 25, inquiries: 20 },
  { month: 'Apr', leads: 22, inquiries: 18 },
  { month: 'May', leads: 30, inquiries: 24 },
  { month: 'Jun', leads: 35, inquiries: 28 },
  { month: 'Jul', leads: 42, inquiries: 32 },
];

const categoryDistribution = categories.map((c) => ({ name: c.name, value: c.productCount, color: c.color }));

const activityIconMap: Record<string, any> = {
  product: Package, lead: Heart, inquiry: MessageSquare, category: FolderTree, brand: Award,
};

export function AdminDashboard() {
  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, change: '+12%', trend: 'up', color: 'bg-primary' },
    { label: 'Categories', value: categories.length, icon: FolderTree, change: '+2', trend: 'up', color: 'bg-secondary' },
    { label: 'Brands', value: brands.length, icon: Award, change: '+3', trend: 'up', color: 'bg-accent' },
    { label: 'Wishlist Leads', value: wishlistLeads.length, icon: Heart, change: '+8', trend: 'up', color: 'bg-green-600' },
    { label: "Today's Inquiries", value: inquiries.filter((i) => new Date(i.createdAt).toDateString() === new Date().toDateString()).length || 2, icon: MessageSquare, change: '+15%', trend: 'up', color: 'bg-purple-600' },
    { label: 'Monthly Leads', value: 42, icon: TrendingUp, change: '+20%', trend: 'up', color: 'bg-blue-600' },
  ];

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
            <Badge variant="outline" className="text-xs">2026</Badge>
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
                {categoryDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {categoryDistribution.slice(0, 4).map((c) => (
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
            {recentActivities.map((activity) => {
              const Icon = activityIconMap[activity.type] || Activity;
              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{new Date(activity.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Latest products */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Latest Products</h3>
            <Button variant="ghost" size="sm" className="text-xs">View All</Button>
          </div>
          <div className="space-y-3">
            {products.slice(-5).reverse().map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <img src={p.gallery[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.brandName}</div>
                </div>
                <Badge variant={p.status === 'active' ? 'default' : 'secondary'} className="text-[10px]">{p.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
