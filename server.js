require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./backend/config/corsOptions');
const { logger } = require('./backend/middleware/logEvents');
const errorHandler = require('./backend/middleware/errorHandler');
const verifyJWT = require('./backend/middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./backend/middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./backend/config/dbConn');

const PORT = process.env.PORT || 3500;

connectDB();
mongoose.connection.on('error', err => console.error('MongoDB connection error:', err));
app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// serve static files
app.use('/', express.static(path.join(__dirname, '/dist')));

// routes
app.use('/', require('./backend/routes/root'));
app.use('/api/register', require('./backend/routes/register'));
app.use('/api/auth', require('./backend/routes/auth'));
app.use('/api/logout', require('./backend/routes/logout'));
app.use('/api/test', require('./backend/routes/test'))

app.get('*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.use((req, res, next) => {
    console.log(`Unmatched route: ${req.method} ${req.originalUrl}`);
    next();
  });

app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});