/* Dados iniciais.
   O site funciona sem banco de dados: os dados editados pelo administrador
   ficam no localStorage do navegador. Para produção, troque o DataStore por
   uma API/banco sem precisar reescrever a interface. */

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
  // Catálogo externo: as páginas-fonte ficam registradas até que o URL direto
  // de cada edição seja fornecido pela fonte autorizada.
  {
  id: "series-absolute-batman",
  title: "Absolute Batman",
  type: "comic",

  author: "Scott Snyder; Nick Dragotta",
  publisher: "DC Comics",
  description: "Sem a mansão, sem o dinheiro e sem o mordomo: uma nova visão do Cavaleiro das Trevas.",

  tags: [
    "batman",
    "dc comics",
    "super-herói"
  ],

  featured: false,
  randomWeight: 5,

  editions: [
    {
      id: "absolute-batman-001",
      issue: "01",
      year: 2024,
      format: "CBR",
      fileUrl: "https://download2273.mediafire.com/123jlz5gngugBQYLW1ENFQwPu5wr-lTOmDnUGYQk1KbfMqXkDccFFVBAT4hmqTUuaorxCxGHZKKF4rW1_EDOWRwO7vIY1m8aMDECEd9SdgqAAVASWDcTvK9Vxbanlc9Ie88By5hjJESv_IX2fRxTyCGUS6XZNpQxwlzdVEeBOld2gZPs/ocj24y45s6qs4xk/Absolute+Batman+001+%282024%29+001.cbr",
      coverUrl: ""
    },

    {
      id: "absolute-batman-002",
      issue: "02",
      year: 2024,
      format: "CBR",
      fileUrl: "https://download2261.mediafire.com/ve0al4loohpgGxLwBqN4ex6GG74p8P0fFEI_lkiXxmH_a_6oXe1EeM18M7RyeJ2H3BXpop4GhAGxqPLmd8akkOvk9N92CBwSE7kp24N6R2c3eRRYBiJME5DnDxbrq7kFOPBrBUGohVX_aBZPgpuHluWLkut0-MArCIp9-KP3L74Y2Fmy/hpw5ut4sn7d53lg/AbsltBtm+%23002+%282024%29%28ZonaFantasma%29.cbr.cbr",
      coverUrl: ""
    },

    {
      id: "absolute-batman-003",
      issue: "03",
      year: 2025,
      format: "CBR",
      fileUrl: "https://download2272.mediafire.com/a2qheb5ypezg3YE3cwGGnLvuBzqEy-e_puOUG_qiDwZ_gKzXTeGWXFIeVyFINb2e-IfewVMSl_Y61Rst1fVQc9gTIrBdiib8X_YzKHPfo1Zvry1yUWxklk4gachUrRD9j36ft5wTq2V4SljwiUs10m-Brf1c0v7IlKVLpNzVL8gGspqL/8d5cjkk1hsjataw/AbsltBtm+%23003+%282024%29%28ZonaFantasma%29.cbr.cbr",
      coverUrl: ""
    }
  ]
}
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
