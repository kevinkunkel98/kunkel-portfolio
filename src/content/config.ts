import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
    category: z.enum(['Machine Learning', 'Web Development', 'Tutorial', 'Linux', 'Theming', 'Terminal', 'Opinion']).default('Tutorial'),
  }),
});

export const collections = { blog };
