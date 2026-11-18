// Teste: lixeira de rodas refeita com o que aprendi do pacote V2.
// - escuro comum (#1d1927) no fundo de todas as rampas e no contorno; matiz do material só nos tons médios e claros;
// - saturação baixa; sombras viram para o azul/violeta, luzes para o amarelo-esverdeado e desbotam;
// - contorno de 1 px, seletivo (mais leve do lado da luz); mais tons por material, com passagem em degraus;
// - chanfros com fio de luz; um reflexo diagonal no painel; arranhões claros só onde a mão e a calçada pegam.
include("atelie.px.js")   // Gerar: node tools/pxl/bin/pxl.js build arte/pxl/modelos/teste_v3.px.js --out arte/pxl/modelos/out

const ESC = '#1d1927'
// Rampas de 9 tons: 0 = contorno, 1..8 = do mais escuro ao brilho.
const PLAST = [ESC, '#24283a', '#29363f', '#2e4247', '#36504f', '#3f5a57', '#526f68', '#6b877a', '#93a99a']
const BORR = [ESC, '#201d2a', '#282533', '#312e3d', '#3b3848', '#474455', '#575566', '#6c6a79', '#8a8996']
const CHAPA = [ESC, '#3a3843', '#4f4e57', '#66666c', '#7b7b7e', '#8e8d8c', '#a19f9b', '#b6b3ab', '#ccc8be']

