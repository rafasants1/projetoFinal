// js/main.js
import * as ui from './ui.js';
import * as state from './state.js';
import * as gameLogic from './gameLogic.js';
import * as diary from './diary.js';

/**
 * Ponto de entrada principal do jogo.
 * Configura os listeners de evento para uma aplicação de PÁGINA ÚNICA.
 */
function app() {
    // --- Listeners para Navegação Inicial ---
    
    // Botão para ir da tela inicial para a de dificuldade
    if (ui.elementosDOM.botaoIniciar) {
        ui.elementosDOM.botaoIniciar.addEventListener('click', () => ui.mostrarTela('tela-dificuldade'));
    }
    // Botões para abrir telas de config/créditos
    if (ui.elementosDOM.botaoConfiguracoes) {
        ui.elementosDOM.botaoConfiguracoes.addEventListener('click', () => ui.mostrarTela('tela-configuracoes'));
    }
    if (ui.elementosDOM.botaoCreditos) {
        ui.elementosDOM.botaoCreditos.addEventListener('click', () => ui.mostrarTela('tela-creditos'));
    }
    
    // Botões para voltar para a tela inicial
    if (ui.elementosDOM.botoesVoltarSplash) {
        ui.elementosDOM.botoesVoltarSplash.forEach(b => {
            b.addEventListener('click', () => ui.mostrarTela('tela-splash'));
        });
    }
    if (ui.elementosDOM.botaoVoltarSplashDificuldade) {
        ui.elementosDOM.botaoVoltarSplashDificuldade.addEventListener('click', () => ui.mostrarTela('tela-splash'));
    }

    // --- Listener para INICIAR O JOGO ---
    
    // Botões de Dificuldade
    if (ui.elementosDOM.botoesDificuldade && ui.elementosDOM.botoesDificuldade.length > 0) {
        ui.elementosDOM.botoesDificuldade.forEach(b => {
            b.addEventListener('click', () => {
                const dificuldade = b.dataset.difficulty;
                
                // PONTO CHAVE: O jogo só é inicializado AQUI, após o clique!
                state.inicializarJogo(dificuldade); //
                
                // Mostra a tela de jogo e atualiza a interface
                ui.mostrarTela('tela-jogo'); //
                ui.atualizarInterface(state.getEstado()); //
                ui.registrarAtividadeEvento("O abrigo está selado. Prepare-se para o primeiro dia.", 0); //
            });
        });
    }

    // --- Listeners da Lógica do Jogo ---
    
    if (ui.elementosDOM.botaoAbrirDiario) {
        ui.elementosDOM.botaoAbrirDiario.addEventListener('click', () => {
            diary.abrirEAtualizarDiario(); //
        });
    }
    if (ui.elementosDOM.botaoDiarioProximo) {
        ui.elementosDOM.botaoDiarioProximo.addEventListener('click', diary.proximaPagina); //
    }
    if (ui.elementosDOM.botaoDiarioAnterior) {
        ui.elementosDOM.botaoDiarioAnterior.addEventListener('click', diary.paginaAnterior); //
    }
    if (ui.elementosDOM.botaoDiarioFimDia) {
        ui.elementosDOM.botaoDiarioFimDia.addEventListener('click', () => {
            ui.elementosDOM.modalDiarioAcoes.classList.add('oculto');
            gameLogic.avancarParaProximoDia(); //
        });
    }

    // --- Outros Listeners ---

    // Botão para continuar nos modais de resultado
    if (ui.elementosDOM.botaoContinuarResultado) {
        ui.elementosDOM.botaoContinuarResultado.addEventListener('click', () => {
            ui.fecharMensagemResultado(); //
        });
    }

    // Botões para reiniciar o jogo
    if (ui.elementosDOM.botaoReiniciarJogo) {
        ui.elementosDOM.botaoReiniciarJogo.addEventListener('click', () => ui.mostrarTela('tela-splash'));
    }
    if (ui.elementosDOM.botaoJogarNovamenteVitoria) {
        ui.elementosDOM.botaoJogarNovamenteVitoria.addEventListener('click', () => ui.mostrarTela('tela-splash'));
    }

    // --- Estado inicial da aplicação ---
    // Garante que o jogo sempre comece mostrando a tela inicial
    ui.mostrarTela('tela-splash');
}

// Inicia a aplicação
app();