'use server';
/**
 * @fileOverview A Genkit flow to suggest skills based on a job description and current skills.
 * - suggestSkillsForJobDescription - A function that takes a job description and current skills, and returns suggested skills.
 * - SuggestSkillsInput - The input type.
 * - SuggestSkillsOutput - The output type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSkillsInputSchema = z.object({
  jobDescription: z.string().describe('The job description to analyze.'),
  currentSkills: z.array(z.string()).optional().describe('A list of the candidate\'s current skills. The AI should try to suggest skills not in this list or highly relevant variations.'),
});
export type SuggestSkillsInput = z.infer<typeof SuggestSkillsInputSchema>;

const SuggestSkillsOutputSchema = z.object({
  suggestedSkills: z.array(z.string()).describe('A list of suggested skills based on the job description.'),
});
export type SuggestSkillsOutput = z.infer<typeof SuggestSkillsOutputSchema>;

export async function suggestSkillsForJobDescription(input: SuggestSkillsInput): Promise<SuggestSkillsOutput> {
  return suggestSkillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSkillsPrompt',
  input: {schema: SuggestSkillsInputSchema},
  output: {schema: SuggestSkillsOutputSchema},
  prompt: `Analyze the following job description and suggest a list of relevant skills.
{{#if currentSkills}}
The candidate already has the following skills:
{{#each currentSkills}}- {{this}}
{{/each}}
Please suggest new skills or highly relevant variations that are most aligned with the job description and not just synonyms of existing ones.
{{else}}
The candidate has not provided a list of current skills.
{{/if}}

Job Description:
{{{jobDescription}}}

Return a list of suggested skills. Focus on skills explicitly mentioned or strongly implied by the job duties and requirements. Ensure the suggestions are concise skill names (e.g., "Python", "Project Management", "Data Analysis").
`,
});

const suggestSkillsFlow = ai.defineFlow(
  {
    name: 'suggestSkillsFlow',
    inputSchema: SuggestSkillsInputSchema,
    outputSchema: SuggestSkillsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    // Deduplicate and ensure suggestions are not already in currentSkills (case-insensitive)
    if (output && output.suggestedSkills) {
      const currentSkillsLower = input.currentSkills?.map(s => s.toLowerCase()) || [];
      output.suggestedSkills = Array.from(new Set(output.suggestedSkills.filter(s => !currentSkillsLower.includes(s.toLowerCase()))));
    }
    return output!;
  }
);
