const mongoose = require('mongoose')
const { Schema } = mongoose

const courseSchema = new Schema ({
  _id:Schema.Types.ObjectId,
  name: String,
  slug: String
})

module.exports = mongoose.model('Course', courseSchema)
