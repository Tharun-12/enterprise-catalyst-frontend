// components/about/AboutStory.tsx
import { SectionHeader } from '@/components/shared';
import { COMPANY } from '@/constants';

export function AboutStory() {
  return (
    <section className="mb-12">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <SectionHeader title="Our Story" subtitle="From a small office in Ahmedabad to a pan-India enterprise solutions provider." />
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              MV Business Solutions (MVB) was founded in {COMPANY.established} with a simple mission: to provide businesses with access to world-class security, power, and networking products. What started as a small distribution office in Ahmedabad has grown into a trusted enterprise solutions provider serving 500+ clients across India.
            </p>
            <p>
              Over the years, we've forged partnerships with 15+ global brands including Hikvision, Schneider Electric, Cisco, Siemens, and ABB. Our team of certified technicians and consultants has successfully delivered projects across industries — from hospitals and schools to factories and IT parks.
            </p>
            <p>
              Today, MVB stands as a single-source solution provider for enterprise security, power backup, networking, electrical, fire safety, and solar energy needs. Our commitment to quality, genuine products, and professional service has made us the preferred partner for businesses across India.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Office" className="rounded-2xl w-full h-48 object-cover shadow-lg" />
          <img src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Team" className="rounded-2xl w-full h-48 object-cover shadow-lg mt-8" />
          <img src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Meeting" className="rounded-2xl w-full h-48 object-cover shadow-lg" />
          <img src="https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Work" className="rounded-2xl w-full h-48 object-cover shadow-lg mt-8" />
        </div>
      </div>
    </section>
  );
}