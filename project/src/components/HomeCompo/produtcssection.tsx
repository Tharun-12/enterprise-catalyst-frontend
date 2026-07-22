// import {
//   BrainCircuit,
//   Database,
//   ShieldCheck,
//   LockKeyhole,
//   Network,
//   ArrowRight,
// } from "lucide-react";

// const services = [
//   {
//     title: "Artificial Intelligence",
//     icon: BrainCircuit,
//     gradient: "from-violet-500 to-purple-600",
//     products: [
//       "AI Cameras",
//       "Video Analytics",
//       "Face Recognition",
//       "Chatbots",
//       "Automation",
//       "Machine Learning",
//     ],
//   },
//   {
//     title: "Data Infrastructure",
//     icon: Database,
//     gradient: "from-sky-500 to-cyan-600",
//     products: [
//       "Servers",
//       "Storage",
//       "Cloud Infrastructure",
//       "Virtualization",
//       "Hyper Converged",
//       "Backup Systems",
//     ],
//   },
//   {
//     title: "Data Security",
//     icon: ShieldCheck,
//     gradient: "from-emerald-500 to-green-600",
//     products: [
//       "Firewall",
//       "Endpoint Security",
//       "SIEM",
//       "Email Security",
//       "Backup",
//       "Encryption",
//     ],
//   },
//   {
//     title: "Physical Security",
//     icon: LockKeyhole,
//     gradient: "from-orange-500 to-red-500",
//     products: [
//       "CCTV",
//       "Access Control",
//       "Biometric",
//       "Boom Barrier",
//       "Video Door Phone",
//       "Alarm Systems",
//     ],
//   },
//   {
//     title: "Data Cabling",
//     icon: Network,
//     gradient: "from-blue-600 to-indigo-600",
//     products: [
//       "Cat6",
//       "Fiber Optic",
//       "Patch Panels",
//       "Network Rack",
//       "Cable Management",
//       "LAN Solutions",
//     ],
//   },
// ];

// export default function ProductsSection() {
//   return (
//     <section className="py-24 bg-slate-950 text-white">
//       <div className="container mx-auto px-6">

//         <div className="max-w-3xl mx-auto text-center mb-16">
//           <span className="inline-flex rounded-full bg-blue-500/10 border border-blue-500/20 px-5 py-2 text-sm font-medium text-blue-400">
//             Our Expertise
//           </span>

//           <h2 className="mt-6 text-4xl md:text-5xl font-bold">
//             Technology Solutions That Power
//             <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-500 bg-clip-text text-transparent">
//               Modern Enterprises
//             </span>
//           </h2>

//           <p className="mt-6 text-gray-400 text-lg">
//             Delivering secure, scalable, and intelligent technology
//             solutions that help businesses innovate, protect, and grow.
//           </p>
//         </div>

//         <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//           {services.map((service) => {
//             const Icon = service.icon;

//             return (
//               <div
//                 key={service.title}
//                 className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 transition-all duration-500 hover:-translate-y-3 hover:border-blue-500/40 hover:bg-white/10"
//               >
//                 <div
//                   className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${service.gradient}`}
//                 >
//                   <Icon className="h-8 w-8 text-white" />
//                 </div>

//               <h3 className="text-2xl font-semibold mb-6">
//   {service.title}
// </h3>

// <div className="flex flex-wrap gap-3">
//   {service.products.map((product) => (
//     <span
//       key={product}
//       className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition-all duration-300 hover:bg-blue-500 hover:text-white hover:border-blue-500"
//     >
//       {product}
//     </span>
//   ))}
// </div>

// <button className="mt-8 inline-flex items-center gap-2 font-medium text-blue-400 transition-all group-hover:gap-4">
//   Explore Solutions
//   <ArrowRight size={18} />
// </button>

//                 <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-100" />
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }




// import {
//   BrainCircuit,
//   Database,
//   ShieldCheck,
//   LockKeyhole,
//   Network,
//   ArrowRight,
//   LucideIcon,
// } from "lucide-react";

// type Product = {
//   name: string;
//   image: string;
// };

// type Service = {
//   title: string;
//   icon: LucideIcon;
//   gradient: string;
//   products: Product[];
// };

// const services: Service[] = [
//   {
//     title: "Artificial Intelligence",
//     icon: BrainCircuit,
//     gradient: "from-violet-500 to-purple-600",
//     products: [
//       {
//         name: "AI Camera",
//         image:
//           "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "Face Recognition",
//         image:
//           "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "AI NVR",
//         image:
//           "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "Video Analytics",
//         image:
//           "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop",
//       },
//     ],
//   },

