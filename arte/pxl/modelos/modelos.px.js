// Modelos de cenário (PROVA, ainda não usados no jogo): anime pixel art em alta resolução, 4 px de arte = 1 px de mundo.
// Gerar: node tools/pxl/bin/pxl.js build arte/pxl/modelos/modelos.px.js --out arte/pxl/modelos/out
// As ferramentas de pintura (tela de material + tom, folhagem, contorno colorido) estão em atelie.px.js.
include("atelie.px.js")

// ---------- Lixeira de rodas (20 x 29 de mundo) ----------
function lixeiraRodas(cor, corTampa) {
  const T = new Tela(96, 128), corpo = T.mat(cor), tampa = T.mat(corTampa), borr = T.mat("#2b2a35"), metal = T.mat("#70757f"), papel = T.mat("#8f978b"), ferr = T.mat("#6e4634")
  const soC = (x, y, m) => m === corpo, soT = (x, y, m) => m === tampa
  // Rodas (atrás): pneu, aro e cubo; só aparecem nos cantos de baixo.
  for (const cx of [21, 75]) { T.elipse(cx, 112, 7.5, 10.5, borr, 2); T.elipse(cx - 1, 110.5, 5, 8, borr, 3); T.elipse(cx, 112, 3.6, 5.2, borr, 1); T.elipse(cx, 112, 2.6, 3.8, metal, 3); T.elipse(cx - .6, 111, 1.2, 1.8, metal, 5) }
  // Corpo: trapézio, mais largo em cima. Planos da esquerda para a direita: quina na luz, frente, quina na sombra.
  const esq = y => 13 + (y - 44) * 6 / 64, dir = y => 83 - (y - 44) * 6 / 64
  T.poli([[13, 44], [83, 44], [77.5, 104], [74, 108], [22, 108], [18.5, 104]], corpo, (x, y) => x < esq(y) + 4 ? 4 : x > dir(y) - 4 ? 1 : x > dir(y) - 13 ? 2 : 3)
  T.ret(esq(46), 46, 1, 50, corpo, 5, soC)
  // Gola debaixo da tampa (na sombra dela) e o degrau onde o corpo afina.
  T.tonalizar((x, y) => y < 51, -1, soC); T.ret(13, 51, 70, 1, corpo, 1, soC); T.ret(14, 52, 68, 1, corpo, 2, soC)
  // Frisos verticais: sulco com a parede esquerda na sombra e a direita na luz; cada um nasce com um arremate escuro.
  for (const x of [29, 41, 53, 65]) { T.ret(x, 59, 2, 40, corpo, 2, soC); T.ret(x + 2, 60, 1, 39, corpo, 4, soC); T.ret(x, 58, 3, 1, corpo, 1, soC); T.ret(x, 99, 3, 1, corpo, 4, soC) }
  // Barra de baixo (pé da frente): fica mais escura e pega uma linha de luz em cima.
  T.tonalizar((x, y) => y >= 102, -1, soC); T.ret(20, 102, 56, 1, corpo, 4, soC)
  // Etiqueta velha, com um canto rasgado e marcas que não se leem.
  T.poli([[37, 64], [61, 64], [61, 81], [43, 81], [37, 75]], papel, 3); T.ret(37, 64, 24, 1, papel, 4); T.ret(60, 65, 1, 16, papel, 2); T.ret(40, 68, 15, 2, papel, 1); T.ret(40, 72, 9, 1, papel, 2); T.ret(51, 72, 7, 1, papel, 2); T.ret(45, 76, 12, 1, papel, 2); T.divisa(corpo, papel, 2)
  // Escorridos de sujeira debaixo da aba e ferrugem na barra de baixo.
  for (const [x, l, w] of [[20, 15, 2], [35, 8, 1], [48, 10, 2], [70, 24, 3], [76, 12, 2]]) T.ret(x, 52, w, l, corpo, 2, (i, j, m) => m === corpo && T.T(i, j) > 2)
  T.ret(24, 103, 6, 4, ferr, 3, soC); T.ret(25, 98, 2, 5, ferr, 2, soC); T.ret(27, 100, 1, 3, ferr, 3, soC); T.ret(68, 104, 5, 3, ferr, 2, soC)
  // Dobradiças e barra atrás da tampa.
  for (const x of [24, 62]) { T.retR(x, 7, 10, 8, 2, tampa, 3); T.ret(x + 1, 7, 8, 2, tampa, 4) } T.ret(34, 9, 28, 4, tampa, 2); T.ret(34, 9, 28, 1, tampa, 3)
  // Tampa, face de cima: na luz, com um rebaixo moldado (parede de cima na sombra, de baixo na luz).
  T.poli([[18, 13], [78, 13], [84, 17], [88, 24], [88, 37], [8, 37], [8, 24], [12, 17]], tampa, 4)
  T.poli([[19, 14], [77, 14], [82, 17], [14, 17]], tampa, 5, soT); T.ret(9, 24, 2, 12, tampa, 5, soT)
  T.poli([[24, 20], [72, 20], [78, 25], [78, 33], [18, 33], [18, 25]], tampa, 3, soT); T.poli([[24, 20], [72, 20], [76, 23], [20, 23]], tampa, 2, soT); T.ret(18, 25, 2, 8, tampa, 2, soT); T.ret(20, 32, 57, 1, tampa, 5, soT)
  // Aba da frente da tampa, com o puxador rebaixado no meio.
  T.retR(8, 37, 80, 8, 3, tampa, (x, y) => x > 76 ? 2 : 3, null, 12); T.ret(9, 37, 78, 1, tampa, 5, soT); T.ret(10, 44, 76, 1, tampa, 1, soT)
  T.retR(37, 40, 22, 4, 1.5, tampa, 1); T.ret(38, 43, 20, 1, tampa, 2)
  T.suavizar((x, y, m) => m === corpo && y > 53 && y < 101); T.contorno(2); return T
}
sprite("lixeira_rodas", { w: 96, h: 128 }, (c) => lixeiraRodas("#3d5a4a", "#4a6c58").pintar(c))

