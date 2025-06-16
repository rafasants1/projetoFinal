// js/gameLogic.js
import * as state from './state.js';
import * as ui from './ui.js';
import { eventos } from './events.js';
import { DIAS_PARA_MORRER_FOME_SEDE, MUDANCA_MORAL_MORTE_FAMILIA } from './constants.js';

function registrarLog(mensagem) {
    const dia = state.getEstado().dia;
    ui.registrarAtividadeEvento(mensagem, dia);
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
    // ... (Lógica de aplicar distribuição e iniciar expedição)

    if (state.getEstado().dia === 0) {
        state.getEstado().dia = 1;
    } else {
        state.getEstado().dia++;
    }

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