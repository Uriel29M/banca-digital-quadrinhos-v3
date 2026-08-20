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

window.DEFAULT_SERIES.push({
  id: "series-aquaman-the-becoming",
  name: "Aquaman: O Emergir",
  seriesTitle: "Aquaman: O Emergir",
  originalTitle: "Aquaman: The Becoming",
  type: "comic",
  publisher: "DC Comics",
  imprint: "2021-",
  publication: "Minissérie",
  status: "Cancelada/Terminada",
  editions: "06",
  year: 2021,
  description: "Jackson Hyde finalmente tem tudo o que sempre quis, até que o centro de treinamento e metade do palácio atlante explodem com ele lá dentro. Acusado de destruir a vida que trabalhou tanto para construir, Aqualad precisará provar sua inocência e subir de nível para se tornar Aquaman.",
  coverUrl: "",
  telegramUrl: "",
  author: "Brandon Thomas",
  character: "Aquaman",
  tags: ["Aquaman", "Aqualad", "Jackson Hyde", "Atlântida", "super-herói"]
});

window.DEFAULT_SERIES.push({
  id: "series-harley-quinn-2021",
  name: "Arlequina",
  seriesTitle: "Arlequina",
  originalTitle: "Harley Quinn",
  type: "comic",
  publisher: "DC Comics",
  imprint: "2021-",
  publication: "Mensal",
  status: "Em Andamento",
  editions: "—",
  year: 2021,
  description: "Arlequina está de volta a Gotham City para compensar os pecados do passado e ajudar a cidade a se recuperar da Guerra do Coringa. Mas não há nenhum comitê de boas-vindas esperando por ela, e novos inimigos trabalham para manter a cidade destruída. Stephanie Phillips e Riley Rossmo conduzem Arlequina em uma nova era, com um visual renovado e muitas confusões.",
  coverUrl: "",
  telegramUrl: "",
  author: "Stephanie Phillips / Riley Rossmo",
  character: "Arlequina",
  tags: ["Arlequina", "Harley Quinn", "Gotham", "Guerra do Coringa", "super-herói"]
});

window.DEFAULT_SERIES.push({
  id: "series-green-arrow-2023",
  name: "Arqueiro Verde",
  seriesTitle: "Arqueiro Verde",
  originalTitle: "Green Arrow",
  type: "comic",
  publisher: "DC Comics",
  imprint: "2023-",
  publication: "Série Mensal",
  status: "Minissérie",
  editions: "12",
  year: 2023,
  description: "O Arqueiro Esmeralda está perdido e precisará de toda a família de Oliver Queen para achá-lo. Mas forças perigosas estão determinadas a mantê-los separados a qualquer custo. Saindo diretamente de Crise Sombria nas Infinitas Terras, esta aventura de Joshua Williamson atravessa todo o UDC e prepara histórias maiores para 2023.",
  coverUrl: "",
  telegramUrl: "",
  author: "Joshua Williamson",
  character: "Arqueiro Verde",
  tags: ["Arqueiro Verde", "Green Arrow", "Oliver Queen", "DC Comics", "super-herói"]
});

window.DEFAULT_SERIES.push({
  id: "series-black-manta-2021",
  name: "Arraia Negra",
  seriesTitle: "Arraia Negra",
  originalTitle: "Black Manta",
  type: "comic",
  publisher: "DC Comics",
  imprint: "2021-",
  publication: "Minissérie",
  status: "Cancelada/Terminada",
  editions: "06",
  year: 2021,
  description: "Depois de sua aparição no especial de 80 anos do Aquaman, Arraia Negra ganha sua própria série. Em busca de um raro metal com poderes incríveis, ele enfrenta aliados e inimigos, incluindo Torrid, uma antiga parceira que escapou do inferno, e Devil Ray, um novo rival das profundezas.",
  coverUrl: "",
  telegramUrl: "",
  author: "Chuck Brown / Valentine De Landro",
  character: "Arraia Negra",
  tags: ["Arraia Negra", "Black Manta", "Aquaman", "Torrid", "Devil Ray", "super-herói"]
});

