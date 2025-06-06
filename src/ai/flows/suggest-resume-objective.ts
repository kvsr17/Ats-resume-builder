'use server';

/**
 * @fileOverview This file contains a Genkit flow that suggests a resume objective based on the user's experience and the job they are applying for.
 *
 * - suggestResumeObjective - A function that takes in experience details and job description and returns a suggested resume objective.
 * - SuggestResumeObjectiveInput - The input type for the suggestResumeObjective function.
 * - SuggestResumeObjectiveOutput - The return type for the suggestResumeObjective function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestResumeObjectiveInputSchema = z.object({
  experienceDetails: z
    .string()
    .describe('Details about your work experience, skills, and achievements.'),
  jobDescription: z.string().describe('The description of the job you are applying for.'),
});
export type SuggestResumeObjectiveInput = z.infer<typeof SuggestResumeObjectiveInputSchema>;

const SuggestResumeObjectiveOutputSchema = z.object({
  resumeObjective: z
    .string()
    .describe('A suggested resume objective tailored to the job description and experience.'),
});
export type SuggestResumeObjectiveOutput = z.infer<typeof SuggestResumeObjectiveOutputSchema>;

export async function suggestResumeObjective(
  input: SuggestResumeObjectiveInput
): Promise<SuggestResumeObjectiveOutput> {
  return suggestResumeObjectiveFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestResumeObjectivePrompt',
  input: {schema: SuggestResumeObjectiveInputSchema},
  output: {schema: SuggestResumeObjectiveOutputSchema},
  prompt: `You are an expert resume writer. Your goal is to craft a compelling resume objective based on the provided experience details and job description.

Experience Details: {{{experienceDetails}}}
Job Description: {{{jobDescription}}}

Based on this information, write a concise and impactful resume objective statement.
`, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const suggestResumeObjectiveFlow = ai.defineFlow(
  {
    name: 'suggestResumeObjectiveFlow',
    inputSchema: SuggestResumeObjectiveInputSchema,
    outputSchema: SuggestResumeObjectiveOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
