import express from 'express';
import routes from './routes/routes';
import {errorMiddleware} from './middlewares/errorMiddleware';

const app = express();

app.use(express.json());

app.use('/api', routes);

app.use(errorMiddleware);


export default app;
