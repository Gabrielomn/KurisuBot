# KurisuBot

## Guia básico de uso:

* Para instalar os modulos basta usar o comando npm install na pasta onde se encontra o index.js do projeto.

### Iniciar o bot:

* Para rodar o bot usar npm run dev, isso vai usar o nodemon que ajuda no desenvolvimento, basicamente vai
reiniciar aplicação toda vez que salvar algo no projeto.

* npm start também funciona para iniciar o bot, mas não vai ter as funcionabilidades do nodemon.

### Importar/Exportar collections do MongoDB

* Para importar as collections que estão sendo usadas basta usar o comando: mongorestore -d database <caminhoDoSeuRepo/MongoDB/database>

* Para exportar as collections que você está usando basta usar o comando: mongodump -d database -o <caminhoDoSeuRepo/MongoDB>
