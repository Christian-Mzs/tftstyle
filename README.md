# Frontier Heroes — protótipo 3D

Protótipo de navegador de um RPG de grupo com combate automático, loot, conjuntos, níveis e progressão offline. A cena é renderizada em 3D com **Three.js**; **Vite** cuida do servidor de desenvolvimento e da compilação.

## Iniciar no Windows

1. Instale o [Node.js LTS](https://nodejs.org/) se ainda não estiver instalado.
2. Baixe/clone este repositório no computador.
3. Dê dois cliques em `start-game.bat`.

Na primeira execução, o lançador instala as dependências automaticamente. Depois ele inicia o Vite numa porta local e abre o jogo numa janela independente do Edge ou Chrome. **Feche a janela do jogo para o lançador encerrar o servidor** e limpar o perfil temporário do navegador. Não feche a janela preta do lançador enquanto estiver jogando.

O lançador usa um perfil persistente separado do navegador normal, para poder identificar a janela do jogo e manter o progresso salvo entre sessões. Ao fechar a janela, o servidor é encerrado; o perfil de jogo permanece em `%LOCALAPPDATA%\\FrontierHeroes\\BrowserProfile`. Se a porta 4173 já estiver ocupada, ele avisa sem encerrar o processo de outra aplicação.

## Executar manualmente

Requer Node.js LTS:

```bash
npm install
npm run dev
```

Abra o endereço local que o Vite imprimir (normalmente `http://localhost:5173`). Para testar o build de produção:

```bash
npm run build
npm run preview
```

## Jogabilidade atual

- Clareira 3D com ruínas, runas, árvores low-poly, iluminação, neblina e partículas ambientais.
- Cinco heróis visíveis no cenário; inimigos com silhuetas próprias, movimentação e combate automático.
- Projéteis, números de dano, partículas de impacto, barras de vida e cristais de loot clicáveis.
- Elenco de 15 heróis fictícios; cada afinidade de tropa inclui atacantes, defensores, suportes e especialistas.
- Composição de cinco heróis e o ciclo: Tanques vencem Mísseis, Mísseis vencem Aeronaves, Aeronaves vencem Tanques.
- Bônus progressivo de composição: 3 do mesmo tipo = +5%; 3+2 = +10%; 4+1 = +15%; 5 do mesmo tipo = +20%.
- XP e níveis persistentes para cada herói; subir de nível melhora vida e dano.
- Drops equipáveis com atributos e espaços de arma, armadura e relíquia; bônus de conjuntos para Vigia do Véu, Caçador da Bruma e Fornalha Antiga.
- Carta Tática como relíquia rara, permitindo manter +20% com quatro heróis de um tipo e um de outro.
- Salvamento local e renda/XP/loot offline generosos, com limite de até 12 horas; ao retornar, o jogo concede um resumo de recompensas e equipamentos acumulados.
- O combate começa automaticamente; pause para trocar heróis ou equipar itens. A primeira morte inimiga oferece um drop de equipamento garantido.

## Controles

- **Começar/Pausar:** inicia ou pausa a batalha automática.
- **Elenco:** pause antes de trocar um dos cinco heróis.
- **Equipamentos:** pause, escolha o herói e equipe itens encontrados.
- **Próxima horda:** avança quando a área estiver limpa.
- **Câmera:** arraste para girar e use a roda do mouse para aproximar.
- **Cristais:** clique nos cristais brilhantes do cenário para recolher ouro, equipamento ou relíquias.

O progresso fica no armazenamento local deste navegador. Não há conta, sincronização entre dispositivos ou servidor remoto. A versão inicial usa modelos geométricos low-poly procedurais; ainda não são os modelos animados finais.

## Documentos de design

- [GAME-PROGRESSION.md](./GAME-PROGRESSION.md) — onboarding dos primeiros 15 minutos, progressão longa, loot, sets, modo offline e hierarquia do HUD.

## Build automatizado

O workflow em `.github/workflows/build.yml` instala dependências e executa `npm run build` a cada alteração na branch `main`. Ele valida o projeto, mas não publica um site de jogo.
