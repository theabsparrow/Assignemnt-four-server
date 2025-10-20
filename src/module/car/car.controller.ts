/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { carService } from './car.service';
import { catchAsync } from '../../utills/catchAsync';
import { sendResponse } from '../../utills/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';

const createCar = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payloade = req.body;
    const user = req.user as JwtPayload;
    const { userId } = user;
    const result = await carService.createCar(payloade, userId);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Car info created successfully',
      data: result,
    });
  },
);

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

const getAllCarList = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await carService.getAllCarList(query);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cars info are retrived successfully',
      data: result,
    });
  },
);

const getMyCars = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const { userId } = req.user as JwtPayload;
    const result = await carService.getMyCars(query, userId);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cars info are retrived successfully',
      data: result,
    });
  },
);

const getMySIngleCar = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { userId } = req.user as JwtPayload;
    const result = await carService.getMySIngleCar(id, userId);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Car info is retrived successfully',
      data: result,
    });
  },
);

const getModelsByBrand = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await carService.getModelsByBrand(query);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cars models are retrived successfully',
      data: result,
    });
  },
);

const getSingleCar = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await carService.getSingleCar(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Car info is retrived successfully',
      data: result,
    });
  },
);

const getCheckoutCar = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { userId } = req.user as JwtPayload;
    const result = await carService.getCheckoutCar(id, userId);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Car checkout info is retrived successfully',
      data: result,
    });
  },
);

const getCarCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await carService.getCarCategories(query);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cars categories are retrived successfully',
      data: result,
    });
  },
);

const getCarBrands = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await carService.getCarBrands(query);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cars brands are retrived successfully',
      data: result,
    });
  },
);

const updatCarInfo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { userId } = req.user as JwtPayload;
    const payload = req.body;
    const result = await carService.updateCarInfo({ id, payload, userId });
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Cars info is updated successfully',
      data: result,
    });
  },
);

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
  getAllCarList,
  getMyCars,
  getMySIngleCar,
  getSingleCar,
  getCheckoutCar,
  updatCarInfo,
  deleteCar,
  getModelsByBrand,
  getCarCategories,
  getCarBrands,
};
