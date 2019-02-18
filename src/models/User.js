const mongoose = require ('mongoose')
const { Schema }  = mongoose

const userSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: {
    type:String,
    required: true
  },
  username:{
    type:String,
    required: true
  },
  email: {
    type:String,
    unique: true
  },
  password: {
    type:String,
    required:true },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
})

module.exports = mongoose.model('User', userSchema)
