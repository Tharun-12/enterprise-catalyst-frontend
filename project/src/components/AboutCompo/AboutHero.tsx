// // components/about/AboutHero.tsx
// import { Badge } from '@/components/ui/badge';
// import { COMPANY } from '@/constants';

// export function AboutHero() {
//   return (
//     <div className="relative bg-gradient-to-br from-primary to-[#0a3a63] text-white rounded-3xl p-8 lg:p-12 mb-12 overflow-hidden">
//       <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent/20 blur-3xl" />
//       <div className="relative max-w-2xl">
//         <Badge className="bg-white/15 text-white border-white/20 mb-4">About MVB</Badge>
//         <h1 className="text-3xl lg:text-4xl font-bold mb-4">Empowering Businesses Since {COMPANY.established}</h1>
//         <p className="text-white/80 leading-relaxed">{COMPANY.description}</p>
//       </div>
//     </div>
//   );
// }






import { Badge } from "@/components/ui/badge";
import { COMPANY } from "@/constants";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl mb-12 min-h-[600px] flex items-center">

      {/* Background Image */}
      <img
        src="https://i.pinimg.com/736x/70/05/9c/70059cc67f49210a2f5f5aeea9ccbdba.jpg"
        alt="About MVB"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#08192f]/90 via-[#0b2948]/70 to-transparent" />

      {/* Orange Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-orange-500/20 blur-[140px]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-8 lg:px-16 w-full">

        <div className="max-w-3xl">

          <Badge className="mb-6 border border-orange-400/40 bg-orange-500/10 px-6 py-2 uppercase tracking-[0.25em] text-orange-300 backdrop-blur-sm">
            About MVB
          </Badge>

          <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-white">
            Empowering Businesses
            <br />
            <span className="text-orange-400">
              Since {COMPANY.established}
            </span>
          </h1>

          <p className="mt-8 text-lg lg:text-xl leading-9 text-gray-200 max-w-2xl">
            {COMPANY.description}
          </p>

        </div>

      </div>
    </section>
  );
}