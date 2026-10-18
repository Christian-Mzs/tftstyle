# Frontier Heroes — visão de progressão e experiência inicial

**Status:** proposta de design v0.2. Direção visual atual: Canvas 2D com sprites pixelados, janela compacta e batalha lateral. Os números são hipóteses para playtest, não balanceamento final.

## Fantasia central

Uma equipe de cinco heróis luta automaticamente numa faixa lateral 2D com pixel art. A janela é compacta e leve, pensada para ficar aberta junto dos outros programas. O jogador pode acompanhar a ação, coletar drops, experimentar equipamentos e mudar a composição; também pode deixar o jogo numa janela pequena enquanto trabalha. Ao voltar, encontra progresso acumulado e decisões significativas — não só uma tela cheia de moedas.

A referência central é o loop de TBH: Task Bar Hero descrito na Steam: combate automático contínuo, crescimento enquanto ausente, regiões, níveis, equipamento, classes, habilidades e builds. O nosso diferencial é o grupo de cinco heróis, as três afinidades de tropa, os confrontos cíclicos e as builds por herói.

## Direção técnica e visual

- Usar Canvas 2D e sprites pixelados na primeira versão, em vez de modelos 3D. A prioridade é baixo consumo de CPU/GPU, leitura clara mesmo em janela pequena e animação constante enquanto o jogador trabalha.
- O cenário é uma faixa lateral com parallax simples, chão, silhuetas de floresta/ruínas e efeitos de combate. A equipe e os inimigos são desenhados em layers conforme a posição vertical, dando sensação de profundidade sem renderização 3D.
- Janela de jogo independente, aproximadamente 1000 × 620 no lançador do Windows. O modo realmente encaixado na barra de tarefas, como TBH, exigiria depois empacotar a aplicação em Electron/Tauri/Win32; o protótipo atual não se integra à taskbar do Windows.
- Renderizar a ~30 FPS com resolução interna reduzida e sem depender de WebGL. Não carregar assets pesados nem fontes externas para o loop central.

## Princípios de UX

1. **Começar pela ação.** O mundo já está visível e os heróis já estão lutando; não abrir com uma tela de atributos, árvore de talentos ou tutorial longo.
2. **Uma nova ideia por vez.** Primeiro observar combate; depois recolher um item; depois equipar; depois aprender afinidades; depois abrir composição e builds.
3. **Recompensa rápida e compreensível.** Um primeiro drop garantido deve aparecer cedo. Mostrar claramente o que o item muda e por que é melhor, sem exigir calculadora.
4. **Progressão offline generosa, mas limitada.** A primeira ausência deve render um retorno perceptível. Definir teto (12 horas para o protótipo) e calcular recompensas a partir do último salvamento.
5. **Itens que criam escolhas.** A raridade é um sinal, não o único critério; vida, dano, velocidade, efeito único e sets devem gerar escolhas de build.
6. **Evitar bloqueios artificiais.** Se uma sessão não trouxer item útil, o jogador ainda consegue evoluir com XP, ouro e crafting simples.
7. **HUD a serviço do mundo.** A cena 2D de combate ocupa a tela. O HUD prioriza heróis/vida, sinergia, loot recente e controle do combate; inventário, composição detalhada e configurações ficam em painéis acessíveis.

## Primeiros 15 minutos

### 0:00–0:30 — ação imediata
- A clareira e os cinco heróis são apresentados já em combate.
- Só aparece uma dica curta: "Seus heróis lutam sozinhos. Clique nos cristais de loot quando os inimigos caírem."
- Nenhuma janela de tutorial bloqueia o cenário.
- Formação inicial sugerida: 3 Tanques + 2 Aeronaves, que demonstra o bônus de composição +10% sem exigir que o jogador conheça todos os sistemas.

### 0:30–2:00 — primeiro drop
- A primeira horda é curta e usa inimigos fáceis de ler visualmente.
- O primeiro equipamento é garantido; o cristal tem forma/cor distinta.
- Ao clicar, surge um painel pequeno de comparação: atributo anterior, atributo novo, diferença verde/vermelha e botão "Equipar".
- Um item que não sirva vira material/valor de venda; não é recompensa desperdiçada.

