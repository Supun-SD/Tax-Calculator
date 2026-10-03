import React, { forwardRef } from 'react';

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  variant?: 'default' | 'outline' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  className?: string;
  labelClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      variant = 'default',
      size = 'md',
      error,
      helperText,
      leftIcon,
      rightIcon,
      prefix,
      suffix,
      className = '',
      labelClassName = '',
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'w-full font-medium outline-none transition-all duration-200 rounded-lg';

    const variantClasses = {
      default: 'bg-surface-2 text-white',
      outline: 'bg-transparent text-white border-2 border-gray-600',
      filled: 'bg-surface-2 text-white border',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-3 text-lg',
    };

    const errorClasses = error
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
      : '';

    const inputClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${errorClasses} ${className}`;

    const labelBaseClasses = 'block text-white font-medium mb-2';
    const labelClasses = `${labelBaseClasses} ${labelClassName}`;

    return (
      <div className="w-full">
        {label && <label className={labelClasses}>{label}</label>}
        <div className="relative">
          {(leftIcon || prefix) && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 transform font-medium text-gray-400">
              {prefix && <span className="mr-1">{prefix}</span>}
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`${inputClasses} ${leftIcon || prefix ? 'pl-10' : ''} ${rightIcon || suffix ? 'pr-10' : ''}`}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 transform font-medium text-gray-400">
              {suffix}
            </div>
          )}
          {rightIcon && !suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
