import React from 'react';
import Button from './Button';
import { IconType } from 'react-icons';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

interface ErrorProps {
    title?: string;
    message?: string;
    onRetry: () => void;
    retryLabel?: string;
    icon?: IconType;
    className?: string;
    children?: React.ReactNode;
}

const Error: React.FC<ErrorProps> = ({
    title = 'Something went wrong',
    message = 'An unexpected error occurred. Please try again.',
    onRetry,
    retryLabel = 'Retry',
    icon: Icon = FiAlertTriangle,
    className = '',
    children,
}) => {
    return (
        <div className={`w-full flex flex-col items-center justify-center text-center gap-4 px-6 py-10 rounded-2xl border border-red-500/30 bg-red-500/5 ${className}`}>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 border border-red-500/30">
                <Icon size={22} className="text-red-300" />
            </div>

            <div className="space-y-1">
                <h3 className="text-lg font-semibold text-red-200">{title}</h3>
                {message && (
                    <p className="text-sm text-red-300/90 max-w-prose">{message}</p>
                )}
                {children}
            </div>

            <div className="pt-2">
                <Button variant="danger" onClick={onRetry} icon={FiRefreshCw} iconPosition="left">
                    {retryLabel}
                </Button>
            </div>
        </div>
    );
};

export default Error;