//   {
//     title: "Data Infrastructure",
//     icon: Database,
//     gradient: "from-sky-500 to-cyan-600",
//     products: [
//       {
//         name: "Rack Server",
//         image:
//           "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "Storage",
//         image:
//           "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "Cloud Infrastructure",
//         image:
//           "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "Virtualization",
//         image:
//           "https://i.pinimg.com/736x/33/31/3f/33313f981dfdb8d6bb84e09ae01536a0.jpg",
//       },
//     ],
//   },

//   {
//     title: "Data Security",
//     icon: ShieldCheck,
//     gradient: "from-emerald-500 to-green-600",
//     products: [
//       {
//         name: "Firewall",
//         image:
//           "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "Endpoint Security",
//         image:
//           "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "Backup",
//         image:
//           "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "Encryption",
//         image:
//           "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&auto=format&fit=crop",
//       },
//     ],
//   },

//   {
//     title: "Physical Security",
//     icon: LockKeyhole,
//     gradient: "from-orange-500 to-red-500",
//     products: [
//       {
//         name: "CCTV Camera",
//         image:
//           "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "Access Control",
//         image:
//           "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "Boom Barrier",
//         image:
//           "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "Video Door Phone",
//         image:
//           "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?w=600&auto=format&fit=crop",
//       },
//     ],
//   },

//   {
//     title: "Data Cabling",
//     icon: Network,
//     gradient: "from-blue-500 to-indigo-600",
//     products: [
//       {
//         name: "Cat6 Cable",
//         image:
//           "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "Fiber Optic",
//         image:
//           "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "Patch Panel",
//         image:
//           "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "Network Rack",
//         image:
//           "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop",
//       },
//     ],
//   },
// ];

// export default function ProductsSection() {
//   return (
//     <section className="bg-slate-950 py-24 text-white">
//       <div className="container mx-auto px-6">
//         {/* Heading */}

//         <div className="mb-16 text-center">
//           <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-400">
//             Our Products
//           </span>

//           <h2 className="mt-6 text-4xl font-bold md:text-5xl">
//             Enterprise Technology
//             <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">
//               Solutions & Products
//             </span>
//           </h2>

//           <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-400">
//             Discover our complete range of enterprise solutions across AI,
//             Infrastructure, Security, Surveillance and Networking.
//           </p>
//         </div>

//         {/* Services */}

//         <div className="space-y-16">
//           {services.map((service) => {
//             const Icon = service.icon;

//             return (
//               <div
//                 key={service.title}
//                 className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
//               >
//                 {/* Category Header */}

//                 <div className="mb-8 flex items-center gap-4">
//                   <div
//                     className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${service.gradient}`}
//                   >
//                     <Icon className="h-8 w-8 text-white" />
//                   </div>

//                   <div>
//                     <h3 className="text-3xl font-bold">{service.title}</h3>

//                     <p className="text-gray-400">
//                       Explore our latest {service.title.toLowerCase()} products.
//                     </p>
//                   </div>
//                 </div>

//                 {/* Products */}

//                 <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//                   {service.products.map((product) => (
//                     <div
//                       key={product.name}
//                       className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900 transition duration-300 hover:-translate-y-2 hover:border-blue-500"
//                     >
//                       <img
//                         src={product.image}
//                         alt={product.name}
//                         className="h-48 w-full object-cover transition duration-500 group-hover:scale-110"
//                       />

//                       <div className="p-5">
//                         <h4 className="text-lg font-semibold">
//                           {product.name}
//                         </h4>

//                         <button className="mt-4 inline-flex items-center gap-2 text-blue-400 transition hover:gap-3">
//                           View Product
//                           <ArrowRight size={16} />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }



// import {
//   BrainCircuit,
//   Database,
//   ShieldCheck,
//   LockKeyhole,
//   Network,
//   ArrowRight,
//   LucideIcon,
// } from "lucide-react";

// type Product = {
//   name: string;
//   image: string;
// };

// type Service = {
//   title: string;
//   icon: LucideIcon;
//   gradient: string;
//   products: Product[];
// };

// const services: Service[] = [
//   {
//     title: "Artificial Intelligence",
//     icon: BrainCircuit,
//     gradient: "from-pink-500 via-orange-500 to-yellow-400",
//     products: [
//       {
//         name: "AI Camera",
//         image:
//           "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "Face Recognition",
//         image:
//           "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "AI NVR",
//         image:
//           "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "Video Analytics",
//         image:
//           "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop",
//       },
//     ],
//   },

