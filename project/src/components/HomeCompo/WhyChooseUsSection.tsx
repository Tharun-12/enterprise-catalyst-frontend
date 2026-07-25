// import { motion } from 'framer-motion';
// import { SectionHeader } from '@/components/shared';
// import { WHY_CHOOSE_US } from '@/constants';
// import { iconMap } from '@/lib/Map';
// import { ShieldCheck } from 'lucide-react';

// export function WhyChooseUsSection() {
//   return (
//     <section className="py-16 lg:py-20 bg-primary text-white">
//       <div className="container mx-auto px-4">
//         <SectionHeader 
//           centered 
//           title="Why Choose MVB?" 
//           subtitle="Trusted by 500+ enterprises across India for our expertise and service quality." 
//           className="[&_h2]:text-white [&_p]:text-white/70" 
//         />
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
//           {WHY_CHOOSE_US.map((item, i) => {
//             const Icon = iconMap[item.icon] || ShieldCheck;
//             return (
//               <motion.div
//                 key={item.title}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: i * 0.05 }}
//                 className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-colors"
//               >
//                 <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
//                   <Icon className="w-6 h-6 text-accent" />
//                 </div>
//                 <h3 className="font-semibold mb-2">{item.title}</h3>
//                 <p className="text-sm text-white/70 leading-relaxed">{item.description}</p>
//               </motion.div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }



// import { motion } from 'framer-motion';
// import { SectionHeader } from '@/components/shared';
// import { WHY_CHOOSE_US } from '@/constants';
// import { iconMap } from '@/lib/Map';
// import { ShieldCheck } from 'lucide-react';

// export function WhyChooseUsSection() {
//   return (
//     <section className="relative py-16 lg:py-20 overflow-hidden">
//       {/* Background Image */}
//       <div className="absolute inset-0 z-0">
//         <img 
//           src="https://i.pinimg.com/1200x/51/d3/63/51d363932fa00f9d1235a16f2cd2ff10.jpg" // Replace with actual image path
//           alt="About background"
//           className="w-full h-full object-cover"
//         />
//         {/* Dark Overlay */}
//         <div className="absolute inset-0 bg-primary/90 mix-blend-multiply"></div>
//       </div>

//       {/* Content */}
//       <div className="relative z-10 container mx-auto px-4">
//         <SectionHeader 
//           centered 
//           title="Why Choose MVB?" 
//           subtitle="Trusted by 500+ enterprises across India for our expertise and service quality." 
//           className="[&_h2]:text-white [&_p]:text-white/70" 
//         />
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
//           {WHY_CHOOSE_US.map((item, i) => {
//             const Icon = iconMap[item.icon] || ShieldCheck;
//             return (
//               <motion.div
//                 key={item.title}
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: i * 0.05 }}
//                 className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-colors border border-white/10"
//               >
//                 <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
//                   <Icon className="w-6 h-6 text-accent" />
//                 </div>
//                 <h3 className="font-semibold text-white mb-2">{item.title}</h3>
//                 <p className="text-sm text-white/70 leading-relaxed">{item.description}</p>
//               </motion.div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }



import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { SectionHeader } from "@/components/shared";
import { WHY_CHOOSE_US } from "@/constants";
import { iconMap } from "@/lib/Map";

export function WhyChooseUsSection() {
  return (
    <section className="relative py-16 lg:py-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://i.pinimg.com/1200x/51/d3/63/51d363932fa00f9d1235a16f2cd2ff10.jpg"
          alt="Why Choose MVB"
          className="w-full h-full object-cover"
        />

        {/* Colorful Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/90 via-orange-500/80 via-yellow-400/70 to-blue-600/90 mix-blend-multiply"></div>

        {/* Extra Dark Layer for Better Readability */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Decorative Blurs */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-pink-500/20 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <SectionHeader
          centered
          title="Why Choose MVB?"
          subtitle="Trusted by 500+ enterprises across India for our expertise, certified professionals, and exceptional customer service."
          className="[&_h2]:text-white [&_h2]:drop-shadow-xl [&_p]:text-white/85"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12">
          {WHY_CHOOSE_US.map((item, index) => {
            const Icon = iconMap[item.icon] || ShieldCheck;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                }}
                whileHover={{
                  y: -10,
                  scale: 1.03,
                }}
                className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl p-7 transition-all duration-500 hover:bg-white/20 hover:border-white/30 hover:shadow-2xl"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-pink-500/10 via-orange-500/10 via-yellow-400/10 to-blue-600/10"></div>

                {/* Icon */}
                <div className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-orange-500 to-blue-600 shadow-xl transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                  <Icon className="h-7 w-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="relative z-10 mb-3 text-xl font-bold text-white">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="relative z-10 text-sm leading-7 text-white/80">
                  {item.description}
                </p>

                {/* Bottom Gradient Line */}
                <div className="absolute bottom-0 left-0 h-1 w-0 rounded-full bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 transition-all duration-500 group-hover:w-full"></div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}