// ---------- Árvore de rua (105 x 121 de mundo) ----------
// Tronco com a luz pela esquerda: meia-largura e centro variam com a altura (alarga nas raízes, faz uma curva leve).
function tronco(T, casca, yTopo, yChao, cx0, larg, curva = 5, pe = 14) {
  const cx = y => cx0 + curva * Math.sin((y - yTopo) / (yChao - yTopo) * Math.PI), hw = y => larg + 3 * (y - yTopo) / (yChao - yTopo) + pe * Math.max(0, (y - (yChao - 34)) / 34) ** 1.7
  for (let y = yTopo; y <= yChao; y++) { const c = cx(y), w = hw(y); for (let x = Math.round(c - w); x < Math.round(c + w); x++) { const s = (x + .5 - c) / w; T.p(x, y, casca, s < -.62 ? 4 : s < .02 ? 3 : s < .6 ? 2 : 1) } }
  // Casca: sulcos compridos que acompanham o tronco, mais fundos do lado da sombra.
  for (let q = 0; q < 13; q++) { const s = -.75 + sorte(q, 5) * 1.5, y0 = yTopo + 20 + sorte(q, 7) * (yChao - yTopo - 70), l = 16 + sorte(q, 9) * 34; for (let y = y0; y < y0 + l && y < yChao - 4; y++) { const x = Math.round(cx(y) + s * hw(y)); T.p(x, y, casca, Math.max(1, T.T(x, y) - 1), (i, j, m) => m === casca); if (s < -.2) T.p(x + 1, y, casca, Math.min(5, T.T(x + 1, y) + 1), (i, j, m) => m === casca && T.T(i, j) < 4) } }
  return { cx, hw }
}
function arvoreCopa() {
  const T = new Tela(424, 488), casca = T.mat("#4e3e39"), folha = T.mat("#2f4b3b", { puxa: .42, luz: .8 }), soCasca = (x, y, m) => m === casca
  tronco(T, casca, 258, 478, 212, 17)
  // Galhos entrando na copa e um nó na casca.
  const galho = (x0, y0, x1, y1, r0, r1) => T.capsula(x0, y0, x1, y1, r0, r1, casca, (x, y) => (x - x0) * (y1 - y0) - (y - y0) * (x1 - x0) > 0 === (y1 < y0) ? 2 : 3)
  galho(210, 310, 152, 242, 10, 5); galho(214, 300, 270, 236, 10, 5); galho(212, 272, 208, 206, 10, 5)
  T.elipse(218, 380, 6, 8, casca, 1, soCasca); T.elipse(217, 379, 3.4, 5, casca, 2, soCasca); T.elipse(216.5, 378.5, 1.4, 2.4, casca, 1, soCasca)
  // Copa: volumes grandes e, por cima, cachos menores (silhueta recortada, não redonda).
  const tufos = [[212, 162, 96], [130, 200, 74], [300, 194, 76], [162, 108, 64], [264, 102, 62], [212, 66, 42], [78, 226, 40], [350, 218, 40], [104, 134, 42], [328, 128, 42], [170, 266, 54], [256, 268, 56], [112, 268, 38], [318, 264, 38], [212, 244, 60]]
  T.folhagem(comCachos(tufos, 44, 24, 38, .5, 5), folha, { folhas: 1.1, tam: 4, cortes: [.08, .4, .7, .93] })
  // Vãos escuros embaixo da copa e a sombra dela no alto do tronco.
  for (const [x, y, rx, ry] of [[188, 298, 13, 8], [238, 302, 12, 7], [144, 292, 9, 6], [284, 294, 9, 6]]) T.elipse(x, y, rx, ry, folha, 1, (i, j, m) => m === folha)
  T.tonalizar((x, y) => y < 356 + (x - 212) * .55, -1, soCasca)
  T.contorno(2); return T
}
sprite("arvore_copa", { w: 424, h: 488 }, (c) => arvoreCopa().pintar(c))

// ---------- Árvore seca (88 x 116 de mundo) ----------
function arvoreSeca() {
  const T = new Tela(356, 468), casca = T.mat("#463a3d"), soCasca = (x, y, m) => m === casca
  tronco(T, casca, 250, 458, 176, 13, -6, 12)
  // Galhos tortos que se dividem e afinam; cada um pega a luz de um lado só.
  const galho = (x0, y0, x1, y1, r0, r1) => { const dx = x1 - x0, dy = y1 - y0; T.capsula(x0, y0, x1, y1, r0, r1, casca, (x, y) => { const s = ((x - x0) * dy - (y - y0) * dx) / Math.hypot(dx, dy) / Math.max(r0, 1.5) * (dy < 0 ? 1 : -1) * Math.sign(dx || 1) * (dx > 0 ? -1 : 1); return s > .35 ? 4 : s > -.3 ? 3 : 2 }) }
  let n = 0
  const ramo = (x, y, ang, comp, r, nivel) => { n++; const torto = (sorte(n, 3) - .5) * .5, x1 = x + Math.cos(ang + torto) * comp, y1 = y + Math.sin(ang + torto) * comp; galho(x, y, x1, y1, r, r * .68)
    if (nivel > 0) { const k = nivel > 2 ? 2 : 2 + (sorte(n, 7) > .6 ? 1 : 0); for (let i = 0; i < k; i++) { const ab = (i - (k - 1) / 2) * (.75 + sorte(n, 11 + i) * .35) + (sorte(n, 17 + i) - .5) * .3; ramo(x1, y1, ang + torto + ab - .06 * Math.cos(ang), comp * (.66 + sorte(n, 23 + i) * .16), r * .66, nivel - 1) } } }
  ramo(172, 262, -2.2, 64, 9.5, 3); ramo(178, 256, -1.42, 70, 9, 3); ramo(182, 266, -.72, 58, 8.5, 3); ramo(170, 300, -2.75, 44, 6, 2)
  // Um galho quebrado e o oco no tronco.
  galho(186, 330, 214, 312, 5.5, 4); T.elipse(216, 311, 4.5, 4, casca, 1, soCasca)
  T.elipse(172, 372, 6.5, 9.5, casca, 1, soCasca); T.elipse(171, 371, 4, 6.5, casca, 0, soCasca)
  T.contorno(2); return T
}
sprite("arvore_seca", { w: 356, h: 468 }, (c) => arvoreSeca().pintar(c))

