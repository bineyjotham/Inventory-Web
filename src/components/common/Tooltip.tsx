import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top',
  delay = 200
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'bottom-[-6px] left-1/2 transform -translate-x-1/2 border-t-gray-800',
    bottom: 'top-[-6px] left-1/2 transform -translate-x-1/2 border-b-gray-800',
    left: 'right-[-6px] top-1/2 transform -translate-y-1/2 border-l-gray-800',
    right: 'left-[-6px] top-1/2 transform -translate-y-1/2 border-r-gray-800',
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      {isVisible && (
        <div 
          className={`absolute z-50 ${positionClasses[position]} animate-fade-in`}
          role="tooltip"
        >
          <div className="relative">
            <div className="bg-gray-800 text-white text-xs rounded-lg py-2 px-3 max-w-xs shadow-lg">
              {content}
              <div className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[position]}`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};