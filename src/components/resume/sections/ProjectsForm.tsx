"use client";
import type React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ACTION_ICONS } from '@/lib/constants';
import { useResume } from '@/contexts/ResumeContext';
import type { ProjectsSection, ProjectEntry } from '@/types/resume';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProjectsFormProps {
  section: ProjectsSection;
}

const ProjectEntryForm: React.FC<{ sectionId: string; entry: ProjectEntry }> = ({ sectionId, entry }) => {
  const { updateProjectEntry, deleteProjectEntry } = useResume();

  const handleChange = (field: keyof ProjectEntry, value: string) => {
    updateProjectEntry(sectionId, entry.id, { [field]: value });
  };

  return (
    <Card className="mb-4 bg-background/50">
      <CardHeader className="p-3">
        <div className="flex justify-between items-center">
        <CardTitle className="text-md font-semibold">{entry.name || "New Project"}</CardTitle>
        <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteProjectEntry(sectionId, entry.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            aria-label="Delete project entry"
          >
            <ACTION_ICONS.Delete className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-3">
        <div>
          <Label htmlFor={`projectName-${entry.id}`}>Project Name</Label>
          <Input id={`projectName-${entry.id}`} value={entry.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="My Awesome App" />
        </div>
        <div>
          <Label htmlFor={`projectDescription-${entry.id}`}>Description (Markdown for bullets)</Label>
          <Textarea id={`projectDescription-${entry.id}`} value={entry.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="- Built feature X using Y..." rows={3} />
        </div>
        <div>
          <Label htmlFor={`projectTech-${entry.id}`}>Technologies Used</Label>
          <Input id={`projectTech-${entry.id}`} value={entry.technologies} onChange={(e) => handleChange('technologies', e.target.value)} placeholder="React, Node.js, PostgreSQL" />
        </div>
        <div>
          <Label htmlFor={`projectLink-${entry.id}`}>Project Link (Optional)</Label>
          <Input id={`projectLink-${entry.id}`} value={entry.link || ''} onChange={(e) => handleChange('link', e.target.value)} placeholder="https://github.com/user/project" />
        </div>
      </CardContent>
    </Card>
  );
};

const ProjectsForm: React.FC<ProjectsFormProps> = ({ section }) => {
  const { addProjectEntry } = useResume();

  return (
    <div className="space-y-4">
      {section.entries.map((entry) => (
        <ProjectEntryForm key={entry.id} sectionId={section.id} entry={entry} />
      ))}
      <Button
        variant="outline"
        onClick={() => addProjectEntry(section.id)}
        className="text-sm"
      >
        <ACTION_ICONS.Add className="mr-2 h-4 w-4" /> Add Project
      </Button>
    </div>
  );
};

export default ProjectsForm;
