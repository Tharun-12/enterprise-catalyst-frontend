// // components/about/AboutStory.tsx
// import { SectionHeader } from '@/components/shared';
// import { COMPANY } from '@/constants';

// export function AboutStory() {
//   return (
//     <section className="mb-12">
//       <div className="grid lg:grid-cols-2 gap-8 items-center">
//         <div>
//           <SectionHeader title="Our Story" subtitle="From a small office in Ahmedabad to a pan-India enterprise solutions provider." />
//           <div className="space-y-4 text-muted-foreground leading-relaxed">
//             <p>
//               MV Business Solutions (MVB) was founded in {COMPANY.established} with a simple mission: to provide businesses with access to world-class security, power, and networking products. What started as a small distribution office in Ahmedabad has grown into a trusted enterprise solutions provider serving 500+ clients across India.
//             </p>
//             <p>
//               Over the years, we've forged partnerships with 15+ global brands including Hikvision, Schneider Electric, Cisco, Siemens, and ABB. Our team of certified technicians and consultants has successfully delivered projects across industries — from hospitals and schools to factories and IT parks.
//             </p>
//             <p>
//               Today, MVB stands as a single-source solution provider for enterprise security, power backup, networking, electrical, fire safety, and solar energy needs. Our commitment to quality, genuine products, and professional service has made us the preferred partner for businesses across India.
//             </p>
//           </div>
//         </div>
//         <div className="grid grid-cols-2 gap-4">
//           <img src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Office" className="rounded-2xl w-full h-48 object-cover shadow-lg" />
//           <img src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Team" className="rounded-2xl w-full h-48 object-cover shadow-lg mt-8" />
//           <img src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Meeting" className="rounded-2xl w-full h-48 object-cover shadow-lg" />
//           <img src="https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Work" className="rounded-2xl w-full h-48 object-cover shadow-lg mt-8" />
//         </div>
//       </div>
//     </section>
//   );
// }



// components/about/AboutStory.tsx
import { SectionHeader } from '@/components/shared';
import { COMPANY } from '@/constants';

export function AboutStory() {
  return (
    <section className="mb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <div>
            <div className="relative">
              {/* Decorative gradient accent */}
              <div className="absolute -left-4 top-0 w-1 h-16 bg-gradient-to-b from-pink-500 via-orange-500 via-yellow-400 to-blue-600 rounded-full" />
              
              <SectionHeader 
                title="Our Story" 
                subtitle="From a small office in Ahmedabad to a pan-India enterprise solutions provider." 
              />
            </div>
            
            <div className="space-y-4 text-gray-600 leading-relaxed mt-6">
              <p className="relative pl-6 border-l-2 border-pink-500">
                MV Business Solutions (MVB) was founded in {COMPANY.established} with a simple mission: to provide businesses with access to world-class security, power, and networking products. What started as a small distribution office in Ahmedabad has grown into a trusted enterprise solutions provider serving 500+ clients across India.
              </p>
              <p className="pl-6 border-l-2 border-orange-500">
                Over the years, we've forged partnerships with 15+ global brands including Hikvision, Schneider Electric, Cisco, Siemens, and ABB. Our team of certified technicians and consultants has successfully delivered projects across industries — from hospitals and schools to factories and IT parks.
              </p>
              <p className="pl-6 border-l-2 border-blue-500 bg-gradient-to-r from-pink-50 via-orange-50 to-blue-50 p-4 rounded-xl">
                Today, MVB stands as a single-source solution provider for enterprise security, power backup, networking, electrical, fire safety, and solar energy needs. Our commitment to quality, genuine products, and professional service has made us the preferred partner for businesses across India.
              </p>
            </div>
          </div>

          {/* Right Images - Equal Grid */}
          <div className="relative">
            {/* Decorative gradient circles */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-r from-pink-500/10 via-orange-500/10 to-yellow-400/10 blur-2xl" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-gradient-to-r from-yellow-400/10 via-blue-600/10 to-pink-500/10 blur-2xl" />
            
            <div className="grid grid-cols-2 gap-4 relative">
              {/* Top Left */}
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 group">
                <img 
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Office" 
                  className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <span className="absolute bottom-3 left-3 text-white text-xs font-medium bg-black/30 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  Our Office
                </span>
              </div>
              
              {/* Top Right */}
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 group">
                <img 
                  src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Team" 
                  className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <span className="absolute bottom-3 left-3 text-white text-xs font-medium bg-black/30 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  Our Team
                </span>
              </div>
              
              {/* Bottom Left */}
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 group">
                <img 
                  src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Meeting" 
                  className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <span className="absolute bottom-3 left-3 text-white text-xs font-medium bg-black/30 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  Client Meeting
                </span>
              </div>
              
              {/* Bottom Right */}
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 group">
                <img 
                  src="https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=600" 
                  alt="Work" 
                  className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <span className="absolute bottom-3 left-3 text-white text-xs font-medium bg-black/30 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  Our Work
                </span>
              </div>
            </div>

            {/* Gradient border accent */}
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 rounded-2xl opacity-10 blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}