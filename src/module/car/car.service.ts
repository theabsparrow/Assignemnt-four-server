import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { TEngine } from '../carEngine/carEngine.interface';
import { TRegistrationdata } from '../registrationData/registrationData.interface';
import { TSafetyFeature } from '../safetyFeatures/safetyFeature.interface';
import { TserviceHistory } from '../serviceHistory/serviceHistory.interface';
import { carBrandLogo, carSearchAbleFields } from './car.const';
import { TCar, TCarBrand, TGalleryImage } from './car.interface';
import Car from './car.model';

type TcarInfoPayload = {
  basicInfo: TCar;
  engineInfo?: TEngine;
  registrationData?: TRegistrationdata;
  safetyFeature?: TSafetyFeature;
  serviceHistory?: TserviceHistory;
};
// create a car service
const createCar = async (payload: TcarInfoPayload) => {
  const { basicInfo } = payload;
  const logo = carBrandLogo[basicInfo.brand as TCarBrand];
  basicInfo.carBrandLogo = logo as string;

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
  const result = await Car.findById(id);
  return result;
};

// update a car data
const updateCarInfo = async (id: string, payload: Partial<TCar>) => {
  const result = await Car.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const updateCarImage = async (id: string, payload: TGalleryImage[]) => {
  const isCarExists = await Car.findById(id);
  if (!isCarExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no car data found');
  }
  const deleteImageURL = payload
    .filter((element) => element.url && element.isDeleted)
    .map((ele) => ele.url);

  const deleteImageFromGallery = await Car.findByIdAndUpdate(
    id,
    {
      $pull: { galleryImage: { $in: deleteImageURL } },
    },
    { new: true },
  );
  if (!deleteImageFromGallery) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'faild to delete image');
  }

  const addImageURL = payload.filter((element) => !element.isDeleted);
  const addImageToGallery = await Car.findByIdAndUpdate(
    id,
    {
      $addToSet: {
        galleryImage: { $each: addImageURL },
      },
    },
    {
      new: true,
    },
  );
  if (!addImageToGallery) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'faild to add image');
  }
  const updatedImage = await Car.findById(id).select('galleryImage');
  return updatedImage;
};

const updateQuantity = async (id: string, payload: { quantity: number }) => {
  const { quantity } = payload;
  const isCarExists = await Car.findById(id);
  if (!isCarExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no car data found');
  }
  const updateQuantity: { quantity: number; inStock?: boolean } = {
    quantity,
  };
  if (quantity === 0) {
    updateQuantity.inStock = false as boolean;
  }
  const result = await Car.findByIdAndUpdate(id, updateQuantity, { new: true });
  return result;
};

// delete a car
const deleteCar = async (id: string) => {
  const result = await Car.findByIdAndDelete(id);
  return result;
};

export const carService = {
  createCar,
  getAllCars,
  getSingleCar,
  updateCarInfo,
  deleteCar,
  updateCarImage,
  updateQuantity,
};
