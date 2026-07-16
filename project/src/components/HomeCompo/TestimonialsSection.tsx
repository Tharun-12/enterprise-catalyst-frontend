// import { motion } from 'framer-motion';
// import { Quote, Star } from 'lucide-react';
// import { Card } from '@/components/ui/card';
// import { SectionHeader } from '@/components/shared';
// import { testimonials } from '@/data';
// import { cn } from '@/lib/utils';

// export function TestimonialsSection() {
//   return (
//     <section className="py-16 lg:py-20 bg-muted/30">
//       <div className="container mx-auto px-4">
//         <SectionHeader centered title="What Our Clients Say" subtitle="Real feedback from businesses we've helped grow with our solutions." />
//         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
//           {testimonials.map((t, i) => (
//             <motion.div
//               key={t.id}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: i * 0.05 }}
//             >
//               <Card className="p-6 h-full flex flex-col">
//                 <Quote className="w-8 h-8 text-primary/20 mb-3" />
//                 <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{t.message}</p>
//                 <div className="flex items-center gap-1 mb-3">
//                   {[1, 2, 3, 4, 5].map((s) => (
//                     <Star key={s} className={cn('w-4 h-4', s <= t.rating ? 'text-accent fill-accent' : 'text-muted-foreground/30')} />
//                   ))}
//                 </div>
//                 <div className="flex items-center gap-3 pt-3 border-t">
//                   <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
//                   <div>
//                     <div className="font-semibold text-sm">{t.name}</div>
//                     <div className="text-xs text-muted-foreground">{t.role} · {t.company}</div>
//                   </div>
//                 </div>
//               </Card>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }



// import { motion } from 'framer-motion';
// import { Star } from 'lucide-react';
// import { testimonials } from '@/data';

// export function TestimonialsSection() {
//   return (
//     <section className="relative overflow-hidden bg-white py-24">
//       {/* Background Circles */}
//       <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl"></div>
//       <div className="absolute right-0 bottom-20 h-80 w-80 rounded-full bg-sky-200/30 blur-3xl"></div>

//       <div className="mx-auto max-w-7xl px-6">
//         {/* Header */}
//         <div className="text-center">
//           <div className="inline-block rounded-full bg-gradient-to-r from-pink-500 to-blue-600 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow">
//             Client Voices
//           </div>

//           <h2 className="mt-5 text-3xl font-extrabold text-gray-900 md:text-4xl">
//             What{" "}
//             <span className="bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text text-transparent">
//               enterprise leaders
//             </span>{" "}
//             say
//           </h2>

//           <p className="mx-auto mt-4 max-w-2xl text-gray-600">
//             Trusted by thousands of happy customers.
//           </p>
//         </div>

//         {/* Testimonials Grid */}
//         <div className="mt-20 grid gap-16 md:grid-cols-2 lg:grid-cols-4">
//           {testimonials.map((item, index) => (
//             <motion.div
//               key={item.id}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: index * 0.05 }}
//               className="relative flex justify-center"
//             >
//               {/* Avatar */}
//               <img
//                 src={item.image || item.avatar}
//                 alt={item.name}
//                 className="absolute -top-10 z-20 h-20 w-20 rounded-full border-4 border-white object-cover shadow-xl"
//               />

//               {/* Bubble */}
//               <div className="relative w-full rounded-[28px] bg-white px-6 pt-14 pb-8 text-center shadow-xl">
//                 <h3 className="text-xl font-semibold text-[#42548d]">
//                   — {item.name}
//                 </h3>
//                 <p className="text-sm text-slate-500">
//                   {item.location || `${item.role} · ${item.company}`}
//                 </p>

//                 <div className="mt-4 flex justify-center gap-1">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <Star
//                       key={star}
//                       className={star <= item.rating 
//                         ? "h-4 w-4 fill-yellow-400 text-yellow-400" 
//                         : "h-4 w-4 text-muted-foreground/30"
//                       }
//                     />
//                   ))}
//                 </div>

//                 <p className="mt-5 text-[15px] leading-7 text-slate-500">
//                   "{item.quote || item.message}"
//                 </p>

//                 {/* Bubble Tail */}
//                 <div className="absolute -bottom-4 left-1/2 h-8 w-8 -translate-x-1/2 rotate-45 bg-white"></div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }



import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { testimonials } from '@/data';

export function TestimonialsSection() {
  // Sample HTTP images for different avatars
  const avatarImages = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face'
  ];

  return (
    <section className="relative overflow-hidden bg-white py-24">
      {/* Background Circles */}
      <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl"></div>
      <div className="absolute right-0 bottom-20 h-80 w-80 rounded-full bg-sky-200/30 blur-3xl"></div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-block rounded-full bg-gradient-to-r from-pink-500 to-blue-600 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow">
            Client Voices
          </div>

          <h2 className="mt-5 text-3xl font-extrabold text-gray-900 md:text-4xl">
            What{" "}
            <span className="bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text text-transparent">
              enterprise leaders
            </span>{" "}
            say
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Trusted by thousands of happy customers.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-20 grid gap-16 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="relative flex justify-center"
            >
              {/* Avatar - Using HTTP image */}
              <img
                src={avatarImages[index % avatarImages.length] || item.image || item.avatar}
                alt={item.name}
                className="absolute -top-10 z-20 h-20 w-20 rounded-full border-4 border-white object-cover shadow-xl"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = 'absolute -top-10 z-20 h-20 w-20 rounded-full border-4 border-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-xl flex items-center justify-center text-white text-xl font-bold';
                    fallback.textContent = item.name.charAt(0);
                    parent.appendChild(fallback);
                  }
                }}
              />

              {/* Bubble */}
              <div className="relative w-full rounded-[28px] bg-white px-6 pt-14 pb-8 text-center shadow-xl">
                <h3 className="text-xl font-semibold text-[#42548d]">
                  — {item.name}
                </h3>
                <p className="text-sm text-slate-500">
                  {item.location || `${item.role} · ${item.company}`}
                </p>

                <div className="mt-4 flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={star <= item.rating 
                        ? "h-4 w-4 fill-yellow-400 text-yellow-400" 
                        : "h-4 w-4 text-muted-foreground/30"
                      }
                    />
                  ))}
                </div>

                <p className="mt-5 text-[15px] leading-7 text-slate-500">
                  "{item.quote || item.message}"
                </p>

                {/* Bubble Tail */}
                <div className="absolute -bottom-4 left-1/2 h-8 w-8 -translate-x-1/2 rotate-45 bg-white"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}