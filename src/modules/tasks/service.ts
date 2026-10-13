import { taskInputSchema, type Task, type TaskInput } from "./model";
import { taskRepository, type TaskRepository } from "./repository";

export function createTaskService(repository: TaskRepository) {
  function update(
    task: Task,
    change: Partial<
      Pick<Task, "title" | "dueDate" | "completed" | "deletedAt">
    >,
  ) {
    return repository.commit(task, {
      ...task,
      ...change,
      version: task.version + 1,
      updatedAt: new Date().toISOString(),
    });
  }
  return {
    create(input: TaskInput) {
      const at = new Date().toISOString();
      return repository.commit(null, {
        id: crypto.randomUUID(),
        ...taskInputSchema.parse(input),
        completed: false,
        deletedAt: null,
        version: 1,
        createdAt: at,
        updatedAt: at,
      });
    },
    toggle: (task: Task) => update(task, { completed: !task.completed }),
    edit: (task: Task, input: TaskInput) =>
      update(task, taskInputSchema.parse(input)),
    remove: (task: Task) =>
      update(task, { deletedAt: new Date().toISOString() }),
  };
}
export const taskService = createTaskService(taskRepository);
