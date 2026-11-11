# Guia de estilo visual

Estado: **0.30**. A direção de arte oficial é `docs/DIRECAO_DE_ARTE.txt` (do criador); este guia resume e
registra a situação de cada elemento. Em conflito, vale a direção de arte.

## Alvo
A arte do sprite e do retrato da Kamila (`arte/kamila/`) é o estilo-alvo do jogo inteiro
(decisão do criador, 07/11/2026). A atmosfera continua a do projeto: rua fria, cinzenta, com névoa
e luzes pálidas; o café como o único calor.

## O que caracteriza a arte da Kamila (medido na folha)
- **Pixel art de alta densidade com cara de anime.** A figura tem ~191 px de altura na folha e vira
  57 px de mundo (3,35 px de folha por px de mundo); na tela do computador fica com ~81 px.
  Não é uma grade de pixels rígida: há ~500 tons por quadro e bordas suavizadas.
- **Contorno escuro e limpo**, puxado para o violeta/ameixa (`#201020`–`#302030`), não preto puro.
- **Sombreamento em 2–3 tons chapados por material** (base, sombra, luz) e brilho forte só em cabelo,
  metal e gema.
- **Paleta:** base escura ameixa/preto-violeta; pele clara quente (`#f0e0d0`); cabelo prateado-lavanda
  (`#d0c0d0`–`#e0d0e0`) com sombra violeta; destaques saturados pontuais em carmesim e dourado.
- **Proporções:** sprite de exploração compacto (cabeça grande, quase chibi); retrato com proporções
  completas.

## Situação de cada elemento (0.30)
| Elemento | Como está | Situação |
|---|---|---|
| Kamila — sprite e retrato do jogo | arte nova | no estilo |
| Kamila — card do menu | imagem atual | mantida por decisão |
| Homem Ferido — sprite e retrato | arte do criador, folha 6 × 2 (0.19) | no estilo |
| Homem devorado, pedaços, pistola e sangue | folha do criador (0.21) | no estilo |
| Chão da rua (asfalto, calçada, meio-fio, poças) | estilo novo por código (0.20) | no estilo |
| Café EntreLuz (fachada) | estilo novo por código (0.20) | no estilo |
| Árvores | estilo novo por código, a partir da imagem da rua (0.20) | no estilo |
| Lixeiras, ar-condicionado de parede, bueiros, grelhas, floreiras do café | pxl, `arte/pxl/rua.px.js` (0.29) | no estilo |
| Outros prédios | estilo novo com personalidade por prédio (0.22–0.23) | no estilo |
| Placa da rua, parquímetros | pxl, `arte/pxl/rua.px.js` (0.29) | no estilo |
| Carros, motos, postes | imagens do criador (0.20) | no estilo |
| Interior do café | estilo novo por código, 2 px de arte por px de mundo (0.24) | no estilo |
| Cidade do menu | estilo novo, 800 × 500, paleta fria de 32 cores sem pontilhado (0.25) | no estilo |
| Criatura (Crooked Legs) | modelo articulado do criador, revisão 3: 6 peças de corpo + 6 cabeças, toda pálida, traço liso próprio (0.30) | **diferente de propósito** (decisão do criador) |

## Regras para converter o resto — PROPOSTA
1. **Densidade:** cenários com pelo menos 2 px de arte por px de mundo (como a rua); personagens na
   escala da Kamila (adulto médio ≈ 57–62 px de mundo de altura) e com detalhe equivalente.
2. **Contorno:** personagens e objetos de destaque (carros, postes, portas, móveis) com contorno
   escuro de 1 px de arte, na cor da sombra do material escurecida — não preto.
3. **Sombreamento:** base + sombra + luz; brilho especular só em vidro, metal e superfícies molhadas.
4. **Atmosfera:** o mundo continua frio e pouco saturado; a saturação fica reservada para luzes
   (café, postes), sangue e personagens. A névoa e a camada de luz continuam por cima de tudo.
5. **Exceção:** a criatura não segue estas regras.
6. **Retratos:** busto, proporção ~0,78 (largura/altura), fundo transparente.

