# Frontier Heroes — protótipo 3D

Protótipo de jogo de navegador para validar o núcleo de um RPG de grupo inspirado na progressão de TBH: Task Bar Hero, no loot de RPGs de ação e no sistema de composição de tropas de Last War. O campo de batalha é renderizado em 3D com Three.js; HTML/CSS são usados apenas para HUD e menus.

## O que já está no protótipo

- Cena 3D com clareira de ruínas, círculo rúnico, árvores low-poly, iluminação, neblina e partículas ambientais.
- Cinco heróis visíveis no cenário, com modelos geométricos estilizados, armas e silhuetas diferentes.
- Inimigos no mundo, combate automático, movimento até os alvos, animação simples de ataque e barras de vida.
- Projéteis, números de dano, partículas de impacto e cristais de loot clicáveis.
- Elenco inicial de 15 heróis fictícios, com três afinidades de tropa. Cada afinidade inclui funções variadas.
- Bônus de composição: 3 do mesmo tipo = +5%; 3+2 = +10%; 4+1 = +15%; 5 do mesmo tipo = +20%.
- Ciclo de confrontos: Tanques vencem Mísseis, Mísseis vencem Aeronaves, Aeronaves vencem Tanques.
- Carta Tática de teste como relíquia; quando encontrada, mantém o bônus de +20% numa composição 4+1.
- Salvamento local no navegador e simulação de renda offline generosa, limitada a 12 horas.
- Controles de câmera para orbitar e aproximar, elenco selecionável e ondas progressivas.

## Como jogar

1. Abra a página no navegador com WebGL 2 e conexão à internet (Three.js é importado via CDN).
2. Clique em **Começar**.
3. Observe a equipe lutar. Você pode pausar para trocar heróis pelo botão **Elenco**.
4. Ao concluir uma horda, clique em **Próxima horda**.
5. Clique nos cristais que aparecem no cenário para recolher ouro e equipamento.

Os dados de progressão são salvos no armazenamento local do navegador. Eles não sincronizam entre dispositivos ou navegadores.

## Publicação

O workflow `.github/workflows/deploy-pages.yml` tenta publicar a branch `main` no GitHub Pages. Caso o Pages ainda não esteja ativado na conta/repositório, verifique a aba **Actions** do GitHub e as configurações **Settings → Pages**.

## Próximas etapas

- Melhorar modelos e animações; usar rigs e assets 3D reais quando a direção de arte for aprovada.
- Inventário visual por herói, slots de equipamento, comparação de itens e conjuntos com bônus.
- Habilidades individuais de cada personagem, cura e efeitos de controle com lógica de combate mais profunda.
- Drops persistentes, baús, bosses, novas regiões e cálculo offline de inimigos/recompensas.
- Equilibrar dano/vida e bônus de confronto por testes — valores atuais são placeholders.
- Testes em navegadores e dispositivos diferentes.

Este projeto é um primeiro protótipo jogável, não uma versão final. Os modelos atuais usam geometria low-poly procedimental para validar movimento, câmera, combate e composição sem depender ainda de assets de arte finais.
