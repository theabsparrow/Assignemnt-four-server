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
import { DeliveryAndPayment } from '../carDelivery/carDelivery.model';

// create a car service
const createCar = async (payload: TcarInfoPayload) => {
  const {
    basicInfo,
    engineInfo,
    deliveryAndPayment,
    registrationData,
    safetyFeature,
    serviceHistory,
  } = payload;
  const logo = carBrandLogo[basicInfo.brand as TCarBrand];
  basicInfo.carBrandLogo = logo as string;
  basicInfo.model =
    basicInfo.model.charAt(0).toUpperCase() + basicInfo.model.slice(1);
  if (
    payload?.basicInfo?.condition === 'Used' ||
    payload?.basicInfo?.condition === 'Certified Pre-Owned'
  ) {
    payload.basicInfo.negotiable = true;
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // engine information
    const engineResult = await CarEngine.create([engineInfo], { session });
    if (!engineResult) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'faild to post the car info');
    }
    basicInfo.carEngine = engineResult[0]?._id;
    // delivery and payment information
    const deliveryAndPaymentResult = await DeliveryAndPayment.create(
      [deliveryAndPayment],
      { session },
    );
    if (!deliveryAndPaymentResult) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'faild to post the car info');
    }
    basicInfo.deliveryAndPayment = deliveryAndPaymentResult[0]?._id;
    // registration  info
    if (registrationData) {
      const registrationResult = await RegistrationData.create(
        [registrationData],
        { session },
      );
      if (!registrationResult) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          'faild to post the car info',
        );
      }
      basicInfo.registrationData = registrationResult[0]?._id;
    }

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
};

// get all cars service with query
const getAllCars = async (query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = {};
  filter.isDeleted = false;
  if (query.inStock) {
    query.inStock = query.inStock === 'yes' ? true : false;
  } else {
    filter.inStock = true;
  }
  query = { ...filter, ...query };
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
  if (!result || result?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'this car data not found');
  }
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

// car image section
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
  const isCarExist = await Car.findById(id).select('isDeleted');
  if (!isCarExist || isCarExist?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'this car is not available');
  }
  const carEngine = isCarExist?.carEngine;
  const deliveryAndPayment = isCarExist?.deliveryAndPayment;
  const registartionData = isCarExist?.registrationData;
  const safetyFeature = isCarExist?.safetyFeature;
  const serviceHistory = isCarExist?.serviceHistory;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // basic info deletion
    const deletebasicInfo = await Car.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { session, new: true, runValidators: true },
    );
    if (!deletebasicInfo) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'faild to delete the car');
    }
    // engine info deletion
    const deleteEngineInfo = await CarEngine.findByIdAndUpdate(
      carEngine,
      { isDeleted: true },
      { session, new: true, runValidators: true },
    );
    if (!deleteEngineInfo) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'faild to delete the car');
    }
    // delivery and payment deletion
    const deleteDeliveryAndPayment = await DeliveryAndPayment.findByIdAndUpdate(
      deliveryAndPayment,
      { isDeleted: true },
      { session, new: true, runValidators: true },
    );
    if (!deleteDeliveryAndPayment) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'faild to delete the car');
    }
    // registration data Deletion
    if (registartionData) {
      const deleteRegistrationData = await RegistrationData.findByIdAndUpdate(
        registartionData,
        { isDeleted: true },
        { session, new: true, runValidators: true },
      );
      if (!deleteRegistrationData) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'faild to delete the car');
      }
    }
    // safety feature deletion
    if (safetyFeature) {
      const deleteSafetyFeature = await SafetyFeature.findByIdAndUpdate(
        registartionData,
        { isDeleted: true },
        { session, new: true, runValidators: true },
      );
      if (!deleteSafetyFeature) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'faild to delete the car');
      }
    }
    // service history deletion
    if (serviceHistory) {
      const deleteServiceHistory = await ServiceHistory.findByIdAndUpdate(
        serviceHistory,
        { isDeleted: true },
        { session, new: true, runValidators: true },
      );
      if (!deleteServiceHistory) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'faild to delete the car');
      }
    }
    await session.commitTransaction();
    await session.endSession();
    return deletebasicInfo;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(StatusCodes.BAD_REQUEST, err);
  }
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
