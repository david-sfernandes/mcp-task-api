import { Module } from '@nestjs/common';
import { McpController } from './mcp.controller';
import { McpServerFactory } from './mcp-server.factory';
import { TaskService } from 'src/task/task.service';

@Module({
  controllers: [McpController],
  providers: [McpServerFactory, TaskService]
})
export class McpModule {}
