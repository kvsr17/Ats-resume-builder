"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ACTION_ICONS, DEFAULT_SECTION_TITLES } from '@/lib/constants';
import AiOptimizerModal from './AiOptimizerModal';
import { useResume } from '@/contexts/ResumeContext';
import type { SectionType } from '@/types/resume';
import { useToast } from '@/hooks/use-toast';

const ResumeToolbar: React.FC = () => {
  const { addSection } = useResume();
  const { toast } = useToast();

  const sectionTypes: SectionType[] = ['objective', 'experience', 'education', 'skills', 'projects', 'custom'];

  const handleAddSection = (type: SectionType) => {
    addSection(type);
    toast({ title: "Section Added", description: `${DEFAULT_SECTION_TITLES[type]} section has been added.`});
  };

  const handleDownloadPdf = () => {
    toast({ title: "Preparing PDF", description: "Your resume will be prepared for printing." });
    // Timeout to allow toast to show before print dialog blocks UI
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleDownloadWord = () => {
    // Placeholder for Word download functionality
    toast({ title: "Feature Coming Soon", description: "Word download functionality is not yet implemented.", variant: "default" });
  };

  return (
    <div className="p-4 bg-card shadow-md rounded-lg mb-6 flex flex-wrap items-center justify-between gap-2 no-print">
      <div className="flex flex-wrap gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline"><ACTION_ICONS.Add className="mr-2 h-4 w-4" /> Add Section</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {sectionTypes.map((type) => (
              <DropdownMenuItem key={type} onClick={() => handleAddSection(type)}>
                {ACTION_ICONS[type.charAt(0).toUpperCase() + type.slice(1) as keyof typeof ACTION_ICONS] ? 
                  React.createElement(ACTION_ICONS[type.charAt(0).toUpperCase() + type.slice(1) as keyof typeof ACTION_ICONS], { className: "mr-2 h-4 w-4" }) :
                  <ACTION_ICONS.Custom className="mr-2 h-4 w-4" />
                }
                {DEFAULT_SECTION_TITLES[type]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <AiOptimizerModal />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button variant="default" onClick={handleDownloadPdf}><ACTION_ICONS.Download className="mr-2 h-4 w-4" /> Download PDF</Button>
        <Button variant="outline" onClick={handleDownloadWord}><ACTION_ICONS.Download className="mr-2 h-4 w-4" /> Download Word (Soon)</Button>
      </div>
    </div>
  );
};

export default ResumeToolbar;
