import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Injectable } from "@nestjs/common";
import { TaskService } from "src/task/task.service";
import { z } from "zod/v4";

type McpToolResult = {
	content: Array<{
		type: "text";
		text: string;
	}>;
	structuredContent: Record<string, unknown>;
};

@Injectable()
export class McpServerFactory {
	constructor(private readonly taskService: TaskService) {}

	/**
	 * Cria uma nova instância para cada requisição MCP.
	 * Não compartilhe a mesma instância entre transportes stateless.
	 */
	create(): McpServer {
		const server = new McpServer({
			name: "mcp-task-api",
			version: "1.0.0",
		});

		this.registerListTasks(server);
		this.registerGetTask(server);
		this.registerCreateTask(server);
		this.registerUpdateTask(server);
		this.registerToggleTask(server);
		this.registerDeleteTask(server);

		return server;
	}

	private registerListTasks(server: McpServer): void {
		server.registerTool(
			"list_tasks",
			{
				title: "Listar tarefas",
				description: "Lista todas as tarefas cadastradas.",
				inputSchema: {},
				annotations: {
					readOnlyHint: true,
					destructiveHint: false,
					idempotentHint: true,
					openWorldHint: false,
				},
			},
			async () => {
				const result = await this.taskService.findAll();
				return this.asToolResult(result);
			},
		);
	}

	private registerGetTask(server: McpServer): void {
		server.registerTool(
			"get_task",
			{
				title: "Consultar tarefa",
				description: "Obtém uma tarefa pelo seu ID.",
				inputSchema: {
					id: z.uuid(),
				},
				annotations: {
					readOnlyHint: true,
					destructiveHint: false,
					idempotentHint: true,
					openWorldHint: false,
				},
			},
			async ({ id }) => {
				const result = await this.taskService.findOne(id);
				return this.asToolResult(result);
			},
		);
	}

	private registerCreateTask(server: McpServer): void {
		server.registerTool(
			"create_task",
			{
				title: "Criar tarefa",
				description: "Cria uma nova tarefa.",
				inputSchema: {
					title: z.string().trim().min(1),
					description: z.string().optional(),
				},
				annotations: {
					readOnlyHint: false,
					destructiveHint: false,
					idempotentHint: false,
					openWorldHint: false,
				},
			},
			async ({ title, description }) => {
				const result = await this.taskService.create({
					title,
					description,
				});

				return this.asToolResult(result);
			},
		);
	}

	private registerUpdateTask(server: McpServer): void {
		server.registerTool(
			"update_task",
			{
				title: "Atualizar tarefa",
				description: "Atualiza os dados de uma tarefa existente.",
				inputSchema: {
					id: z.uuid(),
					title: z.string().optional(),
					description: z.string().optional(),
					completed: z.boolean().optional(),
				},
				annotations: {
					readOnlyHint: false,
					destructiveHint: false,
					idempotentHint: true,
					openWorldHint: false,
				},
			},
			async ({ id, ...data }) => {
				const result = await this.taskService.update(id, data);
				return this.asToolResult(result);
			},
		);
	}

	private registerToggleTask(server: McpServer): void {
		server.registerTool(
			"toggle_task",
			{
				title: "Alternar conclusão da tarefa",
				description:
					"Marca uma tarefa como concluída ou pendente, alternando seu estado atual.",
				inputSchema: {
					id: z.uuid(),
				},
				annotations: {
					readOnlyHint: false,
					destructiveHint: false,
					idempotentHint: false,
					openWorldHint: false,
				},
			},
			async ({ id }) => {
				const result = await this.taskService.toggleCompleted(id);
				return this.asToolResult(result);
			},
		);
	}

	private registerDeleteTask(server: McpServer): void {
		server.registerTool(
			"delete_task",
			{
				title: "Excluir tarefa",
				description: "Remove uma tarefa definitivamente.",
				inputSchema: {
					id: z.uuid(),
				},
				annotations: {
					readOnlyHint: false,
					destructiveHint: true,
					idempotentHint: true,
					openWorldHint: false,
				},
			},
			async ({ id }) => {
				const result = await this.taskService.remove(id);
				return this.asToolResult(result);
			},
		);
	}

	private asToolResult(value: unknown): McpToolResult {
		const structuredContent = this.asStructuredContent(value);

		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(value) ?? "null",
				},
			],
			structuredContent,
		};
	}

	private asStructuredContent(value: unknown): Record<string, unknown> {
		if (value !== null && typeof value === "object" && !Array.isArray(value)) {
			return value as Record<string, unknown>;
		}

		return { data: value };
	}
}
