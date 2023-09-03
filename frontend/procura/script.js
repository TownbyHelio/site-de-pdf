const procuraInp = document.getElementById("procura-inp")
const procurarBotao = document.getElementById("procurar-btn")
const erroP = document.getElementById("erro-p")
const lista = document.getElementById("lista")

let debounce = false

procurarBotao.onclick = () => {
    if (debounce) return

    erroP.textContent = "procurando..."
    debounce = true
    fetch("/api/buscarpdfs/", {
        method: "POST",
        headers: {'Accept': 'application/json','Content-Type': 'application/json'},
        body: JSON.stringify({busca: procuraInp.value})
    }).then(r => r.json()).then(r => {
        debounce = false

        let delChild = lista.lastChild
        while (delChild) {
            lista.removeChild(delChild)
            delChild = lista.lastChild
        }

        if (!r.sucesso) {
            erroP.textContent = "ocorreu um erro no servidor"
        }
        else {
            erroP.textContent = "sucesso"
            const pdfs = r.pdfs
            for (let i = 0; i < pdfs.length; i++) {
                const li = document.createElement("li")
                const a = document.createElement("a")
                a.href = "/pdf/"+pdfs[i]
                a.textContent = pdfs[i]
                a.target = "_blank"
                li.appendChild(a)
                lista.appendChild(li)
            }
        }
    })
}