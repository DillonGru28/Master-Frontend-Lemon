import express from 'express';
import bodyParser from 'body-parser';

export const createApp = () => {
  const app = express();

  // Remember remove bodyparser is legacy
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  return app;
};
