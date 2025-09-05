// js/main.js
import * as ui from './ui.js';
import * as state from './state.js';
import * as gameLogic from './gameLogic.js';
import * as diary from './diary.js';

/**
 * Ponto de entrada principal do jogo.
 * Configura os listeners de evento e a lógica de inicialização.
 */
function app() {
    // --- Lógica de inicialização ---
    // Verifica qual página está ativa para evitar loops de redirecionamento.
    if (document.getElementById('tela-splash')) {
        // Se o elemento 'tela-splash' existe, estamos na página principal (index.html).
        // Apenas exibe a tela inicial.
        ui.mostrarTela('tela-splash');

    } else if (document.getElementById('tela-jogo')) {
        // Se não há 'tela-splash', mas há 'tela-jogo', estamos na página do jogo (jogo.html).
        const resultadoMinigame = JSON.parse(localStorage.getItem('resultadoMinigame'));
        
        if (resultadoMinigame) {
            // Se encontrou os dados do minigame, inicializa o jogo.
            state.inicializarJogo(resultadoMinigame.dificuldade, resultadoMinigame.itensColetados);
            ui.mostrarTela('tela-jogo');
            ui.atualizarInterface(state.getEstado());
            ui.registrarAtividadeEvento(`Após uma corrida desesperada, você sela o abrigo com ${resultadoMinigame.itensColetados.length} item(ns).`, 0);
            
            // Limpa os dados para não reiniciar com eles caso a página seja atualizada.
            localStorage.removeItem('resultadoMinigame');
        } else {
            // Se chegou em jogo.html sem dados, redireciona para o início.
            window.location.href = 'index.html';
            return; // Interrompe a execução para evitar erros.
        }
    }

    // --- Listeners para Navegação Inicial (em index.html) ---
    if (ui.elementosDOM.botaoIniciar) {
        ui.elementosDOM.botaoIniciar.addEventListener('click', () => ui.mostrarTela('tela-dificuldade'));
    }
    if (ui.elementosDOM.botaoConfiguracoes) {
        ui.elementosDOM.botaoConfiguracoes.addEventListener('click', () => ui.mostrarTela('tela-configuracoes'));
    }
    if (ui.elementosDOM.botaoCreditos) {
        ui.elementosDOM.botaoCreditos.addEventListener('click', () => ui.mostrarTela('tela-creditos'));
    }
    
    if (ui.elementosDOM.botoesVoltarSplash) {
        ui.elementosDOM.botoesVoltarSplash.forEach(b => {
            b.addEventListener('click', () => ui.mostrarTela('tela-splash'));
        });
    }
    if (ui.elementosDOM.botaoVoltarSplashDificuldade) {
        ui.elementosDOM.botaoVoltarSplashDificuldade.addEventListener('click', () => ui.mostrarTela('tela-splash'));
    }

    // --- Listener para INICIAR O MINIGAME ---
    if (ui.elementosDOM.botoesDificuldade && ui.elementosDOM.botoesDificuldade.length > 0) {
        ui.elementosDOM.botoesDificuldade.forEach(b => {
            b.addEventListener('click', () => {
                const dificuldade = b.dataset.difficulty;
                window.location.href = `minigame.html?difficulty=${dificuldade}`;
            });
        });
    }

    // --- Listeners da Lógica do Jogo (em jogo.html) ---
    if (ui.elementosDOM.botaoAbrirDiario) {
        ui.elementosDOM.botaoAbrirDiario.addEventListener('click', () => {
            diary.abrirEAtualizarDiario();
        });
    }
    if (ui.elementosDOM.botaoDiarioProximo) {
        ui.elementosDOM.botaoDiarioProximo.addEventListener('click', diary.proximaPagina);
    }
    if (ui.elementosDOM.botaoDiarioAnterior) {
        ui.elementosDOM.botaoDiarioAnterior.addEventListener('click', diary.paginaAnterior);
    }
    if (ui.elementosDOM.botaoDiarioFimDia) {
        ui.elementosDOM.botaoDiarioFimDia.addEventListener('click', () => {
            ui.elementosDOM.modalDiarioAcoes.classList.add('oculto');
            gameLogic.avancarParaProximoDia();
        });
    }

    // --- Outros Listeners ---
    if (ui.elementosDOM.botaoContinuarResultado) {
        ui.elementosDOM.botaoContinuarResultado.addEventListener('click', () => {
            ui.fecharMensagemResultado();
        });
    }

    if (ui.elementosDOM.botaoReiniciarJogo) {
        ui.elementosDOM.botaoReiniciarJogo.addEventListener('click', () => window.location.href = 'index.html');
    }
    if (ui.elementosDOM.botaoJogarNovamenteVitoria) {
        ui.elementosDOM.botaoJogarNovamenteVitoria.addEventListener('click', () => window.location.href = 'index.html');
    }
}

// Inicia a aplicação
app();