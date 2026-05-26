require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');
const mediaRoutes = require('./routes/media');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/media', mediaRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'VNNOX API backend running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