### 2:00–4:00 — primeira escolha do jogador
- O primeiro nível do grupo chega por atividade normal, sem grinding.
- A abertura do elenco explica a diferença entre **tropa** (Tanques/Aeronaves/Mísseis) e **função** (defensor, atacante, suporte, especialista).
- A composição atual apresenta o bônus aplicado e qual regra o causou.
- Uma dica opcional explica o ciclo de vantagens; não interrompe o combate.

### 4:00–7:00 — primeiro mini-chefe
- Um inimigo de silhueta diferente e ataques telegrafados pede que o jogador observe a formação.
- O mini-chefe garante uma peça de conjunto ou uma relíquia inicial.
- A recompensa introduz o conceito de bônus de set antes de exigir que o jogador complete vários conjuntos.

### 7:00–10:00 — primeira build reconhecível
- Uma habilidade/estatística passa a interagir com itens, por exemplo: crítico, queimadura, sangramento ou escudo.
- O jogador pode ver pelo menos duas soluções funcionais: concentrar dano num atacante ou dar mais sobrevivência ao grupo.
- O jogo sugere sinergia sem forçar uma build única.

### 10:00–15:00 — abrir a progressão longa
- Mostrar mapa/ato seguinte, níveis de dificuldade e objetivos de drop.
- Dar uma missão curta e uma meta clara: "encontre duas peças do conjunto", "alcance nível 5" ou "vença a horda 10".
- Explicar o retorno offline: a equipe continua acumulando progresso, com limite e resumo ao voltar.

## Progressão de longo prazo

### Camada 1 — heróis
- XP e níveis permanentes. Atributos sobem em incrementos previsíveis, com curvas moderadas.
- Heróis mantêm identidade de tropa e função; a build muda por habilidades, equipamentos e efeitos.
- O elenco cresce por recrutamento/objetivos, não por um menu com todos os heróis liberados desde o primeiro segundo.
- Trocar heróis para enfrentar um encontro não deve destruir o investimento em outro personagem.

### Camada 2 — equipamento e loot
- Slots iniciais recomendados: arma, armadura e acessório/relíquia; expandir apenas quando houver conteúdo suficiente.
- Itens têm nível, raridade, afixos e 1–2 efeitos fáceis de ler. Raridades: comum, incomum, raro, épico e lendário; raridades superiores entram mais tarde.
- Equipamento deve poder ser comparado e trocado sem fricção. Itens obsoletos continuam úteis como ouro ou material.
- Drops aleatórios precisam de limites de azar: recompensas garantidas em marcos e proteção contra longas sequências sem upgrade.

### Camada 3 — conjuntos
- Sets têm uma identidade mecânica, não só percentuais: por exemplo, "Vigia do Véu" melhora escudos e contra-ataques; "Caçador da Bruma" recompensa críticos; "Fornalha Antiga" propaga queimadura.
- Bônus de 2 peças mudam algo de maneira perceptível; 3 ou 4 peças completam a fantasia do set.
- Não exigir sets completos para superar o conteúdo principal. Sets são estilos de build, não uma única resposta correta.
- O primeiro mini-chefe introduz a ideia com uma peça garantida e mostra claramente a condição para completar o conjunto.

### Camada 4 — afinidades e composições
- Tanques vencem Mísseis; Mísseis vencem Aeronaves; Aeronaves vencem Tanques.
- Bônus progressivo a implementar/validar: 3 de um tipo = +5%; 3+2 = +10%; 4+1 = +15%; 5 de um tipo = +20%.
- Carta Tática pode permitir 4+1 com +20%, mas deve ser rara/estratégica, não obrigatória.
- Cada tipo precisa ter defensores, atacantes, suportes e especialistas; uma equipe monotipo precisa ter respostas internas suficientes para funcionar.
- A vantagem de confronto é multiplicador complementar, não substituto de composição, qualidade do equipamento ou poder do jogador.

