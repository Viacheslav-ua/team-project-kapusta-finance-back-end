import CategoryModel from '../models/category.model'

class CategoryService {

  async getCategory(query) {
    const isProfit = query.isProfit
    if ('isProfit' in query) {
      const data = await CategoryModel.find({isProfit}).sort({categoryName: 1 })
      return data
    } 
    const data = await CategoryModel.find().sort({isProfit: 1, categoryName: 1})
    return data
    }
  }
  
export default new CategoryService
