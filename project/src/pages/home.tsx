// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import {
//   ArrowRight, Star, Quote, Phone, Mail, MapPin,
//   ShieldCheck, Users, BadgeCheck, Award, UserCheck,
//   Ruler, Wrench, ClipboardCheck, GraduationCap, Headphones, ChevronRight
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { SectionHeader } from '@/components/shared';
// import { ProductCard } from '@/components/product-card';
// import { COMPANY, SERVICES, WHY_CHOOSE_US } from '@/constants';
// import { categories, brands, products, testimonials } from '@/data';
// import { cn } from '@/lib/utils';



// const iconMap: Record<string, any> = {
//   Ruler, Wrench, ShieldCheck, ClipboardCheck, GraduationCap, Headphones,
//   Award, Users, BadgeCheck, MapPin, UserCheck,
// };

// export function HomePage() {
//   const featuredProducts = products.filter((p) => p.isPopular).slice(0, 8);
//   const featuredCategories = categories.filter((c) => c.featured);

//   return (
//     <div>
//       {/* Hero */}
//       <section className="relative bg-gradient-to-br from-primary via-primary to-[#0a3a63] text-white overflow-hidden">
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-accent blur-3xl" />
//           <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-secondary blur-3xl" />
//         </div>
//         <div className="container mx-auto px-4 py-20 lg:py-28 relative">
//           <div className="max-w-3xl">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               <Badge className="bg-white/15 text-white border-white/20 mb-4 hover:bg-white/20">
//                 Enterprise E-Catalog Platform
//               </Badge>
//               <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-5">
//                 Enterprise Solutions for a <span className="text-accent">Connected</span> World
//               </h1>
//               <p className="text-lg text-white/80 mb-8 max-w-2xl leading-relaxed">
//                 {COMPANY.description}
//               </p>
//               <div className="flex flex-wrap gap-3">
//                 <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
//                   <Link to="/products">
//                     Explore Products <ArrowRight className="w-4 h-4 ml-2" />
//                   </Link>
//                 </Button>
//                 <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white">
//                   <Link to="/categories">Browse Categories</Link>
//                 </Button>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//         {/* Stats bar */}
//         <div className="border-t border-white/10 bg-white/5 backdrop-blur-sm">
//           <div className="container mx-auto px-4 py-6">
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//               {[
//                 { label: 'Products', value: '150+' },
//                 { label: 'Categories', value: '8' },
//                 { label: 'Premium Brands', value: '15+' },
//                 { label: 'Happy Clients', value: '500+' },
//               ].map((stat, i) => (
//                 <motion.div
//                   key={stat.label}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 0.2 + i * 0.1 }}
//                   className="text-center lg:text-left"
//                 >
//                   <div className="text-2xl lg:text-3xl font-bold text-accent">{stat.value}</div>
//                   <div className="text-xs text-white/60 uppercase tracking-wider">{stat.label}</div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Company Introduction */}
//       <section className="py-16 lg:py-20">
//         <div className="container mx-auto px-4">
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <div>
//               <Badge className="bg-primary/10 text-primary border-0 mb-3">About MVB</Badge>
//               <h2 className="text-2xl lg:text-3xl font-bold mb-4">Your Trusted Partner in Enterprise Solutions</h2>
//               <p className="text-muted-foreground leading-relaxed mb-4">
//                 Established in {COMPANY.established}, MV Business Solutions has grown to become one of India's leading providers of security, power, networking, and electrical solutions. We serve businesses of all sizes — from small offices to large industrial complexes.
//               </p>
//               <p className="text-muted-foreground leading-relaxed mb-6">
//                 As authorized partners of 15+ global brands including Hikvision, Schneider Electric, Cisco, and Siemens, we bring you genuine products with full manufacturer warranty. Our certified technicians ensure professional installation and ongoing support.
//               </p>
//               <div className="grid grid-cols-3 gap-4">
//                 {[
//                   { value: '15+', label: 'Years Experience' },
//                   { value: '500+', label: 'Projects Done' },
//                   { value: '24/7', label: 'Support' },
//                 ].map((s) => (
//                   <div key={s.label} className="text-center p-4 rounded-xl bg-muted/50">
//                     <div className="text-2xl font-bold text-primary">{s.value}</div>
//                     <div className="text-xs text-muted-foreground">{s.label}</div>
//                   </div>
//                 ))}
//               </div>
//               <Button asChild className="mt-6">
//                 <Link to="/about">Learn More About Us <ArrowRight className="w-4 h-4 ml-2" /></Link>
//               </Button>
//             </div>
//             <div className="relative">
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-4">
//                   <img src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Team" className="rounded-2xl w-full h-48 object-cover shadow-lg" />
//                   <img src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Office" className="rounded-2xl w-full h-64 object-cover shadow-lg" />
//                 </div>
//                 <div className="space-y-4 pt-8">
//                   <img src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Meeting" className="rounded-2xl w-full h-64 object-cover shadow-lg" />
//                   <img src="https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Work" className="rounded-2xl w-full h-48 object-cover shadow-lg" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Services */}
//       <section className="py-16 lg:py-20 bg-muted/30">
//         <div className="container mx-auto px-4">
//           <SectionHeader
//             centered
//             title="Our Business Services"
//             subtitle="Comprehensive end-to-end solutions from consultation to maintenance, backed by certified expertise."
//           />
//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
//             {SERVICES.map((service, i) => {
//               const Icon = iconMap[service.icon] || ShieldCheck;
//               return (
//                 <motion.div
//                   key={service.title}
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: i * 0.05 }}
//                 >
//                   <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 h-full group">
//                     <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
//                       <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
//                     </div>
//                     <h3 className="font-semibold mb-2">{service.title}</h3>
//                     <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
//                   </Card>
//                 </motion.div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* Featured Categories */}
//       <section className="py-16 lg:py-20">
//         <div className="container mx-auto px-4">
//           <SectionHeader
//             centered
//             title="Featured Categories"
//             subtitle="Explore our comprehensive range of enterprise product categories."
//             action={<Button asChild variant="outline" size="sm"><Link to="/categories">View All <ChevronRight className="w-4 h-4 ml-1" /></Link></Button>}
//           />
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
//             {featuredCategories.map((cat, i) => {
//               const Icon = iconMap[cat.icon] || ShieldCheck;
//               return (
//                 <motion.div
//                   key={cat.id}
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   whileInView={{ opacity: 1, scale: 1 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: i * 0.05 }}
//                 >
//                   <Link to={`/products?category=${cat.slug}`}>
//                     <Card className="p-5 hover:shadow-lg transition-all hover:-translate-y-1 h-full group text-center">
//                       <div
//                         className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110"
//                         style={{ backgroundColor: `${cat.color}15` }}
//                       >
//                         <Icon className="w-7 h-7" style={{ color: cat.color }} />
//                       </div>
//                       <h3 className="font-semibold text-sm mb-1">{cat.name}</h3>
//                       <p className="text-xs text-muted-foreground">{cat.productCount} products</p>
//                     </Card>
//                   </Link>
//                 </motion.div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* Featured Products */}
//       <section className="py-16 lg:py-20 bg-muted/30">
//         <div className="container mx-auto px-4">
//           <SectionHeader
//             centered
//             title="Featured Products"
//             subtitle="Popular products chosen by our enterprise clients across various industries."
//             action={<Button asChild variant="outline" size="sm"><Link to="/products">View All <ChevronRight className="w-4 h-4 ml-1" /></Link></Button>}
//           />
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//             {featuredProducts.map((product, i) => (
//               <motion.div
//                 key={product.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: i * 0.05 }}
//               >
//                 <ProductCard product={product} />
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Trusted Brands */}
//       <section className="py-16 lg:py-20">
//         <div className="container mx-auto px-4">
//           <SectionHeader centered title="Trusted Brands We Partner With" subtitle="Authorized distributor of world-leading technology brands." />
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
//             {brands.map((brand) => (
//               <Card key={brand.id} className="p-6 flex flex-col items-center justify-center hover:shadow-md transition-all h-28">
//                 <div className="font-bold text-lg text-center" style={{ color: '#0F4C81' }}>{brand.logoText}</div>
//                 <div className="text-xs text-muted-foreground mt-1">{brand.country}</div>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Why Choose Us */}
//       <section className="py-16 lg:py-20 bg-primary text-white">
//         <div className="container mx-auto px-4">
//           <SectionHeader centered title="Why Choose MVB?" subtitle="Trusted by 500+ enterprises across India for our expertise and service quality." className="[&_h2]:text-white [&_p]:text-white/70" />
//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
//             {WHY_CHOOSE_US.map((item, i) => {
//               const Icon = iconMap[item.icon] || ShieldCheck;
//               return (
//                 <motion.div
//                   key={item.title}
//                   initial={{ opacity: 0, y: 20 }}
//                   whileInView={{ opacity: 1, y: 0 }}
//                   viewport={{ once: true }}
//                   transition={{ delay: i * 0.05 }}
//                   className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-colors"
//                 >
//                   <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
//                     <Icon className="w-6 h-6 text-accent" />
//                   </div>
//                   <h3 className="font-semibold mb-2">{item.title}</h3>
//                   <p className="text-sm text-white/70 leading-relaxed">{item.description}</p>
//                 </motion.div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="py-16 lg:py-20">
//         <div className="container mx-auto px-4">
//           <div className="relative bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 lg:p-12 text-white overflow-hidden">
//             <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent/20 blur-3xl" />
//             <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
//               <div className="max-w-xl">
//                 <h2 className="text-2xl lg:text-3xl font-bold mb-3">Ready to Transform Your Business?</h2>
//                 <p className="text-white/80">Get expert consultation from our team. We'll help you choose the right products and solutions for your specific requirements.</p>
//               </div>
//               <div className="flex flex-col sm:flex-row gap-3 shrink-0">
//                 <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
//                   <Link to="/contact">Get a Quote <ArrowRight className="w-4 h-4 ml-2" /></Link>
//                 </Button>
//                 <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white">
//                   <a href={`tel:${COMPANY.phone}`}>Call Now</a>
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Testimonials */}
//       <section className="py-16 lg:py-20 bg-muted/30">
//         <div className="container mx-auto px-4">
//           <SectionHeader centered title="What Our Clients Say" subtitle="Real feedback from businesses we've helped grow with our solutions." />
//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
//             {testimonials.map((t, i) => (
//               <motion.div
//                 key={t.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: i * 0.05 }}
//               >
//                 <Card className="p-6 h-full flex flex-col">
//                   <Quote className="w-8 h-8 text-primary/20 mb-3" />
//                   <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{t.message}</p>
//                   <div className="flex items-center gap-1 mb-3">
//                     {[1, 2, 3, 4, 5].map((s) => (
//                       <Star key={s} className={cn('w-4 h-4', s <= t.rating ? 'text-accent fill-accent' : 'text-muted-foreground/30')} />
//                     ))}
//                   </div>
//                   <div className="flex items-center gap-3 pt-3 border-t">
//                     <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
//                     <div>
//                       <div className="font-semibold text-sm">{t.name}</div>
//                       <div className="text-xs text-muted-foreground">{t.role} · {t.company}</div>
//                     </div>
//                   </div>
//                 </Card>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Contact Info */}
//       <section className="py-16 lg:py-20">
//         <div className="container mx-auto px-4">
//           <div className="grid lg:grid-cols-3 gap-5">
//             <Card className="p-6 flex items-start gap-4">
//               <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
//                 <MapPin className="w-6 h-6 text-primary" />
//               </div>
//               <div>
//                 <h3 className="font-semibold mb-1">Visit Us</h3>
//                 <p className="text-sm text-muted-foreground">{COMPANY.address}</p>
//               </div>
//             </Card>
//             <Card className="p-6 flex items-start gap-4">
//               <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
//                 <Phone className="w-6 h-6 text-primary" />
//               </div>
//               <div>
//                 <h3 className="font-semibold mb-1">Call Us</h3>
//                 <a href={`tel:${COMPANY.phone}`} className="text-sm text-muted-foreground hover:text-primary transition-colors block">{COMPANY.phone}</a>
//                 <p className="text-sm text-muted-foreground">{COMPANY.workingHours}</p>
//               </div>
//             </Card>
//             <Card className="p-6 flex items-start gap-4">
//               <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
//                 <Mail className="w-6 h-6 text-primary" />
//               </div>
//               <div>
//                 <h3 className="font-semibold mb-1">Email Us</h3>
//                 <a href={`mailto:${COMPANY.email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">{COMPANY.email}</a>
//               </div>
//             </Card>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }







import { CompanyIntroSection } from "@/components/HomeCompo/CompanyIntroSection";
import { CTASection } from "@/components/HomeCompo/CTASection";
import { FeaturedCategoriesSection } from "@/components/HomeCompo/FeaturedCategoriesSection";
import { FeaturedProductsSection } from "@/components/HomeCompo/FeaturedProductsSection";
import { HeroSection } from "@/components/HomeCompo/HeroSection";
import { ContactInfoSection } from "@/components/HomeCompo/infrosection";
import { ServicesSection } from "@/components/HomeCompo/ServicesSection";
import { TestimonialsSection } from "@/components/HomeCompo/TestimonialsSection";
import { TrustedBrandsSection } from "@/components/HomeCompo/TrustedBrandsSection";
import { WhyChooseUsSection } from "@/components/HomeCompo/WhyChooseUsSection";

export function HomePage() {
  return (
    <div>
      <HeroSection />
      <CompanyIntroSection />
      <ServicesSection />
      <FeaturedCategoriesSection />
      <FeaturedProductsSection />
      <TrustedBrandsSection />
      <WhyChooseUsSection />
      <CTASection />
      <TestimonialsSection />
      <ContactInfoSection />
    </div>
  );
}