//   {
//     title: "Data Infrastructure",
//     icon: Database,
//     gradient: "from-pink-500 via-orange-500 to-yellow-400",
//     products: [
//       {
//         name: "Rack Server",
//         image:
//           "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "Storage",
//         image:
//           "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "Cloud Infrastructure",
//         image:
//           "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "Virtualization",
//         image:
//           "https://i.pinimg.com/736x/33/31/3f/33313f981dfdb8d6bb84e09ae01536a0.jpg",
//       },
//     ],
//   },

//   {
//     title: "Data Security",
//     icon: ShieldCheck,
//     gradient: "from-pink-500 via-orange-500 to-yellow-400",
//     products: [
//       {
//         name: "Firewall",
//         image:
//           "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "Endpoint Security",
//         image:
//           "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "Backup",
//         image:
//           "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "Encryption",
//         image:
//           "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&auto=format&fit=crop",
//       },
//     ],
//   },

//   {
//     title: "Physical Security",
//     icon: LockKeyhole,
//     gradient: "from-pink-500 via-orange-500 to-yellow-400",
//     products: [
//       {
//         name: "CCTV Camera",
//         image:
//           "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "Access Control",
//         image:
//           "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "Boom Barrier",
//         image:
//           "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "Video Door Phone",
//         image:
//           "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?w=600&auto=format&fit=crop",
//       },
//     ],
//   },

//   {
//     title: "Data Cabling",
//     icon: Network,
//     gradient: "from-pink-500 via-orange-500 to-yellow-400",
//     products: [
//       {
//         name: "Cat6 Cable",
//         image:
//           "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "Fiber Optic",
//         image:
//           "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "Patch Panel",
//         image:
//           "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop",
//       },
//       {
//         name: "Network Rack",
//         image:
//           "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop",
//       },
//     ],
//   },
// ];

// export default function ProductsSection() {
//   return (
//     <section className="bg-white py-24 text-slate-800">
//       <div className="container mx-auto px-6">
//         {/* Heading */}

//         <div className="mb-16 text-center">
//           <span className="rounded-full border border-pink-500/30 bg-pink-500/10 px-5 py-2 text-sm font-medium text-pink-600">
//             Our Products
//           </span>

//           <h2 className="mt-6 text-4xl font-bold md:text-5xl">
//             Enterprise Technology
//             <span className="block bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text text-transparent">
//               Solutions & Products
//             </span>
//           </h2>

//           <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600">
//             Discover our complete range of enterprise solutions across AI,
//             Infrastructure, Security, Surveillance and Networking.
//           </p>
//         </div>

//         {/* Services */}

//         <div className="space-y-16">
//           {services.map((service) => {
//             const Icon = service.icon;

//             return (
//               <div
//                 key={service.title}
//                 className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl transition hover:shadow-2xl"
//               >
//                 {/* Category Header */}

//                 <div className="mb-8 flex items-center gap-4">
//                   <div
//                     className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${service.gradient} shadow-md shadow-pink-500/20`}
//                   >
//                     <Icon className="h-8 w-8 text-white" />
//                   </div>

//                   <div>
//                     <h3 className="text-3xl font-bold text-slate-800">
//                       {service.title}
//                     </h3>

//                     <p className="text-slate-500">
//                       Explore our latest {service.title.toLowerCase()} products.
//                     </p>
//                   </div>
//                 </div>

//                 {/* Products */}

//                 <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//                   {service.products.map((product) => (
//                     <div
//                       key={product.name}
//                       className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-2 hover:border-pink-400 hover:shadow-xl"
//                     >
//                       <img
//                         src={product.image}
//                         alt={product.name}
//                         className="h-48 w-full object-cover transition duration-500 group-hover:scale-110"
//                       />

//                       <div className="p-5">
//                         <h4 className="text-lg font-semibold text-slate-800">
//                           {product.name}
//                         </h4>

//                         <button className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-400 bg-clip-text font-medium text-transparent transition hover:gap-3">
//                           View Product
//                           <ArrowRight size={16} className="text-pink-500" />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }





import {
  BrainCircuit,
  Database,
  ShieldCheck,
  LockKeyhole,
  Network,
  ArrowRight,
  LucideIcon,
} from "lucide-react";

type Product = {
  name: string;
  image: string;
};

type Service = {
  title: string;
  icon: LucideIcon;
  gradient: string;
  products: Product[];
};

