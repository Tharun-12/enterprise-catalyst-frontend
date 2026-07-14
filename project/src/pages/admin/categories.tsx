import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categories as initialCategories } from '@/data';
import * as Icons from 'lucide-react';
import { toast } from 'sonner';


export function AdminCategories() {
  const [categories, setCategories] = useState(initialCategories);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<typeof initialCategories[0] | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<typeof initialCategories[0] | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const icon = formData.get('icon') as string;
    const description = formData.get('description') as string;
    if (editing) {
      setCategories((prev) => prev.map((c) => c.id === editing.id ? { ...c, name, description } : c));
      toast.success('Category updated');
    } else {
      const newCat = {
        id: `c${Date.now()}`,
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        icon: icon || 'FolderTree',
        color: '#0F4C81',
        description,
        productCount: 0,
        featured: false,
        specFields: [],
      };
      setCategories((prev) => [...prev, newCat]);
      toast.success('Category added');
    }
    setDrawerOpen(false);
    setEditing(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    toast.success('Category deleted');
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Category Management</h2>
          <p className="text-sm text-muted-foreground">Manage product categories and their specifications</p>
        </div>
        <Button onClick={() => { setEditing(null); setDrawerOpen(true); }}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const Icon = (Icons as any)[cat.icon] || Icons.FolderTree;
          return (
            <Card key={cat.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${cat.color}15` }}>
                  <Icon className="w-6 h-6" style={{ color: cat.color }} />
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(cat); setDrawerOpen(true); }}>
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(cat)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <h3 className="font-semibold mb-1">{cat.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{cat.description}</p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">{cat.productCount} products</Badge>
                <Badge variant="outline" className="text-xs">{cat.specFields.length} specs</Badge>
              </div>
            </Card>
          );
        })}
      </div>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[450px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editing ? 'Edit Category' : 'Add Category'}</SheetTitle>
            <SheetDescription>{editing ? 'Update category information' : 'Create a new product category'}</SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSave} className="space-y-4 mt-6">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name" className="text-xs">Category Name *</Label>
              <Input id="cat-name" name="name" required defaultValue={editing?.name} placeholder="e.g. CCTV & Surveillance" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat-icon" className="text-xs">Icon (Lucide icon name)</Label>
              <Select name="icon" defaultValue={editing?.icon || 'FolderTree'}>
                <SelectTrigger id="cat-icon"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['FolderTree', 'Cctv', 'Sun', 'BatteryCharging', 'Network', 'Zap', 'Flame', 'Fingerprint', 'DoorOpen', 'Shield', 'Camera'].map((ic) => (
                    <SelectItem key={ic} value={ic}>{ic}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat-desc" className="text-xs">Description</Label>
              <Textarea id="cat-desc" name="description" defaultValue={editing?.description} placeholder="Category description" className="resize-none" rows={3} />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="cat-featured" defaultChecked={editing?.featured} />
              <Label htmlFor="cat-featured" className="text-xs">Featured Category</Label>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setDrawerOpen(false)}>Cancel</Button>
              <Button type="submit" className="flex-1">{editing ? 'Save' : 'Add Category'}</Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      <Dialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>Are you sure you want to delete "{deleteTarget?.name}"? Products in this category will be uncategorized.</DialogDescription>
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
