// js/gameLogic.js
import * as state from './state.js';
import * as ui from './ui.js';
import { eventos } from './events.js';
import { DIAS_PARA_MORRER_FOME_SEDE, MUDANCA_MORAL_MORTE_FAMILIA } from './constants.js';

function registrarLog(mensagem) {
    const dia = state.getEstado().dia;
    ui.registrarAtividadeEvento(mensagem, dia);
}

/**
 * Processa as escolhas de distribuição de suprimentos feitas no diário.
 */
function aplicarDistribuicaoSuprimentos() {
    const estado = state.getEstado();
    const { selecoesTemporariasDiario, personagens } = estado;
    const distribuicao = selecoesTemporariasDiario.distribuicao;
    
    let comidaConsumida = 0;
    let aguaConsumida = 0;

    // Calcula o total a ser consumido
    for (const id in distribuicao) {
        if (distribuicao[id].comida) comidaConsumida++;
        if (distribuicao[id].agua) aguaConsumida++;
    }

    if (comidaConsumida > estado.comida || aguaConsumida > estado.agua) {
        registrarLog("Tentativa de distribuir mais recursos do que o disponível. Ação cancelada.");
        // O ideal seria mostrar um erro para o usuário aqui.
        return; // Cancela a distribuição
    }

    // Deduz do estoque
    estado.comida -= comidaConsumida;
    estado.agua -= aguaConsumida;
    if (comidaConsumida > 0) registrarLog(`${comidaConsumida} de comida foram distribuídas.`);
    if (aguaConsumida > 0) registrarLog(`${aguaConsumida} de água foram distribuídas.`);

    // Atualiza o status de cada personagem
    personagens.forEach(p => {
        if (!p.vivo || p.emExpedicao) return;

        // Verifica se comeu
        if (distribuicao[p.id]?.comida) {
            p.diasSemComida = 0;
        } else {
            p.diasSemComida++;
        }

        // Verifica se bebeu
        if (distribuicao[p.id]?.agua) {
            p.diasSemAgua = 0;
        } else {
            p.diasSemAgua++;
        }
    });

    // Limpa as seleções para o próximo dia
    selecoesTemporariasDiario.distribuicao = {};
}


export function habilitarDiario() {
    ui.elementosDOM.botaoAbrirDiario.disabled = state.getEstado().fimDeJogo;
    if (!state.getEstado().fimDeJogo) {
        ui.mostrarTela('tela-jogo');
        ui.atualizarInterface(state.getEstado());
    } else {
        ui.mostrarTela('tela-fim-de-jogo');
    }
}

function dispararEventoAleatorio() {
    if (state.getEstado().fimDeJogo) {
        habilitarDiario();
        return;
    }

    const eventosDisponiveis = eventos.filter(evento => {
        // ... (lógica para filtrar eventos disponíveis)
        return true; 
    });

    if (eventosDisponiveis.length === 0 || Math.random() < 0.20) {
        registrarLog("Um dia tranquilo... talvez tranquilo demais.");
        ui.mostrarMensagemResultado('Dia Calmo', 'Nada de extraordinário aconteceu hoje.', habilitarDiario);
        return;
    }
    
    const evento = eventosDisponiveis[Math.floor(Math.random() * eventosDisponiveis.length)];
    state.setEventoAtual(evento);
    
    // Configura e mostra o modal do evento
    ui.elementosDOM.displayTituloEvento.textContent = evento.titulo;
    // ... (resto da configuração do modal)
    
    ui.elementosDOM.displayEscolhasEvento.innerHTML = '';
    evento.escolhas.forEach(escolha => {
        const botao = document.createElement('button');
        botao.textContent = escolha.texto;
        botao.onclick = () => {
            ui.elementosDOM.modalEvento.classList.add('oculto');
            // Aqui passamos o contexto para a ação do evento
            escolha.acao({
                state: state,
                ui: ui,
                registrarLog: registrarLog,
                proximaAcao: habilitarDiario
            });
        };
        ui.elementosDOM.displayEscolhasEvento.appendChild(botao);
    });

    ui.elementosDOM.modalEvento.classList.remove('oculto');
}

function lidarComRetornoExpedicao() {
    // ... (Lógica do retorno da expedição)
    // Ao final, chame o próximo passo
    dispararEventoAleatorio();
}

function processarConsequenciasInicioDia() {
    registrarLog(`Avaliando consequências da noite.`);
    const estado = state.getEstado();
    
    estado.personagens.forEach(p => {
        if (p.vivo && !p.emExpedicao) {
            if (p.diasSemComida >= DIAS_PARA_MORRER_FOME_SEDE || p.diasSemAgua >= DIAS_PARA_MORRER_FOME_SEDE) {
                p.vivo = false;
                registrarLog(`${p.nome} MORREU.`);
                state.atualizarMoralTodosAbrigo(MUDANCA_MORAL_MORTE_FAMILIA);
            }
        }
    });

    ui.atualizarInterface(estado);

    if (estado.personagens.filter(p => p.vivo).length === 0) {
        estado.fimDeJogo = true;
        ui.mostrarTela('tela-fim-de-jogo');
        return false;
    }
    return true;
}

export function avancarParaProximoDia() {
    // 1. Aplica as decisões do diário ANTES de avançar o dia
    aplicarDistribuicaoSuprimentos();
    // (Futuramente, a lógica para iniciar expedição viria aqui também)

    // 2. Avança o dia
    if (state.getEstado().dia === 0) {
        state.getEstado().dia = 1;
    } else {
        state.getEstado().dia++;
    }

    // 3. Processa consequências e continua o fluxo
    if (!processarConsequenciasInicioDia()) return;

    registrarLog(`--- Início do Dia ${state.getEstado().dia} ---`);
    ui.atualizarInterface(state.getEstado());

    // Mostra transição e depois continua
    setTimeout(() => {
        if (state.getEstado().idPersonagemExpedicao && state.getEstado().dia >= state.getEstado().diaRetornoExpedicao) {
            lidarComRetornoExpedicao();
        } else {
            dispararEventoAleatorio();
        }
    }, 1800);
}