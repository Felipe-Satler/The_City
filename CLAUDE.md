# The City — regras do projeto para agentes

Jogo de terror/suspense para navegador de computador (exploração estilo RPG Maker + visual novel).
Celular não é prioridade (decisão do criador, 0.28).
Idioma do jogo e da documentação: português brasileiro.

## Antes de mexer
1. Leia `docs/CONTEXTO_ORIGINAL.txt` (visão e decisões do criador, escrito na prévia 0.10).
2. Leia os relatórios em `docs/relatorios/` (do mais recente para trás). Quando um relatório
   contradiz o TXT, vale o relatório mais recente e o código.
3. Leia `docs/guia-de-estilo.md` antes de qualquer mudança de arte.

## Regra fixa: relatório a cada modificação
Toda modificação no jogo gera um relatório em `docs/relatorios/<versão>.md`, seguindo
`docs/relatorios/MODELO.md`, e entra no índice `docs/relatorios/README.md`.
O relatório vai no mesmo commit (ou logo depois) da mudança e é enviado ao criador na conversa.
Ele deve separar o que foi testado por código, o que foi visto no navegador e o que não foi testado.

## Perguntar
Quando houver decisão criativa ou de escopo em aberto, pergunte ao criador em vez de supor.
Propostas são apresentadas como propostas; decisões do criador são registradas no relatório.

## Detalhes técnicos que já causaram problema
- `the-city.html` é um arquivo único (HTML + CSS + JS + imagens em data URI) com quebras de
  linha **CRLF**. Ao editar por script, preserve-as (em Python: `open(..., newline='')`).
  Converter para LF transforma o diff em "todas as linhas mudaram".
- Há linhas com megabytes de base64. Ao listar código, corte (`cut -c1-300`).
- Versão visível: rodapé `PRÉVIA CONCEITUAL / x.y` no menu. Comentários de código marcam a
  versão em que cada trecho mudou (ex.: `// 0.17: ...`).
- Arte-fonte fica em `arte/` (ex.: `arte/kamila/`); o HTML recebe cópias embutidas.
- Objetos da rua (0.29) são feitos com o pxl (`tools/pxl/`, MIT): fonte em `arte/pxl/rua.px.js`;
  gerar com `node tools/pxl/bin/pxl.js build arte/pxl/rua.px.js --out arte/pxl/out` e embutir com
  `python3 tools/embutir_pxl.py`. Não edite o base64 dos sprites à mão.
- Teste no Chromium do ambiente com Playwright (`require('playwright')`, sem instalar nada).
  Fluxo mínimo: menu → Iniciar → Kamila → ACORDAR → falas → cruzamento → "FUGIR PARA O CAFÉ".
