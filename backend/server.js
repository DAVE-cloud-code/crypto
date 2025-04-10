const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
// const apiRoutes = require('./routes/api');
const cors = require('cors')
dotenv.config();


const app = express();

app.use(cors())
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api', apiRoutes);

const MONGO = process.env.MONGODB_URI
// Connect to MongoDB Atlas
mongoose.connect(MONGO,)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => console.error(err));
