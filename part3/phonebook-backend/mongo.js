const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

if (process.argv.length === 4) {
  console.log('give number as argument')
  process.exit(1)
}

if (process.argv.length > 5) {
  console.log('too many arguments')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://p0p4:${password}@cluster0.wai1xad.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

// defines structure of person
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach((person) => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(({ name, number }) => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
