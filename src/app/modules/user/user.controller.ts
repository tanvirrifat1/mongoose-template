import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ...userData } = req.body;
    const result = await UserService.createUserToDB(userData);
    console.log(result);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User created successfully',
      data: result,
    });
  }
);

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserService.getUserProfileFromDB(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile data retrieved successfully',
    data: result,
  });
});

//update profile
const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    let profile;
    if (req.files && 'image' in req.files && req.files.image[0]) {
      profile = `/images/${req.files.image[0].filename}`;
    }

    const data = {
      profile,
      ...req.body,
    };
    const result = await UserService.updateProfileToDB(user, data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile updated successfully',
      data: result,
    });
  }
);

const getAllUserFromDb = catchAsync(async (req, res) => {
  const result = await UserService.getAllUserFromDb(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Get all user retrive successfully',
    data: result,
  });
});

const updateUserLocation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { coordinates } = req.body;

    const result = await UserService.updateUserLocation(id, coordinates);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User location updated successfully',
      data: result,
    });
  }
);

const findUsersByLocations = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { longitude, latitude, maxDistance } = req.query;

    // Ensure coordinates are numbers
    const coordinates: [number, number] = [
      parseFloat(longitude as string),
      parseFloat(latitude as string),
    ];

    const result = await UserService.findUsersByLocation(
      coordinates,
      parseFloat(maxDistance as string)
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Find user location successfully',
      data: result,
    });
  }
);

export const UserController = {
  createUser,
  getUserProfile,
  updateProfile,
  getAllUserFromDb,
  updateUserLocation,
  findUsersByLocations,
};
