import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Heart, Shield } from 'lucide-react';
import heroImage from '@/assets/hero-medical-staff.jpg';

const Hero = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Medical professionals" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/80"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl text-center mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Connecting Healthcare 
            <span className="text-accent"> Professionals</span> with 
            <span className="text-accent"> Opportunities</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
            Pomera Care LLC is your trusted partner in medical staffing. We match skilled healthcare professionals 
            with quality healthcare facilities, ensuring exceptional patient care across all settings.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Find Jobs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-primary">
              Partner With Us
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex items-center justify-center space-x-3">
              <Users className="h-8 w-8 text-accent" />
              <div>
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-white/80">Healthcare Professionals</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Heart className="h-8 w-8 text-accent" />
              <div>
                <div className="text-2xl font-bold text-white">100+</div>
                <div className="text-white/80">Healthcare Facilities</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Shield className="h-8 w-8 text-accent" />
              <div>
                <div className="text-2xl font-bold text-white">15+</div>
                <div className="text-white/80">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;