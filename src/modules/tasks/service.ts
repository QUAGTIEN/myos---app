import { taskTitleSchema, type Task } from "./model";
import { taskRepository, type TaskRepository } from "./repository";

export function createTaskService(repository: TaskRepository) {
  function update(
    task: Task,
    change: Partial<Pick<Task, "title" | "completed" | "deletedAt">>,
  ) {
    return repository.commit(task, {
      ...task,
      ...change,
      version: task.version + 1,
      updatedAt: new Date().toISOString(),
    });
  }
  return {
    create(title: string) {
      const at = new Date().toISOString();
      return repository.commit(null, {
        id: crypto.randomUUID(),
        title: taskTitleSchema.parse(title),
        completed: false,
        deletedAt: null,
        version: 1,
        createdAt: at,
        updatedAt: at,
      });
    },
    toggle: (task: Task) => update(task, { completed: !task.completed }),
    rename: (task: Task, title: string) =>
      update(task, { title: taskTitleSchema.parse(title) }),
    remove: (task: Task) =>
      update(task, { deletedAt: new Date().toISOString() }),
  };
}
export const taskService = createTaskService(taskRepository);
