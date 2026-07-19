# NestJS MCP/REST API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

> **Demonstração de integração entre APIs REST corporativas e Agentes de IA utilizando o Model Context Protocol (MCP).**

Este projeto exemplifica como transformar uma API NestJS convencional em um servidor MCP, permitindo que agentes de IA (como Claude e ChatGPT) interajam diretamente com a lógica de negócio de forma segura, padronizada e com alto reaproveitamento de código.

---

## 💡 O Problema e a Solução

### O Desafio
Integrar agentes de IA com sistemas internos geralmente exige a criação de conectores customizados ou a exposição insegura de chaves de API em prompts. Além disso, manter documentações de API (como Swagger) sincronizadas com as "skills" da IA gera overhead de manutenção.

### A Abordagem MCP
Utilizando o **Model Context Protocol**, esta API expõe um endpoint único que descreve suas capacidades para a IA. 
- **Segurança:** Mantém a autenticação via API Key.
- **Engenharia:** Reaproveita 100% dos *Services* e *Controllers* existentes do NestJS.
- **Escalabilidade:** Permite que a IA execute operações complexas (CRUD) sem necessidade de código de integração específico no lado do cliente.

---

## 🛠️ Stack Técnica

- **Framework:** [NestJS](https://nestjs.com/) (Node.js)
- **Linguagem:** TypeScript
- **ORM:** [Prisma](https://www.prisma.io/) com SQLite
- **Protocolo:** [@modelcontextprotocol/sdk](https://modelcontextprotocol.io/)
- **Package Manager:** PNPM

---

## 🌿 Estrutura de Branches

Para facilitar o aprendizado, o repositório está organizado em:
- `master`: Boilerplate inicial da API REST (ponto de partida para o tutorial).
- `final`: Implementação completa com o servidor MCP configurado e integrado.

---

## 🚀 Setup e Instalação

### 1. Configuração de Ambiente
```bash
cp .env.example .env
```
Gere uma chave segura para a `API_KEY`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Instalação e Banco de Dados
```bash
pnpm install
pnpm prisma migrate dev
pnpm prisma generate
```

### 3. Execução
```bash
# Development mode
pnpm run start:dev
```

---

## 🔌 Interface MCP (Model Context Protocol)

A grande vantagem deste projeto é a camada MCP. Você pode inspecionar como a IA "enxerga" sua API utilizando o Inspector oficial:

```bash
npx @modelcontextprotocol/inspector --cli http://localhost:3000/mcp --transport http --method tools/list --header "X-API-Key: SUA_CHAVE_AQUI"
```

### Por que isso é relevante para Engenharia?
Ao contrário de um webhook simples, o MCP fornece um **esquema tipado** de ferramentas. Quando a IA pergunta "quais tarefas estão pendentes?", o servidor MCP mapeia essa intenção diretamente para o `TasksService.findAll()`, garantindo que as regras de negócio sejam respeitadas.

---

## 🔒 Segurança e Produção

- **SSL/TLS:** Essencial para produção. Agentes de IA exigem HTTPS para comunicação segura.
- **Portas:** Recomenda-se o uso da porta padrão `443` para evitar bloqueios de conectividade em plataformas como ChatGPT.
- **Autenticação:** Implementada via `X-API-Key` no header, garantindo que apenas agentes autorizados invoquem as ferramentas.

---

## 👨‍💻 Sobre o Autor

**David Fernandes**  
*Desenvolvedor Full Stack especializado em React, Next.js e TypeScript.*

- 🌐 [Portfólio](https://www.davidfernandes.tech)
- 🐙 [GitHub](https://github.com/david-sfernandes)
- 📍 São Paulo, SP
