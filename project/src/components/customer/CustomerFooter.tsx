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
//                   src={`${baseurl}/${settings.logo_url}`} 
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



// import { Link } from 'react-router-dom';
// import { NAV_LINKS, COMPANY } from '@/constants';
// import { categories } from '@/data';
// import { useSettings } from '@/hooks/use-settings';
// import logo from '@/asstes/mvblogo.png'; // Import your logo
// import {baseurl} from '../../Baseurl/baseurl'

// export function CustomerFooter() {
//   const { settings } = useSettings();

//   return (
//     <footer className="mt-20">
//       {/* Gradient Top Border */}
//       <div className="h-1.5 bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600"></div>
      
//       {/* Main Footer with White Background */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="container mx-auto px-6 md:px-8 lg:px-12 py-12">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {/* Company Info */}
//             <div>
//               <div className="flex flex-col items-start gap-3 mb-4">
//                 {settings?.logo_url ? (
//                   <img 
//                     src={`${baseurl}/{settings.logo_url}`} 
//                     alt={settings.short_name || 'Logo'}
//                     className="w-32 h-32 object-contain"
//                   />
//                 ) : (
//                   <img 
//                     src={logo} 
//                     alt={settings?.short_name || 'Logo'}
//                     className="w-32 h-32 object-contain"
//                   />
//                 )}
//                 <div>
//                   <div className="font-bold text-xl text-gray-800">
//                     {settings?.short_name || ''}
//                   </div>
//                 </div>
//               </div>
//               <p className="text-sm text-gray-600 leading-relaxed mb-4">
//                 {settings?.description || COMPANY.description}
//               </p>

//               <div className="flex gap-3">
//                 {(['linkedin', 'twitter', 'facebook', 'youtube'] as const).map((s) => (
//                   <a
//                     key={s}
//                     href={settings?.[s as keyof typeof settings] as string || COMPANY.social[s]}
//                     className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gradient-to-r hover:from-pink-500 hover:via-orange-500 hover:to-blue-600 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md text-gray-600"
//                     aria-label={s}
//                   >
//                     <span className="text-xs font-bold uppercase">{s[0]}</span>
//                   </a>
//                 ))}
//               </div>
//             </div>

//             {/* Quick Links */}
//             <div>
//               <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-transparent bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 bg-clip-text">
//                 Quick Links
//               </h3>
//               <ul className="space-y-2.5">
//                 {NAV_LINKS.map((link) => (
//                   <li key={link.path}>
//                     <Link 
//                       to={link.path} 
//                       className="text-sm text-gray-600 hover:text-gray-900 hover:translate-x-1 transition-all duration-200 inline-block"
//                     >
//                       {link.label}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Categories */}
//             <div>
//               <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-transparent bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 bg-clip-text">
//                 Categories
//               </h3>
//               <ul className="space-y-2.5">
//                 {categories.slice(0, 6).map((cat) => (
//                   <li key={cat.id}>
//                     <Link 
//                       to={`/products?category=${cat.slug}`} 
//                       className="text-sm text-gray-600 hover:text-gray-900 hover:translate-x-1 transition-all duration-200 inline-block"
//                     >
//                       {cat.name}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Contact Info */}
//             <div>
//               <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-transparent bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 bg-clip-text">
//                 Contact Us
//               </h3>
//               <ul className="space-y-3 text-sm text-gray-600">
//                 <li className="flex items-start gap-2 hover:text-gray-900 transition-colors duration-200">
//                   <span className="shrink-0 mt-0.5">📍</span>
//                   <span>{settings?.address || COMPANY.address}</span>
//                 </li>
//                 <li className="flex items-center gap-2 hover:text-gray-900 transition-colors duration-200">
//                   <span>📞</span>
//                   <a href={`tel:${settings?.phone || COMPANY.phone}`} className="hover:text-pink-500 transition-colors duration-200">
//                     {settings?.phone || COMPANY.phone}
//                   </a>
//                 </li>
//                 <li className="flex items-center gap-2 hover:text-gray-900 transition-colors duration-200">
//                   <span>✉️</span>
//                   <a href={`mailto:${settings?.email || COMPANY.email}`} className="hover:text-orange-500 transition-colors duration-200">
//                     {settings?.email || COMPANY.email}
//                   </a>
//                 </li>
//                 <li className="flex items-center gap-2 hover:text-gray-900 transition-colors duration-200">
//                   <span>🕐</span>
//                   <span>{settings?.working_hours || COMPANY.workingHours}</span>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           {/* Bottom Bar */}
//           <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
//             <p className="text-xs text-gray-500">
//               © {new Date().getFullYear()} {settings?.name || COMPANY.name}. All rights reserved. | GSTIN: {settings?.gstin || COMPANY.gst}
//             </p>
//             <div className="flex gap-6 text-xs">
//               <Link to="/about" className="text-gray-500 hover:text-pink-500 transition-colors duration-200">
//                 Privacy Policy
//               </Link>
//               <Link to="/about" className="text-gray-500 hover:text-orange-500 transition-colors duration-200">
//                 Terms of Service
//               </Link>
//               <Link to="/admin" className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
//                 Admin Login
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }



