import type React from 'react';
import { APP_NAME } from '@/lib/constants';

const PageHeader: React.FC = () => {
  return (
    <header className="bg-primary text-primary-foreground py-4 shadow-md">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold">{APP_NAME}</h1>
      </div>
    </header>
  );
};

export default PageHeader;
