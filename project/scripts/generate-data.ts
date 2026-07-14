// Data generation script - generates realistic enterprise product data
// Run: npx tsx scripts/generate-data.ts
import { writeFileSync } from 'fs';

interface CategoryDef {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
  specFields: { key: string; label: string; options?: string[]; unit?: string }[];
  productTemplates: { name: string; brand: string; short: string; features: string[] }[];
}

const brands = [
  { id: 'b1', name: 'Hikvision', slug: 'hikvision', logoText: 'HIKVISION', country: 'China', description: 'World-leading provider of security products and solutions', website: 'hikvision.com' },
  { id: 'b2', name: 'CP Plus', slug: 'cp-plus', logoText: 'CP PLUS', country: 'India', description: 'Advanced surveillance solutions for businesses and homes', website: 'cpplusworld.com' },
  { id: 'b3', name: 'Dahua', slug: 'dahua', logoText: 'DAHUA', country: 'China', description: 'Global leader in video surveillance and security solutions', website: 'dahuatech.com' },
  { id: 'b4', name: 'Schneider Electric', slug: 'schneider', logoText: 'SCHNEIDER', country: 'France', description: 'Energy management and automation solutions specialist', website: 'se.com' },
  { id: 'b5', name: 'ABB', slug: 'abb', logoText: 'ABB', country: 'Switzerland', description: 'Electrification and automation technology pioneer', website: 'abb.com' },
  { id: 'b6', name: 'Siemens', slug: 'siemens', logoText: 'SIEMENS', country: 'Germany', description: 'Technology company focused on industry and infrastructure', website: 'siemens.com' },
  { id: 'b7', name: 'Luminous', slug: 'luminous', logoText: 'LUMINOUS', country: 'India', description: 'Leading power backup and solar energy solutions provider', website: 'luminousindia.com' },
  { id: 'b8', name: 'Exide', slug: 'exide', logoText: 'EXIDE', country: 'India', description: 'Trusted name in battery and energy storage solutions', website: 'exideindustries.com' },
  { id: 'b9', name: 'Microtek', slug: 'microtek', logoText: 'MICROTEK', country: 'India', description: 'Power backup and solar solutions manufacturer', website: 'microtekdirect.com' },
  { id: 'b10', name: 'Cisco', slug: 'cisco', logoText: 'CISCO', country: 'USA', description: 'Worldwide leader in networking and IT infrastructure', website: 'cisco.com' },
  { id: 'b11', name: 'TP-Link', slug: 'tp-link', logoText: 'TP-LINK', country: 'China', description: 'Global provider of reliable networking products', website: 'tp-link.com' },
  { id: 'b12', name: 'Honeywell', slug: 'honeywell', logoText: 'HONEYWELL', country: 'USA', description: 'Industrial automation and safety solutions leader', website: 'honeywell.com' },
  { id: 'b13', name: 'Apollo', slug: 'apollo', logoText: 'APOLLO', country: 'UK', description: 'Fire detection and alarm system manufacturer', website: 'apollofire.co.uk' },
  { id: 'b14', name: 'Godrej', slug: 'godrej', logoText: 'GODREJ', country: 'India', description: 'Security solutions including safes and access control', website: 'godrej.com' },
  { id: 'b15', name: 'Panasonic', slug: 'panasonic', logoText: 'PANASONIC', country: 'Japan', description: 'Diverse electronics and security solutions provider', website: 'panasonic.com' },
];

