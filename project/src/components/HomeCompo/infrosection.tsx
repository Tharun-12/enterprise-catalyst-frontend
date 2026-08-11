// import { Card } from '@/components/ui/card';
// import { MapPin, Phone, Mail } from 'lucide-react';
// import { COMPANY } from '@/constants';

// export function ContactInfoSection() {
//   return (
//     <section className="py-16 lg:py-20">
//       <div className="container mx-auto px-4">
//         <div className="grid lg:grid-cols-3 gap-5">
//           <Card className="p-6 flex items-start gap-4">
//             <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
//               <MapPin className="w-6 h-6 text-primary" />
//             </div>
//             <div>
//               <h3 className="font-semibold mb-1">Visit Us</h3>
//               <p className="text-sm text-muted-foreground">{COMPANY.address}</p>
//             </div>
//           </Card>
//           <Card className="p-6 flex items-start gap-4">
//             <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
//               <Phone className="w-6 h-6 text-primary" />
//             </div>
//             <div>
//               <h3 className="font-semibold mb-1">Call Us</h3>
//               <a href={`tel:${COMPANY.phone}`} className="text-sm text-muted-foreground hover:text-primary transition-colors block">{COMPANY.phone}</a>
//               <p className="text-sm text-muted-foreground">{COMPANY.workingHours}</p>
//             </div>
//           </Card>
//           <Card className="p-6 flex items-start gap-4">
//             <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
//               <Mail className="w-6 h-6 text-primary" />
//             </div>
//             <div>
//               <h3 className="font-semibold mb-1">Email Us</h3>
//               <a href={`mailto:${COMPANY.email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">{COMPANY.email}</a>
//             </div>
//           </Card>
//         </div>
//       </div>
//     </section>
//   );
// }




// import { Card } from '@/components/ui/card';
// import { MapPin, Phone, Mail } from 'lucide-react';
// // import { COMPANY } from '@/constants';

// export function ContactInfoSection() {
//   return (
//     <section className="py-16 lg:py-20">
//       <div className="container mx-auto px-4">
//         <div className="grid lg:grid-cols-3 gap-5">
//           <Card className="p-6 flex items-start gap-4">
//             <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
//               <MapPin className="w-6 h-6 text-primary" />
//             </div>
//             <div>
//               <h3 className="font-semibold mb-1">Visit Us</h3>
//               <p className="text-sm text-muted-foreground">
//                 MV Business Solutions Pvt Ltd.
//                 <br />
//                 P.N. Shetty Complex, Akshayanagar,
//                 <br />
//                 Bengaluru
//               </p>
//             </div>
//           </Card>
//           <Card className="p-6 flex items-start gap-4">
//             <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
//               <Phone className="w-6 h-6 text-primary" />
//             </div>
//             <div>
//               <h3 className="font-semibold mb-1">Call Us</h3>
//               <a href="tel:+919686521214" className="text-sm text-muted-foreground hover:text-primary transition-colors block">
//                 +91 96865 21214
//               </a>
//               <p className="text-sm text-muted-foreground">Mon-Fri 9:00 AM - 6:00 PM</p>
//             </div>
//           </Card>
//           <Card className="p-6 flex items-start gap-4">
//             <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
//               <Mail className="w-6 h-6 text-primary" />
//             </div>
//             <div>
//               <h3 className="font-semibold mb-1">Email Us</h3>
//               <a href="mailto:venkatesh@mvbsolutions.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
//                 venkatesh@mvbsolutions.com
//               </a>
//             </div>
//           </Card>
//         </div>
//       </div>
//     </section>
//   );
// }



import { Card } from '@/components/ui/card';
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';

export function ContactInfoSection() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-orange-500/5 via-yellow-400/5 to-blue-600/5" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="group p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
            {/* Gradient hover effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-orange-500 via-yellow-400 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br from-pink-500/20 to-blue-600/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            
            <div className="flex items-start gap-5 relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 via-orange-500 via-yellow-400 to-blue-600 p-[2px] shadow-lg shadow-pink-500/20 group-hover:shadow-pink-500/40 transition-shadow duration-500">
                <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center group-hover:bg-transparent transition-colors duration-500">
                  <MapPin className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors duration-500" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 bg-clip-text text-transparent">
                  Visit Us
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-light tracking-wide">
                  MV Business Solutions Pvt Ltd.
                  <br />
                  P.N. Shetty Complex, Akshayanagar,
                  <br />
                  Bengaluru
                </p>
                <div className="mt-3 flex items-center gap-2 text-sm font-medium text-transparent bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
                  <span>Get Directions</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="group p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-orange-500 via-yellow-400 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            
            <div className="flex items-start gap-5 relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 via-orange-500 via-yellow-400 to-blue-600 p-[2px] shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow duration-500">
                <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center group-hover:bg-transparent transition-colors duration-500">
                  <Phone className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors duration-500" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 bg-clip-text text-transparent">
                  Call Us
                </h3>
                <a 
                  href="tel:+919686521214" 
                  className="text-base font-semibold text-gray-800 hover:text-transparent hover:bg-gradient-to-r hover:from-pink-500 hover:to-blue-600 hover:bg-clip-text transition-all duration-300 block"
                >
                  +91 96865 21214
                </a>
                <p className="text-sm text-gray-500 mt-1 font-light tracking-wide">Mon-Fri 9:00 AM - 6:00 PM</p>
                <div className="mt-3 flex items-center gap-2 text-sm font-medium text-transparent bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
                  <span>Call Now</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="group p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-orange-500 via-yellow-400 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br from-blue-600/20 to-yellow-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            
            <div className="flex items-start gap-5 relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 via-orange-500 via-yellow-400 to-blue-600 p-[2px] shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/40 transition-shadow duration-500">
                <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center group-hover:bg-transparent transition-colors duration-500">
                  <Mail className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors duration-500" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 bg-clip-text text-transparent">
                  Email Us
                </h3>
                <a 
                  href="mailto:venkatesh@mvbsolutions.com" 
                  className="text-sm text-gray-600 hover:text-transparent hover:bg-gradient-to-r hover:from-pink-500 hover:to-blue-600 hover:bg-clip-text transition-all duration-300 font-medium"
                >
                  venkatesh@mvbsolutions.com
                </a>
                <div className="mt-3 flex items-center gap-2 text-sm font-medium text-transparent bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
                  <span>Send Email</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}