"use client";
import type React from 'react';
import { useResume } from '@/contexts/ResumeContext';
import SectionWrapper from './sections/SectionWrapper';
import ObjectiveForm from './sections/ObjectiveForm';
import SkillsForm from './sections/SkillsForm';
import ExperienceForm from './sections/ExperienceForm';
import EducationForm from './sections/EducationForm';
import ProjectsForm from './sections/ProjectsForm';
import CustomSectionForm from './sections/CustomSectionForm';
import type { ResumeSection } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle } from 'lucide-react';

const ResumeEditor: React.FC = () => {
  const { resumeData, updateContact } = useResume();

  const renderSectionForm = (section: ResumeSection) => {
    switch (section.type) {
      case 'objective':
        return <ObjectiveForm section={section} />;
      case 'skills':
        return <SkillsForm section={section} />;
      case 'experience':
        return <ExperienceForm section={section} />;
      case 'education':
        return <EducationForm section={section} />;
      case 'projects':
        return <ProjectsForm section={section} />;
      case 'custom':
        return <CustomSectionForm section={section} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-card rounded-lg shadow-xl h-full overflow-y-auto">
      <Card className="shadow-lg">
        <CardHeader className="bg-secondary p-4 rounded-t-lg">
          <div className="flex items-center gap-2">
            <UserCircle className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl font-headline font-semibold">Contact Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contact-name">Full Name</Label>
            <Input id="contact-name" value={resumeData.contact.name} onChange={(e) => updateContact('name', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="contact-email">Email</Label>
            <Input id="contact-email" type="email" value={resumeData.contact.email} onChange={(e) => updateContact('email', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="contact-phone">Phone</Label>
            <Input id="contact-phone" type="tel" value={resumeData.contact.phone} onChange={(e) => updateContact('phone', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="contact-linkedin">LinkedIn Profile URL</Label>
            <Input id="contact-linkedin" value={resumeData.contact.linkedin} onChange={(e) => updateContact('linkedin', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="contact-github">GitHub Profile URL</Label>
            <Input id="contact-github" value={resumeData.contact.github} onChange={(e) => updateContact('github', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="contact-portfolio">Portfolio URL</Label>
            <Input id="contact-portfolio" value={resumeData.contact.portfolio} onChange={(e) => updateContact('portfolio', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {resumeData.sections.map((section, index) => (
        <SectionWrapper
          key={section.id}
          sectionId={section.id}
          sectionType={section.type}
          title={section.title}
          isFirst={index === 0}
          isLast={index === resumeData.sections.length - 1}
        >
          {renderSectionForm(section)}
        </SectionWrapper>
      ))}
    </div>
  );
};

export default ResumeEditor;