const categories: CategoryDef[] = [
  {
    id: 'c1',
    name: 'CCTV & Surveillance',
    slug: 'cctv',
    icon: 'Cctv',
    color: '#0F4C81',
    description: 'Professional video surveillance cameras, DVRs, NVRs, and monitoring solutions for enterprise security.',
    specFields: [
      { key: 'resolution', label: 'Resolution', options: ['2MP (1080p)', '4MP (1440p)', '5MP (2592x1944)', '8MP (4K)', '12MP'] },
      { key: 'lens', label: 'Lens', options: ['2.8mm', '3.6mm', '4mm', '6mm', '8mm', '12mm', '2.7-13.5mm Varifocal'] },
      { key: 'nightVision', label: 'Night Vision', options: ['Up to 20m', 'Up to 30m', 'Up to 40m', 'Up to 50m', 'Up to 80m'] },
      { key: 'ipRating', label: 'IP Rating', options: ['IP65', 'IP66', 'IP67', 'IP68'] },
      { key: 'storage', label: 'Storage Support', options: ['Up to 4TB', 'Up to 8TB', 'Up to 10TB', 'Up to 16TB'] },
      { key: 'power', label: 'Power Source', options: ['12V DC', '24V AC', 'PoE', 'PoE+'] },
      { key: 'indoorOutdoor', label: 'Environment', options: ['Indoor', 'Outdoor', 'Indoor/Outdoor'] },
      { key: 'compression', label: 'Compression', options: ['H.264', 'H.264+', 'H.265', 'H.265+', 'H.265 Pro'] },
      { key: 'frameRate', label: 'Max Frame Rate', options: ['15fps', '20fps', '30fps', '60fps'] },
      { key: 'fov', label: 'Field of View', options: ['85°', '90°', '100°', '110°', '120°', '360°'] },
    ],
    productTemplates: [
      { name: 'Pro Dome Camera', brand: 'Hikvision', short: '4MP indoor dome camera with smart detection and night vision', features: ['Smart motion detection', 'AcuSense technology', 'Line crossing detection', 'Region intrusion detection', 'DarkFighter technology'] },
      { name: 'Bullet IP Camera', brand: 'Dahua', short: '4K bullet camera with PoE and IP67 weatherproof rating', features: ['4K Ultra HD resolution', 'PoE support', 'Starlight night vision', 'AI-powered analytics', 'Wide dynamic range'] },
      { name: 'PTZ Speed Dome', brand: 'CP Plus', short: '360° pan-tilt-zoom camera with 25x optical zoom', features: ['25x optical zoom', '360° endless pan', 'Auto-tracking', 'Preset positions', 'Privacy masking'] },
      { name: 'Turret Camera', brand: 'Hikvision', short: '2MP turret camera with EXIR night vision up to 40m', features: ['EXIR night vision', 'Vandal-resistant', 'Audio alarm', 'MicroSD slot', 'Smart detection'] },
      { name: 'Fisheye Camera', brand: 'Panasonic', short: '12MP 360° fisheye camera with dewarping', features: ['360° panoramic view', 'Digital dewarping', 'Two-way audio', 'Built-in microphone', 'ePTZ functionality'] },
      { name: 'Network Video Recorder', brand: 'Hikvision', short: '16-channel NVR with 8TB storage and AI search', features: ['16-channel recording', 'Up to 8TB HDD', 'AI search', 'H.265+ compression', 'Remote access via app'] },
      { name: 'Wireless Camera', brand: 'CP Plus', short: 'WiFi-enabled indoor camera with cloud storage', features: ['WiFi connectivity', 'Cloud storage', 'Two-way audio', 'Motion alerts', 'Mobile app control'] },
      { name: 'Thermal Camera', brand: 'Dahua', short: 'Thermal imaging camera for perimeter protection', features: ['Thermal imaging', 'Perimeter protection', 'Fire detection', 'Temperature measurement', 'Long-range detection'] },
    ],
  },
  {
    id: 'c2',
    name: 'Solar Energy',
    slug: 'solar',
    icon: 'Sun',
    color: '#FF9800',
    description: 'Solar panels, inverters, batteries, and complete solar power systems for commercial and industrial use.',
    specFields: [
      { key: 'panelType', label: 'Panel Type', options: ['Monocrystalline', 'Polycrystalline', 'Bifacial', 'Thin Film'] },
      { key: 'capacity', label: 'Capacity', unit: 'W' },
      { key: 'efficiency', label: 'Efficiency', options: ['18%', '19%', '20%', '21%', '22%', '23%'] },
      { key: 'battery', label: 'Battery Type', options: ['Lithium-ion', 'LiFePO4', 'Lead-Acid', 'Tubular', 'None'] },
      { key: 'batteryCapacity', label: 'Battery Capacity', unit: 'kWh' },
      { key: 'warranty', label: 'Warranty', options: ['5 years', '10 years', '12 years', '15 years', '25 years'] },
      { key: 'inverterType', label: 'Inverter Type', options: ['String', 'Micro-inverter', 'Hybrid', 'Off-grid', 'Grid-tie'] },
      { key: 'ratedPower', label: 'Rated Power', unit: 'kW' },
      { key: 'operatingTemp', label: 'Operating Temp', options: ['-10°C to 50°C', '-20°C to 60°C', '-40°C to 85°C'] },
      { key: 'certification', label: 'Certification', options: ['IEC 61215', 'IEC 61730', 'BIS', 'MNRE Approved', 'UL 1703'] },
    ],
    productTemplates: [
      { name: 'Mono Solar Panel', brand: 'Luminous', short: '450W monocrystalline solar panel with 21% efficiency', features: ['Monocrystalline cells', '21% efficiency', 'Anti-reflective coating', 'IP68 junction box', '25-year performance warranty'] },
      { name: 'Solar Inverter', brand: 'Microtek', short: '5kW pure sine wave solar inverter with MPPT', features: ['MPPT technology', 'Pure sine wave', 'LCD display', 'Overload protection', 'Dual mode operation'] },
      { name: 'Solar Battery', brand: 'Exide', short: '200Ah tubular battery for solar applications', features: ['Tubular plate technology', '200Ah capacity', 'Deep discharge', 'Low maintenance', '5-year warranty'] },
      { name: 'Hybrid Inverter', brand: 'Luminous', short: '3kVA hybrid solar inverter with grid-tie support', features: ['Hybrid operation', 'Grid-tie & off-grid', 'MPPT charge controller', 'Smart monitoring', 'Auto-switching'] },
      { name: 'Solar Charge Controller', brand: 'Microtek', short: '60A MPPT charge controller with LCD display', features: ['MPPT tracking', '60A capacity', 'LCD display', 'Multiple protections', 'Temperature compensation'] },
      { name: 'Bifacial Solar Panel', brand: 'Siemens', short: '550W bifacial module with 22% efficiency', features: ['Bifacial design', '22% efficiency', 'Glass-glass construction', '1500V DC rated', '30-year warranty'] },
      { name: 'Off-grid System', brand: 'Luminous', short: 'Complete 1kW off-grid solar system with battery', features: ['Complete kit', '1kW capacity', '1500VA inverter', '2x 250W panels', '150Ah battery'] },
      { name: 'Solar Power Plant', brand: 'Siemens', short: '10kW commercial solar power plant package', features: ['10kW capacity', 'Commercial grade', 'String inverter', '20 panels', 'Net metering ready'] },
    ],
  },
  {
    id: 'c3',
    name: 'UPS & Power Backup',
    slug: 'ups',
    icon: 'BatteryCharging',
    color: '#1E88E5',
    description: 'Uninterruptible power supplies, inverters, and power backup solutions for critical infrastructure.',
    specFields: [
      { key: 'capacity', label: 'Capacity', unit: 'kVA' },
      { key: 'topology', label: 'Topology', options: ['Online Double Conversion', 'Line Interactive', 'Offline/Standby'] },
      { key: 'phase', label: 'Phase', options: ['Single Phase', 'Three Phase'] },
      { key: 'backupTime', label: 'Backup Time', options: ['15 min', '30 min', '1 hour', '2 hours', '4 hours'] },
      { key: 'batteryType', label: 'Battery Type', options: ['VRLA', 'Tubular', 'Lithium-ion', 'LiFePO4'] },
      { key: 'batteryCount', label: 'Battery Count', unit: 'pcs' },
      { key: 'outputVoltage', label: 'Output Voltage', options: ['220V', '230V', '240V', '110V'] },
      { key: 'efficiency', label: 'Efficiency', options: ['90%', '92%', '94%', '95%', '96%', '98%'] },
      { key: 'transferTime', label: 'Transfer Time', options: ['0ms', '<2ms', '<4ms', '<10ms'] },
      { key: 'warranty', label: 'Warranty', options: ['1 year', '2 years', '3 years', '5 years'] },
    ],
    productTemplates: [
      { name: 'Online UPS', brand: 'Schneider Electric', short: '10kVA online double-conversion UPS with 98% efficiency', features: ['Double conversion', '98% efficiency', 'Hot-swappable', 'LCD display', 'Network management'] },
      { name: 'Line Interactive UPS', brand: 'Microtek', short: '2kVA line interactive UPS for office equipment', features: ['Line interactive', 'AVR regulation', 'Cold start', 'USB communication', 'Audible alarms'] },
      { name: 'Inverter', brand: 'Luminous', short: '1500VA pure sine wave inverter with battery charger', features: ['Pure sine wave', '1500VA capacity', 'Smart charging', 'Overload protection', 'LCD display'] },
      { name: 'Industrial UPS', brand: 'ABB', short: '60kVA three-phase industrial UPS system', features: ['Three phase', '60kVA capacity', 'Isolation transformer', 'Redundant design', 'Remote monitoring'] },
      { name: 'Modular UPS', brand: 'Schneider Electric', short: '20kVA modular UPS with scalable architecture', features: ['Modular design', 'Hot-swap modules', 'N+1 redundancy', '96% efficiency', 'Parallel operation'] },
      { name: 'Home UPS', brand: 'Microtek', short: '900VA sine wave UPS for home appliances', features: ['Pure sine wave', '900VA capacity', 'Smart thermal management', 'Auto-reset', 'Wide input range'] },
      { name: 'Server Room UPS', brand: 'Schneider Electric', short: '6kVA rack-mount UPS for data centers', features: ['Rack-mount', '6kVA capacity', 'Network card', 'Hot-swap battery', 'PowerChute software'] },
      { name: 'Tower UPS', brand: 'Luminous', short: '3kVA tower UPS with extended battery support', features: ['Tower design', '3kVA capacity', 'Extended runtime', 'LCD display', 'USB/RS232 ports'] },
    ],
  },
  {
    id: 'c4',
    name: 'Networking',
    slug: 'networking',
    icon: 'Network',
    color: '#0F4C81',
    description: 'Enterprise networking equipment including switches, routers, access points, and firewalls.',
    specFields: [
      { key: 'ports', label: 'Port Count', options: ['5', '8', '16', '24', '48'] },
      { key: 'speed', label: 'Speed', options: ['10/100 Mbps', 'Gigabit (1Gbps)', '2.5G', '10G', '40G', '100G'] },
      { key: 'managed', label: 'Management', options: ['Unmanaged', 'Smart Managed', 'Fully Managed', 'Cloud Managed'] },
      { key: 'poe', label: 'PoE Support', options: ['No PoE', 'PoE', 'PoE+', 'PoE++', '4PPoE'] },
      { key: 'poeBudget', label: 'PoE Budget', unit: 'W' },
      { key: 'switchingCapacity', label: 'Switching Capacity', unit: 'Gbps' },
      { key: 'layer', label: 'Layer', options: ['Layer 2', 'Layer 2+', 'Layer 3', 'Layer 4'] },
      { key: 'formFactor', label: 'Form Factor', options: ['Desktop', 'Rack 1U', 'Rack 2U', 'Wall-mount'] },
      { key: 'protocol', label: 'Protocols', options: ['VLAN', 'STP/RSTP', 'OSPF', 'BGP', 'ACL', 'QoS'] },
      { key: 'warranty', label: 'Warranty', options: ['1 year', '3 years', '5 years', 'Limited Lifetime'] },
    ],
    productTemplates: [
      { name: 'Managed Switch', brand: 'Cisco', short: '24-port Gigabit managed switch with PoE+', features: ['24 Gigabit ports', 'PoE+ support', 'Layer 2 management', 'VLAN support', 'QoS prioritization'] },
      { name: 'Unmanaged Switch', brand: 'TP-Link', short: '8-port Gigabit unmanaged desktop switch', features: ['8 Gigabit ports', 'Plug & play', 'Auto MDI/MDIX', 'Energy efficient', 'Fanless design'] },
      { name: 'Wireless Access Point', brand: 'TP-Link', short: 'WiFi 6 dual-band access point with 2.4Gbps speed', features: ['WiFi 6 (802.11ax)', '2.4Gbps speed', '200+ clients', 'Mesh support', 'PoE powered'] },
      { name: 'Enterprise Router', brand: 'Cisco', short: 'Multi-WAN gigabit router with VPN and firewall', features: ['Multi-WAN support', 'VPN tunnels', 'Stateful firewall', 'QoS management', 'IPv6 ready'] },
      { name: 'Core Switch', brand: 'Cisco', short: '48-port 10G Layer 3 core switch', features: ['48x 10G ports', 'Layer 3 routing', 'Stacking support', 'Hot-swappable fans', 'Limited lifetime warranty'] },
      { name: 'PoE Switch', brand: 'TP-Link', short: '16-port PoE+ switch with 200W budget', features: ['16 PoE+ ports', '200W budget', 'Smart management', 'VLAN support', 'Auto recovery'] },
      { name: 'Network Firewall', brand: 'Cisco', short: 'Next-gen firewall with threat detection', features: ['Threat detection', 'Application control', 'VPN support', 'Intrusion prevention', 'Web filtering'] },
      { name: 'Cloud Controller', brand: 'TP-Link', short: 'Cloud-managed network controller for SMB', features: ['Cloud management', 'Multi-site support', 'Auto-discovery', 'Remote configuration', 'Firmware management'] },
    ],
  },
  {
    id: 'c5',
    name: 'Electrical',
    slug: 'electrical',
    icon: 'Zap',
    color: '#1E88E5',
    description: 'Circuit breakers, switchgear, transformers, and electrical distribution equipment.',
    specFields: [
      { key: 'type', label: 'Type', options: ['MCB', 'RCCB', 'RCBO', 'MCCB', 'ACB', 'VFD'] },
      { key: 'rating', label: 'Current Rating', unit: 'A' },
      { key: 'poles', label: 'Poles', options: ['1P', '2P', '3P', '4P'] },
      { key: 'breakingCapacity', label: 'Breaking Capacity', unit: 'kA' },
      { key: 'voltage', label: 'Voltage Rating', options: ['240V', '415V', '690V', '1000V'] },
      { key: 'curve', label: 'Trip Curve', options: ['B', 'C', 'D', 'K', 'Z'] },
      { key: 'mounting', label: 'Mounting', options: ['DIN Rail', 'Panel Mount', 'Plug-in', 'Drawout'] },
      { key: 'protection', label: 'Protection', options: ['Overload', 'Short Circuit', 'Earth Fault', 'Over/Under Voltage'] },
      { key: 'certification', label: 'Certification', options: ['IS/IEC 60898', 'IS/IEC 60947', 'UL 489', 'CE'] },
      { key: 'warranty', label: 'Warranty', options: ['1 year', '3 years', '5 years', '10 years'] },
    ],
    productTemplates: [
      { name: 'MCB', brand: 'Schneider Electric', short: '32A C-curve miniature circuit breaker', features: ['32A rating', 'C-curve trip', '10kA breaking capacity', 'DIN rail mount', 'Compliant with IEC 60898'] },
      { name: 'RCCB', brand: 'ABB', short: '63A 4-pole residual current circuit breaker', features: ['63A rating', '4-pole design', '30mA sensitivity', 'Type A protection', 'DIN rail mount'] },
      { name: 'MCCB', brand: 'Schneider Electric', short: '100A thermal-magnetic MCCB with adjustable trip', features: ['100A rating', '3-pole', 'Adjustable trip', '25kA breaking capacity', 'Rotary handle option'] },
      { name: 'Air Circuit Breaker', brand: 'ABB', short: '1600A air circuit breaker with electronic trip unit', features: ['1600A rating', '4-pole', 'Electronic trip unit', '65kA breaking capacity', 'Drawout design'] },
      { name: 'Variable Frequency Drive', brand: 'ABB', short: '22kW VFD for motor speed control', features: ['22kW capacity', 'Vector control', 'Built-in EMC filter', 'Safe Torque Off', 'Energy saving mode'] },
      { name: 'Distribution Board', brand: 'Schneider Electric', short: '12-way TPN distribution board with main switch', features: ['12-way', 'TPN configuration', 'Lockable door', 'Cable management', 'IP42 rated'] },
      { name: 'Contactor', brand: 'ABB', short: '40A AC contactor for motor control', features: ['40A rating', '3-pole', 'AC-3 duty', 'Auxiliary contacts', 'DIN rail mount'] },
      { name: 'Overload Relay', brand: 'Siemens', short: 'Thermal overload relay 17-26A range', features: ['17-26A range', 'Thermal protection', 'Trip class 10', 'Manual/auto reset', 'Phase loss protection'] },
    ],
  },
  {
    id: 'c6',
    name: 'Fire Safety',
    slug: 'fire-safety',
    icon: 'Flame',
    color: '#FF9800',
    description: 'Fire alarm systems, smoke detectors, sprinkler systems, and fire safety equipment.',
    specFields: [
      { key: 'type', label: 'Type', options: ['Smoke Detector', 'Heat Detector', 'Fire Alarm Panel', 'Sprinkler', 'Fire Extinguisher'] },
      { key: 'detection', label: 'Detection Method', options: ['Optical', 'Ionization', 'Photoelectric', 'Multi-sensor', 'Rate-of-Rise'] },
      { key: 'zones', label: 'Zone Capacity', options: ['2 zones', '4 zones', '8 zones', '16 zones', '32 zones', '64 zones'] },
      { key: 'power', label: 'Power Source', options: ['9V Battery', '12V DC', '24V DC', '230V AC', 'Solar'] },
      { key: 'temperature', label: 'Operating Temp', options: ['-10°C to 50°C', '-20°C to 60°C', '0°C to 70°C'] },
      { key: 'ipRating', label: 'IP Rating', options: ['IP20', 'IP44', 'IP54', 'IP65', 'IP67'] },
      { key: 'soundLevel', label: 'Alarm Sound Level', unit: 'dB' },
      { key: 'responseTime', label: 'Response Time', options: ['<10s', '<30s', '<60s', '<120s'] },
      { key: 'compliance', label: 'Compliance', options: ['IS 2175', 'EN 54', 'UL 268', 'NFPA 72', 'BS 5839'] },
      { key: 'warranty', label: 'Warranty', options: ['1 year', '2 years', '5 years', '10 years'] },
    ],
    productTemplates: [
      { name: 'Smoke Detector', brand: 'Apollo', short: 'Optical smoke detector with EN54 compliance', features: ['Optical detection', 'EN54-7 compliant', 'Low profile', 'Drift compensation', 'Remote test capability'] },
      { name: 'Fire Alarm Panel', brand: 'Honeywell', short: '8-zone conventional fire alarm control panel', features: ['8 zones', '24V DC power', 'Battery backup', 'Fire/fault relays', 'EN54-2/4 certified'] },
      { name: 'Heat Detector', brand: 'Apollo', short: 'Rate-of-rise heat detector with 60°C fixed threshold', features: ['Rate-of-rise detection', '60°C fixed temp', 'EN54-5 compliant', 'LED indicator', 'Surface mount'] },
      { name: 'Addressable Panel', brand: 'Honeywell', short: '32-zone addressable fire alarm system panel', features: ['32 zones', 'Addressable loop', 'LCD display', 'Event log', 'Network capable'] },
      { name: 'Multi-Sensor Detector', brand: 'Apollo', short: 'Combined optical and heat multi-sensor detector', features: ['Optical + heat', 'Multi-criteria algorithm', 'False alarm reduction', 'EN54-7/5 compliant', 'Drift compensation'] },
      { name: 'Fire Extinguisher', brand: 'Godrej', short: '6kg ABC dry powder fire extinguisher', features: ['6kg capacity', 'ABC powder', 'IS 2171 certified', 'Pressure gauge', 'Wall mountable'] },
      { name: 'Sprinkler System', brand: 'Siemens', short: 'Quick response fire sprinkler head', features: ['Quick response', '68°C temperature rating', 'Standard/pendant', 'Glass bulb', 'Corrosion resistant'] },
      { name: 'Manual Call Point', brand: 'Honeywell', short: 'Addressable manual call point with LED indicator', features: ['Addressable', 'Resettable frangible', 'LED indicator', 'IP54 rated', 'EN54-11 compliant'] },
    ],
  },
  {
    id: 'c7',
    name: 'Access Control',
    slug: 'access-control',
    icon: 'Fingerprint',
    color: '#0F4C81',
    description: 'Biometric readers, RFID cards, access controllers, and turnstile systems for secure entry management.',
    specFields: [
      { key: 'type', label: 'Type', options: ['Biometric', 'RFID Card', 'PIN Keypad', 'Face Recognition', 'Multi-factor'] },
      { key: 'capacity', label: 'User Capacity', options: ['500', '1000', '2000', '5000', '10000'] },
      { key: 'identification', label: 'Identification', options: ['Fingerprint', 'RFID Card', 'Face', 'PIN', 'Palm', 'Iris'] },
      { key: 'connectivity', label: 'Connectivity', options: ['TCP/IP', 'WiFi', 'RS485', 'Wiegand', 'Bluetooth'] },
      { key: 'verification', label: 'Verification Speed', options: ['<0.5s', '<1s', '<2s', '<3s'] },
      { key: 'falseRate', label: 'False Acceptance Rate', options: ['0.0001%', '0.001%', '0.01%'] },
      { key: 'ipRating', label: 'IP Rating', options: ['IP54', 'IP65', 'IP66', 'IP67'] },
      { key: 'doorCount', label: 'Door Control', options: ['1 door', '2 doors', '4 doors', '8 doors'] },
      { key: 'integration', label: 'Integration', options: ['Standalone', 'Network', 'Cloud', 'API'] },
      { key: 'warranty', label: 'Warranty', options: ['1 year', '2 years', '3 years', '5 years'] },
    ],
    productTemplates: [
      { name: 'Fingerprint Reader', brand: 'Hikvision', short: 'Biometric fingerprint access controller with 2000 user capacity', features: ['Fingerprint identification', '2000 users', 'TCP/IP connectivity', 'Access logs', 'Anti-passback'] },
      { name: 'Face Recognition Terminal', brand: 'Hikvision', short: 'AI face recognition terminal with temperature screening', features: ['Face recognition', 'Temperature screening', 'Mask detection', 'Deep learning', '99% accuracy'] },
      { name: 'RFID Card Reader', brand: 'Godrej', short: 'Proximity RFID card reader with Wiegand output', features: ['125kHz RFID', 'Wiegand output', '10000 users', 'LED indicator', 'Weatherproof'] },
      { name: 'Access Controller', brand: 'Hikvision', short: '4-door network access controller with cloud management', features: ['4-door control', 'Cloud management', '200000 users', 'Anti-passback', 'Interlock support'] },
      { name: 'Turnstile Gate', brand: 'Godrej', short: 'Stainless steel tripod turnstile with biometric integration', features: ['Tripod design', 'Stainless steel', 'Biometric ready', 'Emergency drop-arm', 'High throughput'] },
      { name: 'Multi-biometric Reader', brand: 'CP Plus', short: 'Fingerprint + card + PIN multi-authentication reader', features: ['Multi-authentication', 'Fingerprint + RFID + PIN', '5000 users', 'TCP/IP + RS485', 'Access scheduling'] },
      { name: 'Palm Recognition', brand: 'Hikvision', short: 'Palm vein recognition terminal for high security', features: ['Palm vein recognition', 'Hygiene contactless', '10000 users', 'Live palm detection', 'High security'] },
      { name: 'Visitor Management Kiosk', brand: 'CP Plus', short: 'Self-service visitor registration kiosk with ID scan', features: ['Self-registration', 'ID scanning', 'Photo capture', 'Visitor pass printing', 'Host notification'] },
    ],
  },
  {
    id: 'c8',
    name: 'Video Door Phones',
    slug: 'video-door-phones',
    icon: 'DoorOpen',
    color: '#1E88E5',
    description: 'Video door phone systems, intercoms, and smart entry solutions for residential and commercial buildings.',
    specFields: [
      { key: 'type', label: 'Type', options: ['1-to-1', '1-to-2', '1-to-4', 'Multi-apartment', 'IP Network'] },
      { key: 'screenSize', label: 'Screen Size', options: ['4 inch', '7 inch', '10 inch', 'No Screen'] },
      { key: 'resolution', label: 'Camera Resolution', options: ['480p', '720p (HD)', '1080p (FHD)', '4MP'] },
      { key: 'nightVision', label: 'Night Vision', options: ['No', 'IR LED', 'Starlight', 'Full Color'] },
      { key: 'connectivity', label: 'Connectivity', options: ['Wired', 'WiFi', 'PoE', 'Hybrid'] },
      { key: 'unlockMethod', label: 'Unlock Method', options: ['Remote', 'App', 'PIN', 'Card', 'Face'] },
      { key: 'storage', label: 'Recording Storage', options: ['None', 'MicroSD', 'Cloud', 'NVR'] },
      { key: 'intercom', label: 'Intercom', options: ['Audio Only', 'Two-way Audio', 'Video Intercom'] },
      { key: 'ipRating', label: 'IP Rating', options: ['IP44', 'IP54', 'IP65', 'IP66'] },
      { key: 'warranty', label: 'Warranty', options: ['1 year', '2 years', '3 years'] },
    ],
    productTemplates: [
      { name: 'IP Video Door Phone', brand: 'Hikvision', short: '7-inch IP video door phone with app control', features: ['7-inch touchscreen', '1080p camera', 'App remote unlock', 'Two-way audio', 'Motion detection'] },
      { name: '2-Wire Intercom', brand: 'CP Plus', short: '2-wire video intercom system with 4-inch monitor', features: ['4-inch display', '2-wire connection', '720p camera', 'Night vision', 'Door release'] },
      { name: 'Multi-apartment System', brand: 'Dahua', short: 'IP multi-apartment video door phone system', features: ['Multi-apartment', 'IP network', '10-inch monitor', 'Concierge call', 'Access control integration'] },
      { name: 'Smart Doorbell', brand: 'CP Plus', short: 'WiFi smart video doorbell with cloud recording', features: ['WiFi connectivity', '1080p camera', 'Cloud recording', 'Motion alerts', 'Two-way audio'] },
      { name: 'Villa Door Phone', brand: 'Hikvision', short: 'Villa-style IP video door phone with 2 monitors', features: ['2 monitors', '7-inch display', '1080p camera', 'PoE support', 'Intercom between monitors'] },
      { name: 'Guard Station', brand: 'Dahua', short: '10-inch guard station intercom for building security', features: ['10-inch display', 'Guard station', 'Multi-channel', 'Emergency call', 'Video recording'] },
      { name: 'Analog Intercom', brand: 'CP Plus', short: '4-wire analog video intercom with basic features', features: ['4-wire system', '4-inch monitor', '480p camera', 'Night vision', 'Simple installation'] },
      { name: 'Keypad Door Phone', brand: 'Dahua', short: 'Video door phone with built-in PIN keypad', features: ['7-inch display', 'PIN access', 'RFID card reader', '1080p camera', 'Message recording'] },
    ],
  },
];

