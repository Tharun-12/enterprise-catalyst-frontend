import { useState, useMemo } from 'react';
import { Search, Phone, Mail, Building, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { wishlistLeads as initialLeads } from '@/data';
import { useApp } from '@/hooks/use-app';
import type { WishlistLead, LeadStatus } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const statusColors: Record<LeadStatus, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  qualified: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700',
};

export function AdminLeads() {
  const { leads: contextLeads } = useApp();
  const [leads, setLeads] = useState<WishlistLead[]>([...contextLeads, ...initialLeads]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<WishlistLead | null>(null);

  const filtered = useMemo(() => {
    let result = [...leads];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((l) => l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.company.toLowerCase().includes(q) || l.productName.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') result = result.filter((l) => l.status === statusFilter);
    return result;
  }, [leads, search, statusFilter]);

  const updateStatus = (lead: WishlistLead, status: LeadStatus) => {
    setLeads((prev) => prev.map((l) => l.id === lead.id ? { ...l, status } : l));
    setSelectedLead({ ...lead, status });
    toast.success(`Lead marked as ${status}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Wishlist Leads</h2>
          <p className="text-sm text-muted-foreground">Manage customer leads from wishlist submissions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(['new', 'contacted', 'qualified', 'closed'] as LeadStatus[]).map((status) => {
          const count = leads.filter((l) => l.status === status).length;
          return (
            <Card key={status} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-xs text-muted-foreground capitalize">{status}</div>
                </div>
                <div className={cn('w-3 h-3 rounded-full', statusColors[status].split(' ')[0].replace('bg-', 'bg-'))} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search leads..." className="pl-9 h-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
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
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Assigned To</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="p-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="p-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-b hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => setSelectedLead(lead)}>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {lead.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">{lead.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{lead.company} · {lead.city}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <div className="text-sm truncate max-w-[200px]">{lead.productName}</div>
                  </td>
                  <td className="p-3 hidden lg:table-cell text-sm">{lead.assignedTo}</td>
                  <td className="p-3">
                    <Badge className={cn('text-xs', statusColors[lead.status])}>{lead.status}</Badge>
                  </td>
                  <td className="p-3 hidden lg:table-cell text-sm text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="sm" className="text-xs" onClick={(e) => { e.stopPropagation(); setSelectedLead(lead); }}>
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Lead detail drawer */}
      <Sheet open={!!selectedLead} onOpenChange={(v) => !v && setSelectedLead(null)}>
        <SheetContent side="right" className="w-full sm:max-w-[450px] overflow-y-auto">
          {selectedLead && (
            <>
              <SheetHeader>
                <SheetTitle>Lead Details</SheetTitle>
                <SheetDescription>Customer information and lead management</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-5">
                <div className="flex items-center gap-3">
                  <Avatar className="w-14 h-14">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {selectedLead.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedLead.name}</h3>
                    <Badge className={cn('text-xs mt-1', statusColors[selectedLead.status])}>{selectedLead.status}</Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-muted-foreground" /> {selectedLead.phone}</div>
                  <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-muted-foreground" /> {selectedLead.email}</div>
                  <div className="flex items-center gap-2 text-sm"><Building className="w-4 h-4 text-muted-foreground" /> {selectedLead.company}</div>
                  <div className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4 text-muted-foreground" /> {selectedLead.city}</div>
                </div>

                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-1">Product Interest</div>
                  <div className="font-medium text-sm">{selectedLead.productName}</div>
                </div>

                {selectedLead.remarks && (
                  <div className="p-4 rounded-lg bg-muted/30">
                    <div className="text-xs text-muted-foreground mb-1">Remarks</div>
                    <div className="text-sm">{selectedLead.remarks}</div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-xs">Update Status</Label>
                  <Select value={selectedLead.status} onValueChange={(v) => updateStatus(selectedLead, v as LeadStatus)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="lead-notes" className="text-xs">Internal Notes</Label>
                  <Textarea id="lead-notes" placeholder="Add notes about this lead..." className="resize-none" rows={3} defaultValue={selectedLead.notes} />
                </div>

                <div className="text-xs text-muted-foreground">
                  Created: {new Date(selectedLead.createdAt).toLocaleString('en-IN')}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
