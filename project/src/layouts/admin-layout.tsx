import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard, Package, FolderTree, Award, Settings2, Heart,
  MessageSquare, Settings, Menu, ChevronLeft, Building2, Bell, Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ADMIN_NAV } from '@/constants';

const iconMap: Record<string, any> = {
  LayoutDashboard, Package, FolderTree, Award, Settings2, Heart,
  MessageSquare, Settings,
};

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn('flex items-center gap-3 px-4 h-16 border-b border-white/10 shrink-0', collapsed && 'justify-center')}>
        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-primary font-bold text-sm shrink-0">
          MVB
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="font-bold text-white text-sm leading-tight">MVB Admin</div>
            <div className="text-[10px] text-white/60 leading-tight">Enterprise Dashboard</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {ADMIN_NAV.map((item) => {
          const Icon = iconMap[item.icon] || Package;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                active
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/10',
                collapsed && 'justify-center'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className={cn('border-t border-white/10 p-4', collapsed && 'px-2')}>
        <Link
          to="/"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all',
            collapsed && 'justify-center'
          )}
        >
          <Building2 className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Customer Site</span>}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-foreground text-white transition-all duration-300 fixed inset-y-0 left-0 z-40',
          collapsed ? 'w-20' : 'w-64'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-foreground text-white z-50 lg:hidden">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main */}
      <div className={cn('flex-1 flex flex-col min-w-0 transition-all', collapsed ? 'lg:ml-20' : 'lg:ml-64')}>
        {/* Top bar */}
        <header className="h-16 bg-card border-b sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden lg:flex" onClick={() => setCollapsed(!collapsed)}>
              <ChevronLeft className={cn('w-5 h-5 transition-transform', collapsed && 'rotate-180')} />
            </Button>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold">
                {ADMIN_NAV.find((n) => n.path === location.pathname)?.label || 'Dashboard'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-9 h-9 bg-muted/50 border-transparent" />
              </div>
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 flex items-center justify-center text-[10px] bg-accent text-accent-foreground">
                3
              </Badge>
            </Button>
            <Avatar className="w-9 h-9">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                AD
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
