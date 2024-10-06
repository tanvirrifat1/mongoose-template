import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile from '../../../shared/unlinkFile';
import generateOTP from '../../../util/generateOTP';
import { IUser } from './user.interface';
import { User } from './user.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { userSearchAbleField } from './user.constant';

const createUserToDB = async (payload: Partial<IUser>): Promise<IUser> => {
  //set role
  // payload.role = USER_ROLES.USER;

  const ExistEmail = await User.findOne({ email: payload.email });

  const ExistAppId = await User.findOne({ appId: payload.appId });

  if (ExistEmail) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, 'Email adready exist');
  }

  if (ExistAppId) {
    throw new ApiError(StatusCodes.BAD_GATEWAY, 'AppId adready exist');
  }

  const { type, appId } = payload;

  if (type === 'social') {
    const user = await User.findOne({ appId });

    if (user) {
      return user;
    }
    const createUser = await User.create(payload);
    if (!createUser) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
    }

    //send email
    const otp = generateOTP();
    const values = {
      name: createUser.name,
      otp: otp,
      email: createUser.email!,
    };
    const createAccountTemplate = emailTemplate.createAccount(values);
    emailHelper.sendEmail(createAccountTemplate);

    //save to DB
    const authentication = {
      oneTimeCode: otp,
      expireAt: new Date(Date.now() + 3 * 60000),
    };
    await User.findOneAndUpdate(
      { _id: createUser._id },
      { $set: { authentication } }
    );

    return createUser;
  }
  const result = await User.create(payload);
  return result;
};

// const createUserToDB = async (payload: Partial<IUser>): Promise<IUser> => {
//   //set role
//   // payload.role = USER_ROLES.USER;

//   const createUser = await User.create(payload);
//   if (!createUser) {
//     throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
//   }

//   //send email
//   const otp = generateOTP();
//   const values = {
//     name: createUser.name,
//     otp: otp,
//     email: createUser.email!,
//   };
//   const createAccountTemplate = emailTemplate.createAccount(values);
//   emailHelper.sendEmail(createAccountTemplate);

//   //save to DB
//   const authentication = {
//     oneTimeCode: otp,
//     expireAt: new Date(Date.now() + 3 * 60000),
//   };
//   await User.findOneAndUpdate(
//     { _id: createUser._id },
//     { $set: { authentication } }
//   );

//   return createUser;
// };

const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (payload.profile) {
    unlinkFile(isExistUser.profile);
  }
  console.log(payload);
  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

const getAllUserFromDb = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(userSearchAbleField)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;
  return result;
};

const deleteUserFromDb = async (id: string) => {
  const result = await User.findByIdAndDelete(id);

  return result;
};

export const UserService = {
  createUserToDB,
  getUserProfileFromDB,
  updateProfileToDB,
  getAllUserFromDb,
  deleteUserFromDb,
};
