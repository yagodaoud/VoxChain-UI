# Scripts de Automação

## Showcase Automation

Script Puppeteer para automatizar o fluxo completo de demonstração do sistema VoxChain.

### Pré-requisitos

1. Instalar dependências:
```bash
npm install
```

2. Certificar-se de que o servidor de desenvolvimento está rodando:
```bash
npm run dev
```

### Como usar

Execute o script com:
```bash
npm run showcase
```

### O que o script faz

1. **Login como Admin** (CPF: 11111111111, Senha: superadmin)
2. **Cria uma eleição** para o dia atual (01:00 às 23:00)
3. **Cadastra um candidato** (número 13, nome "Candidato Showcase", partido "DEMO")
4. **Cadastra um eleitor** (CPF: 33333333333, Senha: 123, Zona: 123, Seção: 123)
5. **Desloga** do sistema
6. **Faz login como eleitor** (CPF: 33333333333, Senha: 123)
7. **Escolhe a primeira eleição** disponível
8. **Vota no candidato** criado (número 13)
9. **Confirma o voto**

### Configurações

Você pode ajustar as configurações no início do arquivo `scripts/showcase-automation.js`:

- `BASE_URL`: URL base da aplicação (padrão: http://localhost:5173)
- `ADMIN_CPF`: CPF do administrador
- `ADMIN_SENHA`: Senha do administrador
- `ELEITOR_CPF`: CPF do eleitor
- `ELEITOR_SENHA`: Senha do eleitor

### Notas

- O script abre o navegador para visualização (headless: false)
- As ações são desaceleradas em 100ms para melhor visualização
- O script mantém o navegador aberto por 5 segundos ao final para visualização
- Em caso de erro, um screenshot é salvo como `error-screenshot.png`

