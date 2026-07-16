// import { motion } from 'framer-motion';
// import { Card } from '@/components/ui/card';
// import { SectionHeader } from '@/components/shared';
// import { SERVICES } from '@/constants';
// import {
//   Ruler, Wrench, ShieldCheck, ClipboardCheck, GraduationCap, Headphones,
//   Award, Users, BadgeCheck, MapPin, UserCheck
// } from 'lucide-react';

// const iconMap: Record<string, any> = {
//   Ruler, Wrench, ShieldCheck, ClipboardCheck, GraduationCap, Headphones,
//   Award, Users, BadgeCheck, MapPin, UserCheck,
// };

// export function ServicesSection() {
//   return (
//     <section className="py-16 lg:py-20 bg-muted/30">
//       <div className="container mx-auto px-4">
//         <SectionHeader
//           centered
//           title="Our Business Services"
//           subtitle="Comprehensive end-to-end solutions from consultation to maintenance, backed by certified expertise."
//         />
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
//           {SERVICES.map((service, i) => {
//             const Icon = iconMap[service.icon] || ShieldCheck;
//             return (
//               <motion.div
//                 key={service.title}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: i * 0.05 }}
//               >
//                 <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 h-full group">
//                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
//                     <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
//                   </div>
//                   <h3 className="font-semibold mb-2">{service.title}</h3>
//                   <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
//                 </Card>
//               </motion.div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }


import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { SectionHeader } from '@/components/shared';
import { ArrowRight } from 'lucide-react';

// Define the services data directly in the component with the correct text
const SERVICES_DATA = [
  {
    title: "System Design & Consulting",
    description: "Expert consultation for designing end-to-end security, power, and networking systems tailored to your business needs.",
    icon: "Ruler"
  },
  {
    title: "Installation & Commissioning",
    description: "Professional installation and commissioning services by certified technicians across all product categories.",
    icon: "Wrench"
  },
  {
    title: "AMC & Maintenance",
    description: "Comprehensive Annual Maintenance Contracts to keep your systems running at peak performance year-round.",
    icon: "ShieldCheck"
  },
  {
    title: "Site Survey & Audit",
    description: "Thorough site assessment and technical audit to recommend optimal solutions for your infrastructure.",
    icon: "ClipboardCheck"
  },
  {
    title: "Technical Training",
    description: "Hands-on training programs for your team on product installation, operation, and maintenance procedures.",
    icon: "GraduationCap"
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock technical support and quick-response service for all your business needs.",
    icon: "Headphones"
  }
];

// Icon mapping
const iconMap: Record<string, any> = {
  Ruler: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.5 3.5L2.5 20.5" />
      <path d="M21.5 7.5L17.5 11.5" />
      <path d="M15.5 3.5L10.5 8.5" />
    </svg>
  ),
  Wrench: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  ShieldCheck: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  ClipboardCheck: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M9 14l2 2 4-4" />
    </svg>
  ),
  GraduationCap: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  ),
  Headphones: (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  ),
};

// Gradient color pairs for each card
const gradientColors = [
  'from-blue-500/10 to-cyan-500/10',
  'from-purple-500/10 to-pink-500/10',
  'from-emerald-500/10 to-teal-500/10',
  'from-orange-500/10 to-amber-500/10',
  'from-red-500/10 to-rose-500/10',
  'from-indigo-500/10 to-violet-500/10',
];

export function ServicesSection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: 'url("https://i.pinimg.com/originals/88/15/63/881563d6444b370fa4ceea0c3183bb4c.gif")',
          }}
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
      </div>

      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-gradient-to-l from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader
          centered
          title="Our Business Services"
          subtitle="Comprehensive end-to-end solutions from consultation to maintenance, backed by certified expertise."
          className="mb-12"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {SERVICES_DATA.map((service, i) => {
            const Icon = iconMap[service.icon] || iconMap.ShieldCheck;
            const gradient = gradientColors[i % gradientColors.length];

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  delay: i * 0.08,
                  duration: 0.6,
                  ease: "easeOut"
                }}
                whileHover={{ y: -8 }}
                className="h-full"
              >
                <Card className="relative p-7 h-full group overflow-hidden border border-white/10 hover:border-primary/30 transition-all duration-300 bg-background/60 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-primary/5">
                  {/* Glass effect background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Gradient background overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl`} />
                  
                  {/* Animated border glow */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500 rounded-xl" />
                  
                  {/* Decorative circle */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary/5 group-hover:bg-primary/20 transition-colors duration-500" />

                  <div className="relative z-10">
                    {/* Icon container with enhanced styling */}
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-primary/20 border border-white/10">
                      <div className="absolute inset-0 rounded-2xl bg-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                      <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                      {service.title}
                    </h3>

                    {/* Description - now using the correct text from the image */}
                    <p className="text-sm text-muted-foreground/90 leading-relaxed mb-4">
                      {service.description}
                    </p>

                    {/* Learn more link */}
                    <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 translate-x-[-8px] group-hover:translate-x-0 transition-all duration-300">
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>

                    {/* Number indicator */}
                    <div className="absolute bottom-3 right-4 text-5xl font-bold text-muted-foreground/5 select-none">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-background/60 backdrop-blur-xl border border-white/10 rounded-full hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl hover:shadow-primary/10">
            <span className="text-sm font-medium text-primary">View all our services</span>
            <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}