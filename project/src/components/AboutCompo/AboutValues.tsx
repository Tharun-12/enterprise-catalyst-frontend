// // components/about/AboutValues.tsx
// import { motion } from 'framer-motion';
// import { Card } from '@/components/ui/card';
// import { SectionHeader } from '@/components/shared';
// import { COMPANY_VALUES } from '@/constants';
// import { Heart } from 'lucide-react';

// export function AboutValues() {
//   return (
//     <section className="mb-12">
//       <SectionHeader centered title="Our Core Values" subtitle="The principles that guide everything we do." />
//       <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
//         {COMPANY_VALUES.map((value, i) => (
//           <motion.div
//             key={value.title}
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: i * 0.05 }}
//           >
//             <Card className="p-6 h-full hover:shadow-lg transition-shadow">
//               <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
//                 <Heart className="w-5 h-5 text-accent" />
//               </div>
//               <h3 className="font-semibold mb-2">{value.title}</h3>
//               <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
//             </Card>
//           </motion.div>
//         ))}
//       </div>
//     </section>
//   );
// }



// import { motion } from "framer-motion";
// import { SectionHeader } from "@/components/shared";
// import { COMPANY_VALUES } from "@/constants";
// import {
//   Heart,
//   ShieldCheck,
//   Lightbulb,
//   Handshake,
// } from "lucide-react";

// const icons = [Heart, ShieldCheck, Lightbulb, Handshake];

// const images = [
//   "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80",
//   "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1200&q=80",
//   "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80",
//   "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1200&q=80",
// ];

// export function AboutValues() {
//   return (
//     <section className="py-16 bg-white">
//       <div className="max-w-7xl mx-auto px-6">

//         <SectionHeader
//           centered
//           title="Our Core Values"
//           subtitle="The principles that guide everything we do."
//         />

//         <div className="space-y-8 mt-14">
//           {COMPANY_VALUES.map((value, index) => {
//             const Icon = icons[index % icons.length];
//             const reverse = index % 2 !== 0;

//             return (
//               <motion.div
//                 key={value.title}
//                 initial={{ opacity: 0, y: 40 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.1 }}
//               >
//         <div
//   className={`grid lg:grid-cols-2 gap-6 items-stretch ${
//     reverse ? "lg:[&>*:first-child]:order-2" : ""
//   }`}
// >
//   {/* Image */}
//   <div className="h-[200px] rounded-3xl overflow-hidden shadow-md">
//     <img
//       src={images[index]}
//       alt={value.title}
//       className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
//     />
//   </div>

//   {/* Card */}
//   <div className="h-[200px] bg-white border border-orange-100 rounded-3xl shadow-md p-6 flex items-center gap-5 hover:shadow-xl transition-all duration-300">

//     <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
//       <Icon className="w-7 h-7 text-orange-500" />
//     </div>

//     <div>
//       <h3 className="text-2xl font-bold text-slate-900 mb-2">
//         {value.title}
//       </h3>

//       <p className="text-sm text-gray-600 leading-6 line-clamp-3">
//         {value.description}
//       </p>
//     </div>

//   </div>
// </div>
//               </motion.div>
//             );
//           })}
//         </div>

//       </div>
//     </section>
//   );
// }



import { motion } from "framer-motion";
import { COMPANY_VALUES } from "@/constants";
import {
  Heart,
  ShieldCheck,
  Lightbulb,
  Handshake,
  ArrowRight,
} from "lucide-react";

const icons = [Heart, ShieldCheck, Lightbulb, Handshake];

const images = [
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80",
  "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1200&q=80",
  "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80",
  "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1200&q=80",
];

export function AboutValues() {
  return (
    <section className="py-16 bg-white relative overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Decorative Background Elements */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-pink-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-blue-600/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-yellow-400/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header with Gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 via-orange-500/10 via-yellow-400/10 to-blue-600/10 text-sm font-semibold text-blue-600 mb-3 border border-pink-500/20">
            Our Foundation
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text text-transparent">
            Core Values That Drive Us
          </h2>
          
          
          <div className="h-1 w-20 mx-auto mt-3 bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 rounded-full" />
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            The principles that guide everything we do
          </p>
        </motion.div>

        <div className="space-y-8 mt-14">
          {COMPANY_VALUES.map((value, index) => {
            const Icon = icons[index % icons.length];
            const reverse = index % 2 !== 0;

            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div
                  className={`grid lg:grid-cols-2 gap-6 items-stretch ${
                    reverse ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  {/* Image with Gradient Overlay */}
                  <div className="relative h-[220px] lg:h-[240px] rounded-3xl overflow-hidden shadow-lg group">
                    <img
                      src={images[index % images.length]}
                      alt={value.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-orange-500/20 via-yellow-400/20 to-blue-600/20 mix-blend-overlay" />
                    {/* Bottom Gradient Line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600" />
                    {/* Badge */}
                    <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-white text-xs font-medium">
                        Value {index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Card with Gradient Accents */}
                  <div className="h-[220px] lg:h-[240px] bg-white border border-orange-100/50 rounded-3xl shadow-md p-6 lg:p-8 flex items-center gap-5 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                    {/* Hover Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-orange-500/5 via-yellow-400/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Left Border Gradient - Visible on Hover */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 via-orange-500 via-yellow-400 to-blue-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />

                    {/* Icon with Gradient Background */}
                    <div className="relative shrink-0">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-400 opacity-10 group-hover:opacity-20 transition-opacity duration-300" />
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-400 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 relative z-10">
                      <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2 group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:via-orange-500 group-hover:via-yellow-400 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                        {value.title}
                      </h3>

                      <p className="text-sm text-gray-600 leading-6 line-clamp-3 group-hover:text-gray-700 transition-colors duration-300">
                        {value.description}
                      </p>

                      {/* Hover Arrow Indicator */}
                      <div className="mt-3 flex items-center gap-2 text-xs font-medium text-transparent bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>Learn more</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

       
      </div>
    </section>
  );
}