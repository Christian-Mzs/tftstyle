# Frontier Heroes — protótipo 2D idle RPG

RPG de grupo com **pixel art 2D**, cinco heróis, combate automático, loot, equipamentos, conjuntos e progressão offline. A cena é desenhada num Canvas 2D leve; o Vite serve o jogo localmente e faz a compilação. A renderização não utiliza WebGL nem Three.js.

## Iniciar no Windows

1. Instale [Node.js LTS](https://nodejs.org/) se ainda não estiver instalado.
2. Baixe o ZIP mais recente deste repositório por **Code → Download ZIP** e extraia a pasta.
3. Dê dois cliques em `start-game.bat`.

Na primeira execução, o lançador instala as dependências automaticamente, inicia o servidor local e abre uma janela própria de cerca de 1000 × 620 pixels no Edge ou Chrome. **Feche a janela do jogo para o servidor local ser encerrado automaticamente.** A janela preta do lançador deve permanecer aberta durante o jogo.

O lançador usa um perfil persistente separado do navegador normal, para guardar o progresso entre sessões em `%LOCALAPPDATA%\FrontierHeroes\BrowserProfile`. O perfil não é apagado ao sair. Se a porta local 4173 estiver ocupada, o lançador avisa e não encerra o processo de outra aplicação.

> Se você já tinha baixado uma versão anterior, extraia um ZIP atualizado para uma nova pasta antes de testar: a cópia antiga no computador não recebe automaticamente as correções do GitHub.

## Executar manualmente

Requer Node.js LTS:

```bash
npm install
npm run dev
```

Abra o endereço local que o Vite imprimir (normalmente `http://localhost:5173`). Para testar a compilação de produção:

```bash
npm run build
npm run preview
```

## O que já está no protótipo

- Campo de batalha lateral 2D com visual pixel-art, fundo em camadas, floresta, ruínas, cenário e partículas.
- Cinco heróis com silhuetas, armas, animação de caminhada/ataque e barras de vida.
- Monstros que se movem, atacam e recebem dano automaticamente; projéteis, efeitos de impacto e números de dano.
- Cristais de ouro/equipamento clicáveis, com recolhimento automático depois de alguns segundos.
- Elenco de 15 heróis fictícios; Tanques, Aeronaves e Mísseis têm funções variadas.
- Bônus progressivos: 3 de um tipo = +5%; 3+2 = +10%; 4+1 = +15%; 5 de um tipo = +20%.
- Ciclo de confronto: Tanques vencem Mísseis, Mísseis vencem Aeronaves, Aeronaves vencem Tanques.
- XP e níveis permanentes por herói; progressão de atributos por nível.
- Arma, armadura e relíquia; afixos, raridades e bônus de conjuntos.
- Carta Tática como relíquia, mantendo +20% numa composição 4+1.
- Salvamento local e progresso offline: ouro, XP e equipamentos com teto de 12 horas.
- Janela independente e compacta, pensada para continuar aberta enquanto você usa outros programas.

## Controles

- **Pausar/retomar:** controla o combate automático.
- **Elenco:** pause e escolha qual herói substituir.
- **Itens:** pause, selecione o herói e equipe ou compare itens.
- **Próxima horda:** fica disponível quando a equipe derrota a onda atual.
- **Clique nos cristais:** recolhe ouro, itens e relíquias.

Os dados ficam localmente neste navegador. Não há conta, sincronização na nuvem ou servidor remoto. Os personagens são sprites pixelados gerados por código para validar a mecânica; spritesheets de arte final, mais classes/habilidades e animações refinadas ainda estão no roadmap.

## Progressão e UX

Veja [GAME-PROGRESSION.md](./GAME-PROGRESSION.md) para o plano dos primeiros 15 minutos, ritmo dos drops, níveis, conjuntos, dificuldade, modo offline e organização do HUD.

## Automação

O workflow em `.github/workflows/build.yml` é **manual**, não é disparado por cada commit. Quando for necessário validar, ele executa o build e verifica a sintaxe do lançador Windows. Os commits, sozinhos, não iniciam builds.
