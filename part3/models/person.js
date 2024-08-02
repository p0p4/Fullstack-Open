const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, 'must be at least 3 characters long'],
  },
  number: {
    type: String,
    required: true,
    minLength: [8, 'must be at least 8 characters long'],
    validate: {
      validator(val) {
        // regular expression (regex), cursed
        const regex = /^\d{2,3}-\d+$/
        return regex.test(val)
      },
      message: ({ value }) =>
        `${value} is not a valid number! (e.g. 12-3456789 or 123-4567890)`,
    },
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
