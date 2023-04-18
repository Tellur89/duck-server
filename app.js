const express = require('express');
const cors = require('cors');
const questions = require('./src/json/questions.json');

const app = express();
// MIDDLEWARE
app.use(cors());
app.use(express.json());
// ------

module.exports = app;
