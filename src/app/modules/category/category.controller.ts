import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CategoryService } from './category.service';

const createCategoryIntoDb = catchAsync(async (req, res) => {
  const result = await CategoryService.createCategoryIntoDb(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category created successfully',
    data: result,
  });
});

const getAllCategoryFromDb = catchAsync(async (req, res) => {
  const result = await CategoryService.getAllCategoryFromDb(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category fetched successfully',
    data: result,
  });
});

export const CategoryController = {
  createCategoryIntoDb,
  getAllCategoryFromDb,
};