window.DEFAULT_SERIES.push({
  id: "series-adventures-superman-jon-kent",
  name: "As Aventuras do Superman – Jon Kent",
  seriesTitle: "As Aventuras do Superman – Jon Kent",
  originalTitle: "Adventures of Superman – Jon Kent",
  type: "comic",
  publisher: "DC Comics",
  imprint: "2023-",
  publication: "Minissérie",
  status: "Em Andamento",
  editions: "06",
  year: 2023,
  description: "Jon fica surpreso com a chegada de Val-Zod da Terra-2, que avisa que Ultraman está viajando de uma Terra para outra e matando o Kal-El de cada mundo. Agora, Jon e Val-Zod precisarão se unir para impedir Ultraman antes que ele mate o pai de Jon.",
  coverUrl: "",
  telegramUrl: "",
  author: "Tom Taylor / Clayton Henry",
  character: "Jon Kent",
  tags: ["Superman", "Jon Kent", "Val-Zod", "Ultraman", "multiverso", "super-herói"]
});

window.DEFAULT_SERIES.push({
  id: "series-birds-of-prey-2023",
  name: "Aves de Rapina",
  seriesTitle: "Aves de Rapina",
  originalTitle: "Birds of Prey",
  type: "comic",
  publisher: "DC Comics",
  imprint: "2023-",
  publication: "Mensal",
  status: "Em Andamento",
  editions: "—",
  year: 2023,
  description: "Dinah Lance reforma as Aves de Rapina para uma missão pessoal e aparentemente impossível. Ao lado de Cassandra Cain, Grande Barda, Devota e Arlequina, a Canário Negro precisa realizar uma extração sem derramamento de sangue. Kelly Thompson estreia como roteirista no Universo DC, acompanhada por Leonardo Romero e Jordie Bellaire.",
  coverUrl: "",
  telegramUrl: "",
  author: "Kelly Thompson / Leonardo Romero / Jordie Bellaire",
  character: "Canário Negro",
  tags: ["Aves de Rapina", "Birds of Prey", "Canário Negro", "Cassandra Cain", "Grande Barda", "Arlequina", "super-herói"]
});

window.DEFAULT_SERIES.push({
  id: "series-jurassic-league-2022",
  name: "A Liga Jurássica",
  seriesTitle: "A Liga Jurássica",
  originalTitle: "Jurassic League",
  type: "comic",
  publisher: "DC Comics",
  imprint: "",
  publication: "Minissérie",
  status: "Cancelada/Terminada",
  editions: "06",
  year: 2022,
  description: "Você conhece a história: uma criança escapa da destruição do seu planeta natal e vai parar na Terra para ser criado por pais humanos. Uma deusa de uma cidade perdida defende a verdade. Um Tiranossauro Rex veste algo parecido com um morcego para infligir medo aos malfeitores. Essa heroica trindade, junto com uma liga de outros dinossauros superpoderosos, juntam forças para salvar uma Terra pré-histórica das sinistras maquinações de Darkseid… o que? Certo, talvez você não conheça a história. Então junte-se a gente e presencie uma aventura novíssima e ainda assim mais velha que o tempo e experiencie a Liga da Justiça como você nunca os viu antes!",
  coverUrl: "",
  telegramUrl: "",
  author: "Daniel Warren Johnson / Juan Gedeon",
  character: "Liga da Justiça",
  tags: ["Liga da Justiça", "Jurassic League", "dinossauros", "Darkseid", "Elseworlds", "super-herói", "DC Comics"]
});

window.DEFAULT_SERIES.push({
  id: "series-unstoppable-doom-patrol-2023",
  name: "A Imparável Patrulha do Destino",
  seriesTitle: "A Imparável Patrulha do Destino",
  originalTitle: "Unstoppable Doom Patrol",
  type: "comic",
  publisher: "DC Comics",
  imprint: "2023-",
  publication: "Série Mensal",
  status: "Em Andamento",
  editions: "—",
  year: 2023,
  description: "OS HERÓIS MAIS ESTRANHOS DE TODOS ESTÃO DE VOLTA NO UNIVERSO DC! Depois dos eventos de Planeta Lázaro, mais pessoas do que nunca possuem metagenes ativos! A maioria desses novos metahumanos se tornaram párias, ignorados e aprisionados por uma sociedade com medo. Eles estão escondidos no escuro, perdidos em um sistema que os vê apenas como armas ou como ratos de laboratórios – bombas relógios que só podem ser desativadas pela Imparável Patrulha do Destino! Homem-Robô, Mulher-Elástica e Homem Negativo dão as boas-vindas a seus novos colegas de equipe, Garota Fera e Degenerado, e são liderados pela nova e misteriosa identidade de Crazy Jane, a Chefe, em uma missão para salvar o mundo salvando os monstros!",
  coverUrl: "",
  telegramUrl: "",
  author: "Dennis Culver / Chris Burnham",
  character: "Patrulha do Destino",
  tags: ["Patrulha do Destino", "Doom Patrol", "metahumanos", "super-herói", "DC Comics"]
});

