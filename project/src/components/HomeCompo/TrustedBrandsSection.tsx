// import { motion } from 'framer-motion';
// import { Card } from '@/components/ui/card';
// import { SectionHeader } from '@/components/shared';
// import { brands } from '@/data';

// export function TrustedBrandsSection() {
//   return (
//     <section className="py-16 lg:py-20">
//       <div className="container mx-auto px-4">
//         <SectionHeader centered title="Trusted Brands We Partner With" subtitle="Authorized distributor of world-leading technology brands." />
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
//           {brands.map((brand) => (
//             <Card key={brand.id} className="p-6 flex flex-col items-center justify-center hover:shadow-md transition-all h-28">
//               <div className="font-bold text-lg text-center" style={{ color: '#0F4C81' }}>{brand.logoText}</div>
//               <div className="text-xs text-muted-foreground mt-1">{brand.country}</div>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }


import { motion } from 'framer-motion';
import { brands } from '@/data';

export function TrustedBrandsSection() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-white py-14">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#3b82f620,transparent_35%),radial-gradient(circle_at_bottom_left,#ec489920,transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Color Blobs */}
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="absolute left-1/4 -bottom-24 h-80 w-80 rounded-full bg-pink-500/20 blur-3xl" />
      <div className="absolute top-1/3 left-10 h-72 w-72 rounded-full bg-yellow-400/20 blur-3xl" />
      <div className="absolute bottom-10 right-20 h-72 w-72 rounded-full bg-green-500/20 blur-3xl" />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center">
          <div className="inline-block rounded-full bg-gradient-to-r from-pink-500 to-blue-600 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow">
            Trusted OEM Partnerships
          </div>

          <h2 className="mt-5 text-3xl font-extrabold text-gray-900 md:text-4xl">
            Trusted Brands{" "}
            <span className="bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text text-transparent">
             We Partner With
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Authorized distributor of world-leading technology brands.
          </p>
        </div>

        <div className="relative mt-10 ">
          <motion.div
            className="flex gap-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 25,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {[...brands, ...brands].map((b, index) => (
              <div
                key={`${b.id}-${index}`}
                className="flex h-16 min-w-[170px] items-center justify-center rounded-lg border border-border bg-card px-6 text-center text-sm font-bold shadow-sm transition hover:shadow-md"
                style={{ color: b.color || '#0F4C81' }}
              >
                {b.logoText}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}