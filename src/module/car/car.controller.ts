/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { carService } from './car.service';
import { catchAsync } from '../../utills/catchAsync';
import { sendResponse } from '../../utills/sendResponse';
import { StatusCodes } from 'http-status-codes';

// create a car data controller
const createCar = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payloade = req.body;
    const result = await carService.createCar(payloade);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Car info created successfully',
      data: result,
    });
  },
);

// get all cars controller
const getAllCars = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await carService.getAllCars(query);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cars info are retrived successfully',
      data: result,
    });
  },
);

// get a specefic car controller
const getSingleCar = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await carService.getSingleCar(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cars info is retrived successfully',
      data: result,
    });
  },
);

// update a car info
const updatCarInfo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body;
    const result = await carService.updateCarInfo(id, payload);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cars info is updated successfully',
      data: result,
    });
  },
);

// update car image info
const updatedCarImage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const id = req.params.id;
    const result = await carService.updateCarImage(id, payload);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cars image is updated successfully',
      data: result,
    });
  },
);

// delete a car data
const deleteCar = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = carService.deleteCar(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cars info is deleted successfully',
      data: result,
    });
  },
);

export const carController = {
  createCar,
  getAllCars,
  getSingleCar,
  updatCarInfo,
  deleteCar,
  updatedCarImage,
};
