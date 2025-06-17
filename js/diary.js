// js/diary.js
import * as ui from './ui.js';
import * as state from './state.js';

let estadoDiario = {
    paginaAtual: 0,
    paginas: ['pagina-diario-distribuicao', 'pagina-diario-expedicao', 'pagina-diario-fim-dia']
};

/**
 * Popula a página de distribuição com os personagens e checkboxes.
 */
function popularPaginaDistribuicao() {
    const { personagens, comida, agua, selecoesTemporariasDiario } = state.getEstado();
    const container = document.getElementById('container-personagens-dist-diario');
    
    // Atualiza displays de recursos no diário
    document.getElementById('diario-dist-comida').textContent = comida;
    document.getElementById('diario-dist-agua').textContent = agua;

    container.innerHTML = ''; // Limpa o container

    personagens.forEach(p => {
        if (p.vivo && !p.emExpedicao) {
            const divPersonagem = document.createElement('div');
            divPersonagem.className = 'cartao-dist-personagem';

            const comidaMarcado = selecoesTemporariasDiario.distribuicao[p.id]?.comida ? 'checked' : '';
            const aguaMarcado = selecoesTemporariasDiario.distribuicao[p.id]?.agua ? 'checked' : '';

            divPersonagem.innerHTML = `
                <h4>${p.nome} (Sede: ${p.diasSemAgua}d, Fome: ${p.diasSemComida}d)</h4>
                <label>
                    <input type="checkbox" class="form-checkbox" data-personagem-id="${p.id}" data-recurso="comida" ${comidaMarcado}>
                    Dar Comida
                </label>
                <label>
                    <input type="checkbox" class="form-checkbox" data-personagem-id="${p.id}" data-recurso="agua" ${aguaMarcado}>
                    Dar Água
                </label>
            `;
            container.appendChild(divPersonagem);
        }
    });

    // Adiciona os event listeners para os checkboxes recém-criados
    container.querySelectorAll('.form-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const id = e.target.dataset.personagemId;
            const recurso = e.target.dataset.recurso;
            state.atualizarSelecaoDistribuicao(id, recurso, e.target.checked);
            // Re-renderiza para atualizar contagem de recursos se necessário no futuro
        });
    });
}


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

    // Popula a página de distribuição se ela for a página ativa
    if (idPaginaAtual === 'pagina-diario-distribuicao') {
        popularPaginaDistribuicao();
    }

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
}