// Generate products
let productId = 1;
const products: any[] = [];

categories.forEach((cat) => {
  cat.productTemplates.forEach((template, idx) => {
    const brand = brands.find((b) => b.name === template.brand)!;
    const specs: Record<string, string> = {};
    cat.specFields.forEach((sf) => {
      if (sf.options) {
        specs[sf.key] = sf.options[(idx + Math.floor(Math.random() * 3)) % sf.options.length];
      } else {
        const base = parseInt(sf.key === 'capacity' ? '100' : sf.key === 'ratedPower' ? '5' : sf.key === 'poeBudget' ? '200' : '10');
        const val = base * (idx + 1) * (Math.random() > 0.5 ? 1 : 2);
        specs[sf.key] = `${val}`;
      }
    });

    // Build spec groups
    const specGroups = [
      {
        groupName: 'General',
        fields: [
          { key: 'brand', label: 'Brand', value: brand.name },
          { key: 'category', label: 'Category', value: cat.name },
          { key: 'model', label: 'Model Number', value: `MV-${cat.slug.toUpperCase().slice(0, 3)}-${(productId * 13).toString().padStart(4, '0')}` },
          { key: 'warranty', label: 'Warranty', value: specs['warranty'] || '2 years' },
        ],
      },
      {
        groupName: 'Technical Specifications',
        fields: cat.specFields.map((sf) => ({ key: sf.key, label: sf.label, value: specs[sf.key] || 'N/A' })),
      },
      {
        groupName: 'Physical & Environmental',
        fields: [
          { key: 'dimensions', label: 'Dimensions', value: `${200 + idx * 10} x ${150 + idx * 5} x ${50 + idx * 3} mm` },
          { key: 'weight', label: 'Weight', value: `${(0.5 + idx * 0.3).toFixed(1)} kg` },
          { key: 'material', label: 'Material', value: idx % 2 === 0 ? 'Aluminum Alloy' : 'Polycarbonate' },
          { key: 'operatingTemp', label: 'Operating Temp', value: '-10°C to 50°C' },
          { key: 'humidity', label: 'Humidity', value: '0-90% RH' },
        ],
      },
      {
        groupName: 'Compliance & Certification',
        fields: [
          { key: 'cert1', label: 'Certification 1', value: 'CE' },
          { key: 'cert2', label: 'Certification 2', value: 'RoHS' },
          { key: 'cert3', label: 'Certification 3', value: 'ISO 9001' },
          { key: 'origin', label: 'Country of Origin', value: brand.country },
        ],
      },
    ];

    const id = `p${productId}`;
    const numModels = Math.floor(productId / 8) + 1;
    const modelSuffix = ['Pro', 'Plus', 'Max', 'Elite', 'Standard', 'Premium', 'Ultra', 'Lite'][idx % 8];
    const fullName = `${brand.name} ${template.name} ${modelSuffix} ${cat.slug === 'cctv' ? '4MP' : ''}`.trim();

    products.push({
      id,
      name: `${brand.name} ${template.name} ${modelSuffix}`,
      slug: `${cat.slug}-${template.name.toLowerCase().replace(/\s+/g, '-')}-${modelSuffix.toLowerCase()}-${productId}`,
      sku: `MV-${cat.slug.toUpperCase().slice(0, 3)}-${(productId * 17).toString().padStart(5, '0')}`,
      brandId: brand.id,
      brandName: brand.name,
      categoryId: cat.id,
      categoryName: cat.name,
      shortDescription: template.short,
      description: `${template.short}. Designed for enterprise-grade deployment, this ${cat.name.toLowerCase()} product delivers reliable performance in demanding environments. The ${brand.name} ${template.name} ${modelSuffix} features advanced technology and robust construction, making it ideal for commercial, industrial, and institutional applications. With comprehensive connectivity options and professional-grade components, it ensures long-term operational excellence and minimal maintenance requirements.`,
      features: template.features,
      specifications: specs,
      specGroups,
      gallery: [
        `https://picsum.photos/seed/${id}-1/800/800`,
        `https://picsum.photos/seed/${id}-2/800/800`,
        `https://picsum.photos/seed/${id}-3/800/800`,
        `https://picsum.photos/seed/${id}-4/800/800`,
      ],
      price: Math.floor(5000 + (productId * 137) % 50000),
      currency: 'INR',
      status: productId % 10 === 0 ? 'draft' : 'active',
      isPopular: productId % 5 === 0,
      isNew: productId % 7 === 0,
      rating: 4 + (productId % 10) / 10,
      reviewCount: 10 + (productId * 3) % 200,
      downloads: [
        { name: 'Product Datasheet', type: 'datasheet', size: '2.4 MB', url: '#' },
        { name: 'User Manual', type: 'manual', size: '5.1 MB', url: '#' },
        { name: 'Installation Guide', type: 'brochure', type2: 'brochure', size: '3.8 MB', url: '#' },
        { name: 'Product Brochure', type: 'brochure', size: '1.2 MB', url: '#' },
      ],
      relatedProductIds: [],
      createdAt: new Date(2024, 0, 1 + ((productId * 3) % 360)).toISOString(),
      warranty: specs['warranty'] || '2 years',
    });
    productId++;
  });
});

