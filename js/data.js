/* Dados iniciais.
   O site funciona sem banco de dados: os dados editados pelo administrador
   ficam no localStorage do navegador. Para produção, troque o DataStore por
   uma API/banco sem precisar reescrever a interface. */

window.CATALOG_VERSION = "local";

// Metadados compartilhados: as edições guardam apenas o que muda entre os arquivos.
window.DEFAULT_SERIES = [
  {
    id: "series-absolute-batman",
    name: "Absolute Batman",
    seriesTitle: "Absolute Batman",
    type: "comic",
    publisher: "DC Comics",
    imprint: "2021-",
    publication: "Série Mensal",
    status: "Em Andamento",
    editions: "—",
    year: 2024,
    description: "O lendário autor do Batman Scott Snyder e o icônico artista Nick Dragotta transformam o conto do Cavaleiro das Trevas para os tempos atuais. Sem a mansão, sem o dinheiro e sem o mordomo, o que sobra é o Cavaleiro das Trevas Absoluto!",
    coverUrl: "",
    telegramUrl: "",
    author: "Scott Snyder / Nick Dragotta",
    character: "Batman",
    tags: ["Batman", "super-herói", "ação"]
  }
];

window.DEFAULT_SERIES.push({
  id: "series-absolute-superman",
  name: "Absolute Superman",
  seriesTitle: "Absolute Superman",
  type: "comic",
  publisher: "DC Comics",
  imprint: "2021-",
  publication: "Série Mensal",
  status: "Em Andamento",
  editions: "—",
  year: 2024,
  description: "As superestrelas Jason Aaron e Rafa Sandoval apresentam uma nova e surpreendente visão do Último Filho de Krypton. Sem a fortaleza, sem a família e sem um lar, o que resta é o Absoluto Homem de Aço!",
  coverUrl: "",
  telegramUrl: "",
  author: "Jason Aaron / Rafa Sandoval",
  character: "Superman",
  tags: ["Superman", "super-herói", "ação"]
});

window.DEFAULT_SERIES.push({
  id: "series-teen-titans-academy",
  name: "Academia Jovens Titãs",
  seriesTitle: "Academia Jovens Titãs",
  type: "comic",
  publisher: "DC Comics",
  imprint: "2021-",
  publication: "Série Mensal",
  status: "Cancelada/Terminada",
  editions: "14",
  year: 2021,
  description: "A nova geração de heróis precisa do treinamento certo para atingir seu máximo potencial e serem os melhores no que fazem. E quem melhor do que aqueles que um dia foram os maiores jovens heróis para ensinar?",
  coverUrl: "",
  telegramUrl: "",
  author: "Tim Sheridan / Rafa Sandoval",
  character: "Jovens Titãs",
  tags: ["Jovens Titãs", "super-herói", "ação"]
});

window.DEFAULT_SERIES.push({
  id: "series-black-adam-justice-society-files",
  name: "Adão Negro – Os Arquivos da Sociedade da Justiça",
  seriesTitle: "Adão Negro – Os Arquivos da Sociedade da Justiça",
  originalTitle: "Black Adam – The Justice Society Files",
  type: "comic",
  publisher: "DC Comics",
  imprint: "2021-",
  publication: "Minissérie",
  status: "Finalizada",
  editions: "04",
  year: 2022,
  description: "Uma série de one-shots mostrando os membros da Sociedade da Justiça, seu histórico e suas conexões com o Adão Negro. Cada edição apresenta uma história principal de Cavan Scott e uma história secundária de Bryan Q. Miller, acompanhando a trajetória de Teth-Adam, de escravo a prisioneiro e anti-herói.",
  coverUrl: "",
  telegramUrl: "",
  author: "Cavan Scott / Bryan Q. Miller",
  character: "Adão Negro",
  tags: ["Adão Negro", "Sociedade da Justiça", "super-herói", "ação"]
});

window.DEFAULT_SERIES.push({
  id: "series-flashpoint-beyond",
  name: "Além do Flashpoint",
  seriesTitle: "Além do Flashpoint",
  originalTitle: "Flashpoint Beyond",
  type: "comic",
  publisher: "DC Comics",
  imprint: "2021-",
  publication: "Minissérie",
  status: "Encerrada",
  editions: "07",
  year: 2022,
  description: "Continuação direta de Flashpoint e de Relógio do Apocalipse. O mundo de Flashpoint retorna quando Thomas Wayne desperta em uma realidade que acreditava ter desaparecido e passa a investigar o assassino Relógio.",
  coverUrl: "",
  telegramUrl: "",
  author: "Geoff Johns / Jeremy Adams / Tim Sheridan",
  character: "Flash",
  tags: ["Flash", "Flashpoint", "Batman", "multiverso", "super-herói"]
});

