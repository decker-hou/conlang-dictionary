import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import indexRouter from './routes/index.js';
import dictionaryRouter from './routes/dictionary.js';
import languagesRouter from './routes/languages.js';

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};

const app = express();
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());

app.use('/', indexRouter);
app.use('/dictionary', dictionaryRouter);
app.use('/language', languagesRouter);

const server = app.listen(8000, () => {
  const { port } = server.address();
  console.log(`App listening on port ${port}`);
});
