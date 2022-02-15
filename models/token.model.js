import mongoose from 'mongoose'
const { Schema, model } = mongoose

const tokenSchema = new Schema({
  
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },

  
},{ versionKey: false })

const Token = model('Token', tokenSchema)
export default Token