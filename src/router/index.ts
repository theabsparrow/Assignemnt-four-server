import { Router } from 'express';
import { orderRoute } from '../module/order/order.route';
import { carRoute } from '../module/car/car.router';
import { userRoute } from '../module/users/user.route';
import { authRoute } from '../module/auth/auth.route';
import { blogRoute } from '../module/blog/blog.router';
import { reactionRoute } from '../module/reaction/reaction.route';
import { carDeliveryRouter } from '../module/carDelivery/carDelivery.router';
import { carEngineRouter } from '../module/carEngine/carEngine.router';
import { registrationdataRouter } from '../module/registrationData/registrationdata.router';

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
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/blog',
    route: blogRoute,
  },
  {
    path: '/reaction',
    route: reactionRoute,
  },
  {
    path: '/delivery',
    route: carDeliveryRouter,
  },
  {
    path: '/engine',
    route: carEngineRouter,
  },
  {
    path: '/registration',
    route: registrationdataRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
