"use client";
import type React from 'react';
import { useResume } from '@/contexts/ResumeContext';
import type { ObjectiveSection, ExperienceSection, EducationSection, SkillsSection, ProjectsSection, CustomSection, ResumeSection } from '@/types/resume';
import { SECTION_ICONS } from '@/lib/constants';
import { Mail, Phone, Linkedin, Github, Globe } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Basic Markdown components for preview
const mdComponents = {
  ul: ({node, ...props}: any) => <ul className="list-disc pl-5 space-y-1" {...props} />,
  li: ({node, ...props}: any) => <li {...props} />,
  p: ({node, ...props}: any) => <p className="mb-1" {...props} />,
};


const SectionPreviewDisplay: React.FC<{ section: ResumeSection }> = ({ section }) => {
  const Icon = SECTION_ICONS[section.type];

  return (
    <div className="mb-4">
      <h3 className="text-lg font-headline font-semibold text-primary border-b-2 border-primary/50 pb-1 mb-2 flex items-center">
        {Icon && <Icon className="mr-2 h-5 w-5" />}
        {section.title}
      </h3>
      {(() => {
        switch (section.type) {
          case 'objective':
            return <p className="text-sm">{(section as ObjectiveSection).content}</p>;
          case 'experience':
            return (
              <div className="space-y-3">
                {(section as ExperienceSection).entries.map(entry => (
                  <div key={entry.id} className="text-sm">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-semibold">{entry.role}</h4>
                      <p className="text-xs text-muted-foreground">{entry.startDate} - {entry.endDate}</p>
                    </div>
                    <p className="italic text-xs">{entry.company}</p>
                    <ReactMarkdown components={mdComponents} className="text-xs mt-1 prose prose-sm max-w-none">
                      {entry.description}
                    </ReactMarkdown>
                  </div>
                ))}
              </div>
            );
          case 'education':
            return (
              <div className="space-y-3">
                {(section as EducationSection).entries.map(entry => (
                  <div key={entry.id} className="text-sm">
                     <div className="flex justify-between items-baseline">
                      <h4 className="font-semibold">{entry.degree}</h4>
                      <p className="text-xs text-muted-foreground">{entry.graduationDate}</p>
                    </div>
                    <p className="italic text-xs">{entry.institution}</p>
                    {entry.description && <p className="text-xs mt-1">{entry.description}</p>}
                  </div>
                ))}
              </div>
            );
          case 'skills':
            return <p className="text-sm">{(section as SkillsSection).skills.map(s => s.name).join(', ')}</p>;
          case 'projects':
            return (
              <div className="space-y-3">
                {(section as ProjectsSection).entries.map(entry => (
                  <div key={entry.id} className="text-sm">
                    <h4 className="font-semibold">{entry.name} {entry.link && <a href={entry.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-xs">(Link)</a>}</h4>
                    <ReactMarkdown components={mdComponents} className="text-xs mt-1 prose prose-sm max-w-none">
                        {entry.description}
                    </ReactMarkdown>
                    <p className="text-xs mt-1"><strong>Technologies:</strong> {entry.technologies}</p>
                  </div>
                ))}
              </div>
            );
          case 'custom':
            return <ReactMarkdown components={mdComponents} className="text-sm prose prose-sm max-w-none">{(section as CustomSection).content}</ReactMarkdown>;
          default:
            return null;
        }
      })()}
    </div>
  );
};

const ResumePreview: React.FC = () => {
  const { resumeData } = useResume();
  const { contact, sections } = resumeData;

  return (
    <div id="resume-preview-content" className="p-6 bg-white shadow-xl rounded-lg h-full overflow-y-auto print:shadow-none print:p-0">
      <style jsx global>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          #resume-preview-content { margin: 0; padding: 0; border: none; font-size: 10pt; line-height: 1.2; }
          #resume-preview-content h2, #resume-preview-content h3, #resume-preview-content h4 { color: black !important; }
          #resume-preview-content a { color: black !important; text-decoration: none; }
          #resume-preview-content .text-primary { color: black !important; }
          #resume-preview-content .border-primary\\/50 { border-color: #ccc !important; }
        }
      `}</style>
      
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-headline font-bold text-primary">{contact.name}</h2>
        <div className="flex justify-center items-center gap-x-3 gap-y-1 text-xs text-muted-foreground flex-wrap mt-1">
          {contact.email && <span className="flex items-center"><Mail className="mr-1 h-3 w-3" />{contact.email}</span>}
          {contact.phone && <span className="flex items-center"><Phone className="mr-1 h-3 w-3" />{contact.phone}</span>}
          {contact.linkedin && <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-accent"><Linkedin className="mr-1 h-3 w-3" />LinkedIn</a>}
          {contact.github && <a href={contact.github} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-accent"><Github className="mr-1 h-3 w-3" />GitHub</a>}
          {contact.portfolio && <a href={contact.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-accent"><Globe className="mr-1 h-3 w-3" />Portfolio</a>}
        </div>
      </div>

      {/* Sections */}
      {sections.map(section => (
        <SectionPreviewDisplay key={section.id} section={section} />
      ))}
    </div>
  );
};

export default ResumePreview;
