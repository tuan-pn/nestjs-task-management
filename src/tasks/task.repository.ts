import { Repository, EntityRepository } from 'typeorm';
import { Task } from './models/task.entity';
import { CreateTaskDto, GetTasksFilterDto } from './dto/task.dto';
import { TaskStatus } from './models/task.model';
import { User } from 'src/auth/user.entity';
import { Logger, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task').where(
      'task.userId = :userId',
      { userId: user.id },
    );

    if (status) {
      query.andWhere('task.status = :status', { status: status.toLowerCase() });
    }
    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (err) {
      this.logger.error(`Failed tho get tasks`, err.stack);
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;

    await task.save();
    delete task.user;
    return task;
  }
}
