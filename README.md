# Frontier Heroes — protótipo 3D

Protótipo de jogo para navegador de um RPG de grupo com combate automático, loot e progressão contínua. A cena é renderizada em 3D com **Three.js**; **Vite** cuida do servidor de desenvolvimento e do build.

## Rodar localmente

É necessário ter Node.js instalado.

```bash
npm install
npm run dev
```

O Vite mostrará um endereço local (normalmente `http://localhost:5173`). Abra-o num navegador com suporte a WebGL 2.

Para validar a versão de produção:

```bash
npm run build
npm run preview
```

## O que já está no protótipo

- Clareira 3D com ruínas, círculo rúnico, árvores low-poly, iluminação, neblina e partículas ambientais.
- Cinco heróis visíveis no cenário, com silhuetas e armas distintas.
- Inimigos no mundo, combate automático, movimentação até os alvos, ataques, barras de vida e animação simples.
- Projéteis, números de dano, partículas de impacto e cristais de loot clicáveis.
- Elenco inicial de 15 heróis fictícios, distribuídos entre Tanques, Aeronaves e Mísseis. Cada categoria tem funções variadas.
- Bônus progressivos de composição: 3 do mesmo tipo = +5%; 3+2 = +10%; 4+1 = +15%; 5 do mesmo tipo = +20%.
- Ciclo de confronto: Tanques vencem Mísseis, Mísseis vencem Aeronaves, Aeronaves vencem Tanques.
- Carta Tática de teste que mantém +20% numa composição 4+1 quando encontrada como relíquia.
- Salvamento no navegador e renda offline simulada, generosa e limitada a 12 horas.
- Câmera orbital e zoom, elenco selecionável e ondas progressivas.

## Como jogar

1. Clique em **Começar**.
2. Observe a equipe lutar automaticamente.
3. Pause a batalha para abrir **Elenco** e substituir heróis.
4. Ao concluir uma horda, inicie a próxima.
5. Clique nos cristais brilhantes que caem no cenário para recolher ouro e equipamento.

O progresso é salvo no armazenamento local deste navegador. Ainda não há conta, servidor ou sincronização entre dispositivos.

## Estado do protótipo

Os heróis e inimigos atuais são modelos low-poly procedurais feitos com geometria 3D, para validar câmera, movimento, combate e efeitos sem depender ainda de arte final. Os números de combate, loot e progressão são placeholders sujeitos a balanceamento.

Próximas etapas: modelos e animações com rig real, inventário visual por herói, comparação de itens, sets completos, habilidades distintas, chefes e testes de balanceamento.

## Automação

O workflow em `.github/workflows/build.yml` instala as dependências e executa `npm run build` a cada alteração na branch `main`. O repositório permanece privado; o workflow valida o build, mas não publica um site público.