// ---------- Floreira de madeira com arbusto (22 x 28 de mundo) ----------
function vasoArbusto() {
  const T = new Tela(96, 120), mad = T.mat("#5b4136"), terra = T.mat("#2d2526"), folha = T.mat("#2f4b3b", { puxa: .42, luz: .8 }), ferro = T.mat("#4a4d58"), soM = (x, y, m) => m === mad
  // Caixa: tábuas na frente, borda de cima mais clara (pega a luz de cima), cintas de ferro.
  T.ret(14, 70, 68, 42, mad, (x, y) => x < 19 ? 4 : x > 73 ? 2 : 3)
  for (const x of [36, 59]) { T.ret(x, 71, 1, 41, mad, 1); T.ret(x + 1, 71, 1, 41, mad, 4, (i, j, m) => m === mad && T.T(i, j) === 3) }
  for (const [x, y, l] of [[22, 78, 14], [44, 90, 10], [66, 76, 18], [28, 98, 8]]) T.ret(x, y, 1, l, mad, 2, soM)
  T.tonalizar((x, y) => y > 104, -1, soM)
  T.ret(14, 80, 68, 4, ferro, (x, y) => y === 80 ? 4 : x > 73 ? 2 : 3); T.ret(14, 100, 68, 4, ferro, (x, y) => y === 100 ? 4 : x > 73 ? 2 : 3)
  for (const x of [18, 47, 76]) for (const y of [81, 101]) T.ret(x, y, 2, 2, ferro, 1)
  T.ret(11, 62, 74, 9, mad, (x, y) => y < 64 ? 5 : y > 68 ? 2 : 4); T.ret(11, 70, 74, 1, mad, 1)
  T.elipse(48, 63, 31, 4, terra, 2)
  // Arbusto redondo, em tufos.
  T.folhagem(comCachos([[48, 38, 30], [27, 48, 19], [69, 48, 19], [48, 19, 17], [34, 27, 15], [62, 27, 15]], 14, 9, 14, .5, 2), folha, { folhas: 1.3, tam: 2.6, cortes: [.08, .4, .7, .93] })
  T.tonalizar((x, y) => y > 56, -1, (x, y, m) => m === folha)
  T.contorno(2); return T
}
sprite("vaso_arbusto", { w: 96, h: 120 }, (c) => vasoArbusto().pintar(c))

// ---------- Vaso de cerâmica com planta de folhas largas (24 x 34 de mundo) ----------
function vasoFolhas() {
  const T = new Tela(104, 144), cer = T.mat("#3f5566"), terra = T.mat("#2d2526"), folha = T.mat("#32574a", { puxa: .4, luz: .8 }), soC = (x, y, m) => m === cer
  // Folhas de trás primeiro, depois o vaso, depois as da frente.
  const fl = (x, y, ang, comp, larg, curva, tons) => T.folhaLarga(x, y, ang, comp, larg, folha, { curva, tons })
  fl(50, 96, -1.9, 70, 13, -8, [3, 2]); fl(54, 96, -1.2, 66, 12, 8, [3, 2]); fl(52, 98, -1.57, 82, 12, 3, [4, 2])
  fl(46, 98, -2.6, 50, 12, -9, [4, 3]); fl(58, 98, -.5, 50, 12, 10, [3, 2]); fl(48, 100, -2.25, 60, 13, -7, [4, 3]); fl(56, 100, -.9, 58, 13, 8, [4, 2])
  // Vaso: cilindro que afina para baixo, vidrado (uma faixa de brilho), com borda grossa.
  const esq = y => 30 + (y - 100) * 6 / 36, dir = y => 74 - (y - 100) * 6 / 36
  T.poli([[30, 100], [74, 100], [68, 136], [36, 136]], cer, (x, y) => { const s = (x - esq(y)) / (dir(y) - esq(y)); return s < .12 ? 3 : s < .2 ? 5 : s < .5 ? 4 : s < .78 ? 3 : 2 })
  T.retR(27, 92, 50, 10, 3, cer, (x, y) => { const s = (x - 27) / 50; return y < 94 ? 5 : s < .14 ? 4 : s < .22 ? 5 : s < .52 ? 4 : s < .8 ? 3 : 2 }); T.ret(29, 101, 46, 1, cer, 1, soC); T.ret(30, 102, 44, 2, cer, 2, soC)
  T.elipse(52, 93.5, 21, 2.5, terra, 2)
  T.tonalizar((x, y) => y > 130, -1, soC)
  // Lasca na borda e escorrido de água.
  T.poli([[62, 92], [68, 92], [66, 96], [63, 95]], cer, 1); T.ret(42, 104, 2, 18, cer, 3, (x, y, m) => m === cer && T.T(x, y) > 3)
  // Folhas da frente, caindo por cima da borda.
  fl(44, 96, 2.75, 38, 11, 9, [4, 3]); fl(60, 96, .35, 40, 11, -9, [3, 2]); fl(50, 96, -2.0, 34, 10, -4, [5, 3])
  T.contorno(2); return T
}
sprite("vaso_folhas", { w: 104, h: 144 }, (c) => vasoFolhas().pintar(c))

// ---------- Vaso de barro com flores (18 x 27 de mundo) ----------
function vasoFlores() {
  const T = new Tela(80, 116), barro = T.mat("#7a5647"), terra = T.mat("#2d2526"), haste = T.mat("#3a5a45", { luz: .8 }), petala = T.mat("#b2adc6", { puxa: .3 }), miolo = T.mat("#b89f6a"), soB = (x, y, m) => m === barro
  // Hastes e folhas pequenas; uma haste tombou.
  const hasteAte = (x0, y0, x1, y1) => T.capsula(x0, y0, x1, y1, 1.6, 1.2, haste, 3)
  const flor = (x, y, r, murcha) => { for (let k = 0; k < 5; k++) { const a = k * 1.2566 - 1.57 + (murcha ? .5 : 0); T.elipse(x + Math.cos(a) * r * .62, y + Math.sin(a) * r * (murcha ? .4 : .62), r * .56, r * (murcha ? .36 : .56), petala, k === 0 || k === 4 ? 5 : k === 1 ? 3 : 4) } T.elipse(x, y, r * .34, r * .34, miolo, 4); T.p(x - 1, y - 1, miolo, 5) }
  hasteAte(38, 74, 30, 34); hasteAte(41, 74, 44, 22); hasteAte(44, 74, 56, 40); hasteAte(36, 74, 18, 52); hasteAte(46, 74, 66, 66)
  for (const [x, y, a] of [[33, 54, -2.6], [43, 46, -.4], [50, 56, -.3], [26, 62, 2.9], [41, 62, -2.7], [58, 68, .4]]) T.folhaLarga(x, y, a, 11, 3.6, haste, { tons: [4, 2], nerv: 2 })
  flor(30, 31, 8); flor(44, 19, 8.5); flor(57, 37, 7.5); flor(17, 50, 6.5); flor(68, 68, 6.5, true)
  // Vaso de barro: borda grossa, corpo que afina; o barro é o único tom quente e fica apagado.
  const esq = y => 23 + (y - 80) * 7 / 30, dir = y => 57 - (y - 80) * 7 / 30
  T.poli([[23, 80], [57, 80], [50, 110], [30, 110]], barro, (x, y) => { const s = (x - esq(y)) / (dir(y) - esq(y)); return s < .2 ? 4 : s < .62 ? 3 : s < .86 ? 2 : 1 })
  T.retR(20, 72, 40, 9, 2.5, barro, (x, y) => { const s = (x - 20) / 40; return y < 74 ? 5 : s < .2 ? 4 : s < .64 ? 3 : 2 }); T.ret(22, 81, 36, 1, barro, 1, soB); T.ret(23, 82, 34, 1, barro, 2, soB)
  T.elipse(40, 73, 16, 2, terra, 2); T.tonalizar((x, y) => y > 105, -1, soB)
  // Marca de umidade e pétalas caídas ao pé do vaso.
  T.poli([[30, 96], [44, 94], [46, 110], [31, 110]], barro, 2, (x, y, m) => m === barro && T.T(x, y) === 3)
  T.elipse(60, 110, 3, 1.6, petala, 4); T.elipse(66, 108, 2.4, 1.4, petala, 3); T.elipse(17, 110, 2.6, 1.5, petala, 4)
  T.contorno(2); return T
}
sprite("vaso_flores", { w: 80, h: 116 }, (c) => vasoFlores().pintar(c))

