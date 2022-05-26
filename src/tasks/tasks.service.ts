import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

const findById = (tasks, id) => tasks.find((task) => task.id === id);

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilter(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase())
          ? true
          : false,
      );
    }

    return tasks;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  getTaskById(id: string): Task {
    return findById(this.tasks, id);
  }

  deleteTask(id: string): Task[] {
    this.tasks = this.tasks.filter((task) => task.id !== id);

    return this.tasks;
  }

  updateStatus(id: string, status: string): Task[] {
    const task = findById(this.tasks, id);

    task.status = TaskStatus[status];

    return this.tasks;
  }

  updateTask(updateTaskDto: UpdateTaskDto, status: string): Task[] {
    const { id, title, description } = updateTaskDto;

    const task = findById(this.tasks, id);

    task.title = title;

    task.description = description;

    task.status = TaskStatus[status];

    return this.tasks;
  }
}
