const express = require('express')
const server = express()

/** Configurar pasta publica */
server.use(express.static("public"))

/** Utilizando template engine */
const nunjucks = require('nunjucks')
nunjucks.configure('src/views', {
    express: server,
    noCache: true
})

/** Configurar rotas da aplicacao */
// Home
server.get('/', (req, res) => {
    return res.render('index.html')
})

// Criar ponto de coleta
server.get('/create-point', (req, res) => {
    return res.render('create-point.html')
})

// Resultado da pesquisa
server.get('/search', (req, res) => {
    return res.render('search-results.html')
})

/** Ligar servidor */
server.listen(3000)