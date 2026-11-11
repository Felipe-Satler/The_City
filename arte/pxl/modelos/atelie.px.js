// Ateliê: pequenas ferramentas de pintura usadas pelos modelos de cenário (incluído por modelos.px.js).
// Cada modelo é pintado numa tela própria de "material + tom"; a cor final sai da rampa do material.
// Tons: 0 = traço (contorno), 1 = sombra funda, 2 = sombra, 3 = base, 4 = luz, 5 = brilho.
// Regras da direção de arte: contorno escuro colorido, sombras em planos puxando para o violeta, luz de cima à esquerda,
// textura só onde tem causa. Densidade dos modelos: 4 px de arte = 1 px de mundo.

// ---- Cor (OKLCH) ----
const _lin = v => { v /= 255; return v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4) }
const _gam = v => { v = v <= .0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - .055; return Math.round(Math.max(0, Math.min(1, v)) * 255) }
function paraLCH(h) {
  const r = _lin(parseInt(h.slice(1, 3), 16)), g = _lin(parseInt(h.slice(3, 5), 16)), b = _lin(parseInt(h.slice(5, 7), 16))
  const l = Math.cbrt(.4122214708 * r + .5363325363 * g + .0514459929 * b), m = Math.cbrt(.2119034982 * r + .6806995451 * g + .1073969566 * b), s = Math.cbrt(.0883024619 * r + .2817188376 * g + .6299787005 * b)
  const L = .2104542553 * l + .793617785 * m - .0040720468 * s, A = 1.9779984951 * l - 2.428592205 * m + .4505937099 * s, B = .0259040371 * l + .7827717662 * m - .808675766 * s
  return [L, Math.hypot(A, B), Math.atan2(B, A) * 180 / Math.PI]
}
function deLCH(L, C, H) {
  const a = C * Math.cos(H * Math.PI / 180), b = C * Math.sin(H * Math.PI / 180), l = (L + .3963377774 * a + .2158037573 * b) ** 3, m = (L - .1055613458 * a - .0638541728 * b) ** 3, s = (L - .0894841775 * a - 1.291485548 * b) ** 3
  return '#' + [4.0767416621 * l - 3.3077115913 * m + .2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - .3413193965 * s, -.0041960863 * l - .7034186147 * m + 1.707614701 * s].map(v => _gam(v).toString(16).padStart(2, '0')).join('')
}
const _ang = (de, para) => ((para - de + 540) % 360) - 180
// Rampa de 6 tons a partir da cor base (tom 3). Sombras esfriam para o violeta e ganham um pouco de cor; luzes aquecem e desbotam.
// O traço (tom 0) é a sombra funda puxada para um carvão arroxeado: contorno escuro com matiz, nunca preto.
function rampa(base, o = {}) {
  const [L, C, H] = paraLCH(base), { frio = 295, quente = 95, puxa = .34, luz = 1, sombra = 1 } = o
  const tom = (dl, fr, qt, kc) => deLCH(Math.max(.05, Math.min(.97, dl < 0 ? L * (1 + dl * sombra) : L + (1 - L) * dl * luz)), C * kc, H + _ang(H, frio) * fr * puxa + _ang(H, quente) * qt * puxa)
  const fundo = paraLCH(tom(-.56, 1, 0, 1.08)), traco = deLCH(Math.min(.2, fundo[0] * .62), Math.min(.045, fundo[1] * .7), fundo[2] + _ang(fundo[2], 300) * .5)
  return [traco, tom(-.5, 1, 0, 1.1), tom(-.27, .6, 0, 1.06), base, tom(.17, 0, .45, .9), tom(.36, 0, .8, .7)]
}

