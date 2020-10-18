require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  { 
   "name": "Arto Hellas", 
   "number": "040-123456",
   "id": 1
 },
 { 
   "name": "Ada Lovelace", 
   "number": "39-44-5323523",
   "id": 2
 },
 { 
   "name": "Dan Abramov", 
   "number": "12-43-234345",
   "id": 3
 },
 { 
   "name": "Mary Poppendieck", 
   "number": "39-23-6423122",
   "id": 4
 }
];

app.get('/info', (req, res) => {
  res.send(
    `Phonebook has info for ${persons.length} people
    <br/> <br/>
    ${new Date()}`
  )
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map( person => person.toJSON() ))
  })
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    if (person) res.json(person)
    else res.status(404).end()
  })
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if(!body.name ||	!body.number) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)
  
  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})