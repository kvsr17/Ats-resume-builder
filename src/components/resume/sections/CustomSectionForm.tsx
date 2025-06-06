"use client";
import type React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useResume } from '@/contexts/ResumeContext';
import type { CustomSection } from '@/types/resume';

interface CustomSectionFormProps {
  section: CustomSection;
}

const CustomSectionForm: React.FC<CustomSectionFormProps> = ({ section }) => {
  const { updateSection } = useResume();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSection(section.id, { content: e.target.value });
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`custom-content-${section.id}`} className="sr-only">Custom Section Content</Label>
      <Textarea
        id={`custom-content-${section.id}`}
        value={section.content}
        onChange={handleChange}
        placeholder="Enter content for your custom section. Markdown is supported."
        rows={5}
        className="w-full"
      />
    </div>
  );
};

export default CustomSectionForm;
