const express = require('express')
const cors = require('cors')
const questions = require('./src/json/questions.json')

const app = express()
// MIDDLEWARE
app.use(cors())
app.use(express.json())
// ------

// GET
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/questions', (req, res) => {
  res.send(questions)
})


app.get("/questions/:category", (req, res) => {
	const category = req.params.category
	const questionCategory = questions[category]
	// !question
	//   ? res.status(404).json({
	//       Error: "There is no question with the given ID",
	//     })
	//   :	res.send(question)
	if (questionCategory === undefined) {
		res.status(404).send("Error: There is no category with that name")
	} else {res.send(questionCategory)}
	
  })

app.get("/questions/:category/:id", (req, res) => {
	const category = req.params.category
	const questionCategory = questions[category]
	if (questionCategory === undefined) {
		res.status(404).send("Error: There is no category with that name")
	}

	const idx = Number(req.params.id)
	const questionsId = questionCategory[idx-1]
	if (questionsId === undefined) {
		res.status(404).send("Error: There is no id with that name")
	} else {res.send(questionsId)}

})

// POST
app.post('/questions/:category', (req, res) => {
  const category = req.params.category
  const categoryNewQuestion = questions[category]
  if (categoryNewQuestion === undefined) {
	res.status(404).send("Error: There is no category with that name")
}
  const question = categoryNewQuestion.find((el) => el.question === req.body.question)

  if (question !== undefined) {
    res.status(409).json({ Error: 'Question already exist' })
  } else {
    const newQuestion = req.body
    newQuestion.id = categoryNewQuestion.length + 1

    // ADD readFile and writeFile
    //
    //

    categoryNewQuestion.push(newQuestion)
    res.status(201).send(newQuestion)
  }
})

// PATCH
app.patch('/questions/:id', (req, res) => {
  const id = Number(req.params.id)
  // id = Number(id);
  const question = questions.find((el) => (el.id = id))

  if (question === undefined) {
    return res.status(404).send({ Error: 'Question does not exist' })
  }

  try {
    const updateQuestion = { ...req.body, id: question.id }
    const idx = questions.findIndex((el) => el.id === question.id)
    questions[idx] = updateQuestion
    res.send(updateQuestion)
  } catch (err) {
    res.status(400).send('Could not update it')
  }
})

module.exports = app