const services: Service[] = [
  {
    title: "Artificial Intelligence",
    icon: BrainCircuit,
    gradient: "from-blue-500 via-purple-500 to-pink-500",
    products: [
      {
        name: "AI Camera",
        image:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop",
      },
      {
        name: "Face Recognition",
        image:
          "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop",
      },
      {
        name: "AI NVR",
        image:
          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop",
      },
      {
        name: "Video Analytics",
        image:
          "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop",
      },
    ],
  },
  {
    title: "Data Infrastructure",
    icon: Database,
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    products: [
      {
        name: "Rack Server",
        image:
          "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=600&auto=format&fit=crop",
      },
      {
        name: "Storage",
        image:
          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop",
      },
      {
        name: "Cloud Infrastructure",
        image:
          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop",
      },
      {
        name: "Virtualization",
        image:
          "https://i.pinimg.com/736x/33/31/3f/33313f981dfdb8d6bb84e09ae01536a0.jpg",
      },
    ],
  },
  {
    title: "Data Security",
    icon: ShieldCheck,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    products: [
      {
        name: "Firewall",
        image:
          "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&auto=format&fit=crop",
      },
      {
        name: "Endpoint Security",
        image:
          "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop",
      },
      {
        name: "Backup",
        image:
          "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop",
      },
      {
        name: "Encryption",
        image:
          "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&auto=format&fit=crop",
      },
    ],
  },
  {
    title: "Physical Security",
    icon: LockKeyhole,
    gradient: "from-rose-500 via-red-500 to-orange-500",
    products: [
      {
        name: "CCTV Camera",
        image:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop",
      },
      {
        name: "Access Control",
        image:
          "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&auto=format&fit=crop",
      },
      {
        name: "Boom Barrier",
        image:
          "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=600&auto=format&fit=crop",
      },
      {
        name: "Video Door Phone",
        image:
          "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?w=600&auto=format&fit=crop",
      },
    ],
  },
  {
    title: "Data Cabling",
    icon: Network,
    gradient: "from-amber-500 via-yellow-500 to-orange-400",
    products: [
      {
        name: "Cat6 Cable",
        image:
          "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop",
      },
      {
        name: "Fiber Optic",
        image:
          "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop",
      },
      {
        name: "Patch Panel",
        image:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop",
      },
      {
        name: "Network Rack",
        image:
          "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop",
      },
    ],
  },
];

export default function ProductsSection() {
  return (
    <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 py-24 text-slate-800">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="mb-16 text-center">
          <span className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-6 py-2 text-sm font-semibold text-blue-600 backdrop-blur-sm">
            ✨ Our Products
          </span>

          <h2 className="mt-6 text-4xl font-bold md:text-5xl lg:text-6xl">
            Enterprise Technology
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Solutions & Products
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600">
            Discover our complete range of enterprise solutions across AI,
            Infrastructure, Security, Surveillance and Networking.
          </p>
        </div>

        {/* First Row: AI + Data Infrastructure */}
        <div className="mb-8 grid gap-8 lg:grid-cols-2">
          {services.slice(0, 2).map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:scale-[1.02]"
              >
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br opacity-10 blur-3xl transition duration-500 group-hover:opacity-20"
                  style={{ backgroundImage: `linear-gradient(to bottom right, ${service.gradient})` }}
                />
                
                <div className="relative">
                  <div className="mb-6 flex items-center gap-4">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${service.gradient} shadow-lg shadow-blue-500/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">
                        {service.title}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {service.products.length} products available
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {service.products.map((product) => (
                      <div
                        key={product.name}
                        className="group/product relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-white p-4 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1"
                      >
                        <div className="relative h-32 w-full overflow-hidden rounded-lg">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover/product:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 transition-opacity duration-300 group-hover/product:opacity-100" />
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <h4 className="font-semibold text-slate-800">
                            {product.name}
                          </h4>
                          <button className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-1.5 text-white opacity-0 transition-all duration-300 group-hover/product:opacity-100 hover:scale-110">
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Second Row: Data Security + Physical Security + Data Cabling (3 columns) */}
        <div className="grid gap-8 lg:grid-cols-3">
          {services.slice(2).map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:scale-[1.02]"
              >
                <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br opacity-10 blur-3xl transition duration-500 group-hover:opacity-20"
                  style={{ backgroundImage: `linear-gradient(to bottom right, ${service.gradient})` }}
                />
                
                <div className="relative">
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${service.gradient} shadow-lg shadow-blue-500/20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">
                        {service.title}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {service.products.length} products
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 grid-cols-2">
                    {service.products.map((product) => (
                      <div
                        key={product.name}
                        className="group/product relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-50 to-white p-3 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1"
                      >
                        <div className="relative h-20 w-full overflow-hidden rounded-md">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover/product:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 transition-opacity duration-300 group-hover/product:opacity-100" />
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-slate-800 truncate">
                            {product.name}
                          </h4>
                          <button className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-1 text-white opacity-0 transition-all duration-300 group-hover/product:opacity-100 hover:scale-110">
                            <ArrowRight size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}