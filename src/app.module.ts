import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { ApiKeyGuard } from "./guard/api-key.guard";
import { PrismaModule } from "./prisma/prisma.module";
import { TaskModule } from './task/task.module';

@Module({
	imports: [PrismaModule, TaskModule],
	controllers: [AppController],
	providers: [{ provide: APP_GUARD, useClass: ApiKeyGuard }],
})
export class AppModule {}
