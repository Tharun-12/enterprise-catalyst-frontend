import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { brands as initialBrands } from '@/data';
import { toast } from 'sonner';

export function AdminBrands() {
  const [brands, setBrands] = useState(initialBrands);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<typeof initialBrands[0] | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<typeof initialBrands[0] | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const country = formData.get('country') as string;
    const description = formData.get('description') as string;
    const website = formData.get('website') as string;
    const logoText = formData.get('logoText') as string;
    if (editing) {
      setBrands((prev) => prev.map((b) => b.id === editing.id ? { ...b, name, country, description, website, logoText } : b));
      toast.success('Brand updated');
    } else {
      const newBrand = {
        id: `b${Date.now()}`,
        name, country, description, website, logoText,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        productCount: 0,
      };
      setBrands((prev) => [...prev, newBrand]);
      toast.success('Brand added');
    }
    setDrawerOpen(false);
    setEditing(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setBrands((prev) => prev.filter((b) => b.id !== deleteTarget.id));
    toast.success('Brand deleted');
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Brand Management</h2>
          <p className="text-sm text-muted-foreground">Manage OEM brand partners and logos</p>
        </div>
        <Button onClick={() => { setEditing(null); setDrawerOpen(true); }}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Brand
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {brands.map((brand) => (
          <Card key={brand.id} className="p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-14 h-14 rounded-xl bg-primary/5 border flex items-center justify-center shrink-0">
                <span className="font-bold text-sm text-primary text-center px-1">{brand.logoText}</span>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(brand); setDrawerOpen(true); }}>
                  <Edit className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(brand)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
            <h3 className="font-semibold mb-1">{brand.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{brand.description}</p>
            <div className="flex items-center justify-between text-xs">
              <Badge variant="secondary">{brand.country}</Badge>
              <span className="text-muted-foreground">{brand.productCount} products</span>
            </div>
          </Card>
        ))}
      </div>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[450px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editing ? 'Edit Brand' : 'Add Brand'}</SheetTitle>
            <SheetDescription>{editing ? 'Update brand information' : 'Add a new OEM brand partner'}</SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSave} className="space-y-4 mt-6">
            <div className="space-y-1.5">
              <Label htmlFor="b-name" className="text-xs">Brand Name *</Label>
              <Input id="b-name" name="name" required defaultValue={editing?.name} placeholder="e.g. Hikvision" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="b-logo" className="text-xs">Logo Text</Label>
              <Input id="b-logo" name="logoText" defaultValue={editing?.logoText} placeholder="HIKVISION" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="b-country" className="text-xs">Country</Label>
                <Input id="b-country" name="country" defaultValue={editing?.country} placeholder="China" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="b-website" className="text-xs">Website</Label>
                <Input id="b-website" name="website" defaultValue={editing?.website} placeholder="hikvision.com" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="b-desc" className="text-xs">Description</Label>
              <Textarea id="b-desc" name="description" defaultValue={editing?.description} placeholder="Brand description" className="resize-none" rows={3} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Logo Upload</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
                <p className="text-xs text-muted-foreground">Click to upload logo (PNG, SVG)</p>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setDrawerOpen(false)}>Cancel</Button>
              <Button type="submit" className="flex-1">{editing ? 'Save' : 'Add Brand'}</Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      <Dialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Brand</DialogTitle>
            <DialogDescription>Are you sure you want to delete "{deleteTarget?.name}"?</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" className="flex-1" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
