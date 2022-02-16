import TransactionModel from '../models/transaction.model'
import UserModel from '../models/user.model'
import CategoryModel from '../models/category.model'
import ApiError from '../exceptions/api.error'
import mongoose from 'mongoose'

class TransactionService {

  async addTransaction(userId, body, reception) {
    const transaction = await TransactionModel.create({userId, ...body})
    if (!transaction) {
      throw ApiError.NotImplemented('Ошибка добавления транзакции')
    }
    const { isProfit } = body
    const user = await UserModel.findById(userId)
    if(isProfit) {
      const balance = user.balance + transaction.amount
      user.balance = balance.toFixed(2)
    } else {
      const balance = user.balance - transaction.amount
      user.balance = balance.toFixed(2)
    }
    await user.save()
    return await this.getAll(userId, reception, isProfit)
  }

  async remove(transactionId, userId, reception) {
    const transaction = await TransactionModel.findOneAndRemove({ _id: transactionId, userId})
    if (!transaction) {
      throw ApiError.NotImplemented('Ошибка удаления транзакции')
    }
    const isProfit = transaction.isProfit
    const user = await UserModel.findById(userId)
    if(isProfit) {
      const balance = user.balance - transaction.amount
      user.balance = balance.toFixed(2)
    } else {
      const balance = user.balance + transaction.amount
      user.balance = balance.toFixed(2)
    }
    await user.save()
    return await this.getAll(userId, reception, isProfit)
  }



  async getAll(userId, reception = null, isProfit) {
    if(isProfit === undefined && !reception) {
      throw ApiError.BadRequest('Отсутслвует обязателный параметр')
    }
    let data
    switch (reception) {
     case 'all':
        data = await TransactionModel.find({userId}).sort({dateTransaction: -1, createdAt: -1 })
        break
     case 'profit':
        data = await TransactionModel.find({userId, isProfit: true}).sort({dateTransaction: -1, createdAt: -1})  
        break
     case 'costs':
        data = await TransactionModel.find({userId, isProfit: false}).sort({dateTransaction: -1, createdAt: -1})
        break
      default:
        data = await TransactionModel.find({userId}).sort({dateTransaction: -1, createdAt: -1})
    }
    const user = await UserModel.findById(userId)
    return { total: user.balance, data}
  }
}

export default new TransactionService
