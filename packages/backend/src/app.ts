import express from 'express';
import history from 'connect-history-api-fallback';
import path from 'path';
import setupRoutes from '@/setupRoutes';

const app = express();

app.use((req, res, next) => {
  // Sets CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma'
  );

  // Intercept OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.status(204).end();
  } else {
    next();
  }
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

setupRoutes(app);

app.use(history());

app.use(express.static(path.join(__dirname, '../dist')));

export default app;
