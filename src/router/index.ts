import { Router } from 'express';
import { orderRoute } from '../module/order/order.route';
import { carRoute } from '../module/car/car.router';
import { userRoute } from '../module/users/user.route';

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
  {
    path: '/user',
    route: userRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
