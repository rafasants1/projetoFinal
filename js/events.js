// js/events.js

/**
 * Definições de todos os eventos aleatórios do jogo.
 * As funções de 'acao' recebem um contexto com os módulos 'state' e 'ui'.
 */
export const eventos = [
    {
        id: 'barulho_estranho', titulo: 'Barulho Estranho Lá Fora',
        descricao: 'Você ouve um barulho arranhando a porta do abrigo. Parece ser algo grande. O que fazer?',
        urlImagem: 'https://placehold.co/350x180/4A3B31/FF6B6B?text=BARULHO+SUSPEITO+NA+PORTA&font=specialelite',
        requerMembroNoAbrigo: true,
        escolhas: [
            { 
                texto: 'Investigar com Cuidado', 
                acao: (ctx) => {
                    const { state, ui, registrarLog } = ctx;
                    const estado = state.getEstado();
                    let tituloResultado = 'Investigação'; 
                    let textoResultado = '';
                    //... (lógica do evento aqui, usando ctx.state, ctx.ui, etc.)
                    // Exemplo de como adaptar:
                    const comidaEncontrada = Math.floor(Math.random() * 2) + 1; 
                    estado.comida += comidaEncontrada;
                    registrarLog(`Encontraram ${comidaEncontrada} de comida!`);
                    textoResultado = `Vocês encontraram ${comidaEncontrada} unidades de comida!`;
                    ui.mostrarMensagemResultado('Sorte!', textoResultado, ctx.proximaAcao);
                }
            },
            { 
                texto: 'Ignorar e Reforçar a Porta', 
                acao: (ctx) => {
                    ctx.registrarLog('Decidiram ignorar o barulho e reforçar a porta.');
                    ctx.ui.mostrarMensagemResultado('Precaução', 'Vocês reforçaram a porta. A noite passou em silêncio.', ctx.proximaAcao);
                }
            }
        ]
    },
    // ... (Adapte todos os outros eventos para usar o objeto de contexto 'ctx')
];