import { Router } from 'express';
import { orderRoute } from '../module/order/order.route';
import { carRoute } from '../module/car/car.router';

const router = Router();
const moduleRoutes = [
  {
    path: '/cars',
    route: carRoute,
  },
  {
    path: '/order',
    route: orderRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
