# Banca Digital — site de quadrinhos e mangás

Este projeto é uma banca digital leve: o catálogo, capas e metadados ficam no site, mas os arquivos de leitura podem continuar hospedados fora dele.

## O que já existe

- Página inicial com:
  - uma edição em destaque;
  - "Mais lidos", baseado nos cliques;
  - seleção aleatória;
  - trilhos separados de Quadrinhos e Mangás;
  - Coleções/coletâneas.
- Pesquisa por título, edição, autor, descrição e tags.
- Leitor:
  - PDF;
  - CBZ;
  - imagens JPG/JPEG/PNG/WebP/GIF;
  - fallback para outros formatos.
- Administração:
  - cadastrar/editar/excluir edições;
  - capa;
  - link da fonte do arquivo (URL direta);
  - formato;
  - tipo Quadrinho/Mangá;
  - peso da seleção aleatória;
  - destaque;
  - exportação/importação do catálogo em JSON.
- Formulário para leitores enviarem quadrinhos.
- O projeto não exige upload dos arquivos de quadrinhos para o servidor, funcionando com URLs diretas.

## CORS

PDF.js e JSZip fazem requisições do navegador. O servidor que entrega o PDF/CBZ precisa permitir CORS para o domínio da banca.

Se o servidor não permitir CORS:
- PDF: o navegador ainda pode abrir o arquivo em outra aba;
- CBZ: o leitor JS não consegue baixar o ZIP para extrair as páginas.

## Rodar

Por ser JavaScript no navegador, é melhor abrir com um servidor local em vez de `file://`.

Exemplo com Python:

python -m http.server 8000

Depois abra:

http://localhost:8000

## Antes de publicar

Este protótipo usa `localStorage`, portanto a administração é local ao navegador. Isso é ótimo para prototipagem, mas não é suficiente para uma banca pública com vários administradores.

Para a versão online, substitua o DataStore por uma API com banco de dados. Uma estrutura simples seria:

- `works`: obras/edições
- `collections`: coletâneas
- `submissions`: envios dos leitores