// ---------- Vitrines (74 x 50 de mundo) ----------
// Moldura, vidro em dois panos, peitoril de pedra e reflexos em faixas diagonais. "dentro" pinta o interior de cada loja.
function vitrine(corMoldura, corVidro, dentro, o = {}) {
  const T = new Tela(304, 204), mold = T.mat(corMoldura), vid = T.mat(corVidro, { luz: .7 }), pedra = T.mat("#666b75"), X = 12, Y = 8, W = 280, H = 172, gx0 = X + 10, gy0 = Y + 10, gx1 = X + W - 10, gy1 = Y + H - 10
  // Moldura chanfrada: em cima e à esquerda na luz, embaixo e à direita na sombra.
  T.ret(X, Y, W, H, mold, (x, y) => y < Y + 3 || x < X + 3 ? 4 : y > Y + H - 4 || x > X + W - 4 ? 2 : 3)
  T.ret(gx0 - 2, gy0 - 2, gx1 - gx0 + 4, gy1 - gy0 + 4, mold, (x, y) => y < gy0 || x < gx0 ? 1 : 4)
  T.ret(gx0, gy0, gx1 - gx0, gy1 - gy0, vid, 2)
  const M = { T, vid, mold, gx0, gy0, gx1, gy1, meio: (gx0 + gx1) / 2 }
  dentro(M)
  // Poeira assentada no pé do vidro e reflexos: duas faixas diagonais por pano, clareando o que estiver atrás.
  const interior = (x, y, m) => m !== mold && m !== pedra && x >= gx0 && x < gx1 && y >= gy0 && y < gy1
  if (o.poeira !== false) T.tonalizar((x, y) => y > gy1 - 7 - Math.max(0, 10 - Math.min(x - gx0, gx1 - x) * .5), 1, (x, y, m) => m === vid && interior(x, y, m))
  for (const [x0, larg] of o.reflexos || [[gx0 + 26, 20], [gx0 + 56, 8], [M.meio + 40, 22], [M.meio + 74, 7]]) T.tonalizar((x, y) => { const u = x - x0 + (y - gy0) * .55; return u > 0 && u < larg }, 1, (x, y, m) => interior(x, y, m) && !T.semTraco.has(m))
  // Montante do meio e travessa.
  T.ret(M.meio - 4, gy0 - 2, 8, gy1 - gy0 + 4, mold, (x, y) => x < M.meio - 2 ? 4 : x > M.meio + 1 ? 2 : 3); T.ret(M.meio + 4, gy0, 1, gy1 - gy0, vid, 1)
  // Peitoril de pedra, mais largo que a moldura.
  T.ret(X - 6, Y + H, W + 12, 12, pedra, (x, y) => y < Y + H + 3 ? 5 : y > Y + H + 9 ? 2 : 3); T.ret(X - 6, Y + H + 3, W + 12, 1, pedra, 4); T.ret(X - 2, Y + H + 12, W + 4, 4, pedra, 1)
  for (const x of [X + 60, X + 150, X + 232]) T.ret(x, Y + H + 4, 1, 8, pedra, 2)
  T.contorno(2); return T
}
// Livraria: três prateleiras de livros, um abajur apagado e um cartão pendurado no vidro.
function vitrineLivros() {
  return vitrine("#2f4a3c", "#1d2330", ({ T, vid, gx0, gy0, gx1, gy1, meio }) => {
    const prat = T.mat("#3f2e26"), cores = ["#5e353b", "#35445f", "#6c5e3f", "#33555a", "#595963", "#877f70", "#4a3a5c"].map(c => T.mat(c, { luz: .8 })), latao = T.mat("#6f5c3a"), papel = T.mat("#a09a8a")
    let n = 0
    for (const py of [gy0 + 46, gy0 + 94, gy1 - 6]) {
      T.ret(gx0, py, gx1 - gx0, 5, prat, (x, y) => y === py ? 4 : 2); T.ret(gx0, py + 5, gx1 - gx0, 3, vid, 1)
      for (let x = gx0 + 5; x < gx1 - 14;) { n++; const w = 6 + Math.floor(sorte(n, 1) * 8), h = 24 + Math.floor(sorte(n, 2) * 15), m = cores[Math.floor(sorte(n, 3) * cores.length)], r = sorte(n, 4)
        if (py > gy0 + 90 && py < gy0 + 100 && x > gx0 + 20 && x < gx0 + 74) { x += 4; continue }                    // vão do abajur
        if (r > .9) { x += 5 + Math.floor(sorte(n, 5) * 6); continue }                                                 // vão: falta um livro
        if (r > .82) { for (let k = 0; k < 3; k++) { const mm = cores[(n + k * 2) % cores.length]; T.ret(x, py - 6 - k * 6, 26 - k * 3, 6, mm, (i, j) => j === py - 6 - k * 6 ? 4 : i > x + 22 - k * 3 ? 2 : 3); T.ret(x + 3, py - 4 - k * 6, 2, 2, mm, 5) } x += 28; continue }   // pilha deitada
        if (r > .74) { T.poli([[x, py], [x + w, py], [x + w + 9, py - h + 3], [x + 9, py - h]], m, (i, j) => i - (py - j) * .27 < x + 2 ? 4 : 3); x += w + 11; continue }                                                 // livro tombado
        T.ret(x, py - h, w, h, m, (i, j) => i < x + 2 ? 4 : i === x + w - 1 ? 2 : 3); T.ret(x, py - h, w, 1, m, 4)
        if (w > 7) { T.ret(x + 2, py - h + 5, w - 3, 1, m, 5); T.ret(x + 2, py - 7, w - 3, 1, m, 5) } else T.ret(x + 2, py - Math.floor(h * .6), w - 3, 2, m, 1)
        x += w + (sorte(n, 6) > .8 ? 2 : 1) }
    }
    // Abajur de mesa apagado, na prateleira do meio.
    const ax = gx0 + 46, ay = gy0 + 94; T.ret(ax - 9, ay - 4, 18, 4, latao, (x, y) => y === ay - 4 ? 4 : 2); T.ret(ax - 1, ay - 26, 3, 22, latao, (x) => x === ax - 1 ? 4 : 2)
    T.poli([[ax - 16, ay - 26], [ax + 16, ay - 26], [ax + 9, ay - 42], [ax - 9, ay - 42]], T.mat("#3d5a4a"), (x, y) => x < ax - 4 ? 4 : x > ax + 6 ? 2 : 3)
    // Cartão pendurado por dentro do vidro (não se lê).
    T.ret(meio + 58, gy0, 1, 22, papel, 2); T.ret(meio + 72, gy0, 1, 22, papel, 2); T.retR(meio + 44, gy0 + 22, 44, 26, 2, papel, 3); T.ret(meio + 44, gy0 + 22, 44, 1, papel, 4)
    T.ret(meio + 51, gy0 + 29, 30, 3, papel, 1); T.ret(meio + 55, gy0 + 37, 22, 2, papel, 2)
  })
}
sprite("vitrine_livros", { w: 304, h: 204 }, (c) => vitrineLivros().pintar(c))
// Loja fechada: persiana a meio caminho, um manequim no escuro, um papel colado por dentro e uma trinca no vidro.
function vitrineFechada() {
  return vitrine("#3b3a4b", "#171a26", ({ T, vid, gx0, gy0, gx1, gy1, meio }) => {
    const pers = T.mat("#4b4d5e"), man = T.mat("#77737f", { luz: .8 }), pano = T.mat("#4a3440"), papel = T.mat("#9a968b"), ferro = T.mat("#3a3d48")
    // Persiana de lâminas no pano esquerdo, torta: desce mais de um lado.
    for (let k = 0; k < 12; k++) { const y = gy0 + k * 7; T.poli([[gx0, y], [meio - 4, y + k * .5], [meio - 4, y + 6 + k * .5], [gx0, y + 6]], pers, (i, j) => (j - y - (i - gx0) / (meio - 4 - gx0) * k * .5) < 2 ? 4 : (j - y - (i - gx0) / (meio - 4 - gx0) * k * .5) > 4.2 ? 1 : 3) }
    T.ret(gx0 + 30, gy0, 1, 90, pers, 1); T.ret(gx0 + 96, gy0, 1, 93, pers, 1); T.ret(gx0 + 110, gy0 + 86, 1, 34, pers, 2); T.elipse(gx0 + 110.5, gy0 + 122, 2.5, 3.5, pers, 4)
    // Caixas empilhadas embaixo da persiana.
    T.ret(gx0 + 14, gy1 - 34, 44, 34, pano, (i, j) => j < gy1 - 31 ? 4 : i > gx0 + 50 ? 2 : 3); T.ret(gx0 + 34, gy1 - 34, 4, 34, pano, 2); T.ret(gx0 + 52, gy1 - 22, 38, 22, pano, (i, j) => j < gy1 - 19 ? 3 : 2)
    // Manequim sem cabeça, num pedestal: só os planos principais, quase silhueta.
    const mx = meio + 66
    T.ret(mx - 1, gy0 + 96, 3, 44, ferro, 3); T.elipse(mx, gy1 - 6, 20, 4, ferro, 2); T.ret(mx - 20, gy1 - 6, 40, 6, ferro, 2)
    T.poli([[mx - 20, gy0 + 34], [mx - 8, gy0 + 28], [mx + 8, gy0 + 28], [mx + 20, gy0 + 34], [mx + 17, gy0 + 62], [mx + 13, gy0 + 82], [mx + 17, gy0 + 100], [mx - 17, gy0 + 100], [mx - 13, gy0 + 82], [mx - 17, gy0 + 62]], man, (i, j) => i < mx - 8 ? 4 : i > mx + 7 ? 2 : 3)
    T.retR(mx - 5, gy0 + 18, 10, 12, 3, man, (i) => i < mx - 1 ? 4 : 2); T.elipse(mx, gy0 + 18, 5, 2, man, 5)
    T.elipse(mx - 21, gy0 + 38, 5, 6, man, 4); T.elipse(mx + 21, gy0 + 38, 5, 6, man, 2)
    // Pano jogado sobre o ombro do manequim.
    T.poli([[mx + 4, gy0 + 28], [mx + 22, gy0 + 34], [mx + 26, gy0 + 76], [mx + 16, gy0 + 70], [mx + 12, gy0 + 46]], pano, (i, j) => (i + j) % 14 < 5 ? 2 : 3)
    // Papel colado por dentro, torto, com fita nos cantos.
    T.poli([[meio + 14, gy0 + 70], [meio + 46, gy0 + 66], [meio + 50, gy0 + 104], [meio + 18, gy0 + 108]], papel, 3); T.poli([[meio + 14, gy0 + 70], [meio + 46, gy0 + 66], [meio + 46.4, gy0 + 68], [meio + 14.4, gy0 + 72]], papel, 4)
    for (const [a, b, l] of [[21, 77, 20], [22, 84, 14], [23, 91, 18], [24, 98, 9]]) T.poli([[meio + a, gy0 + b], [meio + a + l, gy0 + b - l * .12], [meio + a + l, gy0 + b + 2 - l * .12], [meio + a, gy0 + b + 2]], papel, 1)
    T.ret(meio + 12, gy0 + 67, 6, 5, papel, 5); T.ret(meio + 44, gy0 + 102, 6, 5, papel, 5)
    // Trinca no canto de baixo do vidro, saindo de um ponto.
    const tr = T.mat("#8f97ab", { traco: false }), cxx = gx1 - 22, cyy = gy1 - 18
    for (const [dx, dy] of [[-30, -22], [-12, -38], [14, -30], [18, 8], [-26, 12], [-6, 16]]) T.capsula(cxx, cyy, cxx + dx, cyy + dy, .7, .5, tr, 3, (i, j, m) => i < gx1 && j < gy1 && i >= gx0)
    T.capsula(cxx - 18, cyy - 13, cxx - 8, cyy - 26, .6, .5, tr, 3)
  }, { reflexos: [[30, 26], [66, 9], [196, 18], [228, 7]] })
}
sprite("vitrine_fechada", { w: 304, h: 204 }, (c) => vitrineFechada().pintar(c))
// Café aceso: o único calor da rua. Luminária pendente, mesa com xícara, cadeiras em silhueta e sanefa na parte de cima.
function vitrineCafe() {
  return vitrine("#5a3d2e", "#8a5a30", ({ T, vid, gx0, gy0, gx1, gy1, meio }) => {
    const amb = T.mat("#a8743c", { frio: 20, puxa: .25 }), mad = T.mat("#4a2f1e", { frio: 10 }), san = T.mat("#5c302d"), luz = T.mat(["#ffe9b0", "#ffe9b0", "#f3c878", "#ffdc98", "#ffe9b0", "#fff6d8"], { traco: false }), louca = T.mat("#d8cbb0"), W = gx1 - gx0
    // Parede do fundo em três planos (mais clara no meio, onde a luz bate) e rodapé de madeira.
    T.ret(gx0, gy0, W, gy1 - gy0, amb, (x, y) => y < gy0 + 34 ? 2 : y < gy0 + 96 ? 4 : 3); T.ret(gx0, gy1 - 30, W, 30, mad, (x, y) => y === gy1 - 30 ? 4 : 3)
    // Prateleira ao fundo com garrafas e potes em silhueta.
    T.ret(gx0 + 8, gy0 + 60, W - 16, 4, mad, (x, y) => y === gy0 + 60 ? 4 : 2); let n = 0
    for (let x = gx0 + 14; x < gx1 - 22; x += 9 + Math.floor(sorte(n, 2) * 8)) { n++; const h = 10 + Math.floor(sorte(n, 1) * 14), w = 5 + Math.floor(sorte(n, 3) * 4); if (Math.abs(x - meio) < 12) continue; T.ret(x, gy0 + 60 - h, w, h, mad, (i) => i === x ? 4 : 3); if (sorte(n, 4) > .5) T.ret(x + 1, gy0 + 56 - h, w - 2, 4, mad, 3) }
    // Duas luminárias pendentes: fio, cúpula escura e a luz embaixo, com um halo em dois planos.
    for (const lx of [gx0 + 64, meio + 62]) { T.elipse(lx, gy0 + 50, 34, 22, amb, 5, (i, j, m) => m === amb); T.ret(lx, gy0, 1, 30, mad, 1); T.poli([[lx - 13, gy0 + 42], [lx + 14, gy0 + 42], [lx + 7, gy0 + 29], [lx - 6, gy0 + 29]], mad, (i) => i < lx - 2 ? 3 : 2); T.ret(lx - 11, gy0 + 42, 23, 3, luz, 4); T.elipse(lx + .5, gy0 + 46, 5, 3, luz, 5) }
    // Mesa redonda com xícara, e duas cadeiras de encosto alto em silhueta.
    for (const [tx, lado] of [[gx0 + 64, 1], [meio + 62, -1]]) {
      T.elipse(tx, gy1 - 44, 30, 5, mad, 4); T.ret(tx - 30, gy1 - 44, 60, 4, mad, 2); T.ret(tx - 2, gy1 - 40, 5, 36, mad, (i) => i < tx ? 3 : 2); T.elipse(tx, gy1 - 4, 14, 3, mad, 2)
      T.ret(tx - 4 + lado * 8, gy1 - 52, 9, 6, louca, (i, j) => j === gy1 - 52 ? 5 : 4); T.ret(tx + 5 + lado * 8, gy1 - 50, 3, 3, louca, 3); T.elipse(tx + lado * 8, gy1 - 46, 8, 2, louca, 3)
      for (const s of [-1, 1]) { const cx = tx + s * 44; T.retR(cx - 9, gy1 - 78, 18, 30, 4, mad, (i) => i < cx - 5 ? 3 : 2); T.ret(cx - 6, gy1 - 72, 12, 16, amb, 3); T.ret(cx - 10, gy1 - 48, 20, 5, mad, 3); T.ret(cx - 9, gy1 - 43, 3, 40, mad, 2); T.ret(cx + 6, gy1 - 43, 3, 40, mad, 2) }
    }
    // Sanefa em gomos na parte de cima do vidro.
    T.ret(gx0, gy0, W, 10, san, (x, y) => y < gy0 + 2 ? 4 : 3); for (let x = gx0; x < gx1; x += 20) T.elipse(x + 10, gy0 + 10, 10, 8, san, (i, j) => i < x + 7 ? 4 : i > x + 14 ? 2 : 3, (i, j) => j >= gy0 + 10 && i >= gx0 && i < gx1)
  }, { poeira: false, reflexos: [[34, 16], [204, 12]] })
}
sprite("vitrine_cafe", { w: 304, h: 204 }, (c) => vitrineCafe().pintar(c))

