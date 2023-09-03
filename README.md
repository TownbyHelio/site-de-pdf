# Site de PDF
um site pra publicar pdf

o banco de dados foi feito com sqlite, baixa o site ai e testa sla, só dar um `node .` na pasta backend e ai abrir o localhost com a porta no navegador\
o arquivo `backend/db/pdfs.db` tem uma única tabela chamada `pdfs`:
```
CREATE TABLE pdfs(nome VARCHAR(50) NOT NULL PRIMARY KEY, conteudo TEXT NOT NULL);
```