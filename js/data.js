/* Dados iniciais.
   O site funciona sem banco de dados: os dados editados pelo administrador
   ficam no localStorage do navegador. Para produção, troque o DataStore por
   uma API/banco sem precisar reescrever a interface. */

// Metadados compartilhados: as edições guardam apenas o que muda entre os arquivos.
window.DEFAULT_SERIES = [
  {
    id: "series-absolute-batman",
    name: "Absolute Batman",
    seriesTitle: "Absolute Batman",
    type: "comic",
    publisher: "DC Comics",
    imprint: "Recentes",
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

// Registros de demonstração da primeira versão do catálogo.
window.REMOVED_DEFAULT_ITEM_IDS = ["hq-001", "hq-002", "hq-003", "hq-004"];

window.DEFAULT_SERIES.push({
  id: "series-absolute-superman",
  name: "Absolute Superman",
  seriesTitle: "Absolute Superman",
  type: "comic",
  publisher: "DC Comics",
  imprint: "Recentes",
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
  imprint: "Recentes",
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
  imprint: "Recentes",
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
  imprint: "Recentes",
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
  imprint: "Recentes",
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
  imprint: "Recentes",
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
  imprint: "Recentes",
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
  imprint: "Recentes",
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
  imprint: "Recentes",
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
  imprint: "Recentes",
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
  id: "series-batgirls-2022",
  name: "Batgirls",
  seriesTitle: "Batgirls",
  originalTitle: "Batgirls",
  type: "comic",
  publisher: "DC Comics",
  imprint: "Recentes",
  publication: "Série Mensal",
  status: "Em Andamento",
  editions: "—",
  year: 2022,
  description: "Você não achou mesmo que iríamos te deixar esperando este ano inteiro pela série das Batgirls que todos estávamos querendo, né? Orientadas pela Oráculo, as Batgirls se mudam para o outro lado da cidade, onde Barbara Gordon pode ficar de olho nelas enquanto o hacker conhecido como Vigia ainda está invadindo suas vidas. Steph pode ser muito imprudente às vezes, e Cass não fala muito – mas o que lhes falta em semelhanças, elas compensam com seu respeito mútuo e amor uma pela outra… e isso o que as torna mais fortes juntas como Batgirls! E elas podem ser boas em chutar traseiros, mas estão apenas tentando o seu melhor para serem adolescentes normais – que pegam emprestadas as chaves de um muscle car que pertenceu a um bandido, dão um rolê pela cidade sem carteira de motorista, e voltam correndo pra casa antes do toque de recolher da Oráculo!",
  coverUrl: "",
  telegramUrl: "",
  author: "Becky Cloonan / Michael W. Conrad / Jorge Corona",
  character: "Batgirls",
  tags: ["Batgirls", "Barbara Gordon", "Stephanie Brown", "Cassandra Cain", "Oráculo", "Batman", "super-herói", "DC Comics"]
});

window.DEFAULT_SERIES.push({
  id: "series-batman-beyond-neo-year-2022",
  name: "Batman do Futuro – NeoAno",
  seriesTitle: "Batman do Futuro – NeoAno",
  originalTitle: "Batman Beyond – Neo Year",
  type: "comic",
  publisher: "DC Comics",
  imprint: "Recentes",
  publication: "Minissérie",
  status: "Finalizada",
  editions: "06",
  year: 2022,
  description: "Bruce Wayne está morto, Barbara Gordon vai se aposentar da polícia, e um antigo chefe do crime organizado vai assumir como o mais novo CEO da Wayne-Powers. E isso é só a ponta do iceberg. São muitas coisas acontecendo e muitos problemas para lidar, e Terry McGinnis está sozinho nessa guerra constante que é Gotham.",
  coverUrl: "",
  telegramUrl: "",
  author: "Jackson Lanzing / Collin Kelly / Max Dunbar",
  character: "Batman do Futuro",
  tags: ["Batman do Futuro", "Batman Beyond", "Terry McGinnis", "Bruce Wayne", "Barbara Gordon", "Gotham", "super-herói", "DC Comics"]
});

window.DEFAULT_SERIES.push({
  id: "series-batman-vs-robin-2022",
  name: "Batman vs Robin",
  seriesTitle: "Batman vs Robin",
  originalTitle: "Batman vs Robin",
  type: "comic",
  publisher: "DC Comics",
  imprint: "Recentes",
  publication: "Minissérie",
  status: "Encerrada",
  editions: "05",
  year: 2022,
  description: "Vindo diretamente das ocasiões de Batman/Superman: Melhores do Mundo e Guerra das Sombras, pai e filho irão batalhar em uma das histórias mais grandiosas já contadas! Bem no fundo do coração da Ilha Lazarus, o legado demoníaco da família Al Ghul foi finalmente libertado, e o Demônio Nezha está à procura de sangue. Para retomar todo o seu domínio sobre o planeta Terra, Nezha sobrecarregou a magia – qualquer um que ousar usá-la será subjugado por um mal demoníaco que irá sobrecarregar suas habilidades de forma perigosa, imprevisível e, em alguns casos, até mesmo mortal! Com Damian nas garras de Nezha e Bruce assombrado pelo retorno de um velho amigo, o Cavaleiro das Trevas e o Menino Prodígio estão um contra o outro em uma batalha do século!",
  coverUrl: "",
  telegramUrl: "",
  author: "Mark Waid / Mahmud Asrar",
  character: "Batman / Robin",
  tags: ["Batman", "Robin", "Damian Wayne", "Bruce Wayne", "Nezha", "Ilha Lazarus", "Guerra das Sombras", "DC Comics"]
});

window.DEFAULT_SERIES.push({
  id: "series-batman-and-robin-2023",
  name: "Batman e Robin",
  seriesTitle: "Batman e Robin",
  originalTitle: "Batman and Robin",
  type: "comic",
  publisher: "DC Comics",
  imprint: "Recentes",
  publication: "Série Mensal",
  status: "Em Andamento",
  editions: "—",
  year: 2023,
  description: "Pai e filho. Bruce e Damian. Batman e Robin. De Batman vs Robin até Terrores Noturnos, muita coisa aconteceu à Dupla Dinâmica, mas agora eles estão juntos de novo e prontos para lutar contra o crime – bem a tempo dos inimigos mais monstruosos do Batman se unirem para transformar a cidade em uma selva urbana! Um novo vilão assiste das sombras, com intenção de vingança, com um plano para transformar uma das maiores ajudas do Batman contra ele! Será que Damian conseguirá ajudar seu pai a resolver o caso antes que seja tarde demais?",
  coverUrl: "",
  telegramUrl: "",
  author: "Joshua Williamson / Simone Di Meo",
  character: "Batman / Robin",
  tags: ["Batman", "Robin", "Damian Wayne", "Bruce Wayne", "Gotham", "super-herói", "DC Comics"]
});

window.DEFAULT_SERIES.push({
  id: "series-jurassic-league-2022",
  name: "A Liga Jurássica",
  seriesTitle: "A Liga Jurássica",
  originalTitle: "Jurassic League",
  type: "comic",
  publisher: "DC Comics",
  imprint: "Recentes",
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
  imprint: "Recentes",
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
  imprint: "Recentes",
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
  imprint: "Recentes",
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
  imprint: "Recentes",
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
  imprint: "Recentes",
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

window.DEFAULT_SERIES.push({
  id: "series-immortal-legend-batman-2025",
  name: "A Lenda Imortal Batman",
  seriesTitle: "A Lenda Imortal Batman",
  originalTitle: "Immortal Legend Batman",
  type: "comic",
  publisher: "DC Comics",
  imprint: "Recentes",
  publication: "Minissérie",
  status: "Encerrada",
  editions: "06",
  year: 2025,
  description: "A humanidade quebrou a barreira entre o nosso universo e a sua sombra. Do vazio vieram terríveis aparições que desejavam nada além de destruição. Mas desse horror, uma lenda nasceu: um guerreiro que encontrou um meio de acessar a energia que liga o nosso universo e o universo das sombras, transformando-se em um cavaleiro das trevas cósmico. Essa lenda imortal se chamava Batman.",
  coverUrl: "",
  telegramUrl: "",
  author: "",
  character: "Batman",
  tags: ["Batman", "DC Comics", "super-herói"]
});

window.DEFAULT_SERIES.push({
  id: "series-batman-killing-time-2022",
  name: "Batman – Tempo de Matar",
  seriesTitle: "Batman – Tempo de Matar",
  originalTitle: "Batman – Killing Time",
  type: "comic",
  publisher: "DC Comics",
  imprint: "Recentes",
  publication: "Minissérie",
  status: "Concluída",
  editions: "06",
  year: 2022,
  description: "Três vilões, um Cavaleiro das Trevas e um assalto mortal que deu errado. A Mulher-Gato, o Charada e o Pinguim unem forças para realizar o maior roubo da história de Gotham City. O alvo deles? Um artefato misterioso e inestimável em posse secreta de Bruce Wayne! Mas, à medida que os eventos se desenrolam, qual é a graça de um assalto sem uma ou duas traições sangrentas? Tom King e David Marquez trazem uma história épica, emocionante e cheia de ação de um jovem Batman desesperado para recuperar seu bem mais precioso das mãos de bandidos violentos antes que o relógio chegue ao Tempo de Matar…",
  coverUrl: "",
  telegramUrl: "",
  author: "Tom King / David Marquez",
  character: "Batman",
  tags: ["Batman", "Mulher-Gato", "Charada", "Pinguim", "DC Comics", "super-herói"]
});

window.DEFAULT_SERIES.push({
  id: "series-batman-one-bad-day-2022",
  name: "Batman – Um Dia Ruim",
  seriesTitle: "Batman – Um Dia Ruim",
  originalTitle: "Batman: One Bad Day",
  type: "comic",
  publisher: "DC Comics",
  imprint: "Recentes",
  publication: "Série de One-Shots",
  status: "Concluída",
  editions: "08",
  year: 2022,
  description: "Um Dia Ruim é uma série de one-shots de 64 páginas. Cada história gira em torno do Batman interagindo com um de seus clássicos vilões por um dia, apresentando histórias definitivas de alguns dos maiores inimigos do Cavaleiro das Trevas.",
  coverUrl: "",
  telegramUrl: "",
  author: "Vários autores",
  character: "Batman",
  tags: ["Batman", "Charada", "Duas-Caras", "Pinguim", "Sr. Frio", "Mulher-Gato", "Bane", "Cara-de-Barro", "Ra’s al Ghul", "DC Comics"]
});

window.DEFAULT_SERIES.push({
  id: "series-batman-catwoman-gotham-war-2023",
  name: "Batman/Mulher-Gato – A Guerra por Gotham",
  seriesTitle: "Batman/Mulher-Gato – A Guerra por Gotham",
  originalTitle: "Batman/Catwoman: The Gotham War",
  type: "comic",
  publisher: "DC Comics",
  imprint: "Recentes",
  publication: "Minissérie",
  status: "Concluída",
  editions: "07",
  year: 2023,
  description: "Selina Kyle descobriu seu próprio jeito de proteger Gotham, treinando os bandidos da classe mais baixa para roubarem dos ricos e deixarem de ser capangas dos maiores criminosos da cidade. Apesar de o crime e a violência terem diminuído, Batman acredita que escolher vítimas não é a melhor forma de proteger Gotham. Quando um dos aprendizes de Selina se envolve em uma situação inesperada, o conflito entre o Morcego e a Gata aumenta.",
  coverUrl: "",
  telegramUrl: "",
  author: "Chip Zdarsky / Tini Howard",
  character: "Batman / Mulher-Gato",
  tags: ["Batman", "Mulher-Gato", "Gotham", "DC Comics", "super-herói"]
});

window.DEFAULT_SERIES.push({
  id: "series-batman-superman-worlds-finest-2022",
  name: "Batman/Superman: Melhores do Mundo",
  seriesTitle: "Batman/Superman: Melhores do Mundo",
  originalTitle: "Batman/Superman: World's Finest",
  type: "comic",
  publisher: "DC Comics",
  imprint: "Recentes",
  publication: "Série Mensal",
  status: "Em Andamento",
  editions: "—",
  year: 2022,
  description: "Em um passado não tão distante, os poderes do Superman são sobrecarregados por um ataque devastador do vilão Metallo. O único aliado em quem o Homem de Aço pode confiar é a vingança sombria de Gotham: Batman. Uma explosão quase fatal de poder leva Bruce Wayne a medidas extremas para ajudar seu amigo, recrutando ninguém menos que a Patrulha do Destino.",
  coverUrl: "",
  telegramUrl: "",
  author: "Mark Waid / Dan Mora",
  character: "Batman / Superman",
  tags: ["Batman", "Superman", "Patrulha do Destino", "DC Comics", "super-herói"]
});

window.DEFAULT_SERIES.push({
  id: "series-batman-urban-legends-2021",
  name: "Batman: Lendas Urbanas",
  seriesTitle: "Batman: Lendas Urbanas",
  originalTitle: "Batman: Urban Legends",
  type: "comic",
  publisher: "DC Comics",
  imprint: "Recentes",
  publication: "Série Mensal",
  status: "Em Andamento",
  editions: "06",
  year: 2021,
  description: "Conheça histórias das maiores figuras de Gotham City.",
  coverUrl: "",
  telegramUrl: "",
  author: "Vários autores",
  character: "Batman",
  tags: ["Batman", "Gotham", "DC Comics", "super-herói"]
});

window.DEFAULT_SERIES.push({ id: "series-joker-2021", name: "Coringa", seriesTitle: "Coringa", originalTitle: "Joker", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Mensal", status: "Cancelada/Finalizada", editions: "15", year: 2021, description: "Após os eventos de Fronteira Infinita #1, o Coringa é o homem mais procurado do mundo e está fugindo para o exterior. James Gordon percebe que esta é a caçada de sua vida, enquanto forças misteriosas também perseguem o Coringa.", coverUrl: "https://zonafantasmanet.files.wordpress.com/2021/07/the-joker-2021-001-000_med.jpg", author: "James Tynion IV / Guillem March", character: "Coringa", tags: ["Coringa", "Joker", "Batman", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-deathstroke-inc-2021", name: "Corporação Exterminador", seriesTitle: "Corporação Exterminador", originalTitle: "Deathstroke Inc.", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Série Mensal", status: "Em Andamento", editions: "—", year: 2021, description: "Depois de sofrer muitas perdas, Slade Wilson decide mudar. Alistado para trabalhar para a C.R.E.I.A., ele recebe uma nova equipe e recursos para enfrentar vilões nas partes mais estranhas do Universo DC, incluindo uma nova parceira: Canário Negro.", coverUrl: "https://zonafantasmanet.files.wordpress.com/2022/11/deathstroke-inc-2021-001-000.jpg", author: "Joshua Williamson / Howard Porter", character: "Exterminador", tags: ["Exterminador", "Deathstroke", "Canário Negro", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-dark-crisis-2022", name: "Crise Sombria nas Infinitas Terras", seriesTitle: "Crise Sombria nas Infinitas Terras", originalTitle: "Dark Crisis on Infinite Earths", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Evento", status: "Em Andamento", editions: "30", year: 2022, description: "Superman, Batman, Mulher-Maravilha e o restante da Liga da Justiça estão mortos. Os heróis restantes precisam defender o mundo dos ataques dos maiores vilões da DC e formar uma nova Liga da Justiça diante de uma escuridão maior do que qualquer ameaça anterior.", coverUrl: "https://i.postimg.cc/j5P2pWRD/00a.jpg", author: "Joshua Williamson / Daniel Sampere", character: "Liga da Justiça", tags: ["Crise Sombria", "Liga da Justiça", "DC Comics", "evento"] });
window.DEFAULT_SERIES.push({ id: "series-cyborg-2023", name: "Cyborg", seriesTitle: "Cyborg", originalTitle: "Cyborg", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Série Mensal", status: "Em Andamento", editions: "—", year: 2023, description: "Uma emergência familiar traz Cyborg de volta para Detroit. Enquanto Victor Stone tenta viver uma vida mais simples, uma nova empresa transforma a periferia da cidade em um laboratório para desenvolver uma inteligência artificial revolucionária.", coverUrl: "https://i.postimg.cc/KvcB7tsM/Cyborg-001-000-copiar.jpg", author: "Morgan Hampton / Tom Raney", character: "Cyborg", tags: ["Cyborg", "Victor Stone", "Detroit", "DC Comics"] });

const DARK_CRISIS_COVERS = [
  "https://i.postimg.cc/j5P2pWRD/00a.jpg",
  "https://i.postimg.cc/1zvj2ZKq/Justice-League-Road-to-Dark-Crisis-2022-001-000.jpg",
  "https://zonafantasmanet.files.wordpress.com/2022/09/dark-crisis-2022-001-0001.jpg",
  "https://i.postimg.cc/90BQjk47/Dark-Crisis-Young-Justice-2022-001-000.jpg",
  "https://i.postimg.cc/PrRPfB3W/The-Flash-783-000.jpg",
  "https://i.postimg.cc/ZR9HKrTL/Dark-Crisis-2022-002-000.jpg",
  "https://i.postimg.cc/qRgxfRV3/Dark-Crisis-Worlds-Without-A-Justice-League-2022-Superman-001-000.jpg",
  "https://i.postimg.cc/bvgksZ2s/Dark-Crisis-Young-Justice-2022-002-000.jpg",
  "https://i.postimg.cc/B6X71xQb/The-Flash-784-000.jpg",
  "https://zonafantasmanet.files.wordpress.com/2022/10/dark-crisis-2022-003-000.jpg",
  "https://zonafantasmanet.files.wordpress.com/2022/10/csit-mslj-lv-1a.jpg",
  "https://i.postimg.cc/NfS4jx77/Dark-Crisis-Young-Justice-2022-003-000.jpg",
  "https://zonafantasmanet.files.wordpress.com/2022/10/the-flash-785-000.jpg",
  "https://i.postimg.cc/26FMQvmP/Dark-Crisis-on-Infinite-Earths-2022-004-000.jpg",
  "https://zonafantasmanet.files.wordpress.com/2022/10/dark-crisis-worlds-without-a-justice-league-2022-wonder-woman-001-000.jpg",
  "https://i.postimg.cc/zDFxhCBY/Dark-Crisis-Young-Justice-2022-004-000.jpg",
  "https://i.postimg.cc/SRsZJYmd/The-Flash-786-000.jpg",
  "https://i.imgur.com/5IaYxiI.jpg",
  "https://zonafantasmanet.files.wordpress.com/2022/09/dark-crisis-on-infinite-earths-2022-005-000.jpg",
  "https://i.postimg.cc/WbdBTHpb/Dark-Crisis-Worlds-Without-A-Justice-League-2022-Green-Arrow-001-000.jpg",
  "https://zonafantasmanet.files.wordpress.com/2023/01/dark-crisis-young-justice-2022-005-000.jpg",
  "https://i.postimg.cc/RhRRDC6b/Dark-Crisis-on-Infinite-Earths-2022-006-000.jpg",
  "https://zonafantasmanet.files.wordpress.com/2022/12/dark-crisis-2022-the-dark-army-001-000.jpg",
  "https://i.postimg.cc/YCzVXGZ7/Dark-Crisis-Worlds-Without-A-Justice-League-2022-Batman-001-000.jpg",
  "https://i.postimg.cc/VLBfBmhD/I-Am-Batman-2021-015-000.jpg",
  "https://i.postimg.cc/MGnGTW9L/Dark-Crisis-2022-War-Zone-001-000.jpg",
  "https://i.postimg.cc/Nj2QDFmk/Dark-Crisis-on-Infinite-Earths-2022-Big-Bang-001-000.jpg",
  "https://zonafantasmanet.files.wordpress.com/2022/09/dark-crisis-on-infinite-earths-2022-007-000.jpg"
];

window.DEFAULT_SERIES.push({ id: "series-dc-all-in-2024", name: "DC All In", seriesTitle: "DC All In", originalTitle: "DC All In", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Edição Especial", status: "Cancelada/Finalizada", editions: "01", year: 2024, description: "Seguindo os eventos de Poder Absoluto, os grandes heróis do Universo DC iniciam uma nova era de unidade enquanto Darkseid retorna e uma ameaça ainda maior surge com o Universo Absoluto.", coverUrl: "https://i.postimg.cc/0Nbkkz4X/DCAI1-001.jpg", author: "Vários autores", character: "Universo DC", tags: ["DC All In", "Darkseid", "Universo Absoluto", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-dc-ko-2025", name: "DC K.O.", seriesTitle: "DC K.O.", originalTitle: "DC K.O.", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Evento", status: "Em Andamento", editions: "—", year: 2025, description: "Darkseid renasceu e ninguém está a salvo. Os viajantes do tempo do Universo DC se reúnem para alertar a Liga da Justiça sobre um desastre universal, mas o aviso chega tarde demais.", coverUrl: "https://i.postimg.cc/PrCqCrFV/DCKO1-001.jpg", author: "Scott Snyder / Joshua Williamson / Jorge Jiménez", character: "Liga da Justiça", tags: ["DC K.O.", "Darkseid", "Liga da Justiça", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-challengers-unknown-2025", name: "Desafiadores do Desconhecido", seriesTitle: "Desafiadores do Desconhecido", originalTitle: "Challengers of the Unknown", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Minissérie", status: "Finalizada", editions: "05", year: 2025, description: "Ace Morgan, June Robbins, Prof. Haley, Ruivo Ryan e Rocky Davis, aventureiros vivendo com tempo emprestado, operam a base da Torre de Vigia da Liga da Justiça enquanto enfrentam fendas que ameaçam a galáxia.", coverUrl: "https://i.postimg.cc/28rgZrfL/DdD1-001.jpg", author: "Christopher Cantwell / Sean Izaakse", character: "Desafiadores do Desconhecido", tags: ["Desafiadores do Desconhecido", "Challengers of the Unknown", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-one-star-squadron-2022", name: "Esquadrão Uma Estrela", seriesTitle: "Esquadrão Uma Estrela", originalTitle: "One-Star Squadron", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Minissérie", status: "Cancelada/Terminada", editions: "06", year: 2022, description: "Ser um super-herói é muito legal, mas salvar o dia e combater o crime não paga as contas. Heróis que precisam de dinheiro podem se juntar à HEROZ4U e trabalhar em suas horas extras.", coverUrl: "https://i.imgur.com/kLMcrDN.jpg", author: "Mark Russell / Steve Lieber", character: "Homem-Morcego", tags: ["Esquadrão Uma Estrela", "One-Star Squadron", "DC Comics"] });

const DC_KO_COVERS = ["https://i.postimg.cc/PrCqCrFV/DCKO1-001.jpg", "https://i.postimg.cc/1RqS6qXn/DCKO2-001.jpg", "https://i.postimg.cc/9QJ8mjG4/Sv-C-001.jpg", "https://i.postimg.cc/Xvm1XMVh/Aqv-Gn-001.jpg", "https://i.postimg.cc/CKzcF4nq/MMvs-LB-001.jpg", "https://i.postimg.cc/JhHbxHqm/Cyvs-MP-001.jpg", "https://i.postimg.cc/MpVW61pQ/Arlevs-ZTN-001.jpg", "https://i.postimg.cc/NfKShc4g/Flsvs-LV-001.jpg", "https://i.postimg.cc/4dHdD3JM/LLvs-OD-001.jpg", "https://i.postimg.cc/yxWDRMdD/CVvs-C-001.jpg", "https://i.postimg.cc/XvbSBxMw/DCKO3-001.jpg", "https://i.postimg.cc/J4rxHGNW/DCKOChefoes-001.jpg", "https://i.postimg.cc/sDQZgr95/DCKO4-001.jpg", "https://i.postimg.cc/kM6C41Q7/DCKO5-001.jpg"];
const DC_KO_FILES = ["https://www.mediafire.com/file/4w80qvydmybf2bd/DC_K.O._%252301_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file", "https://www.mediafire.com/file/5ts63mx9glqh9g1/DC_K.O._%252302_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file", "https://www.mediafire.com/file/kewyyczhjtynzpl/DC_K.O._Superman_vs_Capit%25C3%25A3o_%25C3%2581tomo_%25282026%2529_%2528SoQuadrinhos%2529.cbz/file", "https://www.mediafire.com/file/d7de6epbsqi8uy5/DC_K.O._Aquaman_vs_Gavi%25C3%25A3o_Negro_%25282026%2529_%2528SoQuadrinhos%2529.cbz/file", "https://www.mediafire.com/file/ledl84iyuw0mxg6/DC_K.O._Mulher-Maravilha_vs_Lobo_%25282026%2529_%2528SoQuadrinhos%2529.cbz/file", "https://www.mediafire.com/file/kpqn5tx34y8ne7m/DC_K.O._Cyborg_vs_Monstro_do_P%25C3%25A2ntano_%25282026%2529_%2528SoQuadrinhos%2529.cbz/file", "https://www.mediafire.com/file/vre3432o3us4pi6/DC_K.O._Arlequina_vs_Zatanna_%25282026%2529_%2528SoQuadrinhos%2529.cbz/file", "https://www.mediafire.com/file/48d2xkp7vmjpdi8/DC_K.O._Flash_vs_Lanterna_Verde_%25282026%2529_%2528SoQuadrinhos%2529.cbz/file", "https://www.mediafire.com/file/sqrsr3f9u3jz0w8/DC_K.O._Lex_Luthor_vs_O_Dem%25C3%25B4nio_%25282026%2529_%2528SoQuadrinhos%2529.cbz/file", "https://www.mediafire.com/file/pv2w2i5553ej545/DC_K.O._Capuz_Vermelho_vs_Coringa_%25282026%2529_%2528SoQuadrinhos%2529.cbz/file", "https://www.mediafire.com/file/pifcyz5lodc29md/DC_K.O._%252303_%25282026%2529_%2528SoQuadrinhos%2529.cbz/file", "https://www.mediafire.com/file/7s6ma99hvdqwto1/DC_K.O._-_Chef%25C3%25B5es_%252301_%25282026%2529_%2528SoQuadrinhos%2529.cbz/file", "https://www.mediafire.com/file/ybd34v5jn7l88l4/DC_K.O._%252304_%25282026%2529_%2528SoQuadrinhos%2529.cbz/file", "https://www.mediafire.com/file/4whhg7tdcto7v0y/DC_K.O._%252305_%25282026%2529_%2528SoQuadrinhos%2529.cbz/file"];

window.DEFAULT_SERIES.push({ id: "series-fire-ice-smallville-2023", name: "Fogo e Gelo – Bem-vindos a Smallville", seriesTitle: "Fogo e Gelo – Bem-vindos a Smallville", originalTitle: "Fire & Ice: Welcome to Smallville", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Minissérie", status: "Em Andamento", editions: "06", year: 2023, description: "Superman manda a antiga dupla da Liga da Justiça para Smallville depois de uma missão desastrosa. Gelo planeja criar raízes, mas Fogo fará de tudo para voltar ao circuito de super-heróis, até desafiar os maiores vilões do Universo DC para uma luta ao vivo.", coverUrl: "https://i.postimg.cc/SQYgZ9GG/00000.jpg", author: "Joey Esposito / Vasco Georgiev", character: "Fogo e Gelo", tags: ["Fogo e Gelo", "Fire & Ice", "Superman", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-infinite-frontier-2021", name: "Fronteira Infinita", seriesTitle: "Fronteira Infinita", originalTitle: "Infinite Frontier", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Minissérie", status: "Em Andamento", editions: "07", year: 2021, description: "A Mulher-Maravilha, depois de desaparecer na batalha contra o Batman Que Ri, é levada à presença da Quintessência para observar o nascimento do novo multiverso e descobrir o destino de seus amigos e familiares.", coverUrl: "https://zonafantasmanet.files.wordpress.com/2021/03/infinite-frontier-2021-000-000_med.jpg", author: "Joshua Williamson / Xermanico", character: "Mulher-Maravilha", tags: ["Fronteira Infinita", "Infinite Frontier", "Mulher-Maravilha", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-shadow-war-2022", name: "Guerra das Sombras", seriesTitle: "Guerra das Sombras", originalTitle: "Shadow War", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Evento", status: "Cancelada/Finalizada", editions: "09", year: 2022, description: "Ra’s Al Ghul decide se entregar às autoridades, mas é assassinado pelo Exterminador. Talia reúne os agentes de seu pai para caçar o Exterminador, enquanto Batman e Robin tentam descobrir quem realmente puxou o gatilho.", coverUrl: "https://zonafantasmanet.files.wordpress.com/2023/04/shadow-war-alpha-2022-001-000-1.jpg", author: "Joshua Williamson / Howard Porter", character: "Batman", tags: ["Guerra das Sombras", "Shadow War", "Batman", "Exterminador", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-war-earth-3-2022", name: "Guerra pela Terra-3", seriesTitle: "Guerra pela Terra-3", originalTitle: "War for Earth-3", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Evento", status: "Cancelada/Terminada", editions: "05", year: 2022, description: "Os Jovens Titãs, o Flash e o Esquadrão Suicida chegam à Terra-3 para caçar Amanda Waller, que tenta dominar o lar do Sindicato do Crime e destronar as versões malignas dos maiores heróis da DC.", coverUrl: "https://i.postimg.cc/q7SmwJ88/War-for-Earth-3-2022-001-000.jpg", author: "Brandon Vietti / Xermánico", character: "Jovens Titãs", tags: ["Guerra pela Terra-3", "War for Earth-3", "Terra-3", "DC Comics"] });

window.DEFAULT_SERIES.push({ id: "series-poison-ivy-2022", name: "Hera Venenosa", seriesTitle: "Hera Venenosa", originalTitle: "Poison Ivy", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "S\u00e9rie Mensal", status: "Em Andamento", editions: "\u2014", year: 2022, description: "Pamela Isley j\u00e1 foi uma deusa, uma supervil\u00e3, uma ativista, uma cientista e morta. Em um novo corpo e com um senso de prop\u00f3sito renovado, Hera deixa Gotham para completar seu maior trabalho: curar os danos feitos ao mundo eliminando a humanidade.", coverUrl: "https://i.postimg.cc/tJhhWLQj/Poison-Ivy-2022-001-000.jpg", author: "G. Willow Wilson / Marcio Takara", character: "Hera Venenosa", tags: ["Hera Venenosa", "Poison Ivy", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-green-lantern-2023", name: "Lanterna Verde", seriesTitle: "Lanterna Verde", originalTitle: "Green Lantern", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "S\u00e9rie Mensal", status: "Em Andamento", editions: "\u2014", year: 2023, description: "Vindo de Crise Sombria, os Guardi\u00f5es de Oa colocaram em quarentena o Setor 2814, lar da Terra. Ap\u00f3s uma derrota desoladora, Hal Jordan volta para casa para redescobrir suas ra\u00edzes e encontrar o homem respons\u00e1vel por arruinar sua vida: Sinestro.", coverUrl: "https://i.postimg.cc/TYn1MCqn/Green-Lantern-2023-001-000.jpg", author: "Jeremy Adams / Xermanico", character: "Lanterna Verde", tags: ["Lanterna Verde", "Green Lantern", "Hal Jordan", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-green-lantern-2021", name: "Lanterna Verde", seriesTitle: "Lanterna Verde", originalTitle: "Green Lantern", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "S\u00e9rie Mensal", status: "Cancelada/Terminada", editions: "13", year: 2021, description: "Um novo come\u00e7o para os Lanternas Verdes, apresentando uma aventura gal\u00e1ctica da Tropa. Com a maioria dos Lanternas chamados de volta para Oa, John Stewart chega ao lado da Lanterna Jovem Keli Quintela.", coverUrl: "https://zonafantasmanet.files.wordpress.com/2023/05/green-lantern-2021-001-000_med.jpg", author: "Geoffrey Thorne / Dexter Soy", character: "Lanterna Verde", tags: ["Lanterna Verde", "Green Lantern", "John Stewart", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-green-lantern-war-journal-2023", name: "Lanterna Verde \u2013 Di\u00e1rio de Guerra", seriesTitle: "Lanterna Verde \u2013 Di\u00e1rio de Guerra", originalTitle: "Green Lantern \u2013 War Journal", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "S\u00e9rie Mensal", status: "Em Andamento", editions: "\u2014", year: 2023, description: "O tempo de John Stewart como Lanterna Verde chegou ao fim... ou assim ele pensa. Uma trag\u00e9dia familiar o chama de volta para casa, onde uma for\u00e7a aterrorizante ligada a Oa amea\u00e7a tudo ao seu redor.", coverUrl: "https://i.postimg.cc/j5DWy7H8/00000-Recuperado-copiar.jpg", author: "Phillip Kennedy Johnson / Montos", character: "Lanterna Verde", tags: ["Lanterna Verde", "War Journal", "John Stewart", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-justice-league-unlimited-2025", name: "Liga da Justi\u00e7a Sem Limites", seriesTitle: "Liga da Justi\u00e7a Sem Limites", originalTitle: "Justice League Unlimited", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "S\u00e9rie Mensal", status: "Em Andamento", editions: "\u2014", year: 2025, description: "A Liga da Justi\u00e7a est\u00e1 de volta e maior do que nunca. Ap\u00f3s a morte de Darkseid, Superman, Batman e Mulher-Maravilha precisam expandir a Liga para enfrentar um mal incr\u00edvel e descobrir o sucessor do senhor das trevas.", coverUrl: "https://i.imgur.com/iIHPh8I.jpg", author: "Mark Waid / Dan Mora", character: "Liga da Justi\u00e7a", tags: ["Liga da Justi\u00e7a", "Justice League Unlimited", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-justice-godzilla-kong-2023", name: "Liga da Justi\u00e7a vs. Godzilla vs. Kong", seriesTitle: "Liga da Justi\u00e7a vs. Godzilla vs. Kong", originalTitle: "Justice League vs. Godzilla vs. Kong", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Miniss\u00e9rie", status: "Cancelada/Terminada", editions: "14", year: 2023, description: "O evento catacl\u00edsmico do ano coloca o Universo DC contra o Monsterverse da Legendary. Quando Godzilla emerge na ba\u00eda e a barreira entre os mundos se rompe, a Liga da Justi\u00e7a precisa enfrentar Godzilla, Kong e os monstros.", coverUrl: "https://i.ibb.co/xznjbWP/godliga1.jpg", author: "Brian Buccellato / Christian Duce", character: "Liga da Justi\u00e7a", tags: ["Liga da Justi\u00e7a", "Godzilla", "Kong", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-atom-project-2025", name: "Liga da Justi\u00e7a \u2013 O Projeto \u00c1tomo", seriesTitle: "Liga da Justi\u00e7a \u2013 O Projeto \u00c1tomo", originalTitle: "Justice League: The Atom Project", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Mensal", status: "Em Andamento", editions: "\u2014", year: 2025, description: "Na sequ\u00eancia de Poder Absoluto, os superpoderes da Terra est\u00e3o em caos. Ray Palmer e Ryan Choi, os her\u00f3is conhecidos como \u00c1tomo, trabalham para criar um sistema de realoca\u00e7\u00e3o e backup de superpoderes.", coverUrl: "https://i.postimg.cc/Wbgvm6CV/LJPA1-001.jpg", author: "Ryan Parrott / Mike Perkins", character: "\u00c1tomo", tags: ["Liga da Justi\u00e7a", "O Projeto \u00c1tomo", "\u00c1tomo", "DC Comics"] });

const POISON_IVY_FILES = ["da5tl5s7hsnf2v0","gb21qfdk42mmh62","h250j7o38yvh4yl","ccpff48zbhf1lnq","zcdqzb2vmq97i9p","q94g21ee7lrwfke","se74axatlhrzuic","h3eik8ru1l7iyma","zc9qv85wfn4twr6","fpgirn8wabchsil","t379tmtwqlz8mfw","q2a4o30nlz1oyua","riog19wk3ezx58f","zd340ifj8w4uhq3","sxpjdwf4vtfw75v","yeleq3bygmlt4o4","niraxyaee1qtk1w"];
const POISON_IVY_COVERS = ["https://i.postimg.cc/tJhhWLQj/Poison-Ivy-2022-001-000.jpg","https://i.postimg.cc/WbdQf940/Poison-Ivy-2022-002-000.jpg","https://i.postimg.cc/nh7rsrQR/Poison-Ivy-2022-003-000.jpg","https://i.postimg.cc/MT4bg23M/Poison-Ivy-2022-004-000.jpg","https://i.postimg.cc/Kjdt7kCv/Poison-Ivy-2022-005-000.jpg","https://i.postimg.cc/nL5NtWKC/Poison-Ivy-006-0000.jpg","https://i.postimg.cc/8z84dz3c/Poison-Ivy-007-0000.jpg","https://i.postimg.cc/7PNcbJJy/Poison-Ivy-008-000.jpg","https://i.postimg.cc/T1KJR7xq/Poison-Ivy-009-000.jpg","https://i.postimg.cc/LXvGb2Zk/Poison-Ivy-010-000.jpg","https://i.postimg.cc/hvfRCj3z/Poison-Ivy-011-000.jpg","https://i.postimg.cc/fywB0fwm/Poison-Ivy-012-000.jpg","https://i.postimg.cc/x8vPQsfk/Poison-Ivy-013-000.jpg","https://i.ibb.co/yPZRyDL/hera14.jpg","https://zonafantasmanet.files.wordpress.com/2024/01/poison-ivy-015-0000a.jpg","https://i.postimg.cc/yx6M4cFg/Poison-Ivy-016-0000.jpg","https://i.postimg.cc/vTZ7f2hP/Poison-Ivy-2022-17-0000.jpg"];
const makeRecentItems = (seriesId, title, format, files, covers, issues = null) => files.map((file, index) => ({ id: `${seriesId}-${String(index + 1).padStart(2, "0")}`, seriesId, title, issue: issues ? issues[index] : String(index + 1), format, fileUrl: file.startsWith("http") ? file : `https://www.mediafire.com/file/${file}`, coverUrl: covers[index], clicks: 0, featured: true, randomWeight: 5, collectionIds: [] }));

window.DEFAULT_SERIES.push({ id: "series-penguin-2023", name: "Pinguim", seriesTitle: "Pinguim", originalTitle: "The Penguin", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "S\u00e9rie Mensal", status: "Em Andamento", editions: "\u2014", year: 2023, description: "Os neg\u00f3cios de Oswald Cobblepot est\u00e3o em alta, mas uma amea\u00e7a do passado retorna para cobrar uma d\u00edvida. O Pinguim precisar\u00e1 enfrentar seus inimigos e proteger seu imp\u00e9rio em uma Gotham cada vez mais perigosa.", coverUrl: "https://i.postimg.cc/43W4f69V/00000.jpg", character: "Pinguim", tags: ["Pinguim", "The Penguin", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-lazarus-planet-2023", name: "Planeta L\u00e1zaro", seriesTitle: "Planeta L\u00e1zaro", originalTitle: "Lazarus Planet", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Evento", status: "Encerrada", editions: "16", year: 2023, description: "Depois que a Ilha L\u00e1zaro explode, uma tempestade de poderes e magia atinge o mundo. Os her\u00f3is da DC precisam se unir para sobreviver ao caos e impedir que a amea\u00e7a transforme o planeta para sempre.", coverUrl: "https://i.postimg.cc/YSpm7P2T/Lazarus-Planet-2023-Alpha-001-000.jpg", character: "Universo DC", tags: ["Planeta L\u00e1zaro", "Lazarus Planet", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-power-girl-special-2023", name: "Poderosa Especial", seriesTitle: "Poderosa Especial", originalTitle: "Power Girl Special", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "One-Shot", status: "Cancelada/Terminada", editions: "01", year: 2023, description: "Durante os eventos de Planeta L\u00e1zaro, a Poderosa desperta novos poderes e precisa aprender a control\u00e1-los com a ajuda do Senhor Destino, enquanto uma hist\u00f3ria complementar apresenta Fogo e Gelo.", coverUrl: "https://i.ibb.co/LddHW6n/Pdrs01-001.jpg", character: "Poderosa", tags: ["Poderosa", "Power Girl", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-absolute-power-2024", name: "Poder Absoluto", seriesTitle: "Poder Absoluto", originalTitle: "Absolute Power", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Evento", status: "Em Andamento", editions: "04", year: 2024, description: "Os her\u00f3is da DC est\u00e3o sem poderes e a Trindade do Mal venceu. Amanda Waller lan\u00e7a seu plano para roubar os poderes dos metahumanos e colocar o destino do mundo sob seu controle.", coverUrl: "https://static.dc.com/2024-06/AP_Cv1_00111_DIGITAL-1.jpg", character: "Liga da Justi\u00e7a", tags: ["Poder Absoluto", "Absolute Power", "Amanda Waller", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-monkey-prince-2022", name: "Pr\u00edncipe Macaco", seriesTitle: "Pr\u00edncipe Macaco", originalTitle: "Monkey Prince", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Miniss\u00e9rie", status: "Em Andamento", editions: "12", year: 2022, description: "Marcus Sun foi criado por dois mercen\u00e1rios e sempre soube que havia algo estranho em sua origem. Quando um homem misterioso parecido com um porco surge em sua vida, Marcus descobre uma liga\u00e7\u00e3o com a Jornada ao Oeste e poderes capazes de assumir 72 formas diferentes.", coverUrl: "https://i.postimg.cc/8CGj1nnr/Monkey-Prince-000-000.jpg", character: "Pr\u00edncipe Macaco", tags: ["Pr\u00edncipe Macaco", "Monkey Prince", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-question-watchtower-2024", name: "Quest\u00e3o \u2013 Ao Longo da Torre de Vigil\u00e2ncia", seriesTitle: "Quest\u00e3o \u2013 Ao Longo da Torre de Vigil\u00e2ncia", originalTitle: "The Question: All Along the Watchtower", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Miniss\u00e9rie", status: "Encerrado", editions: "06", year: 2024, description: "Depois de Poder Absoluto, Renee Montoya assume seu lugar na Torre de Vigil\u00e2ncia da Liga da Justi\u00e7a. Mas uma conspira\u00e7\u00e3o est\u00e1 se formando dentro da equipe, e a nova Quest\u00e3o precisa descobrir em quem pode confiar.", coverUrl: "https://i.imgur.com/rLwWL2d.jpg", character: "Quest\u00e3o", tags: ["Quest\u00e3o", "The Question", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-robin-2021", name: "Robin", seriesTitle: "Robin", originalTitle: "Robin", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "S\u00e9rie Mensal", status: "Encerrada", editions: "17", year: 2021, description: "Damian Wayne viaja pelo mundo para participar do torneio da Liga de L\u00e1zaro e enfrentar alguns dos assassinos mais perigosos do planeta. Para sobreviver, ele ter\u00e1 de descobrir a verdade sobre sua fam\u00edlia e sobre si mesmo.", coverUrl: "https://zonafantasmanet.files.wordpress.com/2021/05/robin-2021-001-000_med.jpg", character: "Robin", tags: ["Robin", "Damian Wayne", "DC Comics"] });

const POWER_GIRL_SPECIAL_ITEMS = makeRecentItems("series-power-girl-special-2023", "Poderosa Especial", "cbr", ["g63qy5rbhkxyda1/", "s91jmnefw5p1gyd", "7xo7q7g52u98x2i", "lhplykhtebgbz91/"], ["https://i.ibb.co/F30x8th/Lazarus-Planet-2023-Assault-on-Krypton-001-000.jpg", "https://i.postimg.cc/jdZxmj2L/Action-Comics-1051-000.jpg", "https://i.postimg.cc/N0Hcphc9/Action-Comics-1052-000.jpg", "https://i.ibb.co/LddHW6n/Pdrs01-001.jpg"]);
POWER_GIRL_SPECIAL_ITEMS[3].volume = "Volume 1";
POWER_GIRL_SPECIAL_ITEMS[3].volumeTitle = "Poderosa Especial";
POWER_GIRL_SPECIAL_ITEMS[3].issue = "01";
POWER_GIRL_SPECIAL_ITEMS[0].volume = "Volume 2";
POWER_GIRL_SPECIAL_ITEMS[0].volumeTitle = "Prel\u00fadio: Ataque a Krypton";
POWER_GIRL_SPECIAL_ITEMS[0].issue = "Prel\u00fadio";
POWER_GIRL_SPECIAL_ITEMS[1].volume = "Volume 3";
POWER_GIRL_SPECIAL_ITEMS[1].volumeTitle = "Hist\u00f3rias complementares";
POWER_GIRL_SPECIAL_ITEMS[1].issue = "Action Comics #1051";
POWER_GIRL_SPECIAL_ITEMS[2].volume = "Volume 3";
POWER_GIRL_SPECIAL_ITEMS[2].volumeTitle = "Hist\u00f3rias complementares";
POWER_GIRL_SPECIAL_ITEMS[2].issue = "Action Comics #1052";

window.DEFAULT_LIBRARY_RECENT_ADDITIONS = [
  ...makeRecentItems("series-penguin-2023", "Pinguim", "cbr", ["uqs7ly0c60nxjkq"], ["https://i.postimg.cc/43W4f69V/00000.jpg"]),
  ...makeRecentItems("series-lazarus-planet-2023", "Planeta L\u00e1zaro", "cbr", ["ite9zprqlpp7h2w", "d91f1qnx43q61k0", "g63qy5rbhkxyda1/", "qp43ih7ch2dos91", "rm95p392tpotm2p", "sd99608la9baxdr", "fer97f7n8mx0uz1", "avfoctt64nbtv3u", "qmwki7ymy38hul8", "ryfmnkqu9cdkppf"], ["https://i.postimg.cc/YSpm7P2T/Lazarus-Planet-2023-Alpha-001-000.jpg", "https://i.postimg.cc/NG45RZ0s/Monkey-Prince-010-000.jpg", "https://i.ibb.co/F30x8th/Lazarus-Planet-2023-Assault-on-Krypton-001-000.jpg", "https://i.postimg.cc/Zn2cgtnR/Lazarus-Planet-2023-We-Once-Were-Gods-001-000-copiar.jpg", "https://zonafantasmanet.files.wordpress.com/2023/10/lazarus-planet-2023-legends-reborn-001-000a.jpg", "https://i.postimg.cc/tCFWg2BY/Lazarus-Planet-2023-Next-Evolution-001-000-copiar.jpg", "https://zonafantasmanet.files.wordpress.com/2023/10/monkey-prince-011-000a.jpg", "https://i.postimg.cc/BQtHm4YQ/Lazarus-Planet-2023-Dark-Fate-001-000.jpg", "https://zonafantasmanet.files.wordpress.com/2023/10/lazarus-planet-2023-omega-001-000a.jpg", "https://i.postimg.cc/fbPSnsm2/Batman-vs-Robin-2022-005-000.jpg"], ["Planeta L\u00e1zaro: Alfa", "Pr\u00edncipe Macaco #10", "Ataque a Krypton", "We Once Were Gods", "Legends Reborn", "Next Evolution", "Pr\u00edncipe Macaco #11", "Dark Fate", "Planeta L\u00e1zaro: \u00d4mega", "Batman vs Robin #05"]),
  ...[POWER_GIRL_SPECIAL_ITEMS[3], POWER_GIRL_SPECIAL_ITEMS[0], POWER_GIRL_SPECIAL_ITEMS[1], POWER_GIRL_SPECIAL_ITEMS[2]],
  ...makeRecentItems("series-absolute-power-2024", "Poder Absoluto", "cbr", ["exd7b3q5yip4joa/", "80zf1o7aqrp77wk/Poder_Absoluto_2024_%252302_%2528SoQuadrinhos%2529.cbr/file", "7kf5kriz4tey2wq/Poder_Absoluto_%252303%25282024%2529.cbr/file", "sunvxon5dx7utib/"], ["https://static.dc.com/2024-06/AP_Cv1_00111_DIGITAL-1.jpg", "https://static.dc.com/2024-07/AP_Cv2_00211_DIGITAL.jpg", "https://static.dc.com/2024-09/AP_Cv3_00311_DIGITAL.jpg", "https://static.dc.com/2024-09/AP_Cv4_00411_DIGITAL.jpg"]),
  ...makeRecentItems("series-monkey-prince-2022", "Pr\u00edncipe Macaco", "cbr", ["fq982ge624gb1u2", "3grc0ckrjpmgav3", "701jhz2lkgkfkog", "g7cudm9jzhzqtbf", "ma6cqu4e0loaib8", "k3uzc9xez33bg1o", "hp2lke7mi0i7t87", "5dyd30jjjfr9pop", "e3v4f9l8jtra9uf", "8cwufgr4ev6heab", "d91f1qnx43q61k0", "fer97f7n8mx0uz1"], ["https://i.postimg.cc/8CGj1nnr/Monkey-Prince-000-000.jpg", "https://i.postimg.cc/xdGgGrnR/Monkey-Prince-001-000.jpg", "https://i.postimg.cc/rskrfJgB/Monkey-Prince-2022-002-000.jpg", "https://zonafantasmanet.files.wordpress.com/2023/03/monkey-prince-2022-003-000a.jpg", "https://i.postimg.cc/8ccQLjwZ/Monkey-Prince-2022-004-000.jpg", "https://zonafantasmanet.files.wordpress.com/2023/04/monkey-prince-2022-005-000.jpg", "https://i.postimg.cc/K8Y98pFB/Monkey-Prince-2022-006-000.jpg", "https://i.postimg.cc/wTSnKGwj/Monkey-Prince-2022-007-000.jpg", "https://i.postimg.cc/3wqWd2PZ/Monkey-Prince-008-0000.jpg", "https://i.postimg.cc/9FC6y6kQ/Monkey-Prince-009-0000.jpg", "https://i.postimg.cc/NG45RZ0s/Monkey-Prince-010-000.jpg", "https://zonafantasmanet.files.wordpress.com/2023/10/monkey-prince-011-000a.jpg"]),
  ...makeRecentItems("series-question-watchtower-2024", "Quest\u00e3o \u2013 Ao Longo da Torre de Vigil\u00e2ncia", "cbr", ["https://mega.nz/file/TEYjBDaZ#ZRv1wYj8gT36fSCg3wCpmJkE0CCZCN2e1SzGqH6306s", "https://mega.nz/file/6NwykD7J#mP5dvPJ56YKStzEyIj0miOfR6XQImBV4toBNiSlJDW4", "https://mega.nz/file/rYB1HCYI#9kESUp8pIC96pn9Fti-15L8k_0rWzhN2y8jdJ-3XcAI", "https://mega.nz/file/LJZTCQTa#ZOL9jQhBos_GnU8T3Lzcmzik5tJtWgT_d6rVNf7UbDg", "https://mega.nz/file/OFBSwKjD#VRoB94WvwVg6R4OaAyuUvZ52NCylhPon8iDAJcWZkP0", "https://mega.nz/file/2MhABDbb#jBomKfvoLbnZh5k-zwqQH3KcJgmENdZzOkoZ7RD4tuw"], ["https://i.imgur.com/rLwWL2d.jpg", "https://i.imgur.com/GfJDZRk.jpg", "https://i.imgur.com/qCEcRZs.jpg", "https://i.imgur.com/ZZPXsdv.jpg", "https://i.imgur.com/zbp4H9v.jpg", "https://i.imgur.com/YGSJk6P.jpg"]),
  ...makeRecentItems("series-robin-2021", "Robin", "cbr", ["sl1vnegrqrclha7", "o7wqehlqgf8qdfn", "y85gdw0mp4ygkg1", "qxqzmo05hpdhb83", "q51ggtxyh7ltm0w", "nqy5rtwacmvhlcj", "61qpa99k1usmtsw", "m8yc48gc787sd3p", "6q5vin5t8lj7pc7", "kvzammvcwaneuw4", "z0fcscn8hfdoirb", "sk3m0hoxjla71j9", "jblcv0docol0qs6", "zivrfxjx32laa53", "a5i238gji2rgpwi"], ["https://zonafantasmanet.files.wordpress.com/2021/05/robin-2021-001-000_med.jpg", "https://zonafantasmanet.files.wordpress.com/2021/09/robin-2021-002-000_med.jpg", "https://zonafantasmanet.files.wordpress.com/2021/12/robin-2021-003-000_med.jpg", "https://zonafantasmanet.files.wordpress.com/2022/05/robin-2021-004-000_med.jpg", "https://zonafantasmanet.files.wordpress.com/2022/05/robin-2021-005-000_med.jpg", "https://i.postimg.cc/cCX5mPYV/Robin-2021-006-000.jpg", "https://i.postimg.cc/cL39B5cC/Robin-2021-007-000.jpg", "https://i.postimg.cc/3rX4Vfrb/Robin-2021-008-000.jpg", "https://i.postimg.cc/kXfb0JnX/Robin-2021-009-000.jpg", "https://i.postimg.cc/vmC9CHPD/Robin-2021-010-000.jpg", "https://i.postimg.cc/fTkVBYvD/Robin-2021-011-000.jpg", "https://i.postimg.cc/MHvM60BY/Robin-2021-012-000.jpg", "https://i.postimg.cc/hPXT5CHG/Robin-2021-013-000.jpg", "https://i.postimg.cc/6pNDx4Fy/Robin-2021-014-000.jpg", "https://zonafantasmanet.files.wordpress.com/2023/03/robin-2021-annual-2021-001-000.jpg"], ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "Anual"]),
];

window.DEFAULT_SERIES.push({ id: "series-wonder-girl-2021", name: "Mo\u00e7a-Maravilha", seriesTitle: "Mo\u00e7a-Maravilha", originalTitle: "Wonder Girl", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "S\u00e9rie Mensal", status: "Cancelada/Terminada", editions: "07", year: 2021, description: "A hist\u00f3ria de Yara Flor come\u00e7a aqui. Criada na terra distante de Boise, Idaho, Yara sempre sentiu que algo estava faltando em sua vida e agora vai ao Brasil descobrir o que \u00e9, desencadeando eventos que mudar\u00e3o o mundo da Mulher-Maravilha.", coverUrl: "https://comicvine.gamespot.com/a/uploads/original/6/67663/7973709-01.jpg", author: "Jo\u00eblle Jones", character: "Mo\u00e7a-Maravilha", tags: ["Mo\u00e7a-Maravilha", "Wonder Girl", "Yara Flor", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-wonder-woman-2023", name: "Mulher-Maravilha", seriesTitle: "Mulher-Maravilha", originalTitle: "Wonder Woman", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Mensal", status: "Em Andamento", editions: "\u2014", year: 2023, description: "Depois que uma misteriosa amazona \u00e9 acusada de assassinato em massa, o Congresso dos Estados Unidos aprova uma lei que impede as amazonas de pisarem no pa\u00eds. Em busca da verdade, a Mulher-Maravilha se torna uma fora-da-lei no mundo que jurou proteger.", coverUrl: "https://i.postimg.cc/Zn54HP6d/00000.jpg", author: "Tom King / Daniel Sampere", character: "Mulher-Maravilha", tags: ["Mulher-Maravilha", "Wonder Woman", "Diana Prince", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-we-are-yesterday-2025", name: "N\u00f3s Somos o Passado", seriesTitle: "N\u00f3s Somos o Passado", originalTitle: "We Are Yesterday", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Evento", status: "Encerrada", editions: "06", year: 2025, description: "O primeiro evento da fase All In est\u00e1 aqui. Batman e Superman s\u00e3o pressionados pelos poderes ps\u00edquicos do sinistro Gorila Grodd, que parece ter conhecimento do futuro. Enquanto isso, a Liga da Justi\u00e7a enfrenta as consequ\u00eancias da morte de Darkseid.", coverUrl: "https://i.imgur.com/bWQIL4g.jpg", author: "Mark Waid / Travis Moore / Clayton Henry", character: "Batman e Superman", tags: ["N\u00f3s Somos o Passado", "We Are Yesterday", "Gorila Grodd", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-nubia-amazons-2021", name: "N\u00fabia e as Amazonas", seriesTitle: "N\u00fabia e as Amazonas", originalTitle: "Nubia & the Amazons", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Miniss\u00e9rie", status: "Cancelada/Terminada", editions: "06", year: 2021, description: "Depois dos eventos de Fronteira Infinita, N\u00fabia se torna rainha de Themyscira. Com a chegada inesperada de novas amazonas, ela precisa acertar as contas com o passado e forjar um novo caminho para suas irm\u00e3s.", coverUrl: "https://comicvine.gamespot.com/a/uploads/original/6/67663/8205636-01.jpg", author: "Vita Ayala / Stephanie Williams", character: "N\u00fabia", tags: ["N\u00fabia e as Amazonas", "Nubia & the Amazons", "Amazonas", "DC Comics"] });

window.DEFAULT_SERIES.push({ id: "series-new-gods-2025", name: "Os Novos Deuses", seriesTitle: "Os Novos Deuses", originalTitle: "The New Gods", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Miniss\u00e9rie", status: "Finalizada", editions: "12", year: 2025, description: "Um Deus antigo morreu, e as reverbera\u00e7\u00f5es de sua partida atravessam o universo, enviando soldados de um ex\u00e9rcito intergal\u00e1ctico e despertando os poderes latentes de uma crian\u00e7a misteriosa na Terra. Enquanto Metron leva a profecia para Novo G\u00eaneses e Apokolips, os mundos mergulham no caos, enquanto Scott Free e Barda enfrentam o desafio da paternidade.", coverUrl: "https://i.postimg.cc/SQ1pd9Lh/ND1-001.jpg", author: "Ram V / Evan Cagle", character: "Scott Free", tags: ["Os Novos Deuses", "The New Gods", "Scott Free", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-trial-amazons-2022", name: "O Julgamento das Amazonas", seriesTitle: "O Julgamento das Amazonas", originalTitle: "Trial of the Amazons", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Evento", status: "Cancelada/Terminada", editions: "11", year: 2022, description: "Hip\u00f3lita e N\u00fabia se preocupam com a vis\u00e3o de destrui\u00e7\u00e3o de Pen\u00e9lope e preparam um torneio para decidir a nova campe\u00e3 do Portal da Perdi\u00e7\u00e3o. A chegada de novas tribos de Amazonas aumenta as tens\u00f5es, at\u00e9 que uma trag\u00e9dia muda o futuro de Themyscira.", coverUrl: "https://i.imgur.com/Zi5RaFD.jpg", author: "Vita Ayala / Stephanie Williams / Jo\u00eblle Jones", character: "Mulher-Maravilha", tags: ["O Julgamento das Amazonas", "Trial of the Amazons", "Amazonas", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-swamp-thing-2021", name: "O Monstro do P\u00e2ntano", seriesTitle: "O Monstro do P\u00e2ntano", originalTitle: "The Swamp Thing", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Miniss\u00e9rie", status: "Em Andamento", editions: "16", year: 2021, description: "O Monstro do P\u00e2ntano retorna em uma nova s\u00e9rie estrelada por Levi Kamei, o pr\u00f3ximo Guardi\u00e3o do Verde. Incapaz de controlar sua transforma\u00e7\u00e3o, Levi precisa investigar assassinatos cometidos por uma lenda sobrenatural do deserto e enfrentar um novo vil\u00e3o.", coverUrl: "https://i.imgur.com/yWOZXir.jpg", author: "Ram V / Mike Perkins", character: "Monstro do P\u00e2ntano", tags: ["O Monstro do P\u00e2ntano", "The Swamp Thing", "Levi Kamei", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-next-batman-second-son-2021", name: "O Novo Batman: Segundo Filho", seriesTitle: "O Novo Batman: Segundo Filho", originalTitle: "The Next Batman: Second Son", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Miniss\u00e9rie", status: "Cancelada/Terminada", editions: "12", year: 2021, description: "Tim Fox se tornou o Batman do Futuro, mas como foi sua jornada at\u00e9 se tornar o Cavaleiro das Trevas? Descubra a hist\u00f3ria do novo Batman antes de assumir o manto em Gotham City.", coverUrl: "https://comicvine.gamespot.com/a/uploads/original/6/67663/7824353-01.jpg", author: "John Ridley / Tony S. Daniel", character: "Batman", tags: ["O Novo Batman", "Segundo Filho", "The Next Batman", "DC Comics"] });

window.DEFAULT_SERIES.push({ id: "series-shazam-2023", name: "Shazam!", seriesTitle: "Shazam!", originalTitle: "Shazam!", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "S\u00e9rie Mensal", status: "Encerrada", editions: "21", year: 2023, description: "Os melhores criadores do mundo apresentam o Mortal Mais Poderoso do Mundo em uma deslumbrante s\u00e9rie solo, com amea\u00e7as estranhas e selvagens de todo o Universo DC.", coverUrl: "https://i.postimg.cc/mZyJPjQf/Shazam-2023-001-000-copiar.jpg", character: "Shazam", tags: ["Shazam!", "Billy Batson", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-shazam-2021", name: "Shazam!", seriesTitle: "Shazam!", originalTitle: "Shazam!", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Miniss\u00e9rie", status: "Cancelada/Terminada", editions: "04", year: 2021, description: "A hist\u00f3ria segue os eventos que ocorreram na revista Academia Jovens Tit\u00e3s.", coverUrl: "https://comicvine.gamespot.com/a/uploads/original/6/67663/8069718-01.jpg", character: "Shazam", tags: ["Shazam!", "Billy Batson", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-justice-society-2023", name: "Sociedade da Justi\u00e7a da Am\u00e9rica", seriesTitle: "Sociedade da Justi\u00e7a da Am\u00e9rica", originalTitle: "Justice Society of America", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "S\u00e9rie Mensal", status: "Encerrada", editions: "12", year: 2023, description: "Um her\u00f3i h\u00e1 muito perdido da SJA cai em nossa era com um aviso muito grave, mas \u00e9 tarde demais. Um inimigo misterioso invadiu a hist\u00f3ria inteira da SJA e uma nova equipe precisa se reunir para derrot\u00e1-lo.", coverUrl: "https://i.imgur.com/1fygqEb.jpg", character: "Sociedade da Justi\u00e7a", tags: ["Sociedade da Justi\u00e7a", "Justice Society of America", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-stargirl-lost-children-2022", name: "Stargirl", seriesTitle: "Stargirl", originalTitle: "Stargirl: The Lost Children", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Miniss\u00e9rie", status: "Em Andamento", editions: "07", year: 2022, description: "Courtney Whitmore e seu padrasto, Pat Dugan, se juntam aos Sete Soldados da Vit\u00f3ria para descobrir o segredo do oitavo Soldado e o paradeiro de jovens her\u00f3is perdidos.", coverUrl: "https://i.imgur.com/gzfvoqH.jpg", character: "Stargirl", tags: ["Stargirl", "The Lost Children", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-superboy-tomorrow-2023", name: "Superboy \u2013 O Homem do Amanh\u00e3", seriesTitle: "Superboy \u2013 O Homem do Amanh\u00e3", originalTitle: "Superboy: The Man of Tomorrow", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Miniss\u00e9rie", status: "Em Andamento", editions: "06", year: 2023, description: "Depois de Crise Sombria, Conner Kent se sente deslocado da Fam\u00edlia Superman. Ele parte para as estrelas em busca de um caminho pr\u00f3prio e de uma nova voca\u00e7\u00e3o como her\u00f3i.", coverUrl: "https://i.postimg.cc/Xvyy6yzF/Superboy-The-Man-of-Tomorrow-001-0000.jpg", character: "Superboy", tags: ["Superboy", "The Man of Tomorrow", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-superman-lost-2023", name: "Superman \u2013 Perdido", seriesTitle: "Superman \u2013 Perdido", originalTitle: "Superman: Lost", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Miniss\u00e9rie", status: "Cancelada/Terminada", editions: "10", year: 2023, description: "Superman atende a um chamado da Liga da Justi\u00e7a e \u00e9 sugado por uma estranha energia. Para seus colegas foram apenas algumas horas, mas para Clark foram vinte anos de sua vida.", coverUrl: "https://i.imgur.com/sAUqRtn.jpg", character: "Superman", tags: ["Superman Perdido", "Superman: Lost", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-superman-2023", name: "Superman", seriesTitle: "Superman", originalTitle: "Superman", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "S\u00e9rie Mensal", status: "Em Andamento", editions: "\u2014", year: 2023, description: "Superman voltou para Metr\u00f3polis e Lex Luthor est\u00e1 atr\u00e1s das grades. Enquanto Clark se ajusta \u00e0 sua vida, novos inimigos surgem das sombras para atacar o Homem de A\u00e7o.", coverUrl: "https://i.postimg.cc/mrhWLq87/Superman-2023-001-000a.jpg", character: "Superman", tags: ["Superman", "Clark Kent", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-superman-son-kal-el-2021", name: "Superman: Filho de Kal-El", seriesTitle: "Superman: Filho de Kal-El", originalTitle: "Superman: Son of Kal-El", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "S\u00e9rie Mensal", status: "Cancelada/Terminada", editions: "18", year: 2021, description: "Jonathan Kent assume a capa do pai e carrega o s\u00edmbolo de esperan\u00e7a do Superman, enquanto tenta descobrir seu pr\u00f3prio caminho como her\u00f3i.", coverUrl: "https://zonafantasmanet.files.wordpress.com/2023/03/superman-son-of-kal-el-2021-001-000_med.jpg", character: "Superman", tags: ["Superman", "Filho de Kal-El", "Jonathan Kent", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-superman-kal-el-returns-2022", name: "Superman: O Retorno de Kal-El", seriesTitle: "Superman: O Retorno de Kal-El", originalTitle: "Superman: Kal-El Returns", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Evento", status: "Cancelado/Encerrado", editions: "07", year: 2022, description: "Depois de meses no Mundo B\u00e9lico, Superman retorna \u00e0 Terra e reencontra sua superfam\u00edlia, mas novos problemas surgem com a queda do Mundo B\u00e9lico.", coverUrl: "https://imgur.com/bHWJHqv.jpg", character: "Superman", tags: ["Superman", "O Retorno de Kal-El", "DC Comics"] });

const MORE_RECENT_ITEMS = [
  ...makeRecentItems("series-shazam-2023", "Shazam!", "cbr", ["81mo7mio2l3fn6o", "4c5hz8d96ygmbxe", "qxxvi8qbts3hsbg", "ott0zs5u6wo55q", "f4f7vqcfjbgqas3/", "lwpufz1fj6g3dhc/", "zsk55avj7lrojj1/", "https://mega.nz/file/zYoiXQwZ#lXoAyuz53kUhLVrgHgAJGssNzqaJdvTSLUREPQ-l17s", "https://mega.nz/file/jUJnQAZD#YE73lkM5Dmn1owhxMWcQj_f32gj2p1jJ8soMGTNeQ-c", "https://mega.nz/file/KNoQBD4B#yoemAgdxurHe5ylf9DbBAc515hzsLZ6wKG-SR3rOySM", "https://mega.nz/file/ndASDI5Y#CxhPDE65iZIoJDuJNm9jAYAPVYmgrZUaNzGXHeoAEr4", "https://mega.nz/file/eRwQhLaI#bNskhxgx7dAoHvYYhMAPfkkQefCUUKibL2el0WAl1uQ", "https://mega.nz/file/bMhDgSDI#_pz2IHZV29ymRt1rp8D4XmuBFpB5J784TGJqzv5sCsY", "https://mega.nz/file/eIQCnTra#jkKk6hlvRXbVOgM-W-1X3uczu3nz0xBsjCl6V_gVZOc", "https://mega.nz/file/vIxEHISK#1CsYhRW7SO-rVJyx2ypnoq5Z35JiYL_170fEWC0MexI", "https://mega.nz/file/Sd5GDQaA#3JnZLtwRUPw1CrN1TLLFO43aC2QSzpscTC5ZSwhW9nE", "https://mega.nz/file/mIYQ0YKZ#4f5V39ZBA3dRimKF3UuS2xtP-Qr8r0oxQ_j_Rbm1pqA", "https://mega.nz/file/2UxTSbwS#oGKRsPdIqgb57E9aKsjwoH8_c7QsJ95Cjg6zTQmq8Bw", "https://mega.nz/file/WdpyRSKR#TKNpdijG13v_Va5uFlazCuPPdcprMdqNLvZEImQzSi4", "https://mega.nz/file/mVQgARpC#xDJnHRwOAgh_OyR3SJ7PPcOsaZVs69XTyBT1As3DRkY", "https://mega.nz/file/fdgzQLZC#3fIpa-l8JOBjbXkzg-_vlhjOoJdGJ1XQk4RU1IR-pyE"], ["https://static.dc.com/2023-04/SHAZAM%21_Cv1_00011_DIGITAL.jpg", "https://static.dc.com/2023-05/SHAZAM%21_Cv2_00211_DIGITAL.jpg", "https://i.postimg.cc/cCrP8HyW/00000-copiar.jpg", "https://zonafantasmanet.wordpress.com/wp-content/uploads/2024/01/shazam-004-0000a.jpg", "https://zonafantasmanet.wordpress.com/wp-content/uploads/2024/08/shazam_2023_005-000a.jpg", "https://zonafantasmanet.wordpress.com/wp-content/uploads/2024/11/shazam_006-000a.jpg", "https://zonafantasmanet.wordpress.com/wp-content/uploads/2024/11/shazam_007-000a.jpg", "https://i.imgur.com/5JKx49C.jpg", "https://i.imgur.com/dJWkzOt.jpg", "https://i.imgur.com/NsGlJs5.jpg", "https://i.ibb.co/jvr2G7n0/shazam11.jpg", "https://i.ibb.co/mC3mw4Tf/shazam12.jpg", "https://i.ibb.co/BVwpBpnF/shazam13.jpg", "https://i.ibb.co/9kd8SLmM/shazam14.jpg", "https://i.ibb.co/6cqPPmcX/shazam15.jpg", "https://i.ibb.co/JFxYvXhm/shazam16.jpg", "https://i.ibb.co/3YVSwCVs/shazam17.jpg", "https://i.ibb.co/1YJbPyXf/shazam18.jpg", "https://i.ibb.co/B5H2VRFx/shazam19.jpg", "https://i.ibb.co/B5sYw8hz/shazam20.jpg", "https://i.ibb.co/8Df2pWR2/shazam21.jpg"]),
  ...makeRecentItems("series-shazam-2021", "Shazam!", "cbr", ["fwc7btdwawwblqo/", "gx50kpi9kh2gm3u/", "5nof9yuvj9ygudv", "jwttlmbb8x2krd7/"], ["https://comicvine.gamespot.com/a/uploads/original/6/67663/8069718-01.jpg", "https://i.imgur.com/b9wfa8Q.jpg", "https://zonafantasmanet.files.wordpress.com/2022/05/shazam-2021-003-000.jpg", "https://zonafantasmanet.files.wordpress.com/2022/05/shazam-2021-004-000.jpg"]),
  ...makeRecentItems("series-justice-society-2023", "Sociedade da Justi\u00e7a da Am\u00e9rica", "cbr", ["q94vd6joujd2tkr", "mdz4mtrf1av3cbo", "z1mwoswefeuxe5y", "99tsoykz4tjohjq", "https://mega.nz/file/DFRQkIbR#YFCPPv0e2USvw2mJt5MMNczf2x_GHy56mqh1NJcc57g", "https://mega.nz/file/SRxCVJaa#y4LZfhysjXvYBt8afS_v-gdRo_0qxJQM_SzNAbgRjc0", "https://mega.nz/file/SZAjDI7b#3htNjwmVdQOVDhEsjfz603Ltsf5DCpKPy3updc0KSGg", "https://mega.nz/file/KAgBnarL#22B32ivz19AzJIw4HE3ZQEVpvF0fqxdvcybLc5-wXbI", "https://mega.nz/file/yMgyCRAQ#1s3QlTh1Mg-1rBNyOqtgIfHslPZUCxLIQJyG5duF5wA", "https://mega.nz/file/TBp0zBSC#x85p2vNN4qTyw3kAWUQOq9VS2_BPip_jE8sOYxvVePE", "https://mega.nz/file/vVQxELgB#sopBGeR0e0C42PKG11YmtszOVdiCJzYkVe3d7GNA8fs", "https://mega.nz/file/rZ5lVKIR#hSm_KbXaBwOY-C9qeeC_W7_PFYC6HtRFLyS7gKGpsj0"], ["https://static.dc.com/dc/files/default_images/JSA_Cv1_00111_DIGITAL_6378342f7fe1b9.41750128.jpg", "https://static.dc.com/dc/files/default_images/JSA_Cv2_00211_DIGITAL_63be1dbf4074e4.56535558.jpg", "https://static.dc.com/2023-03/JSA_Cv3_00311_DIGITAL.jpg", "https://static.dc.com/2023-04/JSA_Cv4_00411_DIGITAL.jpg", "https://static.dc.com/2023-07/JSA_Cv5_00511_DIGITAL_0.jpg", "https://static.dc.com/2023-08/JSA_Cv6_00611_DIGITAL.jpg", "https://static.dc.com/2023-11/JSA_Cv7_00711_DIGITAL.jpg", "https://static.dc.com/2024-02/JSATNGA_v1%20%28COVER%29.jpg", "https://static.dc.com/2024-02/JSA_Cv9_00911_DIGITAL.jpg", "https://static.dc.com/2024-05/JSA_Cv10_01011_DIGITAL.jpg", "https://static.dc.com/2024-09/JSA_Cv11_01111_DIGITAL.jpg", "https://static.dc.com/2024-09/JSA_Cv12_01211_DIGITAL.jpg"]),
  ...makeRecentItems("series-stargirl-lost-children-2022", "Stargirl", "cbr", ["4ebtkhgruwr9x5j", "o0k7fieacumpwl0/", "k8qylhj5r5a8yu5/Stargirl_-_As_Crian%25C3%25A7as_Perdidas_%252302_%2528de_06%2529_%25282023%2529_%2528SQ-ZF%2529.cbr/file"], ["https://static.dc.com/dc/files/default_images/SGTLC_Cv1_00111_DIGITAL_635b18d4d6d074.15503217.jpg", "https://static.dc.com/dc/files/default_images/SGTLC_Cv2_00211_DIGITAL_639383b9151fd9.02951029.jpg", "https://static.dc.com/dc/files/default_images/SGTLC_Cv3_00311_DIGITAL_63be1ad12f3461.81843079.jpg"]),
  ...makeRecentItems("series-superboy-tomorrow-2023", "Superboy \u2013 O Homem do Amanh\u00e3", "cbr", ["ggga5iftraaog8u", "cm5fy7hifjx82vd", "67t36c27yh5j1t9", "q0klen1ri2f2uxk"], ["https://static.dc.com/2023-04/dc_cv_Superboy_The_Man_Of_Tomorrow_1.jpg", "https://static.dc.com/2023-05/superboyMOT_cv2.jpg", "https://static.dc.com/2023-06/Superboy-The-Man-of-Tomorrow-cv3.jpg", "https://static.dc.com/2023-07/superboy_mot_cv4.jpg"]),
  ...makeRecentItems("series-superman-lost-2023", "Superman \u2013 Perdido", "cbr", ["8etxox027i1xl20/", "cao4q7dsqmczf6h/", "t6x1ar479sid8wm/", "k26uzxjfkdjyguy/", "sdk7czogf28jt01/", "umrqfcwur2t3f5b/", "4zmin0fols0fnve/", "7d5d1u5u4v7c7vu/", "4mxow4utx4nh1fk/", "2ztuxmpmwo034bk/"], ["https://static.dc.com/2023-03/SM_LOST_Cv1_00111_DIGITAL.jpg", "https://static.dc.com/2023-04/SM_LOST_Cv2_00211_DIGITAL.jpg", "https://static.dc.com/2023-04/SM_LOST_Cv3_00311_DIGITAL.jpg", "https://static.dc.com/2023-06/SM_LOST_Cv4_00411_DIGITAL.jpg", "https://static.dc.com/2023-07/SM_LOST_Cv5_00511_DIGITAL.jpg", "https://static.dc.com/2023-09/SM_LOST_Cv6_00611_DIGITAL.jpg", "https://static.dc.com/2023-10/SM_LOST_Cv7_00711_DIGITAL.jpg", "https://static.dc.com/2023-11/SM_LOST_Cv8_00811_DIGITAL.jpg", "https://static.dc.com/2023-11/SM_LOST_Cv9_00911_DIGITAL.jpg", "https://static.dc.com/2024-01/Superman-Lost-10-1.jpg"]),
  ...makeRecentItems("series-superman-2023", "Superman", "cbr", ["uqdcb5yzxvjfhf7", "r3cdlv1o80l6iuo", "62zbd9id8lh2f8m", "be5hvs531l3mx3m", "5tvd9i9vxfhos9x", "unqy7djc6ng5atu", "yptsbvd5gsz1xcd", "7y8h4gp0zk8bhsr", "1rv4bdmo94ux9tw", "16d7frvll1ni7ay", "3dj0crhvcvt3q47", "nlm64o8wrl9d4kk", "yvn4o0btcmonrz1/", "df7yewe14y0k7po/", "ojylw2sldpg75vh/", "9i6tdtgmab3d12r/", "wt7djyjzlveefqe/", "6sbd94oey0zj8pa/", "m7o98pvwzgamqn8/", "7b6bj95uqtjfygf/", "ofcjur39x2sp391/", "1a9ojridd6wyjqi/", "de0mf55aohxp1f7/", "4yvby9i4t4a1m0q/", "j4e4tsmeou06p8u/", "metabus2eu3dfgg/", "hwqbym63q372onx/", "pn1o09hmgeid29h", "xezrgfzjpo04ir1/Superman_%252328_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file", "v1m22k9s4j4fw0b/Superman_%252329_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file", "87wub0qtmucxfxe/Superman_%252330_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file", "fud3no5jqx79xn0/Superman_%252331_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file", "x4fzavr4ala6exx/Superman_%252332_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file", "cv4f108h6stkslt/Superman_%252333_%25282026%2529_%2528SoQuadrinhos%2529.cbz/file", "qybir868e8j18p8/Superman_%252334_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file", "oe2tjxzzjzakvr6/Superman_%252335_%25282026%2529_%2528SoQuadrinhos%2529.cbz/file", "smf7g7qnrdyfeds", "osl2mqvdzszlr16/Superman_Anual_-_Ano_Mil_%25282026%2529_%2528SoQuadrinhos%2529.cbz/file"], ["https://static.dc.com/2023-04/dc_cv_superman1_2023.jpg", "https://static.dc.com/2023-04/SUPES_Cv2_00211_DIGITAL.jpg", "https://static.dc.com/2023-04/SUPES_Cv3_00311_DIGITAL.jpg", "https://static.dc.com/2023-04/SUPES_Cv4_00411_DIGITAL.jpg", "https://static.dc.com/2023-06/SUPES_Cv5_00511_DIGITAL.jpg", "https://static.dc.com/2023-08/SM_ANN2023_Cv1_00111_DIGITAL.jpg", "https://static.dc.com/2023-09/SM_Cv6_00611_DIGITAL.jpg", "https://static.dc.com/2023-10/SM_Cv7_00711_DIGITAL.jpg", "https://static.dc.com/2023-11/SMSCv1%20%28%20Cover%29.jpg", "https://static.dc.com/2023-11/SM_Cv8_00811_DIGITAL.jpg", "https://static.dc.com/2023-12/SM_Cv9_00911_DIGITAL.jpg", "https://static.dc.com/2023-12/SM_Cv10_01011_DIGITAL.jpg", "https://static.dc.com/2024-02/SM_Cv11_01111_DIGITAL.jpg", "https://static.dc.com/2024-02/SM_Cv12_01211_DIGITAL.jpg", "https://static.dc.com/2024-04/SM_Cv13_01311_DIGITAL.jpg", "https://static.dc.com/2024-04/SM_HOB_SP_Cv1_00111_DIGITAL.jpg", "https://static.dc.com/2024-04/SMv2_TC%20%28Cover%29.jpg", "https://static.dc.com/2024-05/SM_Cv14_01411_DIGITAL.jpg", "https://static.dc.com/2024-06/SM_Cv15_01511_DIGITAL.jpg", "https://static.dc.com/2024-06/SM_Cv16_01611_DIGITAL.jpg", "https://static.dc.com/2024-08/SM_Cv17_01711_DIGITAL.jpg", "https://static.dc.com/2024-09/SM_Cv18_01811_DIGITAL.jpg", "https://static.dc.com/2024-10/SMHOB%20%28Cover%29.jpg", "https://static.dc.com/2024-10/SM_Cv19_01911_DIGITAL.jpg", "https://static.dc.com/2024-12/SM_v3_TDP%20%28Cover%29.jpg", "https://static.dc.com/2025-01/SM_Cv22_02211_DIGITAL.jpg", "https://static.dc.com/2025-02/SM_Cv23_02311_DIGITAL.jpg", "https://static.dc.com/2025-03/SM_Cv24_02411_DIGITAL.jpg", "https://static.dc.com/2025-04/SM_Cv25_02511_DIGITAL%202.jpg", "https://static.dc.com/2025-05/SM_v4_ROTS%20%28Cover%29.jpg", "https://static.dc.com/2025-05/SM_Cv26_02611_DIGITAL.jpg", "https://static.dc.com/2025-06/SM_Cv27_02711_DIGITAL.jpg", "https://static.dc.com/2025-08/SM_Cv29_02911_DIGITAL.jpg", "https://static.dc.com/2025-09/SM_Cv30_03011_DIGITAL.jpg", "https://static.dc.com/2025-10/SM_Cv31_03111_DIGITAL.jpg", "https://static.dc.com/2025-11/SM_Cv32_03211_DIGITAL_000_HD_HD.jpg", "https://static.dc.com/2025-12/SM_Cv33_03311_DIGITAL_000_HD_HD.jpg", "https://static.dc.com/2026-01/SM_Cv34_03411_DIGITAL.jpg", "https://static.dc.com/2026-03/SM_Cv35_03511_DIGITAL.jpg", "https://static.dc.com/2026-04/SM_Cv36_03611_DIGITAL.jpg", "https://static.dc.com/2026-04/SM_ANN2026_Cv1_00111_DIGITAL.jpg"]),
  ...makeRecentItems("series-superman-son-kal-el-2021", "Superman: Filho de Kal-El", "cbr", ["2vju3v3ww8ap54q", "jwnkb97fzzfqsup", "hd8vemum5kigk8v", "3wzf990cjzd93ag", "i3yfkll8kmzjep1"], ["https://static.dc.com/dc/files/default_images/SMSOKE_Cv1_60de1360ad2970.81986650.jpg", "https://static.dc.com/dc/files/default_images/SMSOKE_Cv16_01611_DIGITAL_63371ff58a39d1.40044169.jpg", "https://static.dc.com/dc/files/default_images/SMSOKE_Cv17_01711_DIGITAL_635b16816423b1.56366559.jpg", "https://static.dc.com/dc/files/default_images/SMSOKE_Cv18_01811_DIGITAL_639381f9e1a9b0.53659192.jpg", "https://zonafantasmanet.files.wordpress.com/2023/05/superman-robin-special-2022-001-000a-1.jpg"], ["1", "16", "17", "18", "Especial"]),
  ...makeRecentItems("series-superman-kal-el-returns-2022", "Superman: O Retorno de Kal-El", "cbr", ["i2ru0di1s5p69g4/", "jwnkb97fzzfqsup", "y787nefu5smpihj/", "hd8vemum5kigk8v", "fhn6biqu2bdnsc3/", "3wzf990cjzd93ag", "l4mdprzxhut9po3"], ["https://i.imgur.com/bHWJHqv.jpg", "https://static.dc.com/dc/files/default_images/SMSOKE_Cv16_01611_DIGITAL_63371ff58a39d1.40044169.jpg", "https://i.imgur.com/ClWHtTA.jpg", "https://static.dc.com/dc/files/default_images/SMSOKE_Cv17_01711_DIGITAL_635b16816423b1.56366559.jpg", "https://i.imgur.com/chKFPfU.jpg", "https://static.dc.com/dc/files/default_images/SMSOKE_Cv18_01811_DIGITAL_639381f9e1a9b0.53659192.jpg", "https://i.postimg.cc/4yBMLxn1/Superman-Kal-El-Returns-Special-2022-001-000.jpg"], ["Action Comics #1047", "Superman: Son of Kal-El #16", "Action Comics #1048", "Superman: Son of Kal-El #17", "Action Comics #1049", "Kal-El Returns Special #1", "Superman: Son of Kal-El #18"]),
];

window.DEFAULT_SERIES.push({ id: "series-knight-terrors-2023", name: "Terrores Noturnos", seriesTitle: "Terrores Noturnos", originalTitle: "Knight Terrors", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Evento", status: "Em Andamento", editions: "46", year: 2023, description: "Um alerta na Sala de Justi\u00e7a leva Superman, Mulher-Maravilha e Batman a investigar o corpo do Doutor Destino. Um inimigo desconhecido controla o poder dos sonhos e transforma o mundo em um pesadelo.", coverUrl: "https://i.postimg.cc/0jwFzd1n/Dawn-of-DC-Knight-Terrors-FCBD-Special-Edition-2023-001-000-copiar.jpg", character: "Liga da Justi\u00e7a", tags: ["Terrores Noturnos", "Knight Terrors", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-flash-fastest-2022", name: "The Flash \u2013 O Homem Mais R\u00e1pido Vivo", seriesTitle: "The Flash \u2013 O Homem Mais R\u00e1pido Vivo", originalTitle: "The Flash \u2013 The Fastest Man Alive", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "Miniss\u00e9rie", status: "Cancelada/Terminada", editions: "03", year: 2022, description: "Antes do filme, Barry Allen precisa dominar seus poderes com a ajuda do Batman para enfrentar uma nova amea\u00e7a chamada Viga em Central City.", coverUrl: "https://i.imgur.com/NugdMhw.jpg", character: "Flash", tags: ["Flash", "The Fastest Man Alive", "Barry Allen", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-titans-2023", name: "Tit\u00e3s", seriesTitle: "Tit\u00e3s", originalTitle: "Titans", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "S\u00e9rie Mensal", status: "Em Andamento", editions: "\u2014", year: 2023, description: "A Crise Sombria acabou e a Liga da Justi\u00e7a n\u00e3o existe mais. Uma nova equipe precisa surgir para proteger a Terra: os Tit\u00e3s.", coverUrl: "https://i.postimg.cc/wv8szTTF/Titans-001-000.jpg", character: "Tit\u00e3s", tags: ["Tit\u00e3s", "Titans", "DC Comics"] });
window.DEFAULT_SERIES.push({ id: "series-wildcats-2023", name: "WildC.A.T.s", seriesTitle: "WildC.A.T.s", originalTitle: "WildC.A.T.s", type: "comic", publisher: "DC Comics", imprint: "Recentes", publication: "S\u00e9rie Mensal", status: "Em Andamento", editions: "\u2014", year: 2023, description: "A HALO Corporation reuniu uma equipe heterog\u00eanea de agentes liderados por Cole \u201cBandoleiro\u201d Cash. Trabalhando nas sombras do Universo DC, os WildC.A.T.s precisam reunir cientistas para colocar seu plano em a\u00e7\u00e3o.", coverUrl: "https://i.postimg.cc/MT94FJJc/001.jpg", character: "WildC.A.T.s", tags: ["WildC.A.T.s", "Wildcats", "DC Comics"] });

const FINAL_RECENT_ITEMS = [
  ...makeRecentItems("series-flash-fastest-2022", "The Flash \u2013 O Homem Mais R\u00e1pido Vivo", "cbr", ["3xh7yn7pq3egl5n", "azel574tb76sock"], ["https://i.imgur.com/NugdMhw.jpg", "https://i.imgur.com/tAqIXKb.jpg"]),
  ...makeRecentItems("series-titans-2023", "Tit\u00e3s", "cbr", ["r5b7wqjthn3bdqw", "ta11y8xxapohszz"], ["https://i.postimg.cc/wv8szTTF/Titans-001-000.jpg", "https://i.postimg.cc/7Y8JBRYT/Titans-002-000.jpg"]),
  ...makeRecentItems("series-wildcats-2023", "WildC.A.T.s", "cbr", ["np73wdqirw20hz1", "aqzoshg2xifuien", "1fx405lqzhhfkhv/WildCATs03%2528SQ-AHQ2023%2529.cbr/file", "0vo4ve8hctignbb/WildCATs04%2528SQ-AHQ2023%2529.cbr/file", "vmlhmg2ofl9gqqg/WildCATs05%2528SQ-AHQ2023%2529.cbr/file"], ["https://i.postimg.cc/MT94FJJc/001.jpg", "https://i.postimg.cc/RV20wWqf/001.jpg", "https://i.postimg.cc/BQVRMcBz/Wild-C-A-T-s-003-000.jpg", "https://i.postimg.cc/cCPLRQ1K/Wild-C-A-T-s-004-000.jpg", "https://i.postimg.cc/5N3BX19k/001.jpg"]),
  ...makeRecentItems("series-knight-terrors-2023", "Terrores Noturnos", "cbr", ["52t52uag8ijmgad/", "gghcdx0hznehs55", "5b6sducv9fr4zfx", "7ixn72vd49tyzxu", "jhlv24ywqb0lhd1", "pw200z6t2p7wyno", "ekud04siqiza592", "j7h75ljof08zknv", "pdd4x8ozr4gfps3", "stedjs1hwwuueyf", "o7465k7tw9blkrg", "87k6aj5jnh562e6", "b081i4p4dq79qjq", "eim8io8ik33do2o", "86rlsk2w1qwsm3o", "nyjhsv13gbva82q", "05y9drozh0wn6lp/", "8xr5y9l3b27o207", "95bflr6jkt8xkzm", "ramv5kog0k4pj9n", "labcvo7bom1f106", "tdl6lsp2rmxlme8", "koehc3agtbthat6", "dej27y43qemiaep", "hnnic5fq545z4ec", "t54lemhllq8kb2b", "d7sd6wluutasa95", "ojypci87k4wsneu", "1bfqakxw07c69ia", "findo6xwcr5uej3", "02e7hauxn08htpx", "jxdx2etjo6kohyu", "vshis1yhhewvoox/", "3m3z8iz6jbmjar5/", "vofhru6wyqdragh/", "sxkvp1gw928i7nb", "gesg9mp8guwht98", "tkdj2crzrw8ivyt", "cnmrhb0yt9az18t", "iggr92ru30zr6sa", "m17k78hy5b4u9fb", "ue6dp2nyp8m13ut/", "vzotm1hpi79irnp/", "j2b4e6w9sdkwnms", "trfadvb1699jpkp", "vf2tawllgebzlb9", "qfkrkxzffyavqzc"], ["https://i.postimg.cc/0jwFzd1n/Dawn-of-DC-Knight-Terrors-FCBD-Special-Edition-2023-001-000-copiar.jpg", "https://i.postimg.cc/y60LnrcJ/Knight-Terrors-First-Blood-001-0000.jpg", "https://i.postimg.cc/qRPh1rLm/00000.jpg", "https://i.postimg.cc/W39443dX/00000.jpg", "https://i.postimg.cc/52Z35CqY/00000.jpg", "https://i.postimg.cc/mD0jBR9h/Knight-Terrors-004-0000.jpg", "https://i.postimg.cc/pVQ7PdfT/00000.jpg", "https://i.postimg.cc/Bv4cJcGq/Knight-Terrors-Batman-001-0000.jpg", "https://i.postimg.cc/YC2KZrdx/00000.jpg", "https://i.postimg.cc/SQMTQcDz/Knight-Terrors-Ravager-01-000-copiar.jpg", "https://i.postimg.cc/D0G6BJFc/Knight-Terrors-Ravager-002-000-copiar.jpg", "https://i.postimg.cc/g0qmRsJh/00000.jpg", "https://i.postimg.cc/jShhqP2W/00000.jpg", "https://i.postimg.cc/K8xxqZF3/00000.jpg", "https://i.postimg.cc/xCQK6WsL/00000.jpg", "https://i.postimg.cc/5yV7H6Wz/00000-copiar.jpg", "https://i.postimg.cc/dVjZC7Rm/0000000-copiar.jpg", "https://i.postimg.cc/Xq7bv1s9/00000.jpg", "https://zonafantasmanet.files.wordpress.com/2023/10/knight_terrors_robin_002-000a.jpg", "https://i.postimg.cc/VNdnHFzs/00000.jpg", "https://i.postimg.cc/zv0KfhZk/00000.jpg", "https://i.postimg.cc/rFgWnPpG/00000.jpg", "https://i.postimg.cc/VvB603mN/00000.jpg", "https://i.postimg.cc/KjDp75f5/Knight-Terrors-Shazam-01-000-copiar.jpg", "https://i.postimg.cc/nLcMJfyB/00000.jpg", "https://i.postimg.cc/J07KJqp6/00000.jpg", "https://i.postimg.cc/L5ZH8Xg2/00000.jpg", "https://i.postimg.cc/xC3fnsx0/00000.jpg", "https://zonafantasmanet.files.wordpress.com/2024/01/knight_terrors_wonder_woman_002-000a.jpg", "https://i.postimg.cc/90y67P0x/0000.jpg", "https://i.postimg.cc/mgtpwM67/00000.jpg", "https://i.postimg.cc/SRtLHYx7/Knight-Terrors-Nightwing-001-000.jpg", "https://i.postimg.cc/LskGnFwW/00000.jpg", "https://i.ibb.co/bPPST0V/TNMG01-0.jpg", "https://i.ibb.co/smBFbnN/TNMG02-001.jpg", "https://i.postimg.cc/XJqmyQkk/00000.jpg", "https://i.postimg.cc/15cC9C0v/00000.jpg", "https://i.postimg.cc/J7XyjR0v/Knight-Terrors-Titans-001-000.jpg", "https://i.postimg.cc/15Y6KvtB/Knight-Terrors-Titans-002-000.jpg", "https://i.postimg.cc/DfB0jf40/00000.jpg", "https://zonafantasmanet.files.wordpress.com/2023/10/knight_terrors_action_comics_002-000a.jpg", "https://i.ibb.co/2nDjG1b/TNDC01-001.jpg", "https://i.ibb.co/kc1nCQx/TNDC02-001.jpg", "https://zonafantasmanet.files.wordpress.com/2023/08/knight_terrors_harley_quinn_001-000a.jpg", "https://i.postimg.cc/g2Xp64SJ/00000.jpg", "https://zonafantasmanet.files.wordpress.com/2023/08/knight_terrors_angel_breaker_001-000a.jpg", "https://i.postimg.cc/LsCfzLQw/00000-copiar.jpg"]),
];

// Capas principais obtidas diretamente do catálogo oficial da DC, sem o
// parâmetro de redução de tamanho usado pela página de origem.
const OFFICIAL_RECENT_COVER_OVERRIDES = {
  "series-knight-terrors-2023-01": "https://static.dc.com/2023-07/KT_Cv1_00111_DIGITAL.jpg",
  "series-titans-2023-01": "https://static.dc.com/2023-04/TTNS_Cv1_00111_DIGITAL.jpg"
};
FINAL_RECENT_ITEMS.forEach(item => {
  if (OFFICIAL_RECENT_COVER_OVERRIDES[item.id]) item.coverUrl = OFFICIAL_RECENT_COVER_OVERRIDES[item.id];
});

// A seleção de Terrores Noturnos segue os blocos do post original: a história
// principal e uma aba para cada personagem/série derivada.
const KNIGHT_TERRORS_GROUPS = [
  ["Principal", 7], ["Batman", 2], ["Devastadora", 2], ["Coringa", 2],
  ["Hera Venenosa", 2], ["Adão Negro", 2], ["Robin", 2], ["Flash", 2],
  ["Zatanna", 2], ["Shazam", 2], ["Lanterna Verde", 2],
  ["Mulher-Maravilha", 2], ["Superman", 2], ["Asa Noturna", 2],
  ["Mulher-Gato", 2], ["Anedota", 2], ["Titãs", 2], ["Action Comics", 2],
  ["Detective Comics", 2], ["Arlequina", 2], ["Algoz dos Anjos", 2]
];
let knightTerrorsGroupIndex = 0;
let knightTerrorsGroupOffset = 0;
FINAL_RECENT_ITEMS
  .filter(item => item.seriesId === "series-knight-terrors-2023")
  .forEach(item => {
    const [groupName, groupSize] = KNIGHT_TERRORS_GROUPS[knightTerrorsGroupIndex];
    item.volume = groupName;
    item.volumeTitle = groupName;
    knightTerrorsGroupOffset += 1;
    if (knightTerrorsGroupOffset >= groupSize) {
      knightTerrorsGroupIndex += 1;
      knightTerrorsGroupOffset = 0;
    }
  });

window.DEFAULT_LIBRARY = [
  ...window.DEFAULT_LIBRARY_RECENT_ADDITIONS,
  ...MORE_RECENT_ITEMS.filter(item => item.id !== "series-stargirl-lost-children-2022-03"),
  ...FINAL_RECENT_ITEMS,
  ...makeRecentItems("series-new-gods-2025", "Os Novos Deuses", "cbz", ["46f68p7n9dvl5l8/Os_Novos_Deuses_%252301_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","e3rrq7g2gtv8l17/Os_Novos_Deuses_%252302_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","moy6v7uwlj93g40/Os_Novos_Deuses_%252303_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","isf0d3ousn6jkk3/Os_Novos_Deuses_%252304_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","uhx2sn9gwo2hepv/Os_Novos_Deuses_%252305_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","hhn05lqqil38b1h/Os_Novos_Deuses_%252306_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","sog0rs31et3zpd1/Os_Novos_Deuses_%252307_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","2coxeu2nadgw8se/Os_Novos_Deuses_%252308_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","5qhhlvbv0uoz79k/Os_Novos_Deuses_%252309_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","r0vea8h7tot6tus/Os_Novos_Deuses_%252310_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","95e8u31nhb9om8k/Os_Novos_Deuses_%252311_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","12zswyuwbhh84en/Os_Novos_Deuses_%252312_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file"], ["https://i.postimg.cc/SQ1pd9Lh/ND1-001.jpg","https://i.postimg.cc/Y06J7fgc/ND2-001.jpg","https://i.postimg.cc/RVnXL6qG/ND3-001.jpg","https://i.postimg.cc/Z53vn4wc/ND4-001.jpg","https://i.postimg.cc/hPVPQ5Bn/ND5-001.jpg","https://i.postimg.cc/xdj2kqXb/ND6-0.jpg","https://i.postimg.cc/CMQXfXWS/ND7-001.jpg","https://i.postimg.cc/5NS2qPN4/ND8-001.jpg","https://i.postimg.cc/dQS7J99Y/ND9-001.jpg","https://i.postimg.cc/QCX08gZv/ND10-001.jpg","https://i.postimg.cc/7ZRx5WZV/ND11-001.jpg","https://i.postimg.cc/nrnqxwNh/ND12-001.jpg"]),
  ...makeRecentItems("series-trial-amazons-2022", "O Julgamento das Amazonas", "cbr", ["l01px07d71atk6w","jrob6mguf75nclc","izzwhxpdaa9tc0q","eid5xmq80hy0qcc","hj7sw4nyhgjdwcw","xd53r999cgr4iyt"], ["https://i.imgur.com/Zi5RaFD.jpg","https://zonafantasmanet.files.wordpress.com/2022/08/wonder-woman-782-000.jpg","https://zonafantasmanet.files.wordpress.com/2022/09/wonder-woman-783-000.jpg","https://i.postimg.cc/hjv7nJzn/Wonder-Woman-784-000.jpg","https://zonafantasmanet.files.wordpress.com/2022/10/trial-of-the-amazons-1a.jpg","https://i.postimg.cc/MpLc57DR/Nubia-the-Amazons-2021-006-000.jpg"]),
  ...makeRecentItems("series-swamp-thing-2021", "O Monstro do P\u00e2ntano", "cbr", ["c73ux24aw1da8oo","45axzm1iglcgk3v","16e7887yufiu7tc","ribkp9xkyiqtxdm","3qcr9l0ao4naatm","9wbmm79oodkpevk"], ["https://i.imgur.com/yWOZXir.jpg","https://i.imgur.com/VamwuuE.jpg","https://i.imgur.com/3FirDHH.jpg","https://i.postimg.cc/XJHy1Dxb/The-Swamp-Thing-2021-004-000.jpg","https://zonafantasmanet.files.wordpress.com/2023/05/the-sw-amp-thing-2021-005-000.jpg","https://zonafantasmanet.files.wordpress.com/2023/05/the-sw-amp-thing-2021-006-000.jpg"]),
  ...makeRecentItems("series-next-batman-second-son-2021", "O Novo Batman: Segundo Filho", "cbr", ["cojd9r6r3tvv4of","umuik6nbch2v0yc"], ["https://comicvine.gamespot.com/a/uploads/original/6/67663/7824353-01.jpg","https://zonafantasmanet.files.wordpress.com/2022/04/the-next-batman-second-son-2021-002-000b.jpg"]),
  ...makeRecentItems("series-wonder-girl-2021", "Mo\u00e7a-Maravilha", "cbr", ["im4rpupi3fah2u6","19mpjea7xgdk0iy","qsdt64all52llus","9ocys7ry5mbm7n6","82qyij7nniz29xt","6jbgww1rh5etl6y","soq1t6frwdao7ua"], ["https://comicvine.gamespot.com/a/uploads/original/6/67663/7973709-01.jpg","https://comicvine.gamespot.com/a/uploads/original/6/67663/8055059-02.jpg","https://i.imgur.com/XWBVVSX.jpg","https://i.imgur.com/XLH7Umi.jpg","https://i.imgur.com/Unuhmw3.jpg","https://zonafantasmanet.files.wordpress.com/2022/08/wonder-girl-2021-006-000.jpg","https://i.postimg.cc/HsrCmkV2/Wonder-Girl-2021-007-000a.jpg"]),
  ...makeRecentItems("series-wonder-woman-2023", "Mulher-Maravilha", "cbr", ["4sbboguna37a5p7/MlhrMrvlh%25231_%25282023%2529%2528ZF-SQ%2529.cbr/file","1p2f9pto4pud2iv/MlhrMrvlh%25232_%25282023%2529%2528ZF-SQ%2529.cbr/file","tsxmhe8wb0zzppw/MlhrMrvlh%25233_%25282023%2529%2528ZF-SQ%2529.cbr/file","ylyeybp13oblka3","43v58swxzz11yrl"], ["https://i.postimg.cc/Zn54HP6d/00000.jpg","https://i.postimg.cc/jjP70jgh/Wonder-Woman-002-0000.jpg","https://i.postimg.cc/J0zd7s5y/Wonder-Woman-002-2023-digital-Goobadaddy-Empire-000.jpg","https://zonafantasmanet.wordpress.com/wp-content/uploads/2024/05/wonder-woman-2023-4-0000a.jpg","https://i.postimg.cc/q75W7Y0x/Wonder-Woman-2023-5-0000.jpg"]),
  ...makeRecentItems("series-we-are-yesterday-2025", "N\u00f3s Somos o Passado", "cbr", ["https://mega.nz/file/SVIxDCQJ#-v9VgawatcWR--fZ0co98etAFQMI9YpeqgLMI-rkMmE","rt0jnxznadg00u6/Liga_da_Justi%25C3%25A7a_Sem_Limites_%252306_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","https://mega.nz/file/nQ52lRyb#uqa8JX3mCKHztcVZ3ZYh9E1_a9QpBJYEmyVsJUQjcJM","https://mega.nz/file/SYoU0BaK#fPEsbXPqZ5WkeeIPSCaaHpf0pAVzC0RXxcBPX55pS6s","8i6rqyvzd8y9aht/Liga_da_Justi%25C3%25A7a_Sem_Limites_%252307_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","qic6a8lznmebbmn/Liga_da_Justi%25C3%25A7a_Sem_Limites_%252308_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file"], ["https://i.imgur.com/bWQIL4g.jpg","https://i.postimg.cc/6qQQnB9Q/LJSL6-001.jpg","https://i.imgur.com/Louw7wq.jpg","https://i.imgur.com/DgcuaCy.jpg","https://i.postimg.cc/c4jts5J4/LJSL7-001.jpg","https://i.postimg.cc/wjKj8Dhm/LJSL8-001.jpg"]).map((item, index) => ({ ...item, format: [1,4,5].includes(index) ? "cbz" : "cbr" })),
  ...makeRecentItems("series-nubia-amazons-2021", "N\u00fabia e as Amazonas", "cbr", ["0lmdy8fagd2aed4","vmmaqj8ql1viojo","mgfpriucpiidsr8","xi56mbywqyv8mu3","mqgggm4d51vqxha","xd53r999cgr4iyt"], ["https://comicvine.gamespot.com/a/uploads/original/6/67663/8205636-01.jpg","https://zonafantasmanet.files.wordpress.com/2022/03/nubia-the-amazons-2021-002-000.jpg","https://zonafantasmanet.files.wordpress.com/2022/06/nubia-the-amazons-2021-003-000.jpg","https://i.imgur.com/jO7JdZI.jpg","https://i.postimg.cc/Df6cwpQB/Nubia-the-Amazons-2021-005-000.jpg","https://i.postimg.cc/MpLc57DR/Nubia-the-Amazons-2021-006-000.jpg"]),
  ...makeRecentItems("series-poison-ivy-2022", "Hera Venenosa", "cbr", POISON_IVY_FILES, POISON_IVY_COVERS),
  ...makeRecentItems("series-green-lantern-2023", "Lanterna Verde", "cbr", ["8cy3naqacf883ns","mncox2k4v785n4o","d0uftztle7k1foq"], ["https://i.postimg.cc/TYn1MCqn/Green-Lantern-2023-001-000.jpg","https://i.postimg.cc/nhCmCn6D/Green-Lantern-2023-002-000.jpg","https://i.postimg.cc/zBMnYPJD/00000.jpg"]),
  ...makeRecentItems("series-green-lantern-2021", "Lanterna Verde", "cbr", ["6rfisxpf0525hfr","2tcrp296niiqefj","egbxfta89s2q05e"], ["https://zonafantasmanet.files.wordpress.com/2023/05/green-lantern-2021-001-000_med.jpg","https://zonafantasmanet.files.wordpress.com/2023/10/green-lantern-2021-002-000_med.jpg","https://zonafantasmanet.wordpress.com/wp-content/uploads/2025/03/green-lantern-2021-003-000_med.jpg"]),
  ...makeRecentItems("series-green-lantern-war-journal-2023", "Lanterna Verde \u2013 Di\u00e1rio de Guerra", "cbr", ["4o3e3ed2bc2sjqw","wgdxgyvzqxmp3q1"], ["https://i.postimg.cc/j5DWy7H8/00000-Recuperado-copiar.jpg","https://i.postimg.cc/3N4Gsjwk/00000-copiar.jpg"]),
  ...makeRecentItems("series-justice-league-unlimited-2025", "Liga da Justi\u00e7a Sem Limites", "cbz", ["vnwdndl8ptgat0b/Liga_da_Justi%25C3%25A7a_Sem_Limites_%252301_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","r0zz1se2y5ntj9d/Liga_da_Justi%25C3%25A7a_Sem_Limites_%252302_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","wsaowmihylieqrb/Liga_da_Justi%25C3%25A7a_Sem_Limites_%252303_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","8f1p13flmlqeit7/Liga+da+Justi%C3%A7a+Sem+Limites+#04+(2025)+(SoQuadrinhos).cbz/file","59mq54cher0zzb9/Liga_da_Justi%25C3%25A7a_Sem_Limites_%252305_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","rt0jnxznadg00u6/Liga_da_Justi%25C3%25A7a_Sem_Limites_%252306_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","8i6rqyvzd8y9aht/Liga_da_Justi%25C3%25A7a_Sem_Limites_%252307_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","qic6a8lznmebbmn/Liga_da_Justi%25C3%25A7a_Sem_Limites_%252308_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","44c6g41p6u9rweo/Liga_da_Justi%25C3%25A7a_Sem_Limites_%252309_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","https://mega.nz/file/8U02BDbL#5FgoaoP6F2r9eqfnvOIYWob9ibhwqYkE4wm06n5YNXg","4vhkp6ccgfzsql6/Liga_da_Justi%25C3%25A7a_Sem_Limites_%252310_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","8amrlodjnbqycwf/Liga_da_Justi%25C3%25A7a_Sem_Limites_%252311_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","avtxcgb4mjsc10j/Liga_da_Justi%25C3%25A7a_-_O_Ato_%25C3%2594mega_%252301_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","u52exy0yelgzs3v/Liga_da_Justi%25C3%25A7a_Sem_Limites_%252312_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","bwzg7higt3xcs9k/Liga_da_Justi%25C3%25A7a_Sem_Limites_%252313_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","2874lsu1jz2236x/Liga_da_Justi%25C3%25A7a_Sem_Limites_%252314_%25282026%2529_%2528SoQuadrinhos%2529.cbz/file","3hae40br104pqrg/Liga_da_Justi%25C3%25A7a_Sem_Limites_%252315_%25282026%2529_%2528SoQuadrinhos%2529.cbz/file","ytb324xfeb6fdw1/Liga_da_Justi%25C3%25A7a_Sem_Limites_%252316_%25282026%2529_%2528SoQuadrinhos%2529.cbz/file","gmoxmvwxnuy6ise/Liga_da_Justi%25C3%25A7a_Sem_Limites_%252317_%25282026%2529_%2528SoQuadrinhos%2529.cbz/file","rwx1fc0ik2ak0d5/Liga_da_Justi%25C3%25A7a_Sem_Limites_%252318_%25282026%2529_%2528SoQuadrinhos%2529.cbz/file","3ujlknii1t46cie/Liga_da_Justi%25C3%25A7a_Sem_Limites_%252319_%25282026%2529_%2528SoQuadrinhos%2529.cbz/file","lv0aoto24vc1ma3/Liga_da_Justi%25C3%25A7a_Sem_Limites_%252320_%25282026%2529_%2528SoQuadrinhos%2529.cbz/file","5a9v9hqebxilz9c/Liga_da_Justi%25C3%25A7a_Sem_Limites_%252321_%25282026%2529_%2528SoQuadrinhos%2529.cbz/file","4cq0r5e2mge6jzp/Liga_da_Justi%25C3%25A7a_-_Vis%25C3%25B5es_Sombrias_%252301_%25282026%2529_%2528SoQuadrinhos%2529.cbz/file"], ["https://i.imgur.com/iIHPh8I.jpg","https://i.postimg.cc/FFPPJ76b/LJSL2-001.jpg","https://i.postimg.cc/cHJhzxXq/LJSL3-001.jpg","https://i.postimg.cc/k5BdHwPT/LJSL4-001.jpg","https://i.postimg.cc/zDLW1MWW/LJSL5-001.jpg","https://i.postimg.cc/6qQQnB9Q/LJSL6-001.jpg","https://i.postimg.cc/c4jts5J4/LJSL7-001.jpg","https://i.postimg.cc/wjKj8Dhm/LJSL8-001.jpg","https://i.postimg.cc/gjhPYvb1/LJSL9-001.jpg","https://i.postimg.cc/sx6mBqs8/LJFS1-001.jpg","https://i.postimg.cc/nLJ6Lccq/LJSL10-001.jpg","https://i.postimg.cc/0Nsh7grh/LJSL11-0.jpg","https://i.postimg.cc/bvp7NrYS/LJo-AO-001.jpg","https://i.postimg.cc/SR1L0t63/LJSL12-001.jpg","https://i.postimg.cc/mrDXGZ6d/LJSL13-001.jpg","https://i.postimg.cc/vHNBJZ4V/LJSL14-001.jpg","https://i.postimg.cc/YS24gm70/LJSL15-001.jpg","https://i.postimg.cc/V6H5DMz1/LJSL16-001.jpg","https://i.postimg.cc/MKyt8Wxf/LJSL17-001.jpg","https://i.postimg.cc/XqYGm82t/LJSL18-001.jpg","https://i.postimg.cc/VLk864MY/LJSL19-001.jpg","https://i.postimg.cc/fTmg7vDN/LJSL20-001.jpg","https://i.postimg.cc/kM1MQGJk/LJSL21-001.jpg","https://i.postimg.cc/XY2Xxd82/LJSLVS-001.jpg"], ["1","2","3","4","5","6","7","8","9","Futuro Sombrio 1","10","11","O Ato Omega 1","12","13","14","15","16","17","18","19","20","21","Visoes Sombrias 1"]),
  ...makeRecentItems("series-justice-godzilla-kong-2023", "Liga da Justi\u00e7a vs. Godzilla vs. Kong", "cbr", ["https://mega.nz/file/OAJF0Qzb#bQsycpTSQXJP0cHjILkxoYwdkSJelAdvKLCNJ46R7G0","https://mega.nz/file/HRAFwbrI#xapPQ0w_5uiWcjlqAezSmmeJAEhJEISbMYff9Nq8tto","https://mega.nz/file/aJZmCYJC#kk3W1AfESh09TQ4njzh8XSkyyn2XPocXSfjG_3u9PTk","https://mega.nz/file/CYhBURBD#gLyyOl7G3ulG0E2T3Ou12QBBiJjC9y5neMbxhYhgKxc","https://mega.nz/file/qZxGyTwa#gMwlh_YmG0i-0CBmi-VqpeIKt-Vl6XL8TxgY2bccfOE","https://mega.nz/file/qVpGTL5a#_1U1whVao2sDD4IXNaWdnhFdIxqoo1x-MWopbh-pE5I","https://mega.nz/file/WEhAEZJT#gKRVkW4uc0F8NttoQh48ockOQBI2DZtlt057Quxe0nM","https://mega.nz/file/XNISCRga#5NQNVbiHZER9AT6iE-8KG7nOEWBR3bpk2XWKhFNO9s","https://mega.nz/file/3AAAiBYA#hRN_xNJl5o6PE2BCx5dTtGRDgD-Sgpd14WqFZPeMbnU","https://mega.nz/file/ndInCIZJ#KPj_UjAZgAbq1GeO9ot_8xkG0rjyqqIENsHCJsFS0JM","https://mega.nz/file/fFICiBDQ#4LhFQqLY-Q_KTHVaihIpWn9lg6JdTy0Ir5aRtD9s6DA","https://mega.nz/file/XRAgwZoA#sHBO2LX5QWtoEQaY6CDjrkQqpUJA56Tai3_0vSvdO6Y","https://mega.nz/file/fIhTkahL#YUneOtVGGhswHzjdPySkHhhsHfqHqJ4vUu6Mot7i438","https://mega.nz/file/LMxy3QZB#exiGilBOibKtRrOb0892-pRt0_7q2AnRCIC4n085hCc"], ["https://i.ibb.co/xznjbWP/godliga1.jpg","https://i.ibb.co/4MRKwYJ/godliga2.jpg","https://i.postimg.cc/25JVR7Ld/ligazilla3.jpg","https://i.ibb.co/D8kLn2Q/ligazilla4.jpg","https://i.ibb.co/f8nWghH/ligazilla5.jpg","https://i.ibb.co/WvdnjdX/Ligazilla06.jpg","https://i.ibb.co/n74nQCm/ligazilla7.jpg","https://i.imgur.com/GXVVBDH.jpg","https://i.imgur.com/DnzTfoh.jpg","https://i.imgur.com/1hy2czy.jpg","https://i.imgur.com/CvFtIUS.jpg","https://i.ibb.co/SwZVQ9Ts/ligazilla5.jpg","https://i.ibb.co/hJpMdZvZ/Ligazilla26.jpg","https://i.ibb.co/whDLvmSY/ligazilla7.jpg"]),
  ...makeRecentItems("series-atom-project-2025", "Liga da Justi\u00e7a \u2013 O Projeto \u00c1tomo", "cbz", ["apzup5r2aipu8c5/Liga_da_Justi%25C3%25A7a_-_O_Projeto_%25C3%2581tomo_%252301_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","54433xngj4o895f/Liga_da_Justi%25C3%25A7a_-_O_Projeto_%25C3%2581tomo_%252302_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","czs1bo7gyhkz9y2/Liga_da_Justi%25C3%25A7a_-_O_Projeto_%25C3%2581tomo_%252303_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","7gixz36s6z14uxh/Liga_da_Justi%25C3%25A7a_-_O_Projeto_%25C3%2581tomo_%252304_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","b1zg8j0ikkmcweo/Liga_da_Justi%25C3%25A7a_-_O_Projeto_%25C3%2581tomo_%252305_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file","g6pnmwhh2dzwamm/Liga_da_Justi%25C3%25A7a_-_O_Projeto_%25C3%2581tomo_%252306_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file"], ["https://i.postimg.cc/Wbgvm6CV/LJPA1-001.jpg","https://i.postimg.cc/VNttJHVD/LJPA2-001.jpg","https://i.postimg.cc/pr7PYXmj/LJPA3-001.jpg","https://i.postimg.cc/cCjMcj2T/LJPA4-001.jpg","https://i.postimg.cc/DwhncdfL/LJPA5-001.jpg","https://i.postimg.cc/T3PZgxqQ/LJPA6-001.jpg"]),
  ...["pvisteg5w955r1f","4g08kw0lccpc2m9","p4hzsrr6rmdpqwi"].map((id, index) => ({ id: `fire-ice-smallville-2023-${String(index + 1).padStart(2, "0")}`, seriesId: "series-fire-ice-smallville-2023", title: "Fogo e Gelo – Bem-vindos a Smallville", issue: String(index + 1), format: "cbr", fileUrl: `https://www.mediafire.com/file/${id}`, coverUrl: ["https://i.postimg.cc/SQYgZ9GG/00000.jpg","https://i.postimg.cc/WzpTRPv4/Fire-Ice-Welcome-to-Smallville-002-0000.jpg","https://i.postimg.cc/hPJCP0Ws/Fire-Ice-Welcome-to-Smallville-003-0000.jpg"][index], clicks: 0, featured: true, randomWeight: 5, collectionIds: [] })),
  { id: "infinite-frontier-2021-001", seriesId: "series-infinite-frontier-2021", title: "Fronteira Infinita", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/wmtnjx9lor2p6od", coverUrl: "https://zonafantasmanet.files.wordpress.com/2021/03/infinite-frontier-2021-000-000_med.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  ...["0i7vs8rtfmtgtat","ajodt7ezavh1qir","dq4qg9scw7vcx9w","jblcv0docol0qs6","rsjycguealanoyg","9c5509esl3qc94k","hqr9ss8lvmf3fnw","zivrfxjx32laa53","om7j12gendwm3p6"].map((id, index) => ({ id: `shadow-war-2022-${String(index + 1).padStart(2, "0")}`, seriesId: "series-shadow-war-2022", title: "Guerra das Sombras", issue: String(index + 1), format: "cbr", fileUrl: `https://www.mediafire.com/file/${id}`, coverUrl: ["https://zonafantasmanet.files.wordpress.com/2023/04/shadow-war-alpha-2022-001-000-1.jpg","https://zonafantasmanet.files.wordpress.com/2023/04/batman-122-000.jpg","https://i.postimg.cc/rmzF9gQ2/Deathstroke-Inc-2021-008-000.jpg","https://i.postimg.cc/hPXT5CHG/Robin-2021-013-000.jpg","https://zonafantasmanet.files.wordpress.com/2023/05/batman-123-000.jpg","https://i.postimg.cc/GmXKZyyB/Shadow-War-Zone-2022-001-000.jpg","https://i.postimg.cc/cHWFMDFm/Deathstroke-Inc-2021-009-000.jpg","https://i.postimg.cc/6pNDx4Fy/Robin-2021-014-000.jpg","https://i.postimg.cc/fb7HHqfs/Shadow-War-Omega-2022-001-000.jpg"][index], clicks: 0, featured: true, randomWeight: 5, collectionIds: [] })),
  ...["xb3hn9f8jfryfgm","nrb5d359xih0045","m7qyz2mwj2ek284","g3blofbltn7ihhu","kzptfagixbjoyux"].map((id, index) => ({ id: `war-earth-3-2022-${String(index + 1).padStart(2, "0")}`, seriesId: "series-war-earth-3-2022", title: "Guerra pela Terra-3", issue: String(index + 1), format: "cbr", fileUrl: `https://www.mediafire.com/file/${id}`, coverUrl: ["https://i.postimg.cc/q7SmwJ88/War-for-Earth-3-2022-001-000.jpg","https://zonafantasmanet.files.wordpress.com/2022/06/suicide-squad-2021-013-000_med.jpg","https://i.postimg.cc/PrCJf4jd/The-Flash-780-000.jpg","https://zonafantasmanet.files.wordpress.com/2022/06/teen-titans-academy-2021-013-000_med.jpg","https://i.postimg.cc/wjyt9kcL/War-for-Earth-3-2022-002-000.jpg"][index], clicks: 0, featured: true, randomWeight: 5, collectionIds: [] })),
  { id: "dc-all-in-2024-001", seriesId: "series-dc-all-in-2024", title: "DC All In", issue: "1", format: "cbz", fileUrl: "https://www.mediafire.com/file/hrtal833hanbxzk/DC_All_In_Especial_%252301_%25282024%2529_%2528SoQuadrinhos%2529.cbz/file", coverUrl: "https://i.postimg.cc/0Nbkkz4X/DCAI1-001.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  ...DC_KO_FILES.map((fileUrl, index) => ({ id: `dc-ko-2025-${String(index + 1).padStart(2, "0")}`, seriesId: "series-dc-ko-2025", title: "DC K.O.", issue: String(index + 1), format: "cbz", fileUrl, coverUrl: DC_KO_COVERS[index], clicks: 0, featured: true, randomWeight: 5, collectionIds: [] })),
  ...["xt8p5h5496o2j5d","hid3sc13sipw571","cf3xqza0kric71c","9n637qhdqi2cc64","9o7gqn4sr7h9qp4"].map((id, index) => ({ id: `challengers-unknown-2025-${String(index + 1).padStart(2, "0")}`, seriesId: "series-challengers-unknown-2025", title: "Desafiadores do Desconhecido", issue: String(index + 1), format: "cbz", fileUrl: `https://www.mediafire.com/file/${id}/Desafiadores_do_Desconhecido_%2523${String(index + 1).padStart(2, "0")}_%25282025%2529_%2528SoQuadrinhos%2529.cbz/file`, coverUrl: ["https://i.postimg.cc/28rgZrfL/DdD1-001.jpg","https://i.postimg.cc/hPq8bq03/DdD2-001.jpg","https://i.postimg.cc/Kvq4JCqc/DdD3-001.jpg","https://i.postimg.cc/nzcFQy0G/DdD4-001.jpg","https://i.postimg.cc/HsnvYr6L/DdD5-001.jpg"][index], clicks: 0, featured: true, randomWeight: 5, collectionIds: [] })),
  ...["8yc4nggoz2r7040","fkss8rqye69fpb5","2dnrlc7ere4m8zy","4ufm83xrmumd7ep","jsnovjsat16pfa6","odhx2vpv38834du"].map((id, index) => ({ id: `one-star-squadron-2022-${String(index + 1).padStart(2, "0")}`, seriesId: "series-one-star-squadron-2022", title: "Esquadrão Uma Estrela", issue: String(index + 1), format: "cbr", fileUrl: `https://www.mediafire.com/file/${id}`, coverUrl: ["https://i.imgur.com/kLMcrDN.jpg","https://i.imgur.com/WBZeLYb.jpg","https://i.postimg.cc/9XwZWkTr/001.jpg","https://i.postimg.cc/RF2562B6/001.jpg","https://i.postimg.cc/7LLfMKcR/001.jpg","https://i.postimg.cc/cCZbRkKp/001.jpg"][index], clicks: 0, featured: true, randomWeight: 5, collectionIds: [] })),
  { id: "joker-2021-001", seriesId: "series-joker-2021", title: "Coringa", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/qo1lofutc9ndhkk/", coverUrl: "https://zonafantasmanet.files.wordpress.com/2021/07/the-joker-2021-001-000_med.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "joker-2021-002", seriesId: "series-joker-2021", title: "Coringa", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/wvg7kxuf9fc1ojh", coverUrl: "https://zonafantasmanet.files.wordpress.com/2021/10/the-joker-2021-002-000_med.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "joker-2021-003", seriesId: "series-joker-2021", title: "Coringa", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/irc17fhinpvx88i", coverUrl: "https://zonafantasmanet.files.wordpress.com/2022/05/the-joker-2021-003-000_med.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "joker-2021-004", seriesId: "series-joker-2021", title: "Coringa", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/wgyp6mnu2ah1zj5/", coverUrl: "https://i.postimg.cc/SKBtD1LV/The-Joker-2021-004-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "deathstroke-inc-2021-001", seriesId: "series-deathstroke-inc-2021", title: "Corporação Exterminador", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/n6l6qne679b26kc", coverUrl: "https://zonafantasmanet.files.wordpress.com/2022/11/deathstroke-inc-2021-001-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "deathstroke-inc-2021-002", seriesId: "series-deathstroke-inc-2021", title: "Corporação Exterminador", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/1sitdwevvlmzo56", coverUrl: "https://zonafantasmanet.files.wordpress.com/2022/12/deathstroke-inc-2021-002-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "deathstroke-inc-2021-003", seriesId: "series-deathstroke-inc-2021", title: "Corporação Exterminador", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/13kt4ia69bl1bj9", coverUrl: "https://i.postimg.cc/k4H863dp/Deathstroke-Inc-2021-003-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "deathstroke-inc-2021-004", seriesId: "series-deathstroke-inc-2021", title: "Corporação Exterminador", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/hgehttp013tovy4", coverUrl: "https://zonafantasmanet.files.wordpress.com/2022/11/deathstroke-inc.-2021-004-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "deathstroke-inc-2021-005", seriesId: "series-deathstroke-inc-2021", title: "Corporação Exterminador", issue: "5", format: "cbr", fileUrl: "https://www.mediafire.com/file/gyx42u0khozwyh8", coverUrl: "https://zonafantasmanet.files.wordpress.com/2023/01/deathstroke-inc-2021-005-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "deathstroke-inc-2021-006", seriesId: "series-deathstroke-inc-2021", title: "Corporação Exterminador", issue: "6", format: "cbr", fileUrl: "https://www.mediafire.com/file/4c2jzxanxhh2fdb", coverUrl: "https://zonafantasmanet.files.wordpress.com/2023/01/deathstroke-inc-2021-006-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "deathstroke-inc-2021-007", seriesId: "series-deathstroke-inc-2021", title: "Corporação Exterminador", issue: "7", format: "cbr", fileUrl: "https://www.mediafire.com/file/ps666y41z86rihk", coverUrl: "https://zonafantasmanet.files.wordpress.com/2023/02/deathstroke-inc-2021-007-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "deathstroke-inc-2021-008", seriesId: "series-deathstroke-inc-2021", title: "Corporação Exterminador", issue: "8", format: "cbr", fileUrl: "https://www.mediafire.com/file/dq4qg9scw7vcx9w", coverUrl: "https://i.postimg.cc/rmzF9gQ2/Deathstroke-Inc-2021-008-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "deathstroke-inc-2021-009", seriesId: "series-deathstroke-inc-2021", title: "Corporação Exterminador", issue: "9", format: "cbr", fileUrl: "https://www.mediafire.com/file/hqr9ss8lvmf3fnw", coverUrl: "https://i.postimg.cc/cHWFMDFm/Deathstroke-Inc-2021-009-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  ...["a8tcya72tmzylna","zo25nlrlonimudq","2nwusb25pxp733a","j0zqva4uqqozqqm","3w51rami2rrdt5e","sx0s7u7vzyz9cdr","jgg0eivzf4yrr2h","xzzgse1a8ifitmq","269k0amssky32y3","rxhzzg7dgmcgrjc","x832wy44ihqopo9","qb106k8g7ypjvag","5dn7qv3xg0uz7yq","0fx58k2wo2k7w78","72jo1oar5t3isqw","ortj2d8zl48o38q","hngb6s5odou1rsq","9bcc5jgt65ehs6f","ps1wu0lahryoyhc","ph1zej47f82xow2","cr8yzmynu2xcf1o","r9dnaf54wb8v2ly","deogllu4d1j2i0d","hjfjtppg6c7s94j","dembo4zstk8ozzv","nrub3q8nuiw4fxn","m3tsitb1551hr6o","m3sk0yjn0x14ocq"].map((id, index) => ({ id: `dark-crisis-2022-${String(index + 1).padStart(2, "0")}`, seriesId: "series-dark-crisis-2022", title: "Crise Sombria nas Infinitas Terras", issue: String(index + 1), format: "cbr", fileUrl: `https://www.mediafire.com/file/${id}`, coverUrl: DARK_CRISIS_COVERS[index], clicks: 0, featured: true, randomWeight: 5, collectionIds: [] })),
  { id: "cyborg-2023-001", seriesId: "series-cyborg-2023", title: "Cyborg", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/qhpxyl07arwext9", coverUrl: "https://i.postimg.cc/KvcB7tsM/Cyborg-001-000-copiar.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "cyborg-2023-002", seriesId: "series-cyborg-2023", title: "Cyborg", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/3p8kj8h1jpiza6k", coverUrl: "https://i.postimg.cc/J4tdHjJj/Cyborg-002-000-copiar-2.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-catwoman-gotham-war-2023-001", seriesId: "series-batman-catwoman-gotham-war-2023", title: "Batman/Mulher-Gato – A Guerra por Gotham", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/1gcqebccndejvhy/Batman_-_Mulher-Gato_-_A_Guerra_por_Gotham_%252301_%25282023%2529_%2528SQ-ZF%2529.cbr/file", coverUrl: "https://i.ibb.co/Pz6cLrV/BMG01-001.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-catwoman-gotham-war-2023-002", seriesId: "series-batman-catwoman-gotham-war-2023", title: "Batman/Mulher-Gato – A Guerra por Gotham", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/76n4wg3hwrscrz6/Batman_%2523137_%25282023%2529_%2528SoQuadrinhos_e_Zona_Fantasma%2529.cbr/file", coverUrl: "https://i.ibb.co/tMHkKYK/BTM137-0.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-catwoman-gotham-war-2023-003", seriesId: "series-batman-catwoman-gotham-war-2023", title: "Batman/Mulher-Gato – A Guerra por Gotham", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/1kuk1uhz1gri3x5/Mulher-Gato_%252357_%25282023%2529_%2528SQ-Zona_Fantasma%2529.cbr/file", coverUrl: "https://i.postimg.cc/zBByx4RJ/MG57-001.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-catwoman-gotham-war-2023-004", seriesId: "series-batman-catwoman-gotham-war-2023", title: "Batman/Mulher-Gato – A Guerra por Gotham", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/cda3jkqe64qs20i/BTM_MG_GG_CPZVRMLH_%2523%2521_%25282023_-_ZF-SQ%2529.cbr/file", coverUrl: "https://i.postimg.cc/1RnW3d6L/Batman-Catwoman-The-Gotham-War-Red-Hood-001-0000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-catwoman-gotham-war-2023-005", seriesId: "series-batman-catwoman-gotham-war-2023", title: "Batman/Mulher-Gato – A Guerra por Gotham", issue: "5", format: "cbr", fileUrl: "https://www.mediafire.com/file/1hns37ey0lawqgq/BTM%2523138_%25282023%2529%2528ZF-SQ%2529.cbr/file", coverUrl: "https://i.postimg.cc/J05nrVQg/Batman-138-0000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-catwoman-gotham-war-2023-006", seriesId: "series-batman-catwoman-gotham-war-2023", title: "Batman/Mulher-Gato – A Guerra por Gotham", issue: "6", format: "cbr", fileUrl: "https://www.mediafire.com/file/lv3hm1vmbrhw4hf/Mulher-Gato_%252358_%25282023%2529_%2528SQ-Zona_Fantasma%2529.cbr/file", coverUrl: "https://i.postimg.cc/zGD2ycs7/MG58-001.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-catwoman-gotham-war-2023-007", seriesId: "series-batman-catwoman-gotham-war-2023", title: "Batman/Mulher-Gato – A Guerra por Gotham", issue: "7", format: "cbr", fileUrl: "https://www.mediafire.com/file/6tfhvwdrzus4peg/BTM_MG_GG_CPZVRMLH_%25232_%25282023_-_ZF-SQ%2529.cbr/file", coverUrl: "https://i.postimg.cc/2yndVkfP/Batman-Catwoman-The-Gotham-War-Red-Hood-002-0000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-001", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/sntwvvyc1gdrtgz/Batman%2526Superman_-_Melhores_do_Mundo_%252301_%25282022%2529_%2528SQ%2526ZF%2529.cbr/file", coverUrl: "https://i.imgur.com/iTMdPnt.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-002", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/tm3mxq66tlimt76/Batman%2526Superman_-_Melhores_do_Mundo_%252302_%25282022%2529_%2528SQ%2526ZF%2529.cbr/file", coverUrl: "https://i.imgur.com/EQYYgk8.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-003", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/vudy2ql3ow9tpkz/Batman%2526Superman_-_Melhores_do_Mundo_%252303_%25282022%2529_%2528SQ%2526ZF%2529.cbr/file", coverUrl: "https://i.imgur.com/twoSYOb.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-004", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/0zswyw0pc03r11j/Batman%2526Superman_-_Melhores_do_Mundo_%252304_%25282022%2529_%2528SQ%2526ZF%2529.cbr/file", coverUrl: "https://i.imgur.com/rcTpM7R.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-005", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "5", format: "cbr", fileUrl: "https://www.mediafire.com/file/sm37qdpk3ge2a6p/Batman%2526Superman_-_Melhores_do_Mundo_%252305_%25282022%2529_%2528SQ%2526ZF%2529.cbr/file", coverUrl: "https://i.imgur.com/9NBg3Uj.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-006", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "6", format: "cbr", fileUrl: "https://www.mediafire.com/file/qfx2ay1zqi0e5ds/Batman%2526Superman_-_Melhores_do_Mundo_%252306_%25282022%2529_%2528SQ%2526ZF%2529.cbr/file", coverUrl: "https://i.imgur.com/M3LTiJi.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-007", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "7", format: "cbr", fileUrl: "https://www.mediafire.com/file/lty0apo3blurq2y/Batman%2526Superman_-_Melhores_do_Mundo_%252307_%25282022%2529_%2528SQ%2526ZF%2529.cbr/file", coverUrl: "https://i.imgur.com/aqFhbEa.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-008", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "8", format: "cbr", fileUrl: "https://www.mediafire.com/file/j8nz1kame2w8rau/Batman%2526Superman_-_Melhores_do_Mundo_%252308_%25282022%2529_%2528SQ%2526ZF%2529.cbr/file", coverUrl: "https://i.imgur.com/sMv52V4.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-009", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "9", format: "cbr", fileUrl: "https://www.mediafire.com/file/akvw27706gi8244/Batman%2526Superman_-_Melhores_do_Mundo_%252309_%25282023%2529_%2528SQ%2526ZF%2529.cbr/file", coverUrl: "https://i.imgur.com/tEfpNx9.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-010", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "10", format: "cbr", fileUrl: "https://www.mediafire.com/file/69atg2kycrm2yk7/Batman%2526Superman_-_Melhores_do_Mundo_%252310_%25282023%2529_%2528SQ%2526ZF%2529.cbr/file", coverUrl: "https://i.imgur.com/3pBFH45.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-011", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "11", format: "cbr", fileUrl: "https://www.mediafire.com/file/hz8mbdllsqaeats/Batman%2526Superman_-_Melhores_do_Mundo_%252311_%25282023%2529_%2528SQ%2526ZF%2529.cbr/file", coverUrl: "https://i.imgur.com/UUUCd1g.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-012", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "12", format: "cbr", fileUrl: "https://www.mediafire.com/file/tmaypbjv74k0cy9/Batman%2526Superman_-_Melhores_do_Mundo_%252312_%25282023%2529_%2528SQ%2526ZF%2529.cbr/file", coverUrl: "https://i.imgur.com/ggBukZU.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-013", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "13", format: "cbr", fileUrl: "https://www.mediafire.com/file/3mkdwrjdjkq2u5l/Batman%2526Superman_-_Melhores_do_Mundo_%252313_%25282023%2529_%2528SQ%2526ZF%2529.cbr/file", coverUrl: "https://i.imgur.com/yYyV3eE.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-014", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "14", format: "cbr", fileUrl: "https://www.mediafire.com/file/b2jrjpno3l0809f/Batman%2526Superman_-_Melhores_do_Mundo_%252314_%25282023%2529_%2528SQ%2526ZF%2529.cbr/file", coverUrl: "https://i.imgur.com/CanSF4d.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-015", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "15", format: "cbr", fileUrl: "https://www.mediafire.com/file/vgudcwkrp552e49/Batman%2526Superman_-_Melhores_do_Mundo_%252315_%25282023%2529_%2528SQ%2526ZF%2529.cbr/file", coverUrl: "https://i.imgur.com/SiCuvny.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-016", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "16", format: "cbr", fileUrl: "https://www.mediafire.com/file/b96obj6vvocp6vh/Batman%2526Superman_-_Melhores_do_Mundo_%252316_%25282023%2529_%2528SQ%2526ZF%2529.cbr/file", coverUrl: "https://i.imgur.com/NX95UaU.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-017", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "17", format: "cbr", fileUrl: "https://www.mediafire.com/file/li5onnb3chvadrg/Batman%2526Superman_-_Melhores_do_Mundo_%252317_%25282023%2529_%2528SQ%2526ZF%2529.cbr/file", coverUrl: "https://i.imgur.com/6dywGvV.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-018", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "18", format: "cbr", fileUrl: "https://mega.nz/file/DAByxCiJ#p8lp3VEDexL5PZjuq3hbbfGSt1wGqVb5Mh8XbmEBXQc", coverUrl: "https://i.ibb.co/hyf5HV2/melhores18.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-019", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "19", format: "cbr", fileUrl: "https://mega.nz/file/GRQCRIQI#9nm8xHFpYmSOr5cRCuwVcwJ2Pe8xpbA3i_8TkYAv2Yo", coverUrl: "https://i.ibb.co/zXvt91P/melhores19.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-020", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "20", format: "cbr", fileUrl: "https://mega.nz/file/jQR1ETSR#yLyRas_5fM3MDiwpjQPU8WBt8ZCLb6DjuJW0B5odcsE", coverUrl: "https://i.ibb.co/qNm1j4w/melhores20.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-021", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "21", format: "cbr", fileUrl: "https://mega.nz/file/KJQizBRA#rcezCrK-ncmNztmvHZYF2lqrGIK_bFvItqG0v6PDU2o", coverUrl: "https://i.ibb.co/TmmqQs8/melhores21.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-022", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "22", format: "cbr", fileUrl: "https://mega.nz/file/SRRFQI6Y#QX26gx0gp-C_Az3vZ4A9CsqfZO9YHnDtcNKjPQ31XDE", coverUrl: "https://i.ibb.co/NtFHKGb/melhores22.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-023", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "23", format: "cbr", fileUrl: "https://mega.nz/file/jE43USZC#8pVeMK9xXU5zraZk9WojDK5kTTzyxVkSrfcMxWHeos8", coverUrl: "https://i.ibb.co/8bWRcXw/melhores23.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-024", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "24", format: "cbr", fileUrl: "https://mega.nz/file/LYJX2Jia#uINNDWzCCZareY0Go8XXECRx6uUss7BM5k3F9A-2zqE", coverUrl: "https://i.ibb.co/R9y37xQ/melhores24.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-025", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "25", format: "cbr", fileUrl: "https://mega.nz/file/rF5mBTLb#8J1zu0sEl8v6JAHV0_fX756LFBl63UBf3L9qW7uYJkA", coverUrl: "https://i.ibb.co/YpvBWFt/melhores25.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-026", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "26", format: "cbr", fileUrl: "https://mega.nz/file/yFRGxKjb#24WHoss3JP2jwtFTeZ5PDUy9xYq6nrZIymeSr38ZhZY", coverUrl: "https://i.ibb.co/GtnPzfx/melhores26.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-027", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "27", format: "cbr", fileUrl: "https://mega.nz/file/jdQUySbK#XiR4p47Z0uO2wk5eRMGMNkWbONrvpcs1MOreF2grHEA", coverUrl: "https://i.postimg.cc/FRBgwxZM/melhores27.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-028", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "28", format: "cbr", fileUrl: "https://mega.nz/file/vRw0mZ7A#a66PzZl3WRLSuDarqeT5Pz867CZikalKUFYXzMq-NtI", coverUrl: "https://i.ibb.co/jG9RkNZ/melhores28.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-029", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "29", format: "cbr", fileUrl: "https://mega.nz/file/XJp1mbzT#LFQqDDDJEq_wzpQE6pSUmFPFW1gALyeFTaSirOYmVwQ", coverUrl: "https://i.ibb.co/sR8ts2v/melhores29.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-030", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "30", format: "cbr", fileUrl: "https://mega.nz/file/3MoFRLTQ#aBE6oRbsO6CAFv-B2CijK-6hLavlfB3Y3BtfBoaAO5s", coverUrl: "https://i.imgur.com/15OpWLL.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-031", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "31", format: "cbr", fileUrl: "https://mega.nz/file/iQJQTACC#kJUVYnLbG_3C3NKc6bFmcw_Stay6_0kjtcp8hPFQ-6Q", coverUrl: "https://i.imgur.com/3hkB2JZ.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-032", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "32", format: "cbr", fileUrl: "https://mega.nz/file/GNgDnLoD#tNZEupgZyeTkg_hLs-r5suxcRSyWMwdWqmthKuKrtoM", coverUrl: "https://i.imgur.com/cwQJslh.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-033", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "33", format: "cbr", fileUrl: "https://mega.nz/file/6UYABKIL#ntKlS6SJit17q7R0jWMP7i6A9ZEZ2G8DAdqXAYS0WIA", coverUrl: "https://i.imgur.com/TCpNnCA.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-034", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "34", format: "cbr", fileUrl: "https://mega.nz/file/3FB20IZL#Yt1xJOTx7u9zMakyxJSJhPbac_cJlccYSaOHtkPH8-8", coverUrl: "https://i.imgur.com/TlDpJno.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-035", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "35", format: "cbr", fileUrl: "https://mega.nz/file/SU4gwSDI#SbmvNrL6GF2uRTth-w7bstO2bedXCiTzW_WcE3bDqnw", coverUrl: "https://i.imgur.com/OxZ6Muc.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-036", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "36", format: "cbr", fileUrl: "https://mega.nz/file/qdI1Ea7L#QMZ0vXS_X6RvS0uvN4GE2Afi__AaiIUFXRkGNXOkicg", coverUrl: "https://i.imgur.com/mB4dwKJ.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-037", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "37", format: "cbr", fileUrl: "https://mega.nz/file/GcJE0IAT#MMwS-6t8mqsbvUkZP6rCyVb1TYLQM-y5CO6LYKZLGQc", coverUrl: "https://i.imgur.com/cUYpY89.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-038", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "38", format: "cbr", fileUrl: "https://mega.nz/file/SVIxDCQJ#-v9VgawatcWR--fZ0co98etAFQMI9YpeqgLMI-rkMmE", coverUrl: "https://i.imgur.com/bWQIL4g.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-039", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "39", format: "cbr", fileUrl: "https://mega.nz/file/SYoU0BaK#fPEsbXPqZ5WkeeIPSCaaHpf0pAVzC0RXxcBPX55pS6s", coverUrl: "https://i.imgur.com/DgcuaCy.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-040", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "40", format: "cbr", fileUrl: "https://mega.nz/file/CEgi3IYI#sO52tt93_lmb2K1457Jcnx1nO0ST6425lt8bvS7LWPE", coverUrl: "https://i.imgur.com/siz0E8u.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-041", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "41", format: "cbr", fileUrl: "https://mega.nz/file/GYYzBT5Y#0fW6sQR8ocEhbDHRN6kj2jwBQg-J14_KGwjUc3QfAcU", coverUrl: "https://i.imgur.com/OIokbIu.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-042", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "42", format: "cbr", fileUrl: "https://mega.nz/file/KAo0FYjI#edrG3By5e3ThOb0xaF2SUt2ZygfccvWBUFdWZuTGdCo", coverUrl: "https://i.imgur.com/kCzYXKL.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-043", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "43", format: "cbr", fileUrl: "https://mega.nz/file/aUAGALDL#jxbPXxTqvyIqJ6XVo7XuPqlyZbjdC_EghGsW1UXitlM", coverUrl: "https://i.imgur.com/PIDxsfP.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-044", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "44", format: "cbr", fileUrl: "https://mega.nz/file/TZpTgD5Y#Rk0lDS8HjwpR7tB-hKAx1YYtROMrOuqhsrH5eGP9PP4", coverUrl: "https://i.imgur.com/zID4yPl.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-045", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "45", format: "cbr", fileUrl: "https://mega.nz/file/yBR2maiK#I_VtAki-gUR21zjjB9bD7el8yu1jIE5VlJKgz9r2WAM", coverUrl: "https://i.ibb.co/v4GhQYV2/melhores45.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-046", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "46", format: "cbr", fileUrl: "https://mega.nz/file/3YJXCQDJ#HObtF7XeB3cJCrIamX_a6_s4pOV8pZEJXzmBDN8qcFA", coverUrl: "https://i.ibb.co/60YWmHFq/melhores46.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-047", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "47", format: "cbr", fileUrl: "https://mega.nz/file/7AxBibSZ#3rZ0v96a4FVF8vIAeV77Gr1H0mZ0M5VAb7TIl63I-z8", coverUrl: "https://i.ibb.co/mrJ8mTT3/melhores47.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-048", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "48", format: "cbr", fileUrl: "https://mega.nz/file/jIRlSADL#lTzo7sgXcLGDsixV6YUWFUCS6lAAxH-tMucU_c5ecUw", coverUrl: "https://i.imgur.com/KD66LLL.jpeg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-049", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "49", format: "cbr", fileUrl: "https://mega.nz/file/7IZyRZSQ#cFS_kBxSZ1KI43XuLBXM0qXthe2xmT6Q5LtHUwCPUwk", coverUrl: "https://i.ibb.co/nNhhfGpP/melhores49.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-050", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "50", format: "cbr", fileUrl: "https://mega.nz/file/eRxxBQLC#Bn7E8__vCpHa383nJBVhKlhdo6HUexcupsLMnuKpku4", coverUrl: "https://i.ibb.co/Fbq638PD/melhores50.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-051", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "51", format: "cbr", fileUrl: "https://mega.nz/file/fNxRyLxY#5RtJoVgs_Ft1viqGqPUwDTTomqFZ7OZwh4QuzJlBYU0", coverUrl: "https://i.ibb.co/qYQQsbRZ/melhores51.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-052", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "52", format: "cbr", fileUrl: "https://mega.nz/file/vVQjRI6T#sCCUoxK6ZVtrxytYTl0LpyLEvGVQGuS-GLbgJ_VlgQw", coverUrl: "https://i.ibb.co/27fpzqF9/melhores52.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2022-053", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo", issue: "53", format: "cbr", fileUrl: "https://mega.nz/file/HIAEBTzR#gFyy4UIjrUHqutJLojffr176C909iyJCMrNLfVsoVhg", coverUrl: "https://i.ibb.co/mV4yVPtd/melhores53.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2024-annual", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo – Anual 2024", issue: "Anual 2024", sortOrder: 54.1, format: "cbr", fileUrl: "https://mega.nz/file/uMZEVIrB#HivKh25uEZnwDw_sWCGiOZWS93B-R5yjJ_PID3KL7HE", coverUrl: "https://i.ibb.co/VQ7Qksq/melhores-Anual1.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-lv-av", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo – LV&AV", issue: "Especial", sortOrder: 54.2, format: "cbr", fileUrl: "https://mega.nz/file/vVwR1RwZ#HcsDlnnoqvhY3EiONWAFZ-cZNnIVY1303wpJTBJBANI", coverUrl: "https://imgur.com/BMxstya.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2025-annual", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo – Anual 2025", issue: "Anual 2025", sortOrder: 54.3, format: "cbr", fileUrl: "https://mega.nz/file/nQ52lRyb#uqa8JX3mCKHztcVZ3ZYh9E1_a9QpBJYEmyVsJUQjcJM", coverUrl: "https://imgur.com/Louw7wq.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-superman-worlds-finest-2026-annual", seriesId: "series-batman-superman-worlds-finest-2022", title: "Batman/Superman: Melhores do Mundo – Anual 2026", issue: "Anual 2026", sortOrder: 54.4, format: "cbr", fileUrl: "https://mega.nz/file/yABEyQLS#XjxtHhPh-ps6h8w3rZwDcyZfjSHPHRzgu_YNXJ9aMgI", coverUrl: "https://i.ibb.co/8g1TwpzD/melhores-Anual26.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-urban-legends-2021-001", seriesId: "series-batman-urban-legends-2021", title: "Batman: Lendas Urbanas", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/aj3q7iaic54yzv6/Btmn-LndsUrbns_%25282021%2529_%25231_%2528ZF%2526SQ%2529.cbr/file", coverUrl: "https://zonafantasmanet.files.wordpress.com/2021/08/batman-urban-legends-2021-001-000_med.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-urban-legends-2021-002", seriesId: "series-batman-urban-legends-2021", title: "Batman: Lendas Urbanas", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/n6m6nagmd184t77/Btmn-LndsUrbns_%25282021%2529_%25232_%2528ZF_%2526_SQ%2529.cbr/file", coverUrl: "https://zonafantasmanet.files.wordpress.com/2021/10/batman-urban-legends-2021-002-000_med.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-urban-legends-2021-003", seriesId: "series-batman-urban-legends-2021", title: "Batman: Lendas Urbanas", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/79lnz2qdc8ald6r/Btmn-LndsUrbns_%25282021%2529_%25233_%2528ZF_%2526_SQ%2529.cbr/file", coverUrl: "https://zonafantasmanet.files.wordpress.com/2022/01/batman-urban-legends-2021-003-000_med.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-urban-legends-2021-004", seriesId: "series-batman-urban-legends-2021", title: "Batman: Lendas Urbanas", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/7w1s41gdnbe6hju/Btmn-LndsUrbns_%25282021%2529_%25234_%2528ZonaFantasma%2526SQ%2529.cbr/file", coverUrl: "https://zonafantasmanet.files.wordpress.com/2021/11/batman-urban-legends-2021-004-000_med.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-urban-legends-2021-005", seriesId: "series-batman-urban-legends-2021", title: "Batman: Lendas Urbanas", issue: "5", format: "cbr", fileUrl: "https://www.mediafire.com/file/1ugkci49tu6yhxc/Btmn-LndsUrbns_%25282021%2529_%25235_%2528ZF-SQ%2529.cbr/file", coverUrl: "https://zonafantasmanet.files.wordpress.com/2022/06/batman-urban-legends-2021-005-000_med.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-urban-legends-2021-006", seriesId: "series-batman-urban-legends-2021", title: "Batman: Lendas Urbanas", issue: "6", format: "cbr", fileUrl: "https://www.mediafire.com/file/9r9xlkdafafy2vq/Btmn-LndsUrbns_%25282021%2529_%25236_%2528ZF-SQ%2529.cbr/file", coverUrl: "https://i.imgur.com/dajwz26.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-one-bad-day-2022-001", seriesId: "series-batman-one-bad-day-2022", title: "Batman – Um Dia Ruim: Charada", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/96w1nfvh3p3lsod/BTMN_MDRM_CHRD_%252301_%25282022-ZF-SQ%2529.cbr/file", coverUrl: "https://i.postimg.cc/SRRL8YsW/Batman-One-Bad-Day-2022-The-Riddler-001-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-one-bad-day-2022-002", seriesId: "series-batman-one-bad-day-2022", title: "Batman – Um Dia Ruim: Duas-Caras", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/1h6mlgafjf43wgp/BTMN_MDRM_DSCRS_%252301_%25282022-ZF-SQ%2529.cbr/file", coverUrl: "https://i.postimg.cc/J7vJBhQf/Batman-One-Bad-Day-2022-Two-Face-001-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-one-bad-day-2022-003", seriesId: "series-batman-one-bad-day-2022", title: "Batman – Um Dia Ruim: Pinguim", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/xpukpuz0rwoixrx/BTMN_MDRM_PNGM_%252301_%25282022-ZF-SQ%2529.cbr/file", coverUrl: "https://i.postimg.cc/PJs2N1Y1/Batman-One-Bad-Day-2022-Penguin-001-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-one-bad-day-2022-004", seriesId: "series-batman-one-bad-day-2022", title: "Batman – Um Dia Ruim: Sr. Frio", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/f0lxe2idthevv7a/BTMN_MDRM_SRFRIO_%252301_%25282022-ZF-SQ%2529.cbr/file", coverUrl: "https://i.postimg.cc/5tcxZfJH/Batman-One-Bad-Day-2022-Mr-Freeze-001-000-2.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-one-bad-day-2022-005", seriesId: "series-batman-one-bad-day-2022", title: "Batman – Um Dia Ruim: Mulher-Gato", issue: "5", format: "cbr", fileUrl: "https://www.mediafire.com/file/j1xu9k0qy7ej3ml/BTMN_MDRM_MLHRGT_%252301_%25282023-ZF-SQ%2529.cbr/file", coverUrl: "https://i.postimg.cc/xTSFhHPs/Batman-One-Bad-Day-2022-Catwoman-001-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-one-bad-day-2022-006", seriesId: "series-batman-one-bad-day-2022", title: "Batman – Um Dia Ruim: Bane", issue: "6", format: "cbr", fileUrl: "https://www.mediafire.com/file/wuei0jals9v2u31/BTMN_MDRM_BN_%252301_%25282023-ZF-SQ%2529.cbr/file", coverUrl: "https://i.postimg.cc/gJbhcKsq/Batman-One-Bad-Day-Bane-0000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-one-bad-day-2022-007", seriesId: "series-batman-one-bad-day-2022", title: "Batman – Um Dia Ruim: Cara-de-Barro", issue: "7", format: "cbr", fileUrl: "https://www.mediafire.com/file/ejxevhj22kcse07/BTMN_MDRM_KRBRR_%252301_%25282023-ZF-SQ%2529.cbr/file", coverUrl: "https://i.postimg.cc/Jn5c2kBQ/Batman-One-Bad-Day-2022-Clayface-001-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-one-bad-day-2022-008", seriesId: "series-batman-one-bad-day-2022", title: "Batman – Um Dia Ruim: Ra’s al Ghul", issue: "8", format: "cbr", fileUrl: "https://www.mediafire.com/file/6g0rkktnaylk2pz/BTMN_MDRM_RSLGHL_%252301_%25282022-ZF-SQ%2529.cbr/file", coverUrl: "https://i.postimg.cc/8cytwC8p/Batman-One-Bad-Day-2022-Ra-s-Al-Ghul-001-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-killing-time-2022-001", seriesId: "series-batman-killing-time-2022", title: "Batman – Tempo de Matar", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/7zgqa7f6p75ivfp/Batman_-_Tempo_de_Matar_001_%25282022%2529_%2528GibisCuits_e_S%25C3%25B3Quadrinhos%2529.cbr/file", coverUrl: "https://imgur.com/tEHRXIh.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-killing-time-2022-002", seriesId: "series-batman-killing-time-2022", title: "Batman – Tempo de Matar", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/ab54rnkufvwspw1/Batman_-_Tempo_de_Matar_002_%25282022%2529_%2528GibisCuits_e_S%25C3%25B3Quadrinhos%2529.cbr/file", coverUrl: "https://imgur.com/oazNqCS.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-killing-time-2022-003", seriesId: "series-batman-killing-time-2022", title: "Batman – Tempo de Matar", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/6bprqee1ovmij8e/Batman_-_Tempo_de_Matar_003_%25282022%2529_%2528GibisCuits_e_S%25C3%25B3Quadrinhos%2529.cbr/file", coverUrl: "https://imgur.com/0ccroOX.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-killing-time-2022-004", seriesId: "series-batman-killing-time-2022", title: "Batman – Tempo de Matar", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/apwt3fe8j506647/Batman_-_Tempo_de_Matar_004_%25282022%2529_%2528GibisCuits_e_S%25C3%25B3Quadrinhos%2529.cbr/file", coverUrl: "https://imgur.com/ivsEXNw.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-killing-time-2022-005", seriesId: "series-batman-killing-time-2022", title: "Batman – Tempo de Matar", issue: "5", format: "cbr", fileUrl: "https://www.mediafire.com/file/igsy4daw50cc3a0/Batman_-_Tempo_de_Matar_005_%25282022%2529_%2528GibisCuits_e_S%25C3%25B3Quadrinhos%2529.cbr/file", coverUrl: "https://imgur.com/8GU0umw.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-killing-time-2022-006", seriesId: "series-batman-killing-time-2022", title: "Batman – Tempo de Matar", issue: "6", format: "cbr", fileUrl: "https://www.mediafire.com/file/q814wfdv8yb67dd/Batman_-_Tempo_de_Matar_006_%25282022%2529_%2528GibisCuits_e_S%25C3%25B3Quadrinhos%2529.cbr/file", coverUrl: "https://imgur.com/SvJV0lP.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "immortal-legend-batman-2025-001", seriesId: "series-immortal-legend-batman-2025", title: "A Lenda Imortal Batman", issue: "1", format: "cbr", fileUrl: "https://mega.nz/file/aZBBXS4K#OTDmhXZ099JrV1vOX-gtCfOXJM1ikjKrJrrnLECtIrU", coverUrl: "https://i.imgur.com/9b2d8Rg.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "immortal-legend-batman-2025-002", seriesId: "series-immortal-legend-batman-2025", title: "A Lenda Imortal Batman", issue: "2", format: "cbr", fileUrl: "https://mega.nz/file/XFBUXKRQ#1l5KycR8hFuryYQdImOmzH5B05sb0UcenbeYVofZ0E8", coverUrl: "https://i.imgur.com/BwymWtC.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "immortal-legend-batman-2025-003", seriesId: "series-immortal-legend-batman-2025", title: "A Lenda Imortal Batman", issue: "3", format: "cbr", fileUrl: "https://mega.nz/file/zQRg0JzZ#ngKltBj8ey4wEzH1FNPeJ_RchaqTN376Q1sruGypsos", coverUrl: "https://i.imgur.com/pcHY3do.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "immortal-legend-batman-2025-004", seriesId: "series-immortal-legend-batman-2025", title: "A Lenda Imortal Batman", issue: "4", format: "cbr", fileUrl: "https://mega.nz/file/qQJ0UahD#ezIaUfUPGFyK8gV-IU-H7JQT7UIq-UTlm0T7IvUxnSc", coverUrl: "https://i.ibb.co/0P4NggB/lenda4.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "immortal-legend-batman-2025-005", seriesId: "series-immortal-legend-batman-2025", title: "A Lenda Imortal Batman", issue: "5", format: "cbr", fileUrl: "https://mega.nz/file/DMAW1SCK#uMLArSt0vOkbHwleseVTxw-d95mQyoVb2CDKeZgjSfI", coverUrl: "https://i.ibb.co/SD7D3M2j/lenda5.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "immortal-legend-batman-2025-006", seriesId: "series-immortal-legend-batman-2025", title: "A Lenda Imortal Batman", issue: "6", format: "cbr", fileUrl: "https://mega.nz/file/7VRDwaSD#NqCxxtIeZqx5wvmJ9iwXLnWQVHUAv947-6mWPddopmk", coverUrl: "https://i.ibb.co/cKLCnH8v/lenda6.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
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
    id: "absolute-batman-001",
    seriesId: "series-absolute-batman",
    title: "Absolute Batman",
    issue: "1",
    format: "cbz",
    fileUrl: "https://www.mediafire.com/file/ocj24y45s6qs4xk/Absolute_Batman_001_%25282024%2529_001.cbz",
    coverUrl: "https://multiversohq.com/wp-content/uploads/2026/04/Batman-Absoluto-1-2024.jpg",
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
    coverUrl: "https://multiversohq.com/wp-content/uploads/2026/04/Batman-Absoluto-2-2024.jpg",
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
    coverUrl: "https://multiversohq.com/wp-content/uploads/2026/04/Batman-Absoluto-3-2024.jpg",
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
    coverUrl: "https://multiversohq.com/wp-content/uploads/2026/04/Batman-Absoluto-4-2024.jpg",
    clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-005", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "5", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/wrow4rks3pbyt8d/AbsltBtm_%2523005_%25282025%2529%2528ZonaFantasma%2529.cbr", coverUrl: "https://multiversohq.com/wp-content/uploads/2026/04/Batman-Absoluto-5-2024.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-006", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "6", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/mslvxqk0uhlanwu/AbsltBtm_%2523006_%25282025%2529%2528ZonaFantasma%2529.cbr", coverUrl: "https://multiversohq.com/wp-content/uploads/2026/04/Batman-Absoluto-6-2024.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-007", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "7", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/665gr12kwkv6lv3/AbsltBtm_%2523007_%25282025%2529%2528ZonaFantasma%2529.cbr", coverUrl: "https://multiversohq.com/wp-content/uploads/2026/04/Batman-Absoluto-7-2024.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-008", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "8", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/o5sos1esi0b0j92/AbsltBtm_%2523008_%25282025%2529%2528ZonaFantasma%2529.cbr", coverUrl: "https://multiversohq.com/wp-content/uploads/2026/04/Batman-Absoluto-8-2024.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-009", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "9", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/sor4t18vf7k9nyg/AbsltBtm_%2523009_%25282025%2529%2528ZonaFantasma%2529.cbr", coverUrl: "https://multiversohq.com/wp-content/uploads/2026/04/Batman-Absoluto-9-2024.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-010", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "10", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/8jkiiq84tqc84kd/AbsltBtm_%2523010_%25282025%2529%2528ZonaFantasma%2529.cbr", coverUrl: "https://multiversohq.com/wp-content/uploads/2026/04/Batman-Absoluto-10-2024.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-011", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "11", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/wf2sj6n54d2y744/AbsltBtm_%2523011_%25282025%2529%2528ZonaFantasma%2529.cbr", coverUrl: "https://multiversohq.com/wp-content/uploads/2026/04/Batman-Absoluto-11-2024.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-012", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "12", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/0yvc06ibv1kb6vm/AbsltBtm_%2523012_%25282025%2529%2528ZonaFantasma%2529.cbr", coverUrl: "https://multiversohq.com/wp-content/uploads/2026/04/Batman-Absoluto-12-2024.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-013", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "13", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/iseribyfft1h0ny/AbsltBtm_%2523013_%25282025%2529%2528ZonaFantasma%2529.cbr", coverUrl: "https://multiversohq.com/wp-content/uploads/2026/04/Batman-Absoluto-13-2024.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-014", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "14", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/tn0pjuegziw03ji/AbsltBtm_%2523014_%25282025%2529%2528ZonaFantasma%2529.cbr", coverUrl: "https://multiversohq.com/wp-content/uploads/2026/04/Batman-Absoluto-14-2024.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-015", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "15", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/hz3s9z6gpaozx66/AbsltBtm_%2523015_%25282025%2529%2528ZonaFantasma%2529.cbr", coverUrl: "https://multiversohq.com/wp-content/uploads/2026/04/Batman-Absoluto-15-2024.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-016", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "16", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/id30tntganuvfpw/AbsltBtm_%2523016_%25282026%2529%2528ZonaFantasma%2529.cbr", coverUrl: "https://multiversohq.com/wp-content/uploads/2026/04/Batman-Absoluto-16-2024.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-017", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "17", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/zr6wkhshuavuzvp/AbsltBtm_%2523017_%25282026%2529%2528ZonaFantasma%2529.cbr", coverUrl: "https://multiversohq.com/wp-content/uploads/2026/04/Batman-Absoluto-17-2024.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-018", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "18", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/0cu0hzv3ht7u8jx/AbsltBtm_%2523018_%25282026%2529%2528ZonaFantasma%2529.cbr", coverUrl: "https://multiversohq.com/wp-content/uploads/2026/04/Batman-Absoluto-18-2024.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-019", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "19", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/w119s2p1xdjpj6i/AbsltBtm_%2523019_%25282026%2529%2528ZonaFantasma%2529.cbr", coverUrl: "https://multiversohq.com/wp-content/uploads/2026/04/Batman-Absoluto-19-2024.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-020", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "20", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/hicqrj0maljm1oa/AbsltBtm_%2523020_%25282026%2529%2528ZonaFantasma%2529.cbr", coverUrl: "https://static.wikia.nocookie.net/marvel_dc/images/d/d9/Absolute_Batman_Vol_1_20.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  {
    id: "absolute-batman-021", seriesId: "series-absolute-batman", title: "Absolute Batman", issue: "21", format: "cbr",
    fileUrl: "https://www.mediafire.com/file/93hf70z5sqdt0e1/AbsltBtm_%2523021_%25282026%2529%2528ZonaFantasma%2529.cbr", coverUrl: "https://static.wikia.nocookie.net/marvel_dc/images/4/4c/Absolute_Batman_Vol_1_21.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: []
  },
  { id: "absolute-superman-001", seriesId: "series-absolute-superman", title: "Absolute Superman", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/b9euelbt1dnjvgd/Absolute_Superman_%252301_%255B2024%255D%255BSoQuadrinhos%255D.cbr", coverUrl: "https://i.postimg.cc/FKRhwgXg/ABSOLUTE-SUPERMAN.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "absolute-superman-002", seriesId: "series-absolute-superman", title: "Absolute Superman", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/sis6teg36j29mzu/Absolute_Superman_%252302_%255B2025%255D%255BSoQuadrinhos%255D.cbr", coverUrl: "https://i.postimg.cc/W43zHRKz/ABSOLUTE-SUPERMAN2.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "absolute-superman-003", seriesId: "series-absolute-superman", title: "Absolute Superman", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/37isjn2zqxtqaeh/Absolute_Superman_%252303_%255B2025%255D%255BSoQuadrinhos%255D.cbr", coverUrl: "https://i.postimg.cc/2yDNPjWq/Absolute-Superman-So-Quadrinhos-03.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "absolute-superman-004", seriesId: "series-absolute-superman", title: "Absolute Superman", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/3vj4b0xm4mpurje/Absolute_Superman_%252304_%255B2025%255D%255BSoQuadrinhos%255D.cbr", coverUrl: "https://i.postimg.cc/WzBqL4qS/ABSOLUTE-SUPERMAN-4.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "absolute-superman-005", seriesId: "series-absolute-superman", title: "Absolute Superman", issue: "5", format: "cbr", fileUrl: "https://www.mediafire.com/file/erlw0qu2s7kaap4/Absolute_Superman_%252305_%255B2025%255D%255BSoQuadrinhos%255D.cbr", coverUrl: "https://i.postimg.cc/ZnCVPYgb/ABSOLUTE-SUPERMAN-5.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "absolute-superman-006", seriesId: "series-absolute-superman", title: "Absolute Superman", issue: "6", format: "cbr", fileUrl: "https://www.mediafire.com/file/2tloe9srs0w40dr/Absolute_Superman_%252306_%255B2025%255D%255BSoQuadrinhos%255D.cbr", coverUrl: "https://i.postimg.cc/QCV14JF1/ABSOLUTE-SUPERMAN-6.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "absolute-superman-007", seriesId: "series-absolute-superman", title: "Absolute Superman", issue: "7", format: "cbr", fileUrl: "https://www.mediafire.com/file/cr75c8k4wclslvm/Absolute_Superman_%252307_%255B2025%255D%255BSoQuadrinhos%255D.cbr", coverUrl: "https://i.postimg.cc/jj0PNwHh/Absolute-Superman-007-(2025)-(So-Quadrinhos)-00001.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "teen-titans-academy-001", seriesId: "series-teen-titans-academy", title: "Academia Jovens Titãs", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/0t48n1hmhmejcml/AcdmJvnsTts_%2523001_%25282021%2529%2528ZonaFantasma%2529.cbr", coverUrl: "https://comicvine.gamespot.com/a/uploads/scale_small/6/67663/7878637-01.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "teen-titans-academy-002", seriesId: "series-teen-titans-academy", title: "Academia Jovens Titãs", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/mptyoa8kqnmr2rm/AcdmJvnsTts_%2523002_%25282021%2529%2528ZonaFantasma%2529.cbr", coverUrl: "https://comicvine.gamespot.com/a/uploads/scale_small/6/67663/7933988-02.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "teen-titans-academy-003", seriesId: "series-teen-titans-academy", title: "Academia Jovens Titãs", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/fch6cnx6vn2jgu3/AcdmJvnsTts_%2523003_%25282021%2529%2528ZonaFantasma%2529.cbr", coverUrl: "https://comicvine.gamespot.com/a/uploads/scale_small/6/67663/7987367-03.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "teen-titans-academy-004", seriesId: "series-teen-titans-academy", title: "Academia Jovens Titãs", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/8vledpnqrpw2jdl/AcdmJvnsTts_%2523004_%25282021%2529%2528ZonaFantasma%2529.cbr", coverUrl: "https://comicvine.gamespot.com/a/uploads/scale_small/6/67663/8038322-04.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "teen-titans-academy-anuario", seriesId: "series-teen-titans-academy", title: "Academia Jovens Titãs", issue: "Anuário", sortOrder: 4.5, format: "cbr", fileUrl: "https://www.mediafire.com/file/q3iwxn60xh3h5fv/AcdmJvnsTts_-_Anuario_2021_%25282021%2529%2528ZonaFantasma%2529.cbr", coverUrl: "https://zonafantasmanet.files.wordpress.com/2022/01/teen-titans-academy-2021-yearbook-2021-001-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "teen-titans-academy-005", seriesId: "series-teen-titans-academy", title: "Academia Jovens Titãs", issue: "5", format: "cbr", fileUrl: "https://www.mediafire.com/file/pvzdma2e9ktfqsm/AcdmJvnsTtns_%25235_%2528ZonaFantasma%2529.cbr", coverUrl: "https://comicvine.gamespot.com/a/uploads/scale_small/6/67663/8076064-05.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "teen-titans-academy-006", seriesId: "series-teen-titans-academy", title: "Academia Jovens Titãs", issue: "6", format: "cbr", fileUrl: "https://www.mediafire.com/file/70eta6tom7ys1zh/AcdmJvnsTts_%2523006_%25282021%2529%2528ZonaFantasma%2529.cbr", coverUrl: "https://comicvine.gamespot.com/a/uploads/scale_small/6/67663/8128598-06.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "black-adam-justice-society-files-001", seriesId: "series-black-adam-justice-society-files", title: "Adão Negro – Os Arquivos da Sociedade da Justiça", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/9ckq7nzt9gg46jh/Ad%25C3%25A3o_Negro_-_Os_Arquivos_da_Sociedade_da_Justi%25C3%25A7a_%252301_%25282022%2529_%2528SQ%2526ZF%2529.cbr", coverUrl: "https://i.imgur.com/1OlYF5r.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "black-adam-justice-society-files-002", seriesId: "series-black-adam-justice-society-files", title: "Adão Negro – Os Arquivos da Sociedade da Justiça", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/0wqrc3l93t3gzc6/Ad%25C3%25A3o_Negro_-_Os_Arquivos_da_Sociedade_da_Justi%25C3%25A7a_%252302_%25282022%2529_%2528SQ%2526ZF%2529.cbr", coverUrl: "https://i.imgur.com/NkYhVpQ.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "black-adam-justice-society-files-003", seriesId: "series-black-adam-justice-society-files", title: "Adão Negro – Os Arquivos da Sociedade da Justiça", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/op38uwcnoqlnrx1/Ad%25C3%25A3o_Negro_-_Os_Arquivos_da_Sociedade_da_Justi%25C3%25A7a_%252303_%25282022%2529_%2528SQ%2526ZF%2529.cbr", coverUrl: "https://i.imgur.com/ampvRCF.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "black-adam-justice-society-files-004", seriesId: "series-black-adam-justice-society-files", title: "Adão Negro – Os Arquivos da Sociedade da Justiça", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/w1ppvjz6v9d40ak/Ad%25C3%25A3o_Negro_-_Os_Arquivos_da_Sociedade_da_Justi%25C3%25A7a_%252304_%25282022%2529_%2528SQ%2526ZF%2529.cbr", coverUrl: "https://i.imgur.com/fqkEcpb.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "flashpoint-beyond-000", seriesId: "series-flashpoint-beyond", title: "Além do Flashpoint", issue: "0", format: "cbr", fileUrl: "https://www.mediafire.com/file/yt6qcuw3yl9r3rv/AlmFlashpoint_%25230_%25282022%2529%2528ZF-SQ%2529.cbr", coverUrl: "https://zonafantasmanet.files.wordpress.com/2022/05/flashpoint-beyond-2022-000-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "flashpoint-beyond-001", seriesId: "series-flashpoint-beyond", title: "Além do Flashpoint", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/pt6ovp6bsn3sw4f/AlmFlashpoint_%25231_de_6_%25282022%2529%2528ZF-SQ%2529.cbr", coverUrl: "https://zonafantasmanet.files.wordpress.com/2022/05/flashpoint-beyond-2022-001-000a.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "flashpoint-beyond-002", seriesId: "series-flashpoint-beyond", title: "Além do Flashpoint", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/l93k853uhifdj2v/AlmFlashpoint_%25232_de_6_%25282022%2529%2528ZF-SQ%2529.cbr", coverUrl: "https://zonafantasmanet.files.wordpress.com/2022/06/flashpoint-beyond-2022-002-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "flashpoint-beyond-003", seriesId: "series-flashpoint-beyond", title: "Além do Flashpoint", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/vo9j4wj5juo489j/AlmFlashpoint_%25233_de_6_%25282022%2529%2528ZF-SQ%2529.cbr", coverUrl: "https://imgur.com/wyib378.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "flashpoint-beyond-004", seriesId: "series-flashpoint-beyond", title: "Além do Flashpoint", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/zb4tvs8r6mkymwr/AlmFlashpoint_%25234_de_6_%25282022%2529%2528ZF-SQ%2529.cbr", coverUrl: "https://imgur.com/MFXoJlE.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "flashpoint-beyond-005", seriesId: "series-flashpoint-beyond", title: "Além do Flashpoint", issue: "5", format: "cbr", fileUrl: "https://www.mediafire.com/file/zg9fldgq2tm709l/AlmFlashpoint_%25235_de_6_%25282022%2529%2528ZF-SQ%2529.cbr", coverUrl: "https://i.postimg.cc/Yq6tJRSk/Flashpoint-Beyond-2022-005-000a.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "flashpoint-beyond-006", seriesId: "series-flashpoint-beyond", title: "Além do Flashpoint", issue: "6", format: "cbr", fileUrl: "https://www.mediafire.com/file/8loa70vwvx4ize1/AlmFlashpoint_%25236_de_6_%25282022%2529%2528ZF-SQ%2529.cbr", coverUrl: "https://i.postimg.cc/6QDY085Y/Flashpoint-Beyond-2022-006-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "aquaman-the-becoming-001", seriesId: "series-aquaman-the-becoming", title: "Aquaman: O Emergir", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/g9l02orhctlumli/Aquaman_-_O_Emergir_001_%25282021%2529._%2528Zona_Fantasma%2529.cbr", coverUrl: "https://zonafantasmanet.files.wordpress.com/2022/02/aquaman-the-becoming-2021-001-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "aquaman-the-becoming-002", seriesId: "series-aquaman-the-becoming", title: "Aquaman: O Emergir", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/4kkoya16zu2kvr0/Aquaman_-_O_Emergir_02_de_06_%25282021%2529._%2528Zona_Fantasma%2529.cbr", coverUrl: "https://i.postimg.cc/XqLrFVsj/Aquaman-The-Becoming-2021-002-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "aquaman-the-becoming-003", seriesId: "series-aquaman-the-becoming", title: "Aquaman: O Emergir", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/vzl0enkba4hxgzv/Aquaman_-_O_Emergir_03_de_06_%25282021%2529._%2528ZF-SQ%2529.cbr", coverUrl: "https://imgur.com/BL8HX1P.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "aquaman-the-becoming-004", seriesId: "series-aquaman-the-becoming", title: "Aquaman: O Emergir", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/3o3urov6x7p0l6i/Aquaman_-_O_Emergir_04_de_06_%25282021%2529._%2528ZF-SQ%2529.cbr", coverUrl: "https://imgur.com/p3nWcc7.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "aquaman-the-becoming-005", seriesId: "series-aquaman-the-becoming", title: "Aquaman: O Emergir", issue: "5", format: "cbr", fileUrl: "https://www.mediafire.com/file/mwzwlxfjgamlyqo/Aquaman_-_O_Emergir_05_de_06_%25282021%2529._%2528ZF-SQ%2529.cbr", coverUrl: "https://imgur.com/rVhZIQ0.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "aquaman-the-becoming-006", seriesId: "series-aquaman-the-becoming", title: "Aquaman: O Emergir", issue: "6", format: "cbr", fileUrl: "https://www.mediafire.com/file/2pelulobugplopi/Aquaman_-_O_Emergir_06_de_06_%25282021%2529._%2528ZF-SQ%2529.cbr", coverUrl: "https://i.postimg.cc/rsKPf8fh/Aquaman-The-Becoming-2021-006-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-001", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/ly0n14h9tnsejto/Arlequina_001_%25282021%2529_%2528S%25C3%25B3Quadrinhos_e_Zona_Fantasma%2529.cbr", coverUrl: "https://i.ibb.co/2hTHbf2/Harley-Quinn-v01-No-Good-Deed-0016.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-002", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/nnrp5331rh4q97w/Arlequina_002_%25282021%2529_%2528S%25C3%25B3Quadrinhos_e_Zona_Fantasma%2529.cbr", coverUrl: "https://i.ibb.co/rcSbDB7/Harley-Quinn-v01-No-Good-Deed-0039.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-003", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/jixe3r7igaresw9/Arlequina_003_%25282021%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr/file", coverUrl: "https://i.postimg.cc/6q2N4CbR/001.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-004", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/6bs04wywpcweujt/Arlequina_004_%25282021%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", coverUrl: "https://i.postimg.cc/Y9xvZRY6/001.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-005", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "5", format: "cbr", fileUrl: "https://www.mediafire.com/file/9jimppm7c74jxxv/Arlequina_005_%25282021%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", coverUrl: "https://i.postimg.cc/QxDr7Wwn/001.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-006", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "6", format: "cbr", fileUrl: "https://www.mediafire.com/file/umnjf7qmgkn6e68/Arlequina_006_%25282021%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", coverUrl: "https://i.postimg.cc/1zVsxXqF/000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-007", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "7", format: "cbr", fileUrl: "https://www.mediafire.com/file/1l3266qp0q4gxqz/Arlequina_007_%25282021%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", coverUrl: "https://i.postimg.cc/8P4Wc602/000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-008", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "8", format: "cbr", fileUrl: "https://www.mediafire.com/file/a5k7gnfkj3ymw1d/Arlequina_008_%25282021%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", coverUrl: "https://i.postimg.cc/nLq2p36k/000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-009", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "9", format: "cbr", fileUrl: "https://www.mediafire.com/file/11n6qoo7y0ispax/Arlequina_009_%25282022%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", coverUrl: "https://i.postimg.cc/qv3G6Xds/000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-010", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "10", format: "cbr", fileUrl: "https://www.mediafire.com/file/97yimbiczk2urz4/Arlequina_%252310_%25282021%2529_%2528SQ%2529.cbr", coverUrl: "https://i.ibb.co/fzq3RG5b/000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-011", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "11", format: "cbr", fileUrl: "https://www.mediafire.com/file/0kj0bo6nitoxk0p/Arlequina_011_%25282022%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", coverUrl: "https://i.postimg.cc/2yzVk1Jg/000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-012", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "12", format: "cbr", fileUrl: "https://www.mediafire.com/file/l0uuopsqsj5wlc0/Arlequina_012_%25282022%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", coverUrl: "https://i.postimg.cc/3rCCqBrB/000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-013", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "13", format: "cbr", fileUrl: "https://www.mediafire.com/file/6ru2ivbk28bnh1c/Arlequina_013_%25282022%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", coverUrl: "https://i.postimg.cc/fLP86qf7/1%203.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-014", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "14", format: "cbr", fileUrl: "https://www.mediafire.com/file/b142fwnwjs2zizy/Arlequina_014_%25282022%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", coverUrl: "https://i.postimg.cc/nrQ3ZK3y/14.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-015", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "15", format: "cbr", fileUrl: "https://www.mediafire.com/file/0ibqdmbhze7yto2/Arlequina_015_%25282022%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", coverUrl: "https://i.postimg.cc/h4kBm2R7/15.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-016", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "16", format: "cbr", fileUrl: "https://www.mediafire.com/file/gocbrn4u1ecmckq/Arlequina_016_%25282022%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", coverUrl: "https://i.postimg.cc/gJm18FQk/016.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-017", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "17", format: "cbr", fileUrl: "https://www.mediafire.com/file/by9tw3zdx13can5/Arlequina_017_%25282022%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", coverUrl: "https://i.postimg.cc/NFJhQJNb/000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-018", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "18", format: "cbr", fileUrl: "https://www.mediafire.com/file/en3jl76pt2d6s3y/Arlequina_018_%25282022%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", coverUrl: "https://i.postimg.cc/PqbFbSqm/000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-019", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "19", format: "cbr", fileUrl: "https://www.mediafire.com/file/a0sj46laq88ngyr/Arlequina_019_%25282022%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", coverUrl: "https://i.postimg.cc/5Npxfdwg/000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-020", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "20", format: "cbr", fileUrl: "https://www.mediafire.com/file/su4560xu7ddv0q8/Arlequina_020_%25282022%2529_%2528S%25C3%25B3Quadrinhos%2529.cbr", coverUrl: "https://i.postimg.cc/RFg9B9F7/000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "harley-quinn-2021-annual", seriesId: "series-harley-quinn-2021", title: "Arlequina", issue: "Anuário", sortOrder: 6.5, format: "cbr", fileUrl: "https://www.mediafire.com/file/jqblivardbe7enx/HrlyQnnNl_%25232021_%25282021%2529_%2528DarkseidClub%2529.cbr", clicks: 0, featured: true, randomWeight: 5, collectionIds: [], coverUrl: "https://i.postimg.cc/7hhQHg1Z/Harley-Quinn-2021-Annual-2021-001-000.jpg" },
  { id: "green-arrow-2023-001", seriesId: "series-green-arrow-2023", title: "Arqueiro Verde", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/j6h6k2u8wqt0yot/ARQVRD%25231_%25282023%2529_%2528ZF-SQ%2529.cbr", coverUrl: "https://zonafantasmanet.files.wordpress.com/2023/05/green-arrow-001-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "green-arrow-2023-002", seriesId: "series-green-arrow-2023", title: "Arqueiro Verde", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/gddxf41p0942ghr/ARQVRD%25232_%25282023%2529_%2528ZF-SQ%2529.cbr", coverUrl: "https://i.postimg.cc/8cSNHP5c/Green-Arrow-002-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "green-arrow-2023-003", seriesId: "series-green-arrow-2023", title: "Arqueiro Verde", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/ys9u87dxy05kfuq/ARQVRD%25233_%25282023%2529_%2528ZF-SQ%2529.cbr", coverUrl: "https://i.postimg.cc/GmkGZXFH/00000b1.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "green-arrow-2023-004", seriesId: "series-green-arrow-2023", title: "Arqueiro Verde", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/op7e4jqur7j53ge/ARQVRD%25234_%25282023%2529_%2528ZF-SQ%2529.cbr", coverUrl: "https://i.postimg.cc/6pTJGGw4/Green-Arrow-004-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "black-manta-2021-001", seriesId: "series-black-manta-2021", title: "Arraia Negra", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/6qh9k28lfo9pk0r/Arraia_Negra_%252301_%25282021%2529_%2528SQ%2526ZF%2529.cbr", coverUrl: "https://i.imgur.com/nxfaGzX.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "black-manta-2021-002", seriesId: "series-black-manta-2021", title: "Arraia Negra", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/urvbq9fbxtbrxgt/Arraia_Negra_%252302_%25282021%2529_%2528SQ%2526ZF%2529.cbr", coverUrl: "https://i.imgur.com/uNJJ2dl.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "black-manta-2021-003", seriesId: "series-black-manta-2021", title: "Arraia Negra", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/pjrvk4e0spoj063/Arraia_Negra_%252303_%25282022%2529_%2528SQ%2526ZF%2529.cbr", coverUrl: "https://i.imgur.com/v4AJKZE.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "black-manta-2021-004", seriesId: "series-black-manta-2021", title: "Arraia Negra", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/hiilk5mpszt140w/Arraia_Negra_%252304_%25282022%2529_%2528SQ%2526ZF%2529.cbr", coverUrl: "https://i.imgur.com/MTOqYE3.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "black-manta-2021-005", seriesId: "series-black-manta-2021", title: "Arraia Negra", issue: "5", format: "cbr", fileUrl: "https://www.mediafire.com/file/5qhfh3nwcgb5chs/Arraia_Negra_%252305_%25282022%2529_%2528SQ%2526ZF%2529.cbr", coverUrl: "https://i.imgur.com/w08ZBEv.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "black-manta-2021-006", seriesId: "series-black-manta-2021", title: "Arraia Negra", issue: "6", format: "cbr", fileUrl: "https://www.mediafire.com/file/uvt3zkopstxcv0j/Arraia_Negra_%252306_%25282022%2529_%2528SQ%2526ZF%2529.cbr", coverUrl: "https://i.imgur.com/IVqIxqN.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "adventures-superman-jon-kent-001", seriesId: "series-adventures-superman-jon-kent", title: "As Aventuras do Superman – Jon Kent", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/578t8zr53utubqp/AdvSMJK%25231_%25282023%2529%2528ZF-SQ%2529.cbr", coverUrl: "https://i.postimg.cc/Jn3H5SRS/Adventures-of-Superman-Jon-Kent-2023-001-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "adventures-superman-jon-kent-002", seriesId: "series-adventures-superman-jon-kent", title: "As Aventuras do Superman – Jon Kent", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/ntulludq0b91poc/AdvSMJK%25232_%25282023%2529%2528ZF-SQ%2529.cbr", coverUrl: "https://i.postimg.cc/DZhG5JSP/Adventures-of-Superman-Jon-Kent-2023-002-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "adventures-superman-jon-kent-003", seriesId: "series-adventures-superman-jon-kent", title: "As Aventuras do Superman – Jon Kent", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/8dha86k7rfm3x2s/AdvSMJK%25233_%25282023%2529%2528ZF-SQ%2529.cbr", coverUrl: "https://i.postimg.cc/mkwJq3CG/Adventures-of-Superman-Jon-Kent-2023-003-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "adventures-superman-jon-kent-004", seriesId: "series-adventures-superman-jon-kent", title: "As Aventuras do Superman – Jon Kent", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/blgq99nk6xpknfw/AdvSMJK%25234_%25282023%2529%2528ZF-SQ%2529.cbr", coverUrl: "https://i.postimg.cc/h4XGDJWL/Adventures-of-Superman-Jon-Kent-2023-004-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "adventures-superman-jon-kent-005", seriesId: "series-adventures-superman-jon-kent", title: "As Aventuras do Superman – Jon Kent", issue: "5", format: "cbr", fileUrl: "https://www.mediafire.com/file/tqxqqbnkv33efv0/AdvSMJK%25235_%25282023%2529%2528ZF-SQ%2529.cbr", coverUrl: "https://i.postimg.cc/cCftVc2s/00000a.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "adventures-superman-jon-kent-006", seriesId: "series-adventures-superman-jon-kent", title: "As Aventuras do Superman – Jon Kent", issue: "6", format: "cbr", fileUrl: "https://www.mediafire.com/file/rgby1k1h43jlimt/AdvSMJK%25236_%25282023%2529%2528ZF-SQ%2529.cbr", coverUrl: "https://i.postimg.cc/jdxQXVQh/00000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-beyond-neo-year-2022-001", seriesId: "series-batman-beyond-neo-year-2022", title: "Batman do Futuro – NeoAno", issue: "1", volume: "Volume 1", volumeTitle: "Batman do Futuro – NeoAno (2022)", format: "cbr", fileUrl: "https://www.mediafire.com/file/q31p6z9xsftx2it/Batman_do_Futuro_-_NeoAno_%252301_%25282022%2529_%2528SQ-ZF%2529.cbr/file", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-beyond-neo-year-2022-002", seriesId: "series-batman-beyond-neo-year-2022", title: "Batman do Futuro – NeoAno", issue: "2", volume: "Volume 1", volumeTitle: "Batman do Futuro – NeoAno (2022)", format: "cbr", fileUrl: "https://www.mediafire.com/file/4n2j8sxxktzwssa/Batman_do_Futuro_-_NeoAno_%252302_%25282022%2529_%2528SoQuadrinhos%2529.cbr/file", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-beyond-neo-year-2022-003", seriesId: "series-batman-beyond-neo-year-2022", title: "Batman do Futuro – NeoAno", issue: "3", volume: "Volume 1", volumeTitle: "Batman do Futuro – NeoAno (2022)", format: "cbr", fileUrl: "https://www.mediafire.com/file/husrr8mxt05fjqy/Batman_do_Futuro_-_NeoAno_%252303_%25282022%2529_%2528SoQuadrinhos%2529.cbr/file", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-beyond-neo-year-2022-004", seriesId: "series-batman-beyond-neo-year-2022", title: "Batman do Futuro – NeoAno", issue: "4", volume: "Volume 1", volumeTitle: "Batman do Futuro – NeoAno (2022)", format: "cbr", fileUrl: "https://www.mediafire.com/file/hif68jxpc70j9gq/Batman_do_Futuro_-_NeoAno_%252304_%25282022%2529_%2528SoQuadrinhos%2529.cbr/file", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-beyond-neo-year-2022-005", seriesId: "series-batman-beyond-neo-year-2022", title: "Batman do Futuro – NeoAno", issue: "5", volume: "Volume 1", volumeTitle: "Batman do Futuro – NeoAno (2022)", format: "cbz", fileUrl: "https://www.mediafire.com/file/60clxb3w9typa2b/Batman_do_Futuro_-_NeoAno_%252305_%25282022%2529_%2528SoQuadrinhos%2529.cbz/file", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-beyond-neo-year-2022-006", seriesId: "series-batman-beyond-neo-year-2022", title: "Batman do Futuro – NeoAno", issue: "6", volume: "Volume 1", volumeTitle: "Batman do Futuro – NeoAno (2022)", format: "cbz", fileUrl: "https://www.mediafire.com/file/wp4nof0ss99l7dz/Batman_do_Futuro_-_NeoAno_%252306_%25282022%2529_%2528SoQuadrinhos%2529.cbz/file", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-beyond-neo-year-2023-001", seriesId: "series-batman-beyond-neo-year-2022", title: "Batman do Futuro – Neogótico", issue: "1", volume: "Volume 2", volumeTitle: "Batman do Futuro – Neogótico (2023)", year: 2023, format: "cbz", fileUrl: "https://www.mediafire.com/file/ez1fgo52uxaua2g/Batman_do_Futuro_-_Neog%25C3%25B3tico_%252301_%25282023%2529_%2528SoQuadrinhos%2529.cbz/file", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-vs-robin-2022-001", seriesId: "series-batman-vs-robin-2022", title: "Batman vs Robin", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/7327s4k1wo3zuua/BvsR%25231_%25282023%2529%2528ZF-SQ%2529.cbr/file", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-vs-robin-2022-002", seriesId: "series-batman-vs-robin-2022", title: "Batman vs Robin", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/7zfc9yniqpu37am/BvsR%25232_%25282023%2529%2528ZF-SQ%2529.cbr/file", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-vs-robin-2022-003", seriesId: "series-batman-vs-robin-2022", title: "Batman vs Robin", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/ku8jnyso6995g8j/BvsR%25233_%25282023%2529%2528ZF-SQ%2529.cbr/file", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-vs-robin-2022-004", seriesId: "series-batman-vs-robin-2022", title: "Batman vs Robin", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/a71fqbkv3b4f8i2/BvsR%25234_%25282023%2529%2528ZF-SQ%2529.cbr/file", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-vs-robin-2022-005", seriesId: "series-batman-vs-robin-2022", title: "Batman vs Robin", issue: "5", format: "cbr", fileUrl: "https://www.mediafire.com/file/ryfmnkqu9cdkppf/BvsR%25235_%25282023%2529%2528ZF-SQ%2529.cbr/file", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batman-and-robin-2023-001", seriesId: "series-batman-and-robin-2023", title: "Batman e Robin", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/e6sneveaqoe3tz9/Bat%2526Rbn%25231%25282023%2529%2528ZF-SQ%2529.cbr/file", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batgirls-2022-001", seriesId: "series-batgirls-2022", title: "Batgirls", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/zyjqffnbh0dafq8/Batgirls_001_%25282022%2529_%2528SQ_e_ZF%2529.cbr/file", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batgirls-2022-002", seriesId: "series-batgirls-2022", title: "Batgirls", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/dfezvxjspqpd3bh/Batgirls_%252302_%25282022%2529_%2528SQ%2529.cbr/file", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batgirls-2022-003", seriesId: "series-batgirls-2022", title: "Batgirls", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/p10dyqs0svprkrk/Batgirls_%252303_%25282022%2529_%2528SQ%2529.cbr/file", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batgirls-2022-004", seriesId: "series-batgirls-2022", title: "Batgirls", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/ioohy4snr5lkq31/Batgirls_%252304_%25282022%2529_%2528SQ%2529.cbr/file", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batgirls-2022-005", seriesId: "series-batgirls-2022", title: "Batgirls", issue: "5", format: "cbr", fileUrl: "https://www.mediafire.com/file/79195nn16nawutk/Batgirls_%252305_%25282022%2529_%2528SQ%2529.cbr/file", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batgirls-2022-006", seriesId: "series-batgirls-2022", title: "Batgirls", issue: "6", format: "cbr", fileUrl: "https://www.mediafire.com/file/7d21drby9cbcg2v/Batgirls_%252306_%25282022%2529_%2528SQ%2529.cbr/file", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "batgirls-2022-007", seriesId: "series-batgirls-2022", title: "Batgirls", issue: "7", format: "cbr", fileUrl: "https://www.mediafire.com/file/ej6nueemgmnpb7s/Batgirls_%252307_%25282022%2529_%2528SQ%2529.cbr/file", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "birds-of-prey-2023-001", seriesId: "series-birds-of-prey-2023", title: "Aves de Rapina", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/5wx9gl445qa5rr2/Aves_de_Rapina_001_%25282023%2529_%2528SQ_%2526_ZF%2529.cbr", coverUrl: "https://i.ibb.co/K00YrPZ/Birds-of-Prey-001-000.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "jurassic-league-2022-001", seriesId: "series-jurassic-league-2022", title: "A Liga Jurássica", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/0leks3eaemv2rvj/A_Liga_Jur%25C3%25A1ssica_%252301_%25282022%2529_%2528SQ%2526ZF%2529.cbr/file", telegramUrl: "", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "jurassic-league-2022-002", seriesId: "series-jurassic-league-2022", title: "A Liga Jurássica", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/8p3xpgh3h0mghx6/A_Liga_Jur%25C3%25A1ssica_%252302_%25282022%2529_%2528SQ%2526ZF%2529.cbr/file", telegramUrl: "", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "jurassic-league-2022-003", seriesId: "series-jurassic-league-2022", title: "A Liga Jurássica", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/bjwp2iib4kxifzw/A_Liga_Jur%25C3%25A1ssica_%252303_%25282022%2529_%2528SQ%2526ZF%2529.cbr/file", telegramUrl: "", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "jurassic-league-2022-004", seriesId: "series-jurassic-league-2022", title: "A Liga Jurássica", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/0bi55zmk06m6b0j/A_Liga_Jur%25C3%25A1ssica_%252304_%25282022%2529_%2528SQ%2526ZF%2529.cbr/file", telegramUrl: "", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "jurassic-league-2022-005", seriesId: "series-jurassic-league-2022", title: "A Liga Jurássica", issue: "5", format: "cbr", fileUrl: "https://www.mediafire.com/file/d0dn8gnu0ve11ob/A_Liga_Jur%25C3%25A1ssica_%252305_%25282022%2529_%2528SQ%2526ZF%2529.cbr/file", telegramUrl: "", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "jurassic-league-2022-006", seriesId: "series-jurassic-league-2022", title: "A Liga Jurássica", issue: "6", format: "cbr", fileUrl: "https://www.mediafire.com/file/gw0wsb0j59q4t3l/A_Liga_Jur%25C3%25A1ssica_%252306_%25282022%2529_%2528SQ%2526ZF%2529.cbr/file", telegramUrl: "", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "unstoppable-doom-patrol-2023-001", seriesId: "series-unstoppable-doom-patrol-2023", title: "A Imparável Patrulha do Destino", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/b1ruyziki50qvrc/PtrlhDstn%25231_%25282023%2529_%2528ZF-SQ%2529.cbr/file", telegramUrl: "", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "fury-of-firestorm-2026-001", seriesId: "series-fury-of-firestorm-2026", title: "A Fúria do Nuclear", issue: "1", format: "cbr", fileUrl: "https://www.mediafire.com/file/gtd5s53thh9oqvf/A+F%C3%BAria+do+Nuclear+%2301+%282026%29+%28SoQuadrinhos%29.cbr/file", coverUrl: "https://i.ibb.co/jvY390LF/nuclear1.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "fury-of-firestorm-2026-002", seriesId: "series-fury-of-firestorm-2026", title: "A Fúria do Nuclear", issue: "2", format: "cbr", fileUrl: "https://www.mediafire.com/file/x0b1vr8l7duit9i/A+F%C3%BAria+do+Nuclear+%2302+%282026%29+%28SoQuadrinhos%29.cbr/file", coverUrl: "https://i.ibb.co/n8Yyb1bq/nuclear2.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "fury-of-firestorm-2026-003", seriesId: "series-fury-of-firestorm-2026", title: "A Fúria do Nuclear", issue: "3", format: "cbr", fileUrl: "https://www.mediafire.com/file/j7osac1eaizr7cv/A+F%C3%BAria+do+Nuclear+%2303+%282026%29+%28SoQuadrinhos%29.cbr/file", coverUrl: "https://i.ibb.co/PGRSKxky/nuclear3.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "fury-of-firestorm-2026-004", seriesId: "series-fury-of-firestorm-2026", title: "A Fúria do Nuclear", issue: "4", format: "cbr", fileUrl: "https://www.mediafire.com/file/htnfmlzv392x6h6/A+F%C3%BAria+do+Nuclear+%2304+%282026%29+%28SoQuadrinhos%29.cbr/file", coverUrl: "https://i.ibb.co/PzGMgHHs/nuclear4.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },
  { id: "fury-of-firestorm-2026-005", seriesId: "series-fury-of-firestorm-2026", title: "A Fúria do Nuclear", issue: "5", format: "cbr", fileUrl: "https://www.mediafire.com/file/cq5eyd3n7thbx4f/A+F%C3%BAria+do+Nuclear+%2305+%282026%29+%28SoQuadrinhos%29.cbr/file", coverUrl: "https://i.postimg.cc/pXCRFdpv/nuclear5.jpg", clicks: 0, featured: true, randomWeight: 5, collectionIds: [] },

  
];

window.DEFAULT_LIBRARY.filter(item => item.seriesId === "series-justice-godzilla-kong-2023").forEach((item, index) => {
  const volume = index < 7 ? "Volume 1" : "Volume 2";
  item.volume = volume;
  item.issue = String(index < 7 ? index + 1 : index - 6);
  item.volumeTitle = index < 7
    ? "Liga da Justi\u00e7a vs. Godzilla vs. Kong (2023)"
    : "Liga da Justi\u00e7a vs. Godzilla vs. Kong 2 (2025)";
});
const justiceGodzillaEight = window.DEFAULT_LIBRARY.find(item => item.id === "series-justice-godzilla-kong-2023-08");
if (justiceGodzillaEight) justiceGodzillaEight.fileUrl = "https://mega.nz/file/XNISCRga#5NQNVbiHZER9AT6iE-8KG7nOEWBR3bpk2XxWKhFNO9s";
window.DEFAULT_LIBRARY.filter(item => item.seriesId === "series-trial-amazons-2022").forEach((item, index) => {
  const isPrelude = index < 4;
  item.volume = isPrelude ? "Volume 1" : "Volume 2";
  item.volumeTitle = isPrelude ? "Estrada para O Julgamento das Amazonas" : "O Julgamento das Amazonas";
  item.issue = ["781", "782", "783", "784", "01", "02"][index];
});

const COVER_URL_OVERRIDES = {
  "jurassic-league-2022-001": "https://i.imgur.com/KLzDluQ.jpg",
  "jurassic-league-2022-002": "https://i.imgur.com/y3gTJtw.jpg",
  "jurassic-league-2022-003": "https://i.imgur.com/CYABUc0.jpg",
  "jurassic-league-2022-004": "https://i.imgur.com/Ohd67n2.jpg",
  "jurassic-league-2022-005": "https://i.imgur.com/hCQeDPY.jpg",
  "jurassic-league-2022-006": "https://i.imgur.com/nZ3mOqO.jpg",
  "unstoppable-doom-patrol-2023-001": "https://i.postimg.cc/L6dg3L1v/Unstoppable-Doom-Patrol-001-000.jpg",
  "death-of-superman-30th-anniversary-001": "https://i.postimg.cc/15Z7jkLS/The-Death-of-Superman-30th-Anniversary-Special-2022-001-000.jpg",
  "new-champion-of-shazam-001": "https://i.postimg.cc/Hn9qH4tm/The-New-Champion-of-Shazam-2022-001-000-copiar.jpg",
  "new-golden-age-001": "https://i.postimg.cc/2SRnT5DC/The-New-Golden-Age-001-000.jpg",
  "batgirls-2022-001": "https://imgur.com/Fl8Y7JR.jpg",
  "batgirls-2022-002": "https://i.postimg.cc/nLsSw-pf4/000.jpg",
  "batgirls-2022-003": "https://i.postimg.cc/Y9WVjkXr/000.jpg",
  "batgirls-2022-004": "https://i.postimg.cc/Bb1JHs5k/000.jpg",
  "batgirls-2022-005": "https://i.postimg.cc/KYvkLk1W/000.jpg",
  "batgirls-2022-006": "https://i.postimg.cc/SxmJF2fK/000.jpg",
  "batgirls-2022-007": "https://i.postimg.cc/wMzgwXRK/000.jpg",
  "batman-beyond-neo-year-2022-001": "https://i.ibb.co/rbnKfx0/Bd-FNA01-001.jpg",
  "batman-beyond-neo-year-2022-002": "https://i.postimg.cc/kXJn3k24/Bd-FNA02-001.jpg",
  "batman-beyond-neo-year-2022-003": "https://i.postimg.cc/yN5zVW6d/Bd-F03-001.jpg",
  "batman-beyond-neo-year-2022-004": "https://i.postimg.cc/4dwf5nQ4/BdFNA4-0.jpg",
  "batman-beyond-neo-year-2022-005": "https://i.postimg.cc/sxtnQYCk/Bd-FNA5-001.jpg",
  "batman-beyond-neo-year-2022-006": "https://i.postimg.cc/0jHxwKmM/Bd-FNA6-001.jpg",
  "batman-beyond-neo-year-2023-001": "https://i.postimg.cc/gjTjzrWp/Bd-FNG1-001.jpg",
  "batman-and-robin-2023-001": "https://i.postimg.cc/xjyr92vk/00000.jpg",
  "batman-vs-robin-2022-001": "https://i.postimg.cc/cH7sFQ7y/Batman-vs-Robin-2022-001-000.jpg",
  "batman-vs-robin-2022-002": "https://i.postimg.cc/gc5nYjz7/Batman-vs-Robin-2022-002-000.jpg",
  "batman-vs-robin-2022-003": "https://i.postimg.cc/GhMPL6pW/Batman-vs-Robin-2022-003-000.jpg",
  "batman-vs-robin-2022-004": "https://i.postimg.cc/Y2yN3t20/Batman-vs-Robin-2022-004-000.jpg",
  "batman-vs-robin-2022-005": "https://i.postimg.cc/fbPSnsm2/Batman-vs-Robin-2022-005-000.jpg"
};

window.DEFAULT_LIBRARY.forEach((item) => {
  if (COVER_URL_OVERRIDES[item.id]) item.coverUrl = COVER_URL_OVERRIDES[item.id];
});

window.DEFAULT_COLLECTIONS = [
  
];