function lixeira3() {
  const T = new Tela(96, 128), pl = T.mat(PLAST), bo = T.mat(BORR), ch = T.mat(CHAPA)
  const soP = (x, y, m) => m === pl
  // Rodas: ficam atrás do corpo, aparecem nos dois cantos de baixo. Pneu com face (luz à esquerda) e cubo pequeno.
  for (const [cx, lado] of [[16, -1], [80, 1]]) {
    T.elipse(cx, 113, 7.5, 11, bo, (x) => x < cx - 3 ? 5 : x < cx + 2 ? 4 : 2)
    T.elipse(cx + lado * 1.5, 113, 4, 7.5, bo, 3); T.elipse(cx + lado * 1.5, 113, 2.2, 3.4, ch, (x, y) => y < 112 ? 6 : 4); T.p(cx + lado * 1.5 - 1, 111, ch, 8)
    T.ret(cx - 6, 104, 1, 18, bo, 6, (x, y, m) => m === bo && T.T(x, y) >= 4)
  }
  // Corpo: afina para baixo. Três planos: quina esquerda (luz), frente, lateral direita (sombra); a frente escurece para baixo.
  const esq = y => 14 + (y - 40) * 6 / 82, dir = y => 82 - (y - 40) * 6 / 82
  T.poli([[14, 40], [82, 40], [76, 122], [20, 122]], pl, (x, y) => {
    const e = esq(y), d = dir(y), u = (x - e) / (d - e), v = (y - 40) / 82
    if (u < .06) return 7; if (u < .1) return 6; if (u > .9) return 2; if (u > .83) return 3
    return v < .8 - u * .12 ? 5 : 4   // a frente escurece embaixo, num degrau inclinado (não em pontilhado)
  })
  // Painel rebaixado na frente: moldura com fio de luz em cima/esquerda e sombra embaixo/direita.
  const pe = y => esq(y) + 9, pd = y => dir(y) - 12
  for (let y = 52; y < 114; y++) for (let x = Math.ceil(pe(y)); x < Math.floor(pd(y)); x++) {
    const borda = y === 52 || x === Math.ceil(pe(y)) ? 'luz' : y === 113 || x === Math.floor(pd(y)) - 1 ? 'sombra' : null
    if (borda === 'luz') T.p(x, y, pl, 3); else if (borda === 'sombra') T.p(x, y, pl, 6); else if (y === 53 || x === Math.ceil(pe(y)) + 1) T.p(x, y, pl, 4)
  }
  // Reflexo diagonal largo atravessando o painel (luz fria da rua) e um segundo, fino.
  T.tonalizar((x, y) => { const u = x + y * .7; return u > 88 && u < 104 && y > 54 && y < 112 }, 1, (x, y, m) => m === pl && T.T(x, y) >= 4 && T.T(x, y) <= 5)
  T.tonalizar((x, y) => { const u = x + y * .7; return u > 108 && u < 111 && y > 56 && y < 108 }, 1, (x, y, m) => m === pl && T.T(x, y) >= 4 && T.T(x, y) <= 5)
  // Etiqueta em branco: chapa presa por dois rebites, com o canto descascado.
  T.retR(36, 64, 22, 12, 2, ch, (x, y) => y === 64 ? 7 : x > 54 ? 4 : y > 73 ? 4 : 5); T.ret(37, 65, 20, 1, ch, 8)
  T.ret(38, 69, 12, 1, ch, 4); T.ret(52, 71, 3, 1, ch, 4); T.p(38, 66, ch, 2); T.p(56, 66, ch, 2); T.poli([[54, 72], [58, 72], [58, 76], [55, 76]], pl, 4)
  // Gola debaixo da tampa (na sombra dela) e as duas abas que seguram a tampa.
  T.ret(14, 40, 68, 3, pl, 1, soP); T.ret(15, 43, 66, 1, pl, 2, soP)
  for (const x of [26, 64]) { T.ret(x, 39, 7, 9, pl, (i, j) => i === x ? 6 : i === x + 6 ? 2 : 4); T.ret(x, 47, 7, 1, pl, 1) }
  // Arranhões: claros, curtos, inclinados, perto da base e na quina (onde a calçada e as mãos pegam).
  for (const [x, y, l] of [[22, 104, 4], [28, 109, 3], [66, 98, 3], [70, 107, 4], [17, 84, 3], [44, 116, 3]]) for (let k = 0; k < l; k++) T.p(x + k, y - Math.floor(k * .6), pl, Math.min(8, T.T(x + k, y - Math.floor(k * .6)) + 2), soP)
  T.ret(20, 118, 56, 4, pl, (x) => x < 24 ? 4 : x > 70 ? 1 : 2, soP); T.ret(20, 118, 56, 1, pl, 5, soP)
  // Tampa: face de cima (pega a luz), com o rebaixo do meio; aba da frente com o puxador; alça atrás.
  T.ret(22, 4, 52, 4, pl, (x) => x < 26 ? 6 : 4); T.ret(24, 4, 48, 1, pl, 7)
  for (const x of [22, 68]) { T.ret(x, 4, 6, 10, pl, (i) => i === x ? 7 : i === x + 5 ? 2 : 5); T.ret(x, 4, 6, 1, pl, 8) }
  T.poli([[14, 13], [82, 13], [87, 19], [88, 30], [8, 30], [9, 19]], pl, (x, y) => y < 15 ? 8 : x < 13 ? 7 : x > 84 ? 4 : y < 22 ? 7 : 6)
  T.poli([[22, 16], [74, 16], [78, 20], [78, 26], [18, 26], [18, 20]], pl, (x, y) => y === 16 || x === 18 ? 4 : y === 25 ? 8 : 6)
  T.ret(19, 17, 58, 2, pl, 5, (x, y, m) => m === pl && T.T(x, y) === 6)
  T.retR(7, 30, 82, 10, 2, pl, (x, y) => y === 30 ? 8 : y === 31 ? 7 : x > 84 ? 3 : y > 37 ? 4 : 5, null, 12); T.ret(8, 39, 80, 1, pl, 2)
  T.retR(39, 32, 18, 6, 1.5, pl, (x, y) => y === 32 ? 3 : y === 37 ? 7 : 4); T.ret(41, 34, 14, 2, pl, 2)
  for (const [x, y, l] of [[60, 22, 4], [30, 21, 3], [76, 34, 3]]) for (let k = 0; k < l; k++) T.p(x + k, y - Math.floor(k * .5), pl, 8, soP)
  T.contornoSeletivo(); return T
}
sprite("lixeira_rodas_v3", { w: 96, h: 128 }, (c) => lixeira3().pintar(c))
