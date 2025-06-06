import type React from 'react';
import { APP_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';

const PageHeader: React.FC = () => {
  return (
    <header className={cn(
      "bg-primary text-primary-foreground py-4 shadow-md",
      "no-print print:hidden" // Ensure this class is applied directly
    )}>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold">{APP_NAME}</h1>
      </div>
    </header>
  );
};

export default PageHeader;