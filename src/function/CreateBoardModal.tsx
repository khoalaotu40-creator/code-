import React from "react";
import { FolderLock } from "lucide-react";

interface CreateBoardModalProps {
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newBoardTitle: string;
  setNewBoardTitle: (val: string) => void;
  newBoardDesc: string;
  setNewBoardDesc: (val: string) => void;
  newBoardType: "personal" | "team";
  setNewBoardType: (val: "personal" | "team") => void;
  newBoardGradient: string;
  setNewBoardGradient: (val: string) => void;
  gradients: { name: string; value: string }[];
}

export default function CreateBoardModal({
  onClose,
  onSubmit,
  newBoardTitle,
  setNewBoardTitle,
  newBoardDesc,
  setNewBoardDesc,
  newBoardType,
  setNewBoardType,
  newBoardGradient,
  setNewBoardGradient,
  gradients
}: CreateBoardModalProps) {
  return (
    <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest border border-outline rounded-xl p-6 max-w-lg w-full space-y-6 shadow-xl animate-scale-up">
        <div className="flex justify-between items-center border-b border-outline-variant pb-3">
          <h3 className="text-lg font-bold text-primary flex items-center gap-2">
            <FolderLock className="h-5 w-5" />
            <span>Tạo mới bảng quản lý công việc</span>
          </h3>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface text-sm font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1.5">Tên bảng công việc</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Kế Hoạch Xây Dựng Hệ Thống"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1.5">Mô tả tóm tắt</label>
            <textarea
              placeholder="Ghi chú chi tiết về mục tiêu hoặc deadline của dự án này..."
              value={newBoardDesc}
              onChange={(e) => setNewBoardDesc(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary h-20 text-on-surface"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1.5">Phân loại</label>
              <select
                value={newBoardType}
                onChange={(e) => setNewBoardType(e.target.value as any)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none cursor-pointer"
              >
                <option value="personal">🔒 Cá nhân</option>
                <option value="team">👥 Nhóm Dự án (Team)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase mb-1.5">Chủ đề & Màu sắc</label>
              <select
                value={newBoardGradient}
                onChange={(e) => setNewBoardGradient(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none cursor-pointer"
              >
                {gradients.map((grade) => (
                  <option key={grade.value} value={grade.value}>
                    {grade.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-outline-variant">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-outline-variant text-on-surface-variant rounded-lg text-xs font-semibold hover:bg-surface-container-low transition-all cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-on-primary font-semibold rounded-lg text-xs shadow-sm hover:opacity-90 active:scale-98 transition-all flex items-center gap-1 hover:shadow cursor-pointer"
            >
              <span>Hoàn tất & Khởi tạo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
