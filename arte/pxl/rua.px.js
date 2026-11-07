// Objetos da rua (prévia 0.29), feitos com o pxl (tools/pxl). Gerar: node tools/pxl/bin/pxl.js build arte/pxl/rua.px.js --out arte/pxl/out
// Depois: python3 tools/embutir_pxl.py (embute os PNGs no the-city.html).
// Densidade da rua: 2 px de arte = 1 px de mundo. Estilo: docs/DIRECAO_DE_ARTE.txt — contorno com matiz (selout),
// 3–4 tons por material, luz de cima à esquerda, sombras puxando para violeta, sem ruído de enchimento.
pal({ k: "#15161c", w: "#e9edf2", R: "#6e4430", r: "#4e3226", g: "#1b222b", G: "#56677a" })
shades("1234", "#3a5545", { shift: 18, spread: 0.4, sat: 0.85 })   // verde da lixeira
shades("5678", "#4a6a56", { shift: 18, spread: 0.4, sat: 0.85 })   // tampa da lixeira
shades("mnop", "#5c616b", { shift: 14, spread: 0.45, sat: 0.6 })   // metal cinza
shades("qrst", "#7a2e30", { shift: 20, spread: 0.5, sat: 0.9 })    // vermelho-escuro do parquímetro
shades("abcd", "#5a3f30", { shift: 18, spread: 0.45, sat: 0.8 })   // madeira/terra
shades("efhi", "#2f4a36", { shift: 18, spread: 0.5, sat: 0.85 })   // folhagem
shades("uvxy", "#2d4a3c", { shift: 16, spread: 0.45, sat: 0.8 })   // verde da placa
shades("ABCD", "#3d414a", { shift: 12, spread: 0.4, sat: 0.5 })   // ferro fundido (bueiro, grelha)

// Lixeira (16 x 22 de mundo): corpo com frisos, cinta de metal, tampa vista de cima, rodinhas.
sprite("lixeira", { w: 34, h: 46, selout: "k" },
  rect(2, 14, 28, 26, "2"), rect(2, 14, 4, 26, "3"), rect(26, 14, 4, 26, "1"),
  (c) => { for (let x = 7; x < 26; x += 4) { c.vline(x, 17, 21, "1"); c.vline(x + 1, 17, 21, "3") } },
  rect(2, 25, 28, 3, "n"), hline(2, 25, 28, "p"), px(5, 26, "k"), px(27, 26, "k"),
  vline(9, 28, 5, "r"), vline(10, 28, 3, "R"), vline(21, 28, 4, "r"),
  rect(2, 36, 28, 4, "1"),
  rect(0, 4, 32, 7, "7"), rect(0, 4, 32, 2, "8"), rect(0, 4, 3, 7, "8"), rect(29, 4, 3, 7, "6"),
  rect(0, 11, 32, 3, "5"), hline(0, 11, 32, "6"),
  rect(11, 6, 10, 3, "k"), hline(12, 8, 8, "5"),
  rect(3, 40, 6, 3, "k"), rect(23, 40, 6, 3, "k"), px(5, 41, "n"), px(25, 41, "n"))

// Parquímetro (14 x 30 de mundo): cabeça vermelho-escura com visor, fenda de moedas e ferrugem; poste e base.
sprite("parquimetro", { w: 26, h: 60, selout: "k" },
  rect(11, 26, 4, 30, "n"), vline(11, 26, 30, "o"), vline(14, 26, 30, "m"),
  rect(6, 54, 14, 4, "m"), hline(6, 54, 14, "o"),
  rect(3, 6, 20, 21, "r"), rect(3, 6, 3, 21, "s"), rect(20, 6, 3, 21, "q"),
  rect(2, 2, 22, 5, "s"), hline(2, 2, 22, "t"), hline(2, 6, 22, "q"),
  rect(7, 9, 12, 7, "g"), hline(7, 9, 12, "k"), rect(9, 11, 3, 1, "G"), px(15, 13, "G"),
  rect(11, 19, 4, 1, "k"), px(17, 19, "n"), rect(7, 22, 12, 2, "q"),
  vline(6, 27, 3, "R"), vline(19, 27, 4, "r"))

