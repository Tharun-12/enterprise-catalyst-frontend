// // components/about/AboutMissionVision.tsx
// import { Card } from '@/components/ui/card';
// import { Target, Eye } from 'lucide-react';

// export function AboutMissionVision() {
//   return (
//     <section className="mb-12">
//       <div className="grid md:grid-cols-2 gap-6">
//         <Card className="p-8 bg-primary text-white">
//           <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
//             <Target className="w-7 h-7 text-accent" />
//           </div>
//           <h3 className="text-xl font-bold mb-3">Our Mission</h3>
//           <p className="text-white/80 leading-relaxed">
//             To empower businesses with reliable, enterprise-grade technology solutions that enhance security, efficiency, and sustainability. We strive to be the bridge between global technology brands and Indian enterprises, delivering genuine products with professional service.
//           </p>
//         </Card>
//         <Card className="p-8 bg-secondary text-white">
//           <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
//             <Eye className="w-7 h-7 text-white" />
//           </div>
//           <h3 className="text-xl font-bold mb-3">Our Vision</h3>
//           <p className="text-white/80 leading-relaxed">
//             To become India's most trusted enterprise solutions marketplace, where businesses can discover, compare, and procure the best technology products with confidence. We envision a future where every business has access to world-class infrastructure solutions.
//           </p>
//         </Card>
//       </div>
//     </section>
//   );
// }


// components/about/AboutMissionVision.tsx
import { Card } from '@/components/ui/card';
import { Target, Eye, Sparkles, ArrowRight, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export function AboutMissionVision() {
  return (
    <section className="mb-16 relative px-4 sm:px-6 lg:px-8">
      {/* Decorative Background Elements */}
      <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-pink-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-600/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-yellow-400/5 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500/10 via-orange-500/10 via-yellow-400/10 to-blue-600/10 text-sm font-semibold text-blue-600 mb-3 border border-pink-500/20">
          Our Purpose
        </span>
        <h2 className="text-3xl lg:text-4xl font-bold">
          Mission &amp; Vision
        </h2>
        <div className="h-1 w-20 mx-auto mt-3 bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 rounded-full" />
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Guiding our journey to deliver excellence in enterprise solutions
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Mission - Image Left, Content Right */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500"
        >
          {/* Image Side */}
          <div className="relative h-96 lg:h-[500px] overflow-hidden">
            <img 
              src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600" 
              alt="Mission - Empowering Businesses"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-orange-500/20 to-blue-600/20 mix-blend-overlay" />
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600" />
            <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-white text-sm font-medium">Mission</span>
            </div>
          </div>

          {/* Content Side */}
          <div className="bg-white p-10 lg:p-14 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-400 flex items-center justify-center shadow-xl flex-shrink-0">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text text-transparent">
                Our Mission
              </h3>
            </div>
            
            <p className="text-gray-700 leading-relaxed text-lg lg:text-xl mb-6">
              To empower businesses with reliable, enterprise-grade technology solutions that enhance security, efficiency, and sustainability. We strive to be the bridge between global technology brands and Indian enterprises, delivering genuine products with professional service.
            </p>
            
            <div className="flex items-center gap-3 text-sm text-pink-500 font-medium bg-pink-50 px-4 py-2 rounded-full w-fit">
              <Quote className="w-4 h-4" />
              <span>Driving innovation forward</span>
            </div>
          </div>
        </motion.div>

        {/* Vision - Image Right, Content Left */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500"
        >
          {/* Content Side */}
          <div className="bg-white p-10 lg:p-14 flex flex-col justify-center order-2 lg:order-1">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-400 flex items-center justify-center shadow-xl flex-shrink-0">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text text-transparent">
                Our Vision
              </h3>
            </div>
            
            <p className="text-gray-700 leading-relaxed text-lg lg:text-xl mb-6">
              To become India's most trusted enterprise solutions marketplace, where businesses can discover, compare, and procure the best technology products with confidence. We envision a future where every business has access to world-class infrastructure solutions.
            </p>
            
            <div className="flex items-center gap-3 text-sm text-blue-600 font-medium bg-blue-50 px-4 py-2 rounded-full w-fit">
              <Sparkles className="w-4 h-4" />
              <span>Shaping tomorrow's enterprise</span>
            </div>
          </div>

          {/* Image Side */}
          <div className="relative h-96 lg:h-[500px] overflow-hidden order-1 lg:order-2">
            <img 
              src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600" 
              alt="Vision - Future of Enterprise"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-pink-500/20 via-orange-500/20 to-blue-600/20 mix-blend-overlay" />
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600" />
            <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-white text-sm font-medium">Vision</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Decorative Element */}
      <div className="mt-16 text-center">
        <div className="inline-flex flex-wrap justify-center items-center gap-4 px-8 py-4 rounded-full bg-gradient-to-r from-pink-500/10 via-orange-500/10 via-yellow-400/10 to-blue-600/10 border border-pink-500/20 backdrop-blur-sm">
          <span className="text-sm lg:text-base text-gray-700">
            <span className="font-bold bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text text-transparent">15+</span> Years of Excellence
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-blue-600" />
          <span className="text-sm lg:text-base text-gray-700">
            <span className="font-bold bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text text-transparent">500+</span> Projects Delivered
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-blue-600" />
          <span className="text-sm lg:text-base text-gray-700">
            <span className="font-bold bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text text-transparent">24/7</span> Support Available
          </span>
        </div>
      </div>
    </section>
  );
}