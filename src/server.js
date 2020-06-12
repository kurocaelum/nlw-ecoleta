const express = require('express')
const server = express()

/* Pegar o banco de dados */
const db = require('./database/db')

/* Configurar pasta publica */
server.use(express.static("public"))

/* Habilitar uso do req.body */
server.use(express.urlencoded({ extended: true }))

/* Utilizando template engine */
const nunjucks = require('nunjucks')
nunjucks.configure('src/views', {
    express: server,
    noCache: true
})

/* Configurar rotas da aplicacao */
// Home
server.get('/', (req, res) => {
    return res.render('index.html')
})

// Criar ponto de coleta
server.get('/create-point', (req, res) => {
    return res.render('create-point.html')
})

server.post('/savepoint', (req, res) => {
    // console.log(req.body)

    /* Inserir dados no banco */
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if (err) {
            console.log(err)

            return res.send("Erro no cadastro!")
        }

        console.log("Cadastrado com sucesso")
        console.log(req.body)

        return res.render("create-point.html", { saved: true })
    }

    db.run(query, values, afterInsertData)
})

/* Resultado da pesquisa */
server.get('/search', (req, res) => {
    const search = req.query.search

    if(search == "") {
        return res.render('search-results.html', { total: 0 })
    }
    
    // Pegar dados do banco
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
        if (err)
            return console.log(err)

        const total = rows.length

        return res.render('search-results.html', { places: rows, total }) // "total" equivalente a "total: total"
    })
})

/* Ligar servidor */
server.listen(3000)