import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";

// Aqui você pode definir rotas publicas que não serão protegidas com a chave de API
const PUBLIC_ROUTES: string[] = [];

@Injectable()
export class ApiKeyGuard implements CanActivate {
	constructor(private readonly config: ConfigService) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<Request>();

		if (PUBLIC_ROUTES.includes(request.path)) {
			return true;
		}

		const expectedKey = this.config.get<string>("API_KEY");
		const providedKey = request.header("X-API-Key");

		if (!expectedKey) {
			throw new UnauthorizedException({
				error: "api_key_not_configured",
				message: "A API_KEY não está configurada no servidor.",
				data: [],
			});
		}

		if (!providedKey || providedKey !== expectedKey) {
			throw new UnauthorizedException({
				error: "invalid_api_key",
				message: 'Header "X-API-Key" ausente ou inválido.',
				data: [],
			});
		}

		return true;
	}
}
