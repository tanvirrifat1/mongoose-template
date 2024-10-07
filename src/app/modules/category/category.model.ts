import { model, Schema } from 'mongoose';
import { ICategory } from './category.interface';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

const categorySchema = new Schema<ICategory>(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

categorySchema.pre('save', async function (next) {
  const isCategoryExist = await Category.findOne({
    categoryName: this.categoryName,
  });

  if (isCategoryExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Category already exist!');
  }
  next();
});

export const Category = model<ICategory>('Category', categorySchema);
