import React, { forwardRef, ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'ghost' 
  | 'danger' 
  | 'success' 
  | 'warning';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  rounded?: boolean;
  asChild?: boolean;
  tooltip?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  rounded = false,
  className = '',
  type = 'button',
  tooltip,
  ...props
}, ref) => {
  const isDisabled = disabled || loading;
  
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
    xl: 'px-6 py-3.5 text-base'
  };
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500 border border-transparent',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 focus:ring-gray-500 border border-gray-300',
    outline: 'bg-transparent text-gray-700 hover:bg-gray-50 active:bg-gray-100 focus:ring-blue-500 border border-gray-300',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-500 border border-transparent',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500 border border-transparent',
    success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:ring-green-500 border border-transparent',
    warning: 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 focus:ring-orange-500 border border-transparent'
  };
  
  const roundedClasses = rounded ? 'rounded-full' : 'rounded-lg';
  
  const widthClasses = fullWidth ? 'w-full' : '';
  
  const buttonClasses = [
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    roundedClasses,
    widthClasses,
    className
  ].filter(Boolean).join(' ');
  
  const LoadingSpinner = () => (
    <svg 
      className="animate-spin -ml-1 mr-2 h-4 w-4" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
  
  const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <span className={`flex items-center ${iconPosition === 'left' ? 'mr-2' : 'ml-2'}`}>
      {children}
    </span>
  );

  const ButtonContent = () => (
    <>
      {loading && <LoadingSpinner />}
      {!loading && icon && iconPosition === 'left' && <IconWrapper>{icon}</IconWrapper>}
      {children && <span className="truncate">{children}</span>}
      {!loading && icon && iconPosition === 'right' && <IconWrapper>{icon}</IconWrapper>}
    </>
  );
  
  // If there's a tooltip, wrap the button in a tooltip container
  if (tooltip) {
    return (
      <div className="relative group">
        <button
          ref={ref}
          type={type}
          disabled={isDisabled}
          className={buttonClasses}
          aria-label={tooltip}
          {...props}
        >
          <ButtonContent />
        </button>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
        </div>
      </div>
    );
  }
  
  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={buttonClasses}
      {...props}
    >
      <ButtonContent />
    </button>
  );
});

Button.displayName = 'Button';

export default Button;

// Additional specialized button components
export const IconButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'children'>>((props, ref) => (
  <Button
    ref={ref}
    {...props}
    className={`p-2 ${props.className || ''}`}
  />
));

IconButton.displayName = 'IconButton';

export const FabButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'size' | 'rounded'>>((props, ref) => (
  <Button
    ref={ref}
    {...props}
    size="lg"
    rounded={true}
    className={`shadow-lg hover:shadow-xl ${props.className || ''}`}
  />
));

FabButton.displayName = 'FabButton';

export const ButtonGroup = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`inline-flex rounded-lg border border-gray-300 overflow-hidden ${className}`}>
    {React.Children.map(children, (child, index) => {
      if (React.isValidElement<{ className?: string; variant?: string}>(child)) {
        return React.cloneElement(child as React.ReactElement<any>, {
          className: `rounded-none border-none ${
            index === 0 ? 'rounded-l-lg' : 
            index === React.Children.count(children) - 1 ? 'rounded-r-lg' : ''
          } ${child.props.className || ''}`,
          variant: child.props.variant || 'outline'
        });
      }
      return child;
    })}
  </div>
);

ButtonGroup.displayName = 'ButtonGroup';

// Pre-styled button components for common use cases
export const PrimaryButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>((props, ref) => (
  <Button ref={ref} variant="primary" {...props} />
));

PrimaryButton.displayName = 'PrimaryButton';

export const DangerButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>((props, ref) => (
  <Button ref={ref} variant="danger" {...props} />
));

DangerButton.displayName = 'DangerButton';

export const SuccessButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>((props, ref) => (
  <Button ref={ref} variant="success" {...props} />
));

SuccessButton.displayName = 'SuccessButton';

export const OutlineButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>((props, ref) => (
  <Button ref={ref} variant="outline" {...props} />
));

OutlineButton.displayName = 'OutlineButton';