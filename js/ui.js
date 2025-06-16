// js/ui.js

/**
 * Contém todas as funções que manipulam a interface do usuário (DOM).
 */

// Mapeamento centralizado de todos os elementos DOM usados no jogo.
export const elementosDOM = {
    // Telas
    telaSplash: document.getElementById('tela-splash'),
    telaConfiguracoes: document.getElementById('tela-configuracoes'),
    telaCreditos: document.getElementById('tela-creditos'),
    telaDificuldade: document.getElementById('tela-dificuldade'),
    telaJogo: document.getElementById('tela-jogo'),
    telaFimDeJogo: document.getElementById('tela-fim-de-jogo'),
    telaVitoria: document.getElementById('tela-vitoria'),
    telaTransicaoDia: document.getElementById('tela-transicao-dia'),
    // Modais
    modalEvento: document.getElementById('modal-evento'),
    sobreposicaoModalResultado: document.getElementById('sobreposicao-modal-resultado'),
    modalDiarioAcoes: document.getElementById('modal-diario-acoes'),
    // Botões
    botaoIniciar: document.getElementById('botao-iniciar'),
    botaoConfiguracoes: document.getElementById('botao-configuracoes'),
    botaoCreditos: document.getElementById('botao-creditos'),
    botoesVoltarSplash: document.querySelectorAll('.voltar-para-splash'),
    botaoVoltarSplashDificuldade: document.getElementById('voltar-splash-da-dificuldade'),
    botoesDificuldade: document.querySelectorAll('.botao-dificuldade'),
    botaoReiniciarJogo: document.getElementById('botao-reiniciar-jogo'),
    botaoJogarNovamenteVitoria: document.getElementById('botao-jogar-novamente-vitoria'),
    botaoAbrirDiario: document.getElementById('botao-abrir-diario'),
    botaoContinuarResultado: document.getElementById('botao-continuar-resultado'),
    
    // --- ADIÇÃO DOS BOTÕES DO DIÁRIO ---
    botaoDiarioFimDia: document.getElementById('botao-diario-fim-dia'),
    botaoDiarioAnterior: document.getElementById('botao-diario-anterior'),
    botaoDiarioProximo: document.getElementById('botao-diario-proximo'),

    // Displays HUD
    displayContadorDias: document.getElementById('contador-dias'),
    displayContadorComida: document.getElementById('contador-comida'),
    displayContadorAgua: document.getElementById('contador-agua'),
    displayPersonagens: document.getElementById('display-personagens'),
    displayListaInventario: document.getElementById('lista-inventario'),
    displayLogEventos: document.getElementById('log-eventos'),
    // ... e assim por diante para todos os outros elementos.
    displayTituloEvento: document.getElementById('titulo-evento'),
    displayDescricaoEvento: document.getElementById('descricao-evento'),
    displayEscolhasEvento: document.getElementById('escolhas-evento'),
    placeholderImagemEvento: document.getElementById('placeholder-imagem-evento'),
    displayTituloResultado: document.getElementById('titulo-resultado'),
    displayTextoResultado: document.getElementById('texto-resultado'),
    displayContagemFinalDias: document.getElementById('contagem-final-dias'),
    displayMensagemFimJogo: document.getElementById('mensagem-fim-de-jogo'),
    displayMensagemVitoria: document.getElementById('mensagem-vitoria'),
    displayContagemFinalDiasVitoria: document.getElementById('contagem-final-dias-vitoria'),
};

let callbackResultadoAtual = null;

/**
 * Torna a tela especificada visível e esconde as outras.
 * @param {string} idTela O ID da tela a ser mostrada.
 */