// import { Link } from 'react-router-dom';
// import { NAV_LINKS, COMPANY } from '@/constants';
// import { categories } from '@/data';
// import { useSettings } from '@/hooks/use-settings';
// import logo from '@/asstes/mvblogo.png'; // Import your logo
// import {baseurl} from '../../Baseurl/baseurl'

// export function CustomerFooter() {
//   const { settings } = useSettings();

//   return (
//     <footer className="mt-20">
//       {/* Gradient Top Border */}
//       <div className="h-1.5 bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600"></div>
      
//       {/* Main Footer with White Background */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="container mx-auto px-6 md:px-8 lg:px-12 py-12">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {/* Company Info */}
//             <div>
//               <div className="flex flex-col items-start gap-3 mb-4">
//                 {settings?.logo_url ? (
//                   <img 
//                     src={`${baseurl}${settings.logo_url}`}  
//                     alt={settings.short_name || 'Logo'}
//                     className="w-32 h-32 object-contain"
//                   />
//                 ) : (
//                   <img 
//                     src={logo} 
//                     alt={settings?.short_name || 'Logo'}
//                     className="w-32 h-32 object-contain"
//                   />
//                 )}
//                 <div>
//                   <div className="font-bold text-xl text-gray-800">
//                     {settings?.short_name || ''}
//                   </div>
//                 </div>
//               </div>
//               <p className="text-sm text-gray-600 leading-relaxed mb-4">
//                 {settings?.description || COMPANY.description}
//               </p>

//               <div className="flex gap-3">
//                 {(['linkedin', 'twitter', 'facebook', 'youtube'] as const).map((s) => (
//                   <a
//                     key={s}
//                     href={settings?.[s as keyof typeof settings] as string || COMPANY.social[s]}
//                     className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gradient-to-r hover:from-pink-500 hover:via-orange-500 hover:to-blue-600 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md text-gray-600"
//                     aria-label={s}
//                   >
//                     <span className="text-xs font-bold uppercase">{s[0]}</span>
//                   </a>
//                 ))}
//               </div>
//             </div>

//             {/* Quick Links */}
//             <div>
//               <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-transparent bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 bg-clip-text">
//                 Quick Links
//               </h3>
//               <ul className="space-y-2.5">
//                 {NAV_LINKS.map((link) => (
//                   <li key={link.path}>
//                     <Link 
//                       to={link.path} 
//                       className="text-sm text-gray-600 hover:text-gray-900 hover:translate-x-1 transition-all duration-200 inline-block"
//                     >
//                       {link.label}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Categories */}
//             <div>
//               <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-transparent bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 bg-clip-text">
//                 Categories
//               </h3>
//               <ul className="space-y-2.5">
//                 {categories.slice(0, 6).map((cat) => (
//                   <li key={cat.id}>
//                     <Link 
//                       to={`/products?category=${cat.slug}`} 
//                       className="text-sm text-gray-600 hover:text-gray-900 hover:translate-x-1 transition-all duration-200 inline-block"
//                     >
//                       {cat.name}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Contact Info */}
//             <div>
//               <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-transparent bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 bg-clip-text">
//                 Contact Us
//               </h3>
//               <ul className="space-y-3 text-sm text-gray-600">
//                 <li className="flex items-start gap-2 hover:text-gray-900 transition-colors duration-200">
//                   <span className="shrink-0 mt-0.5">📍</span>
//                   <span>{settings?.address || COMPANY.address}</span>
//                 </li>
//                 <li className="flex items-center gap-2 hover:text-gray-900 transition-colors duration-200">
//                   <span>📞</span>
//                   <a href={`tel:${settings?.phone || COMPANY.phone}`} className="hover:text-pink-500 transition-colors duration-200">
//                     {settings?.phone || COMPANY.phone}
//                   </a>
//                 </li>
//                 <li className="flex items-center gap-2 hover:text-gray-900 transition-colors duration-200">
//                   <span>✉️</span>
//                   <a href={`mailto:${settings?.email || COMPANY.email}`} className="hover:text-orange-500 transition-colors duration-200">
//                     {settings?.email || COMPANY.email}
//                   </a>
//                 </li>
//                 <li className="flex items-center gap-2 hover:text-gray-900 transition-colors duration-200">
//                   <span>🕐</span>
//                   <span>{settings?.working_hours || COMPANY.workingHours}</span>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           {/* Bottom Bar */}
//           <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
//             <p className="text-xs text-gray-500">
//               © {new Date().getFullYear()} {settings?.name || COMPANY.name}. All rights reserved. | GSTIN: {settings?.gstin || COMPANY.gst}
//             </p>
//             <div className="flex gap-6 text-xs">
//               <Link to="/about" className="text-gray-500 hover:text-pink-500 transition-colors duration-200">
//                 Privacy Policy
//               </Link>
//               <Link to="/about" className="text-gray-500 hover:text-orange-500 transition-colors duration-200">
//                 Terms of Service
//               </Link>
//               <Link to="/admin" className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
//                 Admin Login
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }



