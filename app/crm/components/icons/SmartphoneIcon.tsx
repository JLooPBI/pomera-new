import React from 'react';

export const SmartphoneIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {/* Phone body */}
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" fill="black"/>
    {/* Screen */}
    <rect x="6" y="4" width="12" height="16" rx="1" ry="1" fill="white"/>
    {/* Earpiece */}
    <line x1="12" y1="3" x2="12" y2="3.5" stroke="white" strokeWidth="2"/>
    {/* Home button */}
    <circle cx="12" cy="20" r="1" fill="white"/>
  </svg>
);
