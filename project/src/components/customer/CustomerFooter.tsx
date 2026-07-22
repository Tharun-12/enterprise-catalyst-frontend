// import { Link } from 'react-router-dom';
// import { NAV_LINKS, COMPANY } from '@/constants';
// import { categories } from '@/data';
// import { useSettings } from '@/hooks/use-settings';

// export function CustomerFooter() {
//   const { settings } = useSettings();

//   return (
//     <footer className="bg-foreground text-background mt-20">
//       <div className="container mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           <div>
//             <div className="flex items-center gap-2.5 mb-4">
//               {settings?.logo_url ? (
//                 <img 
//                   src={`http://localhost:5000${settings.logo_url}`} 
//                   alt={settings.short_name || 'Logo'}
//                   className="w-10 h-10 object-contain"
//                 />
//               ) : (
//                 <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
//                   {settings?.short_name?.charAt(0) || 'MVB'}
//                 </div>
//               )}
//               <div>
//                 <div className="font-bold">{settings?.short_name || 'MV Business Solutions'}</div>
//                 <div className="text-xs opacity-60">Enterprise E-Catalog</div>
//               </div>
//             </div>
//             <p className="text-sm opacity-70 leading-relaxed mb-4">
//               {settings?.description || COMPANY.description}
//             </p>

//             <div className="flex gap-3">
//               {(['linkedin', 'twitter', 'facebook', 'youtube'] as const).map((s) => (
//                 <a
//                   key={s}
//                   href={settings?.[s as keyof typeof settings] as string || COMPANY.social[s]}
//                   className="w-9 h-9 rounded-lg bg-white/10 hover:bg-primary flex items-center justify-center transition-colors"
//                   aria-label={s}
//                 >
//                   <span className="text-xs font-bold uppercase">{s[0]}</span>
//                 </a>
//               ))}
//             </div>
//           </div>

//           <div>
//             <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-90">Quick Links</h3>
//             <ul className="space-y-2.5">
//               {NAV_LINKS.map((link) => (
//                 <li key={link.path}>
//                   <Link to={link.path} className="text-sm opacity-70 hover:opacity-100 hover:text-accent transition-colors">
//                     {link.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div>
//             <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-90">Categories</h3>
//             <ul className="space-y-2.5">
//               {categories.slice(0, 6).map((cat) => (
//                 <li key={cat.id}>
//                   <Link to={`/products?category=${cat.slug}`} className="text-sm opacity-70 hover:opacity-100 hover:text-accent transition-colors">
//                     {cat.name}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div>
//             <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider opacity-90">Contact Us</h3>
//             <ul className="space-y-3 text-sm opacity-70">
//               <li className="flex items-start gap-2">
//                 <span className="shrink-0 mt-0.5">📍</span>
//                 <span>{settings?.address || COMPANY.address}</span>
//               </li>
//               <li className="flex items-center gap-2">
//                 <span>📞</span>
//                 <a href={`tel:${settings?.phone || COMPANY.phone}`} className="hover:opacity-100 hover:text-accent transition-colors">
//                   {settings?.phone || COMPANY.phone}
//                 </a>
//               </li>
//               <li className="flex items-center gap-2">
//                 <span>✉️</span>
//                 <a href={`mailto:${settings?.email || COMPANY.email}`} className="hover:opacity-100 hover:text-accent transition-colors">
//                   {settings?.email || COMPANY.email}
//                 </a>
//               </li>
//               <li className="flex items-center gap-2">
//                 <span>🕐</span>
//                 <span>{settings?.working_hours || COMPANY.workingHours}</span>
//               </li>
//             </ul>
//           </div>
//         </div>