// import { Link } from 'react-router-dom';
// import { NAV_LINKS, COMPANY } from '@/constants';
// import { categories } from '@/data';
// import { useSettings } from '@/hooks/use-settings';
// import logo from '@/asstes/mvblogo.png';
// import { baseurl } from '../../Baseurl/baseurl';
// import { 
//   FaLinkedin, 
//   FaTwitter, 
//   FaFacebook, 
//   FaYoutube,
//   FaMapMarkerAlt,
//   FaPhone,
//   FaEnvelope,
//   FaClock
// } from 'react-icons/fa';

// export function CustomerFooter() {
//   const { settings } = useSettings();

//   return (
//     <footer className="mt-20">
//       {/* Gradient Top Border */}
//       <div className="h-1.5 bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600"></div>
      
//       {/* Main Footer with White Background */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="container mx-auto px-6 md:px-8 lg:px-12 py-12">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {/* Company Info */}
//             <div>
//               <div className="flex flex-col items-start gap-3 mb-4">
//                 {settings?.logo_url ? (
//                   <img 
//                     src={`${baseurl}${settings.logo_url}`}  
//                     alt={settings.short_name || 'Logo'}
//                     className="w-32 h-32 object-contain"
//                   />
//                 ) : (
//                   <img 
//                     src={logo} 
//                     alt={settings?.short_name || 'Logo'}
//                     className="w-32 h-32 object-contain"
//                   />
//                 )}
//                 <div>
//                   <div className="font-bold text-xl text-gray-800">
//                     {settings?.short_name || ''}
//                   </div>
//                 </div>
//               </div>
//               <p className="text-sm text-gray-600 leading-relaxed mb-4">
//                 {settings?.description || COMPANY.description}
//               </p>

//               <div className="flex gap-3">
//                 {[
//                   { icon: FaLinkedin, key: 'linkedin', color: 'hover:text-[#0077b5]' },
//                   { icon: FaTwitter, key: 'twitter', color: 'hover:text-[#1DA1F2]' },
//                   { icon: FaFacebook, key: 'facebook', color: 'hover:text-[#1877F2]' },
//                   { icon: FaYoutube, key: 'youtube', color: 'hover:text-[#FF0000]' }
//                 ].map(({ icon: Icon, key, color }) => (
//                   <a
//                     key={key}
//                     href={settings?.[key as keyof typeof settings] as string || COMPANY.social[key as keyof typeof COMPANY.social]}
//                     className={`w-9 h-9 rounded-lg bg-gray-100 hover:bg-gradient-to-r hover:from-pink-500 hover:via-orange-500 hover:to-blue-600 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-md text-gray-600 ${color}`}
//                     aria-label={key}
//                   >
//                     <Icon className="w-4 h-4" />
//                   </a>
//                 ))}
//               </div>
//             </div>

