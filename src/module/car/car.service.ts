/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { carBrandLogo, carSearchAbleFields } from './car.const';
import { TCarBrand, TcarInfoPayload, TUpdateCarInfo } from './car.interface';
import Car from './car.model';
import mongoose, { Types } from 'mongoose';
import { CarEngine } from '../carEngine/carEngine.model';
import { RegistrationData } from '../registrationData/registrationData.model';
import { SafetyFeature } from '../safetyFeatures/safetyFeature.model';
import { ServiceHistory } from '../serviceHistory/serviceHistory.moodel';
import { DeliveryAndPayment } from '../carDelivery/carDelivery.model';
import { User } from '../users/user.model';

const createCar = async (payload: TcarInfoPayload, userId: string) => {
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
  // validate basic info
  if (
    payload?.basicInfo?.condition === 'Used' ||
    payload?.basicInfo?.condition === 'Certified Pre-Owned'
  ) {
    payload.basicInfo.negotiable = true;
  }
  // validate safety feature
  if (safetyFeature) {
    if (
      safetyFeature?.features.includes('Air Bags') &&
      !safetyFeature.airbags
    ) {
      throw new AppError(StatusCodes.NOT_FOUND, 'air bag is missing');
    }
    if (basicInfo.condition === 'New' && !safetyFeature.warranty) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        'brand new car must has a warranty',
      );
    }
  }
  // validate delivery and payment
  if (
    deliveryAndPayment.paymentMethod.includes('Online Payment') &&
    !deliveryAndPayment.paymentOption?.length
  ) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'payment option is missing for online payment',
    );
  }
  payload.basicInfo.user = new Types.ObjectId(userId);
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

const getAllCars = async (query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = {};
  filter.isDeleted = false;
  filter.inStock = query?.inStock ? query.inStock === 'yes' : true;
  query.limit = query?.limit ? query.limit : '21';
  query = {
    ...filter,
    fields: 'brand, model, price, year, image, category, condition negotiable',
    ...query,
  };
  const carQuery = new QueryBuilder(Car.find(), query)
    .search(carSearchAbleFields)
    .filter()
    .sort()
    .paginateQuery()
    .fields();
  const result = await carQuery.modelQuery;
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'No data found');
  }
  const meta = await carQuery.countTotal();
  if (query?.limit === '21') {
    let models: string[] = [];
    if (query?.brand) {
      models = await Car.distinct('model', { brand: query.brand });
    }
    const totalCar = await Car.countDocuments({
      inStock: true,
      isDeleted: false,
    });
    const highestCarPrice = await Car.findOne(
      { isDeleted: false },
      { price: 1 },
    )
      .sort({ price: -1 })
      .lean();
    const lowestPrice = await Car.findOne({ isDeleted: false }, { price: 1 })
      .sort({ price: 1 })
      .lean();
    const maxPrice = highestCarPrice?.price ?? 0;
    const minPrice = lowestPrice?.price ?? 0;
    return { meta, result, models, totalCar, maxPrice, minPrice };
  } else {
    return result;
  }
};

const getAllCarList = async (query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = {};
  filter.isDeleted = false;
  if (query?.inStock) {
    filter.inStock = query.inStock === 'Available' ? true : false;
  }
  if (query?.negotiable) {
    filter.negotiable = query.negotiable === 'Yes';
  }
  query.limit = 30;
  query = {
    ...query,
    fields:
      ' model, brand, category, condition, year, madeIn, inStock, negotiable, createdAt, price',
    ...filter,
  };
  const carQuery = new QueryBuilder(Car.find(), query)
    .search(carSearchAbleFields)
    .filter()
    .sort()
    .paginateQuery()
    .fields();
  const result = await carQuery.modelQuery;
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'No data found');
  }
  const meta = await carQuery.countTotal();
  let models: string[] = [];
  if (query?.brand) {
    models = await Car.distinct('model', { brand: query.brand });
  }
  const totalCar = await Car.countDocuments({
    inStock: true,
    isDeleted: false,
  });

  const highestCarPrice = await Car.findOne({ isDeleted: false }, { price: 1 })
    .sort({ price: -1 })
    .lean();
  const lowestPrice = await Car.findOne({ isDeleted: false }, { price: 1 })
    .sort({ price: 1 })
    .lean();
  const maxPrice = highestCarPrice?.price ?? 0;
  const minPrice = lowestPrice?.price ?? 0;
  return { meta, result, models, totalCar, maxPrice, minPrice };
};

