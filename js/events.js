// js/events.js

/**
 * Definições de todos os eventos aleatórios do jogo.
 * Cada evento agora possui uma propriedade 'condicao' que determina se ele pode ser disparado.
 */

// Função auxiliar para selecionar um personagem aleatório no abrigo
const getRandomPersonagemNoAbrigo = (state) => {
    const personagensNoAbrigo = state.getEstado().personagens.filter(p => p.vivo && !p.emExpedicao);
    if (personagensNoAbrigo.length === 0) return null;
    return personagensNoAbrigo[Math.floor(Math.random() * personagensNoAbrigo.length)];
};


export const eventos = [
    // --- EVENTOS ORIGINAIS (AGORA COM 'condicao') ---
    {
        id: 'lobanha_beast',
        titulo: 'A Besta Obesa',
        condicao: () => true, // Evento pode ocorrer a qualquer momento
        descricao: 'Um barulho pesado ecoa lá fora. Espiando, vocês veem uma criatura enorme, o Lobanha, farejando em busca de comida.',
        urlImagem: 'https://placehold.co/350x180/795548/FF5722?text=Lobanha!&font=specialelite',
        escolhas: [
            {
                texto: 'Jogar uma Lata de Feijão',
                acao: (ctx) => {
                    const { state, ui, registrarLog, proximaAcao } = ctx;
                    if (state.getEstado().inventario.includes('Lata de Feijão')) {
                        state.removerItemInventario('Lata de Feijão');
                        if (Math.random() < 0.8) {
                            state.atualizarMoralTodosAbrigo(5);
                            registrarLog('Distraíram o Lobanha com uma Lata de Feijão.');
                            ui.mostrarMensagemResultado('Distração!', 'A criatura abocanha a lata e se afasta, satisfeita. Que alívio! (+5 de moral).', proximaAcao);
                        } else {
                            state.getEstado().comida -= 5;
                            state.atualizarMoralTodosAbrigo(-10);
                            registrarLog('O Lobanha comeu o feijão e invadiu para roubar mais comida.');
                            ui.mostrarMensagemResultado('Aperitivo!', 'O feijão só abriu o apetite dele. A criatura força a entrada, rouba 5 de comida e vai embora. (-10 de moral).', proximaAcao);
                        }
                    } else {
                        ui.mostrarMensagemResultado('Item faltando', 'Você não tem uma Lata de Feijão para jogar.', proximaAcao);
                    }
                }
            },
            {
                texto: 'Atacar com o que tiverem!',
                acao: (ctx) => {
                    const { state, ui, registrarLog, proximaAcao } = ctx;
                    const personagem = getRandomPersonagemNoAbrigo(state);
                    if (!personagem) {
                        ui.mostrarMensagemResultado('Ninguém para lutar', 'Não há ninguém no abrigo para lutar.', proximaAcao);
                        return;
                    }
                    if (state.getEstado().inventario.includes('Machado')) {
                        personagem.status = 'Levemente Ferido';
                        state.atualizarMoralPersonagem(personagem.id, -15);
                        registrarLog(`${personagem.nome} se feriu levemente ao lutar com o Lobanha.`);
                        ui.mostrarMensagemResultado('Luta Difícil', `Vocês afugentam a criatura, mas ${personagem.nome} fica Levemente Ferido na luta (-15 de moral para ${personagem.nome}).`, proximaAcao);
                    } else {
                        personagem.status = 'Gravemente Ferido';
                        state.atualizarMoralPersonagem(personagem.id, -30);
                        state.atualizarMoralTodosAbrigo(-10);
                        registrarLog(`${personagem.nome} ficou gravemente ferido ao enfrentar o Lobanha sem armas.`);
                        ui.mostrarMensagemResultado('Massacre!', `Sem uma arma decente, o ataque é um desastre. O Lobanha fere ${personagem.nome} gravemente antes de ir embora. (-30 de moral para ${personagem.nome}, -10 para os outros).`, proximaAcao);
                    }
                }
            },
            {
                texto: 'Fazer silêncio absoluto',
                acao: (ctx) => {
                    const { state, ui, registrarLog, proximaAcao } = ctx;
                     if (Math.random() < 0.6) {
                        registrarLog('Fizeram silêncio e a criatura foi embora.');
                        ui.mostrarMensagemResultado('Passou...', 'Vocês prendem a respiração. Após minutos que parecem uma eternidade, os passos pesados se afastam.', proximaAcao);
                    } else {
                        state.atualizarMoralTodosAbrigo(-5);
                        registrarLog('Alguém espirrou, assustando a todos.');
                        ui.mostrarMensagemResultado('Que Susto!', 'Alguém não consegue segurar um espirro! O barulho não atrai a criatura, mas o susto faz a moral de todos cair (-5).', proximaAcao);
                    }
                }
            },
            {
                texto: 'Gritar e fazer barulho',
                acao: (ctx) => {
                    const { state, ui, registrarLog, proximaAcao } = ctx;
                    state.getEstado().agua -= 4;
                    state.atualizarMoralTodosAbrigo(-20);
                    registrarLog('Gritaram com o Lobanha, o que o irritou e o fez danificar o abrigo.');
                    ui.mostrarMensagemResultado('Péssima Ideia!', 'A criatura se enfurece com o barulho, bate contra o abrigo, danificando seu sistema de coleta de água (-4 de água) e aterrorizando a todos (-20 de moral).', proximaAcao);
                }
            }
        ]
    },
    {
        id: 'maya_bunker_leader',
        titulo: 'A Soberana do Bunker 7',
        condicao: () => true,
        descricao: 'Vocês recebem uma convocação: Maya, a imponente líder do Bunker 7, exige uma audiência.',
        urlImagem: 'https://placehold.co/350x180/4A148C/FFFFFF?text=Maya&font=specialelite',
        escolhas: [
            {
                texto: 'Oferecer a Coleira de Cachorro',
                acao: (ctx) => {
                    const { state, ui, registrarLog, proximaAcao } = ctx;
                    if (state.getEstado().inventario.includes('Coleira de Cachorro')) {
                        state.removerItemInventario('Coleira de Cachorro');
                        state.adicionarItemInventario('Kit Médico');
                        state.getEstado().comida += 5;
                        state.atualizarMoralTodosAbrigo(20);
                        registrarLog('Ofereceram a Coleira de Cachorro para Maya e foram recompensados.');
                        ui.mostrarMensagemResultado('Presente Inesperado', 'Os olhos de Maya brilham. "Para meu cão de guarda." Ela os recompensa com 1 Kit Médico, 5 de comida e sua aprovação (+20 de moral).', proximaAcao);
                    } else {
                        ui.mostrarMensagemResultado('Item faltando', 'Você não tem uma Coleira de Cachorro para oferecer.', proximaAcao);
                    }
                }
            },
            {
                texto: 'Pedir por suprimentos',
                acao: (ctx) => {
                    const { state, ui, registrarLog, proximaAcao } = ctx;
                    if (Math.random() < 0.25) {
                        state.getEstado().comida += 3;
                        state.atualizarMoralTodosAbrigo(5);
                        registrarLog('Pediram suprimentos a Maya e, surpreendentemente, receberam.');
                        ui.mostrarMensagemResultado('Caridade Desdenhosa', 'Maya ri. "Patético." Ela joga 3 de comida em sua direção. É humilhante, mas é comida (+5 de moral).', proximaAcao);
                    } else {
                        state.atualizarMoralTodosAbrigo(-5);
                        registrarLog('Foram humilhados por Maya ao pedir suprimentos.');
                        ui.mostrarMensagemResultado('Humilhação', 'Ela os encara com desprezo. "Acha que isto é caridade?" Vocês são expulsos de mãos vazias (-5 de moral).', proximaAcao);
                    }
                }
            },
            {
                texto: 'Perguntar sobre outros sobreviventes',
                acao: (ctx) => {
                    const { state, ui, registrarLog, proximaAcao } = ctx;
                    if (state.getEstado().inventario.includes('Mapa da Região')) {
                         state.atualizarMoralTodosAbrigo(3);
                         registrarLog('Perguntaram sobre sobreviventes e Maya marcou uma localização no mapa.');
                         ui.mostrarMensagemResultado('Informação Útil', 'Maya marca um ponto de interesse em seu Mapa da Região. "Talvez encontrem algo útil lá." (+3 de moral).', proximaAcao);
                    } else {
                         registrarLog('Receberam uma informação vaga sobre outros sobreviventes.');
                         ui.mostrarMensagemResultado('Informação Vaga', 'Sem um mapa, a informação dela é inútil. "Há pessoas por aí. Boa sorte."', proximaAcao);
                    }
                }
            },
            {
                texto: 'Tentar roubar algo',
                acao: (ctx) => {
                    const { state, ui, registrarLog, proximaAcao } = ctx;
                    const personagem = getRandomPersonagemNoAbrigo(state);
                    if (!personagem) {
                        ui.mostrarMensagemResultado('Ninguém para a ação', 'Não há ninguém no abrigo para tentar.', proximaAcao);
                        return;
                    }
                    personagem.status = 'Levemente Ferido';
                    state.atualizarMoralPersonagem(personagem.id, -25);
                    state.atualizarMoralTodosAbrigo(-10);
                    registrarLog(`${personagem.nome} foi pego roubando e ficou ferido.`);
                    ui.mostrarMensagemResultado('Pego no Ato!', `A tentativa é patética. ${personagem.nome} é pego e os guardas o ferem levemente como aviso. A humilhação é imensa (-25 de moral para ${personagem.nome}, -10 para os outros).`, proximaAcao);
                }
            }
        ]
    },
    // ... (outros eventos originais com condicao: () => true)

    // --- ARCO DE EVENTOS DE SARAJANE ---
    // Cada evento só pode acontecer se o anterior já ocorreu.
    // Adicionamos uma chance (Math.random) para não acontecerem em dias seguidos.

    // 1. A Caminhoneira Canina (Início da Quest)
    {
        id: 'sarajane_trucker_dog',
        titulo: 'A Caminhoneira Canina',
        condicao: (state) => state.getEstado().progressoSarajane === 0,
        descricao: 'Uma cachorra durona chamada Sarajane para seu caminhão perto do abrigo. "Preciso de uma Peça de Motor", ela late. "Alguém pode ajudar?"',
        urlImagem: 'https://placehold.co/350x180/8D6E63/FFFFFF?text=Sarajane&font=specialelite',
        escolhas: [
            {
                texto: 'Oferecer a Peça de Motor',
                acao: (ctx) => {
                    const { state, ui, registrarLog, proximaAcao } = ctx;
                    if (state.getEstado().inventario.includes('Peça de Motor')) {
                        state.removerItemInventario('Peça de Motor');
                        state.getEstado().comida += 10;
                        state.getEstado().agua += 10;
                        state.atualizarMoralTodosAbrigo(15);
                        state.getEstado().progressoSarajane = 1; // Avança a quest
                        registrarLog('Trocaram a Peça de Motor com Sarajane por muitos suprimentos.');
                        ui.mostrarMensagemResultado('Troca excelente!', 'Sarajane agradece e, como recompensa, te dá 10 de comida e 10 de água. A moral de todos aumenta (+15).', proximaAcao);
                    } else {
                        ui.mostrarMensagemResultado('Item faltando', 'Você não tem uma Peça de Motor para oferecer.', proximaAcao);
                    }
                }
            },
            {
                texto: 'Tentar enganá-la com outra coisa',
                acao: (ctx) => {
                    const { state, ui, registrarLog, proximaAcao } = ctx;
                    if (Math.random() < 0.6) {
                        state.atualizarMoralTodosAbrigo(-8);
                        registrarLog('Tentaram enganar Sarajane, mas ela percebeu e foi embora, desapontada.');
                        ui.mostrarMensagemResultado('Enganação falhou', 'Ela percebe sua tentativa. "Não me façam de boba." Ela vai embora, e a moral de todos cai (-8).', proximaAcao);
                    } else {
                        state.getEstado().agua -= 2;
                        state.atualizarMoralTodosAbrigo(-12);
                        registrarLog('Sarajane ficou irritada com a tentativa de enganação e roubou água.');
                        ui.mostrarMensagemResultado('Irritada!', 'Ela não só percebe, como fica irritada. "Acha que sou idiota?" Ela pega 2 de água à força e vai embora. A moral despenca (-12).', proximaAcao);
                    }
                    state.getEstado().progressoSarajane = 1; // Avança a quest
                }
            },
            {
                texto: 'Dizer que não tem e pedir ajuda',
                acao: (ctx) => {
                    const { state, ui, registrarLog, proximaAcao } = ctx;
                    if (Math.random() < 0.4) {
                        state.getEstado().agua += 2;
                        state.atualizarMoralTodosAbrigo(5);
                        registrarLog('Pediram ajuda a Sarajane e ela foi simpática.');
                        ui.mostrarMensagemResultado('Gesto de Bondade', 'Ela entende a situação. "Tempos difíceis." Ela te dá 3 de água antes de partir. A moral de todos sobe (+5).', proximaAcao);
                    } else {
                        state.atualizarMoralTodosAbrigo(-2);
                        registrarLog('Sarajane foi embora sem ajudar.');
                        ui.mostrarMensagemResultado('Sem Sorte', 'Ela simplesmente dá de ombros e vai embora procurar em outro lugar. A oportunidade perdida pesa na moral (-2).', proximaAcao);
                    }
                    state.getEstado().progressoSarajane = 1; // Avança a quest
                }
            }
        ]
    },

    // 2. A Vira-lata de Palavra
    {
        id: 'sarajane_payback',
        titulo: 'A Vira-lata de Palavra',
        condicao: (state) => state.getEstado().progressoSarajane === 1 && Math.random() < 0.5,
        descricao: 'O motor do caminhão de Sarajane ruge do lado de fora. Ela voltou. A porta da caçamba bate, e ela se aproxima com um olhar determinado.',
        urlImagem: 'https://placehold.co/350x180/8D6E63/FFFFFF?text=Dívida+Paga&font=specialelite',
        escolhas: [
            {
                texto: '"Vim pagar o que devo."',
                acao: (ctx) => {
                    const { state, ui, registrarLog, proximaAcao } = ctx;
                    state.adicionarItemInventario('Pé de Cabra');
                    state.getEstado().comida += 3;
                    state.atualizarMoralTodosAbrigo(10);
                    state.getEstado().progressoSarajane = 2; // Avança a quest
                    registrarLog('Sarajane retornou para pagar a ajuda com um Pé de Cabra e comida.');
                    ui.mostrarMensagemResultado('Honra da Matilha', 'Ela joga um Pé de Cabra aos seus pés. "Um bom cão paga suas dívidas." (+10 de moral).', proximaAcao);
                }
            },
            {
                texto: '"Achou que eu tinha esquecido?"',
                acao: (ctx) => {
                    const { state, ui, registrarLog, proximaAcao } = ctx;
                    state.getEstado().agua -= 4;
                    state.atualizarMoralTodosAbrigo(-15);
                    state.getEstado().progressoSarajane = 2; // Avança a quest
                    registrarLog('Sarajane voltou para se vingar e levou água.');
                    ui.mostrarMensagemResultado('Vingança Servida Fria', '"Ninguém me faz de otária." Ela sabota seu coletor de chuva, custando 4 de água. A moral despenca (-15).', proximaAcao);
                }
            }
        ]
    },

    // 3. Negócios da Matilha
    {
        id: 'sarajane_trade_offer',
        titulo: 'Negócios da Matilha',
        condicao: (state) => state.getEstado().progressoSarajane === 2 && Math.random() < 0.6,
        descricao: 'Sarajane encosta seu caminhão no abrigo. "Tenho tralha boa hoje. Mas não é de graça."',
        urlImagem: 'https://placehold.co/350x180/BCAAA4/000000?text=Troca-troca&font=specialelite',
        escolhas: [
            {
                texto: 'Trocar Uísque por Munição',
                acao: (ctx) => {
                    const { state, ui, registrarLog, proximaAcao } = ctx;
                    if (state.getEstado().inventario.includes('Garrafa de Uísque')) {
                        state.removerItemInventario('Garrafa de Uísque');
                        state.adicionarItemInventario('Munição (3)');
                        state.getEstado().progressoSarajane = 3;
                        registrarLog('Trocaram a Garrafa de Uísque por Munição.');
                        ui.mostrarMensagemResultado('Troca Justa', 'Ela pega a garrafa. "Agora estamos falando." Ela joga um pente de Munição (3) para você.', proximaAcao);
                    } else {
                        ui.mostrarMensagemResultado('Item Faltando', 'Você não tem uma Garrafa de Uísque.', proximaAcao);
                    }
                }
            },
            {
                texto: 'Recusar a oferta',
                acao: (ctx) => {
                    const { state, ui, registrarLog, proximaAcao } = ctx;
                    state.getEstado().progressoSarajane = 3;
                    registrarLog('Recusaram as ofertas de Sarajane.');
                    ui.mostrarMensagemResultado('Negócios Encerrados', 'Ela dá de ombros e fecha a caçamba. "Sua perda." E vai embora.', proximaAcao);
                }
            }
        ]
    },
    
    // ... E assim por diante para todos os eventos da Sarajane
    // 4. Encrenca na Estrada
    {
        id: 'sarajane_in_trouble',
        titulo: 'Encrenca na Estrada',
        condicao: (state) => state.getEstado().progressoSarajane === 3 && Math.random() < 0.4,
        descricao: 'Vocês ouvem um rosnado de dor. É Sarajane, mancando, com um ferimento feio na perna. "Fui pega por uma daquelas... coisas. Preciso de ajuda."',
        urlImagem: 'https://placehold.co/350x180/BF360C/FFFFFF?text=Ferida!&font=specialelite',
        escolhas: [
            {
                texto: 'Usar o Kit Médico para ajudá-la',
                acao: (ctx) => {
                    const { state, ui, registrarLog, proximaAcao } = ctx;
                    if (state.getEstado().inventario.includes('Kit Médico')) {
                        state.removerItemInventario('Kit Médico');
                        state.atualizarMoralTodosAbrigo(20);
                        state.getEstado().progressoSarajane = 4;
                        registrarLog('Ajudaram Sarajane com um Kit Médico.');
                        ui.mostrarMensagemResultado('Dívida de Sangue', 'Ela range os dentes durante o curativo. "Odeio dever favores... mas este eu não vou esquecer." (+20 de moral).', proximaAcao);
                    } else {
                        ui.mostrarMensagemResultado('Item Faltando', 'Você não tem um Kit Médico.', proximaAcao);
                    }
                }
            },
            {
                texto: 'Recusar ajuda',
                acao: (ctx) => {
                    const { state, ui, registrarLog, proximaAcao } = ctx;
                    state.getEstado().progressoSarajane = 4;
                    registrarLog('Negaram ajuda a Sarajane ferida.');
                    ui.mostrarMensagemResultado('Coração de Pedra', 'O olhar dela é de puro ódio. Ela se arrasta para longe. Vocês fizeram uma inimiga poderosa.', proximaAcao);
                }
            }
        ]
    },

    // 5. O Mapa da Caminhoneira
    {
        id: 'sarajane_map',
        titulo: 'O Mapa da Caminhoneira',
        condicao: (state) => state.getEstado().progressoSarajane === 4 && Math.random() < 0.7,
        descricao: 'Sarajane vê seu Mapa da Região aberto na mesa. "Esse mapa é uma piada. Deixa eu ver."',
        urlImagem: 'https://placehold.co/350x180/795548/FFFFFF?text=X+marca+o+local&font=specialelite',
        escolhas: [
            {
                texto: 'Deixá-la marcar o mapa',
                acao: (ctx) => {
                    const { state, ui, registrarLog, proximaAcao } = ctx;
                    if (state.getEstado().inventario.includes('Mapa da Região')) {
                        state.getEstado().agua += 5;
                        state.atualizarMoralTodosAbrigo(5);
                        state.getEstado().progressoSarajane = 5;
                        registrarLog('Sarajane marcou um poço de água no mapa.');
                        ui.mostrarMensagemResultado('Segredo do Poço', 'Ela desenha um círculo. "Aqui. Um poço que nunca seca." Vocês coletam 5 de água. (+5 de moral).', proximaAcao);
                    } else {
                        ui.mostrarMensagemResultado('Item faltando', 'Você precisa ter um Mapa da Região.', proximaAcao);
                    }
                }
            },
            {
                texto: 'Dizer para ela não tocar',
                acao: (ctx) => {
                    const { state, ui, registrarLog, proximaAcao } = ctx;
                    state.atualizarMoralTodosAbrigo(-5);
                    state.getEstado().progressoSarajane = 5;
                    registrarLog('Foram rudes com Sarajane.');
                    ui.mostrarMensagemResultado('Orgulho Ferido', 'Ela joga o mapa de volta. "Tudo bem, sabichão. Se perca sozinho." (-5 de moral).', proximaAcao);
                }
            }
        ]
    },
    
    
    {
        id: 'sarajane_final_escape',
        titulo: 'A Grande Fuga',
        // Condição mais exigente para o final: progresso avançado e um pouco de sorte
        condicao: (state) => state.getEstado().progressoSarajane >= 5 && Math.random() < 0.3, 
        descricao: 'O motor do caminhão de Sarajane ruge. Ela para na sua porta. "Está na hora. Estou indo embora. Depois de tudo, confio em vocês. Tenho espaço para mais alguns. Vêm ou ficam?"',
        urlImagem: 'https://placehold.co/350x180/FFC107/000000?text=A+ESTRADA+TE+ESPERA&font=specialelite',
        escolhas: [
            {
                texto: 'IR COM SARAJANE. (ENCERRAR JOGO)',
                acao: (ctx) => {
                    const { state, ui, registrarLog } = ctx;
                    registrarLog('Decidiram abandonar o abrigo e partir com Sarajane.');
                    ui.elementosDOM.displayMensagemVitoria.textContent = 'Graças à sua aliança com Sarajane, vocês pegam a estrada e deixam o pesadelo para trás, em busca de um novo começo.';
                    ui.elementosDOM.displayContagemFinalDiasVitoria.textContent = state.getEstado().dia;
                    ui.mostrarTela('tela-vitoria');
                }
            },
            {
                texto: 'Ficar e continuar lutando no abrigo.',
                acao: (ctx) => {
                    const { state, ui, registrarLog, proximaAcao } = ctx;
                    state.atualizarMoralTodosAbrigo(10);
                    // Define um número alto para não acionar mais eventos da Sarajane
                    state.getEstado().progressoSarajane = 99; 
                    registrarLog('Recusaram a oferta de Sarajane.');
                    ui.mostrarMensagemResultado('Nossa Luta Continua', 'Sarajane acena com a cabeça. "Corajoso. Respeito isso." Ela acelera e desaparece. A decisão de ficar fortalece a determinação de vocês (+10 de moral).', proximaAcao);
                }
            }
        ]
    }
];