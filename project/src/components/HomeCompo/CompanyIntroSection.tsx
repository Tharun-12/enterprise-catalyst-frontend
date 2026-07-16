// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { ArrowRight } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { COMPANY } from '@/constants';

// export function CompanyIntroSection() {
//   return (
//     <section className="py-16 lg:py-20">
//       <div className="container mx-auto px-4">
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
//           <div>
//             <Badge className="bg-primary/10 text-primary border-0 mb-3">About MVB</Badge>
//             <h2 className="text-2xl lg:text-3xl font-bold mb-4">Your Trusted Partner in Enterprise Solutions</h2>
//             <p className="text-muted-foreground leading-relaxed mb-4">
//               Established in {COMPANY.established}, MV Business Solutions has grown to become one of India's leading providers of security, power, networking, and electrical solutions. We serve businesses of all sizes — from small offices to large industrial complexes.
//             </p>
//             <p className="text-muted-foreground leading-relaxed mb-6">
//               As authorized partners of 15+ global brands including Hikvision, Schneider Electric, Cisco, and Siemens, we bring you genuine products with full manufacturer warranty. Our certified technicians ensure professional installation and ongoing support.
//             </p>
//             <div className="grid grid-cols-3 gap-4">
//               {[
//                 { value: '15+', label: 'Years Experience' },
//                 { value: '500+', label: 'Projects Done' },
//                 { value: '24/7', label: 'Support' },
//               ].map((s) => (
//                 <div key={s.label} className="text-center p-4 rounded-xl bg-muted/50">
//                   <div className="text-2xl font-bold text-primary">{s.value}</div>
//                   <div className="text-xs text-muted-foreground">{s.label}</div>
//                 </div>
//               ))}
//             </div>
//             <Button asChild className="mt-6">
//               <Link to="/about">Learn More About Us <ArrowRight className="w-4 h-4 ml-2" /></Link>
//             </Button>
//           </div>
//           <div className="relative">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-4">
//                 <img src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Team" className="rounded-2xl w-full h-48 object-cover shadow-lg" />
//                 <img src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Office" className="rounded-2xl w-full h-64 object-cover shadow-lg" />
//               </div>
//               <div className="space-y-4 pt-8">
//                 <img src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Meeting" className="rounded-2xl w-full h-64 object-cover shadow-lg" />
//                 <img src="https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Work" className="rounded-2xl w-full h-48 object-cover shadow-lg" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }




import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Award, Users, Clock, Shield, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { COMPANY } from '@/constants';

export function CompanyIntroSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28 bg-white">
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

      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-gradient-to-r from-pink-500 to-blue-500 text-white border-0 mb-4 px-4 py-1.5 text-sm font-medium">
              About MVB
            </Badge>
            
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              Your Trusted Partner in 
              <br />
              <span className="bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text text-transparent">
                Enterprise Solutions
              </span>
            </h2>
            
            <p className="text-gray-600 leading-relaxed mb-4 text-base lg:text-lg">
              Established in {COMPANY.established}, MV Business Solutions has grown to become one of India's leading providers of security, power, networking, and electrical solutions. We serve businesses of all sizes — from small offices to large industrial complexes.
            </p>
            
            <p className="text-gray-600 leading-relaxed mb-8 text-base lg:text-lg">
              As authorized partners of 15+ global brands including Hikvision, Schneider Electric, Cisco, and Siemens, we bring you genuine products with full manufacturer warranty. Our certified technicians ensure professional installation and ongoing support.
            </p>

            {/* Stats Cards with Gradient */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { value: '15+', label: 'Years Experience', icon: Award },
                { value: '500+', label: 'Projects Done', icon: Users },
                { value: '24/7', label: 'Support Available', icon: Clock },
              ].map((s, index) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden text-center p-5 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent"
                >
                  {/* Hover Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  
                  <s.icon className="w-6 h-6 mx-auto mb-2 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text text-transparent">
                    {s.value}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">{s.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                asChild 
                className="bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-8"
              >
                <Link to="/about">
                  Learn More About Us 
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Images Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Decorative Gradient Circle */}
            <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-gradient-to-r from-pink-500/10 via-orange-500/10 via-yellow-400/10 to-blue-600/10 blur-3xl" />
            
            <div className="grid grid-cols-2 gap-4 relative">
              {/* Left Column */}
              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.03, rotate: -1 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden rounded-2xl shadow-xl border-2 border-white/50"
                >
                  <img 
                    src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600" 
                    alt="Professional Team" 
                    className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500" 
                  />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03, rotate: 1 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden rounded-2xl shadow-xl border-2 border-white/50"
                >
                  <img 
                    src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=600" 
                    alt="Modern Office" 
                    className="w-full h-64 object-cover hover:scale-110 transition-transform duration-500" 
                  />
                </motion.div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 pt-8">
                <motion.div
                  whileHover={{ scale: 1.03, rotate: -1 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden rounded-2xl shadow-xl border-2 border-white/50"
                >
                  <img 
                    src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=600" 
                    alt="Business Meeting" 
                    className="w-full h-64 object-cover hover:scale-110 transition-transform duration-500" 
                  />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03, rotate: 1 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden rounded-2xl shadow-xl border-2 border-white/50"
                >
                  <img 
                    src="https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg?auto=compress&cs=tinysrgb&w=600" 
                    alt="Team Work" 
                    className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500" 
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}