const getModelsByBrand = async (query: Record<string, unknown>) => {
  const highestCarPrice = await Car.findOne({}, { price: 1, isDeleted: false })
    .sort({ price: -1 })
    .lean();
  const lowestPrice = await Car.findOne({}, { price: 1 })
    .sort({ price: 1 })
    .lean();
  const maxPrice = highestCarPrice?.price ?? 0;
  const minPrice = lowestPrice?.price ?? 0;
  if (query?.brand) {
    const models = await Car.distinct('model', { brand: query.brand });
    return { models, maxPrice, minPrice };
  }
  return { maxPrice, minPrice };
};

const getSingleCar = async (id: string) => {
  const result = await Car.findById(id)
    .select('-updatedAt')
    .populate('carEngine registrationData serviceHistory safetyFeature');
  if (!result || result?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'this car data not found');
  }
  const carBrand = await Car.find({
    brand: result?.brand,
    isDeleted: false,
  })
    .sort('-createdAt')
    .limit(5)
    .select('brand model image price category year condition negotiable');
  const carCategory = await Car.find({
    category: result?.category,
    isDeleted: false,
  })
    .sort('-createdAt')
    .limit(5)
    .select('brand model image price category year condition negotiable');
  return { result, carBrand, carCategory };
};

const getCheckoutCar = async (id: string, userId: string) => {
  const car = await Car.findOne({ _id: id, isDeleted: false })
    .select(
      'brand model category image price year condition negotiable inStock deliveryAndPayment',
    )
    .populate('deliveryAndPayment');
  if (!car) {
    throw new AppError(StatusCodes.NOT_FOUND, 'car checkout data not found');
  }
  const userInfo = await User.findById(userId).select(
    'name email phoneNumber gender profileImage verifyWithEmail',
  );
  if (!userInfo) {
    throw new AppError(StatusCodes.NOT_FOUND, 'car checkout data not found');
  }
  return { car, userInfo };
};

const getCarCategories = async (query: Record<string, unknown>) => {
  if (!query?.limit) {
    const carCategories = await Car.aggregate([
      {
        $group: {
          _id: '$category',
          image: { $first: '$image' },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          image: 1,
        },
      },
    ]);
    return carCategories;
  } else {
    const cars = await Car.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$category',
          image: { $first: '$image' },
        },
      },
      {
        $limit: Number(query?.limit),
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          image: 1,
        },
      },
    ]);
    return cars;
  }
};

const getCarBrands = async (query: Record<string, unknown>) => {
  if (!query.limit) {
    const result = await Car.aggregate([
      {
        $group: {
          _id: '$brand',
          carBrandLogo: { $first: '$carBrandLogo' },
          carCount: { $sum: 1 },
        },
      },
      { $sort: { carCount: -1 } },
      {
        $project: {
          _id: 0,
          brand: '$_id',
          carBrandLogo: 1,
        },
      },
    ]);
    return result;
  } else {
    const result = await Car.aggregate([
      {
        $group: {
          _id: '$brand',
          carBrandLogo: { $first: '$carBrandLogo' },
          carCount: { $sum: 1 },
        },
      },
      { $sort: { carCount: -1 } },
      { $limit: Number(query?.limit) },
      {
        $project: {
          _id: 0,
          brand: '$_id',
          carBrandLogo: 1,
        },
      },
    ]);
    return result;
  }
};

const updateCarInfo = async (id: string, payload: Partial<TUpdateCarInfo>) => {
  const isCarExists = await Car.findById(id).select('isDeleted');
  if (!isCarExists || isCarExists?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'car data not found');
  }
  const { addGalleryImage, removeGalleryImage, ...remaining } = payload;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    let result;
    // add gallery image
    if (addGalleryImage && addGalleryImage.length > 0) {
      result = await Car.findByIdAndUpdate(
        id,
        { $addToSet: { galleryImage: { $each: addGalleryImage } } },
        { session, new: true, runValidators: true },
      );
      if (!result) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          'faild to update car gallery image',
        );
      }
    }
    // remove gallery image
    if (removeGalleryImage && removeGalleryImage.length > 0) {
      result = await Car.findByIdAndUpdate(
        id,
        { $pull: { galleryImage: { $in: removeGalleryImage } } },
        { session, new: true, runValidators: true },
      );
      if (!result) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          'faild to remove car gallery image',
        );
      }
    }
    // update remaining data
    if (remaining.brand) {
      remaining.carBrandLogo = carBrandLogo[remaining.brand as TCarBrand];
    }
    result = await Car.findByIdAndUpdate(id, remaining, {
      session,
      new: true,
      runValidators: true,
    });
    if (!result) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'faild to update car Info');
    }
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(StatusCodes.BAD_REQUEST, err);
  }
};

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
  getAllCarList,
  getModelsByBrand,
  getSingleCar,
  getCheckoutCar,
  updateCarInfo,
  deleteCar,
  getCarCategories,
  getCarBrands,
};
