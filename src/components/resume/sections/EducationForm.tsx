"use client";
import type React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ACTION_ICONS } from '@/lib/constants';
import { useResume } from '@/contexts/ResumeContext';
import type { EducationSection, EducationEntry } from '@/types/resume';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EducationFormProps {
  section: EducationSection;
}

const EducationEntryForm: React.FC<{ sectionId: string; entry: EducationEntry }> = ({ sectionId, entry }) => {
  const { updateEducationEntry, deleteEducationEntry } = useResume();

  const handleChange = (field: keyof EducationEntry, value: string) => {
    updateEducationEntry(sectionId, entry.id, { [field]: value });
  };

  return (
    <Card className="mb-4 bg-background/50">
       <CardHeader className="p-3">
         <div className="flex justify-between items-center">
          <CardTitle className="text-md font-semibold">{entry.degree || "New Education Entry"}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteEducationEntry(sectionId, entry.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            aria-label="Delete education entry"
          >
            <ACTION_ICONS.Delete className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-3">
        <div>
          <Label htmlFor={`institution-${entry.id}`}>Institution</Label>
          <Input id={`institution-${entry.id}`} value={entry.institution} onChange={(e) => handleChange('institution', e.target.value)} placeholder="University Name" />
        </div>
        <div>
          <Label htmlFor={`degree-${entry.id}`}>Degree</Label>
          <Input id={`degree-${entry.id}`} value={entry.degree} onChange={(e) => handleChange('degree', e.target.value)} placeholder="B.S. in Computer Science" />
        </div>
        <div>
            <Label htmlFor={`graduationDate-${entry.id}`}>Graduation Date</Label>
            <Input id={`graduationDate-${entry.id}`} value={entry.graduationDate} onChange={(e) => handleChange('graduationDate', e.target.value)} placeholder="May 2020" />
        </div>
        <div>
          <Label htmlFor={`description-${entry.id}`}>Description/Relevant Coursework</Label>
          <Textarea id={`description-${entry.id}`} value={entry.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Relevant coursework, honors, etc." rows={2} />
        </div>
      </CardContent>
    </Card>
  );
};

const EducationForm: React.FC<EducationFormProps> = ({ section }) => {
  const { addEducationEntry } = useResume();

  return (
    <div className="space-y-4">
      {section.entries.map((entry) => (
        <EducationEntryForm key={entry.id} sectionId={section.id} entry={entry} />
      ))}
      <Button
        variant="outline"
        onClick={() => addEducationEntry(section.id)}
        className="text-sm"
      >
        <ACTION_ICONS.Add className="mr-2 h-4 w-4" /> Add Education
      </Button>
    </div>
  );
};

export default EducationForm;
