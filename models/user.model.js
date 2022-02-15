import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
  
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  name: {
    type: String,
  },
  balance: {
    type: Number,
    default: 0,
  },
},{ versionKey: false })

const User = model('User', userSchema)
export default User