import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { recipeSchema } from "./schemas/recipe";

const recipes = defineCollection({
  loader: glob({ base: "./src/content/recipes", pattern: "**/*.{yml,yaml}" }),
  schema: recipeSchema,
});

export const collections = { recipes };
