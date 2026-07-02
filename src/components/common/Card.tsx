import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'bordered';
}

export const Card = ({
  children,
  className,
  padding = 'md',
  variant = 'default'
}: CardProps) => {
  const baseClasses = 'rounded-[2rem] transition';

  const variantClasses = {
    default: 'bg-slate-900/95 border border-slate-800',
    elevated: 'bg-slate-900/95 border border-slate-800 shadow-xl shadow-slate-950/20',
    bordered: 'border-2 border-slate-700 bg-slate-950/80',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={clsx(baseClasses, variantClasses[variant], paddingClasses[padding], className)}>
      {children}
    </div>
  );
};