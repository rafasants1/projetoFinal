// js/minigame.js
import { TODOS_ITENS_POSSIVEIS } from './constants.js';

document.addEventListener('DOMContentLoaded', () => {
    const areaJogo = document.getElementById('area-jogo');
    const jogador = document.getElementById('jogador');
    const bunker = document.getElementById('bunker');
    const tempoRestanteEl = document.getElementById('tempo-restante');
    const itensColetadosEl = document.getElementById('itens-coletados');

    const params = new URLSearchParams(window.location.search);
    const dificuldade = params.get('difficulty') || 'medio';

    let tempoRestante = 60;
    let jogadorX = 50;
    let jogadorY = 50;
    const velocidade = 1.5;
    let teclasPressionadas = {};
    let inventarioJogador = [];
    const itensNoAbrigo = new Set();
    const obstaculos = [];

    // Layout da casa [x, y, largura, altura] em porcentagem
    const layoutObstaculos = [
        [10, 20, 30, 8],  // Sofá
        [10, 28, 8, 15],  // Poltrona
        [55, 40, 25, 8],  // Mesa de centro
        [80, 10, 8, 40],  // Estante
        [0, 70, 40, 8],   // Bancada
    ];

    function criarObstaculos() {
        layoutObstaculos.forEach(layout => {
            const obs = document.createElement('div');
            obs.className = 'obstaculo';
            obs.style.left = `${layout[0]}%`;
            obs.style.top = `${layout[1]}%`;
            obs.style.width = `${layout[2]}%`;
            obs.style.height = `${layout[3]}%`;
            areaJogo.appendChild(obs);
            obstaculos.push(obs);
        });
    }

    function estaColidindo(rect1, rect2) {
        return !(rect1.right < rect2.left ||
                 rect1.left > rect2.right ||
                 rect1.bottom < rect2.top ||
                 rect1.top > rect2.bottom);
    }
    
    function checarColisaoComObstaculos(elementoRect) {
        for (const obs of obstaculos) {
            if (estaColidindo(elementoRect, obs.getBoundingClientRect())) {
                return true;
            }
        }
        return false;
    }

    function criarItens() {
        const bunkerRect = bunker.getBoundingClientRect();
        
        // Novo: Define a quantidade de itens com base na dificuldade
        let numeroDeItens;
        switch (dificuldade) {
            case 'facil':
                numeroDeItens = 15;
                break;
            case 'medio':
                numeroDeItens = 10;
                break;
            case 'dificil':
                numeroDeItens = 7;
                break;
            default:
                numeroDeItens = 10;
        }

        // Embaralha e seleciona a quantidade correta de itens
        const itensParaGerar = [...TODOS_ITENS_POSSIVEIS].sort(() => 0.5 - Math.random()).slice(0, numeroDeItens);

        itensParaGerar.forEach((nomeItem) => {
            const item = document.createElement('div');
            item.className = 'item';
            item.dataset.itemNome = nomeItem;
            
            let itemRect;
            let colidindo;

            do {
                item.style.left = `${Math.random() * 95}%`;
                item.style.top = `${Math.random() * 95}%`;
                
                document.body.appendChild(item);
                itemRect = item.getBoundingClientRect();
                document.body.removeChild(item);

                colidindo = estaColidindo(itemRect, bunkerRect) || checarColisaoComObstaculos(itemRect);

            } while (colidindo);
            
            item.style.backgroundImage = `url('https://placehold.co/32x32/8B4513/FFFFFF?text=${nomeItem.charAt(0)}')`;
            areaJogo.appendChild(item);
        });
    }

    function atualizarPosicaoJogador() {
        let proximoX = jogadorX;
        let proximoY = jogadorY;

        if (teclasPressionadas['ArrowUp'] || teclasPressionadas['w']) proximoY -= velocidade;
        if (teclasPressionadas['ArrowDown'] || teclasPressionadas['s']) proximoY += velocidade;
        if (teclasPressionadas['ArrowLeft'] || teclasPressionadas['a']) proximoX -= velocidade;
        if (teclasPressionadas['ArrowRight'] || teclasPressionadas['d']) proximoX += velocidade;

        proximoX = Math.max(0, Math.min(100 - (jogador.offsetWidth / areaJogo.offsetWidth) * 100, proximoX));
        proximoY = Math.max(0, Math.min(100 - (jogador.offsetHeight / areaJogo.offsetHeight) * 100, proximoY));
        
        const proximaRect = {
            left: areaJogo.offsetLeft + (proximoX / 100) * areaJogo.offsetWidth,
            top: areaJogo.offsetTop + (proximoY / 100) * areaJogo.offsetHeight,
            right: areaJogo.offsetLeft + (proximoX / 100) * areaJogo.offsetWidth + jogador.offsetWidth,
            bottom: areaJogo.offsetTop + (proximoY / 100) * areaJogo.offsetHeight + jogador.offsetHeight,
        };
        
        if (!checarColisaoComObstaculos(proximaRect)) {
            jogadorX = proximoX;
            jogadorY = proximoY;
        }

        jogador.style.left = `${jogadorX}%`;
        jogador.style.top = `${jogadorY}%`;
    }

    function verificarColisoesComItensEBunker() {
        const jogadorRect = jogador.getBoundingClientRect();
        const bunkerRect = bunker.getBoundingClientRect();

        document.querySelectorAll('.item').forEach(item => {
            if (inventarioJogador.length > 0) return;
            const itemRect = item.getBoundingClientRect();
            if (estaColidindo(jogadorRect, itemRect)) {
                inventarioJogador.push(item.dataset.itemNome);
                item.style.display = 'none';
                jogador.classList.add('carregando');
            }
        });

        if (inventarioJogador.length > 0 && estaColidindo(jogadorRect, bunkerRect)) {
            const itemNome = inventarioJogador.pop();
            itensNoAbrigo.add(itemNome);
            itensColetadosEl.textContent = itensNoAbrigo.size;
            jogador.classList.remove('carregando');
            
            const itemColetado = document.querySelector(`.item[data-item-nome="${itemNome}"]`);
            if (itemColetado) {
                 itemColetado.remove();
            }
        }
    }
    
    function gameLoop() {
        atualizarPosicaoJogador();
        verificarColisoesComItensEBunker();
        requestAnimationFrame(gameLoop);
    }

    const temporizador = setInterval(() => {
        tempoRestante--;
        tempoRestanteEl.textContent = tempoRestante;
        if (tempoRestante <= 0) {
            clearInterval(temporizador);
            encerrarMinigame();
        }
    }, 1000);

    function encerrarMinigame() {
        const resultado = {
            dificuldade: dificuldade,
            itensColetados: Array.from(itensNoAbrigo)
        };
        localStorage.setItem('resultadoMinigame', JSON.stringify(resultado));
        window.location.href = 'jogo.html';
    }

    window.addEventListener('keydown', (e) => { teclasPressionadas[e.key] = true; });
    window.addEventListener('keyup', (e) => { teclasPressionadas[e.key] = false; });

    criarObstaculos();
    criarItens();
    requestAnimationFrame(gameLoop);
});