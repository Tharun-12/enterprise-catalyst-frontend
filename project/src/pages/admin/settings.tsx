import { useState, useEffect, useRef } from 'react';
import { Phone, Mail, MapPin, Globe, Upload, Save, Loader2, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface CompanySettings {
  id?: number;
  name: string;
  short_name: string;
  description: string;
  gstin: string;
  working_hours: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  youtube: string;
  instagram: string;
  logo_url: string;
}

export function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [settings, setSettings] = useState<CompanySettings>({
    name: '',
    short_name: '',
    description: '',
    gstin: '',
    working_hours: '',
    address: '',
    phone: '',
    whatsapp: '',
    email: '',
    linkedin: '',
    twitter: '',
    facebook: '',
    youtube: '',
    instagram: '',
    logo_url: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch settings on load
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/settings/');
      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySave = async () => {
    try {
      setSubmitting(true);
      const response = await fetch('http://localhost:5000/api/settings/company', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: settings.name,
          short_name: settings.short_name,
          description: settings.description,
          gstin: settings.gstin,
          working_hours: settings.working_hours,
          address: settings.address,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success('Company details saved successfully');
        fetchSettings();
      } else {
        toast.error(data.message || 'Failed to save company details');
      }
    } catch (error) {
      console.error('Error saving company details:', error);
      toast.error('Failed to save company details');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialSave = async () => {
    try {
      setSubmitting(true);
      const response = await fetch('http://localhost:5000/api/settings/social', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          linkedin: settings.linkedin,
          twitter: settings.twitter,
          facebook: settings.facebook,
          youtube: settings.youtube,
          instagram: settings.instagram,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success('Social links saved successfully');
        fetchSettings();
      } else {
        toast.error(data.message || 'Failed to save social links');
      }
    } catch (error) {
      console.error('Error saving social links:', error);
      toast.error('Failed to save social links');
    } finally {
      setSubmitting(false);
    }
  };

  const handleContactSave = async () => {
    try {
      setSubmitting(true);
      const response = await fetch('http://localhost:5000/api/settings/contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: settings.phone,
          whatsapp: settings.whatsapp,
          email: settings.email,
          address: settings.address,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success('Contact info saved successfully');
        fetchSettings();
      } else {
        toast.error(data.message || 'Failed to save contact info');
      }
    } catch (error) {
      console.error('Error saving contact info:', error);
      toast.error('Failed to save contact info');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, GIF, WEBP, or SVG)');
      e.target.value = '';
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo must be less than 2MB');
      e.target.value = '';
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('logo', file);
      
      // Also send existing settings to keep them intact
      formData.append('name', settings.name);
      formData.append('short_name', settings.short_name);
      formData.append('description', settings.description);
      formData.append('gstin', settings.gstin);
      formData.append('working_hours', settings.working_hours);
      formData.append('address', settings.address);
      formData.append('phone', settings.phone);
      formData.append('whatsapp', settings.whatsapp);
      formData.append('email', settings.email);
      formData.append('linkedin', settings.linkedin);
      formData.append('twitter', settings.twitter);
      formData.append('facebook', settings.facebook);
      formData.append('youtube', settings.youtube);
      formData.append('instagram', settings.instagram);

      const response = await fetch('http://localhost:5000/api/settings/', {
        method: 'PUT',
        body: formData,
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success('Logo uploaded successfully');
        fetchSettings();
      } else {
        toast.error(data.message || 'Failed to upload logo');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
    } finally {
      setSubmitting(false);
      e.target.value = '';
    }
  };

  const handleDeleteLogo = async () => {
    try {
      setSubmitting(true);
      const response = await fetch('http://localhost:5000/api/settings/logo', {
        method: 'DELETE',
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success('Logo deleted successfully');
        fetchSettings();
      } else {
        toast.error(data.message || 'Failed to delete logo');
      }
    } catch (error) {
      console.error('Error deleting logo:', error);
      toast.error('Failed to delete logo');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage company details, social links, and contact information</p>
      </div>

      <Tabs defaultValue="company">
        <TabsList>
          <TabsTrigger value="company">Company Details</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="mt-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <div className="relative">
                  {settings.logo_url ? (
                    <img 
                      src={`http://localhost:5000${settings.logo_url}`} 
                      alt="Company Logo" 
                      className="w-16 h-16 rounded-2xl object-cover border"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                      {settings.short_name?.charAt(0).toUpperCase() || 'C'}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Company Logo</h3>
                  <p className="text-xs text-muted-foreground mb-2">Upload your company logo (PNG, SVG, max 2MB)</p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      type="button" 
                      onClick={handleUploadClick}
                      disabled={submitting}
                    >
                      <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload Logo
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      disabled={submitting}
                    />
                    {settings.logo_url && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        type="button" 
                        onClick={handleDeleteLogo}
                        disabled={submitting}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Remove Logo
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="s-name" className="text-xs">Company Name *</Label>
                  <Input 
                    id="s-name" 
                    value={settings.name} 
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })} 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="s-short" className="text-xs">Short Name</Label>
                  <Input 
                    id="s-short" 
                    value={settings.short_name} 
                    onChange={(e) => setSettings({ ...settings, short_name: e.target.value })} 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="s-desc" className="text-xs">Description</Label>
                <Textarea 
                  id="s-desc" 
                  value={settings.description} 
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })} 
                  className="resize-none" 
                  rows={3} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="s-gst" className="text-xs">GSTIN</Label>
                  <Input 
                    id="s-gst" 
                    value={settings.gstin} 
                    onChange={(e) => setSettings({ ...settings, gstin: e.target.value })} 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="s-hours" className="text-xs">Working Hours</Label>
                  <Input 
                    id="s-hours" 
                    value={settings.working_hours} 
                    onChange={(e) => setSettings({ ...settings, working_hours: e.target.value })} 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="s-addr" className="text-xs">Address</Label>
                <Textarea 
                  id="s-addr" 
                  value={settings.address} 
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })} 
                  className="resize-none" 
                  rows={2} 
                />
              </div>

              <Button onClick={handleCompanySave} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1.5" /> Save Changes
                  </>
                )}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="mt-4">
          <Card className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="social-linkedin" className="text-xs flex items-center gap-1">
                <Globe className="w-3 h-3" /> LinkedIn
              </Label>
              <Input 
                id="social-linkedin" 
                value={settings.linkedin} 
                onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })} 
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="social-twitter" className="text-xs">Twitter / X</Label>
              <Input 
                id="social-twitter" 
                value={settings.twitter} 
                onChange={(e) => setSettings({ ...settings, twitter: e.target.value })} 
                placeholder="https://twitter.com/yourcompany"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="social-facebook" className="text-xs">Facebook</Label>
              <Input 
                id="social-facebook" 
                value={settings.facebook} 
                onChange={(e) => setSettings({ ...settings, facebook: e.target.value })} 
                placeholder="https://facebook.com/yourcompany"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="social-youtube" className="text-xs">YouTube</Label>
              <Input 
                id="social-youtube" 
                value={settings.youtube} 
                onChange={(e) => setSettings({ ...settings, youtube: e.target.value })} 
                placeholder="https://youtube.com/yourcompany"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="social-instagram" className="text-xs">Instagram</Label>
              <Input 
                id="social-instagram" 
                value={settings.instagram} 
                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })} 
                placeholder="https://instagram.com/yourcompany"
              />
            </div>
            <Button onClick={handleSocialSave} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1.5" /> Save Social Links
                </>
              )}
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="mt-4">
          <Card className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="c-phone" className="text-xs flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Phone
                </Label>
                <Input 
                  id="c-phone" 
                  value={settings.phone} 
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })} 
                  placeholder="+91 9876543210"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-whatsapp" className="text-xs">WhatsApp</Label>
                <Input 
                  id="c-whatsapp" 
                  value={settings.whatsapp} 
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })} 
                  placeholder="+91 9876543210"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-email" className="text-xs flex items-center gap-1">
                <Mail className="w-3 h-3" /> Email
              </Label>
              <Input 
                id="c-email" 
                type="email" 
                value={settings.email} 
                onChange={(e) => setSettings({ ...settings, email: e.target.value })} 
                placeholder="info@company.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-addr" className="text-xs flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Address
              </Label>
              <Textarea 
                id="c-addr" 
                value={settings.address} 
                onChange={(e) => setSettings({ ...settings, address: e.target.value })} 
                className="resize-none" 
                rows={3} 
                placeholder="123 Main Street, City, State, PINCODE"
              />
            </div>
            <Button onClick={handleContactSave} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1.5" /> Save Contact Info
                </>
              )}
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}