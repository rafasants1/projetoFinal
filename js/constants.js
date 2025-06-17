// js/constants.js

/**
 * Contém todas as constantes e configurações base do jogo.
 */

// Regras de Sobrevivência
export const DIAS_PARA_MORRER_FOME_SEDE = 5;
export const DURACAO_EXPEDICAO_DIAS = 3;

// Configurações de Moral
export const MORAL_INICIAL = 80;
export const MORAL_MAXIMA = 100;
export const MORAL_MINIMA = 0;

// Modificadores de Moral
export const MUDANCA_MORAL_FOME_SEDE = -5;
export const MUDANCA_MORAL_DOENTE_FERIDO = -3;
export const MUDANCA_MORAL_MORTE_FAMILIA = -25;
export const MUDANCA_MORAL_ALIMENTADO_HIDRATADO_BAIXO = 7;
export const MUDANCA_MORAL_EXP_SUCESSO = 12;
export const MUDANCA_MORAL_EXP_FALHA = -8;
export const MUDANCA_MORAL_AJUDOU_ESTRANHO = 10;
export const MUDANCA_MORAL_ROUBADO = -15;
export const MUDANCA_MORAL_IGNOROU_APELO = -5;

// Configurações Iniciais
export const PERSONAGENS_INICIAIS = [
    { id: 'ted', nome: 'Ted (Pai)', vivo: true, diasSemComida: 0, diasSemAgua: 0, status: 'Saudável', moral: MORAL_INICIAL, emExpedicao: false },
    { id: 'dolores', nome: 'Dolores (Mãe)', vivo: true, diasSemComida: 0, diasSemAgua: 0, status: 'Saudável', moral: MORAL_INICIAL, emExpedicao: false },
    { id: 'timmy', nome: 'Timmy (Filho)', vivo: true, diasSemComida: 0, diasSemAgua: 0, status: 'Saudável', moral: MORAL_INICIAL, emExpedicao: false },
    { id: 'maryjane', nome: 'Mary Jane (Filha)', vivo: true, diasSemComida: 0, diasSemAgua: 0, status: 'Saudável', moral: MORAL_INICIAL, emExpedicao: false }
];

// --- LISTA DE ITENS ATUALIZADA ---
export const TODOS_ITENS_POSSIVEIS = [
    'Machado', 'Rádio Portátil', 'Kit Médico', 'Mapa da Região', 'Lanterna', 
    'Fita Adesiva', 'Sementes Misteriosas', 'Remédio Duvidoso', 'Pé de Cabra', 'Munição (3)',
    'Peça de Motor', 'Lata de Feijão', 'Coleira de Cachorro', 'Violão Velho', 'Garrafa de Uísque'
];
export const NUM_ITENS_INICIAIS = 3;
export const ITENS_TROCAVEIS = [
    'Machado', 'Rádio Portátil', 'Kit Médico', 'Mapa da Região', 'Lanterna', 'Fita Adesiva', 
    'Pé de Cabra', 'Munição (3)', 'Peça de Motor', 'Lata de Feijão', 'Coleira de Cachorro', 
    'Violão Velho', 'Garrafa de Uísque'
];