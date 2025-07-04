
"use client";

import type React from 'react';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { ResumeData, ResumeSection, SectionType, ExperienceEntry, EducationEntry, ProjectEntry, Skill, BaseSection, SkillsSection as SkillsSectionType } from '@/types/resume';
import { SECTION_TEMPLATES } from '@/types/resume';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs for NEW items

interface ResumeContextType {
  resumeData: ResumeData;
  updateContact: (field: keyof ResumeData['contact'], value: string) => void;
  addSection: (type: SectionType) => void;
  deleteSection: (sectionId: string) => void;
  updateSection: <T extends ResumeSection>(sectionId: string, updates: Partial<T>) => void;
  updateSectionTitle: (sectionId: string, title: string) => void;
  moveSection: (sectionId: string, direction: 'up' | 'down') => void;
  
  addExperienceEntry: (sectionId: string) => void;
  updateExperienceEntry: (sectionId: string, entryId: string, updates: Partial<ExperienceEntry>) => void;
  deleteExperienceEntry: (sectionId: string, entryId: string) => void;

  addEducationEntry: (sectionId: string) => void;
  updateEducationEntry: (sectionId: string, entryId: string, updates: Partial<EducationEntry>) => void;
  deleteEducationEntry: (sectionId: string, entryId: string) => void;

  addSkill: (sectionId: string, skillName?: string) => void; // Modified to accept skillName
  updateSkill: (sectionId: string, skillId: string, updates: Partial<Skill>) => void;
  deleteSkill: (sectionId: string, skillId: string) => void;

  addProjectEntry: (sectionId: string) => void;
  updateProjectEntry: (sectionId: string, entryId: string, updates: Partial<ProjectEntry>) => void;
  deleteProjectEntry: (sectionId: string, entryId: string) => void;

