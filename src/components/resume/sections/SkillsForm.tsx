"use client";
import type React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ACTION_ICONS } from '@/lib/constants';
import { useResume } from '@/contexts/ResumeContext';
import type { SkillsSection, Skill } from '@/types/resume';

interface SkillsFormProps {
  section: SkillsSection;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ section }) => {
  const { addSkill, updateSkill, deleteSkill } = useResume();

  const handleSkillChange = (skillId: string, value: string) => {
    updateSkill(section.id, skillId, { name: value });
  };

  return (
    <div className="space-y-3">
      {section.skills.map((skill: Skill) => (
        <div key={skill.id} className="flex items-center gap-2">
          <Input
            type="text"
            value={skill.name}
            onChange={(e) => handleSkillChange(skill.id, e.target.value)}
            placeholder="e.g. Python"
            className="flex-grow"
            aria-label={`Skill name ${skill.id}`}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteSkill(section.id, skill.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            aria-label={`Delete skill ${skill.name}`}
          >
            <ACTION_ICONS.Delete className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={() => addSkill(section.id)}
        className="text-sm"
      >
        <ACTION_ICONS.Add className="mr-2 h-4 w-4" /> Add Skill
      </Button>
    </div>
  );
};

export default SkillsForm;