window.DEFAULT_SERIES.push({
  id: "series-fury-of-firestorm-2026",
  name: "A Fúria do Nuclear",
  seriesTitle: "A Fúria do Nuclear",
  originalTitle: "The Fury of Firestorm",
  type: "comic",
  publisher: "DC Comics",
  imprint: "2026-",
  publication: "Mensal",
  status: "Em Andamento",
  editions: "—",
  year: 2026,
  description: "A comunidade de Bedford, Colorado, parece uma pequena cidade tranquila, mas tudo muda quando o Homem Nuclear chega e começa a experimentar. Prédios viram areia e pessoas são transformadas em vidro. O que levou Ronnie Raymond a cometer esses atos e alguém conseguirá conter a fúria do Nuclear?",
  coverUrl: "",
  telegramUrl: "",
  author: "",
  character: "Nuclear",
  tags: ["Nuclear", "Firestorm", "Ronnie Raymond", "Bedford", "super-herói"]
});

window.DEFAULT_SERIES.push({
  id: "series-new-champion-of-shazam",
  name: "A Nova Campeã do Shazam",
  seriesTitle: "A Nova Campeã do Shazam",
  originalTitle: "The New Champion of Shazam!",
  type: "comic",
  publisher: "DC Comics",
  imprint: "DC Comics",
  publication: "Minissérie",
  status: "Encerrada",
  editions: "04",
  year: 2022,
  description: "Mary Bromfield sempre lutou para determinar quem ela é fora de sua família… meio difícil de fazer quando todos vocês são super-heróis! Agora, após o sacrifício heroico de Billy Batson, o poder de Shazam desapareceu e ela ficou impotente. A maioria dos heróis ficaria perturbada, mas não Mary. Finalmente chegou a hora de uma viagem de autodescoberta enquanto ela se prepara para seu primeiro ano de faculdade e uma vida civil. Mas nada é realmente normal para esta jovem heroína, porque ela acaba de ser escolhida como a nova campeã do Shazam! (Pelo menos de acordo com um coelho falante enviado por seu irmão Billy.) Ela vai abraçar o poder? Ou morrerá junto com a esperança de sobrevivência deste mundo contra as misteriosas forças mágicas que esperam para assumir o controle?",
  coverUrl: "",
  telegramUrl: "",
  author: "",
  character: "Mary Bromfield / Shazam",
  tags: ["Shazam", "Mary Marvel", "DC Comics", "super-herói"]
});

window.DEFAULT_SERIES.push({
  id: "series-new-golden-age",
  name: "A Nova Era de Ouro",
  seriesTitle: "A Nova Era de Ouro",
  originalTitle: "The New Golden Age",
  type: "comic",
  publisher: "DC Comics",
  imprint: "DC Comics",
  publication: "Edição Especial",
  status: "Encerrada",
  editions: "01",
  year: 2022,
  description: "Da Sociedade da Justiça da América para a Legião dos Super-Heróis, A Nova Era de Ouro irá desbloquear uma épica e secreta história de heroísmo da DC, lançando um novo grupo de títulos no Universo DC. De 1940 a 3040, heróis combatem o grande mal de seus tempos. Mas nas consequências de Além de Flashpoint estes heróis e vilões irão ter suas vidas viradas de cabeça para baixo. O futuro da DC… e seu passado… nunca mais serão os mesmos. Mas como o Mímico e a Marionete estão envolvidos nisto? Por que Rip Hunter e os Mestres do Tempo são os heróis mais improváveis do Universo DC? E quem ou o que é… Nostalgia? Não perca o mais estranho mistério que já aconteceu no Universo DC.",
  coverUrl: "",
  telegramUrl: "",
  author: "",
  character: "Sociedade da Justiça da América / Legião dos Super-Heróis",
  tags: ["DC Comics", "Sociedade da Justiça", "Legião dos Super-Heróis", "viagem no tempo"]
});

