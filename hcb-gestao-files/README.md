# HCB Gestão

Sistema de gestão para a holding HCB, desenvolvido para automatizar processos de gestão de imóveis, contratos, conciliação bancária e processamento de emails da Ibagy.

## Funcionalidades

- **Gestão de Imóveis**: Cadastro e controle de imóveis com informações detalhadas (IPTU, TCRS, condomínio, seguro incêndio)
- **Gestão de Contratos**: Controle de contratos de locação, datas de reajuste e vencimento
- **Gestão Financeira**: Conciliação bancária e relatórios financeiros
- **Processamento de Emails**: Automação para processamento de emails da Ibagy

## Tecnologias

- Frontend: React com Material UI
- Banco de Dados: Google Sheets (integração via API)
- Deploy: Netlify

## Configuração

### Pré-requisitos

- Node.js (versão 14 ou superior)
- Conta no Google com acesso ao Google Sheets
- Conta no GitHub
- Conta no Netlify

### Instalação

1. Clone o repositório:
```
git clone https://github.com/thiagobez/hcb-gestao.git
cd hcb-gestao
```

2. Instale as dependências:
```
npm install
```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto
   - Adicione as seguintes variáveis:
   ```
   REACT_APP_GOOGLE_API_KEY=sua_chave_api_google
   REACT_APP_SPREADSHEET_ID=id_da_sua_planilha
   ```

4. Inicie o servidor de desenvolvimento:
```
npm start
```

## Estrutura do Projeto

- `/public`: Arquivos públicos
- `/src`: Código-fonte do aplicativo
  - `/components`: Componentes React reutilizáveis
  - `/contexts`: Contextos React (autenticação, tema)
  - `/pages`: Páginas do aplicativo
  - `/services`: Serviços para integração com Google Sheets
  - `/utils`: Funções utilitárias

## Configuração do Google Sheets

1. Crie uma planilha no Google Sheets com as seguintes abas:
   - Imoveis
   - Contratos
   - Proprietarios
   - Transacoes
   - EmailsProcessados

2. Adicione os cabeçalhos conforme os modelos fornecidos na pasta `/google_sheets_models`

3. Configure a API do Google Sheets:
   - Acesse o [Google Cloud Console](https://console.cloud.google.com/)
   - Crie um novo projeto
   - Ative a API do Google Sheets
   - Crie uma chave de API
   - Adicione a chave ao arquivo `.env`

## Deploy

O aplicativo está configurado para deploy automático no Netlify a partir do repositório GitHub.

## Licença

Este projeto é privado e de uso exclusivo da holding HCB.
