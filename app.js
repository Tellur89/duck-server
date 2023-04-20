const express = require('express')
const cors = require('cors')
const questions = require('./src/json/questions.json')
const usernames = require("./src/json/usernames.json")
const logger = require('./src/js/functions/logger')
const fs = require('fs')

const app = express()

// MIDDLEWARE
app.use(cors())
app.use(express.json())
app.use(logger)
// ------

// GET
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/questions', (req, res) => {
  res.send(questions)
})

app.get('/usernames', (req, res) => {
  res.send(usernames)
})

app.get('/questions/:category', (req, res) => {
  const category = req.params.category
  const questionCategory = questions[category]

  if (questionCategory === undefined) {
    res.status(404).send('Error: There is no category with that name')
  } else {
    res.send(questionCategory)
  }
})

app.get('/usernames/:username', (req, res) => {
  const username = req.params.username
  // const enteredUsername = usernames[username]
  let usernamesList = usernames.map(users => users.username)
  console.log(usernamesList)
  
  for(i=0; i < usernamesList.length;i++){
    if (usernamesList[i] === username){
      res.send(usernames[i])
    } 
  } 



  // if (enteredUsername === undefined) {
  //   res.status(404).send('Error: There is no username with that name')
  // } else {
  //   res.send(enteredUsername)
  // }
})


app.get('/questions/:category/:id', (req, res) => {
  const category = req.params.category
  const questionCategory = questions[category]
  if (questionCategory === undefined) {
    res.status(404).send('Error: There is no category with that name')
  }

  const idx = Number(req.params.id)
  const questionsId = questionCategory[idx - 1]
  if (questionsId === undefined) {
    res.status(404).send('Error: There is no id with that name')
  } else {
    res.send(questionsId)
  }
})

// POST
app.post('/questions/:category', (req, res) => {
  const category = req.params.category
  const categoryNewQuestion = questions[category]
  if (categoryNewQuestion === undefined) {
    res.status(404).send('Error: There is no category with that name')
  }

  const question = categoryNewQuestion.find(
    (el) => el.question === req.body.question
  )

  if (question !== undefined) {
    res.status(409).send({ Error: 'Question already exist' })
  } else {
    const newQuestion = req.body
    newQuestion.id = categoryNewQuestion.length + 1
    categoryNewQuestion.push(newQuestion)
    const updateFile = questions

    fs.writeFile(
      './src/json/questions.json',
      JSON.stringify(updateFile),
      () => {
        console.log(JSON.stringify(newQuestion))
      }
    )
    res.status(201).send(newQuestion)
  }
})

// PATCH
app.patch('/questions/:category/:id', (req, res) => {
  const category = req.params.category
  const updateNewQuestions = questions[category]
  const idToUpdate = Number(req.params.id)

  const question = updateNewQuestions.find((el) => el.id === idToUpdate)

  if (!question) {
    return res.status(404).send({ Error: 'Question does not exist' })
  } else {
    try {
      const updateQuestion = { ...req.body, id: idToUpdate }
      const idx = updateNewQuestions.findIndex((el) => el.id === question.id)
      updateNewQuestions[idx] = updateQuestion
      res.send(updateQuestion)
    } catch (err) {
      res.status(400).send('Could not update it')
    }
  }
})

// Delete

app.delete('/questions/:category/:id', (req, res) => {
  const category = req.params.category
  const deleteCategories = questions[category]
  const idToDelete = parseInt(req.params.id)

  const deleteID = deleteCategories.find((item) => item.id === idToDelete)

  if (!deleteID) {
    res.status(404).send({ message: 'Question not found in the category' })
  } else {
    const indexToDelete = deleteCategories.indexOf(deleteID)
    deleteCategories.splice(indexToDelete, 1)
    res.status(204).send()
  }
})

module.exports = app
