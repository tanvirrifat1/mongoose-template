import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryValidation } from './category.validation';
import { CategoryController } from './category.controller';

const router = express.Router();

router.post(
  '/create-category',
  validateRequest(CategoryValidation.createCategoryZodSchema),
  CategoryController.createCategoryIntoDb
);

router.get('/', CategoryController.getAllCategoryFromDb);

export const CategoryRoute = router;
