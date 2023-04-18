const express = require('express');
const cors = require('cors');
const questions = require('./src/json/questions.json');

const app = express();
// MIDDLEWARE
app.use(cors());
app.use(express.json());
// ------

module.exports = app;

// GET
app.get('/', (req, res) => {
	res.sendFile('./index.html');
});

app.get('/questions', (req, res) => {
	res.send(questions);
});

app.get('questions/:id', (req, res) => {
	const idx = Number(req.params.id);
	const question = questions[idx - 1];

	!question || typeof idx !== 'number'
		? res.status(404).json({
				Error: 'There is no question with the given ID',
		  })
		: res.send(question);
});
