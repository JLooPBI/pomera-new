import React from 'react';

export const PhoneIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    {/* Desk phone base - rectangular base on the right */}
    <rect x="12" y="8" width="10" height="14" rx="1" ry="1"/>
    {/* Phone screen at top of base */}
    <rect x="13" y="9" width="8" height="3" rx="0.5" fill="white"/>
    {/* Keypad grid - 3x4 grid of buttons */}
    <rect x="13" y="13" width="8" height="8" rx="0.5"/>
    <rect x="13.5" y="13.5" width="1.5" height="1.5" fill="currentColor"/>
    <rect x="15.5" y="13.5" width="1.5" height="1.5" fill="currentColor"/>
    <rect x="17.5" y="13.5" width="1.5" height="1.5" fill="currentColor"/>
    <rect x="13.5" y="15.5" width="1.5" height="1.5" fill="currentColor"/>
    <rect x="15.5" y="15.5" width="1.5" height="1.5" fill="currentColor"/>
    <rect x="17.5" y="15.5" width="1.5" height="1.5" fill="currentColor"/>
    <rect x="13.5" y="17.5" width="1.5" height="1.5" fill="currentColor"/>
    <rect x="15.5" y="17.5" width="1.5" height="1.5" fill="currentColor"/>
    <rect x="17.5" y="17.5" width="1.5" height="1.5" fill="currentColor"/>
    <rect x="13.5" y="19.5" width="1.5" height="1.5" fill="currentColor"/>
    <rect x="15.5" y="19.5" width="1.5" height="1.5" fill="currentColor"/>
    <rect x="17.5" y="19.5" width="1.5" height="1.5" fill="currentColor"/>
    {/* Handset - curved handset on the left */}
    <path d="M2 10 C2 8, 4 6, 8 6 L10 6 C12 6, 14 8, 14 10 L14 12 C14 14, 12 16, 10 16 L8 16 C4 16, 2 14, 2 12 Z"/>
    {/* Handset cord - coiled cord connecting handset to base */}
    <path d="M8 6 Q6 8, 8 10 Q10 12, 8 14 Q6 16, 8 18 Q10 20, 12 20" strokeWidth="1.5"/>
  </svg>
);
