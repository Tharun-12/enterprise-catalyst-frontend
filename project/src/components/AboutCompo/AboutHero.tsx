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






// import { Badge } from "@/components/ui/badge";
// import { COMPANY } from "@/constants";

// export function AboutHero() {
//   return (
//     <section className="relative overflow-hidden rounded-3xl mb-12 min-h-[600px] flex items-center">

//       {/* Background Image */}
//       <img
//         src="https://i.pinimg.com/736x/70/05/9c/70059cc67f49210a2f5f5aeea9ccbdba.jpg"
//         alt="About MVB"
//         className="absolute inset-0 h-full w-full object-cover"
//       />

//       {/* Dark Overlay */}
//       <div className="absolute inset-0 bg-black/60" />

//       {/* Gradient Overlay */}
//       <div className="absolute inset-0 bg-gradient-to-r from-[#08192f]/90 via-[#0b2948]/70 to-transparent" />

//       {/* Orange Glow */}
//       <div className="absolute top-0 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-orange-500/20 blur-[140px]" />

//       {/* Content */}
//       <div className="relative z-10 mx-auto max-w-7xl px-8 lg:px-16 w-full">

//         <div className="max-w-3xl">

//           <Badge className="mb-6 border border-orange-400/40 bg-orange-500/10 px-6 py-2 uppercase tracking-[0.25em] text-orange-300 backdrop-blur-sm">
//             About MVB
//           </Badge>

//           <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-white">
//             Empowering Businesses
//             <br />
//             <span className="text-orange-400">
//               Since {COMPANY.established}
//             </span>
//           </h1>

//           <p className="mt-8 text-lg lg:text-xl leading-9 text-gray-200 max-w-2xl">
//             {COMPANY.description}
//           </p>

//         </div>

//       </div>
//     </section>
//   );
// }




import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/constants";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function AboutHero() {
  return (
    <section className="relative py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#3b82f620,transparent_35%),radial-gradient(circle_at_bottom_left,#ec489920,transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Color Blobs */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-pink-500/10 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl" />
      <div className="absolute bottom-20 left-20 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />

      {/* Content - Centered */}
      <div className="relative z-10 mx-auto max-w-7xl w-full text-center">

        <div className="max-w-3xl mx-auto">

          <Badge className="mb-6 border border-orange-400/40 bg-orange-500/10 px-6 py-2 uppercase tracking-[0.25em] text-orange-500 backdrop-blur-sm">
            About MVB
          </Badge>

          <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-gray-900">
            <span className="bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text text-transparent">
              Empowering Businesses Since {COMPANY.established}
            </span>
          </h1>

          <p className="mt-8 text-lg lg:text-xl leading-9 text-gray-600 max-w-2xl mx-auto">
            {COMPANY.description}
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              asChild 
              className="bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-8 py-6 text-base"
            >
              <Link to="/contact">
                Talk to Our Team
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button 
              asChild 
              variant="outline"
              className="border-2 border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 transition-all duration-300 font-semibold px-8 py-6 text-base"
            >
              <Link to="/contact">
                <MessageCircle className="w-4 h-4 mr-2" />
                Start a Conversation
              </Link>
            </Button>
          </div>

        </div>

      </div>
    </section>
  );
}