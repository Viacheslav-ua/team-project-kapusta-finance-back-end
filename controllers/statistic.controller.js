import statisticService from '../service/statistic.service'

class StatisticController {
  async summary(req, res) {
    const userId = req.user.id
    let countMonths = 6
    if (req.query.countMonths !== undefined) {
      countMonths = parseInt(req.query.countMonths)
    }
    const data = await statisticService.summary(userId, countMonths)
      res.json(data)
  }

  async groupCostsByCategory(req, res) {
    const { date } = req.params
    const userId = req.user.id
    const data = await statisticService.categoryGrouping(userId, date, false)
    res.json(data)
  }

  async groupProfitByCategory(req, res) {
    const { date } = req.params
    const userId = req.user.id
    const data = await statisticService.categoryGrouping(userId, date, true)
    res.json(data)
  }

  async groupItems(req, res) {
    const { date } = req.query
    const { categoryId } = req.params
    const userId = req.user.id
    const data = await statisticService.itemsGrouping(userId, categoryId, date)
    res.json(data)
  }
}

export default new StatisticController