// ---------- Placas ----------
// Poste de metal: cilindro com a luz pela esquerda.
function poste(T, m, x, y0, y1, larg) { T.ret(x, y0, larg, y1 - y0, m, (i) => { const s = (i - x) / larg; return s < .22 ? 4 : s < .34 ? 5 : s < .62 ? 3 : 2 }) }
// Placa de rua no poste (54 x 56 de mundo): esmalte verde descascando, nome ilegível, parafusos com ferrugem.
function placaRua() {
  const T = new Tela(224, 232), metal = T.mat("#666c76"), verde = T.mat("#2e4d40"), tinta = T.mat("#aab0a6"), ferr = T.mat("#70452f"), soV = (x, y, m) => m === verde
  poste(T, metal, 176, 34, 216, 12); T.retR(168, 214, 28, 10, 3, metal, (x, y) => y < 216 ? 5 : x > 188 ? 2 : 3); T.elipse(182, 31, 8, 5, metal, 4); T.ret(176, 30, 12, 6, metal, (x) => x < 180 ? 4 : 3)
  // Braçadeiras que prendem a placa.
  for (const y of [22, 50]) { T.ret(172, y, 20, 6, metal, (x, yy) => yy === y ? 5 : x > 186 ? 2 : 3); T.ret(180, y + 2, 3, 2, metal, 1) }
  // Chapa: cantos arredondados, filete claro por dentro, face um pouco mais clara em cima.
  T.retR(8, 12, 172, 54, 6, verde, (x, y) => y < 16 ? 4 : y > 60 ? 2 : 3); T.retR(13, 17, 162, 44, 4, tinta, 3); T.retR(15, 19, 158, 40, 3, verde, (x, y) => y < 24 ? 4 : 3)
  // Restos das letras: blocos gastos que não formam palavra.
  for (const [x, w, h, dy] of [[26, 9, 18, 0], [39, 7, 12, 6], [50, 10, 18, 0], [66, 4, 18, 0], [82, 9, 10, 0], [82, 9, 5, 13], [98, 8, 18, 0], [112, 10, 7, 11], [128, 6, 18, 0], [140, 9, 13, 5]]) T.ret(x, 30 + dy, w, h, tinta, 3, soV)
  // Tinta descascada mostrando a chapa, com a borda escura do esmalte e ferrugem na beirada.
  for (const pts of [[[30, 19], [58, 19], [52, 34], [40, 38], [28, 30]], [[104, 44], [136, 40], [146, 52], [132, 59], [108, 59]], [[150, 19], [173, 19], [173, 32], [160, 30]]]) { T.poli(pts.map(([x, y]) => [x - 1, y - 1]), verde, 1); T.poli(pts, metal, (x, y) => (x + y * 2) % 23 < 6 ? 2 : 3); T.poli(pts.map(([x, y], k) => [x + (k % 2 ? 3 : 1), y + (k > 1 ? 4 : 2)]).slice(1, 4), ferr, 3, (x, y, m) => m === metal) }
  // Parafusos nos cantos e a ferrugem que escorre deles.
  for (const [x, y, l] of [[16, 19, 14], [168, 19, 22], [16, 55, 0], [168, 55, 0]]) { T.ret(x, y, 3, 3, metal, 5); T.ret(x + 1, y + 1, 2, 2, metal, 1); if (l) { T.ret(x + 1, y + 3, 2, l, ferr, 3, (i, j, m) => m === verde || m === tinta); T.ret(x + 3, y + 3, 1, l * .6, ferr, 2, (i, j, m) => m === verde || m === tinta) } }
  T.contorno(2); return T
}
sprite("placa_rua", { w: 224, h: 232 }, (c) => placaRua().pintar(c))
// Placa de loja pendurada (34 x 36 de mundo): braço de ferro batido, correntes e uma tábua com um livro aberto pintado (sem texto).
function placaPendurada() {
  const T = new Tela(140, 148), ferro = T.mat("#3c3e4a"), mad = T.mat("#4d382f"), tinta = T.mat("#a59f8c"), soM = (x, y, m) => m === mad
  // Braço na parede (à esquerda), com mão-francesa em curva e ponta em voluta.
  T.retR(6, 8, 8, 30, 2, ferro, (x) => x < 9 ? 4 : 2); T.ret(12, 16, 116, 5, ferro, (x, y) => y === 16 ? 5 : y === 20 ? 2 : 3)
  for (let a = 0; a <= 1.001; a += .01) { const x = 14 + 46 * Math.sin(a * 1.5708), y = 38 - 17 * (1 - Math.cos(a * 1.5708)) * 1.0; T.elipse(x, y - 17 * 0 + (1 - a) * 0, 2, 2, ferro, a < .5 ? 4 : 3) }
  for (let a = 0; a < 5.4; a += .05) T.elipse(126 + Math.cos(a) * (6 - a * .8), 18 + Math.sin(a) * (6 - a * .8), 1.6, 1.6, ferro, a < 2.5 ? 4 : 3)
  // Correntes: elos alternados.
  for (const x of [38, 102]) for (let k = 0; k < 4; k++) { T.retR(x - (k % 2 ? 1 : 2), 21 + k * 6, k % 2 ? 3 : 5, 7, 1.5, ferro, k % 2 ? 2 : 4) }
  // Tábua: borda entalhada, veios, cantos gastos; desenho de um livro aberto em tinta clara já apagada.
  T.retR(18, 44, 104, 64, 7, mad, (x, y) => y < 48 ? 4 : y > 103 ? 2 : x > 116 ? 2 : 3); T.retR(23, 49, 94, 54, 4, mad, 1); T.retR(25, 51, 90, 50, 3, mad, (x, y) => y < 54 ? 2 : 3)
  for (const [x, y, l] of [[32, 60, 30], [70, 92, 26], [86, 58, 22], [40, 94, 16]]) T.ret(x, y, l, 1, mad, 2, soM)
  const livro = (pts, tom) => T.poli(pts, tinta, tom)
  livro([[40, 66], [68, 62], [68, 90], [40, 94]], 3); livro([[72, 62], [100, 66], [100, 94], [72, 90]], 4); T.ret(69, 61, 3, 31, tinta, 1)
  for (const y of [70, 76, 82]) { T.poli([[45, y], [64, y - 2.5], [64, y - .5], [45, y + 2]], tinta, 1); T.poli([[76, y - 2.5], [95, y], [95, y + 2], [76, y - .5]], tinta, 2) }
  T.tonalizar((x, y) => (x * 3 + y * 5) % 37 < 5 && y > 58, -1, (x, y, m) => m === tinta && T.T(x, y) > 2)
  for (const [x, y] of [[38, 44], [102, 44]]) { T.ret(x - 2, y, 5, 4, ferro, 3); T.ret(x - 1, y + 1, 2, 2, ferro, 5) }
  T.contorno(2); return T
}
sprite("placa_pendurada", { w: 140, h: 148 }, (c) => placaPendurada().pintar(c))
// Placa de trânsito (18 x 60 de mundo): contramão desbotada, amassada, num poste com um adesivo velho.
function placaTransito() {
  const T = new Tela(80, 248), metal = T.mat("#646a74"), verm = T.mat("#7c3539", { puxa: .25 }), branco = T.mat("#aeaca4"), ferr = T.mat("#70452f"), papel = T.mat("#8b8f84")
  poste(T, metal, 35, 60, 236, 10); T.retR(28, 234, 24, 9, 3, metal, (x, y) => y < 236 ? 5 : x > 44 ? 2 : 3)
  T.ret(33, 150, 14, 18, papel, (x, y) => y === 150 ? 4 : 3); T.ret(36, 155, 8, 2, papel, 1); T.ret(36, 160, 5, 1, papel, 2); T.poli([[33, 168], [40, 168], [33, 162]], metal, 3)
  // Disco: aro claro, vermelho desbotado, barra branca; a luz pega em cima à esquerda.
  T.elipse(40, 38, 32, 32, branco, (x, y) => (x - 40) + (y - 38) < -26 ? 5 : (x - 40) + (y - 38) > 30 ? 2 : 3)
  T.elipse(40, 38, 28.5, 28.5, verm, (x, y) => (x - 40) * .8 + (y - 38) < -20 ? 4 : (x - 40) + (y - 38) > 22 ? 2 : 3)
  T.retR(17, 31, 46, 14, 2, branco, (x, y) => y < 33 ? 5 : y > 42 ? 2 : 4)
  // Tinta gasta no vermelho, um amassado e ferrugem nos parafusos.
  for (const [x, y, rx, ry] of [[24, 20, 6, 3], [56, 56, 7, 3], [50, 18, 4, 2]]) T.elipse(x, y, rx, ry, verm, 4, (i, j, m) => m === verm && T.T(i, j) === 3)
  T.elipse(57, 26, 7, 9, verm, 2, (i, j, m) => m === verm); T.elipse(58.5, 27, 4.5, 6.5, verm, 3, (i, j, m) => m === verm)
  for (const y of [14, 62]) { T.ret(39, y, 3, 3, metal, 5); T.ret(40, y + 1, 2, 2, metal, 1) } T.ret(40, 65, 2, 9, ferr, 3, (i, j, m) => m === verm || m === branco); T.ret(42, 66, 1, 5, ferr, 2, (i, j, m) => m === verm || m === branco)
  T.contorno(2); return T
}
sprite("placa_transito", { w: 80, h: 248 }, (c) => placaTransito().pintar(c))

