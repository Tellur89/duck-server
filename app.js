const express = require('express');
const cors = require('cors');
const questions = require('./src/json/questions.json');
const logger = require('./src/js/functions/logger');
const fs = require('fs');

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(logger);
// ------

// GET
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/questions', (req, res) => {
	res.send(questions);
});

app.get('/questions/:category', (req, res) => {
	const category = req.params.category;
	const questionCategory = questions[category];

	if (questionCategory === undefined) {
		res.status(404).send('Error: There is no category with that name');
	} else {
		res.send(questionCategory);
	}
});

app.get('/questions/:category/:id', (req, res) => {
	const category = req.params.category;
	const questionCategory = questions[category];
	if (questionCategory === undefined) {
		res.status(404).send('Error: There is no category with that name');
	}

	const idx = Number(req.params.id);
	const questionsId = questionCategory[idx - 1];
	if (questionsId === undefined) {
		res.status(404).send('Error: There is no id with that name');
	} else {
		res.send(questionsId);
	}
});

// POST
app.post('/questions/:category', (req, res) => {
	const category = req.params.category;
	const categoryNewQuestion = questions[category];
	if (categoryNewQuestion === undefined) {
		res.status(404).send('Error: There is no category with that name');
	}
	const question = categoryNewQuestion.find((el) => el.question === req.body.question);

	if (question !== undefined) {
		res.status(409).send({ Error: 'Question already exist' });
	} else {
		const newQuestion = req.body;
		newQuestion.id = categoryNewQuestion.length + 1;
		categoryNewQuestion.push(newQuestion);
		const updateFile = questions;

		fs.writeFile('./src/json/questions.json', JSON.stringify(updateFile), () => {
			console.log(JSON.stringify(newQuestion));
			res.end();
		});
		res.status(201).send(newQuestion);
	}
});

// PATCH
app.patch('/questions/:category/:id', (req, res) => {
	const category = req.params.category;
	const addNewCategories = questions[category];
	const id = Number(req.params.id);
	const newID = addNewCategories[id - 1];
	console.log(newID);
	// id = Number(id);
	const question = addNewCategories.find((el) => (el.id = newID));

	if (question === undefined) {
		return res.status(404).send({ Error: 'Question does not exist' });
	}

	try {
		const updateQuestion = { ...req.body, id: newID.id };
		console.log(newID.id);
		const idx = addNewCategories.findIndex((el) => el.id === question.id);
		addNewCategories[idx] = updateQuestion;
		res.send(updateQuestion);
	} catch (err) {
		res.status(400).send('Could not update it');
	}
});

module.exports = app;
