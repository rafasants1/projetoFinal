// js/main.js
import * as ui from './ui.js';
import * as state from './state.js';
import * as gameLogic from './gameLogic.js';
import * as diary from './diary.js';

/**
 * Ponto de entrada principal do jogo.
 * Configura os listeners de evento e inicia a primeira tela.
 * AGORA VERIFICA SE OS ELEMENTOS EXISTEM ANTES DE ADICIONAR LISTENERS.
 */
function app() {
    // --- LÓGICA DA TELA INICIAL (index.html) ---
    if (ui.elementosDOM.botaoIniciar) {
        ui.elementosDOM.botaoIniciar.addEventListener('click', () => {
            // Ao invés de mostrar a tela, redireciona para a página de dificuldade
            window.location.href = 'dificuldade.html';
        });
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

    // --- LÓGICA DA TELA DE DIFICULDADE (dificuldade.html) ---
    if (ui.elementosDOM.botoesDificuldade.length > 0) {
        ui.elementosDOM.botoesDificuldade.forEach(b => {
            b.addEventListener('click', () => {
                const dificuldade = b.dataset.difficulty;
                // Salva a dificuldade escolhida no localStorage para a próxima página ler
                localStorage.setItem('dificuldadeJogo', dificuldade);
                // Redireciona para a página do jogo
                window.location.href = 'jogo.html';
            });
        });
    }
    if (ui.elementosDOM.botaoVoltarSplashDificuldade) {
        ui.elementosDOM.botaoVoltarSplashDificuldade.addEventListener('click', () => {
             // Redireciona de volta para a página inicial
            window.location.href = 'index.html';
        });
    }

    // --- LÓGICA DA TELA DE JOGO (jogo.html) ---
    // Verifica se estamos na tela do jogo buscando um elemento chave, como o botão do diário
    if (ui.elementosDOM.botaoAbrirDiario) {
        // Pega a dificuldade do localStorage para iniciar o jogo corretamente
        const dificuldade = localStorage.getItem('dificuldadeJogo') || 'medio'; // Usa 'medio' como padrão
        state.inicializarJogo(dificuldade);
        ui.mostrarTela('tela-jogo'); // Garante que a tela certa está visível
        ui.atualizarInterface(state.getEstado());
        ui.registrarAtividadeEvento("O abrigo está selado. Prepare-se para o primeiro dia.", 0);

        // Listeners específicos da tela de jogo
        ui.elementosDOM.botaoAbrirDiario.addEventListener('click', diary.abrirEAtualizarDiario);
        ui.elementosDOM.botaoDiarioProximo.addEventListener('click', diary.proximaPagina);
        ui.elementosDOM.botaoDiarioAnterior.addEventListener('click', diary.paginaAnterior);
        ui.elementosDOM.botaoDiarioFimDia.addEventListener('click', () => {
            ui.elementosDOM.modalDiarioAcoes.classList.add('oculto');
            gameLogic.avancarParaProximoDia();
        });
        ui.elementosDOM.botaoContinuarResultado.addEventListener('click', ui.fecharMensagemResultado);
    }
    
    // --- LÓGICA DAS TELAS FINAIS (fim.html) ---
    if (ui.elementosDOM.botaoReiniciarJogo) {
        ui.elementosDOM.botaoReiniciarJogo.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    if (ui.elementosDOM.botaoJogarNovamenteVitoria) {
        ui.elementosDOM.botaoJogarNovamenteVitoria.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    // No início, em vez de mostrar 'tela-splash', garantimos que a tela correta da página atual seja exibida
    const telaAtiva = document.querySelector('.tela:not(.oculto)');
    if (!telaAtiva) {
        // Se nenhuma tela estiver ativa (ex: em jogo.html), mostre a tela principal
        if(document.getElementById('tela-jogo')) ui.mostrarTela('tela-jogo');
        else if(document.getElementById('tela-splash')) ui.mostrarTela('tela-splash');
    }
}

// Inicia a aplicação
app();