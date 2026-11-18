// Objetos da rua (prévia 0.29; lixeira, placa e floreira saíram na 0.31, trocadas pelo cenário V2), feitos com o pxl (tools/pxl). Gerar: node tools/pxl/bin/pxl.js build arte/pxl/rua.px.js --out arte/pxl/out
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

// Parquímetro (14 x 30 de mundo): cabeça vermelho-escura com visor, fenda de moedas e ferrugem; poste e base.
sprite("parquimetro", { w: 26, h: 60, selout: "k" },
  rect(11, 26, 4, 30, "n"), vline(11, 26, 30, "o"), vline(14, 26, 30, "m"),
  rect(6, 54, 14, 4, "m"), hline(6, 54, 14, "o"),
  rect(3, 6, 20, 21, "r"), rect(3, 6, 3, 21, "s"), rect(20, 6, 3, 21, "q"),
  rect(2, 2, 22, 5, "s"), hline(2, 2, 22, "t"), hline(2, 6, 22, "q"),
  rect(7, 9, 12, 7, "g"), hline(7, 9, 12, "k"), rect(9, 11, 3, 1, "G"), px(15, 13, "G"),
  rect(11, 19, 4, 1, "k"), px(17, 19, "n"), rect(7, 22, 12, 2, "q"),
  vline(6, 27, 3, "R"), vline(19, 27, 4, "r"))

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
