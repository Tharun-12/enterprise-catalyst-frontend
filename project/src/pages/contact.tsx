// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Phone, Mail, MapPin, Clock, Send, MessageSquare, Building } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { SectionHeader } from '@/components/shared';
// import { COMPANY } from '@/constants';
// import { products } from '@/data';
// import { useApp } from '@/hooks/use-app';
// import { toast } from 'sonner';
// import { PageBreadcrumb as Breadcrumb } from '@/layouts/customer-layout-wrapper';

// export function ContactPage() {
//   const { addInquiry } = useApp();
//   const [form, setForm] = useState({ name: '', phone: '', email: '', company: '', productId: '', message: '' });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!form.name || !form.phone || !form.email || !form.message) {
//       toast.error('Please fill in all required fields');
//       return;
//     }
//     const product = products.find((p) => p.id === form.productId);
//     addInquiry({
//       name: form.name,
//       phone: form.phone,
//       email: form.email,
//       company: form.company,
//       productId: form.productId || 'general',
//       productName: product?.name || 'General Inquiry',
//       message: form.message,
//     });
//     toast.success('Your inquiry has been submitted! We will contact you soon.');
//     setForm({ name: '', phone: '', email: '', company: '', productId: '', message: '' });
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Contact' }]} />
//       <SectionHeader
//         centered
//         title="Get in Touch"
//         subtitle="Have a question or need a quote? Our team is ready to help you find the right solutions for your business."
//       />

//       <div className="grid lg:grid-cols-3 gap-6 mb-8">
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
//           <Card className="p-6 text-center h-full hover:shadow-lg transition-shadow">
//             <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
//               <Phone className="w-7 h-7 text-primary" />
//             </div>
//             <h3 className="font-semibold mb-1">Call Us</h3>
//             <a href={`tel:${COMPANY.phone}`} className="text-sm text-muted-foreground hover:text-primary transition-colors block">{COMPANY.phone}</a>
//             <p className="text-xs text-muted-foreground mt-1">{COMPANY.workingHours}</p>
//           </Card>
//         </motion.div>
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
//           <Card className="p-6 text-center h-full hover:shadow-lg transition-shadow">
//             <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
//               <MessageSquare className="w-7 h-7 text-green-600" />
//             </div>
//             <h3 className="font-semibold mb-1">WhatsApp</h3>
//             <a href={`https://wa.me/${COMPANY.whatsapp.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors block">{COMPANY.whatsapp}</a>
//             <p className="text-xs text-muted-foreground mt-1">Quick responses on WhatsApp</p>
//           </Card>
//         </motion.div>
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
//           <Card className="p-6 text-center h-full hover:shadow-lg transition-shadow">
//             <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
//               <Mail className="w-7 h-7 text-accent" />
//             </div>
//             <h3 className="font-semibold mb-1">Email Us</h3>
//             <a href={`mailto:${COMPANY.email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors block">{COMPANY.email}</a>
//             <p className="text-xs text-muted-foreground mt-1">We reply within 24 hours</p>
//           </Card>
//         </motion.div>
//       </div>

//       <div className="grid lg:grid-cols-2 gap-6">
//         {/* Form */}
//         <Card className="p-6">
//           <h2 className="text-xl font-bold mb-1">Send Us an Inquiry</h2>
//           <p className="text-sm text-muted-foreground mb-5">Fill out the form below and we'll get back to you as soon as possible.</p>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="grid grid-cols-2 gap-3">
//               <div className="space-y-1.5">
//                 <Label htmlFor="c-name" className="text-xs">Name *</Label>
//                 <Input id="c-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
//               </div>
//               <div className="space-y-1.5">
//                 <Label htmlFor="c-phone" className="text-xs">Phone *</Label>
//                 <Input id="c-phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
//               </div>
//             </div>
//             <div className="space-y-1.5">
//               <Label htmlFor="c-email" className="text-xs">Email *</Label>
//               <Input id="c-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" />
//             </div>
//             <div className="grid grid-cols-2 gap-3">
//               <div className="space-y-1.5">
//                 <Label htmlFor="c-company" className="text-xs">Company</Label>
//                 <Input id="c-company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company name" />
//               </div>
//               <div className="space-y-1.5">
//                 <Label htmlFor="c-product" className="text-xs">Product Interest</Label>
//                 <Select value={form.productId} onValueChange={(v) => setForm({ ...form, productId: v })}>
//                   <SelectTrigger id="c-product"><SelectValue placeholder="Select product" /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="general">General Inquiry</SelectItem>
//                     {products.slice(0, 20).map((p) => (
//                       <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <div className="space-y-1.5">
//               <Label htmlFor="c-message" className="text-xs">Message *</Label>
//               <Textarea id="c-message" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your requirements..." className="resize-none" rows={4} />
//             </div>
//             <Button type="submit" className="w-full" size="lg">
//               <Send className="w-4 h-4 mr-2" /> Submit Inquiry
//             </Button>
//           </form>
//         </Card>

