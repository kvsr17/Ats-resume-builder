"use client";
import type React from 'react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useResume } from '@/contexts/ResumeContext';
import { suggestResumeObjective } from '@/ai/flows/suggest-resume-objective';
import { optimizeResumeForJobDescription } from '@/ai/flows/optimize-resume-for-job-description';
import { suggestSkillsForJobDescription } from '@/ai/flows/suggest-skills-flow';
import { optimizeProjectDescription } from '@/ai/flows/optimize-project-description-flow.ts';
import { useToast } from '@/hooks/use-toast';
import { ACTION_ICONS } from '@/lib/constants';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle, PlusCircle } from 'lucide-react';
import type { SkillsSection, ProjectsSection, ProjectEntry } from '@/types/resume';

const AiOptimizerModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  
  const [isLoadingObjective, setIsLoadingObjective] = useState(false);
  const [suggestedObjective, setSuggestedObjective] = useState('');
  
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  const [suggestedSkillsList, setSuggestedSkillsList] = useState<string[]>([]);

  const [selectedProjectIdForOptimization, setSelectedProjectIdForOptimization] = useState<string | undefined>(undefined);
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [optimizedProjectDesc, setOptimizedProjectDesc] = useState('');
  
  const [isLoadingFullResume, setIsLoadingFullResume] = useState(false);
  const [optimizedResumeSuggestion, setOptimizedResumeSuggestion] = useState('');

  const { resumeData, updateSection, getPlainTextResume, addSkill, updateProjectEntry } = useResume();
  const { toast } = useToast();

  const anyLoading = isLoadingObjective || isLoadingSkills || isLoadingProject || isLoadingFullResume;

  const projectsSection = useMemo(() => resumeData.sections.find(s => s.type === 'projects') as ProjectsSection | undefined, [resumeData.sections]);
  const skillsSection = useMemo(() => resumeData.sections.find(s => s.type === 'skills') as SkillsSection | undefined, [resumeData.sections]);

  const handleSuggestObjective = async () => {
    if (!jobDescription.trim()) {
      toast({ title: "Job Description Missing", description: "Please provide a job description.", variant: "destructive" });
      return;
    }
    setIsLoadingObjective(true);
    setSuggestedObjective('');
    try {
      let experienceDetails = "";
      const expSection = resumeData.sections.find(s => s.type === 'experience');
      if (expSection?.type === 'experience') {
        experienceDetails += expSection.entries.map(e => `${e.role} at ${e.company}: ${e.description}`).join('\n');
      }
      const projSectionData = resumeData.sections.find(s => s.type === 'projects');
       if (projSectionData?.type === 'projects') {
        experienceDetails += "\nProjects:\n" + projSectionData.entries.map(e => `${e.name}: ${e.description}`).join('\n');
      }

      const result = await suggestResumeObjective({ jobDescription, experienceDetails: experienceDetails || "No specific experience provided." });
      setSuggestedObjective(result.resumeObjective);
      toast({ title: "Objective Suggested", description: "Review the suggestion below." });
    } catch (error) {
      console.error("Error suggesting objective:", error);
      toast({ title: "Error", description: "Could not suggest objective.", variant: "destructive" });
    }
    setIsLoadingObjective(false);
  };

  const handleApplyObjective = () => {
    const objectiveSection = resumeData.sections.find(s => s.type === 'objective');
    if (objectiveSection && suggestedObjective) {
      updateSection(objectiveSection.id, { content: suggestedObjective });
      toast({ title: "Objective Updated", description: "The resume objective has been updated." });
      setSuggestedObjective(''); 
    } else {
      toast({ title: "No Objective Section", description: "Add an objective section to your resume first.", variant: "destructive" });
    }
  };

  const handleSuggestSkills = async () => {
    if (!jobDescription.trim()) {
      toast({ title: "Job Description Missing", description: "Please provide a job description.", variant: "destructive" });
      return;
    }
    setIsLoadingSkills(true);
    setSuggestedSkillsList([]);
    try {
      const currentSkills = skillsSection ? skillsSection.skills.map(s => s.name) : [];
      const result = await suggestSkillsForJobDescription({ jobDescription, currentSkills });
      setSuggestedSkillsList(result.suggestedSkills);
      toast({ title: "Skills Suggested", description: "Review the suggestions below." });
    } catch (error) {
      console.error("Error suggesting skills:", error);
      toast({ title: "Error", description: "Could not suggest skills.", variant: "destructive" });
    }
    setIsLoadingSkills(false);
  };

  const handleApplySkills = () => {
    if (!skillsSection) {
      toast({ title: "No Skills Section", description: "Add a skills section to your resume first.", variant: "destructive" });
      return;
    }
    if (suggestedSkillsList.length === 0) {
      toast({ title: "No Skills to Add", description: "No new skills were suggested or selected.", variant: "default" });
      return;
    }
    const currentSkillNames = skillsSection.skills.map(s => s.name.toLowerCase());
    let addedCount = 0;
    suggestedSkillsList.forEach(skillName => {
      if (!currentSkillNames.includes(skillName.toLowerCase())) {
        addSkill(skillsSection.id, skillName); // Assuming addSkill can take a name
        addedCount++;
      }
    });
    if (addedCount > 0) {
      toast({ title: "Skills Added", description: `${addedCount} new skill(s) have been added to your resume.` });
    } else {
       toast({ title: "No New Skills Added", description: "All suggested skills are already in your resume or no skills were suggested.", variant: "default" });
    }
    setSuggestedSkillsList([]);
  };
  
  const handleOptimizeSelectedProject = async () => {
    if (!jobDescription.trim()) {
      toast({ title: "Job Description Missing", description: "Please provide a job description.", variant: "destructive" });
      return;
    }
    if (!selectedProjectIdForOptimization || !projectsSection) {
      toast({ title: "Project Not Selected", description: "Please select a project to optimize.", variant: "destructive" });
      return;
    }
    const projectToOptimize = projectsSection.entries.find(p => p.id === selectedProjectIdForOptimization);
    if (!projectToOptimize) {
      toast({ title: "Project Not Found", description: "Could not find the selected project details.", variant: "destructive" });
      return;
    }

    setIsLoadingProject(true);
    setOptimizedProjectDesc('');
    try {
      const result = await optimizeProjectDescription({
        jobDescription,
        projectName: projectToOptimize.name,
        currentDescription: projectToOptimize.description,
        technologiesUsed: projectToOptimize.technologies,
      });
      setOptimizedProjectDesc(result.optimizedDescription);
      toast({ title: "Project Description Optimized", description: "Review the suggestion for your project." });
    } catch (error) {
      console.error("Error optimizing project:", error);
      toast({ title: "Error", description: "Could not optimize project description.", variant: "destructive" });
    }
    setIsLoadingProject(false);
  };

  const handleApplyProjectDescription = () => {
    if (!selectedProjectIdForOptimization || !projectsSection || !optimizedProjectDesc) {
      toast({ title: "Error Applying Suggestion", description: "Missing data to apply project description.", variant: "destructive" });
      return;
    }
    updateProjectEntry(projectsSection.id, selectedProjectIdForOptimization, { description: optimizedProjectDesc });
    toast({ title: "Project Updated", description: "The project description has been updated." });
    setOptimizedProjectDesc('');
    setSelectedProjectIdForOptimization(undefined);
  };

  const handleOptimizeFullResume = async () => {
    if (!jobDescription.trim()) {
      toast({ title: "Job Description Missing", description: "Please provide a job description.", variant: "destructive" });
      return;
    }
    setIsLoadingFullResume(true);
    setOptimizedResumeSuggestion('');
    try {
      const currentResumeText = getPlainTextResume();
      const result = await optimizeResumeForJobDescription({ resume: currentResumeText, jobDescription });
      setOptimizedResumeSuggestion(result);
      toast({ title: "Resume Optimization Suggested", description: "Review the full resume suggestion below. Copy and paste relevant parts manually." });
    } catch (error) {
      console.error("Error optimizing resume:", error);
      toast({ title: "Error", description: "Could not optimize resume.", variant: "destructive" });
    }
    setIsLoadingFullResume(false);
  };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) { // Reset suggestions on close
        setSuggestedObjective('');
        setSuggestedSkillsList([]);
        setOptimizedProjectDesc('');
        setSelectedProjectIdForOptimization(undefined);
        setOptimizedResumeSuggestion('');
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline"><ACTION_ICONS.OptimizeAI className="mr-2 h-4 w-4" /> Optimize with AI</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>AI Resume Optimization</DialogTitle>
          <DialogDescription>
            Enter a job description to get AI-powered suggestions for your resume objective, skills, and project descriptions.
            Image upload for JD is not yet supported, please paste text.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-2 space-y-6 py-4">
          <div>
            <Label htmlFor="job-description" className="text-base font-semibold">Job Description</Label>
            <Textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={8}
              className="mt-1"
            />
          </div>

          {/* Objective Optimization */}
          <div className="space-y-2 border p-4 rounded-md shadow-sm">
            <h3 className="font-semibold text-lg">Resume Objective</h3>
            <Button onClick={handleSuggestObjective} disabled={anyLoading || !jobDescription.trim()} className="w-full sm:w-auto">
              {isLoadingObjective && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Suggest Objective
            </Button>
            {suggestedObjective && (
              <Alert>
                <AlertTitle className="flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-green-500" />Suggested Objective</AlertTitle>
                <AlertDescription className="whitespace-pre-wrap py-2 max-h-40 overflow-y-auto bg-muted p-2 rounded-md my-2">
                  {suggestedObjective}
                </AlertDescription>
                <Button onClick={handleApplyObjective} size="sm" className="mt-2">Apply Suggestion</Button>
              </Alert>
            )}
          </div>
          
          {/* Skills Optimization */}
          <div className="space-y-2 border p-4 rounded-md shadow-sm">
            <h3 className="font-semibold text-lg">Skills</h3>
            <Button onClick={handleSuggestSkills} disabled={anyLoading || !jobDescription.trim()} className="w-full sm:w-auto">
              {isLoadingSkills && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Suggest Skills
            </Button>
            {suggestedSkillsList.length > 0 && (
              <Alert>
                <AlertTitle className="flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-green-500" />Suggested Skills</AlertTitle>
                <AlertDescription className="my-2">
                  <ul className="list-disc pl-5 space-y-1 max-h-40 overflow-y-auto bg-muted p-2 rounded-md">
                    {suggestedSkillsList.map((skill, index) => <li key={index}>{skill}</li>)}
                  </ul>
                </AlertDescription>
                <Button onClick={handleApplySkills} size="sm" className="mt-2" disabled={!skillsSection}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add All Suggested Skills
                </Button>
                 {!skillsSection && <p className="text-xs text-destructive mt-1">Add a skills section to your resume to apply suggestions.</p>}
              </Alert>
            )}
          </div>

          {/* Project Description Optimization */}
          {projectsSection && projectsSection.entries.length > 0 && (
            <div className="space-y-2 border p-4 rounded-md shadow-sm">
              <h3 className="font-semibold text-lg">Project Descriptions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 items-end">
                <div className="w-full">
                  <Label htmlFor="project-select">Select Project to Optimize</Label>
                  <Select 
                    value={selectedProjectIdForOptimization} 
                    onValueChange={setSelectedProjectIdForOptimization}
                    disabled={anyLoading}
                  >
                    <SelectTrigger id="project-select">
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectsSection.entries.map((project: ProjectEntry) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleOptimizeSelectedProject} disabled={anyLoading || !jobDescription.trim() || !selectedProjectIdForOptimization} className="w-full sm:w-auto">
                  {isLoadingProject && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Optimize Selected Project
                </Button>
              </div>
              {optimizedProjectDesc && (
                <Alert>
                  <AlertTitle className="flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-green-500" />Optimized Description for "{projectsSection.entries.find(p=>p.id===selectedProjectIdForOptimization)?.name}"</AlertTitle>
                  <Textarea value={optimizedProjectDesc} readOnly rows={6} className="mt-2 whitespace-pre-wrap bg-muted"/>
                  <Button onClick={handleApplyProjectDescription} size="sm" className="mt-2">Apply to Project</Button>
                </Alert>
              )}
            </div>
          )}
          
          {/* Full Resume Optimization (existing) */}
          <div className="space-y-2 border p-4 rounded-md shadow-sm">
            <h3 className="font-semibold text-lg">Full Resume Optimization</h3>
            <Button onClick={handleOptimizeFullResume} disabled={anyLoading || !jobDescription.trim()} className="w-full sm:w-auto">
              {isLoadingFullResume && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Suggest Full Resume Optimization
            </Button>
            {optimizedResumeSuggestion && (
               <Alert>
                <AlertTitle className="flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-green-500" />Optimized Resume Suggestion</AlertTitle>
                <AlertDescription className="my-2">
                  The AI has provided a full resume suggestion. Review it carefully and manually copy-paste the parts you want to use into your resume sections.
                </AlertDescription>
                <Textarea value={optimizedResumeSuggestion} readOnly rows={10} className="mt-2 whitespace-pre-wrap bg-muted"/>
              </Alert>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AiOptimizerModal;
