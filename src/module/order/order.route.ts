import { Router } from 'express';
import { orderController } from './order.controller';

const router = Router();

router.post('/orders', orderController.createOrder);
router.get('/orders/revenue', orderController.totalReveneu);

export const orderRoute = router;
