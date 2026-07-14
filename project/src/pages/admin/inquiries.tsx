import { useState, useMemo } from 'react';
import { Search, Mail, Phone, Building, MessageSquare, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { inquiries as initialInquiries } from '@/data';
import { useApp } from '@/hooks/use-app';
import type { Inquiry, InquiryStatus } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const statusColors: Record<InquiryStatus, string> = {
  new: 'bg-blue-100 text-blue-700',
  'in-review': 'bg-yellow-100 text-yellow-700',
  responded: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700',
};

export function AdminInquiries() {
  const { inquiries: contextInquiries } = useApp();
  const [inquiries, setInquiries] = useState<Inquiry[]>([...contextInquiries, ...initialInquiries]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Inquiry | null>(null);

  const filtered = useMemo(() => {
    let result = [...inquiries];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((i) => i.name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q) || i.productName.toLowerCase().includes(q) || i.message.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') result = result.filter((i) => i.status === statusFilter);
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [inquiries, search, statusFilter]);

  const updateStatus = (inquiry: Inquiry, status: InquiryStatus) => {
    setInquiries((prev) => prev.map((i) => i.id === inquiry.id ? { ...i, status } : i));
    setSelected({ ...inquiry, status });
    toast.success(`Inquiry marked as ${status}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Inquiry Management</h2>
          <p className="text-sm text-muted-foreground">Manage customer inquiries and responses</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search inquiries..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="in-review">In Review</SelectItem>
            <SelectItem value="responded">Responded</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Product</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Message</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="p-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inquiry) => (
                <tr key={inquiry.id} className="border-b hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setSelected(inquiry)}>
                  <td className="p-3">
                    <div className="font-medium text-sm">{inquiry.name}</div>
                    <div className="text-xs text-muted-foreground">{inquiry.email}</div>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <div className="text-sm truncate max-w-[180px]">{inquiry.productName}</div>
                  </td>
                  <td className="p-3 hidden lg:table-cell">
                    <div className="text-sm text-muted-foreground truncate max-w-[200px]">{inquiry.message}</div>
                  </td>
                  <td className="p-3">
                    <Badge className={cn('text-xs', statusColors[inquiry.status])}>{inquiry.status}</Badge>
                  </td>
                  <td className="p-3 hidden md:table-cell text-sm text-muted-foreground">{new Date(inquiry.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setSelected(inquiry); }}>
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail drawer */}
      <Sheet open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <SheetContent side="right" className="w-full sm:max-w-[450px] overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>Inquiry Details</SheetTitle>
                <SheetDescription>Customer inquiry information</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm"><Building className="w-4 h-4 text-muted-foreground" /> {selected.company || 'N/A'}</div>
                  <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-muted-foreground" /> {selected.email}</div>
                  <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-muted-foreground" /> {selected.phone}</div>
                </div>

                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-1">Product Interest</div>
                  <div className="font-medium text-sm">{selected.productName}</div>
                </div>

                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Message</div>
                  <div className="text-sm">{selected.message}</div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Update Status</label>
                  <Select value={selected.status} onValueChange={(v) => updateStatus(selected, v as InquiryStatus)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in-review">In Review</SelectItem>
                      <SelectItem value="responded">Responded</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-xs text-muted-foreground">
                  Received: {new Date(selected.createdAt).toLocaleString('en-IN')}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