### Camada 5 — mundo e atividades
- Regiões com famílias de inimigos e drops próprios.
- Hordas curtas para farm; elites para itens específicos; chefes para peças de sets, relíquias e desbloqueios.
- Atos desbloqueiam dificuldades e pools de loot, não apenas vida infinita nos mesmos monstros.
- Objetivo de build, progresso de heróis e recursos de crafting devem avançar em paralelo para evitar bloqueio por um único tipo de drop.

### Camada 6 — progresso offline
- Guardar timestamp do último salvamento.
- Ao retornar: calcular tempo ausente com teto de 12 horas no protótipo; conceder ouro, XP de heróis ativos e uma quantidade controlada de drops.
- Mostrar resumo de retorno: ouro, XP, itens encontrados e ondas simuladas.
- A economia offline deve dar progresso, mas os chefes e os melhores itens ainda recompensam decisões durante o jogo ativo.
- Não simular milhares de entidades em tempo real durante a ausência; calcular o resultado agregado de maneira determinística, com um componente aleatório sem viés para salvar/carregar repetidamente.

## Hierarquia do HUD

- **Sempre visível:** cinco cartões de herói com vida/nível, bônus de composição, ouro e estado da expedição.
- **Temporário:** números de dano, drop, novo item, subiu de nível, conclusão da horda.
- **Painéis:** elenco, inventário/equipamento, sets/builds, mapa e configurações.
- **Modo compacto futuro:** reduzir o cenário e o HUD para funcionar como janela pequena, sem mudar as mecânicas centrais de progressão.
- **Acessibilidade:** escala da HUD, leitura por cor e ícones/símbolos, controle de som e limite de partículas.

## O que evitar (lições de sistemas idle e loot)

- Drop raro tão infrequente que impede trocar equipamentos de vários heróis.
- Um único atributo que ganha de todos os outros.
- Sets tão fortes que invalidam qualquer item fora deles.
- Níveis de personagem avançando muito mais rápido que a qualidade do loot ou o contrário.
- Bônus de tropa tão grande que os confrontos e as builds deixam de importar.
- Tutorial obrigatório longo antes de o jogador ver o jogo funcionando.

Discussões públicas de jogadores de TBH relatam frustração quando caixas, drops, joias ou progressão do Cube não acompanham o nível dos heróis. Isso é feedback comunitário, não uma medição científica, mas destaca um risco prático: alinhar progressão de herói, equipamento e crafting para que nenhuma camada fique bloqueada.

## Ordem de implementação proposta

1. Início automático e onboarding curto; garantir primeiro drop.
2. XP e níveis de herói, persistidos localmente.
3. Inventário, equipamento, comparação de atributos e bônus de sets.
4. Tela de retorno offline com ouro, XP e loot acumulado.
5. Recrutamento gradual, novas regiões, elites e chefes.
6. Builds avançadas, crafting/cubo, sets completos e balanceamento com playtests.

## Referências consultadas

- TBH: Task Bar Hero — descrição oficial da Steam: combate automático, crescimento ausente, regiões, níveis, builds, sistema Cube e itens: https://store.steampowered.com/app/3678970/TBH/
- Last War Vault — guia comunitário sobre cinco heróis, funções por posição, bônus 3/3+2/4/5 e triângulo de tropas: https://www.lastwarvault.com/guides/general/getting-started/
- Roblox Creator Hub — onboarding/FTUE: introduzir interface e mecânicas em pequenos passos e acompanhar conclusão do onboarding e retenção D1: https://create.roblox.com/docs/production/game-design/onboarding
- Vite — porque a aplicação deve ser servida por um servidor de desenvolvimento, em vez de aberta diretamente via `file://`: https://vite.dev/guide/
- Steam Community — discussões de jogadores sobre equilíbrio de drops, progressão de heróis e Cube; usada como feedback qualitativo: https://steamcommunity.com/app/3678970/discussions/
