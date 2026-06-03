import React, { useState } from "react";
import { Plus } from "lucide-react";

interface AddColumnFormProps {
  handleAddColumn: (title: string) => void;
}

export default function AddColumnForm({ handleAddColumn }: AddColumnFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    handleAddColumn(title);
    setTitle("");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="bg-surface-container-low p-4 rounded-xl border border-outline border-dashed space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nhập tiêu đề cột (ví dụ: Đang duyệt...)"
          className="w-full p-2.5 bg-surface-container-lowest border border-outline border-variant rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
          required
          autoFocus
        />
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-[10px] font-bold text-on-surface-variant hover:underline cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="bg-primary hover:bg-opacity-90 active:scale-98 text-on-primary text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            Thêm cột
          </button>
        </div>
      </form>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="w-full py-5 bg-surface-container-low/40 hover:bg-surface-container-low/80 text-on-surface-variant hover:text-primary border-2 border-dashed border-outline-variant hover:border-primary-container text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all text-center cursor-pointer min-h-[140px]"
    >
      <Plus className="h-5 w-5 text-primary" />
      <span>Thêm cột mới</span>
    </button>
  );
}
