// js/state.js
import { PERSONAGENS_INICIAIS, MORAL_INICIAL, TODOS_ITENS_POSSIVEIS, NUM_ITENS_INICIAIS, MORAL_MINIMA, MORAL_MAXIMA } from './constant.js';

// A variável de estado é interna ao módulo.
let estadoJogo = {};

/**
 * Inicializa ou reseta o estado do jogo com base na dificuldade.
 * @param {string} dificuldade - 'facil', 'medio', or 'dificil'.
 */
export function inicializarJogo(dificuldade) {
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
        ordemPaginasDiario: ['distribuicao', 'expedicao', 'fimDia'],
        selecoesTemporariasDiario: {
            distribuicao: {},
            expedicao: null
        }
    };

    switch (dificuldade) {
        case 'facil':
            estadoJogo.comida = 25;
            estadoJogo.agua = 25;
            break;
        case 'medio':
            estadoJogo.comida = 18;
            estadoJogo.agua = 18;
            break;
        case 'dificil':
            estadoJogo.comida = 12;
            estadoJogo.agua = 12;
            break;
    }

    const itensEmbaralhados = [...TODOS_ITENS_POSSIVEIS].sort(() => 0.5 - Math.random());
    estadoJogo.inventario = itensEmbaralhados.slice(0, NUM_ITENS_INICIAIS);
}

/**
 * Retorna uma cópia do estado atual do jogo para evitar mutações diretas.
 */
export function getEstado() {
    return estadoJogo;
}

/**
 * Encontra um personagem pelo ID.
 * @param {string} idPersonagem
 * @returns {object|undefined} O objeto do personagem ou undefined.
 */
export function findPersonagem(idPersonagem) {
    return estadoJogo.personagens.find(p => p.id === idPersonagem);
}

/**
 * Atualiza a moral de um personagem específico.
 * @param {string} idPersonagem
 * @param {number} mudanca
 */
export function atualizarMoralPersonagem(idPersonagem, mudanca) {
    const personagem = findPersonagem(idPersonagem);
    if (personagem && personagem.vivo) {
        personagem.moral = Math.max(MORAL_MINIMA, Math.min(MORAL_MAXIMA, personagem.moral + mudanca));
    }
}

/**
 * Atualiza a moral de todos os personagens vivos no abrigo.
 * @param {number} mudanca
 */
export function atualizarMoralTodosAbrigo(mudanca) {
    estadoJogo.personagens.forEach(personagem => {
        if (personagem.vivo && !personagem.emExpedicao) {
            atualizarMoralPersonagem(personagem.id, mudanca);
        }
    });
}

/**
 * Adiciona um item ao inventário.
 * @param {string} item
 */
export function adicionarItemInventario(item) {
    estadoJogo.inventario.push(item);
}

/**
 * Remove um item do inventário.
 * @param {string} item
 */
export function removerItemInventario(item) {
    const index = estadoJogo.inventario.indexOf(item);
    if (index > -1) {
        estadoJogo.inventario.splice(index, 1);
    }
}

/**
 * Define o evento atual no estado.
 * @param {object|null} evento
 */
export function setEventoAtual(evento) {
    estadoJogo.eventoAtual = evento;
}