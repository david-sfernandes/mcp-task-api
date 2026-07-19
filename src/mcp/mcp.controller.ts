import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
	Controller,
	Delete,
	Get,
	HttpStatus,
	Post,
	Req,
	Res,
} from "@nestjs/common";
import type { Request, Response } from "express";

import { McpServerFactory } from "./mcp-server.factory";

@Controller("mcp")
export class McpController {
	constructor(private readonly serverFactory: McpServerFactory) {}

	@Post()
	async handlePost(
		@Req() request: Request,
		@Res() response: Response,
	): Promise<void> {
		const server = this.serverFactory.create();

		const transport = new StreamableHTTPServerTransport({
			sessionIdGenerator: undefined,
		});

		response.on("close", () => {
			void transport.close();
			void server.close();
		});

		try {
			await server.connect(transport);

			await transport.handleRequest(request, response, request.body);
		} catch (error) {
			console.error("Erro ao processar requisição MCP", error);

			if (!response.headersSent) {
				response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
					jsonrpc: "2.0",
					error: {
						code: -32603,
						message: "Internal server error",
					},
					id: null,
				});
			}
		}
	}

	@Get()
	handleGet(@Res() response: Response): void {
		response.status(HttpStatus.METHOD_NOT_ALLOWED).json({
			jsonrpc: "2.0",
			error: {
				code: -32000,
				message: "Method not allowed",
			},
			id: null,
		});
	}

	@Delete()
	handleDelete(@Res() response: Response): void {
		response.status(HttpStatus.METHOD_NOT_ALLOWED).json({
			jsonrpc: "2.0",
			error: {
				code: -32000,
				message: "Method not allowed",
			},
			id: null,
		});
	}
}