import React from "react";
import { Clock, Star, Trash2, User as UserIcon, Users as UsersIcon, Plus } from "lucide-react";
import { Board } from "../types";

interface BoardsOverviewProps {
  recentBoards: Board[];
  filteredBoards: Board[];
  handleSelectBoard: (boardId: string) => void;
  handleToggleFavorite: (e: React.MouseEvent, board: Board) => void;
  handleDeleteBoard: (boardId: string) => void;
  setShowCreateModal: (show: boolean) => void;
}

export default function BoardsOverview({
  recentBoards,
  filteredBoards,
  handleSelectBoard,
  handleToggleFavorite,
  handleDeleteBoard,
  setShowCreateModal
}: BoardsOverviewProps) {
  return (
    <div className="space-y-10 animate-fade-in">
      <section>
        <div className="flex items-center gap-2 mb-6 text-on-surface">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold tracking-tight">Đã xem gần đây</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentBoards.length === 0 ? (
            <div className="col-span-full border border-dashed border-outline-variant rounded-xl p-8 text-center text-on-surface-variant text-xs">
              Chưa có dự án nào được mở xem gần đây trong phiên này.
            </div>
          ) : (
            recentBoards.map((board) => (
              <div
                key={`recent-${board.id}`}
                onClick={() => handleSelectBoard(board.id)}
                className={`group relative h-32 rounded-xl bg-gradient-to-br ${board.bgGradient} shadow-sm border border-outline-variant overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="absolute inset-0 bg-white/40 group-hover:bg-transparent transition-all"></div>
                <div className="relative h-full flex flex-col justify-between p-4 z-10">
                  <div className="flex justify-between items-start gap-1">
                    <h3 className="font-semibold text-sm text-on-surface line-clamp-2 leading-tight">
                      {board.title}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0 bg-white/40 rounded-lg p-0.5 backdrop-blur-xs">
                      <button
                        onClick={(e) => handleToggleFavorite(e, board)}
                        className={`text-on-surface-variant hover:text-amber-500 transition-colors ${board.isFavorite ? "text-amber-500 fill-amber-500" : ""}`}
                        title="Ghim yêu thích"
                      >
                        <Star className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBoard(board.id);
                        }}
                        className="text-on-surface-variant hover:text-red-600 transition-colors p-0.5"
                        title="Xóa bảng"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <span className="text-[10px] text-on-surface-variant bg-white/60 px-2 py-0.5 rounded-full inline-block w-fit backdrop-blur-xs font-semibold">
                    {board.type === "personal" ? "Cá nhân" : "Nhóm dự án"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <UserIcon className="h-5 w-5 text-primary animate-pulse" />
          <h2 className="text-xl font-bold tracking-tight text-on-surface">Bảng Cá Nhân</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBoards.filter(b => !b.members || b.members.length <= 1).map((board) => (
            <div
              key={board.id}
              onClick={() => handleSelectBoard(board.id)}
              className={`group relative h-32 rounded-xl bg-gradient-to-br ${board.bgGradient} shadow-sm border border-outline-variant overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}
            >
              <div className="absolute inset-0 bg-white/30 group-hover:bg-transparent transition-all"></div>
              <div className="relative h-full flex flex-col p-4 justify-between z-10">
                <div className="flex justify-between items-start gap-1">
                  <h3 className="font-semibold text-sm text-on-surface line-clamp-2 leading-tight">
                    {board.title}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0 bg-white/40 rounded-lg p-0.5 backdrop-blur-xs">
                    <button
                      onClick={(e) => handleToggleFavorite(e, board)}
                      className={`text-on-surface-variant hover:text-amber-500 transition-colors ${board.isFavorite ? "text-amber-500 fill-amber-500" : ""}`}
                      title="Ghim yêu thích"
                    >
                      <Star className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBoard(board.id);
                      }}
                      className="text-on-surface-variant hover:text-red-600 transition-colors p-0.5"
                      title="Xóa bảng"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <span className="px-2 py-0.5 bg-white/60 text-[10px] text-on-surface-variant rounded-full font-semibold backdrop-blur-xs">
                    {board.type === "personal" ? "Cá nhân" : "Nhóm dự án"}
                  </span>
                  <span className="text-[10px] text-on-surface-variant bg-black/5 px-1.5 py-0.5 rounded">
                    {board.lists?.reduce((acc, l) => acc + l.tasks.length, 0) || 0} thẻ việc
                  </span>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => setShowCreateModal(true)}
            className="group relative h-32 rounded-xl bg-surface-container-low border-2 border-dashed border-outline-variant hover:border-primary-container hover:bg-primary-fixed hover:bg-opacity-10 transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-surface-container-high group-hover:bg-primary text-on-surface-variant group-hover:text-on-primary flex items-center justify-center transition-colors">
              <Plus className="h-5 w-5" />
            </div>
            <span className="font-semibold text-xs text-on-surface-variant group-hover:text-primary transition-colors">
              Tạo bảng mới
            </span>
          </button>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <UsersIcon className="h-5 w-5 text-primary animate-pulse" />
          <h2 className="text-xl font-bold tracking-tight text-on-surface">Bảng Nhóm</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBoards.filter(b => b.members && b.members.length > 1).map((board) => (
            <div
              key={board.id}
              onClick={() => handleSelectBoard(board.id)}
              className={`group relative h-32 rounded-xl bg-gradient-to-br ${board.bgGradient} shadow-sm border border-outline-variant overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}
            >
              <div className="absolute inset-0 bg-white/30 group-hover:bg-transparent transition-all"></div>
              <div className="relative h-full flex flex-col p-4 justify-between z-10">
                <div className="flex justify-between items-start gap-1">
                  <h3 className="font-semibold text-sm text-on-surface line-clamp-2 leading-tight">
                    {board.title}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0 bg-white/40 rounded-lg p-0.5 backdrop-blur-xs">
                    <button
                      onClick={(e) => handleToggleFavorite(e, board)}
                      className={`text-on-surface-variant hover:text-amber-500 transition-colors ${board.isFavorite ? "text-amber-500 fill-amber-500" : ""}`}
                      title="Ghim yêu thích"
                    >
                      <Star className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBoard(board.id);
                      }}
                      className="text-on-surface-variant hover:text-red-600 transition-colors p-0.5"
                      title="Xóa bảng"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex gap-1 items-center">
                    <span className="px-2 py-0.5 bg-white/60 text-[10px] text-on-surface-variant rounded-full font-semibold backdrop-blur-xs">
                      Nhóm dự án
                    </span>
                    <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] rounded-full font-semibold">
                      {board.members?.length} TV
                    </span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant bg-black/5 px-1.5 py-0.5 rounded">
                    {board.lists?.reduce((acc, l) => acc + l.tasks.length, 0) || 0} thẻ việc
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
