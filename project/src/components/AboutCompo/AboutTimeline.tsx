// // components/about/AboutTimeline.tsx
// import { motion } from 'framer-motion';
// import { Card } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { SectionHeader } from '@/components/shared';
// import { TIMELINE } from '@/constants';

// export function AboutTimeline() {
//   return (
//     <section>
//       <SectionHeader centered title="Our Journey" subtitle="Key milestones in our growth story." />
//       <div className="relative max-w-3xl mx-auto">
//         <div className="absolute left-4 lg:left-1/2 lg:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-border" />
//         {TIMELINE.map((item, i) => (
//           <motion.div
//             key={item.year}
//             initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: i * 0.05 }}
//             className={`relative flex gap-6 mb-8 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
//           >
//             <div className="hidden lg:block flex-1" />
//             <div className="absolute left-4 lg:left-1/2 lg:-translate-x-1/2 w-3 h-3 rounded-full bg-primary ring-4 ring-background mt-2" />
//             <div className="flex-1 lg:px-6">
//               <Card className="p-5">
//                 <Badge className="bg-primary/10 text-primary border-0 mb-2">{item.year}</Badge>
//                 <h3 className="font-semibold mb-1">{item.title}</h3>
//                 <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
//               </Card>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </section>
//   );
// }


// components/about/AboutTimeline.tsx

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/shared";
import { TIMELINE } from "@/constants";

export function AboutTimeline() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Blur */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-pink-500/15 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />
      </div>

      <SectionHeader
        centered
        title="Our Journey"
        subtitle="Every milestone reflects our passion for creating joyful experiences."
      />

      <div className="relative max-w-6xl mx-auto mt-16">

        {/* Gradient Timeline */}
        <div className="absolute left-5 lg:left-1/2 lg:-translate-x-1/2 top-0 bottom-0 w-[5px] rounded-full bg-gradient-to-b from-pink-500 via-orange-500 via-yellow-400 to-blue-600" />

        {TIMELINE.map((item, i) => (
          <motion.div
            key={item.year}
            initial={{
              opacity: 0,
              x: i % 2 === 0 ? -80 : 80,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: i * 0.15,
            }}
            className={`relative flex mb-14 ${
              i % 2 === 0
                ? "lg:flex-row"
                : "lg:flex-row-reverse"
            }`}
          >
            {/* Empty Column */}
            <div className="hidden lg:block flex-1" />

            {/* Timeline Dot */}
            <div className="absolute left-3 lg:left-1/2 lg:-translate-x-1/2 top-8">
              <div className="h-7 w-7 rounded-full bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 ring-[6px] ring-white shadow-2xl shadow-pink-500/40" />
            </div>

            {/* Card */}
            <div className="flex-1 pl-14 lg:pl-8 lg:pr-8">
              <motion.div
                whileHover={{
                  scale: 1.04,
                  y: -8,
                }}
                transition={{ duration: 0.3 }}
              >
                <Card className="group relative overflow-hidden rounded-3xl border-0 bg-white/80 backdrop-blur-xl shadow-xl transition-all duration-500 hover:shadow-2xl hover:shadow-pink-500/20">

                  {/* Top Gradient Bar */}
                  <div className="h-2 w-full bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600" />

                  <div className="p-7">

                    {/* Year Badge */}
                    <div className="inline-flex items-center rounded-full bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 px-5 py-2 text-sm font-bold text-white shadow-lg mb-5">
                      {item.year}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:via-orange-500 group-hover:via-yellow-400 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="leading-7 text-gray-600">
                      {item.description}
                    </p>
                  </div>

                  {/* Hover Gradient Border */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-pink-300 transition-all duration-500" />

                </Card>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}