//         {/* Map & Office Info */}
//         <div className="space-y-6">
//           <Card className="p-6">
//             <h2 className="text-xl font-bold mb-4">Our Office</h2>
//             <div className="space-y-3">
//               <div className="flex items-start gap-3">
//                 <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
//                 <div>
//                   <div className="font-medium text-sm">Address</div>
//                   <p className="text-sm text-muted-foreground">{COMPANY.address}</p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-3">
//                 <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
//                 <div>
//                   <div className="font-medium text-sm">Phone</div>
//                   <a href={`tel:${COMPANY.phone}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">{COMPANY.phone}</a>
//                 </div>
//               </div>
//               <div className="flex items-start gap-3">
//                 <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
//                 <div>
//                   <div className="font-medium text-sm">Email</div>
//                   <a href={`mailto:${COMPANY.email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">{COMPANY.email}</a>
//                 </div>
//               </div>
//               <div className="flex items-start gap-3">
//                 <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
//                 <div>
//                   <div className="font-medium text-sm">Working Hours</div>
//                   <p className="text-sm text-muted-foreground">{COMPANY.workingHours}</p>
//                 </div>
//               </div>
//               <div className="flex items-start gap-3">
//                 <Building className="w-5 h-5 text-primary shrink-0 mt-0.5" />
//                 <div>
//                   <div className="font-medium text-sm">GSTIN</div>
//                   <p className="text-sm text-muted-foreground">{COMPANY.gst}</p>
//                 </div>
//               </div>
//             </div>
//           </Card>

//           {/* Map placeholder */}
//           <Card className="overflow-hidden">
//             <div className="aspect-video bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 flex items-center justify-center relative">
//               <div className="absolute inset-0 opacity-20" style={{
//                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none' stroke='%230F4C81' stroke-width='0.5'/%3E%3C/svg%3E")`
//               }} />
//               <div className="text-center relative">
//                 <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
//                 <p className="text-sm font-medium">Interactive Map</p>
//                 <p className="text-xs text-muted-foreground">{COMPANY.address}</p>
//               </div>
//             </div>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }




import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare, 
  Building,
  ArrowRight,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SectionHeader } from '@/components/shared';
import { COMPANY } from '@/constants';
import { products } from '@/data';
import { useApp } from '@/hooks/use-app';
import { toast } from 'sonner';
import { PageBreadcrumb as Breadcrumb } from '@/layouts/customer-layout-wrapper';