// Add more products to reach 150 by creating variations
while (productId <= 150) {
  const cat = categories[productId % categories.length];
  const template = cat.productTemplates[productId % cat.productTemplates.length];
  const brand = brands.find((b) => b.name === template.brand)!;
  const specs: Record<string, string> = {};
  cat.specFields.forEach((sf, sfi) => {
    if (sf.options) {
      specs[sf.key] = sf.options[(productId + sfi) % sf.options.length];
    } else {
      specs[sf.key] = `${(productId * (sfi + 1)) % 500 + 10}`;
    }
  });

  const specGroups = [
    {
      groupName: 'General',
      fields: [
        { key: 'brand', label: 'Brand', value: brand.name },
        { key: 'category', label: 'Category', value: cat.name },
        { key: 'model', label: 'Model Number', value: `MV-${cat.slug.toUpperCase().slice(0, 3)}-${(productId * 13).toString().padStart(4, '0')}` },
        { key: 'warranty', label: 'Warranty', value: specs['warranty'] || '2 years' },
      ],
    },
    {
      groupName: 'Technical Specifications',
      fields: cat.specFields.map((sf) => ({ key: sf.key, label: sf.label, value: specs[sf.key] || 'N/A' })),
    },
    {
      groupName: 'Physical & Environmental',
      fields: [
        { key: 'dimensions', label: 'Dimensions', value: `${200 + (productId % 10) * 10} x ${150 + (productId % 5) * 5} x ${50 + (productId % 3) * 3} mm` },
        { key: 'weight', label: 'Weight', value: `${(0.5 + (productId % 10) * 0.3).toFixed(1)} kg` },
        { key: 'material', label: 'Material', value: productId % 2 === 0 ? 'Aluminum Alloy' : 'Polycarbonate' },
        { key: 'operatingTemp', label: 'Operating Temp', value: '-10°C to 50°C' },
        { key: 'humidity', label: 'Humidity', value: '0-90% RH' },
      ],
    },
    {
      groupName: 'Compliance & Certification',
      fields: [
        { key: 'cert1', label: 'Certification 1', value: 'CE' },
        { key: 'cert2', label: 'Certification 2', value: 'RoHS' },
        { key: 'cert3', label: 'Certification 3', value: 'ISO 9001' },
        { key: 'origin', label: 'Country of Origin', value: brand.country },
      ],
    },
  ];

  const modelSuffix = ['Pro', 'Plus', 'Max', 'Elite', 'Standard', 'Premium', 'Ultra', 'Lite', 'X', 'S'][productId % 10];
  const id = `p${productId}`;

  products.push({
    id,
    name: `${brand.name} ${template.name} ${modelSuffix} V${Math.floor(productId / 8) + 1}`,
    slug: `${cat.slug}-${template.name.toLowerCase().replace(/\s+/g, '-')}-${modelSuffix.toLowerCase()}-v${Math.floor(productId / 8) + 1}-${productId}`,
    sku: `MV-${cat.slug.toUpperCase().slice(0, 3)}-${(productId * 17).toString().padStart(5, '0')}`,
    brandId: brand.id,
    brandName: brand.name,
    categoryId: cat.id,
    categoryName: cat.name,
    shortDescription: template.short,
    description: `${template.short}. This enterprise-grade ${cat.name.toLowerCase()} product from ${brand.name} is engineered for reliability and performance in professional environments. The ${modelSuffix} series features enhanced capabilities, improved efficiency, and robust construction suitable for demanding commercial and industrial deployments.`,
    features: template.features,
    specifications: specs,
    specGroups,
    gallery: [
      `https://picsum.photos/seed/${id}-1/800/800`,
      `https://picsum.photos/seed/${id}-2/800/800`,
      `https://picsum.photos/seed/${id}-3/800/800`,
      `https://picsum.photos/seed/${id}-4/800/800`,
    ],
    price: Math.floor(5000 + (productId * 137) % 50000),
    currency: 'INR',
    status: productId % 12 === 0 ? 'draft' : 'active',
    isPopular: productId % 5 === 0,
    isNew: productId % 7 === 0,
    rating: 3.5 + (productId % 15) / 10,
    reviewCount: 5 + (productId * 3) % 300,
    downloads: [
      { name: 'Product Datasheet', type: 'datasheet', size: '2.4 MB', url: '#' },
      { name: 'User Manual', type: 'manual', size: '5.1 MB', url: '#' },
      { name: 'Product Brochure', type: 'brochure', size: '1.2 MB', url: '#' },
    ],
    relatedProductIds: [],
    createdAt: new Date(2024, 0, 1 + ((productId * 3) % 360)).toISOString(),
    warranty: specs['warranty'] || '2 years',
  });
  productId++;
}

// Set related products (same category, different product)
products.forEach((p) => {
  const related = products
    .filter((r) => r.categoryId === p.categoryId && r.id !== p.id)
    .slice(0, 4)
    .map((r) => r.id);
  p.relatedProductIds = related;
});

// Fix Exide website
brands[7].website = 'exideindia.com';

// Write output
const output = {
  brands,
  categories: categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon,
    color: c.color,
    description: c.description,
    productCount: products.filter((p) => p.categoryId === c.id).length,
    featured: true,
    specFields: c.specFields.map((sf) => ({
      key: sf.key,
      label: sf.label,
      type: sf.options ? 'select' : 'text',
      unit: sf.unit,
      options: sf.options,
    })),
  })),
  products,
};

writeFileSync('src/data/generated-data.json', JSON.stringify(output, null, 2));
console.log(`Generated ${products.length} products, ${categories.length} categories, ${brands.length} brands`);
