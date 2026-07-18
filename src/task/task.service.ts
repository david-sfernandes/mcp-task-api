import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

export interface CreateTaskDto {
	title: string;
	description?: string;
}

export interface UpdateTaskDto {
	title?: string;
	description?: string;
	completed?: boolean;
}

@Injectable()
export class TaskService {
	constructor(private readonly prisma: PrismaService) {}

	async findAll() {
		return this.prisma.task.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});
	}

	async findOne(id: string) {
		const task = await this.prisma.task.findUnique({
			where: { id },
		});

		if (!task) {
			throw new NotFoundException("Task not found");
		}

		return task;
	}

	async create(dto: CreateTaskDto) {
		return this.prisma.task.create({
			data: {
				title: dto.title,
				description: dto.description,
			},
		});
	}

	async update(id: string, dto: UpdateTaskDto) {
		await this.findOne(id);

		return this.prisma.task.update({
			where: { id },
			data: {
				title: dto.title,
				description: dto.description,
				completed: dto.completed,
				completedAt:
					dto.completed === undefined
						? undefined
						: dto.completed
							? new Date()
							: null,
			},
		});
	}

	async toggleCompleted(id: string) {
		const task = await this.findOne(id);

		return this.prisma.task.update({
			where: { id },
			data: {
				completed: !task.completed,
				completedAt: task.completed ? null : new Date(),
			},
		});
	}

	async remove(id: string) {
		await this.findOne(id);

		await this.prisma.task.delete({
			where: { id },
		});

		return {
			message: "Task deleted successfully",
		};
	}
}
