import { Outlet, Link } from 'react-router-dom';
// import { CustomerHeader, CustomerFooter, WhatsAppButton } from '@/layouts/customer-layout';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Fragment } from 'react';
import { CustomerHeader } from '@/components/customer/CustomerHeader';
import { CustomerFooter } from '@/components/customer/CustomerFooter';
import { WhatsAppButton } from '@/components/customer/WhatsAppButton';

export function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CustomerHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <CustomerFooter />
      <WhatsAppButton />
    </div>
  );
}

export function PageBreadcrumb({ items }: { items: { label: string; path?: string }[] }) {
  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        {items.map((item, idx) => (
          <Fragment key={idx}>
            <BreadcrumbItem>
              {item.path ? (
                <BreadcrumbLink asChild>
                  <Link to={item.path}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {idx < items.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}


