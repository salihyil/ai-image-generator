import { z } from 'zod';

export const imageGeneratorSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  aspectRatio: z
    .enum(['16:9', '1:1', '21:9', '2:3', '3:2', '4:5', '5:4', '9:16', '9:21'])
    .optional(),
  negativePrompt: z.string().optional(),
  seed: z.string().optional(),
  stylePreset: z.string().optional(),
  outputFormat: z.enum(['webp', 'png', 'jpg']),
});
