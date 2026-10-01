import * as React from 'react';

const variants = { default: 'bg-primary text-primary-foreground', destructive: 'bg-destructive text-destructive-foreground', success: 'bg-green-600 text-white', secondary: 'bg-muted text-muted-foreground' } as const;

export const Badge = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement> & { variant?: keyof typeof variants }>(({ className, variant, children, ...props }, ref) => {
  const variantClass = variant ? variants[variant] : variants.default;
  return <span ref={ref} className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${variantClass} ${className || ''}`} {...props}>{children}</span>;
});
Badge.displayName = 'Badge';