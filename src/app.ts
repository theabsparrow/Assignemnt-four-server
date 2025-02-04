import express, { Request, Response } from 'express';
import cors from 'cors';
import carRouter from './module/car/car.router';
import orderRouter from './module/order/order.route';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', carRouter);
app.use('/api', orderRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('car project is running');
});

export default app;
