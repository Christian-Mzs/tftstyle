# Frontier Heroes — protótipo 2D idle RPG

RPG idle 2D com pixel art procedural, combate automático e progressão baseada em recrutamento de heróis. A campanha começa com **um único SR**, cartas para recrutar na Taverna e vagas que são liberadas ao concluir hordas. A coleção inicial tem **45 heróis: 15 SR, 15 SSR e 15 UR**, divididos entre Tanques, Aeronaves e Mísseis. O jogo roda em Canvas 2D, sem WebGL ou Three.js.

## Iniciar no Windows

1. Instale [Node.js LTS](https://nodejs.org/) se ainda não estiver instalado.
2. Baixe o ZIP mais recente deste repositório por **Code → Download ZIP** e extraia a pasta.
3. Dê dois cliques em `start-game.bat`.

Na primeira execução, o lançador instala as dependências automaticamente, inicia o servidor local e abre uma janela própria de cerca de 1000 × 620 pixels no Edge ou Chrome. **Feche a janela do jogo para o servidor local ser encerrado automaticamente.** A janela preta do lançador deve permanecer aberta durante o jogo.

O lançador usa um perfil persistente separado do navegador normal, para guardar o progresso entre sessões em `%LOCALAPPDATA%\FrontierHeroes\BrowserProfile`. O perfil não é apagado ao sair. Se a porta local 4173 estiver ocupada, o lançador avisa e não encerra o processo de outra aplicação.

> Esta versão inaugura uma nova campanha e usa uma chave de salvamento separada para garantir a experiência inicial correta. O salvamento antigo do protótipo não é carregado nem apagado por esta mudança.

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

## Progressão de jogo implementada

- **Início solo:** Bram é o único herói ativo; não há time completo nem inventário inicial.
- **Primeira horda:** um inimigo, um drop garantido de 3 cartas e 2 cartas de recompensa ao completar a missão.
- **Taverna:** 5 cartas recrutam um herói aleatório; o primeiro aliado entra automaticamente na segunda vaga.
- **45 heróis de coleção:** 15 SR, 15 SSR e 15 UR, com cinco de cada raridade para cada tipo de tropa.
- **Recrutamento transparente:** SR 78%, SSR 20%, UR 2%; proteção contra azar garante SSR até o 10º recrutamento sem SSR e UR até o 30º sem UR. Todos os heróis podem ser obtidos jogando.
- **Desbloqueios graduais:** segunda vaga após a primeira horda; terceira após a terceira; quarta após a sexta; quinta após a décima.
- **Equipamento mais tarde:** equipamentos e sistema de itens são desbloqueados ao concluir a terceira horda; armas, armaduras, relíquias e conjuntos continuam disponíveis.
- **Combate leve:** mundo lateral em Canvas 2D, criaturas, animações, dano, partículas e saque no cenário.
- **Triângulo tático:** Tanques vencem Mísseis, Mísseis vencem Aeronaves e Aeronaves vencem Tanques.
- **Salvamento local:** coleção, formação, cartas, equipamentos e drops no campo são salvos localmente. A progressão offline é limitada a 12 horas.
- **Arte provisória:** sprites e variações de heróis são gerados por código para validar progressão e combate; arte final, habilidades exclusivas e integração nativa à barra de tarefas ainda são trabalho futuro.

## Controles

- **Taverna:** abra a coleção e gaste 5 cartas de recrutamento.
- **Elenco:** escolha heróis recrutados para preencher ou trocar posições; pause o combate antes de reorganizar a equipe.
- **Itens:** após desbloquear equipamentos, pause para comparar e equipar itens.
- **Pausar/retomar:** controla o combate automático.
- **Próxima horda:** fica liberada ao concluir a batalha; na primeira horda, é necessário recrutar o primeiro aliado antes de avançar.
- **Clique nos saques:** recolhe cartas, ouro e equipamento; saques esquecidos são recolhidos automaticamente depois de alguns segundos.

Os dados ficam localmente no perfil do navegador dedicado usado pelo lançador. Não há conta, sincronização na nuvem ou servidor remoto.

## Progressão e UX

Veja [GAME-PROGRESSION.md](./GAME-PROGRESSION.md) para o onboarding, as probabilidades de recrutamento, a ordem dos desbloqueios e os critérios para testar o início da campanha.

## Automação

O workflow em `.github/workflows/build.yml` é **manual**, não é disparado por cada commit. Quando for necessário validar, ele executa o build e verifica a sintaxe do lançador Windows. Os commits, sozinhos, não iniciam builds.
