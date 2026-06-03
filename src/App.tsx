/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
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

import AddColumnForm from "./function/AddColumnForm";
import SettingsView from "./function/SettingsView";
import SidebarNav from "./function/SidebarNav";
import TopNavBar from "./function/TopNavBar";
import CreateBoardModal from "./function/CreateBoardModal";

type CurrentPage = "feed" | "boards" | "settings";

import BoardsOverview from "./function/BoardsOverview";
import BoardDetail from "./function/BoardDetail";

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

      const socket = io();
      
      socket.on("db_changed", () => {
        // Refetch everything when another client modifies the server db
        // To prevent overriding local pending edits immediately, we might just refetch
        // In a real app we'd merge smartly.
        fetchUserAndBoards();
        if (selectedBoard) {
            handleSelectBoard(selectedBoard.id);
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [token, selectedBoard?.id]);

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
      <SidebarNav
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        currentPage={currentPage}
        selectedBoard={selectedBoard}
        user={user}
        onNavigate={(page) => {
          setSelectedBoard(null);
          setCurrentPage(page as CurrentPage);
        }}
        handleLogout={handleLogout}
      />


      {/* 2. CHIEF CONTENT CONTAINER WITH TOP NAV-BAR */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* TOP INTERACTIVE NAVBAR */}
        <TopNavBar
          selectedBoard={selectedBoard}
          onBack={() => setSelectedBoard(null)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          notifications={notifications}
          setNotifications={setNotifications}
          onNavigateSettings={() => setCurrentPage("settings")}
          user={user}
        />


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
                <NewsFeedView user={user} token={token} boards={boards} />
              </div>
            )}

            {/* A. VIEW BOARDS WORKSPACE OVERVIEW */}
            {currentPage === "boards" && !selectedBoard && (
              <BoardsOverview
                recentBoards={recentBoards}
                filteredBoards={filteredBoards}
                handleSelectBoard={handleSelectBoard}
                handleToggleFavorite={handleToggleFavorite}
                handleDeleteBoard={handleDeleteBoard}
                setShowCreateModal={setShowCreateModal}
              />
            )}

            {/* B. DETAILED BOARD VIEW (KANBAN WORKSPACE) */}
            {currentPage === "boards" && selectedBoard && (
              <BoardDetail
                selectedBoard={selectedBoard}
                user={user}
                token={token}
                handleToggleFavorite={handleToggleFavorite}
                handleDeleteBoard={handleDeleteBoard}
                setSelectedBoard={setSelectedBoard}
                setBoards={setBoards}
                handleAddTask={handleAddTask}
                handleDeleteTask={handleDeleteTask}
                handleMoveTask={handleMoveTask}
                handleDeleteList={handleDeleteList}
                handleUpdateTaskDetails={handleUpdateTaskDetails}
                handleAddList={handleAddList}
              />
            )}

            {/* D. SYSTEM SETTINGS PANEL VIEW */}
            {currentPage === "settings" && (
              <SettingsView user={user} token={token} setUser={setUser} />
            )}

          </div>
        </main>
      </div>

      {/* 4. DIALOG / MODAL FOR CREATING NEW BOARD */}
      {showCreateModal && (
        <CreateBoardModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateBoard}
          newBoardTitle={newBoardTitle}
          setNewBoardTitle={setNewBoardTitle}
          newBoardDesc={newBoardDesc}
          setNewBoardDesc={setNewBoardDesc}
          newBoardType={newBoardType}
          setNewBoardType={setNewBoardType}
          newBoardGradient={newBoardGradient}
          setNewBoardGradient={setNewBoardGradient}
          gradients={GRADIENTS}
        />
      )}

    </div>
  );
}
