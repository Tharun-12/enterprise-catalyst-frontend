import { useState } from 'react';
import { Phone, Mail, MapPin, Globe, Upload, Palette, Save } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { COMPANY } from '@/constants';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function AdminSettings() {
  const [company, setCompany] = useState({
    name: COMPANY.name,
    shortName: COMPANY.shortName,
    email: COMPANY.email,
    phone: COMPANY.phone,
    whatsapp: COMPANY.whatsapp,
    address: COMPANY.address,
    workingHours: COMPANY.workingHours,
    gst: COMPANY.gst,
    description: COMPANY.description,
  });

  const [social, setSocial] = useState(COMPANY.social);
  const [theme, setTheme] = useState('primary');

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const themes = [
    { name: 'Ocean Blue', value: 'primary', color: '#0F4C81' },
    { name: 'Forest Green', value: 'green', color: '#166534' },
    { name: 'Sunset Orange', value: 'orange', color: '#C2410C' },
    { name: 'Royal Blue', value: 'blue', color: '#1E3A8A' },
    { name: 'Slate Gray', value: 'slate', color: '#334155' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage company details, social links, and preferences</p>
      </div>

      <Tabs defaultValue="company">
        <TabsList>
          <TabsTrigger value="company">Company Details</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="mt-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">MVB</div>
                <div>
                  <h3 className="font-semibold">Company Logo</h3>
                  <p className="text-xs text-muted-foreground mb-2">Upload your company logo (PNG, SVG, max 2MB)</p>
                  <Button variant="outline" size="sm">
                    <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload Logo
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="s-name" className="text-xs">Company Name</Label>
                  <Input id="s-name" value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="s-short" className="text-xs">Short Name</Label>
                  <Input id="s-short" value={company.shortName} onChange={(e) => setCompany({ ...company, shortName: e.target.value })} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="s-desc" className="text-xs">Description</Label>
                <Textarea id="s-desc" value={company.description} onChange={(e) => setCompany({ ...company, description: e.target.value })} className="resize-none" rows={3} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="s-gst" className="text-xs">GSTIN</Label>
                  <Input id="s-gst" value={company.gst} onChange={(e) => setCompany({ ...company, gst: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="s-hours" className="text-xs">Working Hours</Label>
                  <Input id="s-hours" value={company.workingHours} onChange={(e) => setCompany({ ...company, workingHours: e.target.value })} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="s-addr" className="text-xs">Address</Label>
                <Textarea id="s-addr" value={company.address} onChange={(e) => setCompany({ ...company, address: e.target.value })} className="resize-none" rows={2} />
              </div>

              <Button onClick={handleSave}><Save className="w-4 h-4 mr-1.5" /> Save Changes</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="mt-4">
          <Card className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="social-linkedin" className="text-xs flex items-center gap-1"><Globe className="w-3 h-3" /> LinkedIn</Label>
              <Input id="social-linkedin" value={social.linkedin} onChange={(e) => setSocial({ ...social, linkedin: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="social-twitter" className="text-xs">Twitter / X</Label>
              <Input id="social-twitter" value={social.twitter} onChange={(e) => setSocial({ ...social, twitter: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="social-facebook" className="text-xs">Facebook</Label>
              <Input id="social-facebook" value={social.facebook} onChange={(e) => setSocial({ ...social, facebook: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="social-youtube" className="text-xs">YouTube</Label>
              <Input id="social-youtube" value={social.youtube} onChange={(e) => setSocial({ ...social, youtube: e.target.value })} />
            </div>
            <Button onClick={handleSave}><Save className="w-4 h-4 mr-1.5" /> Save Social Links</Button>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="mt-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1 flex items-center gap-2"><Palette className="w-4 h-4" /> Theme Selection</h3>
                <p className="text-xs text-muted-foreground mb-4">Choose a primary color theme for the customer website</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {themes.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => { setTheme(t.value); toast.success(`Theme changed to ${t.name}`); }}
                    className={cn(
                      'p-4 rounded-xl border-2 transition-all text-center',
                      theme === t.value ? 'border-primary shadow-md' : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="w-12 h-12 rounded-xl mx-auto mb-2" style={{ backgroundColor: t.color }} />
                    <div className="text-xs font-medium">{t.name}</div>
                  </button>
                ))}
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm font-medium">Dark Mode</div>
                    <div className="text-xs text-muted-foreground">Enable dark mode for admin panel</div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Compact Layout</div>
                    <div className="text-xs text-muted-foreground">Reduce padding and spacing</div>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="mt-4">
          <Card className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="c-phone" className="text-xs flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</Label>
                <Input id="c-phone" value={company.phone} onChange={(e) => setCompany({ ...company, phone: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-whatsapp" className="text-xs">WhatsApp</Label>
                <Input id="c-whatsapp" value={company.whatsapp} onChange={(e) => setCompany({ ...company, whatsapp: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-email" className="text-xs flex items-center gap-1"><Mail className="w-3 h-3" /> Email</Label>
              <Input id="c-email" type="email" value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-addr" className="text-xs flex items-center gap-1"><MapPin className="w-3 h-3" /> Address</Label>
              <Textarea id="c-addr" value={company.address} onChange={(e) => setCompany({ ...company, address: e.target.value })} className="resize-none" rows={3} />
            </div>
            <Button onClick={handleSave}><Save className="w-4 h-4 mr-1.5" /> Save Contact Info</Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
