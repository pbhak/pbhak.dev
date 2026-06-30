import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

// TODO make quantity units an enum?
const quantitySchema = z.object({ amount: z.number(), unit: z.string() })
const ingredientSchema = z.object({
  name: z.string(),
  imperial: quantitySchema,
  metric: quantitySchema.optional(),
  note: z.string().optional(),
  optional: z.boolean().default(false)
})

const recipes = defineCollection({
  loader: glob({ base: "./src/content/recipes", pattern: "**/*.{md, mdx}" }),
  schema: z.object({
    name: z.string(),
    ingredients: z.array(ingredientSchema)
  }),
});

export const collections = { recipes };
