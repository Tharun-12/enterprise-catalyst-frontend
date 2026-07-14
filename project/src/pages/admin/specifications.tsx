import { useState } from 'react';
import { Plus, Edit, Trash2, Settings2, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { categories as initialCategories } from '@/data';
import type { SpecField } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function AdminSpecifications() {
  const [categories, setCategories] = useState(initialCategories);
  const [openCategory, setOpenCategory] = useState<string | null>(categories[0]?.id || null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingField, setEditingField] = useState<SpecField | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const [deleteTarget, setDeleteTarget] = useState<{ catId: string; fieldKey: string } | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const key = (formData.get('key') as string).toLowerCase().replace(/\s+/g, '_');
    const label = formData.get('label') as string;
    const type = formData.get('type') as SpecField['type'];
    const unit = formData.get('unit') as string;
    const optionsRaw = formData.get('options') as string;
    const options = optionsRaw ? optionsRaw.split(',').map((o) => o.trim()) : undefined;

    const newField: SpecField = { key, label, type, unit: unit || undefined, options };

    setCategories((prev) => prev.map((c) => {
      if (c.id !== activeCategoryId) return c;
      const existing = editingField ? c.specFields.map((f) => f.key === editingField.key ? newField : f) : [...c.specFields, newField];
      return { ...c, specFields: existing };
    }));

    toast.success(editingField ? 'Specification updated' : 'Specification added');
    setDialogOpen(false);
    setEditingField(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setCategories((prev) => prev.map((c) => {
      if (c.id !== deleteTarget.catId) return c;
      return { ...c, specFields: c.specFields.filter((f) => f.key !== deleteTarget.fieldKey) };
    }));
    toast.success('Specification deleted');
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Specification Management</h2>
          <p className="text-sm text-muted-foreground">Manage dynamic specification fields for each category</p>
        </div>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => (
          <Collapsible key={cat.id} open={openCategory === cat.id} onOpenChange={(v) => setOpenCategory(v ? cat.id : null)}>
            <Card className="overflow-hidden">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat.color}15` }}>
                    <Settings2 className="w-5 h-5" style={{ color: cat.color }} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-sm">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground">{cat.specFields.length} specification fields</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{cat.productCount} products</Badge>
                  <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', openCategory === cat.id && 'rotate-180')} />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border-t p-4 space-y-2">
                  {cat.specFields.map((field) => (
                    <div key={field.key} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="min-w-0">
                          <div className="font-medium text-sm">{field.label}</div>
                          <div className="text-xs text-muted-foreground">
                            Key: {field.key} · Type: {field.type}{field.unit ? ` · Unit: ${field.unit}` : ''}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {field.options && <Badge variant="secondary" className="text-xs">{field.options.length} options</Badge>}
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                          setEditingField(field);
                          setActiveCategoryId(cat.id);
                          setDialogOpen(true);
                        }}>
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget({ catId: cat.id, fieldKey: field.key })}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => {
                    setEditingField(null);
                    setActiveCategoryId(cat.id);
                    setDialogOpen(true);
                  }}>
                    <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Specification Field
                  </Button>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{editingField ? 'Edit Specification' : 'Add Specification'}</DialogTitle>
            <DialogDescription>{editingField ? 'Update specification field' : 'Create a new specification field for this category'}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="spec-key" className="text-xs">Key *</Label>
                <Input id="spec-key" name="key" required defaultValue={editingField?.key} placeholder="resolution" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="spec-label" className="text-xs">Label *</Label>
                <Input id="spec-label" name="label" required defaultValue={editingField?.label} placeholder="Resolution" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="spec-type" className="text-xs">Type</Label>
                <Select name="type" defaultValue={editingField?.type || 'select'}>
                  <SelectTrigger id="spec-type"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="select">Select (Dropdown)</SelectItem>
                    <SelectItem value="boolean">Boolean (Yes/No)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="spec-unit" className="text-xs">Unit (optional)</Label>
                <Input id="spec-unit" name="unit" defaultValue={editingField?.unit} placeholder="W, kVA, mm" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="spec-options" className="text-xs">Options (comma-separated)</Label>
              <Input id="spec-options" name="options" defaultValue={editingField?.options?.join(', ')} placeholder="2MP, 4MP, 8MP" />
              <p className="text-xs text-muted-foreground">Only for select type. Separate values with commas.</p>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="flex-1">{editingField ? 'Save' : 'Add Field'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Specification</DialogTitle>
            <DialogDescription>Are you sure you want to delete this specification field?</DialogDescription>
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
