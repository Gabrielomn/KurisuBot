var categorizer = function(value){
    if(value == 1){
        return "Orientação a objeto"
    }else if(value == 2){
        return "Manipulação de coleções"
    }else if(value == 3){
        return "Testes"
    }else if(value == 4){
        return "Cronogramas"
    }else if(value == 5){
        return "Outros"
    }
    
}

var iUnderstoodTheDoubt = (text) => {
    let expressaoEsperada = /(^[0-5]{1}$)/
    return expressaoEsperada.test(text)
}

var listaCategoriasDuvidas = function(){
    let saida = "1. Orientação a objeto\n2.Manipulação de coleções\n3.Testes\n4.Cronogramas\n5.Outros\n Digaí o tipo de dúvida ;)"
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

module.exports = {
    getUserNameById,
    listaCategoriasDuvidas,
    iUnderstoodTheDoubt,
    categorizer,
    chuckNorris
}