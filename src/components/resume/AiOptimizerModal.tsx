"use client";
import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useResume } from '@/contexts/ResumeContext';
import { suggestResumeObjective } from '@/ai/flows/suggest-resume-objective';
import { optimizeResumeForJobDescription } from '@/ai/flows/optimize-resume-for-job-description';
import { useToast } from '@/hooks/use-toast';
import { ACTION_ICONS } from '@/lib/constants';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';

const AiOptimizerModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoadingObjective, setIsLoadingObjective] = useState(false);
  const [isLoadingFullResume, setIsLoadingFullResume] = useState(false);
  const [suggestedObjective, setSuggestedObjective] = useState('');
  const [optimizedResumeSuggestion, setOptimizedResumeSuggestion] = useState('');

  const { resumeData, updateSection, getPlainTextResume } = useResume();
  const { toast } = useToast();

  const handleSuggestObjective = async () => {
    if (!jobDescription.trim()) {
      toast({ title: "Job Description Missing", description: "Please provide a job description.", variant: "destructive" });
      return;
    }
    setIsLoadingObjective(true);
    setSuggestedObjective('');
    try {
      // Construct experienceDetails from resume
      let experienceDetails = "";
      const expSection = resumeData.sections.find(s => s.type === 'experience');
      if (expSection && expSection.type === 'experience') {
        experienceDetails += expSection.entries.map(e => `${e.role} at ${e.company}: ${e.description}`).join('\n');
      }
      const projSection = resumeData.sections.find(s => s.type === 'projects');
       if (projSection && projSection.type === 'projects') {
        experienceDetails += "\nProjects:\n" + projSection.entries.map(e => `${e.name}: ${e.description}`).join('\n');
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
      toast({ title: "Objective Updated", description: "The resume objective has been updated with the AI suggestion." });
      setSuggestedObjective(''); // Clear suggestion after applying
    } else {
      toast({ title: "No Objective Section", description: "Add an objective section to your resume first.", variant: "destructive" });
    }
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><ACTION_ICONS.OptimizeAI className="mr-2 h-4 w-4" /> Optimize with AI</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>AI Resume Optimization</DialogTitle>
          <DialogDescription>
            Enter a job description to get AI-powered suggestions for your resume.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-2 space-y-4 py-4">
          <div>
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={8}
            />
          </div>

          <div className="space-y-2">
            <Button onClick={handleSuggestObjective} disabled={isLoadingObjective || isLoadingFullResume} className="w-full sm:w-auto">
              {isLoadingObjective && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Suggest Resume Objective
            </Button>
            {suggestedObjective && (
              <Alert>
                <AlertTitle>Suggested Objective</AlertTitle>
                <AlertDescription className="whitespace-pre-wrap py-2 max-h-40 overflow-y-auto bg-muted p-2 rounded-md">
                  {suggestedObjective}
                </AlertDescription>
                <Button onClick={handleApplyObjective} size="sm" className="mt-2">Apply Suggestion</Button>
              </Alert>
            )}
          </div>
          
          <div className="space-y-2">
            <Button onClick={handleOptimizeFullResume} disabled={isLoadingObjective || isLoadingFullResume} className="w-full sm:w-auto">
              {isLoadingFullResume && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Suggest Full Resume Optimization
            </Button>
            {optimizedResumeSuggestion && (
               <Alert>
                <AlertTitle>Optimized Resume Suggestion</AlertTitle>
                <AlertDescription>
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
