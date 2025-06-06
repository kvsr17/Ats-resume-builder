'use server';
/**
 * @fileOverview A Genkit flow to optimize a single project description based on a job description.
 * - optimizeProjectDescription - A function that takes project details and a job description, and returns an optimized project description.
 * - OptimizeProjectInput - The input type.
 * - OptimizeProjectOutput - The output type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeProjectInputSchema = z.object({
  jobDescription: z.string().describe('The job description to align the project with.'),
  projectName: z.string().describe('The name of the project.'),
  currentDescription: z.string().describe('The current description of the project. This description uses Markdown for bullet points.'),
  technologiesUsed: z.string().optional().describe('Technologies used in the project.'),
});
export type OptimizeProjectInput = z.infer<typeof OptimizeProjectInputSchema>;

const OptimizeProjectOutputSchema = z.object({
  optimizedDescription: z.string().describe('The optimized project description, tailored to the job description. This should be a complete rewrite of the description, ready to be used directly, formatted in Markdown for bullet points (e.g., "- Achieved X...").'),
});
export type OptimizeProjectOutput = z.infer<typeof OptimizeProjectOutputSchema>;

export async function optimizeProjectDescription(input: OptimizeProjectInput): Promise<OptimizeProjectOutput> {
  return optimizeProjectFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeProjectDescriptionPrompt',
  input: {schema: OptimizeProjectInputSchema},
  output: {schema: OptimizeProjectOutputSchema},
  prompt: `You are an expert resume writer. Optimize the following project description to better align with the provided job description. Highlight aspects of the project that are most relevant to the job.

Job Description:
{{{jobDescription}}}

Project Name: {{{projectName}}}
{{#if technologiesUsed}}
Technologies Used: {{{technologiesUsed}}}
{{/if}}
Current Project Description (uses Markdown for bullet points):
{{{currentDescription}}}

Provide an improved, complete project description using Markdown for bullet points (e.g., "- Achieved X..."). Use action verbs and quantify achievements where possible. Focus on making the project sound impressive and relevant to the job.
`,
});

const optimizeProjectFlow = ai.defineFlow(
  {
    name: 'optimizeProjectFlow',
    inputSchema: OptimizeProjectInputSchema,
    outputSchema: OptimizeProjectOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
