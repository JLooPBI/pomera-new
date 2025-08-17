import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, DollarSign } from 'lucide-react';

const JobListings = () => {
  const jobs = [
    {
      id: 1,
      title: 'Registered Nurse - ICU',
      location: 'Atlanta, GA',
      type: 'Full-time',
      salary: '$70,000 - $85,000',
      description: 'Seeking experienced ICU nurse for a leading hospital. Critical care experience required.',
      requirements: ['BSN preferred', '2+ years ICU experience', 'ACLS certification'],
      posted: '2 days ago'
    },
    {
      id: 2,
      title: 'Travel Nurse - Emergency Room',
      location: 'Miami, FL',
      type: 'Contract',
      salary: '$2,200 - $2,800/week',
      description: 'Join our emergency department team in sunny Miami. Excellent benefits package.',
      requirements: ['Active RN license', 'ER experience', 'Flexible schedule'],
      posted: '1 day ago'
    },
    {
      id: 3,
      title: 'Nurse Practitioner - Family Medicine',
      location: 'Charlotte, NC',
      type: 'Full-time',
      salary: '$110,000 - $130,000',
      description: 'Growing family practice seeking dedicated NP. Great work-life balance.',
      requirements: ['MSN required', 'Family practice experience', 'NC license'],
      posted: '3 days ago'
    },
    {
      id: 4,
      title: 'Medical Assistant',
      location: 'Raleigh, NC',
      type: 'Full-time',
      salary: '$35,000 - $42,000',
      description: 'Support busy medical practice with patient care and administrative duties.',
      requirements: ['CMA certification', 'EHR experience', 'Excellent communication'],
      posted: '1 week ago'
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Job Opportunities
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover your next career opportunity with Pomera Care. We have openings 
            across various healthcare specialties and locations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {jobs.map((job) => (
            <Card key={job.id} className="group hover:shadow-medium transition-all duration-300 border-border hover:border-primary/20">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">
                    {job.title}
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {job.type}
                  </Badge>
                </div>
                <div className="flex items-center text-muted-foreground space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{job.posted}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {job.description}
                </p>
                <div className="mb-4">
                  <h4 className="font-medium text-foreground mb-2">Requirements:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" className="px-8">
            View All Job Openings
          </Button>
        </div>
      </div>
    </section>
  );
};

export default JobListings;