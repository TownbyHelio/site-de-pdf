const nomeInput = document.getElementById("nome-inp")
const arquivoInput = document.getElementById("arquivo-inp")
const enviarBotao = document.getElementById("enviar-btn")
const erroP = document.getElementById("erro-p")

const fr = new FileReader()

let debounce = false
let nome


enviarBotao.onclick = () => {
    if (debounce) return

    nome = nomeInput.value

    if (nome.length == 0 || nome.length > 50) {
        erroP.textContent = "0 < numero de caracteres <= 50"
        nomeInput.value = ""
        return
    }

    if (!nome.match(/^[A-Za-z0-9 ]+$/g) || !nome.match(/^[A-Za-z0-9]/g) || !nome.match(/[A-Za-z0-9]$/g)) {
        erroP.textContent = "só letras do alfabeto, espaços e números são permitidos (o nome deve começar e terminar com uma letra ou um número)"
        nomeInput.value = ""
        return
    }

    if (arquivoInput.files.length != 1) {
        erroP.textContent = "selecione 1 arquivo"
        return
    }

    const arquivo = arquivoInput.files[0]

    erroP.textContent = "lendo..."
    fr.readAsDataURL(arquivo)
}


fr.onload = () => {
    erroP.textContent = "enviando arquivo"

    const req = {
        nome: nome,
        conteudo: fr.result
    }

    fetch("/api/enviarpdf/", {
        method:"POST",
        headers: {'Accept': 'application/json','Content-Type': 'application/json'},
        body: JSON.stringify(req)
    }).then(r => r.json()).then(r => {
        if (r.sucesso) {
            erroP.textContent = "ENVIADO!"
        }
        else {
            erroP.textContent = "servidor rejeitou"
        }
        arquivoInput.value = null
        nomeInput.value = ""
        debounce = false
    })
}


fr.onerror = () => {
    erroP.textContent = "erro ao tentar ler arquivo"
    arquivoInput.value = null
    debounce = false
}