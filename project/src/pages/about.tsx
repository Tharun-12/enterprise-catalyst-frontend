// import { motion } from 'framer-motion';
// import { Target, Eye, Heart } from 'lucide-react';
// import { Card } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { SectionHeader } from '@/components/shared';
// import { COMPANY, COMPANY_VALUES, INDUSTRIES_SERVED, TIMELINE } from '@/constants';
// import { PageBreadcrumb as Breadcrumb } from '@/layouts/customer-layout-wrapper';

// export function AboutPage() {
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'About' }]} />

//       {/* Hero */}
//       <div className="relative bg-gradient-to-br from-primary to-[#0a3a63] text-white rounded-3xl p-8 lg:p-12 mb-12 overflow-hidden">
//         <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent/20 blur-3xl" />
//         <div className="relative max-w-2xl">
//           <Badge className="bg-white/15 text-white border-white/20 mb-4">About MVB</Badge>
//           <h1 className="text-3xl lg:text-4xl font-bold mb-4">Empowering Businesses Since {COMPANY.established}</h1>
//           <p className="text-white/80 leading-relaxed">{COMPANY.description}</p>
//         </div>
//       </div>

//       {/* Story */}
//       <section className="mb-12">
//         <div className="grid lg:grid-cols-2 gap-8 items-center">
//           <div>
//             <SectionHeader title="Our Story" subtitle="From a small office in Ahmedabad to a pan-India enterprise solutions provider." />
//             <div className="space-y-4 text-muted-foreground leading-relaxed">
//               <p>
//                 MV Business Solutions (MVB) was founded in {COMPANY.established} with a simple mission: to provide businesses with access to world-class security, power, and networking products. What started as a small distribution office in Ahmedabad has grown into a trusted enterprise solutions provider serving 500+ clients across India.
//               </p>
//               <p>
//                 Over the years, we've forged partnerships with 15+ global brands including Hikvision, Schneider Electric, Cisco, Siemens, and ABB. Our team of certified technicians and consultants has successfully delivered projects across industries — from hospitals and schools to factories and IT parks.
//               </p>
//               <p>
//                 Today, MVB stands as a single-source solution provider for enterprise security, power backup, networking, electrical, fire safety, and solar energy needs. Our commitment to quality, genuine products, and professional service has made us the preferred partner for businesses across India.
//               </p>
//             </div>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <img src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Office" className="rounded-2xl w-full h-48 object-cover shadow-lg" />
//             <img src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Team" className="rounded-2xl w-full h-48 object-cover shadow-lg mt-8" />
//             <img src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Meeting" className="rounded-2xl w-full h-48 object-cover shadow-lg" />
//             <img src="https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Work" className="rounded-2xl w-full h-48 object-cover shadow-lg mt-8" />
//           </div>
//         </div>
//       </section>

//       {/* Mission & Vision */}
//       <section className="mb-12">
//         <div className="grid md:grid-cols-2 gap-6">
//           <Card className="p-8 bg-primary text-white">
//             <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
//               <Target className="w-7 h-7 text-accent" />
//             </div>
//             <h3 className="text-xl font-bold mb-3">Our Mission</h3>
//             <p className="text-white/80 leading-relaxed">
//               To empower businesses with reliable, enterprise-grade technology solutions that enhance security, efficiency, and sustainability. We strive to be the bridge between global technology brands and Indian enterprises, delivering genuine products with professional service.
//             </p>
//           </Card>
//           <Card className="p-8 bg-secondary text-white">
//             <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
//               <Eye className="w-7 h-7 text-white" />
//             </div>
//             <h3 className="text-xl font-bold mb-3">Our Vision</h3>
//             <p className="text-white/80 leading-relaxed">
//               To become India's most trusted enterprise solutions marketplace, where businesses can discover, compare, and procure the best technology products with confidence. We envision a future where every business has access to world-class infrastructure solutions.
//             </p>
//           </Card>
//         </div>
//       </section>

//       {/* Values */}
//       <section className="mb-12">
//         <SectionHeader centered title="Our Core Values" subtitle="The principles that guide everything we do." />
//         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
//           {COMPANY_VALUES.map((value, i) => (
//             <motion.div key={value.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
//               <Card className="p-6 h-full hover:shadow-lg transition-shadow">
//                 <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
//                   <Heart className="w-5 h-5 text-accent" />
//                 </div>
//                 <h3 className="font-semibold mb-2">{value.title}</h3>
//                 <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
//               </Card>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* Industries Served */}
//       <section className="mb-12 bg-muted/30 -mx-4 px-4 py-12 rounded-3xl">
//         <div className="container mx-auto">
//           <SectionHeader centered title="Industries We Serve" subtitle="Trusted by businesses across diverse sectors." />
//           <div className="flex flex-wrap justify-center gap-3">
//             {INDUSTRIES_SERVED.map((industry, i) => (
//               <motion.div key={industry} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
//                 <Badge variant="outline" className="px-4 py-2 text-sm bg-card border-border hover:border-primary hover:text-primary transition-colors cursor-default">
//                   {industry}
//                 </Badge>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Timeline */}
//       <section>
//         <SectionHeader centered title="Our Journey" subtitle="Key milestones in our growth story." />
//         <div className="relative max-w-3xl mx-auto">
//           <div className="absolute left-4 lg:left-1/2 lg:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-border" />
//           {TIMELINE.map((item, i) => (
//             <motion.div
//               key={item.year}
//               initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: i * 0.05 }}
//               className={`relative flex gap-6 mb-8 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
//             >
//               <div className="hidden lg:block flex-1" />
//               <div className="absolute left-4 lg:left-1/2 lg:-translate-x-1/2 w-3 h-3 rounded-full bg-primary ring-4 ring-background mt-2" />
//               <div className="flex-1 lg:px-6">
//                 <Card className="p-5">
//                   <Badge className="bg-primary/10 text-primary border-0 mb-2">{item.year}</Badge>
//                   <h3 className="font-semibold mb-1">{item.title}</h3>
//                   <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
//                 </Card>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }




// pages/about.tsx (or wherever AboutPage is used)
import { AboutHero } from "@/components/AboutCompo/AboutHero";
import { AboutStory } from "@/components/AboutCompo/AboutStory";
import { AboutMissionVision } from "@/components/AboutCompo/AboutMissionVision";
import { AboutValues } from "@/components/AboutCompo/AboutValues";
import { AboutIndustries } from "@/components/AboutCompo/AboutIndustries";
import { AboutTimeline } from "@/components/AboutCompo/AboutTimeline";
import { PageBreadcrumb as Breadcrumb } from '@/layouts/customer-layout-wrapper';

export function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Home', path: '/' }, { label: 'About' }]} />
      <AboutHero />
      <AboutStory />
      <AboutMissionVision />
      <AboutValues />
      <AboutIndustries />
      <AboutTimeline />
    </div>
  );
}