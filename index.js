import express from 'express';
import { PORT } from './config.js';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/login', (req, res) => {
  res.send('Login page');
});

app.post('/register', (req, res) => {
  res.send('Register page');
});

app.post('/logout', (req, res) => {
  res.send('Register page');
});

app.post('/protected', (req, res) => {
  res.send('Register page');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
