const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log('Database connected')
}).catch(error => {
  console.log('Erro: ' + error)
})

module.exports = mongoose