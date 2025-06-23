// js/gameLogic.js
import * as state from './state.js';
import * as ui from './ui.js';
import { eventos } from './events.js';
import { DIAS_PARA_MORRER_FOME_SEDE, MUDANCA_MORAL_MORTE_FAMILIA, DURACAO_EXPEDICAO_DIAS } from './constants.js';

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
        return; 
    }

    // Deduz do estoque
    estado.comida -= comidaConsumida;
    estado.agua -= aguaConsumida;
    if (comidaConsumida > 0) registrarLog(`${comidaConsumida} de comida foram distribuídas.`);
    if (aguaConsumida > 0) registrarLog(`${aguaConsumida} de água foram distribuídas.`);

    // Atualiza o status de cada personagem
    personagens.forEach(p => {
        if (!p.vivo || p.emExpedicao) return;

        if (distribuicao[p.id]?.comida) {
            p.diasSemComida = 0;
        } else {
            p.diasSemComida++;
        }

        if (distribuicao[p.id]?.agua) {
            p.diasSemAgua = 0;
        } else {
            p.diasSemAgua++;
        }
    });

    selecoesTemporariasDiario.distribuicao = {};
}

/**
 * Inicia uma expedição com base na seleção do diário.
 */
function iniciarExpedicao() {
    const estado = state.getEstado();
    const idPersonagemEscolhido = estado.selecoesTemporariasDiario.expedicao;

    if (idPersonagemEscolhido) {
        const personagem = state.findPersonagem(idPersonagemEscolhido);
        if (personagem && personagem.vivo && !personagem.emExpedicao) {
            personagem.emExpedicao = true;
            estado.idPersonagemExpedicao = personagem.id;
            estado.diaRetornoExpedicao = estado.dia + DURACAO_EXPEDICAO_DIAS;
            registrarLog(`${personagem.nome} partiu em uma expedição. Retorno esperado no dia ${estado.diaRetornoExpedicao}.`);
        }
    }
    // Limpa a seleção para o próximo dia
    estado.selecoesTemporariasDiario.expedicao = null;
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
    ui.elementosDOM.displayDescricaoEvento.textContent = evento.descricao; // <-- LINHA ADICIONADA
    ui.elementosDOM.placeholderImagemEvento.innerHTML = `<img src="${evento.urlImagem}" alt="${evento.titulo}">`; // <-- LINHA ADICIONADA
    
    ui.elementosDOM.displayEscolhasEvento.innerHTML = '';
    evento.escolhas.forEach(escolha => {
        const botao = document.createElement('button');
        botao.textContent = escolha.texto;
        botao.onclick = () => {
            ui.elementosDOM.modalEvento.classList.add('oculto');
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
    const estado = state.getEstado();
    const personagem = state.findPersonagem(estado.idPersonagemExpedicao);
    if (!personagem) return;

    registrarLog(`${personagem.nome} retornou da expedição!`);
    personagem.emExpedicao = false;
    estado.idPersonagemExpedicao = null;
    estado.diaRetornoExpedicao = null;

    // Lógica simples de sucesso/falha
    if (Math.random() > 0.3) { // 70% chance de sucesso
        const comidaEncontrada = Math.floor(Math.random() * 5) + 2;
        const aguaEncontrada = Math.floor(Math.random() * 5) + 2;
        estado.comida += comidaEncontrada;
        estado.agua += aguaEncontrada;
        registrarLog(`Sucesso! Trouxe ${comidaEncontrada} de comida e ${aguaEncontrada} de água.`);
        ui.mostrarMensagemResultado('Sucesso na Expedição', `${personagem.nome} retornou com suprimentos!`, dispararEventoAleatorio);
    } else {
        registrarLog(`Falha! ${personagem.nome} voltou de mãos vazias e cansado.`);
        ui.mostrarMensagemResultado('Falha na Expedição', `${personagem.nome} não encontrou nada de útil.`, dispararEventoAleatorio);
    }
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
    aplicarDistribuicaoSuprimentos();
    iniciarExpedicao();

    if (state.getEstado().dia === 0) {
        state.getEstado().dia = 1;
    } else {
        state.getEstado().dia++;
    }

    if (!processarConsequenciasInicioDia()) return;

    registrarLog(`--- Início do Dia ${state.getEstado().dia} ---`);
    ui.atualizarInterface(state.getEstado());

    // --- LÓGICA DA TELA DE TRANSIÇÃO ---
    ui.elementosDOM.displayTransicaoDia.textContent = `Dia ${state.getEstado().dia}`;
    ui.elementosDOM.telaTransicaoDia.classList.remove('oculto');
    
    setTimeout(() => {
        ui.elementosDOM.telaTransicaoDia.classList.add('oculto');
        
        // Continua o fluxo normal do jogo após a transição
        if (state.getEstado().idPersonagemExpedicao && state.getEstado().dia >= state.getEstado().diaRetornoExpedicao) {
            lidarComRetornoExpedicao();
        } else {
            dispararEventoAleatorio();
        }
    }, 2000); // Duração da tela de transição em milissegundos
}