export function mostrarTela(idTela) {
    const todasAsTelas = [
        elementosDOM.telaSplash, elementosDOM.telaConfiguracoes, elementosDOM.telaCreditos,
        elementosDOM.telaDificuldade, elementosDOM.telaJogo, elementosDOM.telaFimDeJogo,
        elementosDOM.telaVitoria, elementosDOM.modalEvento, elementosDOM.sobreposicaoModalResultado,
        elementosDOM.telaTransicaoDia, elementosDOM.modalDiarioAcoes
    ];
    todasAsTelas.forEach(t => {
        if (t) t.classList.add('oculto');
    });
    const telaParaMostrar = document.getElementById(idTela);
    if (telaParaMostrar) telaParaMostrar.classList.remove('oculto');
}

/**
 * Atualiza todos os displays da interface do jogo com base no estado atual.
 * @param {object} estado - O objeto de estado do jogo.
 */
export function atualizarInterface(estado) {
    if (!estado || !estado.personagens) return; // Guarda contra estado não inicializado

    elementosDOM.displayContadorDias.textContent = estado.dia > 0 ? estado.dia : '-';
    elementosDOM.displayContadorComida.textContent = estado.comida;
    elementosDOM.displayContadorAgua.textContent = estado.agua;

    elementosDOM.displayPersonagens.innerHTML = '';
    estado.personagens.forEach(personagem => {
        const divPersonagem = document.createElement('div');
        divPersonagem.className = 'cartao-personagem';
        if (!personagem.vivo) divPersonagem.classList.add('morto');
        else if (personagem.emExpedicao) divPersonagem.classList.add('em-expedicao');
        
        // Adicione classes de status e moral aqui...

        divPersonagem.innerHTML = `
            <h4>${personagem.nome} ${personagem.emExpedicao ? `(Em Expedição - Ret. Dia ${estado.diaRetornoExpedicao})` : ""}</h4>
            <p>Status: <span>${personagem.status}</span></p>
            <p>Moral: <span>${personagem.moral}/100</span></p>
            ${personagem.vivo && !personagem.emExpedicao ? `<p>Dias s/ Comida: ${personagem.diasSemComida}</p><p>Dias s/ Água: ${personagem.diasSemAgua}</p>` : ''}
            ${!personagem.vivo ? `<p class="status-morto">MORREU</p>` : ''}
        `;
        elementosDOM.displayPersonagens.appendChild(divPersonagem);
    });

    elementosDOM.displayListaInventario.innerHTML = estado.inventario.length > 0
        ? estado.inventario.map(item => `<li>- ${item}</li>`).join('')
        : '<li>Nenhum item.</li>';
}

/**
 * Adiciona uma nova entrada ao log de eventos na tela.
 * @param {string} mensagem - A mensagem a ser registrada.
 * @param {number} dia - O dia atual do jogo.
 */
export function registrarAtividadeEvento(mensagem, dia) {
    const p = document.createElement('p');
    const prefixoDia = dia > 0 ? `Dia ${dia}: ` : `Abrigo: `;
    p.textContent = prefixoDia + mensagem;

    if (elementosDOM.displayLogEventos.firstChild) {
        elementosDOM.displayLogEventos.insertBefore(p, elementosDOM.displayLogEventos.firstChild);
    } else {
        elementosDOM.displayLogEventos.appendChild(p);
    }
}

/**
 * Exibe um modal de resultado de evento/ação.
 * @param {string} titulo
 * @param {string} texto
 * @param {function} proximaAcaoCallback - Função a ser chamada ao clicar em 'Continuar'.
 */
export function mostrarMensagemResultado(titulo, texto, proximaAcaoCallback) {
    elementosDOM.displayTituloResultado.textContent = titulo;
    elementosDOM.displayTextoResultado.textContent = texto;
    elementosDOM.sobreposicaoModalResultado.classList.remove('oculto');
    callbackResultadoAtual = proximaAcaoCallback;
}

/**
 * Esconde o modal de resultado e executa o callback definido.
 */
export function fecharMensagemResultado() {
    elementosDOM.sobreposicaoModalResultado.classList.add('oculto');
    if (typeof callbackResultadoAtual === 'function') {
        callbackResultadoAtual();
    }
    callbackResultadoAtual = null; // Limpa o callback
}