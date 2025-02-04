import { Tcar, Tquery } from './car.interface';
import CarModel from './car.model';

// create a car service
const createCar = async (payload: Tcar) => {
  const result = await CarModel.create(payload);
  return result;
};

// get all cars service with query
const getAllCars = async (queryData: Tquery) => {
  const { searchTerm } = queryData;
  const filterData = searchTerm
    ? {
        $or: [
          { brand: { $regex: searchTerm || '', $options: 'i' } },
          { model: { $regex: searchTerm || '', $options: 'i' } },
          { category: { $regex: searchTerm || '', $options: 'i' } },
        ],
      }
    : {};
  const result = await CarModel.find(filterData);
  return result;
};

// get a single car service
const getSingleCar = async (id: string) => {
  const result = await CarModel.findById(id);
  return result;
};

// update a car data
const updateCar = async (id: string, data: Tcar) => {
  const result = await CarModel.findByIdAndUpdate(id, data, {
    new: true,
  });
  return result;
};

// delete a car
const deleteCar = async (id: string) => {
  const result = await CarModel.findByIdAndDelete(id);
  return result;
};

export const carService = {
  createCar,
  getAllCars,
  getSingleCar,
  updateCar,
  deleteCar,
};
