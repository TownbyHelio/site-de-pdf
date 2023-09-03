# Site de PDF
um site pra publicar pdf

o arquivo `backend/db/pdfs.db` tem uma única tabela chamada `pdfs`:
```
CREATE TABLE pdfs(nome VARCHAR(50) NOT NULL PRIMARY KEY, conteudo TEXT NOT NULL);
```