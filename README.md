# NestJS MCP/REST API

<p align="center">
<a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p> <p align="center">
  <a href="README.pt-br.md">🇧🇷 Leia em Português</a>
</p>

> **A demonstration of integrating enterprise REST APIs with AI Agents using the Model Context Protocol (MCP ).**

This project illustrates how to transform a conventional NestJS API into an MCP server, enabling AI agents (such as Claude and ChatGPT) to interact directly with business logic in a secure, standardized way with high code reusability.

---

## 💡 Problem & Solution

### The Challenge

Integrating AI agents with internal systems usually requires building custom connectors or insecurely exposing API keys within prompts. Furthermore, keeping API documentation (like Swagger) in sync with AI "skills" creates significant maintenance overhead.

### The MCP Approach

By leveraging the **Model Context Protocol**, this API exposes a single standardized endpoint that describes its capabilities to the AI.

- **Security:** Maintains authentication via API Key.

- **Engineering:** Reuses 100% of existing NestJS *Services* and *Controllers*.

- **Scalability:** Enables the AI to perform complex operations (CRUD) without requiring specific integration code on the client side.

---

## 🛠️ Tech Stack

- **Framework:** [NestJS](https://nestjs.com/) (Node.js)

- **Language:** TypeScript

- **ORM:** [Prisma](https://www.prisma.io/) with SQLite

- **Protocol:** [@modelcontextprotocol/sdk](https://modelcontextprotocol.io/)

- **Package Manager:** PNPM

---

## 🌿 Branch Structure

To facilitate learning, the repository is organized into:

- `master`: Initial REST API boilerplate (starting point for the tutorial).

- `final`: Complete implementation with the MCP server configured and integrated.

---

## 🚀 Setup & Installation

### 1. Environment Configuration

```bash
cp .env.example .env
```

Generate a secure key for `API_KEY`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Installation & Database

```bash
pnpm install
pnpm prisma migrate dev
pnpm prisma generate
```

### 3. Execution

```bash
# Development mode
pnpm run start:dev
```

---

## 🔌 MCP Interface (Model Context Protocol)

The core advantage of this project is the MCP layer. You can inspect how the AI "sees" your API using the official Inspector:

```bash
npx @modelcontextprotocol/inspector --cli http://localhost:3000/mcp --transport http --method tools/list --header "X-API-Key: YOUR_KEY_HERE"
```

### Why is this relevant for Engineering?

Unlike a simple webhook, MCP provides a **typed schema** of tools. When the AI asks "which tasks are pending?", the MCP server maps this intent directly to `TasksService.findAll( )`, ensuring that business rules are strictly followed.

---

## 🔒 Security & Production

- **SSL/TLS:** Essential for production. AI agents require HTTPS for secure communication.

- **Ports:** Using the standard port `443` is recommended to avoid connectivity issues on platforms like ChatGPT.

- **Authentication:** Implemented via `X-API-Key` in the header, ensuring only authorized agents can invoke the tools.

---

## 👨‍💻 About the Author

**David Fernandes***Full Stack Developer specialized in React, Next.js, and TypeScript.*

- 🌐 [Portfolio](https://www.davidfernandes.tech)

- 🐙 [GitHub](https://github.com/david-sfernandes)

- 📍 São Paulo, Brazil