//             {/* Quick Links */}
//             <div>
//               <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-transparent bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 bg-clip-text">
//                 Quick Links
//               </h3>
//               <ul className="space-y-2.5">
//                 {NAV_LINKS.map((link) => (
//                   <li key={link.path}>
//                     <Link 
//                       to={link.path} 
//                       className="text-sm text-gray-600 hover:text-gray-900 hover:translate-x-1 transition-all duration-200 inline-block"
//                     >
//                       {link.label}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Categories */}
//             <div>
//               <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-transparent bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 bg-clip-text">
//                 Categories
//               </h3>
//               <ul className="space-y-2.5">
//                 {categories.slice(0, 6).map((cat) => (
//                   <li key={cat.id}>
//                     <Link 
//                       to={`/products?category=${cat.slug}`} 
//                       className="text-sm text-gray-600 hover:text-gray-900 hover:translate-x-1 transition-all duration-200 inline-block"
//                     >
//                       {cat.name}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Contact Info */}
//             <div>
//               <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-transparent bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 bg-clip-text">
//                 Contact Us
//               </h3>
//               <ul className="space-y-3 text-sm text-gray-600">
//                 <li className="flex items-start gap-3 hover:text-gray-900 transition-colors duration-200">
//                   <FaMapMarkerAlt className="w-4 h-4 shrink-0 mt-0.5 text-pink-500" />
//                   <span>{settings?.address || COMPANY.address}</span>
//                 </li>
//                 <li className="flex items-center gap-3 hover:text-gray-900 transition-colors duration-200">
//                   <FaPhone className="w-4 h-4 shrink-0 text-orange-500" />
//                   <a href={`tel:${settings?.phone || COMPANY.phone}`} className="hover:text-pink-500 transition-colors duration-200">
//                     {settings?.phone || COMPANY.phone}
//                   </a>
//                 </li>
//                 <li className="flex items-center gap-3 hover:text-gray-900 transition-colors duration-200">
//                   <FaEnvelope className="w-4 h-4 shrink-0 text-yellow-500" />
//                   <a href={`mailto:${settings?.email || COMPANY.email}`} className="hover:text-orange-500 transition-colors duration-200">
//                     {settings?.email || COMPANY.email}
//                   </a>
//                 </li>
//                 <li className="flex items-center gap-3 hover:text-gray-900 transition-colors duration-200">
//                   <FaClock className="w-4 h-4 shrink-0 text-blue-500" />
//                   <span>{settings?.working_hours || COMPANY.workingHours}</span>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           {/* Bottom Bar */}
//           <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
//             <p className="text-xs text-gray-500">
//               © {new Date().getFullYear()} {settings?.name || COMPANY.name}. All rights reserved. | GSTIN: {settings?.gstin || COMPANY.gst}
//             </p>
//             <div className="flex gap-6 text-xs">
//               <Link to="/about" className="text-gray-500 hover:text-pink-500 transition-colors duration-200">
//                 Privacy Policy
//               </Link>
//               <Link to="/about" className="text-gray-500 hover:text-orange-500 transition-colors duration-200">
//                 Terms of Service
//               </Link>
//               <Link to="/admin" className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
//                 Admin Login
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }

import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { NAV_LINKS, COMPANY } from '@/constants';
import { useSettings } from '@/hooks/use-settings';
import logo from '@/asstes/mvblogo.png';
import { baseurl } from '../../Baseurl/baseurl';
import { 
  FaLinkedin, 
  FaFacebook, 
  FaYoutube,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaArrowRight
} from 'react-icons/fa';

import { FaXTwitter } from 'react-icons/fa6';


// Define the Category type
interface Category {
  id: number | string;
  category_name: string;
  // Add other properties if your category object has more fields
}

// Define the API response type
interface CategoriesResponse {
  success: boolean;
  data: Category[];
  message?: string;
}

