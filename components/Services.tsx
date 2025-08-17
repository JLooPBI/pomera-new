import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Stethoscope, Users, Clock, Award } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Stethoscope,
      title: 'Permanent Placement',
      description: 'Connect with long-term career opportunities in hospitals, clinics, and healthcare facilities across the Southeast.'
    },
    {
      icon: Clock,
      title: 'Travel Nursing',
      description: 'Explore new locations while advancing your career. Competitive pay, housing assistance, and comprehensive benefits.'
    },
    {
      icon: Users,
      title: 'Per Diem Staffing',
      description: 'Flexible scheduling solutions for healthcare professionals seeking work-life balance and varied experiences.'
    },
    {
      icon: Award,
      title: 'Specialty Placements',
      description: 'Expert matching for specialized roles including ICU, OR, ER, and other critical care positions.'
    }
  ];

  return (
    <section className="py-16 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Staffing Solutions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide comprehensive medical staffing services tailored to meet the unique needs 
            of healthcare professionals and facilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="text-center group hover:shadow-medium transition-all duration-300 border-border hover:border-primary/20">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <IconComponent className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <CardTitle className="text-xl text-foreground">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;