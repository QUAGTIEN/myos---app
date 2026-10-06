import { getProjectProgress, type Project } from "../model";

export function ProgressIndicator({ project }: { project: Project }) {
  const progress = getProjectProgress(project);
  const counted = project.items.filter((item) => item.countsTowardProgress);
  return (
    <div className="project-progress">
      <div>
        <span>
          {project.progressMode === "manual"
            ? "Tiến độ thủ công"
            : "Tiến độ checklist"}
        </span>
        <strong>
          {progress === null ? "Chưa có dữ liệu" : progress + "%"}
        </strong>
      </div>
      <div
        role="progressbar"
        aria-label={"Tiến độ " + project.title}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress ?? undefined}
        aria-valuetext={
          progress === null ? "Chưa có mục tính tiến độ" : progress + "%"
        }
        className="project-progress-track"
      >
        <span style={{ width: (progress ?? 0) + "%" }} />
      </div>
      {project.progressMode === "checklist" && (
        <p>
          {counted.length
            ? counted.filter((item) => item.completed).length +
              "/" +
              counted.length +
              " mục tính tiến độ hoàn thành"
            : "Thêm mục được tính tiến độ để bắt đầu."}
        </p>
      )}
    </div>
  );
}
