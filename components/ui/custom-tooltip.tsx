"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

interface CustomTooltipProps {
  content: string;
  className?: string;
  buttonClassName?: string;
}

export default function CustomTooltip({ content, className = "", buttonClassName = "" }: CustomTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
             <Button
         type="button"
         variant="ghost"
         size="sm"
         className={`h-8 w-8 p-0 text-pink-400 hover:!text-pink-600 hover:!bg-pink-50 ${buttonClassName}`}
         onClick={() => setIsVisible(!isVisible)}
         onMouseEnter={() => setIsVisible(true)}
         onMouseLeave={() => setIsVisible(false)}
       >
        <Info className="h-4 w-4" />
      </Button>
             {isVisible && (
         <div className={`absolute bottom-full right-0 mb-2 px-3 py-1.5 text-sm text-gray-700 rounded-md border border-pink-300 shadow-md z-50 whitespace-nowrap bg-[hsl(var(--pomera-pink))] ${className}`}>
           {content}
           <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[hsl(var(--pomera-pink))]"></div>
         </div>
       )}
    </div>
  );
}
