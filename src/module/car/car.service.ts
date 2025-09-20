/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { carBrandLogo, carSearchAbleFields } from './car.const';
import { TCar, TCarBrand, TcarInfoPayload } from './car.interface';
import Car from './car.model';
import mongoose from 'mongoose';
import { CarEngine } from '../carEngine/carEngine.model';
import { RegistrationData } from '../registrationData/registrationData.model';
import { SafetyFeature } from '../safetyFeatures/safetyFeature.model';
import { ServiceHistory } from '../serviceHistory/serviceHistory.moodel';

// create a car service
const createCar = async (payload: TcarInfoPayload) => {
  const {
    basicInfo,
    engineInfo,
    registrationData,
    safetyFeature,
    serviceHistory,
  } = payload;
  const logo = carBrandLogo[basicInfo.brand as TCarBrand];
  basicInfo.carBrandLogo = logo as string;
  basicInfo.model =
    basicInfo.model.charAt(0).toUpperCase() + basicInfo.model.slice(1);

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // save engine information
    const engineResult = await CarEngine.create([engineInfo], { session });
    if (!engineResult) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'faild to post the car info');
    }
    basicInfo.carEngine = engineResult[0]?._id;
    // registration  info
    const registrationResult = await RegistrationData.create(
      [registrationData],
      { session },
    );
    if (!registrationResult) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'faild to post the car info');
    }
    basicInfo.registrationData = registrationResult[0]?._id;
    // safety feature info
    if (safetyFeature) {
      const safetyFeatureResult = await SafetyFeature.create([safetyFeature], {
        session,
      });
      if (!safetyFeatureResult) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          'faild to post the car info',
        );
      }
      basicInfo.safetyFeature = safetyFeatureResult[0]?._id;
    }
    // service history
    if (serviceHistory) {
      const serviceHistoryResult = await ServiceHistory.create(
        [serviceHistory],
        { session },
      );
      if (!serviceHistoryResult) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          'faild to post the car info',
        );
      }
      basicInfo.serviceHistory = serviceHistoryResult[0]?._id;
    }
    // basic info
    const result = await Car.create([basicInfo], { session });
    if (!result) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'faild to post the car info');
    }
    await session.commitTransaction();
    await session.endSession();
    return result[0];
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(StatusCodes.BAD_REQUEST, err);
  }

  const result = await Car.create(basicInfo);
  return result;
};

// get all cars service with query
const getAllCars = async (query: Record<string, unknown>) => {
  const carQuery = new QueryBuilder(Car.find(), query)
    .search(carSearchAbleFields)
    .filter()
    .sort()
    .paginateQuery()
    .fields();
  const result = await carQuery.modelQuery;
  const meta = await carQuery.countTotal();
  return { meta, result };
};

// get a single car service
const getSingleCar = async (id: string) => {
  const result = await Car.findById(id).populate(
    'carEngine registrationData serviceHistory safetyFeature',
  );
  return result;
};

// update a car data
const updateCarInfo = async (id: string, payload: Partial<TCar>) => {
  if (payload.brand) {
    const logo = carBrandLogo[payload.brand as TCarBrand];
    payload.carBrandLogo = logo as string;
  }
  const result = await Car.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const updateCarImage = async (id: string, payload: Partial<TCar>) => {
  const isCarExists = await Car.findById(id);
  if (!isCarExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no car data found');
  }
  if (isCarExists?.galleryImage && isCarExists?.galleryImage.length === 5) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'maximum 5 photos can be stored',
    );
  }
  const addImageToGallery = await Car.findByIdAndUpdate(
    id,
    {
      $addToSet: {
        galleryImage: { $each: payload?.galleryImage },
      },
    },
    {
      new: true,
      runValidators: true,
    },
  );
  if (!addImageToGallery) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'faild to add image');
  }
  const updatedImage = await Car.findById(id).select('galleryImage');
  return updatedImage;
};

const deleteImageFromGallery = async (id: string, payload: Partial<TCar>) => {
  const isCarExists = await Car.findById(id);
  if (!isCarExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no car data found');
  }

  const deleteImageURL = payload?.galleryImage!.map((ele) => ele.url) || [];

  const deleteImageFromGallery = await Car.findByIdAndUpdate(
    id,
    {
      $pull: { galleryImage: { url: { $in: deleteImageURL } } },
    },
    { new: true, runValidators: true },
  );
  if (!deleteImageFromGallery) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'faild to delete image');
  }
  return deleteImageFromGallery;
};

// delete a car
const deleteCar = async (id: string) => {
  const isCarExist = await Car.findById(id);
  if (!isCarExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'this car is not available');
  }
  if (!isCarExist?.inStock) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'this car is already out of stock',
    );
  }
  const result = await Car.findByIdAndDelete(id);
  return result;
};

export const carService = {
  createCar,
  getAllCars,
  getSingleCar,
  updateCarInfo,
  deleteImageFromGallery,
  deleteCar,
  updateCarImage,
};
