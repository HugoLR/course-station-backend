const mongoose = require('mongoose')
const { Schema } = mongoose

const courseSchema = new Schema ({
  _id:Schema.Types.ObjectId,
  title: String,
  description: String,
  url: String,
  instructors:[{
    type:String
  }
  ],
  image:String,
  plattform: String,
  level:String,
  price:Number,
  duration: Number,
  commentsText:[{
    type:String
  }],
  commentsRating:[{
    type:Number
  }],
  comments: [{
    type:Schema.Types.ObjectId,
    ref:"Comment"
  }
  ]
})

module.exports = mongoose.model('Course', courseSchema)
