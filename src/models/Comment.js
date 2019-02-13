const mongoose = require ('mongoose')
const { Schema }  = mongoose

const commentSchema = new Schema ({
  _id: Schema.Types.ObjectId,
  text: {
    type:String,
    required: true
  },
  ratings: {
    type:Number,
    required: true
  },
  user: { type:Schema.Types.ObjectId, ref: 'User'},
  course: { type:Schema.Types.ObjectId, ref: "Course"}
})

module.exports = mongoose.model('Comment', commentSchema)
