import QueryBuilder from '../../builder/QueryBuilder';
import { categorySearchAbleField } from './category.constant';
import { ICategory } from './category.interface';
import { Category } from './category.model';

const createCategoryIntoDb = async (payload: ICategory) => {
  const result = await Category.create(payload);
  return result;
};

const getAllCategoryFromDb = async (query: Record<string, unknown>) => {
  const categoryQuery = new QueryBuilder(Category.find(), query)
    .search(categorySearchAbleField)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await categoryQuery.modelQuery;
  return result;
};

export const CategoryService = {
  createCategoryIntoDb,
  getAllCategoryFromDb,
};
