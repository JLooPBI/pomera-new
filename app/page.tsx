import { Mail, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HomePage() {
  const whatsappNumber = "13053313528";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="bg-gradient-to-br from-background via-secondary-light/10 to-accent/10">
        {/* Logo and Header Section */}
        <div className="container mx-auto px-4 pt-8 pb-6">
          <div className="flex items-center justify-center max-w-6xl mx-auto">
            <div className="flex items-center space-x-8">
              <img 
                src="/lovable-uploads/86aabeb5-c86b-4e8e-8ea7-239349c6cae2.png" 
                alt="Healthcare Consulting Logo" 
                className="h-64 w-auto"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-primary leading-tight">
                  Healthcare Recruiting & Consulting
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground italic mt-2">
                  Elevating Talent & Operational Excellence
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section Break Image */}
        <div className="w-full py-0">
          <img 
            src="/lovable-uploads/a9eedb62-09ce-4fdc-9455-e5baa278633c.png" 
            alt="Healthcare professionals" 
            className="w-full h-64 object-cover"
          />
        </div>

        {/* About Us Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-6 text-center">About Us</h2>
            <p className="text-lg text-foreground leading-relaxed text-center font-medium">
              Pomera Care Healthcare Recruiting & Consulting specializes in bridging the gap between exceptional healthcare professionals and mission-driven organizations. With a relational and strategic approach, we guide candidates through meaningful career transitions—offering personalized consultation, role alignment, and professional development insights to ensure long-term success in patient-centered environments.
            </p>
          </div>
        </div>

        {/* Section Break Image 2 */}
        <div className="w-full py-1">
          <img 
            src="/lovable-uploads/ce4260ac-1d43-40cb-9e86-14dfb5fc5d5a.png" 
            alt="Medical team in hospital" 
            className="w-full h-64 object-cover opacity-70"
          />
        </div>

        {/* Testimonials Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-6 text-center">Testimonials</h2>
            <div className="bg-white/50 rounded-lg p-8 shadow-lg">
              <p className="text-muted-foreground leading-relaxed mb-6 italic">
                "I had the absolute pleasure of working with Aliza Grossman and I truly cannot recommend her enough. During a pivotal time in my career, Aliza played a key role in helping me land an incredible opportunity with a new company. Her support, guidance, and belief in my potential made all the difference as I stepped into a leadership position.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6 italic">
                Aliza is someone who brings both professionalism and genuine warmth into every interaction. She is thoughtful, reliable, and consistently goes above and beyond. What sets her apart is her ability to listen with empathy, communicate with clarity, and lead with integrity.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6 italic">
                Whether collaborating on a project or simply exchanging ideas, Aliza always adds value and insight. Her work ethic is unmatched, and she approaches every task with passion and purpose. Anyone who has the opportunity to work with Aliza is truly fortunate. She is not just an asset—she's a catalyst for growth and success."
              </p>
              <div className="text-right">
                <p className="font-semibold text-primary">Jubert Paul "JP" Ong</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}