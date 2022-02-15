import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const categorySchema = new Schema({
  
  categoryName: {
    type: String,
  },
  isProfit: {
    type: Boolean,
    default: false,
  },
   
},{ versionKey: false })

const Category = model('Category', categorySchema)
export default Category