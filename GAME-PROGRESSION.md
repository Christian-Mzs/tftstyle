# Frontier Heroes — visão de progressão e experiência inicial

**Direção atual: onboarding em etapas, coleção de 45 heróis e combate 2D leve.** Os números de recompensa são valores iniciais para playtest, não balanceamento final.

## Fantasia central

A campanha começa com Bram, o último guardião de uma fronteira devastada. Ele luta sozinho contra uma primeira criatura. Ao vencer, encontra cartas de recrutamento e abre a Taverna da Fronteira. A partir daí, o jogador transforma uma sobrevivência solitária numa expedição de até cinco heróis.

A inspiração é o ritmo de descoberta de *Last War* e a progressão incremental de *TBH: Task Bar Hero*, não uma cópia de suas interfaces ou personagens. O princípio: o jogo deve ensinar uma mecânica, dar uma recompensa, pedir uma decisão e só então revelar o próximo sistema.

## Experiência inicial implementada

### Etapa 1 — Um herói, uma batalha

- Campanha nova começa com **Bram (SR)**, uma vaga aberta, zero ouro e zero cartas. Não há equipe pronta nem inventário inicial.
- A primeira horda contém apenas uma criatura, para ensinar o combate automático sem sobrecarregar o jogador.
- A missão na tela explica o objetivo inicial: vencer a criatura e recolher as cartas que ela deixar.
- O primeiro inimigo derruba um pacote de 3 cartas. A recompensa por completar a primeira horda concede mais 2.
- O loot no campo é clicável e também é recolhido automaticamente após alguns segundos. Os drops são salvos para não sumirem caso o jogo seja fechado.

### Etapa 2 — A Taverna e o primeiro recrutamento

- Ao completar a primeira horda, a Taverna é desbloqueada e abre-se a segunda vaga da formação.
- O jogador precisa reunir **5 cartas de recrutamento** para recrutar um herói aleatório.
- O botão para avançar à próxima horda permanece bloqueado até que o jogador consiga seu primeiro aliado. Isso garante que a mecânica principal seja experimentada antes de a dificuldade crescer.
- O herói recém-recrutado entra automaticamente na vaga livre quando possível; se não houver vaga, fica na coleção para uma futura formação.
- O modal da Taverna mostra a carta revelada, a raridade, o progresso de coleção e as probabilidades de recrutamento.

### Etapa 3 — Coleção SR, SSR e UR

Existem **45 identidades de herói no catálogo inicial**: 15 SR, 15 SSR e 15 UR. Cada raridade contempla cinco Tanques, cinco Aeronaves e cinco heróis de Mísseis.

| Raridade | Chance base | Papel na progressão |
|---|---:|---|
| SR | 78% | Base comum para expandir a coleção e preencher vagas |
| SSR | 20% | Recrutas mais fortes, com maior potencial de atributos |
| UR | 2% | Descobertas raras, com maior potencial de atributos |

Há proteção contra azar: um SSR é garantido até o décimo recrutamento sem SSR; um UR é garantido até o trigésimo recrutamento sem UR. Não há moeda premium nem compra com dinheiro real nesta versão: cartas são obtidas jogando.

As três raridades usam os arquétipos atuais de combate e sprites gerados por código, com nomes e atributos escalados. Habilidades exclusivas por herói, animações próprias e arte final são trabalho futuro; a raridade já influencia os atributos no protótipo.

### Etapa 4 — Vagas, equipamentos e builds

| Marco de campanha | Desbloqueio |
|---|---|
| Início | Bram e uma vaga |
| Primeira horda | Taverna, cartas de recrutamento e segunda vaga |
| Terceira horda concluída | Terceira vaga e equipamentos |
| Sexta horda concluída | Quarta vaga |
| Décima horda concluída | Quinta vaga |

A primeira fase ensina recrutar e montar a equipe; equipamentos, atributos e conjuntos entram depois, evitando que o jogador precise aprender tudo no primeiro minuto. Os equipamentos têm arma, armadura e relíquia, raridades e bônus de conjuntos. Chefes aparecem como marcos regulares e podem conceder relíquias.

