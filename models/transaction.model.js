import mongoose from 'mongoose'
const { Schema, model } = mongoose

const transactionSchema = new Schema({
  
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  categoryName:{
    type: String,
    required: true,
  },
  dateTransaction: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  isProfit: {
    type: Boolean,
    required: true,
  },

  
},{ versionKey: false, timestamps: true,})

const Transaction = model('Transaction', transactionSchema)
export default Transaction