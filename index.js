import db from './db/db'
import app from './app'

const PORT = process.env.PORT || 3001

db.then(() => {
  app.listen(PORT, async () => {
    console.log(`Server running. Use our API on port: ${PORT}`)
  })
}).catch((err) => {
  console.log(`Server not running. Error: ${err.message}`)
})