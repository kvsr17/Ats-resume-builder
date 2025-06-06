export type SectionType = 'objective' | 'experience' | 'education' | 'skills' | 'projects' | 'custom';

export interface ResumeContact {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface BaseSection {
  id: string;
  type: SectionType;
  title: string; // User-editable title for the section
}

export interface ObjectiveSection extends BaseSection {
  type: 'objective';
  content: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string; // Markdown supported for bullet points
}

export interface ExperienceSection extends BaseSection {
  type: 'experience';
  entries: ExperienceEntry[];
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  graduationDate: string;
  description: string;
}

export interface EducationSection extends BaseSection {
  type: 'education';
  entries: EducationEntry[];
}

export interface Skill {
  id: string;
  name: string;
  // level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'; // Optional
}
export interface SkillsSection extends BaseSection {
  type: 'skills';
  skills: Skill[];
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  technologies: string; // Comma-separated or similar
  link?: string;
}

export interface ProjectsSection extends BaseSection {
  type: 'projects';
  entries: ProjectEntry[];
}

export interface CustomSection extends BaseSection {
  type: 'custom';
  content: string; // Markdown supported
}

export type ResumeSection = 
  | ObjectiveSection 
  | ExperienceSection 
  | EducationSection 
  | SkillsSection 
  | ProjectsSection 
  | CustomSection;

export interface ResumeData {
  contact: ResumeContact;
  sections: ResumeSection[];
}

export const SECTION_TEMPLATES: Record<SectionType, () => Omit<ResumeSection, 'id'>> = {
  objective: () => ({ type: 'objective', title: 'Objective', content: '' }),
  experience: () => ({ type: 'experience', title: 'Experience', entries: [] }),
  education: () => ({ type: 'education', title: 'Education', entries: [] }),
  skills: () => ({ type: 'skills', title: 'Skills', skills: [] }),
  projects: () => ({ type: 'projects', title: 'Projects', entries: [] }),
  custom: () => ({ type: 'custom', title: 'Custom Section', content: '' }),
};
