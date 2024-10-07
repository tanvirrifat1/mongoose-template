import { ICategory } from './category.interface';
import { Category } from './category.model';

const createCategoryIntoDb = async (payload: ICategory) => {
  const result = await Category.create(payload);
  return result;
};

export const CategoryService = {
  createCategoryIntoDb,
};