// Placa da rua (52 x 50 de mundo): placa verde com a tinta descascada (o nome não se lê), parafusos, ferrugem; poste.
sprite("placa", { w: 104, h: 100, selout: "k" },
  rect(82, 30, 5, 68, "n"), vline(82, 30, 68, "o"), vline(86, 30, 68, "m"), rect(79, 94, 11, 4, "m"),
  rect(6, 4, 84, 30, "v"), rect(6, 4, 84, 3, "x"), rect(6, 31, 84, 3, "u"), rect(6, 4, 3, 30, "x"), rect(87, 4, 3, 30, "u"),
  box(10, 8, 76, 22, "y"),
  // Tinta descascada mostrando o metal, em placas que seguem a borda.
  poly([22, 10, 34, 10, 31, 16, 24, 17], "n"), poly([52, 22, 66, 20, 70, 27, 55, 28], "n"), poly([72, 9, 82, 9, 82, 14, 76, 15], "m"),
  // Restos de letras, sem formar palavra.
  (c) => { for (const [x, y, h] of [[16, 14, 4], [17, 22, 3], [39, 12, 3], [44, 20, 4], [61, 13, 2], [63, 18, 4], [78, 15, 3]]) c.vline(x, y, h, "x"); c.hline(40, 25, 3, "x"); c.hline(18, 12, 2, "x") },
  // Parafusos e ferrugem escorrendo deles.
  (c) => { for (const [x, y] of [[9, 7], [86, 7], [9, 29], [86, 29]]) { c.px(x, y, "p"); c.px(x, y + 1, "m") } c.vline(9, 9, 6, "r"); c.vline(86, 9, 9, "R"); c.vline(87, 10, 5, "r") })

// Ar-condicionado de parede (22 x 13 de mundo): caixa clara, grade de lâminas, plaquinha lisa, cano saindo.
sprite("ar", { w: 46, h: 26, selout: "k" },
  rect(0, 0, 44, 22, "o"), hline(0, 0, 44, "p"), rect(0, 18, 44, 4, "n"), rect(40, 0, 4, 22, "n"),
  (c) => { for (let y = 4; y < 17; y += 3) { c.hline(3, y, 30, "m"); c.hline(3, y + 1, 30, "p") } },
  rect(35, 4, 4, 3, "n"), hline(35, 4, 4, "p"),
  rect(42, 20, 3, 5, "m"), px(43, 24, "R"))

// Tampa de bueiro (27 x 16 de mundo): ferro fundido, aro, desenho em grade, luz em cima à esquerda.
sprite("bueiro", { w: 56, h: 34, selout: "k" },
  ellipse(27, 16, 26, 15, "B"), ellipse(27, 16, 22, 12, "A"),
  (c) => { for (let x = 9; x <= 45; x += 6) c.vline(x, 6, 21, "B"); for (let y = 8; y <= 25; y += 5) c.hline(6, y, 43, "B") },
  ellipse(27, 16, 22, 12, "C", true), ellipse(27, 16, 26, 15, "C", true),
  (c) => { for (let a = 3.3; a < 4.9; a += 0.04) c.px(Math.round(27 + Math.cos(a) * 26), Math.round(16 + Math.sin(a) * 15), "D") })

// Grelha de sarjeta (12 x 24 de mundo): moldura e barras com luz em cima.
sprite("grelha", { w: 24, h: 48, selout: "k" },
  rect(0, 0, 24, 48, "B"), hline(0, 0, 24, "D"), vline(0, 0, 48, "C"),
  (c) => { for (let y = 3; y < 45; y += 4) { c.rect(3, y, 18, 2, "k"); c.hline(3, y + 2, 18, "C") } })

// Floreira do café (19 x 23 de mundo, o tamanho da antiga): caixa de madeira com tábuas, terra e arbusto redondo em tufos.
sprite("floreira", { w: 38, h: 46, selout: "k" },
  rect(3, 28, 32, 16, "b"), rect(3, 28, 32, 3, "d"), rect(3, 28, 4, 16, "c"), rect(31, 28, 4, 16, "a"), hline(3, 36, 32, "a"), hline(3, 43, 32, "a"),
  rect(5, 25, 28, 4, "a"),
  // Tufos: base escura inteira, tom médio deslocado para a luz (cima à esquerda), depois claro e brilho.
  circ(19, 15, 12, "e"), circ(10, 20, 8, "e"), circ(28, 20, 8, "e"),
  circ(18, 13, 11, "f"), circ(9, 18, 7, "f"), circ(27, 18, 7, "f"),
  circ(15, 10, 7, "h"), circ(8, 16, 3, "h"), circ(25, 14, 4, "h"),
  circ(12, 8, 3, "i"), px(22, 10, "i"), px(23, 10, "i"))