// ---- Tela ----
const LUZ = (() => { const v = [-.52, -.62, .59], n = Math.hypot(...v); return v.map(q => q / n) })()   // de cima, da esquerda, um pouco de frente
// Tom a partir da normal da superfície (nx, ny, nz): planos definidos, sem degradê.
const tomDe = (nx, ny, nz, cortes = [.12, .4, .66, .9]) => { const d = nx * LUZ[0] + ny * LUZ[1] + nz * LUZ[2]; return d < cortes[0] ? 1 : d < cortes[1] ? 2 : d < cortes[2] ? 3 : d < cortes[3] ? 4 : 5 }
class Tela {
  constructor(w, h) { this.w = w; this.h = h; this.m = new Int16Array(w * h); this.t = new Int8Array(w * h); this.mats = [null]; this.semTraco = new Set() }
  // Registra um material e devolve o número dele. "traco: false" = não ganha contorno (brilhos, luz).
  mat(base, o = {}) { this.mats.push(Array.isArray(base) ? base : rampa(base, o)); if (o.traco === false) this.semTraco.add(this.mats.length - 1); return this.mats.length - 1 }
  dentro(x, y) { return x >= 0 && y >= 0 && x < this.w && y < this.h }
  M(x, y) { return this.dentro(x, y) ? this.m[y * this.w + x] : 0 }
  T(x, y) { return this.dentro(x, y) ? this.t[y * this.w + x] : 0 }
  // Pinta um pixel. tom pode ser número ou função (x, y) => tom; so = filtro opcional (x, y, materialAtual) => boolean.
  p(x, y, m, tom, so) { x |= 0; y |= 0; if (!this.dentro(x, y)) return; const i = y * this.w + x; if (so && !so(x, y, this.m[i])) return; const t = typeof tom === 'function' ? tom(x, y) : tom; if (t == null) return; this.m[i] = m; this.t[i] = Math.max(0, Math.min(5, t)) }
  ret(x, y, w, h, m, tom, so) { for (let j = Math.round(y); j < Math.round(y + h); j++)for (let i = Math.round(x); i < Math.round(x + w); i++)this.p(i, j, m, tom, so) }
  elipse(cx, cy, rx, ry, m, tom, so) { for (let j = Math.floor(cy - ry); j <= Math.ceil(cy + ry); j++)for (let i = Math.floor(cx - rx); i <= Math.ceil(cx + rx); i++) { const u = (i + .5 - cx) / rx, v = (j + .5 - cy) / ry; if (u * u + v * v <= 1) this.p(i, j, m, tom, so) } }
  // Retângulo de cantos arredondados (raio r; "cantos" escolhe quais: 1 = cima-esq, 2 = cima-dir, 4 = baixo-dir, 8 = baixo-esq).
  retR(x, y, w, h, r, m, tom, so, cantos = 15) {
    for (let j = Math.round(y); j < Math.round(y + h); j++)for (let i = Math.round(x); i < Math.round(x + w); i++) {
      const u = i + .5 - x, v = j + .5 - y, ce = u < r, cd = u > w - r, cc = v < r, cb = v > h - r
      let fora = false
      if (ce && cc && (cantos & 1)) fora = Math.hypot(u - r, v - r) > r; else if (cd && cc && (cantos & 2)) fora = Math.hypot(u - (w - r), v - r) > r
      else if (cd && cb && (cantos & 4)) fora = Math.hypot(u - (w - r), v - (h - r)) > r; else if (ce && cb && (cantos & 8)) fora = Math.hypot(u - r, v - (h - r)) > r
      if (!fora) this.p(i, j, m, tom, so)
    }
  }
  // Polígono (lista de [x, y]), preenchido por varredura.
  poli(pts, m, tom, so) {
    let y0 = Infinity, y1 = -Infinity; for (const q of pts) { y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]) }
    for (let j = Math.floor(y0); j <= Math.ceil(y1); j++) {
      const yc = j + .5, xs = []
      for (let k = 0; k < pts.length; k++) { const a = pts[k], b = pts[(k + 1) % pts.length]; if ((a[1] <= yc && b[1] > yc) || (b[1] <= yc && a[1] > yc)) xs.push(a[0] + (yc - a[1]) / (b[1] - a[1]) * (b[0] - a[0])) }
      xs.sort((a, b) => a - b); for (let k = 0; k + 1 < xs.length; k += 2)for (let i = Math.round(xs[k]); i < Math.round(xs[k + 1]); i++)this.p(i, j, m, tom, so)
    }
  }
  // Traço grosso de (x0, y0) a (x1, y1), com raio r0 no começo e r1 no fim (galhos, hastes, canos).
  capsula(x0, y0, x1, y1, r0, r1, m, tom, so) {
    const dx = x1 - x0, dy = y1 - y0, l2 = dx * dx + dy * dy || 1, R = Math.max(r0, r1)
    for (let j = Math.floor(Math.min(y0, y1) - R); j <= Math.ceil(Math.max(y0, y1) + R); j++)for (let i = Math.floor(Math.min(x0, x1) - R); i <= Math.ceil(Math.max(x0, x1) + R); i++) {
      const k = Math.max(0, Math.min(1, ((i + .5 - x0) * dx + (j + .5 - y0) * dy) / l2)), r = r0 + (r1 - r0) * k, d = Math.hypot(i + .5 - x0 - dx * k, j + .5 - y0 - dy * k); if (d <= r) this.p(i, j, m, tom, so)
    }
  }
  // Folhagem em volumes agrupados. Cada tufo [cx, cy, r, z] é uma meia-esfera de borda recortada (folhas), erguida em z; o tom sai da luz sobre o relevo de
  // todos os tufos juntos, então cada tufo fica claro em cima à esquerda e os vãos entre eles ficam escuros. Depois entram folhas soltas:
  // claras na parte iluminada, escuras na sombra — marcas agrupadas, não ruído. o: {gomos, recorte, folhas, tam, cortes, so}
  folhagem(tufos, m, o = {}) {
    const { gomos = 9, recorte = .075, folhas = 1, tam = 3.2, cortes = [.05, .34, .6, .86], so = null } = o, w = this.w, h = this.h
    let x0 = w, y0 = h, x1 = 0, y1 = 0; for (const [cx, cy, r] of tufos) { x0 = Math.min(x0, cx - r * 1.15); x1 = Math.max(x1, cx + r * 1.15); y0 = Math.min(y0, cy - r * 1.15); y1 = Math.max(y1, cy + r * 1.15) }
    x0 = Math.max(0, Math.floor(x0)); y0 = Math.max(0, Math.floor(y0)); x1 = Math.min(w - 1, Math.ceil(x1)); y1 = Math.min(h - 1, Math.ceil(y1))
    const dono = new Int16Array(w * h).fill(-1)
    for (let j = y0; j <= y1; j++)for (let i = x0; i <= x1; i++) {
      let bh = 0, bi = -1, bn = null
      for (let k = 0; k < tufos.length; k++) {
        const [cx, cy, r] = tufos[k], dx = i + .5 - cx, dy = j + .5 - cy, d = Math.hypot(dx, dy); if (d > r * 1.15) continue
        const an = Math.atan2(dy, dx), re = r * (1 + recorte * Math.sin(an * gomos + k * 2.4) + recorte * .6 * Math.sin(an * (gomos * 2 + 1) + k * 5.1)); if (d > re) continue
        const hh = Math.sqrt(re * re - d * d) + (tufos[k][3] || 0); if (hh > bh) { bh = hh; bi = k; const z = Math.sqrt(Math.max(0, 1 - (d / re) ** 2)); bn = [dx / re, dy / re, z] }
      }
      if (bi < 0) continue; if (so && !so(i, j, this.m[j * w + i])) continue
      this.m[j * w + i] = m; this.t[j * w + i] = tomDe(bn[0], bn[1], bn[2], cortes); dono[j * w + i] = bi
    }
    // Folhas soltas: pequenas gotas viradas para fora do tufo. Só entram onde cabem inteiras no mesmo tufo e o tom em volta é uniforme.
    const area = (x1 - x0) * (y1 - y0), n = Math.round(area / 150 * folhas)
    for (let q = 0; q < n; q++) {
      const fx = x0 + sorte(q, 11) * (x1 - x0), fy = y0 + sorte(q, 23) * (y1 - y0), k = dono[(fy | 0) * w + (fx | 0)]; if (k < 0) continue
      const [cx, cy] = tufos[k], an = Math.atan2(fy - cy, fx - cx) + (sorte(q, 31) - .5) * 1.2, t0 = this.t[(fy | 0) * w + (fx | 0)], L = tam * (.8 + sorte(q, 41) * .7), dx = Math.cos(an), dy = Math.sin(an)
      const tn = t0 >= 3 ? t0 + 1 : t0 <= 2 && sorte(q, 53) < .6 ? t0 - 1 : t0 + 1; if (tn < 1 || tn > 5) continue
      const px = []; let okk = true
      for (let b = -L; b <= L && okk; b++)for (let a = -L; a <= L; a++) { const u = a * dx + b * dy, v = -a * dy + b * dx; if ((u / L) ** 2 + (v / (L * .5)) ** 2 > 1) continue; const X = (fx + a) | 0, Y = (fy + b) | 0; if (X < 0 || Y < 0 || X >= w || Y >= h || dono[Y * w + X] !== k || this.t[Y * w + X] !== t0) { okk = false; break } px.push(Y * w + X) }
      if (okk) for (const i of px) this.t[i] = tn
    }
  }
  // Folha larga: nasce em (x0, y0), aponta para "ang" (radianos), com comprimento, largura e curvatura. Uma metade pega a luz, a outra fica na sombra; nervura no meio.
  folhaLarga(x0, y0, ang, comp, larg, m, o = {}) {
    const { curva = 0, tons = [4, 3], nerv = 1, ponta = .55 } = o, dx = Math.cos(ang), dy = Math.sin(ang), nx = -dy, ny = dx, lado = nx * LUZ[0] + ny * LUZ[1] > 0 ? 1 : -1
    for (let s = 0; s <= comp; s += .4) {
      const t = s / comp, cx = x0 + dx * s + nx * curva * t * t, cy = y0 + dy * s + ny * curva * t * t, w = larg * Math.pow(Math.sin(Math.PI * Math.pow(t, ponta)), .85)
      for (let v = -w; v <= w; v += .4) { const X = cx + nx * v, Y = cy + ny * v; this.p(X, Y, m, Math.abs(v) < .7 ? nerv : v * lado > 0 ? tons[0] : tons[1]) }
    }
  }
  // Muda o tom do que já está pintado dentro de uma região (função (x, y) => boolean): passo > 0 clareia, < 0 escurece.
  tonalizar(reg, passo, so) { for (let j = 0; j < this.h; j++)for (let i = 0; i < this.w; i++) { const k = j * this.w + i; if (this.m[k] && this.t[k] > 0 && reg(i, j) && (!so || so(i, j, this.m[k]))) this.t[k] = Math.max(1, Math.min(5, this.t[k] + passo)) } }
  // Suaviza os degraus de tom: onde dois planos do mesmo material se encostam com 2 ou mais tons de diferença, entra 1 px do tom do meio.
  suavizar(so) {
    const alvo = []
    for (let j = 0; j < this.h; j++)for (let i = 0; i < this.w; i++) {
      const k = j * this.w + i, m = this.m[k], t = this.t[k]; if (!m || t < 1 || (so && !so(i, j, m))) continue
      let mn = t; for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]])if (this.M(i + a, j + b) === m) { const q = this.T(i + a, j + b); if (q > 0 && q < mn) mn = q }
      if (t - mn >= 2) alvo.push([k, t - 1])
    }
    for (const [k, t] of alvo) this.t[k] = t
  }
  // Linha interna entre dois materiais que se encostam: escurece em 1 px a borda do material "de" onde ele toca "em" (lista) — peso menor que o contorno de fora.
  divisa(de, em, tom = 1) { const S = new Set([].concat(em)), alvo = []; for (let j = 0; j < this.h; j++)for (let i = 0; i < this.w; i++)if (this.M(i, j) === de && (S.has(this.M(i + 1, j)) || S.has(this.M(i - 1, j)) || S.has(this.M(i, j + 1)) || S.has(this.M(i, j - 1)))) alvo.push(j * this.w + i); for (const k of alvo) this.t[k] = Math.min(this.t[k], tom) }
  // Contorno de fora: "esp" px em volta de tudo o que está pintado, no tom de traço do material vizinho (contorno com matiz).
  contorno(esp = 2) {
    const add = []
    for (let j = 0; j < this.h; j++)for (let i = 0; i < this.w; i++) {
      if (this.m[j * this.w + i]) continue; let bd = 1e9, bm = 0
      for (let b = -esp; b <= esp; b++)for (let a = -esp; a <= esp; a++) { const m = this.M(i + a, j + b); if (!m || this.semTraco.has(m)) continue; const d = a * a + b * b; if (d < bd && d <= esp * esp + 1) { bd = d; bm = m } }
      if (bm) add.push([j * this.w + i, bm])
    }
    for (const [k, m] of add) { this.m[k] = m; this.t[k] = 0 }
  }
  // Passa a tela para o pxl (dentro de um sprite: (c) => tela.pintar(c)).
  pintar(c, ox = 0, oy = 0) { for (let j = 0; j < this.h; j++)for (let i = 0; i < this.w; i++) { const m = this.m[j * this.w + i]; if (m) c.px(ox + i, oy + j, this.mats[m][this.t[j * this.w + i]]) } }
}
// Cachos menores pousados sobre os volumes grandes: devolve os tufos grandes mais n cachos de raio r0..r1, cada um saindo "salto" do raio para fora da superfície.
function comCachos(tufos, n, r0, r1, salto = .5, semente = 1) {
  const alt = (x, y) => { let h = -1; for (const [cx, cy, r, z = 0] of tufos) { const d = Math.hypot(x - cx, y - cy); if (d < r) h = Math.max(h, Math.sqrt(r * r - d * d) + z) } return h }
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const [cx, cy, r] of tufos) { x0 = Math.min(x0, cx - r); x1 = Math.max(x1, cx + r); y0 = Math.min(y0, cy - r); y1 = Math.max(y1, cy + r) }
  const out = tufos.map(t => t.slice())
  for (let q = 0, k = 0; k < n && q < n * 30; q++) { const x = x0 + sorte(q, semente * 7 + 1) * (x1 - x0), y = y0 + sorte(q, semente * 7 + 2) * (y1 - y0), h = alt(x, y); if (h < 6) continue; const r = r0 + sorte(q, semente * 7 + 3) * (r1 - r0); out.push([x, y, r, h - r * (1 - salto)]); k++ }
  return out
}
// Número pseudoaleatório reprodutível (0..1) a partir de dois inteiros.
const sorte = (a, b = 0) => { let h = Math.imul((a * 374761393 + b * 668265263) | 0, 1274126177); h ^= h >>> 13; h = Math.imul(h, 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }
