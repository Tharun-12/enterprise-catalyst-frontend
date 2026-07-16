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



import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/shared';
import { WHY_CHOOSE_US } from '@/constants';
import { iconMap } from '@/lib/Map';
import { ShieldCheck } from 'lucide-react';

export function WhyChooseUsSection() {
  return (
    <section className="relative py-16 lg:py-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://i.pinimg.com/1200x/51/d3/63/51d363932fa00f9d1235a16f2cd2ff10.jpg" // Replace with actual image path
          alt="About background"
          className="w-full h-full object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-primary/90 mix-blend-multiply"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <SectionHeader 
          centered 
          title="Why Choose MVB?" 
          subtitle="Trusted by 500+ enterprises across India for our expertise and service quality." 
          className="[&_h2]:text-white [&_p]:text-white/70" 
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WHY_CHOOSE_US.map((item, i) => {
            const Icon = iconMap[item.icon] || ShieldCheck;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-colors border border-white/10"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}