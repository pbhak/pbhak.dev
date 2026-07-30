import { z } from "astro/zod";

// TODO make quantity units an enum?
const quantitySchema = z.object({
  amount: z.number(),
  unit: z.string().optional(),
});

const ingredientSchema = z.object({
  name: z.string(),
  imperial: quantitySchema,
  metric: quantitySchema.optional(),
  note: z.string().optional(),
  optional: z.boolean().default(false),
});

export const recipeSchema = z.object({
  title: z.string(),
  ingredients: z.array(ingredientSchema),
});

export const decimalToFractionMap = {
  0.125: '⅛',
  0.375: '⅜',
  0.25 : '¼',
  0.333: '⅓',
  0.666: '⅔',
  0.5  : '½',
  0.667: '⅔',
  0.75 : '¾'
}

export type Quantity = z.infer<typeof quantitySchema>;
export type Ingredient = z.infer<typeof ingredientSchema>;
