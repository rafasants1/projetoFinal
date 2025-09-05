/**
 * Inicializa ou reseta o estado do jogo com base na dificuldade e nos itens coletados.
 * @param {string} dificuldade - 'facil', 'medio', or 'dificil'.
 * @param {string[]} itensColetados - Array com os nomes dos itens vindos do minigame.
 */
export function inicializarJogo(dificuldade, itensColetados = []) {
    const personagensIniciaisCopia = JSON.parse(JSON.stringify(PERSONAGENS_INICIAIS));

    estadoJogo = {
        telaAtual: 'tela-jogo',
        dia: 0,
        comida: 0,
        agua: 0,
        personagens: personagensIniciaisCopia.map(p => ({...p, moral: MORAL_INICIAL, emExpedicao: false})),
        inventario: [],
        fimDeJogo: false,
        eventoAtual: null,
        marcadoDoenteTemporariamente: null,
        idPersonagemExpedicao: null,
        diaRetornoExpedicao: null,
        dificuldade: dificuldade,
        indicePaginaAtualDiario: 0,
        progressoSarajane: 0,
        progressoMaya: 0,
        ordemPaginasDiario: ['distribuicao', 'expedicao', 'fimDia'],
        selecoesTemporariasDiario: {
            distribuicao: {},
            expedicao: null
        }
    };

    switch (dificuldade) {
        case 'facil':
            estadoJogo.comida = 12;
            estadoJogo.agua = 12;
            break;
        case 'medio':
            estadoJogo.comida = 7;
            estadoJogo.agua = 7;
            break;
        case 'dificil':
            estadoJogo.comida = 5;
            estadoJogo.agua = 5;
            break;
    }

    // Usa os itens coletados no minigame como inventário inicial
    estadoJogo.inventario = itensColetados;
}