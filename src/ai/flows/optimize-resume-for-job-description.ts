'use server';
/**
 * @fileOverview This file defines a Genkit flow to optimize a resume based on a job description.
 *
 * - optimizeResumeForJobDescription - A function that takes a resume and job description as input and returns an optimized resume.
 * - OptimizeResumeForJobDescriptionInput - The input type for the optimizeResumeForJobDescription function.
 * - OptimizeResumeForJobDescriptionOutput - The return type for the optimizeResumeForJobDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeResumeForJobDescriptionInputSchema = z.object({
  resume: z.string().describe('The resume content to be optimized.'),
  jobDescription: z.string().describe('The job description to optimize the resume for.'),
});
export type OptimizeResumeForJobDescriptionInput = z.infer<typeof OptimizeResumeForJobDescriptionInputSchema>;

const OptimizeResumeForJobDescriptionOutputSchema = z.string().describe('The optimized resume content.');
export type OptimizeResumeForJobDescriptionOutput = z.infer<typeof OptimizeResumeForJobDescriptionOutputSchema>;

export async function optimizeResumeForJobDescription(
  input: OptimizeResumeForJobDescriptionInput
): Promise<OptimizeResumeForJobDescriptionOutput> {
  return optimizeResumeForJobDescriptionFlow(input);
}

const optimizeResumeForJobDescriptionPrompt = ai.definePrompt({
  name: 'optimizeResumeForJobDescriptionPrompt',
  input: {schema: OptimizeResumeForJobDescriptionInputSchema},
  output: {schema: OptimizeResumeForJobDescriptionOutputSchema},
  prompt: `You are an expert resume optimizer. Given the following resume and job description, suggest changes to the resume's skills, project descriptions, and objective to better match the job requirements. Return the entire optimized resume.

Resume:
{{resume}}

Job Description:
{{jobDescription}}`,
});

const optimizeResumeForJobDescriptionFlow = ai.defineFlow(
  {
    name: 'optimizeResumeForJobDescriptionFlow',
    inputSchema: OptimizeResumeForJobDescriptionInputSchema,
    outputSchema: OptimizeResumeForJobDescriptionOutputSchema,
  },
  async input => {
    const {output} = await optimizeResumeForJobDescriptionPrompt(input);
    return output!;
  }
);
