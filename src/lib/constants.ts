import type { Icon } from 'lucide-react';
import { UserCircle, Briefcase, GraduationCap, Wrench, FolderKanban, ClipboardPlus, PlusCircle, Trash2, ArrowUp, ArrowDown, Download, Wand2, FileText, Settings2, Eye } from 'lucide-react';
import type { SectionType } from '@/types/resume';

export const APP_NAME = "ATS Resume Builder";

export const SECTION_ICONS: Record<SectionType, Icon> = {
  objective: UserCircle,
  experience: Briefcase,
  education: GraduationCap,
  skills: Wrench,
  projects: FolderKanban,
  custom: ClipboardPlus,
};

export const ACTION_ICONS = {
  Add: PlusCircle,
  Delete: Trash2,
  MoveUp: ArrowUp,
  MoveDown: ArrowDown,
  Download: Download,
  OptimizeAI: Wand2,
  Custom: FileText,
  Settings: Settings2,
  Preview: Eye,
};

export const DEFAULT_SECTION_TITLES: Record<SectionType, string> = {
  objective: "Objective",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  custom: "Custom Section",
};