// ---------- Lixeira de metal furado (16 x 26 de mundo) ----------
function lixeiraMetal() {
  const T = new Tela(76, 116), metal = T.mat("#5d6470"), saco = T.mat("#2a2833"), ferr = T.mat("#70452f"), soM = (x, y, m) => m === metal
  const cil = (x, w) => (i) => { const s = (i - x) / w; return s < .1 ? 3 : s < .2 ? 5 : s < .42 ? 4 : s < .7 ? 3 : s < .9 ? 2 : 1 }
  // Pés e corpo cilíndrico.
  for (const x of [18, 52]) T.ret(x, 102, 6, 8, metal, (i) => i < x + 2 ? 4 : 2)
  T.ret(14, 36, 48, 68, metal, cil(14, 48)); T.elipse(38, 104, 24, 4, metal, 2, (x, y) => y >= 104)
  // Furos em fileiras desencontradas: achatam perto das bordas, como num cilindro.
  for (let r = 0; r < 9; r++) for (let k = -4; k <= 4; k++) { const u = (k + (r % 2 ? .5 : 0)) / 4.6; if (Math.abs(u) > .93) continue; const x = 38 + Math.sin(u * 1.5708) * 23, w = Math.max(1, Math.round(3 * Math.cos(u * 1.5708))); T.ret(Math.round(x - w / 2), 46 + r * 6, w, 3, metal, 1, soM); if (w > 1) T.ret(Math.round(x - w / 2), 49 + r * 6, w, 1, metal, 5, (i, j, m) => m === metal && T.T(i, j) >= 3) }
  // Cintas em cima e embaixo.
  T.ret(13, 38, 50, 5, metal, (i, j) => j === 38 ? 5 : Math.min(5, cil(13, 50)(i) + (j < 42 ? 0 : -1))); T.ret(13, 98, 50, 5, metal, (i, j) => j === 98 ? 5 : cil(13, 50)(i) - 1)
  // Boca vista de cima: aro, saco preto dobrado para fora e o escuro dentro.
  T.elipse(38, 34, 26, 8, metal, (x, y) => x < 24 ? 5 : x > 54 ? 2 : 4); T.elipse(38, 34, 22.5, 6, saco, (x, y) => x < 30 ? 3 : 2); T.elipse(38, 35, 19, 4.2, saco, 1)
  for (const [x, y, w, h] of [[14, 38, 9, 7], [26, 40, 12, 6], [41, 40, 10, 8], [53, 38, 9, 6]]) { T.poli([[x, y], [x + w, y], [x + w - 2, y + h], [x + 2, y + h - 2]], saco, (i) => i < x + 3 ? 4 : 2); T.ret(x + 2, y + 1, 1, h - 3, saco, 5) }
  // Amassado, ferrugem na base e um adesivo rasgado.
  T.elipse(50, 74, 7, 10, metal, 2, soM); T.elipse(51.5, 75, 4.5, 7.5, metal, 3, (x, y, m) => m === metal && T.T(x, y) < 3)
  T.ret(16, 96, 10, 3, ferr, 3, soM); T.ret(18, 92, 3, 5, ferr, 2, soM); T.ret(44, 99, 12, 3, ferr, 2, soM)
  T.contorno(2); return T
}
sprite("lixeira_metal", { w: 76, h: 116 }, (c) => lixeiraMetal().pintar(c))

