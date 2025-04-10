import express, { Request, Response } from 'express';
import cors from 'cors';
import router from './router';
import config from './config';
import globalErrorHandler from './middlewire/globalErrorHandler';
import notFound from './middlewire/notFound';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://lambo-car-frontend.vercel.app',
  ],
  credentials: true,
};
app.use(cors(corsOptions));

app.use('/api', router);
const test = (req: Request, res: Response) => {
  const message = `server is running on port ${config.port}`;
  res.send(message);
};

app.get('/', test);
app.use(globalErrorHandler);
app.use(notFound);

export default app;
