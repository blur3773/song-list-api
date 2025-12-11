const express = require('express');
const path = require('path');
const songRoutes = require('./routes/songRoutes');
const logger = require('./middleware/logger');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(logger);

// Маршруты
app.use('/api/songs', songRoutes);

module.exports = app;