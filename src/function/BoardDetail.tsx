import React from "react";
import { Star, Trash2, Plus } from "lucide-react";
import { Board, List, User } from "../types";
import KanbanColumn from "../components/KanbanColumn";
import AddColumnForm from "./AddColumnForm";

interface BoardDetailProps {
  selectedBoard: Board;
  user: User | null;
  token: string | null;
  handleToggleFavorite: (e: React.MouseEvent, board: Board) => void;
  handleDeleteBoard: (boardId: string) => void;
  setSelectedBoard: React.Dispatch<React.SetStateAction<Board | null>>;
  setBoards: React.Dispatch<React.SetStateAction<Board[]>>;
  handleAddTask: (listId: string, taskTitle: string, priority: "low" | "medium" | "high", label?: string) => void;
  handleDeleteTask: (listId: string, taskId: string) => void;
  handleMoveTask: (taskId: string, targetListId: string) => void;
  handleDeleteList: (listId: string) => void;
  handleUpdateTaskDetails: (listId: string, taskId: string, updates: any) => void;
  handleAddList: (listTitle: string) => void;
}

export default function BoardDetail({
  selectedBoard,
  user,
  token,
  handleToggleFavorite,
  handleDeleteBoard,
  setSelectedBoard,
  setBoards,
  handleAddTask,
  handleDeleteTask,
  handleMoveTask,
  handleDeleteList,
  handleUpdateTaskDetails,
  handleAddList
}: BoardDetailProps) {
  return (
    <div className="space-y-6 animate-fade-in select-none">
      
      {/* Board Header bar */}
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold tracking-tight text-on-surface">
              {selectedBoard.title}
            </h2>
            <button
              onClick={(e) => handleToggleFavorite(e, selectedBoard)}
              className={`text-on-surface-variant hover:text-amber-500 transition-colors ${selectedBoard.isFavorite ? "text-amber-500 fill-amber-500" : ""}`}
            >
              <Star className="h-5 w-5" />
            </button>
            <span className="px-2 py-0.5 bg-primary-fixed text-on-primary-fixed text-[10px] font-semibold rounded-full uppercase tracking-wider">
              {selectedBoard.type === "personal" ? "Cá nhân" : "Nhóm dự án"}
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1.5 max-w-2xl">
            {selectedBoard.description || "Bảng quản lý quy trình công việc hiệu năng cao của SE104.Q28."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {selectedBoard.owner === user?.email && (
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                const input = (e.currentTarget.elements.namedItem("email") as HTMLInputElement);
                const email = input.value.trim();
                if (!email) return;
                
                try {
                  const res = await fetch(`/api/boards/${selectedBoard.id}/members`, {
                    method: "POST",
                    headers: { 
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ email })
                  });
                  
                  const data = await res.json();
                  if (!res.ok) {
                    alert(data.error || "Thêm thành viên thất bại.");
                    return;
                  }
                  
                  // Rehydrate the board to see new members
                  alert("Thêm thành viên thành công!");
                  input.value = "";
                  const boardRes = await fetch(`/api/boards/${selectedBoard.id}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                  });
                  if (boardRes.ok) {
                    const boardData = await boardRes.json();
                    setSelectedBoard(boardData.board);
                    
                    // Reload global boards list
                    const boardsRes = await fetch("/api/boards", { headers: { Authorization: `Bearer ${token}` } });
                    if (boardsRes.ok) {
                      const boardsData = await boardsRes.json();
                      setBoards(boardsData.boards || []);
                    }
                  }
                } catch (err) {
                  alert("Có lỗi xảy ra, vui lòng thử lại sau.");
                }
              }}
              className="flex items-center gap-2 bg-surface-container-low px-2 py-1.5 rounded-lg border border-outline-variant/60"
            >
              <input 
                type="email" 
                name="email" 
                placeholder="Email nhân sự..." 
                className="bg-transparent text-xs text-on-surface focus:outline-none w-32 md:w-48 placeholder:text-on-surface-variant px-1"
                required 
              />
              <button 
                type="submit" 
                className="text-[10px] font-bold bg-primary text-on-primary px-2.5 py-1.5 rounded-md hover:bg-opacity-90 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-3 w-3" />
                <span>Thêm</span>
              </button>
            </form>
          )}

          <button
            onClick={() => handleDeleteBoard(selectedBoard.id)}
            className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all text-left cursor-pointer border border-red-200"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Xóa bảng</span>
          </button>
        </div>
      </div>

      {/* Interactive Kanban Grid */}
      <div className="flex flex-col md:flex-row gap-6 items-start overflow-x-auto pb-6 scrollbar-thin">
        {selectedBoard.lists?.map((list: List) => (
          <div key={list.id} className="w-full md:w-80 shrink-0">
            <KanbanColumn
              list={list}
              selectedBoard={selectedBoard}
              handleAddTask={handleAddTask}
              handleDeleteTask={handleDeleteTask}
              handleMoveTask={handleMoveTask}
              handleDeleteColumn={handleDeleteList}
              handleUpdateTask={handleUpdateTaskDetails}
            />
          </div>
        ))}
        
        {/* Add Column Button Form */}
        <div className="w-full md:w-80 shrink-0">
          <AddColumnForm handleAddColumn={handleAddList} />
        </div>
      </div>
    </div>
  );
}
