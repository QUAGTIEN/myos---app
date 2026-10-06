import {
  emptyProjectInput,
  itemInputSchema,
  projectInputSchema,
  type ItemInput,
  type Project,
  type ProjectInput,
} from "./model";
import { localProjectRepository, type ProjectRepository } from "./repository";

function history(message: string) {
  return { id: crypto.randomUUID(), message, at: new Date().toISOString() };
}

export function createProjectService(repository: ProjectRepository) {
  function update(
    project: Project,
    message: string,
    change: (current: Project) => Project,
    allowArchived = false,
  ) {
    return repository.update(project.id, project.version, (current) => {
      if (current.archivedAt && !allowArchived)
        throw new Error("Khôi phục dự án trước khi chỉnh sửa.");
      return {
        ...change(current),
        version: current.version + 1,
        updatedAt: new Date().toISOString(),
        updates: [history(message), ...current.updates].slice(0, 100),
      };
    });
  }
  return {
    async create(input: ProjectInput) {
      const parsed = projectInputSchema.parse(input);
      const at = new Date().toISOString();
      return repository.create({
        ...emptyProjectInput,
        ...parsed,
        id: crypto.randomUUID(),
        schemaVersion: 1,
        version: 1,
        createdAt: at,
        updatedAt: at,
        archivedAt: null,
        pinned: false,
        items: [],
        updates: [history("Đã tạo dự án.")],
        relatedNoteIds: [],
        relatedEventIds: [],
      });
    },
    edit(project: Project, input: ProjectInput) {
      const parsed = projectInputSchema.parse(input);
      return update(
        project,
        "Đã cập nhật nội dung và thiết lập dự án.",
        (current) => ({ ...current, ...parsed }),
      );
    },
    togglePin(project: Project) {
      return update(
        project,
        project.pinned ? "Đã bỏ ghim dự án." : "Đã ghim dự án.",
        (current) => ({ ...current, pinned: !current.pinned }),
        true,
      );
    },
    toggleArchive(project: Project) {
      return update(
        project,
        project.archivedAt
          ? "Đã khôi phục dự án khỏi lưu trữ."
          : "Đã lưu trữ dự án.",
        (current) => ({
          ...current,
          archivedAt: current.archivedAt ? null : new Date().toISOString(),
        }),
        true,
      );
    },
    addItem(project: Project, input: ItemInput) {
      const parsed = itemInputSchema.parse(input);
      if (project.archivedAt)
        throw new Error("Khôi phục dự án trước khi sửa checklist.");
      if (project.items.length >= 200)
        throw new Error("Mỗi dự án hỗ trợ tối đa 200 mục.");
      return update(
        project,
        "Đã thêm " +
          (parsed.kind === "milestone" ? "cột mốc: " : "mục: ") +
          parsed.title,
        (current) => ({
          ...current,
          items: [
            ...current.items,
            { ...parsed, id: crypto.randomUUID(), completed: false },
          ],
        }),
      );
    },
    editItem(project: Project, itemId: string, input: ItemInput) {
      const parsed = itemInputSchema.parse(input);
      if (!project.items.some((item) => item.id === itemId))
        throw new Error("Không tìm thấy mục.");
      return update(project, "Đã sửa mục: " + parsed.title, (current) => ({
        ...current,
        items: current.items.map((item) =>
          item.id === itemId ? { ...item, ...parsed } : item,
        ),
      }));
    },
    toggleItem(project: Project, itemId: string) {
      const item = project.items.find((item) => item.id === itemId);
      if (!item) throw new Error("Không tìm thấy mục.");
      return update(
        project,
        (item.completed ? "Đã mở lại: " : "Đã hoàn thành: ") + item.title,
        (current) => ({
          ...current,
          items: current.items.map((value) =>
            value.id === itemId
              ? { ...value, completed: !value.completed }
              : value,
          ),
        }),
      );
    },
    removeItem(project: Project, itemId: string) {
      const item = project.items.find((item) => item.id === itemId);
      if (!item) throw new Error("Không tìm thấy mục.");
      return update(project, "Đã xóa mục: " + item.title, (current) => ({
        ...current,
        items: current.items.filter((value) => value.id !== itemId),
      }));
    },
    moveItem(project: Project, itemId: string, direction: -1 | 1) {
      return update(project, "Đã đổi thứ tự checklist.", (current) => {
        const index = current.items.findIndex((item) => item.id === itemId);
        const target = index + direction;
        if (index < 0 || target < 0 || target >= current.items.length)
          throw new Error("Không thể đổi vị trí mục.");
        const items = [...current.items];
        [items[index], items[target]] = [items[target], items[index]];
        return { ...current, items };
      });
    },
  };
}

export const projectService = createProjectService(localProjectRepository);
