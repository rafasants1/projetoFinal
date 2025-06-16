// js/diary.js
import * as ui from './ui.js';
import * as state from './state.js';

let estadoDiario = {
    paginaAtual: 0,
    paginas: ['pagina-diario-distribuicao', 'pagina-diario-expedicao', 'pagina-diario-fim-dia']
};

/**
 * Mostra a página correta do diário com base no índice atual.
 */
function mostrarPaginaAtual() {
    const estado = state.getEstado();

    // Esconde todas as páginas
    document.querySelectorAll('.pagina-diario').forEach(p => p.style.display = 'none');

    // Mostra a página atual
    const idPaginaAtual = estadoDiario.paginas[estadoDiario.paginaAtual];
    const paginaAtualEl = document.getElementById(idPaginaAtual);
    if (paginaAtualEl) {
        paginaAtualEl.style.display = 'block';
    }

    // Atualiza os números dos dias nas páginas do diário
    document.querySelectorAll('#diario-dist-num-dia, #diario-exp-num-dia, #diario-fim-num-dia').forEach(span => {
        span.textContent = estado.dia;
    });

    // Lógica para habilitar/desabilitar botões de navegação
    ui.elementosDOM.botaoDiarioAnterior.disabled = (estadoDiario.paginaAtual === 0);
    ui.elementosDOM.botaoDiarioProximo.disabled = (estadoDiario.paginaAtual === estadoDiario.paginas.length - 1);

    // Mostra/esconde botões de Próximo e Fim de Dia
    if (estadoDiario.paginaAtual === estadoDiario.paginas.length - 1) {
        ui.elementosDOM.botaoDiarioProximo.classList.add('oculto');
        ui.elementosDOM.botaoDiarioFimDia.classList.remove('oculto');
    } else {
        ui.elementosDOM.botaoDiarioProximo.classList.remove('oculto');
        ui.elementosDOM.botaoDiarioFimDia.classList.add('oculto');
    }
}

/**
 * Navega para a próxima página do diário.
 */
export function proximaPagina() {
    if (estadoDiario.paginaAtual < estadoDiario.paginas.length - 1) {
        estadoDiario.paginaAtual++;
        mostrarPaginaAtual();
    }
}

/**
 * Navega para a página anterior do diário.
 */
export function paginaAnterior() {
    if (estadoDiario.paginaAtual > 0) {
        estadoDiario.paginaAtual--;
        mostrarPaginaAtual();
    }
}

/**
 * Abre o diário e o inicializa na primeira página.
 */
export function abrirEAtualizarDiario() {
    estadoDiario.paginaAtual = 0; // Reseta para a primeira página ao abrir
    ui.mostrarTela('modal-diario-acoes');
    mostrarPaginaAtual();
    // Aqui você também pode adicionar código para preencher
    // o diário com as informações atuais (comida, água, personagens, etc.)
}