import { z } from 'zod';

const createCategoryZodSchema = z.object({
  body: z.object({
    categoryName: z.string({ required_error: 'categoryName is required' }),
  }),
});

export const CategoryValidation = {
  createCategoryZodSchema,
};