window.DEFAULT_SERIES.push({
  id: "series-death-of-superman-30th-anniversary",
  name: "A Morte do Superman Especial de 30º Aniversário",
  seriesTitle: "A Morte do Superman Especial de 30º Aniversário",
  originalTitle: "The Death of Superman 30th Anniversary Special",
  type: "comic",
  publisher: "DC Comics",
  imprint: "DC Comics",
  publication: "Edição Especial",
  status: "Finalizada",
  editions: "01",
  year: 2022,
  description: "Jon fica chateado quando descobre a “morte” de seu pai anos antes, durante seu encontro com Apocalypse. Enquanto Lois e Clark explicam a história para Jon, eles são interrompidos quando um novo monstro ataca Metrópolis que tem todos os poderes do Apocalypse mais algumas habilidades adicionais próprias.",
  coverUrl: "",
  telegramUrl: "",
  author: "",
  character: "Superman / Jon Kent",
  tags: ["Superman", "Jon Kent", "Apocalypse", "DC Comics"]
});

window.DEFAULT_LIBRARY = [
  {
    id: "new-champion-of-shazam-001",
    seriesId: "series-new-champion-of-shazam",
    title: "A Nova Campeã do Shazam",
    issue: "1",
    format: "cbr",
    fileUrl: "https://www.mediafire.com/file/avlv11y6ye4v869/ThNwChmpnfShzm%2521_01_%2528of_04%2529_%25282022%2529_%2528Zona-SQ%2529.cbr/file",
    telegramUrl: "",
    clicks: 0,
    featured: true,
    randomWeight: 5,
    collectionIds: []
  },
  {
    id: "new-golden-age-001",
    seriesId: "series-new-golden-age",
    title: "A Nova Era de Ouro",
    issue: "1",
    format: "cbr",
    fileUrl: "https://www.mediafire.com/file/838xweqqxw8ua95/NVERdOUR.cbr/file",
    telegramUrl: "",
    clicks: 0,
    featured: true,
    randomWeight: 5,
    collectionIds: []
  },
  {
    id: "death-of-superman-30th-anniversary-001",
    seriesId: "series-death-of-superman-30th-anniversary",
    title: "A Morte do Superman Especial de 30º Aniversário",
    issue: "1",
    format: "cbr",
    fileUrl: "https://www.mediafire.com/file/sl0hi9zzv3yyo1u/MrtSprMn30anvrs_%25282022%2529.%2528ZF-SQ%2529.cbr/file",
    telegramUrl: "",
    clicks: 0,
    featured: true,
    randomWeight: 5,
    collectionIds: []
  },
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
  { id: "aquaman-the-becoming-001", seriesId: "series-aquaman-the-becoming", title: "Aquaman: O Emergir", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/g9l02orhctlumli/Aquaman_-_O_Emergir_001_%25282021%2529._%2528Zona_Fantasma%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "aquaman-the-becoming-002", seriesId: "series-aquaman-the-becoming", title: "Aquaman: O Emergir", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/4kkoya16zu2kvr0/Aquaman_-_O_Emergir_02_de_06_%25282021%2529._%2528Zona_Fantasma%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "aquaman-the-becoming-003", seriesId: "series-aquaman-the-becoming", title: "Aquaman: O Emergir", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/vzl0enkba4hxgzv/Aquaman_-_O_Emergir_03_de_06_%25282021%2529._%2528ZF-SQ%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "aquaman-the-becoming-004", seriesId: "series-aquaman-the-becoming", title: "Aquaman: O Emergir", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/3o3urov6x7p0l6i/Aquaman_-_O_Emergir_04_de_06_%25282021%2529._%2528ZF-SQ%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "aquaman-the-becoming-005", seriesId: "series-aquaman-the-becoming", title: "Aquaman: O Emergir", issue: "5", format: "cbr", fileUrl: "https://www.mediafire.com/file/mwzwlxfjgamlyqo/Aquaman_-_O_Emergir_05_de_06_%25282021%2529._%2528ZF-SQ%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "aquaman-the-becoming-006", seriesId: "series-aquaman-the-becoming", title: "Aquaman: O Emergir", issue: "6", format: "cbr", fileUrl: "https://www.mediafire.com/file/2pelulobugplopi/Aquaman_-_O_Emergir_06_de_06_%25282021%2529._%2528ZF-SQ%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-001", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/ly0n14h9tnsejto/Arlequina_001_%25282021%2529_%2528S%25C3%25B3Quadrinhos_e_Zona_Fantasma%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-002", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/nnrp5331rh4q97w/Arlequina_002_%25282021%2529_%2528S%25C3%25B3Quadrinhos_e_Zona_Fantasma%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-003", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/jixe3r7igaresw9/Arlequina_003_%25282021%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr/file", clicks: 0, featured: true, randomWeight: 5, collectionIds: [], coverUrl: "https://i.postimg.cc/6q2N4CbR/001.jpg" },
  { id: "harley-quinn-2021-004", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/6bs04wywpcweujt/Arlequina_004_%25282021%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-005", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "5", format: "cbr", fileUrl: "https://www.mediafire.com/file/9jimppm7c74jxxv/Arlequina_005_%25282021%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [], coverUrl: "https://i.postimg.cc/QxDr7Wwn/001.jpg" },
  { id: "harley-quinn-2021-006", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "6", format: "cbr", fileUrl: "https://www.mediafire.com/file/umnjf7qmgkn6e68/Arlequina_006_%25282021%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-007", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "7", format: "cbr", fileUrl: "https://www.mediafire.com/file/1l3266qp0q4gxqz/Arlequina_007_%25282021%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-008", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "8", format: "cbr", fileUrl: "https://www.mediafire.com/file/a5k7gnfkj3ymw1d/Arlequina_008_%25282021%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-009", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "9", format: "cbr", fileUrl: "https://www.mediafire.com/file/11n6qoo7y0ispax/Arlequina_009_%25282022%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-010", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "10", format: "cbr", fileUrl: "https://www.mediafire.com/file/97yimbiczk2urz4/Arlequina_%252310_%25282021%2529_%2528SQ%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-011", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "11", format: "cbr", fileUrl: "https://www.mediafire.com/file/0kj0bo6nitoxk0p/Arlequina_011_%25282022%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-012", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "12", format: "cbr", fileUrl: "https://www.mediafire.com/file/l0uuopsqsj5wlc0/Arlequina_012_%25282022%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-013", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "13", format: "cbr", fileUrl: "https://www.mediafire.com/file/6ru2ivbk28bnh1c/Arlequina_013_%25282022%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-014", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "14", format: "cbr", fileUrl: "https://www.mediafire.com/file/b142fwnwjs2zizy/Arlequina_014_%25282022%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-015", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "15", format: "cbr", fileUrl: "https://www.mediafire.com/file/0ibqdmbhze7yto2/Arlequina_015_%25282022%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-016", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "16", format: "cbr", fileUrl: "https://www.mediafire.com/file/gocbrn4u1ecmckq/Arlequina_016_%25282022%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-017", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "17", format: "cbr", fileUrl: "https://www.mediafire.com/file/by9tw3zdx13can5/Arlequina_017_%25282022%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-018", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "18", format: "cbr", fileUrl: "https://www.mediafire.com/file/en3jl76pt2d6s3y/Arlequina_018_%25282022%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-019", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "19", format: "cbr", fileUrl: "https://www.mediafire.com/file/a0sj46laq88ngyr/Arlequina_019_%25282022%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-020", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "20", format: "cbr", fileUrl: "https://www.mediafire.com/file/su4560xu7ddv0q8/Arlequina_020_%25282022%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-annual", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "Anuário", sortOrder: 6.5, format: "cbr", fileUrl: "https://www.mediafire.com/file/jqblivardbe7enx/HrlyQnnNl_%25232021_%25282021%2529_%2528DarkseidClub%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [], coverUrl: "https://i.postimg.cc/7hhQHg1Z/Harley-Quinn-2021-Annual-2021-001-000.jpg" },
  { id: "green-arrow-2023-001", seriesId: "series-green-arrow-2023", title: "Arqueiro Verde", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/j6h6k2u8wqt0yot/ARQVRD%25231_%25282023%2529_%2528ZF-SQ%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "green-arrow-2023-002", seriesId: "series-green-arrow-2023", title: "Arqueiro Verde", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/gddxf41p0942ghr/ARQVRD%25232_%25282023%2529_%2528ZF-SQ%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "green-arrow-2023-003", seriesId: "series-green-arrow-2023", title: "Arqueiro Verde", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/ys9u87dxy05kfuq/ARQVRD%25233_%25282023%2529_%2528ZF-SQ%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "green-arrow-2023-004", seriesId: "series-green-arrow-2023", title: "Arqueiro Verde", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/op7e4jqur7j53ge/ARQVRD%25234_%25282023%2529_%2528ZF-SQ%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "black-manta-2021-001", seriesId: "series-black-manta-2021", title: "Arraia Negra", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/6qh9k28lfo9pk0r/Arraia_Negra_%252301_%25282021%2529_%2528SQ%2526ZF%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "black-manta-2021-002", seriesId: "series-black-manta-2021", title: "Arraia Negra", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/urvbq9fbxtbrxgt/Arraia_Negra_%252302_%25282021%2529_%2528SQ%2526ZF%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "black-manta-2021-003", seriesId: "series-black-manta-2021", title: "Arraia Negra", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/pjrvk4e0spoj063/Arraia_Negra_%252303_%25282022%2529_%2528SQ%2526ZF%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "black-manta-2021-004", seriesId: "series-black-manta-2021", title: "Arraia Negra", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/hiilk5mpszt140w/Arraia_Negra_%252304_%25282022%2529_%2528SQ%2526ZF%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "black-manta-2021-005", seriesId: "series-black-manta-2021", title: "Arraia Negra", issue: "5", format: "cbr", fileUrl: "https://www.mediafire.com/file/5qhfh3nwcgb5chs/Arraia_Negra_%252305_%25282022%2529_%2528SQ%2526ZF%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "black-manta-2021-006", seriesId: "series-black-manta-2021", title: "Arraia Negra", issue: "6", format: "cbr", fileUrl: "https://www.mediafire.com/file/uvt3zkopstxcv0j/Arraia_Negra_%252306_%25282022%2529_%2528SQ%2526ZF%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "adventures-superman-jon-kent-001", seriesId: "series-adventures-superman-jon-kent", title: "As Aventuras do Superman – Jon Kent", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/578t8zr53utubqp/AdvSMJK%25231_%25282023%2529%2528ZF-SQ%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "adventures-superman-jon-kent-002", seriesId: "series-adventures-superman-jon-kent", title: "As Aventuras do Superman – Jon Kent", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/ntulludq0b91poc/AdvSMJK%25232_%25282023%2529%2528ZF-SQ%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "adventures-superman-jon-kent-003", seriesId: "series-adventures-superman-jon-kent", title: "As Aventuras do Superman – Jon Kent", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/8dha86k7rfm3x2s/AdvSMJK%25233_%25282023%2529%2528ZF-SQ%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "adventures-superman-jon-kent-004", seriesId: "series-adventures-superman-jon-kent", title: "As Aventuras do Superman – Jon Kent", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/blgq99nk6xpknfw/AdvSMJK%25234_%25282023%2529%2528ZF-SQ%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "adventures-superman-jon-kent-005", seriesId: "series-adventures-superman-jon-kent", title: "As Aventuras do Superman – Jon Kent", issue: "5", format: "cbr", fileUrl: "https://www.mediafire.com/file/tqxqqbnkv33efv0/AdvSMJK%25235_%25282023%2529%2528ZF-SQ%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "adventures-superman-jon-kent-006", seriesId: "series-adventures-superman-jon-kent", title: "As Aventuras do Superman – Jon Kent", issue: "6", format: "cbr", fileUrl: "https://www.mediafire.com/file/rgby1k1h43jlimt/AdvSMJK%25236_%25282023%2529%2528ZF-SQ%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "birds-of-prey-2023-001", seriesId: "series-birds-of-prey-2023", title: "Aves de Rapina", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/5wx9gl445qa5rr2/Aves_de_Rapina_001_%25282023%2529_%2528SQ_%2526_ZF%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "jurassic-league-2022-001", seriesId: "series-jurassic-league-2022", title: "A Liga Jurássica", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/0leks3eaemv2rvj/A_Liga_Jur%25C3%25A1ssica_%252301_%25282022%2529_%2528SQ%2526ZF%2529.cbr/file", telegramUrl: "", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "jurassic-league-2022-002", seriesId: "series-jurassic-league-2022", title: "A Liga Jurássica", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/8p3xpgh3h0mghx6/A_Liga_Jur%25C3%25A1ssica_%252302_%25282022%2529_%2528SQ%2526ZF%2529.cbr/file", telegramUrl: "", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "jurassic-league-2022-003", seriesId: "series-jurassic-league-2022", title: "A Liga Jurássica", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/bjwp2iib4kxifzw/A_Liga_Jur%25C3%25A1ssica_%252303_%25282022%2529_%2528SQ%2526ZF%2529.cbr/file", telegramUrl: "", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "jurassic-league-2022-004", seriesId: "series-jurassic-league-2022", title: "A Liga Jurássica", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/0bi55zmk06m6b0j/A_Liga_Jur%25C3%25A1ssica_%252304_%25282022%2529_%2528SQ%2526ZF%2529.cbr/file", telegramUrl: "", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "jurassic-league-2022-005", seriesId: "series-jurassic-league-2022", title: "A Liga Jurássica", issue: "5", format: "cbr", fileUrl: "https://www.mediafire.com/file/d0dn8gnu0ve11ob/A_Liga_Jur%25C3%25A1ssica_%252305_%25282022%2529_%2528SQ%2526ZF%2529.cbr/file", telegramUrl: "", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "jurassic-league-2022-006", seriesId: "series-jurassic-league-2022", title: "A Liga Jurássica", issue: "6", format: "cbr", fileUrl: "https://www.mediafire.com/file/gw0wsb0j59q4t3l/A_Liga_Jur%25C3%25A1ssica_%252306_%25282022%2529_%2528SQ%2526ZF%2529.cbr/file", telegramUrl: "", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "unstoppable-doom-patrol-2023-001", seriesId: "series-unstoppable-doom-patrol-2023", title: "A Imparável Patrulha do Destino", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/b1ruyziki50qvrc/PtrlhDstn%25231_%25282023%2529_%2528ZF-SQ%2529.cbr/file", telegramUrl: "", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "fury-of-firestorm-2026-001", seriesId: "series-fury-of-firestorm-2026", title: "A Fúria do Nuclear", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/gtd5s53thh9oqvf/A+F%C3%BAria+do+Nuclear+%2301+%282026%29+%28SoQuadrinhos%29.cbr/file", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "fury-of-firestorm-2026-002", seriesId: "series-fury-of-firestorm-2026", title: "A Fúria do Nuclear", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/x0b1vr8l7duit9i/A+F%C3%BAria+do+Nuclear+%2302+%282026%29+%28SoQuadrinhos%29.cbr/file", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "fury-of-firestorm-2026-003", seriesId: "series-fury-of-firestorm-2026", title: "A Fúria do Nuclear", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/j7osac1eaizr7cv/A+F%C3%BAria+do+Nuclear+%2303+%282026%29+%28SoQuadrinhos%29.cbr/file", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "fury-of-firestorm-2026-004", seriesId: "series-fury-of-firestorm-2026", title: "A Fúria do Nuclear", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/htnfmlzv392x6h6/A+F%C3%BAria+do+Nuclear+%2304+%282026%29+%28SoQuadrinhos%29.cbr/file", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "fury-of-firestorm-2026-005", seriesId: "series-fury-of-firestorm-2026", title: "A Fúria do Nuclear", issue: "5", format: "cbr", fileUrl: "https://www.mediafire.com/file/cq5eyd3n7thbx4f/A+F%C3%BAria+do+Nuclear+%2305+%282026%29+%28SoQuadrinhos%29.cbr/file", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
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
