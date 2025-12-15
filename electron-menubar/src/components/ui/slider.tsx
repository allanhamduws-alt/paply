import * as React from 'react';
import { cn } from '@/lib/utils';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ value, onChange, min = 0, max = 100, step = 1, className, disabled }, ref) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <div className={cn('relative w-full py-2', className)}>
        {/* Track Container with Border */}
        <div className="relative h-6 flex items-center">
          {/* Track Background with Border */}
          <div className="absolute inset-x-0 h-2 rounded-full border border-input bg-muted/50 shadow-inner" />
          
          {/* Filled Track */}
          <div 
            className="absolute h-2 rounded-l-full bg-primary transition-all"
            style={{ width: `calc(${percentage}% + ${percentage > 50 ? '0px' : '2px'})`, left: 0 }}
          />
          
          {/* Range Input */}
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            disabled={disabled}
            className="relative w-full h-6 appearance-none cursor-pointer bg-transparent disabled:opacity-50 disabled:cursor-not-allowed z-10
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-primary
              [&::-webkit-slider-thumb]:shadow-md
              [&::-webkit-slider-thumb]:border-2
              [&::-webkit-slider-thumb]:border-background
              [&::-webkit-slider-thumb]:transition-all
              [&::-webkit-slider-thumb]:hover:scale-110
              [&::-webkit-slider-thumb]:hover:shadow-lg
              [&::-webkit-slider-thumb]:active:scale-95
              [&::-moz-range-thumb]:w-5
              [&::-moz-range-thumb]:h-5
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-primary
              [&::-moz-range-thumb]:border-2
              [&::-moz-range-thumb]:border-background
              [&::-moz-range-thumb]:shadow-md
              [&::-moz-range-track]:bg-transparent
              [&::-webkit-slider-runnable-track]:bg-transparent"
          />
        </div>
      </div>
    );
  }
);
Slider.displayName = 'Slider';

export { Slider };
