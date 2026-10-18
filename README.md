# Frontier Heroes — protótipo de conceito

Protótipo inicial de navegador para validar o núcleo do RPG de grupo: combate automático, cinco heróis por equipe, afinidades de tropa, bônus progressivos, loot e progresso offline simulado.

**Abrir:** https://christian-mzs.github.io/tftstyle/ (após ativar GitHub Pages para a branch `main`, usando `/(root)`).

## O que já dá para testar

- Montar uma equipe de até cinco heróis a partir de um elenco de 15 personagens fictícios.
- Ver a composição de Tanques, Aeronaves e Mísseis.
- Testar bônus de composição: 3 do mesmo tipo = +5%; 3+2 = +10%; 4+1 = +15%; 5 do mesmo tipo = +20%.
- Conseguir a Carta Tática de teste, que permite manter +20% com quatro heróis de um tipo e um de outro.
- Simular combates automáticos contra inimigos com diferentes afinidades.
- Testar drops de equipamentos e a simulação de recompensas offline.

## Regras provisórias

Ciclo de afinidades:
- Tanques vencem Mísseis.
- Mísseis vencem Aeronaves.
- Aeronaves vencem Tanques.

Cada afinidade contém heróis com funções variadas — defensores, atacantes, suportes e especialistas — para que uma equipe monotipo possa ser funcional.

## O que ainda não está implementado

- Salvamento persistente real e cálculo automático do tempo offline.
- Inventário por herói, equipar/trocar itens e bônus de conjuntos completos.
- Habilidades com efeitos de combate reais, animações e IA detalhada.
- Progressão de níveis, experiência, desbloqueios, chefes e conteúdo.
- Arte final, áudio, balanceamento e testes automatizados.

Os números de combate, heróis, itens e nomes são placeholders para discutir e validar a direção. Este é um protótipo de regras, não uma versão final do jogo.
