const express = require('express');
const cors = require('cors');
const questions = require('./src/json/questions.json');

const app = express();
// MIDDLEWARE
app.use(cors());
app.use(express.json());
// ------

// GET
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/questions', (req, res) => {
	res.send(questions);
});

app.get('/questions/:id', (req, res) => {
	const idx = Number(req.params.id);
	const question = questions[idx - 1];

	!question || typeof idx !== 'number'
		? res.status(404).json({
				Error: 'There is no question with the given ID',
		  })
		: res.send(question);
});

// POST
app.post('/questions', (req, res) => {
	const question = questions.find((el) => el.question === req.body.question);

	if (question !== undefined) {
		res.status(409).json({ Error: 'Question already exist' });
	} else {
		const newQuestion = req.body;
		newQuestion.id = questions.length + 1;

		// ADD readFile and writeFile
		//
		//

		questions.push(newQuestion);
		res.status(201).send(newQuestion);
	}
});

// PATCH
app.patch('/questions/:id', (req, res) => {
	const id = Number(req.params.id);
	// id = Number(id);
	const question = questions.find((el) => (el.id = id));

	if (question === undefined) {
		return res.status(404).send({ Error: 'Question does not exist' });
	}

	try {
		const updateQuestion = { ...req.body, id: question.id };
		const idx = questions.findIndex((el) => el.id === question.id);
		questions[idx] = updateQuestion;
		res.send(updateQuestion);
	} catch (err) {
		res.status(400).send('Could not update it');
	}
});

module.exports = app;
