import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const recipes = defineCollection({
  loader: glob({ base: "./src/content/recipes", pattern: "**/*.{md, mdx}" }),
  schema: z.object({
    name: z.string()
  }),
});

export const collections = { recipes };
