 import transactionService from '../service/transaction.service'
 import categoryService from '../service/category.service'
 
  class BankingController {

    async insert(req, res) {
      const reception = req.query.reception
      const data = await transactionService.addTransaction(req.user.id, req.body, reception)
      res.json(data)
    }

    async remove(req, res) {
      const id = req.params.id;
      const reception = req.query.reception
      const data = await transactionService.remove(id, req.user.id, reception)
      res.json(data)
    }


    async getTransactions(req, res) {
      const reception = req.query.reception
      const data = await transactionService.getAll(req.user.id, reception)
      res.json(data)
    }
    
    async getCategory(req, res) {
      const data = await categoryService.getCategory(req.query)
      res.json(data)
    }
  }

  export default new BankingController
