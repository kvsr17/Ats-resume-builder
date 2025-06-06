"use client";
import type React from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ACTION_ICONS, SECTION_ICONS } from '@/lib/constants';
import type { SectionType } from '@/types/resume';
import { useResume } from '@/contexts/ResumeContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  sectionId: string;
  sectionType: SectionType;
  title: string;
  children: ReactNode;
  isFirst: boolean;
  isLast: boolean;
  className?: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  sectionId,
  sectionType,
  title,
  children,
  isFirst,
  isLast,
  className,
}) => {
  const { updateSectionTitle, deleteSection, moveSection } = useResume();
  const IconComponent = SECTION_ICONS[sectionType];

  return (
    <Card className={cn("mb-6 shadow-lg", className)}>
      <CardHeader className="bg-secondary p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-grow">
            {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
            <Input
              value={title}
              onChange={(e) => updateSectionTitle(sectionId, e.target.value)}
              className="text-lg font-headline font-semibold border-0 focus-visible:ring-1 focus-visible:ring-primary flex-grow bg-transparent p-1"
              aria-label={`${sectionType} section title`}
            />
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => moveSection(sectionId, 'up')}
              disabled={isFirst}
              aria-label="Move section up"
            >
              <ACTION_ICONS.MoveUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => moveSection(sectionId, 'down')}
              disabled={isLast}
              aria-label="Move section down"
            >
              <ACTION_ICONS.MoveDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteSection(sectionId)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              aria-label="Delete section"
            >
              <ACTION_ICONS.Delete className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  );
};

export default SectionWrapper;
