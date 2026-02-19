import { defineCollection, z } from "astro:content";

const dispatches = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z.coerce.date(),
    time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
    image: z.string().default("/letter-e.png"),
  }),
});

export const collections = { dispatches };
