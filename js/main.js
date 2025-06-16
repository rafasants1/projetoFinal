// js/main.js
import * as ui from './ui.js';
import * as state from './state.js';
import * as gameLogic from './gameLogic.js';
import * as diary from './diary.js'; // IMPORTA O NOVO MÓDULO

/**
 * Ponto de entrada principal do jogo.
 * Configura os listeners de evento e inicia a primeira tela.
 */
function app() {
    // Listeners para navegação inicial
    ui.elementosDOM.botaoIniciar.addEventListener('click', () => ui.mostrarTela('tela-dificuldade'));
    ui.elementosDOM.botaoConfiguracoes.addEventListener('click', () => ui.mostrarTela('tela-configuracoes'));
    ui.elementosDOM.botaoCreditos.addEventListener('click', () => ui.mostrarTela('tela-creditos'));
    
    ui.elementosDOM.botoesVoltarSplash.forEach(b => {
        b.addEventListener('click', () => ui.mostrarTela('tela-splash'));
    });
    
    ui.elementosDOM.botaoVoltarSplashDificuldade.addEventListener('click', () => ui.mostrarTela('tela-splash'));

    // Listener para iniciar o jogo com a dificuldade escolhida
    ui.elementosDOM.botoesDificuldade.forEach(b => {
        b.addEventListener('click', () => {
            const dificuldade = b.dataset.difficulty;
            state.inicializarJogo(dificuldade);
            ui.mostrarTela('tela-jogo');
            ui.atualizarInterface(state.getEstado());
            ui.registrarAtividadeEvento("O abrigo está selado. Prepare-se para o primeiro dia.", 0);
        });
    });

    // Listener para o botão de continuar nos modais de resultado
    ui.elementosDOM.botaoContinuarResultado.addEventListener('click', () => {
        ui.fecharMensagemResultado();
    });

    // Listeners para reiniciar o jogo
    ui.elementosDOM.botaoReiniciarJogo.addEventListener('click', () => ui.mostrarTela('tela-splash'));
    ui.elementosDOM.botaoJogarNovamenteVitoria.addEventListener('click', () => ui.mostrarTela('tela-splash'));

    // --- Listeners da Lógica do Jogo ---

    // CHAMA A FUNÇÃO CORRETA PARA ABRIR O DIÁRIO
    ui.elementosDOM.botaoAbrirDiario.addEventListener('click', () => {
        diary.abrirEAtualizarDiario();
    });
    
    // ADICIONA LISTENERS PARA A NAVEGAÇÃO DO DIÁRIO
    ui.elementosDOM.botaoDiarioProximo.addEventListener('click', diary.proximaPagina);
    ui.elementosDOM.botaoDiarioAnterior.addEventListener('click', diary.paginaAnterior);

    ui.elementosDOM.botaoDiarioFimDia.addEventListener('click', () => {
        ui.elementosDOM.modalDiarioAcoes.classList.add('oculto');
        gameLogic.avancarParaProximoDia();
    });

    // Estado inicial da aplicação
    ui.mostrarTela('tela-splash');
}

// Inicia a aplicação
app();