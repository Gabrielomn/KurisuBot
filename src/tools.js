const idChannelGeneral = "CHN2NCVU2"
const idChannelDuvidas = "CHT932M7T"
const channels =[idChannelGeneral, idChannelDuvidas]
knownLinks = require('./commands.js')

const categorias = {
    1:"Orientação a objeto",
    2:"Manipulação de coleções",
    3:"Testes",
    4:"Sintaxe Java",
    5:"Composição de Classes",
    6:"Grasp",
    7:"Heranças",
    8:"Interfaces",
    9:"Exceções",
    10:"Cronogramas",
    11:"Outros"
}

const materiais = require('./links')

var retornaLinkPossivelmenteUtil = function(categoria){
    return materiais[categoria]
}

var categorizer = function(value){
    return categorias[value]    
}

var iUnderstoodTheDoubt = (text) => {
    let expressaoEsperada = /(^[1-9]|10|11$)/
    return expressaoEsperada.test(text)
}

var listaCategoriasDuvidas = function(){
    let saida = ""
    for(var key in categorias){
        saida += key + "." + categorias[key] + "\n"
    }

    return saida
}

var getUserNameById = function (lista, id){
    let listaAux
    listaAux = lista.filter((user) =>{
        return user.id == id;
    })

    return listaAux[0].name
}

var chuckNorris = function (){
 
    axios.get('https://api.chucknorris.io/jokes/random').then(res =>{
        joke = res.data.value
        return joke;
    })
}

var isChannel = function(string){

    if (channels.includes(string)){
        return true;
    }else{
        return false;
    }
}

var knownKeyWords = function(text){
    if(knownLinks.hasOwnProperty(text)){
        return knownLinks[text]
    }else{
        return ""
    }
}

module.exports = {
    getUserNameById,
    listaCategoriasDuvidas,
    iUnderstoodTheDoubt,
    categorizer,
    chuckNorris,
    isChannel,
    knownKeyWords,
    retornaLinkPossivelmenteUtil
}