/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Trash2, Tag, PlusCircle, Edit2, X, Calendar, Plus, AlignLeft, Activity, User as UserIcon, Paperclip, Image as ImageIcon, ArrowRight, Copy, Eye, Check, Archive, CheckSquare, Flag, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Board, List, Task } from "../types";

interface EditTaskModalProps {
  task: Task;
  listTitle: string;
  onClose: () => void;
  onSave: (updates: Partial<Task>) => void;
  currentUser?: any;
  boardMembers?: any[];
}

function EditTaskModal({ task, listTitle, onClose, onSave, currentUser, boardMembers }: EditTaskModalProps) {
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(task.priority || "medium");
  const [label, setLabel] = useState(task.label || "");
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [assignee, setAssignee] = useState(task.assignee || null);
  const [activities, setActivities] = useState([...(task.activities || [])]);
  const [commentInput, setCommentInput] = useState("");
  const [showMembers, setShowMembers] = useState(false);

  const [isEditingDesc, setIsEditingDesc] = useState(false);

  // Focus trap workaround
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = () => {
    onSave({
      title,
      description: description.trim(),
      priority,
      label: label.trim() || undefined,
      dueDate: dueDate || undefined,
      assignee: assignee || undefined,
      activities: activities.length > 0 ? activities : undefined
    });
    onClose();
  };

  const handlePostComment = () => {
     if (!commentInput.trim() || !currentUser) return;
     const newAct = {
        id: Date.now().toString(),
        user: { fullName: currentUser.fullName, avatar: currentUser.avatar },
        type: "comment" as const,
        action: commentInput.trim(),
        createdAt: new Date().toISOString()
     };
     setActivities([newAct, ...activities]);
     setCommentInput("");
  };

  const handleAssign = (member: any) => {
     setAssignee(member);
     setShowMembers(false);
     if (currentUser) {
        setActivities([{
          id: Date.now().toString(),
          user: { fullName: currentUser.fullName, avatar: currentUser.avatar },
          type: "system" as const,
          action: `đã phân công việc này cho ${member.fullName}`,
          createdAt: new Date().toISOString()
        }, ...activities]);
     }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 pt-10 sm:pt-20 overflow-y-auto backdrop-blur-sm">
      <div className="bg-surface-container-lowest border border-outline-variant/80 rounded-xl w-full max-w-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-100 flex flex-col mb-10 text-on-surface">
        
        {/* Modal Header */}
        <div className="flex justify-between items-start px-5 sm:px-6 pt-5 pb-2">
          <div className="flex items-start gap-3 w-full">
            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 mt-1 text-on-surface-variant flex-shrink-0" />
            <div className="w-full">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent text-lg sm:text-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 -ml-2 text-on-surface"
              />
              <p className="text-xs text-on-surface-variant mt-1 px-0.5">
                trong danh sách <span className="underline cursor-pointer">{listTitle}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors p-1.5 rounded-full hover:bg-surface-container-highest cursor-pointer flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row px-5 sm:px-6 py-4 gap-6">
          {/* Main Left Content */}
          <div className="w-full md:w-3/4 space-y-6">
            
            {/* Labels display horizontally */}
            {label && (
              <div className="ml-9">
                <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Nhãn</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-green-500 text-white rounded-md text-xs font-bold shadow-sm">
                    {label}
                  </span>
                  <button className="w-8 h-8 flex items-center justify-center bg-surface-container border border-outline-variant rounded-md hover:bg-surface-container-highest transition-colors cursor-pointer" title="Thêm nhãn">
                    <Plus className="w-4 h-4 text-on-surface-variant" />
                  </button>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="flex gap-3 items-start">
              <AlignLeft className="w-5 h-5 sm:w-6 sm:h-6 mt-1 text-on-surface-variant flex-shrink-0" />
              <div className="w-full">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-sm font-bold text-on-surface">Mô tả</h3>
                  {!isEditingDesc && (
                    <button 
                      onClick={() => setIsEditingDesc(true)}
                      className="px-2 py-1 bg-surface-container-low border border-outline-variant/60 hover:bg-surface-container-highest text-on-surface-variant text-xs font-semibold rounded cursor-pointer transition-colors"
                    >
                      Chỉnh sửa
                    </button>
                  )}
                </div>
                
                {isEditingDesc ? (
                  <div className="space-y-2">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      className="w-full p-3 bg-surface border border-outline-variant rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary text-on-surface resize-y"
                      placeholder="Thêm mô tả chi tiết hơn..."
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setIsEditingDesc(false)}
                        className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded cursor-pointer hover:bg-primary/90 transition-colors shadow-sm"
                      >
                        Lưu
                      </button>
                      <button 
                        onClick={() => setIsEditingDesc(false)}
                        className="px-4 py-2 hover:bg-surface-container-high text-on-surface text-xs font-semibold rounded cursor-pointer transition-colors"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => setIsEditingDesc(true)}
                    className="w-full min-h-[80px] p-3 bg-surface-container-low hover:bg-surface-container-highest rounded-lg text-xs sm:text-sm text-on-surface cursor-pointer ring-1 ring-transparent hover:ring-outline-variant transition-all whitespace-pre-wrap"
                  >
                    {description || "Thêm mô tả chi tiết hơn..."}
                  </div>
                )}
              </div>
            </div>

            {/* Hoạt động (Activity) */}
             <div className="flex gap-3 items-start pt-4">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 mt-1 text-on-surface-variant flex-shrink-0" />
              <div className="w-full">
                 <div className="flex items-center justify-between mb-4">
                   <h3 className="text-sm font-bold text-on-surface">Hoạt động</h3>
                   <button className="px-2 py-1 bg-surface-container-low border border-outline-variant/60 hover:bg-surface-container-highest text-on-surface-variant text-xs font-semibold rounded cursor-pointer transition-colors">
                      Hiển thị chi tiết
                   </button>
                 </div>
                 
                 <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container border border-outline-variant/50 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                      {currentUser?.avatar && currentUser.avatar.length > 10 ? <img src={currentUser.avatar} className="w-full h-full rounded-full object-cover"/> : currentUser?.fullName?.charAt(0) || "U"}
                    </div>
                    <div className="w-full relative shadow-sm">
                       <input 
                         type="text" 
                         className="w-full bg-surface border border-outline-variant rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm" 
                         placeholder="Viết bình luận..." 
                         value={commentInput}
                         onChange={(e) => setCommentInput(e.target.value)}
                         onKeyDown={(e) => {
                           if (e.key === 'Enter') {
                             e.preventDefault();
                             handlePostComment();
                           }
                         }}
                       />
                       {commentInput.trim() && (
                          <button 
                            onClick={handlePostComment}
                            className="absolute right-2 top-1.5 px-2 py-1 bg-primary text-on-primary rounded text-[10px] font-bold hover:bg-primary/90 transition-colors"
                          >
                            Gửi
                          </button>
                       )}
                    </div>
                 </div>
                  {/* Render Activities */}
                  <div className="mt-4 space-y-3 pl-11">
                    {activities.map(act => (
                      <div key={act.id} className={`flex gap-2 items-start ${act.type !== 'comment' ? 'opacity-80' : ''}`}>
                         <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5 border border-outline-variant/60 ${act.type === 'comment' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-on-surface'}`}>
                           {act.user.avatar && act.user.avatar.length > 10 ? <img src={act.user.avatar} className="w-full h-full rounded-full object-cover"/> : act.user.fullName.charAt(0)}
                         </div>
                         <div className="w-full">
                           <p className="text-xs text-on-surface-variant font-medium mb-1">
                              <span className="font-bold text-on-surface">{act.user.fullName}</span> 
                              {act.type === 'comment' ? '' : ` ${act.action}`}
                              <span className="text-[10px] text-on-surface-variant/70 ml-2">
                                {new Date(act.createdAt).toLocaleString('vi-VN', {hour: '2-digit', minute:'2-digit', day: '2-digit', month: '2-digit'})}
                              </span>
                           </p>
                           {act.type === 'comment' && (
                             <div className="bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/60 shadow-xs text-xs text-on-surface">
                                {act.action}
                             </div>
                           )}
                         </div>
                      </div>
                    ))}
                  </div>

              </div>
            </div>

          </div>

          {/* Sidebar Right Content */}
          <div className="w-full md:w-1/4 space-y-5">
             
            <div>
              <h4 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Thêm vào thẻ</h4>
              <div className="space-y-1.5 flex flex-col">
                
                {/* Thành viên Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setShowMembers(!showMembers)}
                    className="w-full flex items-center gap-2 px-3 py-1.5 bg-surface-container-low hover:bg-surface-container-highest text-on-surface rounded text-xs font-medium transition-colors text-left cursor-pointer"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-on-surface-variant" /> 
                    {assignee ? assignee.fullName : "Thành viên"}
                  </button>
                  {showMembers && (
                    <div className="absolute top-full left-0 mt-1 w-full bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg z-10 p-1">
                      {boardMembers?.map(member => (
                        <button
                          key={member.email}
                          onClick={() => handleAssign(member)}
                          className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-surface-container rounded text-xs text-on-surface text-left cursor-pointer"
                        >
                          <div className="w-5 h-5 rounded-full bg-surface-container-high flex text-[8px] font-bold items-center justify-center border border-outline-variant">
                            {member.avatar && member.avatar.length > 10 ? <img src={member.avatar} className="w-full h-full rounded-full object-cover"/> : member.fullName.charAt(0)}
                          </div>
                          {member.fullName}
                        </button>
                      ))}
                      {(!boardMembers || boardMembers.length === 0) && (
                        <div className="px-2 py-1.5 text-xs text-on-surface-variant text-center">Không có thành viên</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="w-full group relative">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low hover:bg-surface-container-highest text-on-surface rounded text-xs font-medium transition-colors text-left w-full h-[32px] overflow-hidden focus-within:ring-1 focus-within:ring-primary">
                    <Tag className="w-3.5 h-3.5 text-on-surface-variant flex-shrink-0" /> 
                    <input 
                       type="text" 
                       className="bg-transparent border-none outline-none w-full p-0 h-full text-xs text-on-surface" 
                       placeholder="Nhãn (VD: SEO)"
                       value={label}
                       onChange={(e) => setLabel(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full group relative flex flex-col gap-1">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors text-left w-full h-[32px] overflow-hidden ${(() => {
                    if (!dueDate) return "bg-surface-container-low hover:bg-surface-container-highest text-on-surface focus-within:ring-1 focus-within:ring-primary";
                    const due = new Date(dueDate).getTime();
                    const now = new Date().getTime();
                    const diffDays = (due - now) / (1000 * 60 * 60 * 24);
                    if (diffDays < 0) return "bg-red-50 text-red-600 ring-1 ring-red-400";
                    if (diffDays <= 2) return "bg-orange-50 text-orange-600 ring-1 ring-orange-400";
                    return "bg-surface-container-low hover:bg-surface-container-highest text-on-surface focus-within:ring-1 focus-within:ring-primary";
                  })()}`}>
                      <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                      <input 
                         type="date"
                         className="bg-transparent border-none outline-none w-full p-0 h-full text-xs font-bold cursor-pointer text-inherit"
                         value={dueDate}
                         onChange={(e) => setDueDate(e.target.value)}
                         title="Ngày hết hạn"
                      />
                  </div>
                </div>
                
                 <div className="w-full group relative flex flex-col gap-1">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-low hover:bg-surface-container-highest text-on-surface rounded text-xs font-medium transition-colors text-left w-full h-[32px] overflow-hidden focus-within:ring-1 focus-within:ring-primary cursor-pointer">
                      <Flag className="w-3.5 h-3.5 text-on-surface-variant flex-shrink-0" />
                      <select 
                         className="bg-transparent border-none outline-none w-full p-0 h-full text-xs text-on-surface cursor-pointer"
                         value={priority}
                         onChange={(e) => setPriority(e.target.value as any)}
                         style={{ appearance: 'none' }}
                      >
                         <option value="low">Độ ưu tiên: Thấp</option>
                         <option value="medium">Độ ưu tiên: TB</option>
                         <option value="high">Độ ưu tiên: Cao</option>
                      </select>
                  </div>
                </div>

                <button className="w-full flex items-center gap-2 px-3 py-1.5 bg-surface-container-low hover:bg-surface-container-highest text-on-surface rounded text-xs font-medium transition-colors text-left cursor-pointer">
                  <Paperclip className="w-3.5 h-3.5 text-on-surface-variant" /> Đính kèm
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-1.5 bg-surface-container-low hover:bg-surface-container-highest text-on-surface rounded text-xs font-medium transition-colors text-left cursor-pointer">
                  <ImageIcon className="w-3.5 h-3.5 text-on-surface-variant" /> Ảnh bìa
                </button>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary text-on-primary rounded text-xs font-bold transition-colors text-left mt-6 cursor-pointer shadow-sm hover:opacity-90" onClick={handleSubmit}>
              <CheckSquare className="w-4 h-4 text-on-primary" /> Lưu thay đổi
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

interface KanbanColumnProps {
  key?: string;
  list: List;
  selectedBoard: Board | null;
  handleAddTask: (listId: string, taskTitle: string, priority: "low" | "medium" | "high", label?: string) => void;
  handleDeleteTask: (listId: string, taskId: string) => void;
  handleMoveTask: (taskId: string, targetListId: string) => void;
  handleDeleteColumn?: (listId: string) => void;
  handleUpdateTask?: (listId: string, taskId: string, updates: Partial<Task>) => void;
  currentUser?: any;
}

export default function KanbanColumn({
  list,
  selectedBoard,
  handleAddTask,
  handleDeleteTask,
  handleMoveTask,
  handleDeleteColumn,
  handleUpdateTask,
  currentUser
}: KanbanColumnProps) {
  if (!selectedBoard) return null;

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [newTaskLabel, setNewTaskLabel] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [isDragOver, setIsDragOver] = useState(false);

  const submitNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    handleAddTask(list.id, newTaskTitle, newTaskPriority, newTaskLabel);
    setNewTaskTitle("");
    setNewTaskLabel("");
    setShowAddForm(false);
  };

  const handleSaveUpdatedTask = (updates: Partial<Task>) => {
    if (editingTask && handleUpdateTask) {
      handleUpdateTask(list.id, editingTask.id, updates);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only remove drag over if leaving the container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData("taskId");
    if (taskId) {
      handleMoveTask(taskId, list.id);
    }
  };

  return (
    <div 
      className={`bg-surface-container-low p-4 rounded-xl border border-outline-variant/80 flex flex-col max-h-[700px] transition-colors duration-200 ${isDragOver ? "bg-surface-container border-primary" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
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
          <AnimatePresence>
            {list.tasks.map((task: Task) => (
              <motion.div
                layoutId={task.id}
                key={task.id}
                layout
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                draggable={true}
                onDragStart={(e: React.DragEvent) => {
                  e.dataTransfer.setData("taskId", task.id);
                  e.dataTransfer.effectAllowed = "move";
                }}
                className="group bg-surface-container-lowest p-3.5 rounded-lg border border-outline-variant shadow-xs hover:shadow-sm hover:border-outline transition-all cursor-grab active:cursor-grabbing"
              >
                <div className="flex justify-between items-start gap-1 mb-2">
                  <h4 className="text-xs font-bold text-on-surface leading-snug break-words max-w-[80%]">
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => setEditingTask(task)}
                      className="text-on-surface-variant hover:text-primary transition-all p-1 cursor-pointer"
                      title="Chỉnh sửa công việc"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(list.id, task.id)}
                      className="text-on-surface-variant hover:text-red-600 transition-all p-1 cursor-pointer"
                      title="Xóa đầu việc"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {task.description && (
                    <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-3 break-words whitespace-pre-wrap">
                      {task.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-1.5 w-full relative">
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
                        <Tag className="h-2.5 w-2.5" />
                        <span>{task.label}</span>
                      </span>
                    )}

                    {/* Due Date Indicator */}
                    {task.dueDate && (
                      <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded text-[9px] font-medium flex items-center gap-0.5" title={`Hạn chót: ${task.dueDate}`}>
                        <Calendar className="h-2.5 w-2.5" />
                        <span>{task.dueDate}</span>
                      </span>
                    )}

                    {/* Assignee Avatar */}
                    <div className="ml-auto w-5 h-5 rounded-full bg-primary-container text-on-primary-container text-[8px] font-bold flex items-center justify-center shrink-0 border border-primary/20" title={task.assignee?.fullName || "Người thực hiện"}>
                      {task.assignee?.avatar && task.assignee.avatar.length > 10 ? (
                         <img src={task.assignee.avatar} className="w-full h-full object-cover rounded-full" alt="Avatar"/>
                      ) : (
                         task.assignee?.fullName?.charAt(0) || "U"
                      )}
                    </div>
                  </div>
                </div>

                {/* Drag-free cross-move controls */}
                <div className="hidden group-hover:flex mt-3.5 pt-2 border-t border-outline-variant/40 justify-between items-center text-[10px] text-on-surface-variant transition-all">
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
              </motion.div>
            ))}
          </AnimatePresence>
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

      {/* Render Edit Task Modal */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          listTitle={list.title}
          onClose={() => setEditingTask(null)}
          onSave={handleSaveUpdatedTask}
          currentUser={currentUser}
          boardMembers={(selectedBoard?.members || [selectedBoard?.owner || ""]).map(email => ({
             email,
             fullName: email.split('@')[0], // Mock full name
             avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`
          }))}
        />
      )}
    </div>
  );
}
