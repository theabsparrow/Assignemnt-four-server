/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import Car from '../car/car.model';
import { updateSafetyFeature } from './safetyFeature.interface';
import { SafetyFeature } from './safetyFeature.model';
import mongoose from 'mongoose';

const updateSafetyFeature = async (
  id: string,
  payload: Partial<updateSafetyFeature>,
) => {
  const iscarExists = await Car.findById(id).select('isDeleted safetyFeature');
  if (!iscarExists || iscarExists?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'this car info not found');
  }
  const safetyFeature = await SafetyFeature.findById(
    iscarExists?.safetyFeature,
  ).select('feature');
  const { addFeatures, removeFeatures, ...remaining } = payload;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    let result;
    if (iscarExists?.safetyFeature) {
      if (addFeatures && addFeatures.length > 0) {
        result = await SafetyFeature.findByIdAndUpdate(
          safetyFeature?._id,
          { $addToSet: { features: { $each: addFeatures } } },
          { session, new: true, runValidators: true },
        );
        if (!result) {
          throw new AppError(
            StatusCodes.BAD_REQUEST,
            'faild to update car gallery image',
          );
        }
      }
      if (removeFeatures && removeFeatures.length > 0) {
        const updatedQuery: any = {
          $pull: { features: { $in: removeFeatures } },
        };
        if (removeFeatures.includes('Air Bags')) {
          updatedQuery.$unset = { airbags: 1 };
        }
        result = await SafetyFeature.findByIdAndUpdate(
          safetyFeature?._id,
          updatedQuery,
          { session, new: true, runValidators: false },
        );
        if (!result) {
          throw new AppError(
            StatusCodes.BAD_REQUEST,
            'faild to remove feature',
          );
        }
      }
      if (
        safetyFeature &&
        safetyFeature?.features?.length &&
        !safetyFeature?.features.includes('Air Bags') &&
        payload.airbags
      ) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          'There is no air bag feature in the car',
        );
      }
      result = await SafetyFeature.findByIdAndUpdate(
        safetyFeature?._id,
        remaining,
        {
          session,
          new: true,
          runValidators: true,
        },
      );
      if (!result) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          'faild to update safety feature info',
        );
      }
    } else {
      if (payload?.airbags && !payload?.features?.includes('Air Bags')) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          'There is not air bag feature in the car',
        );
      }
      const safety = await SafetyFeature.create([payload], { session });
      if (!safety.length) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          'faild to update service history info',
        );
      }
      const updateCar = await Car.findByIdAndUpdate(id, {
        safetyFeature: safety[0]?._id,
      });
      if (!updateCar) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          'faild to update service history info',
        );
      }
      result = safety[0];
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

export const safetyFeatureService = {
  updateSafetyFeature,
};
