const express = require("express")
const server = express()

//pegar o banco de dados
const db = require("./database/db")

//Configurar pasta publica
server.use(express.static("public"))

// habilitar o uso do body na nossa aplicaçao
server.use(express.urlencoded({extended:true}))

//utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

//Configurar  caminhos da minha aplicação
//pagina inicial
server.get("/",(req,res)=>{
    //__dirname para  buscar o diretorio 
    //res.sendFile(__dirname+"/views/index.html")
    return res.render("index.html",{title: "Um titulo"})
})

server.get("/create-point",(req,res)=>{

    //res.sendFile(__dirname+"/views/create-point.html")
    // req.query: Query Srings da nossa url
    //console.log(req.query);
    return res.render("create-point.html",)
})

server.post("/savepoint",(req,res)=>{
    //req.body : O corpo do nosso formulário
    //console.log(req.body)
    // inserir dados no banco de dados
    const query  = `
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
    function afterInsertData(err){
        if (err) {
            return res.send("Erro no cadastro")
        }
        console.log("Cadastrado com sucesso")
        console.log (this)

        return res.render("create-point.html", {saved :true})
    }
    db.run(query,values,afterInsertData) 
})

server.get("/search",(req,res)=>{

    const search = req.query.search
    
    if(search == "") {
        //pesquisa vazia
        return res.render("search-results.html",{total:0}) 
    }

    // pegar os dados  do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`,function(err,rows){
        if (err) {
            return console.log(err)
        }
        const total = rows.length
        // mostrar a pagina html com os dados do banco de dados
        return res.render("search-results.html",{places:rows,total}) 
    })
})

// ligar o servidor
server.listen(3000)