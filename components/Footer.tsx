import { Mail, Phone, MessageCircle, Linkedin } from 'lucide-react';

const Footer = () => {
  const whatsappNumber = "13053313528";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <footer className="w-full">
      {/* Pink gradient divider bar */}
      <div className="w-full px-4">
        <div className="h-1 bg-gradient-to-r from-[#f84a71] to-[#f795bf] mx-auto rounded-full" style={{ width: '95%' }}></div>
      </div>
      
      {/* Footer content */}
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {/* Email */}
            <a 
              href="mailto:aliza@pomeracare.health"
              className="flex items-center gap-2 p-3 rounded-lg border border-secondary/30 hover:bg-secondary/10 hover:border-secondary/50 transition-all group"
            >
              <Mail className="h-5 w-5 text-secondary" />
              <span className="text-foreground group-hover:text-secondary transition-colors">
                aliza@pomeracare.health
              </span>
            </a>

            {/* Phone */}
            <a 
              href="tel:+13053313528"
              className="flex items-center gap-2 p-3 rounded-lg border border-accent/30 hover:bg-accent/10 hover:border-accent/50 transition-all group"
            >
              <Phone className="h-5 w-5 text-accent" />
              <span className="text-foreground group-hover:text-accent transition-colors">
                +1 (305) 331-3528
              </span>
            </a>

            {/* WhatsApp */}
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-lg border border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all group"
            >
              <MessageCircle className="h-5 w-5 text-primary" />
              <span className="text-foreground group-hover:text-primary transition-colors">
                WhatsApp Us
              </span>
            </a>

            {/* LinkedIn */}
            <a 
              href="https://www.linkedin.com/in/aliza-grossman-520924236/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-lg border border-blue-600/30 hover:bg-blue-600/10 hover:border-blue-600/50 transition-all group"
            >
              <Linkedin className="h-5 w-5 text-blue-600" />
              <span className="text-foreground group-hover:text-blue-600 transition-colors">
                LinkedIn
              </span>
            </a>

            {/* Terms Link */}
            <a 
              href="/terms"
              className="flex items-center gap-2 p-3 rounded-lg border border-muted/30 hover:bg-muted/10 hover:border-muted/50 transition-all group text-sm"
            >
              <span className="text-foreground group-hover:text-primary transition-colors">
                Terms & Conditions
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;