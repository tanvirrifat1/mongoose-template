import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    firstName: z.string({ required_error: 'FirstName is required' }),
    lastName: z.string({ required_error: 'LastName is required' }),
    contact: z.string({ required_error: 'Contact is required' }),
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: 'Password is required' }),
    location: z
      .object({
        type: z.enum(['Point']).optional(),
        coordinates: z
          .array(z.number())
          .min(2, 'Coordinates must have latitude and longitude'),
      })
      .optional(),
    profile: z.string().optional(),
  }),
});

export const UserValidation = {
  createUserZodSchema,
};