  setWholeResume: (newResumeData: ResumeData) => void;
  getPlainTextResume: () => string;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const initialResumeData: ResumeData = {
  contact: {
    name: 'Your Name',
    email: 'your.email@example.com',
    phone: '123-456-7890',
    linkedin: 'linkedin.com/in/yourprofile',
    github: 'github.com/yourusername',
    portfolio: 'yourportfolio.com',
  },
  sections: [
    { id: 'fixed-objective-001', type: 'objective', title: 'Objective', content: 'Seeking a challenging role in a dynamic organization...' },
    { 
      id: 'fixed-experience-001', 
      type: 'experience', 
      title: 'Experience', 
      entries: [
        { id: 'fixed-exp-entry-001', company: 'Tech Solutions Inc.', role: 'Software Engineer', startDate: 'Jan 2020', endDate: 'Present', description: '- Developed awesome features.\n- Collaborated with team.' },
      ] 
    },
    {
      id: 'fixed-education-001',
      type: 'education',
      title: 'Education',
      entries: [
        { id: 'fixed-edu-entry-001', institution: 'State University', degree: 'B.S. Computer Science', graduationDate: 'May 2019', description: 'Relevant coursework: Data Structures, Algorithms.'}
      ]
    },
    {
      id: 'fixed-skills-001',
      type: 'skills',
      title: 'Skills',
      skills: [
        { id: 'fixed-skill-001', name: 'JavaScript'},
        { id: 'fixed-skill-002', name: 'React'},
        { id: 'fixed-skill-003', name: 'Node.js'},
      ]
    }
  ],
};

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);

  const updateContact = useCallback((field: keyof ResumeData['contact'], value: string) => {
    setResumeData(prev => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
  }, []);

  const addSection = useCallback((type: SectionType) => {
    const newSectionBase = SECTION_TEMPLATES[type]();
    const newSection: ResumeSection = { ...newSectionBase, id: uuidv4() } as ResumeSection;
    setResumeData(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
  }, []);

  const deleteSection = useCallback((sectionId: string) => {
    setResumeData(prev => ({ ...prev, sections: prev.sections.filter(s => s.id !== sectionId) }));
  }, []);
  
  const updateSection = useCallback(<T extends ResumeSection>(sectionId: string, updates: Partial<T>) => {
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === sectionId ? { ...s, ...updates } : s)
    }));
  }, []);

  const updateSectionTitle = useCallback((sectionId: string, title: string) => {
    updateSection(sectionId, { title } as Partial<ResumeSection>);
  }, [updateSection]);

  const moveSection = useCallback((sectionId: string, direction: 'up' | 'down') => {
    setResumeData(prev => {
      const sections = [...prev.sections];
      const index = sections.findIndex(s => s.id === sectionId);
      if (index === -1) return prev;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= sections.length) return prev;

      const [movedSection] = sections.splice(index, 1);
      sections.splice(newIndex, 0, movedSection);
      return { ...prev, sections };
    });
  }, []);

  interface BaseEntrySection<E extends { id: string }> extends BaseSection {
    entries: E[];
  }

  const createEntryUpdater = <E extends { id: string }, S extends BaseEntrySection<E>>(sectionType: S['type']) => {
    const addEntry = (sectionId: string, newEntryData: Omit<E, 'id'>) => {
      const newEntry = { ...newEntryData, id: uuidv4() } as E; 
      setResumeData(prev => ({
        ...prev,
        sections: prev.sections.map(s => 
          s.id === sectionId && s.type === sectionType 
          ? { ...s, entries: [...(s as S).entries, newEntry] } 
          : s
        )
      }));
    };
    const updateEntry = (sectionId: string, entryId: string, updates: Partial<E>) => {
      setResumeData(prev => ({
        ...prev,
        sections: prev.sections.map(s => 
          s.id === sectionId && s.type === sectionType 
          ? { ...s, entries: (s as S).entries.map(e => e.id === entryId ? { ...e, ...updates } : e) } 
          : s
        )
      }));
    };
    const deleteEntry = (sectionId: string, entryId: string) => {
      setResumeData(prev => ({
        ...prev,
        sections: prev.sections.map(s => 
          s.id === sectionId && s.type === sectionType 
          ? { ...s, entries: (s as S).entries.filter(e => e.id !== entryId) } 
          : s
        )
      }));
    };
    return { addEntry, updateEntry, deleteEntry };
  };
  
  const { 
    addEntry: addExperienceEntryInternal, 
    updateEntry: updateExperienceEntry, 
    deleteEntry: deleteExperienceEntry 
  } = createEntryUpdater<ExperienceEntry, ExperienceSection>('experience');
  const addExperienceEntry = (sectionId: string) => addExperienceEntryInternal(sectionId, { company: '', role: '', startDate: '', endDate: '', description: '' });

  const { 
    addEntry: addEducationEntryInternal, 
    updateEntry: updateEducationEntry, 
    deleteEntry: deleteEducationEntry 
  } = createEntryUpdater<EducationEntry, EducationSection>('education');
  const addEducationEntry = (sectionId: string) => addEducationEntryInternal(sectionId, { institution: '', degree: '', graduationDate: '', description: '' });

  const { 
    addEntry: addProjectEntryInternal, 
    updateEntry: updateProjectEntry, 
    deleteEntry: deleteProjectEntry 
  } = createEntryUpdater<ProjectEntry, ProjectsSection>('projects');
  const addProjectEntry = (sectionId: string) => addProjectEntryInternal(sectionId, { name: '', description: '', technologies: '' });
  
  const addSkill = useCallback((sectionId: string, skillName: string = '') => { // Default skillName to empty string
    const newSkill: Skill = { id: uuidv4(), name: skillName };
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId && s.type === 'skills'
        ? { ...s, skills: [...(s as SkillsSectionType).skills, newSkill] }
        : s
      )
    }));
  }, []);

  const updateSkill = useCallback((sectionId: string, skillId: string, updates: Partial<Skill>) => {
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId && s.type === 'skills'
        ? { ...s, skills: (s as SkillsSectionType).skills.map(sk => sk.id === skillId ? { ...sk, ...updates } : sk) }
        : s
      )
    }));
  }, []);

  const deleteSkill = useCallback((sectionId: string, skillId: string) => {
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId && s.type === 'skills'
        ? { ...s, skills: (s as SkillsSectionType).skills.filter(sk => sk.id !== skillId) }
        : s
      )
    }));
  }, []);

  const setWholeResume = useCallback((newResumeData: ResumeData) => {
    setResumeData(newResumeData);
  }, []);

  const getPlainTextResume = useCallback(() => {
    let plainText = `Name: ${resumeData.contact.name}\nEmail: ${resumeData.contact.email}\nPhone: ${resumeData.contact.phone}\nLinkedIn: ${resumeData.contact.linkedin}\nGitHub: ${resumeData.contact.github}\nPortfolio: ${resumeData.contact.portfolio}\n\n`;
    resumeData.sections.forEach(section => {
      plainText += `## ${section.title.toUpperCase()} ##\n`;
      switch (section.type) {
        case 'objective':
          plainText += `${section.content}\n`;
          break;
        case 'experience':
          section.entries.forEach(entry => {
            plainText += `${entry.role} at ${entry.company} (${entry.startDate} - ${entry.endDate})\n${entry.description}\n\n`;
          });
          break;
        case 'education':
          section.entries.forEach(entry => {
            plainText += `${entry.degree} from ${entry.institution} (Graduated: ${entry.graduationDate})\n${entry.description || ''}\n\n`;
          });
          break;
        case 'skills':
          plainText += `${section.skills.map(s => s.name).join(', ')}\n`;
          break;
        case 'projects':
          section.entries.forEach(entry => {
            plainText += `${entry.name}: ${entry.description}\nTechnologies: ${entry.technologies}\nLink: ${entry.link || 'N/A'}\n\n`;
          });
          break;
        case 'custom':
          plainText += `${section.content}\n`;
          break;
      }
      plainText += "\n";
    });
    return plainText;
  }, [resumeData]);


  return (
    <ResumeContext.Provider value={{ 
      resumeData, 
      updateContact,
      addSection, 
      deleteSection, 
      updateSection, 
      updateSectionTitle,
      moveSection,
      addExperienceEntry, updateExperienceEntry, deleteExperienceEntry,
      addEducationEntry, updateEducationEntry, deleteEducationEntry,
      addSkill, updateSkill, deleteSkill,
      addProjectEntry, updateProjectEntry, deleteProjectEntry,
      setWholeResume,
      getPlainTextResume
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = (): ResumeContextType => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

// Re-declaring these here to avoid circular dependency or overly complex type exports from types/resume.ts
// if they were only defined there and imported into both. This is a common pattern in context files.
interface ExperienceSection extends BaseSection {
  type: 'experience';
  entries: ExperienceEntry[];
}

interface EducationSection extends BaseSection {
  type: 'education';
  entries: EducationEntry[];
}

// Using SkillsSectionType from import as it's directly used.
// interface SkillsSection extends BaseSection {
//   type: 'skills';
//   skills: Skill[];
// }

interface ProjectsSection extends BaseSection {
  type: 'projects';
  entries: ProjectEntry[];
}
