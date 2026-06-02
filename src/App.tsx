/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Settings as SettingsIcon,
  Calendar as CalendarIcon,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Plus,
  Star,
  Clock,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Tag,
  AlertCircle,
  FolderLock,
  PlusCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Database,
  Home,
  Users as UsersIcon
} from "lucide-react";
import { Board, List, Task, User } from "./types";
import LoginView from "./components/LoginView";
import KanbanColumn from "./components/KanbanColumn";
import NewsFeedView from "./components/NewsFeedView";

type CurrentPage = "feed" | "boards" | "settings";

interface AddColumnFormProps {
  handleAddColumn: (title: string) => void;
}

function AddColumnForm({ handleAddColumn }: AddColumnFormProps) {
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

export default function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("se104_token")
  );
  const [user, setUser] = useState<User | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [currentPage, setCurrentPage] = useState<CurrentPage>("feed");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem("sidebar_collapsed") === "true";
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar_collapsed", String(next));
      return next;
    });
  };
  
  // Search query maps to boards or tasks inside boards
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals / Dropdowns / New Board Creation
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [newBoardDesc, setNewBoardDesc] = useState("");
  const [newBoardType, setNewBoardType] = useState<"personal" | "team">("personal");
  const [newBoardGradient, setNewBoardGradient] = useState("from-primary-fixed-dim to-surface-container-lowest");

  // Notifications simulation
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Bạn đã được thêm vào dự án Đồ Án Cuối Kỳ", read: false },
    { id: 2, text: "Nhắc nhở: Nhiệm vụ 'Viết báo cáo chương 1 & 2' sắp đến hạn", read: false }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Gradient presets for creating exciting boards
  const GRADIENTS = [
    { name: "Sắc đỏ ấm áp (Đồ án)", value: "from-error-container to-surface-container-lowest" },
    { name: "Xanh ngọc dịu nhẹ (Marketing)", value: "from-[#cce8e4] to-surface-container-lowest" },
    { name: "Xanh dương trẻ trung (Công việc)", value: "from-primary-fixed-dim to-surface-container-lowest" },
    { name: "Cam san hô rực rỡ (Học tập)", value: "from-tertiary-fixed-dim to-surface-container-lowest" },
    { name: "Xám tối giản (UI/UX)", value: "from-surface-variant to-surface-container-lowest" },
    { name: "Tím mộng mơ (Content)", value: "from-[#e9d5ff] to-surface-container-lowest" }
  ];

  // Load User and Boards if authenticated
  useEffect(() => {
    if (token) {
      fetchUserAndBoards();
    }
  }, [token]);

  const fetchUserAndBoards = async () => {
    setLoading(true);
    try {
      // 1. Fetch current user
      const userRes = await fetch("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (userRes.status === 401) {
        handleLogout();
        return;
      }
      const userData = await userRes.json();
      setUser(userData.user);

      // 2. Fetch boards
      const boardsRes = await fetch("/api/boards", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const boardsData = await boardsRes.json();
      setBoards(boardsData.boards || []);
    } catch (err) {
      console.error("Lỗi đồng bộ dữ liệu:", err);
      setError("Không thể tải cấu hình dự án của bạn từ hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (newToken: string, loggedUser: User) => {
    localStorage.setItem("se104_token", newToken);
    setToken(newToken);
    setUser(loggedUser);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      // Ignore network errors
    }
    localStorage.removeItem("se104_token");
    setToken(null);
    setUser(null);
    setSelectedBoard(null);
    setCurrentPage("boards");
  };

  // Select board and fetch detailed lists/tasks
  const handleSelectBoard = async (boardId: string) => {
    try {
      const response = await fetch(`/api/boards/${boardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setSelectedBoard(data.board);
        setCurrentPage("boards");
        // Update local boards viewed state safely
        setBoards(prev =>
          prev.map(b => (b.id === boardId ? { ...b, lastViewedAt: new Date().toISOString() } : b))
        );
      } else {
        setError(data.error || "Không thể tải chi tiết bảng.");
      }
    } catch {
      setError("Mất kết nối máy chủ bảo mật.");
    }
  };

  // Star Toggle
  const handleToggleFavorite = async (e: React.MouseEvent, board: Board) => {
    e.stopPropagation();
    const updatedStatus = !board.isFavorite;

    try {
      const response = await fetch(`/api/boards/${board.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isFavorite: updatedStatus }),
      });
      if (response.ok) {
        setBoards(prev =>
          prev.map(b => (b.id === board.id ? { ...b, isFavorite: updatedStatus } : b))
        );
        if (selectedBoard && selectedBoard.id === board.id) {
          setSelectedBoard(prev => prev ? { ...prev, isFavorite: updatedStatus } : null);
        }
      }
    } catch {
      setError("Không thể thiết lập trạng thái yêu thích.");
    }
  };

  // Create new board
  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;

    try {
      const response = await fetch("/api/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newBoardTitle,
          bgGradient: newBoardGradient,
          type: newBoardType,
          description: newBoardDesc,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setBoards(prev => [...prev, data.board]);
        setSelectedBoard(data.board);
        setShowCreateModal(false);
        setNewBoardTitle("");
        setNewBoardDesc("");
      } else {
        setError(data.error);
      }
    } catch {
      setError("Lỗi tạo mới bảng.");
    }
  };

  // Save current board structure (when task is moved, added, or deleted)
  const saveBoardStructure = async (updatedBoard: Board) => {
    try {
      await fetch(`/api/boards/${updatedBoard.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lists: updatedBoard.lists }),
      });
    } catch (err) {
      console.error("Lỗi đồng bộ cấu trúc bảng lên cơ sở dữ liệu:", err);
    }
  };

  // Task operation: Add Task
  const handleAddTask = (listId: string, taskTitle: string, priority: "low" | "medium" | "high", label?: string) => {
    if (!selectedBoard || !taskTitle.trim()) return;

    const newTask: Task = {
      id: `task-${Math.random().toString(36).substring(2, 9)}`,
      title: taskTitle,
      description: "",
      priority,
      label: label || "Dự án"
    };

    const updatedLists = selectedBoard.lists?.map((list: List) => {
      if (list.id === listId) {
        return { ...list, tasks: [...list.tasks, newTask] };
      }
      return list;
    });

    const updatedBoard = { ...selectedBoard, lists: updatedLists };
    setSelectedBoard(updatedBoard);
    saveBoardStructure(updatedBoard);
  };

  // List operation: Add new column (List)
  const handleAddList = (listTitle: string) => {
    if (!selectedBoard || !listTitle.trim()) return;

    const newList: List = {
      id: `list-${Math.random().toString(36).substring(2, 9)}`,
      title: listTitle,
      tasks: []
    };

    const updatedLists = [...(selectedBoard.lists || []), newList];
    const updatedBoard = { ...selectedBoard, lists: updatedLists };
    setSelectedBoard(updatedBoard);
    saveBoardStructure(updatedBoard);
  };

  // List operation: Delete column (List)
  const handleDeleteList = (listId: string) => {
    if (!selectedBoard) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa tất cả thẻ công việc và cột này không?")) return;

    const updatedLists = selectedBoard.lists?.filter(l => l.id !== listId) || [];
    const updatedBoard = { ...selectedBoard, lists: updatedLists };
    setSelectedBoard(updatedBoard);
    saveBoardStructure(updatedBoard);
  };

  // Task operation: Move Task across lists
  const handleMoveTask = (taskId: string, targetListId: string) => {
    if (!selectedBoard) return;

    // Find the task inside lists
    let foundTask: Task | null = null;
    let originListId = "";

    selectedBoard.lists?.forEach((list: List) => {
      const t = list.tasks.find(tk => tk.id === taskId);
      if (t) {
        foundTask = t;
        originListId = list.id;
      }
    });

    if (!foundTask || originListId === targetListId) return;

    // Remove from origin, add to target list
    const updatedLists = selectedBoard.lists?.map((list: List) => {
      if (list.id === originListId) {
        return { ...list, tasks: list.tasks.filter(tk => tk.id !== taskId) };
      }
      if (list.id === targetListId) {
        return { ...list, tasks: [...list.tasks, foundTask!] };
      }
      return list;
    });

    const updatedBoard = { ...selectedBoard, lists: updatedLists };
    setSelectedBoard(updatedBoard);
    saveBoardStructure(updatedBoard);
  };

  // Task operation: Edit/Update task details
  const handleUpdateTaskDetails = (listId: string, taskId: string, updates: Partial<Task>) => {
    if (!selectedBoard) return;

    const updatedLists = selectedBoard.lists?.map((list: List) => {
      if (list.id === listId) {
        return {
          ...list,
          tasks: list.tasks.map(t => (t.id === taskId ? { ...t, ...updates } : t))
        };
      }
      return list;
    });

    const updatedBoard = { ...selectedBoard, lists: updatedLists };
    setSelectedBoard(updatedBoard);
    saveBoardStructure(updatedBoard);
  };

  // Task operation: Delete task
  const handleDeleteTask = (listId: string, taskId: string) => {
    if (!selectedBoard) return;

    const updatedLists = selectedBoard.lists?.map((list: List) => {
      if (list.id === listId) {
        return { ...list, tasks: list.tasks.filter(t => t.id !== taskId) };
      }
      return list;
    });

    const updatedBoard = { ...selectedBoard, lists: updatedLists };
    setSelectedBoard(updatedBoard);
    saveBoardStructure(updatedBoard);
  };

  // Board operation: Delete Board
  const handleDeleteBoard = async (boardId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn bảng công việc này?")) {
      return;
    }
    try {
      const response = await fetch(`/api/boards/${boardId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setBoards(prev => prev.filter(b => b.id !== boardId));
        setSelectedBoard(null);
      }
    } catch {
      setError("Không thể xóa bảng.");
    }
  };

  // Star Task simulation and other mock stats
  const totalTasks = boards.reduce((acc, b) => acc + (b.lists?.reduce((lAcc, l) => lAcc + l.tasks.length, 0) || 0), 0);

  // Filtered boards for the main dashboard search
  const filteredBoards = boards.filter(b => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return true;
    
    // Search in board titles
    if (b.title.toLowerCase().includes(term)) return true;
    // Search in tasks titles inside this board
    const hasMatchingTask = b.lists?.some(l => l.tasks.some(t => t.title.toLowerCase().includes(term)));
    return hasMatchingTask;
  });

  // Calculate high-key lists of recent and personal boards
  const recentBoards = [...boards]
    .filter(b => b.lastViewedAt)
    .sort((a, b) => new Date(b.lastViewedAt!).getTime() - new Date(a.lastViewedAt!).getTime())
    .slice(0, 2);

  const personalBoards = boards.filter(b => b.type === "personal");
  const teamBoards = boards.filter(b => b.type === "team");

  // Auth Protection guard
  if (!token) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface text-on-surface antialiased font-sans">
      
      {/* 1. SIDE NAVIGATION BAR */}
      <nav
        id="sidebar_nav"
        className={`h-full shrink-0 flex flex-col justify-between py-6 bg-surface-container-lowest border-r border-outline-variant shadow-sm z-50 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "w-[72px] px-2" : "w-[260px] px-4"
        }`}
      >
        <div>
          {/* Header Branding */}
          <div className={`mb-8 flex ${isSidebarCollapsed ? "flex-col items-center gap-3 px-1" : "items-center justify-between gap-2 px-3"}`}>
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-10 h-10 shrink-0 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg shadow-sm">
                S
              </div>
              {!isSidebarCollapsed && (
                <div className="min-w-0">
                  <h1 className="font-semibold text-base text-primary leading-none mb-1 truncate">
                    SE104.Q28
                  </h1>
                  <p className="text-xs text-on-surface-variant font-medium truncate">
                    Project Management
                  </p>
                </div>
              )}
            </div>
            
            <button
              onClick={toggleSidebar}
              className={`p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all duration-200 cursor-pointer ${isSidebarCollapsed ? "w-9 h-9 flex items-center justify-center mt-1" : ""}`}
              title={isSidebarCollapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="h-4.5 w-4.5" />
              ) : (
                <ChevronLeft className="h-4.5 w-4.5" />
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-1.5">
            <button
              id="tab_feed"
              onClick={() => {
                setSelectedBoard(null);
                setCurrentPage("feed");
              }}
              title={isSidebarCollapsed ? "Trang chủ" : undefined}
              className={`flex items-center gap-3 py-3 rounded-lg font-semibold text-sm transition-all text-left ${
                currentPage === "feed" && !selectedBoard
                  ? "bg-primary-container text-on-primary-container scale-98"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              } ${isSidebarCollapsed ? "justify-center px-0 w-11 mx-auto" : "px-4"}`}
            >
              <Home className="h-5 w-5 shrink-0" />
              {!isSidebarCollapsed && <span>Trang chủ</span>}
            </button>

            <button
              id="tab_boards"
              onClick={() => {
                setSelectedBoard(null);
                setCurrentPage("boards");
              }}
              title={isSidebarCollapsed ? "Bảng công việc" : undefined}
              className={`flex items-center gap-3 py-3 rounded-lg font-semibold text-sm transition-all text-left ${
                currentPage === "boards" && !selectedBoard
                  ? "bg-primary-container text-on-primary-container scale-98"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              } ${isSidebarCollapsed ? "justify-center px-0 w-11 mx-auto" : "px-4"}`}
            >
              <LayoutDashboard className="h-5 w-5 shrink-0" />
              {!isSidebarCollapsed && <span>Bảng công việc</span>}
            </button>

            <button
              id="tab_settings"
              onClick={() => {
                setSelectedBoard(null);
                setCurrentPage("settings");
              }}
              title={isSidebarCollapsed ? "Cài đặt hệ thống" : undefined}
              className={`flex items-center gap-3 py-3 rounded-lg font-semibold text-sm transition-all text-left ${
                currentPage === "settings"
                  ? "bg-primary-container text-on-primary-container scale-98"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              } ${isSidebarCollapsed ? "justify-center px-0 w-11 mx-auto" : "px-4"}`}
            >
              <SettingsIcon className="h-5 w-5 shrink-0" />
              {!isSidebarCollapsed && <span>Cài đặt hệ thống</span>}
            </button>
          </div>
        </div>

        {/* Footer / User Profile & Logout */}
        <div className={`border-t border-outline-variant pt-4 flex flex-col gap-2.5 ${isSidebarCollapsed ? "items-center" : ""}`}>
          <div className={`flex items-center gap-3 py-1.5 ${isSidebarCollapsed ? "px-0 justify-center" : "px-4"}`} title={isSidebarCollapsed ? user?.fullName : undefined}>
            <div className="w-9 h-9 shrink-0 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
              {user?.fullName?.charAt(0) || "U"}
            </div>
            {!isSidebarCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-on-surface truncate leading-tight">
                  {user?.fullName || "Người dùng"}
                </p>
                <p className="text-[10px] text-on-surface-variant truncate">
                  {user?.email || "se104@vn.edu"}
                </p>
              </div>
            )}
          </div>

          <button
            id="btn_logout"
            onClick={handleLogout}
            title={isSidebarCollapsed ? "Đăng xuất" : undefined}
            className={`bg-error-container text-on-error-container font-semibold text-xs py-2 rounded-lg hover:bg-error hover:text-on-error transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
              isSidebarCollapsed ? "px-0 w-10 h-10 rounded-full mx-auto" : "px-4 w-full"
            }`}
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            {!isSidebarCollapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </nav>

      {/* 2. CHIEF CONTENT CONTAINER WITH TOP NAV-BAR */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* TOP INTERACTIVE NAVBAR */}
        <header className="h-[64px] shrink-0 flex justify-between items-center px-6 bg-surface-container-lowest border-b border-outline-variant shadow-sm z-40">
          
          {/* Left area: Breadcrumb / Live Search */}
          <div className="flex-1 max-w-md flex items-center gap-4">
            {selectedBoard && (
              <button
                onClick={() => setSelectedBoard(null)}
                className="p-1 px-2.5 hover:bg-surface-container rounded-lg text-primary text-xs font-semibold flex items-center gap-1 border border-outline-variant/60"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Trở lại</span>
              </button>
            )}

            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-surface-container-low border border-outline-variant rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all text-on-surface"
                placeholder="Tìm kiếm bảng nhanh, nội dung thẻ hoặc nhiệm vụ..."
              />
            </div>
          </div>

          {/* Right Area: Alerts & Interactive Avatar Bubble */}
          <div className="flex items-center gap-4 relative">
            
            {/* Quick API status */}
            <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2 py-1 rounded text-[10px] font-semibold border border-emerald-200">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></div>
              <span>API Secure Hoạt động</span>
            </div>

            {/* Notification bell dropdown button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-all flex items-center justify-center relative border border-outline-variant/60"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-lg py-3 z-[100] text-sm">
                  <div className="px-4 pb-2 border-b border-outline-variant flex justify-between items-center">
                    <span className="font-bold text-xs text-on-surface uppercase tracking-wider">Thông báo dự án</span>
                    <button onClick={() => setNotifications([])} className="text-[10px] text-primary hover:underline">Xóa tất cả</button>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-xs text-center text-on-surface-variant">Không có thông báo mới.</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="p-3 border-b border-outline-variant/30 hover:bg-surface-container-low text-xs text-on-surface transition-all">
                          {n.text}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setCurrentPage("settings")}
              className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-all flex items-center justify-center border border-outline-variant/60"
            >
              <SettingsIcon className="h-4.5 w-4.5" />
            </button>

            {/* User Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-outline-variant">
              <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs cursor-pointer border border-outline-variant">
                {user?.fullName?.charAt(0) || "U"}
              </div>
            </div>
          </div>
        </header>

        {/* 3. WORKING WORKSPACE PANELS */}
        <main className="flex-1 overflow-y-auto p-8 relative bg-surface">
          <div className="max-w-7xl mx-auto">
            
            {/* System top-level warning tracker if any */}
            {error && (
              <div className="mb-6 bg-error-container text-on-error-container p-3 rounded-lg flex justify-between items-center text-xs border border-error/20">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-error" />
                  <span>{error}</span>
                </div>
                <button onClick={() => setError(null)} className="text-[10px] uppercase font-bold tracking-wider hover:opacity-80">Đã biết</button>
              </div>
            )}

            {/* A. NEW FACEBOOK-STYLE HOMEPAGE NEWS FEED PANEL */}
            {currentPage === "feed" && (
              <div className="animate-fade-in">
                <NewsFeedView user={user} token={token} />
              </div>
            )}

            {/* A. VIEW BOARDS WORKSPACE OVERVIEW (Matching exact screenshot structure) */}
            {currentPage === "boards" && !selectedBoard && (
              <div className="space-y-10 animate-fade-in">
                
                {/* SECTION 1: ĐÃ XEM GẦN ĐÂY */}
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
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-sm text-on-surface line-clamp-2 leading-tight">
                                {board.title}
                              </h3>
                              <button
                                onClick={(e) => handleToggleFavorite(e, board)}
                                className={`text-on-surface-variant hover:text-amber-500 transition-colors ${board.isFavorite ? "text-amber-500 fill-amber-500" : ""}`}
                              >
                                <Star className="h-4 w-4" />
                              </button>
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

                {/* SECTION 2: BẢNG CÁ NHÂN & DỰ ÁN */}
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
                            <button
                              onClick={(e) => handleToggleFavorite(e, board)}
                              className={`shrink-0 text-on-surface-variant hover:text-amber-500 transition-colors ${board.isFavorite ? "text-amber-500 fill-amber-500" : ""}`}
                            >
                              <Star className="h-4 w-4" />
                            </button>
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

                    {/* CREATE NEW BOARD CARD TRIGGER */}
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
                            <button
                              onClick={(e) => handleToggleFavorite(e, board)}
                              className={`shrink-0 text-on-surface-variant hover:text-amber-500 transition-colors ${board.isFavorite ? "text-amber-500 fill-amber-500" : ""}`}
                            >
                              <Star className="h-4 w-4" />
                            </button>
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
            )}

            {/* B. DETAILED BOARD VIEW (KANBAN WORKSPACE) */}
            {currentPage === "boards" && selectedBoard && (
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

                    {selectedBoard.owner === user?.email && (
                      <button
                        onClick={() => handleDeleteBoard(selectedBoard.id)}
                        className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all text-left cursor-pointer border border-red-200"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Xóa bảng</span>
                      </button>
                    )}
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
                      />
                    </div>
                  ))}
                  
                  {/* Add Column Button Form */}
                  <div className="w-full md:w-80 shrink-0">
                    <AddColumnForm handleAddColumn={handleAddList} />
                  </div>
                </div>
              </div>
            )}

            {/* D. SYSTEM SETTINGS PANEL VIEW */}
            {currentPage === "settings" && (
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-8 animate-fade-in text-on-surface">
                
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-on-surface">Cài đặt hệ thống SE104.Q28</h2>
                  <p className="text-xs text-on-surface-variant mt-1">Cấu hình người dùng, dữ liệu bảo mật và quản lý hệ thống lưu trữ dự án.</p>
                </div>

                {/* Sub setting section 1: Member Profile */}
                <div className="border-t border-outline-variant/60 pt-6 space-y-4">
                  <h3 className="font-bold text-sm flex items-center gap-1.5 text-primary">
                    <UserIcon className="h-4.5 w-4.5" />
                    <span>Thông tin cá nhân & Quản trị viên</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Họ và tên</label>
                      <input
                        type="text"
                        disabled
                        value={user?.fullName || "Khoa Lão Tứ"}
                        className="w-full p-2 bg-surface-container border border-outline-variant rounded-lg text-xs text-on-surface cursor-not-allowed opacity-80"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Email truy cập</label>
                      <input
                        type="email"
                        disabled
                        value={user?.email || "khoalaotu40@gmail.com"}
                        className="w-full p-2 bg-surface-container border border-outline-variant rounded-lg text-xs text-on-surface cursor-not-allowed opacity-80"
                      />
                    </div>
                  </div>
                </div>

                {/* Sub setting section 2: Database health check status */}
                <div className="border-t border-outline-variant/60 pt-6 space-y-4">
                  <h3 className="font-bold text-sm flex items-center gap-1.5 text-primary">
                    <Database className="h-4.5 w-4.5" />
                    <span>Hệ thống dự liệu & File db.json</span>
                  </h3>
                  <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/65 text-xs text-on-surface-variant leading-relaxed space-y-2">
                    <p className="font-bold text-on-surface flex items-center gap-1">
                      <Sparkles className="h-4 w-4 text-amber-500 animate-spin" />
                      <span>Cơ sở dữ liệu: Hoạt động toàn diện</span>
                    </p>
                    <p>Ứng dụng đã được cấu hình lưu trữ dữ liệu vĩnh viễn và tự động đồng bộ hóa thông tin của người dùng qua file cục bộ máy chủ <code className="font-mono bg-white px-1 py-0.5 rounded border">db.json</code>.</p>
                    <p>Môn học phát triển: <strong className="text-on-surface">SE104.Q28 - Quản lý dự án</strong>.</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* 4. DIALOG / MODAL FOR CREATING NEW BOARD */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline rounded-xl p-6 max-w-lg w-full space-y-6 shadow-xl animate-scale-up">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <FolderLock className="h-5 w-5" />
                <span>Tạo mới bảng quản lý công việc</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-on-surface-variant hover:text-on-surface text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBoard} className="space-y-4">
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
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none"
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
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none"
                  >
                    {GRADIENTS.map((grade) => (
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
                  onClick={() => setShowCreateModal(false)}
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
      )}

    </div>
  );
}
