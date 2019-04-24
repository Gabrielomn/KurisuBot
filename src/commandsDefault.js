const knownLinks = {
    "!faq": "placeholder: faq",
    "!help": "No momento, existem tais comandos: '!intro', '!faq', '!cronogramaLP2', '!cronogramaP2'",
    "!intro": "placeholder: intro",
    "!cronogramaLP2": "https://docs.google.com/spreadsheets/d/100r3ioknxb6sXKrZA8xs386L4rJUuT0aPXTPnWtGSnA/edit#gid=1659951643",
    "!cronogramaP2": "https://docs.google.com/spreadsheets/d/1jRLgFlpL_xXmd0LqguKHxs3Pb4qVsHN8LQsavVumK-o/edit#gid=2077742481"
}

const commands = require('../models/Command')
//SÓ RODAR O FOR UMA VEZ PRA GUARDAR OS COMANDOS DEFAULT
// for(comando in knownLinks){
//     new commands ({
//         command: comando,
//         info: knownLinks[comando]
//     }).save().then(()=>{
//         console.log("saved")
//     })
// }
module.exports = knownLinks