## Regras de design

1. **Uma novidade por vez.** Não exibir uma equipe de cinco, equipamento, conjunto, formação e composição no primeiro quadro.
2. **Recompensa ligada à ação.** O jogador vê a criatura, derrota-a, recolhe cartas e usa as cartas na Taverna.
3. **Toda raridade é alcançável jogando.** Probabilidades são visíveis e há proteção contra azar.
4. **Desbloqueios explicados.** Vagas fechadas indicam exatamente qual horda as abre; botões para sistemas ainda bloqueados não dominam a interface.
5. **O jogador mantém agência.** O combate é automático, mas escolher heróis, preencher vagas, equipar itens e buscar sinergias são decisões reais.
6. **A sessão continua leve.** Canvas 2D em resolução interna reduzida, renderização a aproximadamente 30 FPS e sem WebGL.
7. **Recompensas persistem.** Cartas e drops no campo não devem desaparecer ao fechar a janela; ouro, coleção e progresso são salvos localmente.

## Progressão de longo prazo

- **Coleção:** completar as listas SR/SSR/UR, encontrar heróis de cada tipo de tropa e manter reservas para adaptar a formação.
- **Formação:** até cinco heróis ativos; bônus crescentes por repetição de tipo (3 iguais, 3+2, 4+1 e 5 iguais). O bônus de composição só importa depois que houver heróis suficientes para formar uma equipe.
- **Triângulo de tropas:** Tanques vencem Mísseis, Mísseis vencem Aeronaves e Aeronaves vencem Tanques. A vantagem complementar de dano não substitui nível e build.
- **Equipamento:** armas, armaduras e relíquias com atributos e conjuntos como Vigia do Véu, Caçador da Bruma e Fornalha Antiga.
- **Regiões:** a Floresta dos Ecos introduz o combate; as Ruínas do Véu e o Portão das Cinzas estendem os atos. Elites e chefes adicionam pools de saque e objetivos específicos.
- **Idle/offline:** ouro e XP são calculados ao retornar, com limite de 12 horas. Equipamentos offline só aparecem depois que o sistema de equipamento é desbloqueado.
- **Futuro:** habilidades exclusivas, crafting/cubo, novas atividades e balanceamento através de testes. A integração real à barra de tarefas do Windows exige um wrapper desktop e não faz parte desta versão.

## Hierarquia do HUD

- **Sempre visível:** ouro, horda, cartas, objetivo atual e as cinco posições da expedição (vagas bloqueadas são mostradas como bloqueadas).
- **Desbloqueios:** Taverna após a primeira horda; Elenco quando houver heróis para administrar; Itens quando o sistema de equipamento se abrir.
- **Temporário:** saque encontrado, herói recrutado, vaga liberada, chefe derrotado e resumo offline.
- **Painéis:** Taverna e coleção, Elenco/expedição, inventário/equipamento.
- **Acessibilidade futura:** escala da HUD, opções de cor e partículas, som e suporte a teclado.

## Critérios de playtest para o início

- O jogador entende em até 10 segundos que começou com apenas um herói.
- A primeira batalha tem um único inimigo e termina sem necessidade de um guia externo.
- O pacote de cartas e a recompensa da primeira horda tornam possível o primeiro recrutamento.
- O jogador não pode iniciar a segunda horda antes de recrutar seu primeiro aliado.
- Fechar e reabrir o jogo não remove cartas que já caíram nem reseta a coleção.
- A interface mostra por que vagas futuras estão bloqueadas e qual marco as libera.

## Referências

- TBH: Task Bar Hero — página oficial da Steam: https://store.steampowered.com/app/3678970/TBH/
- Last War Vault — guia comunitário para novos jogadores: https://www.lastwarvault.com/guides/general/getting-started/
- Roblox Creator Hub — princípios de onboarding e progressão inicial: https://create.roblox.com/docs/production/game-design/onboarding
- Vite — documentação de execução local: https://vite.dev/guide/
