const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost/database").then(() => {
  console.log('Database connected')
}).catch(error => {
  console.log('Erro: ' + error)
})

module.exports = mongoose