## Objetos feitos com o pxl (0.29)
O pxl (`tools/pxl/`, licença MIT, cópia sem alterações) desenha pixel art a partir de um arquivo de código:
paleta, rampas de tons com matiz deslocado (`shades`), formas (`rect`, `circ`, `poly`, `ellipse`...) e contorno
automático com matiz (`selout`). Os objetos da rua ficam em `arte/pxl/rua.px.js`.
- **Densidade:** 2 px de arte por px de mundo (a mesma do chão da rua). Um objeto de 16 × 22 de mundo é um sprite
  de 32 × 44 (+1 px de contorno em volta).
- **Regras:** contorno `k` (`#15161c`) via `selout`; 3–4 tons por material; luz de cima à esquerda; sombras puxando
  para violeta; nada de ruído de enchimento; ferrugem e sujeira só onde têm causa (parafuso, cinta, chão).
- **Caminho:** editar `arte/pxl/rua.px.js` → `node tools/pxl/bin/pxl.js build arte/pxl/rua.px.js --out arte/pxl/out`
  → conferir `arte/pxl/out/_preview/` → `python3 tools/embutir_pxl.py`. `pxl lint` aponta pixels soltos e cores
  repetidas.
- **No jogo:** `pxlChao(nome, x, y, ax, ay)` pinta no chão; `pxlAlto(nome, x, y, ax, ay, tipo)` cria um elemento alto
  ordenado com os personagens. `(ax, ay)` é o ponto de apoio em pixels de arte dentro do sprite.
- Personagens, criaturas e retratos continuam vindo da ferramenta do criador; o pxl é para objetos e cenário.

## Crooked Legs: modelo articulado (0.30)
A criatura não usa quadros prontos. O jogo monta a pose a cada instante com as peças de `arte/crooked_legs/parts/`
(dois braços longos, duas pernas finas, tronco, pescoço e seis cabeças: de lado e de frente, boca fechada, entreaberta
e aberta).
- **Espaço da pose:** célula de 512 × 512, virada para a direita, chão na linha 492, apoio em (256, 492). Em pé ela
  mede ~395 px na célula e ~212 px no mundo. Para a esquerda, a figura é espelhada.
- **Pés:** cada pé fica cravado no ponto do mundo onde pisou e só sai dali com um passo (`clPassos`). Nunca mova a
  criatura fazendo os pés acompanharem o corpo: é isso que dá o deslize.
- **Pernas:** ossos de tamanho fixo, dobrando nas juntas (`clCorpo`). **Pescoço:** curva do tronco até a nuca, que
  estica (`clPescoco`). **Cabeça:** posição do olho, ângulo e abertura da boca.
- **Poses de cada fase:** `clPose` diz o que a cena pede (tronco, cabeça, passos, pés comandados) e o resultado
  chega lá com passagem suave. Para pôr a boca num ponto do mundo (morder, carregar), use `boca(...)` dentro dela.
- **Dados:** `python3 tools/embutir_crooked.py` embute peças, malhas e a pose de repouso (`parada_01`).
- As tiras `CL_*.png` do pacote ficam guardadas em `arte/crooked_legs/`, mas o jogo não as usa.

## Técnica usada nos desenhos por código (0.18)
Foi usada no Homem Ferido da 0.18, depois trocado pela arte do criador; o código (`mCel`, `mGroup`, `mCrisp`) não está mais no jogo. Fica aqui como registro.
- Cada parte é uma forma pintada com `mCel`: base, faixa de sombra do lado oposto à luz (deslocamento
  de ~5 px de arte) e filete de luz do lado da luz (~2 px). A luz vem de cima/esquerda.
- Partes se juntam em grupos com `mGroup`; cada grupo recebe contorno de ~1,7 px de arte na cor
  `#17181c`. Grupos separados criam as linhas internas (braço sobre o casaco, cabeça sobre a gola).
- `mCrisp` endurece as bordas (pixel inteiro ou transparente).
- A imagem é feita em alta densidade e desenhada no mundo com `drawDense`.

## Escala física (0.19)
Kamila (1,65 m) = 57 px de mundo, ou seja ≈ 34,5 px por metro. Carros na prova: 62 × 95 px; motos 30 × 64;
postes 104 px de altura (comprimidos, como é comum no estilo RPG Maker). O Homem Ferido é desenhado 5% maior
que a escala da Kamila.
