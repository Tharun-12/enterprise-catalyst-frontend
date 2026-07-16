// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { ArrowRight } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { COMPANY } from '@/constants';

// export function HeroSection() {
//   return (
//     <section className="relative bg-gradient-to-br from-primary via-primary to-[#0a3a63] text-white overflow-hidden">
//       <div className="absolute inset-0 opacity-10">
//         <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-accent blur-3xl" />
//         <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-secondary blur-3xl" />
//       </div>
//       <div className="container mx-auto px-4 py-20 lg:py-28 relative">
//         <div className="max-w-3xl">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             <Badge className="bg-white/15 text-white border-white/20 mb-4 hover:bg-white/20">
//               Enterprise E-Catalog Platform
//             </Badge>
//             <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-5">
//               Enterprise Solutions for a <span className="text-accent">Connected</span> World
//             </h1>
//             <p className="text-lg text-white/80 mb-8 max-w-2xl leading-relaxed">
//               {COMPANY.description}
//             </p>
//             <div className="flex flex-wrap gap-3">
//               <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
//                 <Link to="/products">
//                   Explore Products <ArrowRight className="w-4 h-4 ml-2" />
//                 </Link>
//               </Button>
//               <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white">
//                 <Link to="/categories">Browse Categories</Link>
//               </Button>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//       {/* Stats bar */}
//       <StatsBar />
//     </section>
//   );
// }

// function StatsBar() {
//   const stats = [
//     { label: 'Products', value: '150+' },
//     { label: 'Categories', value: '8' },
//     { label: 'Premium Brands', value: '15+' },
//     { label: 'Happy Clients', value: '500+' },
//   ];

//   return (
//     <div className="border-t border-white/10 bg-white/5 backdrop-blur-sm">
//       <div className="container mx-auto px-4 py-6">
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           {stats.map((stat, i) => (
//             <motion.div
//               key={stat.label}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 + i * 0.1 }}
//               className="text-center lg:text-left"
//             >
//               <div className="text-2xl lg:text-3xl font-bold text-accent">{stat.value}</div>
//               <div className="text-xs text-white/60 uppercase tracking-wider">{stat.label}</div>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Shield, Star, CheckCircle, Award, Users, Clock, ChevronLeft, ChevronRight, Package, Headphones, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { COMPANY } from '@/constants';
import { useState, useEffect } from 'react';

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselSlides = [
    {
      badge: "Enterprise E-Catalog 2026",
      title: "Enterprise Infrastructure.",
      subtitle: "Sourced with confidence.",
      description: "A curated catalog of 12,500+ SKUs across surveillance, power, networking, safety and access control—with expert consultation, deployment and AMC from a trusted systems integrator.",
      image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600",
      stats: [
        { icon: Package, label: '12,500+', sub: 'Products' },
        { icon: Users, label: '500+', sub: 'Clients' },
        { icon: Award, label: '15+', sub: 'Brands' },
      ],
      ctaPrimary: "Explore Catalog",
      ctaSecondary: "Request a Quote"
    },
    {
      badge: "Security Solutions 2026",
      title: "Advanced Surveillance.",
      subtitle: "Protect what matters most.",
      description: "Cutting-edge CCTV, access control, and security systems from global leaders like Hikvision and Dahua. Complete solutions for businesses of all sizes with 24/7 monitoring support.",
      image: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=600",
      stats: [
        { icon: Shield, label: '24/7', sub: 'Monitoring' },
        { icon: Zap, label: '4K', sub: 'Resolution' },
        { icon: Users, label: '1000+', sub: 'Installed' },
      ],
      ctaPrimary: "Explore Security",
      ctaSecondary: "Get Consultation"
    },
    {
      badge: "Power & Networking 2026",
      title: "Reliable Infrastructure.",
      subtitle: "Powering your business.",
      description: "End-to-end power backup solutions with UPS systems, stabilizers, and enterprise networking equipment from Schneider Electric, Cisco, and Siemens. Ensure 99.9% uptime.",
      image: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=600",
      stats: [
        { icon: TrendingUp, label: '99.9%', sub: 'Uptime' },
        { icon: Clock, label: '24/7', sub: 'Support' },
        { icon: Headphones, label: 'Expert', sub: 'Team' },
      ],
      ctaPrimary: "View Solutions",
      ctaSecondary: "Request Demo"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const slide = carouselSlides[currentSlide];

  return (
    <section className="relative overflow-hidden bg-white min-h-[600px] flex items-center">
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

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-400/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-16 relative w-full">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content - Carousel Slides */}
            <div className="relative">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="text-left"
              >
                {/* Animated badge */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Badge className="bg-gradient-to-r from-pink-500 to-blue-500 text-white border-0 mb-4 px-6 py-2 text-sm font-medium hover:scale-105 transition-all duration-300">
                    <Sparkles className="w-4 h-4 inline mr-2" />
                    {slide.badge}
                    <span className="ml-2 w-2 h-2 bg-white rounded-full inline-block animate-ping" />
                  </Badge>
                </motion.div>

                {/* Main heading */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-4">
                  <span className="text-gray-900 drop-shadow-lg">
                    {slide.title}
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text text-transparent drop-shadow-lg">
                    {slide.subtitle}
                  </span>
                </h1>

                <p className="text-base md:text-lg text-gray-600 mb-6 max-w-xl leading-relaxed backdrop-blur-sm bg-white/50 rounded-2xl p-5 border border-gray-100 shadow-xl">
                  {slide.description}
                </p>

                {/* Stats for this slide */}
                <div className="flex flex-wrap gap-6 mb-6">
                  {slide.stats.map((stat, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <stat.icon className="w-5 h-5 text-blue-500" />
                      <div>
                        <span className="text-xl font-bold bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text text-transparent">
                          {stat.label}
                        </span>
                        <div className="text-xs text-gray-500">{stat.sub}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button asChild size="lg" className="bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold px-8">
                      <Link to="/products">
                        {slide.ctaPrimary} <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button asChild size="lg" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 transition-all duration-300 px-8">
                      <Link to="/contact">{slide.ctaSecondary}</Link>
                    </Button>
                  </motion.div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center gap-3 mt-8">
                  <button
                    onClick={prevSlide}
                    className="p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300 border border-gray-200 hover:border-pink-500 group"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700 group-hover:text-pink-500 transition-colors" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300 border border-gray-200 hover:border-pink-500 group"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-pink-500 transition-colors" />
                  </button>
                  
                  {/* Dots */}
                  <div className="flex items-center gap-2 ml-2">
                    {carouselSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          currentSlide === index
                            ? 'w-8 bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500'
                            : 'w-2 bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                  
                  {/* Slide counter */}
                  <span className="text-xs text-gray-400 ml-2">
                    {currentSlide + 1} / {carouselSlides.length}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Right Content - Image */}
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative h-full"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/50 h-[400px] lg:h-[500px]">
                <img 
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                
                {/* Floating badge on image */}
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-gray-700">Live Now</span>
                  </div>
                </div>

                {/* Top right badge */}
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-medium text-gray-700">Featured</span>
                  </div>
                </div>
              </div>

              

              {/* Left side badge */}
              <div className="absolute -top-3 -left-3 bg-white rounded-xl shadow-xl px-4 py-2 border-2 border-white">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-pink-500" />
                  <span className="text-xs font-bold text-gray-700">ISO Certified</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Decorative Divider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 flex items-center justify-center gap-4"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-pink-500" />
            <CheckCircle className="w-5 h-5 text-pink-500" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-blue-500" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}