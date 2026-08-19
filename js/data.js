/* Dados iniciais.
   O site funciona sem banco de dados: os dados editados pelo administrador
   ficam no localStorage do navegador. Para produção, troque o DataStore por
   uma API/banco sem precisar reescrever a interface. */

window.CATALOG_VERSION = "local";

window.DEFAULT_LIBRARY = [
  {
    id: "hq-001",
    title: "Casulo: Metamorfose",
    issue: "Edição 01",
    type: "comic",
    author: "Autor",
    year: 2026,
    description: "A primeira aventura do herói.",
    coverUrl: "",
    fileUrl: "Arquivos/Casulo-Metamorfose.pdf",
    format: "pdf",
    clicks: 1842,
    featured: true,
    randomWeight: 8,
    tags: ["super-herói", "ação", "origem"],
    collectionIds: ["colecao-001"]
  },
  {
    id: "hq-002",
    title: "Surdina",
    issue: "Edição 02",
    type: "comic",
    author: "Autor",
    year: 2026,
    description: "Uma história urbana cheia de mistério.",
    coverUrl: "",
    fileUrl: "Arquivos/Btmn-3(2025).cbr",
    format: "cbr",
    clicks: 1270,
    featured: true,
    randomWeight: 6,
    tags: ["urbano", "mistério", "ação"],
    collectionIds: ["colecao-001"]
  },
  {
    id: "manga-001",
    title: "Tomoki-kun wa Onnanoko",
    issue: "Volume Único",
    type: "manga",
    author: "Cyoro",
    year: 2015,
    description: "Tomoki é um garoto que parece uma garota. Ele só quer viver uma vida normal no ensino médio, mas sua aparência fofa sempre causa problemas e mal-entendidos.",
    coverUrl: "",
    fileUrl: "tomoki1207.pdf",
    telegramUrl: "",
    format: "pdf",
    clicks: 0,
    featured: true,
    randomWeight: 5,
    tags: ["mangá", "comédia", "slice of life", "romance", "gender bender"],
    collectionIds: []
  },
  {
    id: "hq-003",
    title: "Sapos",
    issue: "Edição 03",
    type: "comic",
    author: "Autor",
    year: 2026,
    description: "Uma aventura inesperada.",
    coverUrl: "",
    fileUrl: "Arquivos/Capitão-América-Vol.14-04-(2025).cbz",
    format: "cbz",
    clicks: 721,
    featured: false,
    randomWeight: 4,
    tags: ["aventura", "comédia"],
    collectionIds: ["colecao-001"]
  },
];

window.DEFAULT_COLLECTIONS = [
  {
    id: "colecao-001",
    title: "Universo Casulo",
    description: "Uma coletânea para ler várias aventuras em sequência.",
    cover: "https://placehold.co/1200x500/19191e/ffffff?text=UNIVERSO+CASULO",
    issueIds: ["hq-001", "hq-002", "hq-003"]
  }
];
