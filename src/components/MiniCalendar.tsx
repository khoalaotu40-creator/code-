import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Tag, Clock } from "lucide-react";
import { Board, Task } from "../types";

interface MiniCalendarProps {
  boards: Board[];
}

export default function MiniCalendar({ boards }: MiniCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Extract all tasks with start/dueDate
  const allTasks = useMemo(() => {
    let tasks: (Task & { boardName: string })[] = [];
    boards.forEach(b => {
      b.lists?.forEach(l => {
        l.tasks?.forEach(t => {
          if (t.startDate || t.dueDate) {
            tasks.push({ ...t, boardName: b.title });
          }
        });
      });
    });
    return tasks;
  }, [boards]);

  // Calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Adjust to start on Monday (if firstDayOfMonth is 0 (Sun), make it 6, otherwise -1)
  const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = ["tháng 1", "tháng 2", "tháng 3", "tháng 4", "tháng 5", "tháng 6", "tháng 7", "tháng 8", "tháng 9", "tháng 10", "tháng 11", "tháng 12"];

  // Helper to check if a day has tasks
  const getTasksForDay = (day: number) => {
    const d = new Date(year, month, day);
    const tzOffset = d.getTimezoneOffset() * 60000;
    const dateStr = (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 10);

    return allTasks.filter(t => {
      // Very simple inclusion check (if dateStr is between start and due)
      const tStart = t.startDate || t.dueDate;
      const tEnd = t.dueDate || t.startDate;
      if (!tStart || !tEnd) return false;
      return dateStr >= tStart && dateStr <= tEnd;
    });
  };

  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());
  if (selectedDay !== null && currentDate.getMonth() !== new Date().getMonth()) {
    // Reset selected day if month changes, unless we want to keep it.
  }

  const selectedTasks = selectedDay !== null ? getTasksForDay(selectedDay) : [];

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-outline-variant bg-surface-container-low/50 flex flex-col gap-4">
            <h3 className="font-bold text-lg text-on-surface flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Lịch
            </h3>
            
            <div className="flex justify-between items-center px-2">
                <button onClick={prevMonth} className="text-primary hover:bg-primary/10 p-1.5 rounded-full transition-colors flex items-center justify-center">
                   <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="text-center font-bold text-on-surface flex flex-col">
                   <span className="text-base">{monthNames[month]}</span>
                   <span className="text-sm border-t border-outline-variant/30 mt-0.5 pt-0.5">{year}</span>
                </div>
                <button onClick={nextMonth} className="text-primary hover:bg-primary/10 p-1.5 rounded-full transition-colors flex items-center justify-center">
                   <ChevronRight className="w-5 h-5" />
                </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center mt-2">
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
                    <div key={d} className="text-xs font-bold text-on-surface-variant py-1">{d}</div>
                ))}
                
                {Array.from({ length: startingDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="p-2" />
                ))}
                
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
                    const isSelected = selectedDay === day;
                    const dayTasks = getTasksForDay(day);
                    const hasTasks = dayTasks.length > 0;
                    
                    const d = new Date(year, month, day);
                    const tzOffset = d.getTimezoneOffset() * 60000;
                    const dateStr = (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 10);
                    const hasDeadline = dayTasks.some(t => t.dueDate === dateStr);
                    
                    return (
                        <div 
                          key={day} 
                          onClick={() => setSelectedDay(day)}
                          className={`
                              relative flex items-center justify-center h-8 w-8 mx-auto rounded-full text-sm font-medium cursor-pointer transition-all
                              ${isSelected && !hasDeadline ? "bg-primary text-on-primary font-bold shadow-md transform scale-110" : ""}
                              ${isSelected && hasDeadline ? "bg-red-500 text-white font-bold shadow-md transform scale-110" : ""}
                              ${!isSelected ? "hover:bg-surface-container" : ""}
                              ${isToday && !isSelected && !hasDeadline ? "text-primary border border-primary/50" : ""}
                              ${isToday && !isSelected && hasDeadline ? "text-red-500 border border-red-500/50" : ""}
                              ${!isSelected && !isToday && hasDeadline ? "text-red-500 font-bold" : ""}
                              ${!isSelected && !isToday && !hasDeadline ? "text-on-surface" : ""}
                          `}
                        >
                            {day}
                            {hasTasks && !isSelected && (
                                <div className={`absolute -bottom-1 w-1.5 h-1.5 rounded-full ${hasDeadline ? 'bg-red-500' : 'bg-primary'}`}></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>

        <div className="p-4 bg-surface-container-lowest min-h-[150px]">
           {selectedDay !== null && (
              <div className="mb-3 text-sm font-bold text-on-surface flex items-center justify-between border-b border-outline-variant/50 pb-2">
                 <span>Công việc ngày {selectedDay}/{month + 1}</span>
                 {selectedTasks.length > 0 && (
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px]">{selectedTasks.length}</span>
                 )}
              </div>
           )}
           
           <div className="space-y-3 overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-outline-variant scrollbar-track-transparent pr-1">
              {selectedTasks.length > 0 ? selectedTasks.map(task => (
                 <div key={task.id} className="flex flex-col gap-1.5 p-3 bg-surface-container-low rounded-xl border border-outline-variant/60 hover:bg-surface-container cursor-pointer transition-colors group shadow-xs hover:border-primary/30">
                   <div className="flex items-start justify-between gap-2">
                     <span className="text-xs font-bold text-on-surface leading-tight group-hover:text-primary transition-colors">{task.title}</span>
                     {task.priority && (
                       <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase shrink-0
                          ${task.priority === 'high' ? 'bg-red-100 text-red-700' : 
                            task.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 
                            'bg-blue-100 text-blue-700'}
                       `}>
                          {task.priority === 'high' ? 'Khẩn' : 
                           task.priority === 'medium' ? 'TB' : 'Thấp'}
                       </span>
                     )}
                   </div>
                   <div className="flex justify-between items-center mt-1 text-[10px] font-medium">
                     <span className="text-on-surface-variant flex items-center gap-1.5 truncate max-w-[120px]">
                       <Tag className="w-3 h-3 shrink-0" /> <span className="truncate">{task.boardName}</span>
                     </span>
                     {(task.startDate || task.dueDate) && (
                       <span className="text-red-600 flex items-center gap-1 bg-red-50 px-1.5 py-0.5 rounded shrink-0 font-bold border border-red-100">
                         <Clock className="w-2.5 h-2.5" /> 
                         {task.dueDate ? new Date(task.dueDate).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'}) : '...'}
                       </span>
                     )}
                   </div>
                 </div>
              )) : (
                 <div className="text-center py-8 text-on-surface-variant/70 text-xs flex flex-col items-center gap-2">
                    <CalendarIcon className="w-8 h-8 opacity-20" />
                    Không có công việc nào trong ngày này.
                 </div>
              )}
           </div>
        </div>
    </div>
  );
}
