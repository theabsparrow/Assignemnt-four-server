import express, { Request, Response } from 'express';
import cors from 'cors';
import router from './router';
import config from './config';
import globalErrorHandler from './middlewire/globalErrorHandler';
import notFound from './middlewire/notFound';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', router);
const test = (req: Request, res: Response) => {
  const message = `server is running on port ${config.port}`;
  res.send(message);
};

app.get('/', test);
app.use(globalErrorHandler);
app.use(notFound);

export default app;
