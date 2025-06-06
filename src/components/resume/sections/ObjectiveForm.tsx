"use client";
import type React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useResume } from '@/contexts/ResumeContext';
import type { ObjectiveSection } from '@/types/resume';

interface ObjectiveFormProps {
  section: ObjectiveSection;
}

const ObjectiveForm: React.FC<ObjectiveFormProps> = ({ section }) => {
  const { updateSection } = useResume();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSection(section.id, { content: e.target.value });
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`objective-${section.id}`} className="sr-only">Objective Content</Label>
      <Textarea
        id={`objective-${section.id}`}
        value={section.content}
        onChange={handleChange}
        placeholder="Write your career objective here..."
        rows={4}
        className="w-full"
      />
    </div>
  );
};

export default ObjectiveForm;