export function ContactPage() {
  const { addInquiry } = useApp();
  const [form, setForm] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    company: '', 
    productId: '', 
    message: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const product = products.find((p) => p.id === form.productId);
      addInquiry({
        name: form.name,
        phone: form.phone,
        email: form.email,
        company: form.company,
        productId: form.productId || 'general',
        productName: product?.name || 'General Inquiry',
        message: form.message,
      });
      toast.success('Your inquiry has been submitted! We will contact you soon.');
      setForm({ name: '', phone: '', email: '', company: '', productId: '', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactCards = [
    {
      icon: Phone,
      title: 'Call Us',
      detail: COMPANY.phone,
      sub: COMPANY.workingHours,
      href: `tel:${COMPANY.phone}`,
      gradient: 'from-pink-500/20 to-orange-500/20',
      iconBg: 'from-pink-500 to-orange-500'
    },
    {
      icon: MessageSquare,
      title: 'WhatsApp',
      detail: COMPANY.whatsapp,
      sub: 'Quick responses on WhatsApp',
      href: `https://wa.me/${COMPANY.whatsapp.replace(/\s/g, '')}`,
      gradient: 'from-orange-500/20 to-yellow-400/20',
      iconBg: 'from-orange-500 to-yellow-400'
    },
    {
      icon: Mail,
      title: 'Email Us',
      detail: COMPANY.email,
      sub: 'We reply within 24 hours',
      href: `mailto:${COMPANY.email}`,
      gradient: 'from-yellow-400/20 to-blue-600/20',
      iconBg: 'from-yellow-400 to-blue-600'
    }
  ];

  // Google Maps embed URL for P.N. Shetty Complex
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.123456789012!2d77.6160524!3d12.8678349!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae6b2f749b10e7%3A0x8fad47fa07dc98d3!2sP.N.Shetty%20Complex!5e0!3m2!1sen!2sin!4v1234567890!5m2!1sen!2sin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50/50 to-blue-50/30">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'Contact' }]} />
        
        {/* Hero Section with Gradient */}
        <div className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 p-[1px]">
          <div className="relative rounded-3xl bg-white/95 backdrop-blur-sm px-8 py-12 md:py-16">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-500/10 via-orange-500/10 to-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-500/10 via-yellow-400/10 to-blue-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
           <div className="relative flex flex-col items-center text-center">
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", stiffness: 260, damping: 20 }}
    className="mb-4 p-1 rounded-full bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600"
  >
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white">
      <Sparkles className="w-5 h-5 text-orange-500" />
    </div>
  </motion.div>
  
  <h1 className="text-4xl md:text-5xl font-bold mb-3">
    <span className="bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 bg-clip-text text-transparent">
      Get in Touch
    </span>
  </h1>
  <p className="text-lg text-muted-foreground max-w-2xl">
    Have a question or need a quote? Our team is ready to help you find the right solutions for your business.
  </p>
        </div>
          </div>
        </div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {contactCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-6 text-center h-full hover:shadow-xl transition-all duration-300 group bg-gradient-to-br ${card.gradient} border-0 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-orange-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${card.iconBg} flex items-center justify-center mx-auto mb-4 text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
                <a 
                  href={card.href} 
                  target={card.href.startsWith('http') ? '_blank' : undefined}
                  rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors block"
                >
                  {card.detail}
                </a>
                <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 bg-clip-text text-transparent">
                    Send Us an Inquiry
                  </span>
                  <ArrowRight className="w-5 h-5 text-orange-500" />
                </h2>
                <p className="text-sm text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="c-name" className="text-sm font-medium">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="c-name" 
                      required 
                      value={form.name} 
                      onChange={(e) => setForm({ ...form, name: e.target.value })} 
                      placeholder="John Doe"
                      className="focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="c-phone" className="text-sm font-medium">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="c-phone" 
                      required 
                      value={form.phone} 
                      onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                      placeholder="+91 98765 43210"
                      className="focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="c-email" className="text-sm font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="c-email" 
                    type="email" 
                    required 
                    value={form.email} 
                    onChange={(e) => setForm({ ...form, email: e.target.value })} 
                    placeholder="you@company.com"
                    className="focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="c-company" className="text-sm font-medium">Company Name</Label>
                    <Input 
                      id="c-company" 
                      value={form.company} 
                      onChange={(e) => setForm({ ...form, company: e.target.value })} 
                      placeholder="Your Company"
                      className="focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="c-product" className="text-sm font-medium">Product Interest</Label>
                    <Select value={form.productId} onValueChange={(v) => setForm({ ...form, productId: v })}>
                      <SelectTrigger id="c-product" className="focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        {products.slice(0, 20).map((p) => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="c-message" className="text-sm font-medium">
                    Your Message <span className="text-red-500">*</span>
                  </Label>
                  <Textarea 
                    id="c-message" 
                    required 
                    value={form.message} 
                    onChange={(e) => setForm({ ...form, message: e.target.value })} 
                    placeholder="Tell us about your requirements..."
                    className="resize-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    rows={5}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 hover:opacity-90 transition-opacity text-white shadow-lg shadow-orange-500/25"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" /> 
                      Submit Inquiry
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>We respect your privacy. Your information is safe with us.</span>
                </div>
              </form>
            </Card>
          </motion.div>

          {/* Office Info & Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 bg-clip-text text-transparent">
                Our Office
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Address</div>
                    <p className="text-sm text-muted-foreground">{COMPANY.address}</p>
                    <a 
                      href="https://www.google.com/maps/place/P.N.Shetty+Complex/@12.8678349,77.6160524,17z/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      <MapPin className="w-3 h-3" />
                      Open in Google Maps
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-400 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Phone</div>
                    <a href={`tel:${COMPANY.phone}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {COMPANY.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-gradient-to-r hover:from-yellow-50 hover:to-blue-50 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-yellow-400 to-blue-600 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Email</div>
                    <a href={`mailto:${COMPANY.email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {COMPANY.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-blue-50 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-pink-500 to-blue-600 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Working Hours</div>
                    <p className="text-sm text-muted-foreground">{COMPANY.workingHours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-blue-600 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">GSTIN</div>
                    <p className="text-sm text-muted-foreground">{COMPANY.gst}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Interactive Map Card */}
            <Card className="overflow-hidden shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <div className="relative aspect-video">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="P.N. Shetty Complex Location"
                  className="absolute inset-0"
                />
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-lg text-xs font-medium">
                  📍 P.N. Shetty Complex
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}