export function CustomerFooter() {
  const { settings } = useSettings();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseurl}/api/categories/`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: CategoriesResponse = await response.json();
        
        if (data.success) {
          setCategories(data.data);
          setError(null);
        } else {
          throw new Error(data.message || 'Failed to fetch categories');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Type-safe error handling
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <footer className="mt-20">
      {/* Animated Gradient Top Border */}
      <div className="h-1.5 bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 animate-gradient bg-[length:200%_auto]"></div>
      
      {/* Main Footer with Animated Gradient Background */}
      <div className="bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 animate-gradient bg-[length:200%_auto] border-b border-gray-200">
        <div className="container mx-auto px-6 md:px-8 lg:px-12 py-12 backdrop-blur-sm bg-white/90">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex flex-col items-start gap-3">
                {settings?.logo_url ? (
                  <img 
                    src={`${baseurl}${settings.logo_url}`}  
                    alt={settings.short_name || 'Logo'}
                    className="w-32 h-32 object-contain transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <img 
                    src={logo} 
                    alt={settings?.short_name || 'Logo'}
                    className="w-32 h-32 object-contain transition-transform duration-300 hover:scale-105"
                  />
                )}
                <div className="font-bold text-2xl bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 bg-clip-text text-transparent">
                  {settings?.short_name || 'MVB Solutions'}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 leading-relaxed">
                {settings?.description || COMPANY.description}
              </p>

              {/* Social Icons with ACTUAL BRAND COLORS */}
              <div className="flex gap-3 pt-2">
                <a
                  href={settings?.linkedin || COMPANY.social.linkedin}
                  className="w-10 h-10 rounded-full bg-[#0077b5] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-[#005e8c] text-white"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin className="w-4 h-4" />
                </a>
                <a
                  href={settings?.twitter || COMPANY.social.twitter}
                  className="w-10 h-10 rounded-full bg-[#000000] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-[#333333] text-white"
                  aria-label="X (Twitter)"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaXTwitter className="w-4 h-4" />
                </a>
                <a
                  href={settings?.facebook || COMPANY.social.facebook}
                  className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-[#0a5fc9] text-white"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook className="w-4 h-4" />
                </a>
                <a
                  href={settings?.youtube || COMPANY.social.youtube}
                  className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-[#cc0000] text-white"
                  aria-label="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaYoutube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-5 text-sm uppercase tracking-wider text-transparent bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 bg-clip-text">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path} 
                      className="text-sm text-gray-600 hover:text-gray-900 group flex items-center gap-2 transition-all duration-200"
                    >
                      <FaArrowRight className="w-3 h-3 text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories - Now fetching from API */}
            <div>
              <h3 className="font-semibold mb-5 text-sm uppercase tracking-wider text-transparent bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 bg-clip-text">
                Categories
              </h3>
              
              {/* Loading State */}
              {loading && (
                <div className="text-sm text-gray-500">
                  Loading categories...
                </div>
              )}
              
              {/* Error State */}
              {error && (
                <div className="text-sm text-red-500">
                  Failed to load categories
                </div>
              )}
              
              {/* Categories List */}
              {!loading && !error && (
                <ul className="space-y-3">
                  {categories.slice(0, 6).map((cat) => (
                    <li key={cat.id}>
                      <Link 
                        to={`/products?category=${cat.category_name.toLowerCase().replace(/\s+/g, '-')}`} 
                        className="text-sm text-gray-600 hover:text-gray-900 group flex items-center gap-2 transition-all duration-200"
                      >
                        <FaArrowRight className="w-3 h-3 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">
                          {cat.category_name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Contact Info - Updated with specific details and proper icons */}
            <div>
              <h3 className="font-semibold mb-5 text-sm uppercase tracking-wider text-transparent bg-gradient-to-r from-pink-500 via-orange-500 to-blue-600 bg-clip-text">
                Get In Touch
              </h3>
              <ul className="space-y-4 text-sm text-gray-600">
                <li className="flex items-start gap-3 group hover:text-gray-900 transition-colors duration-200">
                  <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center shrink-0 text-white">
                    <FaMapMarkerAlt className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-relaxed">
                    MV Business Solutions Pvt Ltd.<br />
                    P.N. Shetty Complex, Akshayanagar,<br />
                    Bengaluru
                  </span>
                </li>
                <li className="flex items-center gap-3 group hover:text-gray-900 transition-colors duration-200">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0 text-white">
                    <FaPhone className="w-3.5 h-3.5 transform scale-x-[-1]" />
                  </div>
                  <a href="tel:+919686521214" className="hover:text-blue-500 transition-colors duration-200 font-medium">
                    +91 96865 21214
                  </a>
                </li>
                <li className="flex items-center gap-3 group hover:text-gray-900 transition-colors duration-200">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shrink-0 text-white">
                    <FaEnvelope className="w-3.5 h-3.5" />
                  </div>
                  <a href="mailto:venkatesh@mvbsolutions.com" className="hover:text-red-500 transition-colors duration-200 font-medium">
                    venkatesh@mvbsolutions.com
                  </a>
                </li>
                <li className="flex items-center gap-3 group hover:text-gray-900 transition-colors duration-200">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shrink-0 text-white">
                    <FaClock className="w-3.5 h-3.5" />
                  </div>
                  <span>{settings?.working_hours || 'Mon-Sat: 9:00 AM - 6:00 PM'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar - Updated with specific company details */}
          <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 text-center md:text-left">
              © {new Date().getFullYear()} MV Business Solutions Pvt Ltd. All rights reserved. | GSTIN: 29AABCM1234D1ZP
            </p>
            <div className="flex gap-6 text-xs flex-wrap justify-center">
              <Link to="/privacy" className="text-gray-500 hover:text-pink-500 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-orange-500 transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/admin" className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </footer>
  );
}