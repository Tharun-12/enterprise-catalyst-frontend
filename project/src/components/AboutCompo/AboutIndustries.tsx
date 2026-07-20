// // components/about/AboutIndustries.tsx
// import { motion } from 'framer-motion';
// import { Badge } from '@/components/ui/badge';
// import { SectionHeader } from '@/components/shared';
// import { INDUSTRIES_SERVED } from '@/constants';

// export function AboutIndustries() {
//   return (
//     <section className="mb-12 bg-muted/30 -mx-4 px-4 py-12 rounded-3xl">
//       <div className="container mx-auto">
//         <SectionHeader centered title="Industries We Serve" subtitle="Trusted by businesses across diverse sectors." />
//         <div className="flex flex-wrap justify-center gap-3">
//           {INDUSTRIES_SERVED.map((industry, i) => (
//             <motion.div
//               key={industry}
//               initial={{ opacity: 0, scale: 0.9 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               viewport={{ once: true }}
//               transition={{ delay: i * 0.03 }}
//             >
//               <Badge
//                 variant="outline"
//                 className="px-4 py-2 text-sm bg-card border-border hover:border-primary hover:text-primary transition-colors cursor-default"
//               >
//                 {industry}
//               </Badge>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }




// components/about/AboutIndustries.tsx

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared";
import { INDUSTRIES_SERVED } from "@/constants";
import {
  Building2,
  Factory,
  ShoppingCart,
  Truck,
  Laptop,
  HeartPulse,
  Landmark,
  GraduationCap,
} from "lucide-react";

const icons = [
  Landmark,
  HeartPulse,
  Laptop,
  Factory,
  ShoppingCart,
  Truck,
  Building2,
  GraduationCap,
];

const gradients = [
  "from-green-50 to-emerald-100",
  "from-blue-50 to-indigo-100",
  "from-purple-50 to-violet-100",
  "from-orange-50 to-amber-100",
  "from-pink-50 to-rose-100",
  "from-cyan-50 to-sky-100",
  "from-yellow-50 to-orange-100",
  "from-indigo-50 to-blue-100",
];

export function AboutIndustries() {
  return (
    <section className="py-16 bg-white rounded-3xl">
      <div className="max-w-7xl mx-auto px-6">
    <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight text-center">
  Industries We <span className="bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text text-transparent">
    Serve
  </span>
</h2>

<p className="text-muted-foreground text-lg text-center">
  Trusted by businesses across diverse sectors.
</p>

        <div className="mt-12 flex flex-wrap justify-center gap-10">
          {INDUSTRIES_SERVED.map((industry, index) => {
            const Icon = icons[index % icons.length];
            const gradient = gradients[index % gradients.length];

            return (
              <motion.div
                key={industry}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="text-center group cursor-pointer"
              >
                <div
                  className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${gradient}
                  flex items-center justify-center shadow-sm
                  transition-all duration-300
                  group-hover:-translate-y-2
                  group-hover:shadow-lg`}
                >
                  <Icon className="w-9 h-9 text-slate-700" />
                </div>

                <h3 className="mt-4 text-lg font-semibold text-slate-700">
                  {industry}
                </h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}