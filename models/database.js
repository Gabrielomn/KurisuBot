const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost/keywords").then(() => {
  console.log('Working')
}).catch(error => {
  console.log('Erro: ' + error)
})

module.exports = mongoose