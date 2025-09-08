"use client"

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const CRMHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: 'Client (CRM)', href: '/crm' },
    { label: 'ATS', href: '/ats' },
    { label: 'Pomera Admin', href: '/admin' },
  ];

  // Function to check if a nav item is active
  const isActive = (href: string) => {
    if (href === '/crm') {
      return pathname === '/crm';
    } else if (href === '/ats') {
      return pathname === '/ats' || pathname.startsWith('/ats/');
    } else if (href === '/admin') {
      return pathname === '/admin' || pathname.startsWith('/admin/');
    }
    return false;
  };

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16">
          {/* Logo */}
          <div className="flex items-center pl-24">
            <a href="/" className="flex items-center">
              <img 
                src="/pomera_logo_cropped.png" 
                alt="Pomera Care Logo" 
                className="h-12 w-auto"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 ml-auto">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`py-2 px-4 rounded-lg font-medium text-sm transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:text-primary hover:bg-gray-100'
                }`}
              >
                {item.label}
              </a>
            ))}
            <Button variant="outline" className="ml-4">
              Logout
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border mt-2 py-4 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`block py-2 px-4 rounded-lg font-medium text-sm transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:text-primary hover:bg-gray-100'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Button variant="outline" className="w-full mt-4">
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default CRMHeader;
