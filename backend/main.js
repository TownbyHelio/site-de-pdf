const express = require("express")
const bodyParser = require("body-parser")
const sqlite3 = require("sqlite3").verbose()
const path = require("path")

const port = 6969
const app = express()
app.use(express.static(path.join(__dirname,"../frontend/")))



console.log("Abrindo DB...")

const pdfsDb =  new sqlite3.Database('./db/pdfs.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err)
        return
    }

    console.log("DB aberto")
})


function checarNomePdf(str) {
    return str.match(/^[A-Za-z0-9 ]+$/g) && str.match(/^[A-Za-z0-9]/g) && str.match(/[A-Za-z0-9]$/g)
}


app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../frontend/index.html"))
})

app.post("/api/enviarpdf/", bodyParser.json({limit: "500mb"}), (req, res) => {
    const nome = req.body.nome
    const conteudo = req.body.conteudo

    if (!nome || !conteudo) {
        res.send({sucesso: false})
        return
    }

    if (!checarNomePdf(nome)) {
        res.send({sucesso: false})
        //console.log("fudeu")
        return
    }

    pdfsDb.get("SELECT nome FROM pdfs WHERE nome = ?", [nome], (err, row) => {
        if (err) {
            res.send({sucesso: false})
            return
        }

        if (row) {
            res.send({sucesso: false})
            return
        }

        pdfsDb.prepare("INSERT INTO pdfs VALUES (?,?)").run([nome, conteudo], (err) => {
            if (err) {
                res.send({sucesso: false})
                return
            }
    
            res.send({sucesso: true})
        })
    })
})


app.post("/api/pdf/", bodyParser.json(), (req, res) => {
    const nome = req.body.nome

    if (!nome) {
        res.send({sucesso: false})
        return
    }

    if (!checarNomePdf(nome)) {
        res.send({sucesso: false})
        return
    }

    pdfsDb.get("SELECT conteudo FROM pdfs WHERE nome = ?", [nome], (err, row) => {
        if (err) {
            res.send({sucesso: false})
            return
        }

        if (!row) {
            res.send({sucesso: false})
            return
        }

        res.send({sucesso: true, conteudo: row.conteudo})
    })
})


app.post("/api/buscarpdfs/", bodyParser.json(), (req, res) => {
    const busca = req.body.busca

    if (!busca) {
        res.send({sucesso: false})
        return
    }

    if (!checarNomePdf(busca)) {
        res.send({sucesso: false})
        return
    }

    pdfsDb.all("SELECT nome FROM pdfs WHERE LOWER(nome) LIKE LOWER(?)", [`%${busca}%`], (err, rows) => {
        if (err) {
            res.send({sucesso: false})
            return
        }

        const r = {sucesso: true, pdfs: []}
        if (!rows) {
            res.send(r)
            return
        }

        rows.forEach(row => {
            r.pdfs.push(row.nome)
        })
        res.send(r)
    })
})


app.get("/pdf/:nome", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/visualizar/index.html"))
})

console.log("Abrindo porta")
app.listen(port, () => {
    console.log("Pronto! Porta " + port)
})