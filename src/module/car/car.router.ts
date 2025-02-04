import { Router } from 'express';
import { carController } from './car.controller';

const router = Router();

router.post('/cars', carController.createCar);
router.get('/cars', carController.getAllCars);
router.get('/cars/:carId', carController.getSingleCar);
router.put('/cars/:id', carController.updateCar);
router.delete('/cars/:id', carController.deleteCar);

export const carRoute = router;
