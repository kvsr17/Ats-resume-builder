"use client";
import type React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ACTION_ICONS } from '@/lib/constants';
import { useResume } from '@/contexts/ResumeContext';
import type { ExperienceSection, ExperienceEntry } from '@/types/resume';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExperienceFormProps {
  section: ExperienceSection;
}

const ExperienceEntryForm: React.FC<{ sectionId: string; entry: ExperienceEntry }> = ({ sectionId, entry }) => {
  const { updateExperienceEntry, deleteExperienceEntry } = useResume();

  const handleChange = (field: keyof ExperienceEntry, value: string) => {
    updateExperienceEntry(sectionId, entry.id, { [field]: value });
  };

  return (
    <Card className="mb-4 bg-background/50">
      <CardHeader className="p-3">
        <div className="flex justify-between items-center">
        <CardTitle className="text-md font-semibold">{entry.role || "New Experience"}</CardTitle>
        <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteExperienceEntry(sectionId, entry.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            aria-label="Delete experience entry"
          >
            <ACTION_ICONS.Delete className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-3">
        <div>
          <Label htmlFor={`role-${entry.id}`}>Role</Label>
          <Input id={`role-${entry.id}`} value={entry.role} onChange={(e) => handleChange('role', e.target.value)} placeholder="Software Engineer" />
        </div>
        <div>
          <Label htmlFor={`company-${entry.id}`}>Company</Label>
          <Input id={`company-${entry.id}`} value={entry.company} onChange={(e) => handleChange('company', e.target.value)} placeholder="Acme Corp" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor={`startDate-${entry.id}`}>Start Date</Label>
            <Input id={`startDate-${entry.id}`} value={entry.startDate} onChange={(e) => handleChange('startDate', e.target.value)} placeholder="Jan 2020" />
          </div>
          <div>
            <Label htmlFor={`endDate-${entry.id}`}>End Date</Label>
            <Input id={`endDate-${entry.id}`} value={entry.endDate} onChange={(e) => handleChange('endDate', e.target.value)} placeholder="Present" />
          </div>
        </div>
        <div>
          <Label htmlFor={`description-${entry.id}`}>Description (use Markdown for bullets)</Label>
          <Textarea id={`description-${entry.id}`} value={entry.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="- Achieved X by doing Y..." rows={3} />
        </div>
      </CardContent>
    </Card>
  );
};

const ExperienceForm: React.FC<ExperienceFormProps> = ({ section }) => {
  const { addExperienceEntry } = useResume();

  return (
    <div className="space-y-4">
      {section.entries.map((entry) => (
        <ExperienceEntryForm key={entry.id} sectionId={section.id} entry={entry} />
      ))}
      <Button
        variant="outline"
        onClick={() => addExperienceEntry(section.id)}
        className="text-sm"
      >
        <ACTION_ICONS.Add className="mr-2 h-4 w-4" /> Add Experience
      </Button>
    </div>
  );
};

export default ExperienceForm;
