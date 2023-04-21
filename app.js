const express = require('express')
const cors = require('cors')
const questions = require('./src/json/questions.json')
const usernames = require('./src/json/usernames.json')
const logger = require('./src/js/functions/logger')
const fs = require('fs')
const path = require("path")
const app = express()

// MIDDLEWARE
app.use(cors())
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.json())
app.use(logger)
// ------

// GET
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/index.html')

})

app.get('/questions', (req, res) => {
  res.send(questions)
})

app.get('/usernames', (req, res) => {
  res.send(usernames)
})

app.get('/questions/:category', (req, res) => {
  const category = (req.params.category).toLowerCase()
  // const questionCategory = questions[category]
  // if (questionCategory === undefined) {
  //   res.status(404).send('Error: There is no category with that name')
  // } else {
  //   res.send(questionCategory)
  // }
  // const categoryQuestions = questions.forEach(question => printCategory(question,category))
  const categoryQuestions = questions.filter(question => question.category === category)
  // console.log(categoryQuestions.length)
  if (categoryQuestions.length === 0) {
    res.status(404).send('Error: There is no category with that name')
  } else {
  res.send(categoryQuestions)
  }
})


app.get('/usernames/:username', (req, res) => {
  const username = req.params.username
  const user = usernames.find((userid) => userid.username === username)
  console.log(user)

  if (user === undefined) {
    res.status(404).send('Error: Username not found')
  } else {
    res.send(user)
  }
})

app.get('/questions/:category/:id', (req, res) => {
  const category = req.params.category
  // const questionCategory = questions[category]
  // if (questionCategory === undefined) {
  //   res.status(404).send('Error: There is no category with that name')
  // }

  // const idx = Number(req.params.id)
  // const questionsId = questionCategory[idx - 1]
  // if (questionsId === undefined) {
  //   res.status(404).send('Error: There is no id with that name')
  // } else {
  //   res.send(questionsId)
  // }
  const categoryQuestions = questions.filter(question => question.category === category)
  if (categoryQuestions.length === 0) {
    res.status(404).send('Error: There is no category with that name')
  }

  const idx = Number(req.params.id)
  const questionId = categoryQuestions[idx - 1]
  if (questionId === undefined){
    res.status(404).send(`Error: Question number ${idx} does not exist`)
  } else {
    res.send(questionId)
  }
})

// POST
app.post('/questions/:category', (req, res) => {
  const category = req.params.category
  // const categoryNewQuestion = questions[category]
  // if (categoryNewQuestion === undefined) {
  //   res.status(404).send('Error: There is no category with that name')
  // }
  const categoryNewQuestions = questions.filter(question => question.category === category)
  if (categoryNewQuestions.length === 0) {
    res.status(404).send('Error: There is no category with that name')
  }

  const question = categoryNewQuestions.find(
    (el) => el.question === req.body.question
  )

  if (question !== undefined) {
    res.status(409).send({ Error: 'Question already exist' })
  } else {
    const newQuestion = req.body
    // console.log(newQuestion)
    // newQuestion.id = categoryNewQuestion.length + 1
    questions.push(newQuestion)
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

app.post('/usernames', (req, res) => {
  const newUserDetails = req.body
  const newUsername = usernames.find(
    (userid) => userid.username === req.body.username
  )

  if (newUsername !== undefined) {
    res.status(409).send({ Error: 'Username already exist' })
  } else {
    console.log(newUserDetails)
    usernames.push(newUserDetails)
    const updateFile = usernames

    fs.writeFile(
      './src/json/usernames.json',
      JSON.stringify(updateFile),
      () => {
        console.log(JSON.stringify(newUserDetails))
      }
    )
    res.status(201).send(newUserDetails)
  }
})

// PATCH
// app.patch('/questions/:category/:id', (req, res) => {
//   // console.log(req.body)
//   // const updateNewQuestions = questions[category]
//   const category = req.params.category
  
//   const categoryQuestions = questions.filter(question => question.category === category)
//   if (categoryQuestions.length === 0) {
//     res.status(404).send('Error: There is no category with that name')
//   }

//   const idToUpdate = Number(req.params.id)
//   let questionId = categoryQuestions[idToUpdate - 1]
//   // const question = categoryNewQuestions.find((el) => el.id === idToUpdate)
//   // console.log(questionId)
//   if (!questionId) {
//     return res.status(404).send({ Error: 'Question does not exist' })
//     // ^ Question is acquired here

//   } else {
//     const updateObj = {...req.body, id: idToUpdate}
//     console.log(updateObj)
//     // try {
//       // const updateQuestion = { ...req.body, id: idToUpdate }
//     //   const idx = categoryNewQuestions.findIndex((el) => el.id === question.id)
    
//     // categoryQuestions[1] = updateObj
//     // res.send(updateObj)
//     // console.log(categoryQuestions)

//     // const question = categoryNewQuestions.find(
//     //   (el) => el.question === req.body.question
//     // )
//     //   categoryNewQuestions[idx] = updateQuestion
//     //   res.send(updateQuestion)

//     // } catch (err) {
//       // res.status(400).send('Could not update it')
//     }
//    }
// )

// Delete

// app.delete('/questions/:category/:id', (req, res) => {
//   const category = req.params.category
//   // const deleteCategories = questions[category]
//   const deleteCategories = questions.filter(question => question.category === category)
//   const idToDelete = Number(req.params.id-1)
  
//   if (deleteCategories[idToDelete] === undefined){
//     res.status(404).send({ message: 'Question not found in the category' })
//   } else {
//     deleteCategories.splice(idToDelete,1)
//     console.log(questions)
//   }
//   // const deleteID = deleteCategories.find((item) => indexOf(item) === idToDelete)
  
//   // if (!deleteID) {
//   //   res.status(404).send({ message: 'Question not found in the category' })
//   // } else {
//   //   const indexToDelete = deleteCategories.indexOf(deleteID)
//   //   const updatedFile = questions
//   //   deleteCategories.splice(indexToDelete, 1)
//   //   fs.writeFile(
//   //     './src/json/usernames.json',
//   //     JSON.stringify(updatedFile),
//   //     () => {
//   //       console.log(JSON.stringify(deleteCategories))
//   //     }
//   //   )
//   //   res.status(204).send()
//   // }
// })

module.exports = app