window.DEFAULT_LIBRARY = [
  {
    id: "hq-001",
    title: "Casulo: Metamorfose",
    issue: "Edição 01",
    type: "comic",
    author: "Autor",
    publisher: "Casulo",
    imprint: "Casulo Comics",
    year: 2026,
    description: "A primeira aventura do herói.",
    coverUrl: "",
    fileUrl: "Arquivos/Casulo-Metamorfose.pdf",
    format: "pdf",
    clicks: 0,
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
    publisher: "Casulo",
    imprint: "Casulo Comics",
    year: 2026,
    description: "Uma história urbana cheia de mistério.",
    coverUrl: "",
    fileUrl: "Arquivos/Btmn-3(2025).cbr",
    format: "cbr",
    clicks: 0,
    featured: true,
    randomWeight: 6,
    tags: ["urbano", "mistério", "ação"],
    collectionIds: ["colecao-001"]
  },
  {
    id: "absolute-batman-001",
    seriesId: "series-absolute-batman",
    title: "Absolute Batman",
    issue: "1",
    format: "cbz",
    fileUrl: "https://www.mediafire.com/file/ocj24y45s6qs4xk/Absolute_Batman_001_%25282024%2529_001.cbz",
    telegramUrl: "",
    clicks: 0,
    featured: true,
    randomWeight: 5,
    collectionIds: []
  },
  {
    id: "absolute-batman-002",
    seriesId: "series-absolute-batman",
    title: "Absolute Batman",
    issue: "2",
    format: "cbr",
    fileUrl: "https://www.mediafire.com/file/hpw5ut4sn7d53lg/AbsltBtm_%2523002_%25282024%2529%2528ZonaFantasma%2529.cbr",
    telegramUrl: "",
    clicks: 0,
    featured: true,
    randomWeight: 5,
    collectionIds: []
  },
  {
    id: "absolute-batman-003",
    seriesId: "series-absolute-batman",
    title: "Absolute Batman",
    issue: "3",
    format: "cbr",
    fileUrl: "https://www.mediafire.com/file/8d5cjkk1hsjataw/AbsltBtm_%2523003_%25282024%2529%2528ZonaFantasma%2529.cbr",
    telegramUrl: "",
    clicks: 0,
    featured: true,
    randomWeight: 5,
    collectionIds: []
  },
  {
    id: "absolute-batman-004",
    seriesId: "series-absolute-batman",
    title: "Absolute Batman",
    issue: "4",
    format: "cbr",
    fileUrl: "https://www.mediafire.com/file/l5u94uv65gw4mi2/AbsltBtm_%2523004_%25282025%2529%2528ZonaFantasma%2529.cbr",
    clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-005", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "5", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/wrow4rks3pbyt8d/AbsltBtm_%2523005_%25282025%2529%2528ZonaFantasma%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-006", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "6", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/mslvxqk0uhlanwu/AbsltBtm_%2523006_%25282025%2529%2528ZonaFantasma%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-007", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "7", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/665gr12kwkv6lv3/AbsltBtm_%2523007_%25282025%2529%2528ZonaFantasma%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-008", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "8", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/o5sos1esi0b0j92/AbsltBtm_%2523008_%25282025%2529%2528ZonaFantasma%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-009", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "9", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/sor4t18vf7k9nyg/AbsltBtm_%2523009_%25282025%2529%2528ZonaFantasma%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-010", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "10", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/8jkiiq84tqc84kd/AbsltBtm_%2523010_%25282025%2529%2528ZonaFantasma%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-011", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "11", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/wf2sj6n54d2y744/AbsltBtm_%2523011_%25282025%2529%2528ZonaFantasma%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-012", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "12", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/0yvc06ibv1kb6vm/AbsltBtm_%2523012_%25282025%2529%2528ZonaFantasma%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-013", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "13", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/iseribyfft1h0ny/AbsltBtm_%2523013_%25282025%2529%2528ZonaFantasma%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-014", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "14", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/tn0pjuegziw03ji/AbsltBtm_%2523014_%25282025%2529%2528ZonaFantasma%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-015", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "15", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/hz3s9z6gpaozx66/AbsltBtm_%2523015_%25282025%2529%2528ZonaFantasma%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-016", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "16", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/id30tntganuvfpw/AbsltBtm_%2523016_%25282026%2529%2528ZonaFantasma%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-017", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "17", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/zr6wkhshuavuzvp/AbsltBtm_%2523017_%25282026%2529%2528ZonaFantasma%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-018", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "18", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/0cu0hzv3ht7u8jx/AbsltBtm_%2523018_%25282026%2529%2528ZonaFantasma%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-019", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "19", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/w119s2p1xdjpj6i/AbsltBtm_%2523019_%25282026%2529%2528ZonaFantasma%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-020", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "20", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/hicqrj0maljm1oa/AbsltBtm_%2523020_%25282026%2529%2528ZonaFantasma%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-021", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "21", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/93hf70z5sqdt0e1/AbsltBtm_%2523021_%25282026%2529%2528ZonaFantasma%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  { id: "absolute-superman-001", seriesId: "series-absolute-superman", title: "Absolute Superman", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/b9euelbt1dnjvgd/Absolute_Superman_%252301_%255B2024%255D%255BSoQuadrinhos%255D.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "absolute-superman-002", seriesId: "series-absolute-superman", title: "Absolute Superman", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/sis6teg36j29mzu/Absolute_Superman_%252302_%255B2025%255D%255BSoQuadrinhos%255D.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "absolute-superman-003", seriesId: "series-absolute-superman", title: "Absolute Superman", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/37isjn2zqxtqaeh/Absolute_Superman_%252303_%255B2025%255D%255BSoQuadrinhos%255D.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "absolute-superman-004", seriesId: "series-absolute-superman", title: "Absolute Superman", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/3vj4b0xm4mpurje/Absolute_Superman_%252304_%255B2025%255D%255BSoQuadrinhos%255D.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "absolute-superman-005", seriesId: "series-absolute-superman", title: "Absolute Superman", issue: "5", format: "cbr", fileUrl: "https://www.mediafire.com/file/erlw0qu2s7kaap4/Absolute_Superman_%252305_%255B2025%255D%255BSoQuadrinhos%255D.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "absolute-superman-006", seriesId: "series-absolute-superman", title: "Absolute Superman", issue: "6", format: "cbr", fileUrl: "https://www.mediafire.com/file/2tloe9srs0w40dr/Absolute_Superman_%252306_%255B2025%255D%255BSoQuadrinhos%255D.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "absolute-superman-007", seriesId: "series-absolute-superman", title: "Absolute Superman", issue: "7", format: "cbr", fileUrl: "https://www.mediafire.com/file/cr75c8k4wclslvm/Absolute_Superman_%252307_%255B2025%255D%255BSoQuadrinhos%255D.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "teen-titans-academy-001", seriesId: "series-teen-titans-academy", title: "Academia Jovens Titãs", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/0t48n1hmhmejcml/AcdmJvnsTts_%2523001_%25282021%2529%2528ZonaFantasma%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "teen-titans-academy-002", seriesId: "series-teen-titans-academy", title: "Academia Jovens Titãs", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/mptyoa8kqnmr2rm/AcdmJvnsTts_%2523002_%25282021%2529%2528ZonaFantasma%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "teen-titans-academy-003", seriesId: "series-teen-titans-academy", title: "Academia Jovens Titãs", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/fch6cnx6vn2jgu3/AcdmJvnsTts_%2523003_%25282021%2529%2528ZonaFantasma%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "teen-titans-academy-004", seriesId: "series-teen-titans-academy", title: "Academia Jovens Titãs", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/8vledpnqrpw2jdl/AcdmJvnsTts_%2523004_%25282021%2529%2528ZonaFantasma%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "teen-titans-academy-anuario", seriesId: "series-teen-titans-academy", title: "Academia Jovens Titãs", issue: "Anuário", sortOrder: 4.5, format: "cbr", fileUrl: "https://www.mediafire.com/file/q3iwxn60xh3h5fv/AcdmJvnsTts_-_Anuario_2021_%25282021%2529%2528ZonaFantasma%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "teen-titans-academy-005", seriesId: "series-teen-titans-academy", title: "Academia Jovens Titãs", issue: "5", format: "cbr", fileUrl: "https://www.mediafire.com/file/pvzdma2e9ktfqsm/AcdmJvnsTtns_%25235_%2528ZonaFantasma%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "teen-titans-academy-006", seriesId: "series-teen-titans-academy", title: "Academia Jovens Titãs", issue: "6", format: "cbr", fileUrl: "https://www.mediafire.com/file/70eta6tom7ys1zh/AcdmJvnsTts_%2523006_%25282021%2529%2528ZonaFantasma%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "black-adam-justice-society-files-001", seriesId: "series-black-adam-justice-society-files", title: "Adão Negro – Os Arquivos da Sociedade da Justiça", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/9ckq7nzt9gg46jh/Ad%25C3%25A3o_Negro_-_Os_Arquivos_da_Sociedade_da_Justi%25C3%25A7a_%252301_%25282022%2529_%2528SQ%2526ZF%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "black-adam-justice-society-files-002", seriesId: "series-black-adam-justice-society-files", title: "Adão Negro – Os Arquivos da Sociedade da Justiça", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/0wqrc3l93t3gzc6/Ad%25C3%25A3o_Negro_-_Os_Arquivos_da_Sociedade_da_Justi%25C3%25A7a_%252302_%25282022%2529_%2528SQ%2526ZF%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "black-adam-justice-society-files-003", seriesId: "series-black-adam-justice-society-files", title: "Adão Negro – Os Arquivos da Sociedade da Justiça", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/op38uwcnoqlnrx1/Ad%25C3%25A3o_Negro_-_Os_Arquivos_da_Sociedade_da_Justi%25C3%25A7a_%252303_%25282022%2529_%2528SQ%2526ZF%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "black-adam-justice-society-files-004", seriesId: "series-black-adam-justice-society-files", title: "Adão Negro – Os Arquivos da Sociedade da Justiça", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/w1ppvjz6v9d40ak/Ad%25C3%25A3o_Negro_-_Os_Arquivos_da_Sociedade_da_Justi%25C3%25A7a_%252304_%25282022%2529_%2528SQ%2526ZF%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "flashpoint-beyond-000", seriesId: "series-flashpoint-beyond", title: "Além do Flashpoint", issue: "0", format: "cbr", fileUrl: "https://www.mediafire.com/file/yt6qcuw3yl9r3rv/AlmFlashpoint_%25230_%25282022%2529%2528ZF-SQ%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "flashpoint-beyond-001", seriesId: "series-flashpoint-beyond", title: "Além do Flashpoint", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/pt6ovp6bsn3sw4f/AlmFlashpoint_%25231_de_6_%25282022%2529%2528ZF-SQ%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "flashpoint-beyond-002", seriesId: "series-flashpoint-beyond", title: "Além do Flashpoint", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/l93k853uhifdj2v/AlmFlashpoint_%25232_de_6_%25282022%2529%2528ZF-SQ%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "flashpoint-beyond-003", seriesId: "series-flashpoint-beyond", title: "Além do Flashpoint", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/vo9j4wj5juo489j/AlmFlashpoint_%25233_de_6_%25282022%2529%2528ZF-SQ%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "flashpoint-beyond-004", seriesId: "series-flashpoint-beyond", title: "Além do Flashpoint", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/zb4tvs8r6mkymwr/AlmFlashpoint_%25234_de_6_%25282022%2529%2528ZF-SQ%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "flashpoint-beyond-005", seriesId: "series-flashpoint-beyond", title: "Além do Flashpoint", issue: "5", format: "cbr", fileUrl: "https://www.mediafire.com/file/zg9fldgq2tm709l/AlmFlashpoint_%25235_de_6_%25282022%2529%2528ZF-SQ%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "flashpoint-beyond-006", seriesId: "series-flashpoint-beyond", title: "Além do Flashpoint", issue: "6", format: "cbr", fileUrl: "https://www.mediafire.com/file/8loa70vwvx4ize1/AlmFlashpoint_%25236_de_6_%25282022%2529%2528ZF-SQ%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  {
    id: "manga-001",
    title: "Tomoki-kun wa Onnanoko",
    issue: "Volume Único",
    type: "manga",
    author: "Cyoro",
    publisher: "Shueisha",
    imprint: "Jump Comics",
    year: 2015,
    description: "Tomoki é um garoto que parece uma garota. Ele só quer viver uma vida normal no ensino médio, mas sua aparência fofa sempre causa problemas e mal-entendidos.",
    coverUrl: "",
    fileUrl: "Arquivos/Tomoki-kun-wa-Onnanoko.cbz",
    telegramUrl: "",
    format: "cbz",
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
    publisher: "Casulo",
    imprint: "Casulo Comics",
    year: 2026,
    description: "Uma aventura inesperada.",
    coverUrl: "",
    fileUrl: "Arquivos/Capitão-América-Vol.14-04-(2025).cbz",
    format: "cbz",
    clicks: 0,
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