// ---------- Sacos de lixo e caixa (30 x 20 de mundo) ----------
function sacosLixo() {
  const T = new Tela(124, 92), saco = T.mat("#2c2a36"), caixa = T.mat("#6a5947"), fita = T.mat("#8c8672"), soS = (x, y, m) => m === saco
  // Caixa de papelão amassada atrás.
  T.poli([[66, 30], [112, 26], [116, 80], [70, 82]], caixa, (x, y) => x > 104 ? 2 : y < 34 ? 4 : 3); T.poli([[66, 30], [84, 18], [118, 16], [112, 26]], caixa, 4); T.poli([[84, 18], [88, 20], [112, 26], [118, 16]], caixa, 2, (x, y) => x > 100)
  T.ret(86, 28, 8, 54, fita, (x, y) => x === 86 ? 4 : 3, (x, y, m) => m === caixa); T.ret(74, 52, 26, 1, caixa, 2); T.ret(78, 58, 14, 1, caixa, 2)
  // Saco grande: volume com a luz em cima à esquerda, amarrado em cima, com dobras e brilhos duros de plástico.
  const bolsa = (cx, cy, rx, ry, semente) => {
    T.elipse(cx, cy, rx, ry, saco, (x, y) => { const u = (x - cx) / rx, v = (y - cy) / ry, z = Math.sqrt(Math.max(0, 1 - u * u - v * v)); return tomDe(u * .9, v * .9, z, [.05, .5, .88, 2]) })
    T.poli([[cx - 5, cy - ry + 3], [cx - 9, cy - ry - 9], [cx - 2, cy - ry - 4], [cx + 3, cy - ry - 11], [cx + 6, cy - ry - 3], [cx + 11, cy - ry - 7], [cx + 6, cy - ry + 3]], saco, (x) => x < cx ? 3 : 2); T.ret(cx - 4, cy - ry + 1, 9, 3, saco, 1)
    for (let k = 0; k < 7; k++) { const a = -2.6 + k * .62 + sorte(k, semente) * .3, l = ry * (.5 + sorte(k, semente + 3) * .35), x0 = cx + Math.cos(a) * rx * .16, y0 = cy - ry + 6 + Math.abs(Math.sin(a)) * 4, x1 = cx + Math.cos(a) * rx * .8, y1 = y0 + l; T.capsula(x0, y0, x1, y1, .8, .6, saco, k < 4 ? 4 : 1, soS) }
    T.capsula(cx - rx * .55, cy - ry * .25, cx - rx * .32, cy - ry * .6, 1.6, 1, saco, 5, soS); T.capsula(cx - rx * .7, cy + ry * .1, cx - rx * .62, cy - ry * .1, 1.2, .8, saco, 4, soS)
  }
  bolsa(44, 56, 34, 26, 2); bolsa(88, 66, 23, 17, 9)
  T.tonalizar((x, y) => y > 78, -1, soS)
  T.contorno(2); return T
}
sprite("sacos_lixo", { w: 124, h: 92 }, (c) => sacosLixo().pintar(c))
