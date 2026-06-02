/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Trash2, Tag, PlusCircle } from "lucide-react";
import { Board, List, Task } from "../types";

interface KanbanColumnProps {
  key?: string;
  list: List;
  selectedBoard: Board | null;
  handleAddTask: (listId: string, taskTitle: string, priority: "low" | "medium" | "high", label?: string) => void;
  handleDeleteTask: (listId: string, taskId: string) => void;
  handleMoveTask: (taskId: string, targetListId: string) => void;
  handleDeleteColumn?: (listId: string) => void;
}

export default function KanbanColumn({
  list,
  selectedBoard,
  handleAddTask,
  handleDeleteTask,
  handleMoveTask,
  handleDeleteColumn
}: KanbanColumnProps) {
  if (!selectedBoard) return null;

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [newTaskLabel, setNewTaskLabel] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const submitNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    handleAddTask(list.id, newTaskTitle, newTaskPriority, newTaskLabel);
    setNewTaskTitle("");
    setNewTaskLabel("");
    setShowAddForm(false);
  };

  return (
    <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/80 flex flex-col max-h-[700px]">
      {/* List Column Title */}
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-outline-variant/60">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-on-surface">
            {list.title}
          </span>
          <span className="px-1.5 py-0.5 bg-surface-container-high text-on-surface-variant text-[10px] font-bold rounded">
            {list.tasks.length}
          </span>
        </div>
        
        {handleDeleteColumn && (
          <button
            onClick={() => handleDeleteColumn(list.id)}
            className="text-on-surface-variant hover:text-red-500 transition-colors p-1 rounded-md hover:bg-surface-container-high cursor-pointer"
            title="Xóa cột này"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Tasks list within column */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 max-h-[500px]">
        {list.tasks.length === 0 ? (
          <div className="py-8 text-center text-[11px] text-on-surface-variant border border-dashed border-outline-variant/50 rounded-lg">
            Chưa có đầu lịch công việc.
          </div>
        ) : (
          list.tasks.map((task: Task) => (
            <div
              key={task.id}
              className="group bg-surface-container-lowest p-3.5 rounded-lg border border-outline-variant shadow-xs hover:shadow-sm hover:border-outline transition-all"
            >
              <div className="flex justify-between items-start gap-1 mb-2">
                <h4 className="text-xs font-bold text-on-surface leading-snug">
                  {task.title}
                </h4>
                <button
                  onClick={() => handleDeleteTask(list.id, task.id)}
                  className="opacity-0 group-hover:opacity-100 text-on-surface-variant hover:text-red-600 transition-all p-1 cursor-pointer"
                  title="Xóa đầu việc"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {task.description && (
                  <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-2">
                    {task.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-1.5">
                  {/* Priority marker */}
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                      task.priority === "high"
                        ? "bg-red-50 text-red-600"
                        : task.priority === "medium"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {task.priority === "high" ? "Khẩn" : task.priority === "medium" ? "Trung bình" : "Thấp"}
                  </span>

                  {/* Label flag */}
                  {task.label && (
                    <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-medium flex items-center gap-0.5">
                      <Tag className="h-2 w-2" />
                      <span>{task.label}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Drag-free cross-move controls */}
              <div className="mt-3.5 pt-2 border-t border-outline-variant/40 flex justify-between items-center text-[10px] text-on-surface-variant">
                <span>Di chuyển sang:</span>
                <div className="flex items-center gap-1">
                  {selectedBoard.lists?.filter(l => l.id !== list.id).map(otherList => (
                    <button
                      key={otherList.id}
                      onClick={() => handleMoveTask(task.id, otherList.id)}
                      className="px-1.5 py-0.5 bg-surface-container hover:bg-primary-container hover:text-on-primary-container rounded transition-all text-[9px] font-semibold cursor-pointer"
                    >
                      {otherList.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Interactive Task addition */}
      <div className="mt-4">
        {showAddForm ? (
          <form onSubmit={submitNewTask} className="bg-surface-container-lowest p-3 rounded-lg border border-outline border-dashed space-y-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Tiêu đề việc mới..."
              className="w-full p-2 bg-surface-container-low border border-outline-variant rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
              required
              autoFocus
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={newTaskLabel}
                onChange={(e) => setNewTaskLabel(e.target.value)}
                placeholder="Nhãn (ví dụ: SEO, Báo cáo...)"
                className="w-1/2 p-2 bg-surface-container-low border border-outline-variant rounded-md text-[10px] focus:outline-none text-on-surface"
              />
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as any)}
                className="w-1/2 p-1.5 bg-surface-container-low border border-outline-variant rounded-md text-[10px] text-on-surface"
              >
                <option value="low">Độ ưu tiên: Thấp</option>
                <option value="medium">Độ ưu tiên: TB</option>
                <option value="high">Độ ưu tiên: Khẩn</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="text-[10px] font-bold text-on-surface-variant hover:underline cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="bg-primary text-on-primary text-[10px] font-bold px-3 py-1 rounded cursor-pointer"
              >
                Lưu việc
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-2 bg-surface-container-lowest hover:bg-primary-container hover:text-on-primary-container text-on-surface-variant border border-outline-variant border-dashed text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Thêm thẻ công việc</span>
          </button>
        )}
      </div>
    </div>
  );
}
