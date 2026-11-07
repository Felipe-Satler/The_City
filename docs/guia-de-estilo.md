# Guia de estilo visual

Estado: **rascunho (0.18)**. Os itens "PROPOSTA" ainda dependem da aprovação do criador.

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

## Situação de cada elemento (0.18)
| Elemento | Como está | Situação |
|---|---|---|
| Kamila — sprite e retrato do jogo | arte nova | no estilo |
| Kamila — card do menu | imagem atual | mantida por decisão |
| Homem Ferido — sprite | por código, 3,2 px de arte por px de mundo, contorno por grupo, sombreamento chapado (0.18) | no estilo — aguardando aprovação |
| Homem Ferido — retrato | por código, busto 190 × 244 em três quartos (0.18) | no estilo — aguardando aprovação |
| Rua sem nome | procedural, 2 px de arte por px de mundo | densidade ok; faltam contorno e sombreamento chapado |
| Café Entreluz | procedural, 1 px de arte por px de mundo | densidade antiga (metade da rua) e sem contorno |
| Cidade do menu | pixel art 640 × 400 ampliada | a decidir |
| Criatura | traço liso, sem grade, movimento em saltos | **diferente de propósito** (decisão do criador) |

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

## Técnica usada nos desenhos por código (0.18)
Usada no Homem Ferido; serve de base para os próximos NPCs e objetos.
- Cada parte é uma forma pintada com `mCel`: base, faixa de sombra do lado oposto à luz (deslocamento
  de ~5 px de arte) e filete de luz do lado da luz (~2 px). A luz vem de cima/esquerda.
- Partes se juntam em grupos com `mGroup`; cada grupo recebe contorno de ~1,7 px de arte na cor
  `#17181c`. Grupos separados criam as linhas internas (braço sobre o casaco, cabeça sobre a gola).
- `mCrisp` endurece as bordas (pixel inteiro ou transparente).
- A imagem é feita em alta densidade e desenhada no mundo com `drawDense`.
