import TransactionModel from '../models/transaction.model'
import UserModel from '../models/user.model'
import CategoryModel from '../models/category.model'
import ApiError from '../exceptions/api.error'
import mongoose from 'mongoose'
import monthName from '../json/month.json'

class StatisticService {

  async summary(userId, countMonths) {
    const data = []
    
    for (let i = countMonths; i > 0; i -= 1) {
      const date = new Date()
      date.setMonth(date.getMonth() - i + 1)
      const startDate = new Date(date)
      const endDate = new Date(date)
      const monthNumber = date.getMonth()

      startDate.setDate(1)
      startDate.setHours(3, 0, 0)
      
      endDate.setMonth(date.getMonth() + 1)
      endDate.setDate(0)
      endDate.setHours(3, 0, 0)
      const result = await TransactionModel.aggregate([
        {$match: {
          "userId": new mongoose.Types.ObjectId(userId),
          "dateTransaction": { $gte: startDate, $lte: endDate}
        }},
        {$group : {
          _id: "$isProfit",
          totalAmount: { $sum: "$amount"},
          count: { $sum: 1 }, 
          }
        }
      ])
      const obj  = {
        id: i,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        description: monthName.ru[monthNumber] + ' ' + startDate.getFullYear(),
        profit: {...result.find(item => item._id)},
        costs: {...result.find(item => !item._id)},
      }

      data.push(obj)
    }
    return data
  }

  async categoryGrouping(userId, strDate, isProfit) {
    const { startDate, endDate } = this.rangeDate(strDate)
    const result = await TransactionModel.aggregate([
      {$match: {
        "userId": new mongoose.Types.ObjectId(userId),
        isProfit,
        "dateTransaction": { $gte: startDate, $lt: endDate}
      }},
      {$group : {
        _id: {
          categoryId: "$categoryId",
          categoryName: "$categoryName",
          startDate: startDate,
        },
        totalAmount: { $sum: "$amount"},
        count: { $sum: 1 }, 
        }
      }
    ])

    return result
  }

  async itemsGrouping(userId, categoryId, date) {
    
    const { startDate, endDate } = this.rangeDate(date)
    const result = await TransactionModel.aggregate([
      {$match: {
        "userId": new mongoose.Types.ObjectId(userId),
        "categoryId": new mongoose.Types.ObjectId(categoryId),
        "dateTransaction": { $gte: startDate, $lt: endDate},
        
      }}, 
      {
        $group : { 
        _id: "$description",
        totalAmount: { $sum: "$amount"},
        count: { $sum: 1 }, 
        }
      }
    ]).sort({ totalAmount: 'desc' })

    return result
  }

  rangeDate(strDate) {
    const date = new Date(strDate)
    const startDate = new Date(strDate)
    const endDate = new Date(strDate)
    startDate.setDate(1)
    endDate.setMonth(date.getMonth() + 1)
    return { startDate, endDate }
  }

}

export default new StatisticService