//         <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
//           <p className="text-xs opacity-60">
//             © {new Date().getFullYear()} {settings?.name || COMPANY.name}. All rights reserved. | GSTIN: {settings?.gstin || COMPANY.gst}
//           </p>
//           <div className="flex gap-4 text-xs opacity-60">
//             <Link to="/about" className="hover:opacity-100">Privacy Policy</Link>
//             <Link to="/about" className="hover:opacity-100">Terms of Service</Link>
//             <Link to="/admin" className="hover:opacity-100">Admin Login</Link>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }



import { Link } from 'react-router-dom';
import { NAV_LINKS, COMPANY } from '@/constants';
import { categories } from '@/data';
import { useSettings } from '@/hooks/use-settings';
import logo from '@/asstes/mvblogo.png'; // Import your logo

export function CustomerFooter() {
  const { settings } = useSettings();

  return (
    <footer className="mt-20">
      {/* Gradient Top Border */}
      <div className="h-1.5 bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600"></div>
      
      {/* Main Footer with White Background */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex flex-col items-start gap-3 mb-4">
                {settings?.logo_url ? (
                  <img 
                    src={`http://localhost:5000${settings.logo_url}`} 
                    alt={settings.short_name || 'Logo'}
                    className="w-32 h-32 object-contain"
                  />
                ) : (
                  <img 
                    src={logo} 
                    alt={settings?.short_name || 'Logo'}
                    className="w-32 h-32 object-contain"
                  />
                )}
                <div>
                  <div className="font-bold text-xl text-gray-800">
                    {settings?.short_name || ''}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {settings?.description || COMPANY.description}
              </p>

              <div className="flex gap-3">
                {(['linkedin', 'twitter', 'facebook', 'youtube'] as const).map((s) => (
                  <a
                    key={s}
                    href={settings?.[s as keyof typeof settings] as string || COMPANY.social[s]}
                    className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gradient-to-r hover:from-pink-500 hover:via-orange-500 hover:to-blue-600 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md text-gray-600"
                    aria-label={s}
                  >
                    <span className="text-xs font-bold uppercase">{s[0]}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-transparent bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 bg-clip-text">
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                {NAV_LINKS.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path} 
                      className="text-sm text-gray-600 hover:text-gray-900 hover:translate-x-1 transition-all duration-200 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-transparent bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 bg-clip-text">
                Categories
              </h3>
              <ul className="space-y-2.5">
                {categories.slice(0, 6).map((cat) => (
                  <li key={cat.id}>
                    <Link 
                      to={`/products?category=${cat.slug}`} 
                      className="text-sm text-gray-600 hover:text-gray-900 hover:translate-x-1 transition-all duration-200 inline-block"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-transparent bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 bg-clip-text">
                Contact Us
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2 hover:text-gray-900 transition-colors duration-200">
                  <span className="shrink-0 mt-0.5">📍</span>
                  <span>{settings?.address || COMPANY.address}</span>
                </li>
                <li className="flex items-center gap-2 hover:text-gray-900 transition-colors duration-200">
                  <span>📞</span>
                  <a href={`tel:${settings?.phone || COMPANY.phone}`} className="hover:text-pink-500 transition-colors duration-200">
                    {settings?.phone || COMPANY.phone}
                  </a>
                </li>
                <li className="flex items-center gap-2 hover:text-gray-900 transition-colors duration-200">
                  <span>✉️</span>
                  <a href={`mailto:${settings?.email || COMPANY.email}`} className="hover:text-orange-500 transition-colors duration-200">
                    {settings?.email || COMPANY.email}
                  </a>
                </li>
                <li className="flex items-center gap-2 hover:text-gray-900 transition-colors duration-200">
                  <span>🕐</span>
                  <span>{settings?.working_hours || COMPANY.workingHours}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} {settings?.name || COMPANY.name}. All rights reserved. | GSTIN: {settings?.gstin || COMPANY.gst}
            </p>
            <div className="flex gap-6 text-xs">
              <Link to="/about" className="text-gray-500 hover:text-pink-500 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/about" className="text-gray-500 hover:text-orange-500 transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/admin" className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}