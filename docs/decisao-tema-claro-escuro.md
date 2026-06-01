# Decisão oficial: tema claro e escuro

A próxima etapa visual do projeto é criar um sistema real de tema claro e escuro.

## Regra principal

Não continuar apenas trocando cores tela por tela.

O correto agora é criar um botão real de alternância de tema, com controle central.

## O que o botão deve fazer

- Alternar entre tema claro e tema escuro.
- Salvar a escolha do usuário no navegador.
- Aplicar o tema de forma consistente.
- Evitar mistura de páginas claras e escuras.

## O que não pode mexer

- Supabase.
- Login.
- Anúncios.
- Admin.
- Upload.
- Aprovação.
- Segurança.
- Banco de dados.
- Tamanho de cards, fotos, menus ou grids sem necessidade.

## Paleta escura aprovada

- Cinza escuro como base.
- Verde para ação positiva, destaque e aprovação.
- Vermelho para excluir, reprovar, sair e alerta.

## Estratégia segura

1. Primeiro painel e admin.
2. Depois site público.
3. Painel e admin podem abrir no escuro por padrão.
4. Site público pode abrir claro por padrão, com opção para escuro.

## Branch relacionada

`tema-escuro-controlado`
