import React, { useState, useMemo, useRef, useEffect } from "react";
import { Board, Task } from "../types";
import { Calendar, ChevronLeft, ChevronRight, CheckCircle2, ChevronDown, Plus, Filter, MoreHorizontal, ListFilter, MapPin } from "lucide-react";

export default function RoadmapView({ board, handleUpdateTask }: { board: Board, handleUpdateTask?: (listId: string, taskId: string, updates: Partial<Task>) => void }) {
    const [centerDate, setCenterDate] = useState(new Date());
    const timelineRef = useRef<HTMLDivElement>(null);

    // Ensure midnight for consistent day calculations
    const getMidnight = (d: Date | string | number) => {
        const date = new Date(d);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    };

    // View range: 15 days before, 45 days after centerDate (60 days total)
    const days = useMemo(() => {
        const arr = [];
        const start = new Date(centerDate);
        start.setDate(start.getDate() - 15);
        for (let i = 0; i < 60; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            arr.push(d);
        }
        return arr;
    }, [centerDate]);

    // Flatten tasks and keep reference to their lists
    const tasks = useMemo(() => {
        return board.lists?.flatMap(list => list.tasks?.map(task => ({ ...task, listTitle: list.title, listId: list.id })) || []) || [];
    }, [board]);

    const cellWidth = 56; // width of each day column in pixels

    useEffect(() => {
        // Scroll to "today" position on initial load
        if (timelineRef.current) {
             const scrollTarget = 15 * cellWidth; // Today is roughly 15 items in
             timelineRef.current.scrollLeft = scrollTarget - 100;
        }
    }, [centerDate]); // Recenter when changing months

    const prevMonth = () => {
        const d = new Date(centerDate);
        d.setMonth(d.getMonth() - 1);
        setCenterDate(d);
    };

    const nextMonth = () => {
        const d = new Date(centerDate);
        d.setMonth(d.getMonth() + 1);
        setCenterDate(d);
    };

    const jumpToToday = () => {
        setCenterDate(new Date());
    };

    const todayMidnight = getMidnight(new Date());

    return (
        <div className="flex flex-col h-[600px] bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden text-on-surface">
            {/* Toolbar Header (Top) */}
            <div className="h-14 border-b border-outline-variant flex flex-col md:flex-row md:items-center justify-between px-4 bg-surface-container-lowest shrink-0 gap-2 md:gap-0">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-sm flex items-center gap-2 px-2">
                        Lộ trình (Roadmap)
                    </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                    <button onClick={jumpToToday} className="px-3 py-1.5 rounded-lg hover:bg-surface-container transition-colors font-bold whitespace-nowrap text-on-surface">
                        Today
                    </button>
                    <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden shrink-0">
                        <button onClick={prevMonth} className="p-1 hover:bg-surface-container transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button onClick={nextMonth} className="p-1 hover:bg-surface-container transition-colors border-l border-outline-variant">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Interactive Area */}
            <div className="flex flex-1 overflow-hidden relative">
                
                {/* LEFT SIDEBAR: Task List */}
                <div className="w-48 md:w-64 border-r border-outline-variant flex flex-col shrink-0 bg-surface-container-lowest z-30 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                    {/* Header alignment spacer */}
                    <div className="h-16 flex items-center justify-between border-b border-outline-variant px-4 bg-surface-container-lowest shrink-0 text-xs font-bold text-on-surface-variant">
                        <span>Items</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                    {/* Task Names column */}
                    <div className="flex flex-col flex-1 overflow-y-auto scrollbar-none">
                        {tasks.map((task, i) => (
                            <div 
                                key={task.id} 
                                className="h-12 border-b border-outline-variant/50 px-4 flex items-center shrink-0 w-full hover:bg-surface-container transition-colors relative group cursor-grab active:cursor-grabbing"
                                draggable
                                onDragStart={(e) => {
                                    e.dataTransfer.setData("dragType", "new_task");
                                    e.dataTransfer.setData("taskId", task.id);
                                }}
                            >
                                <span className="text-xs font-medium text-on-surface truncate group-hover:text-primary transition-colors flex items-center gap-2">
                                    <span className="text-on-surface-variant text-[10px] w-4 text-center">{i + 1}</span>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 md:inline hidden pointer-events-none" />
                                    <span className="truncate pointer-events-none">{task.title}</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT SIDE: Gantt Timeline */}
                <div className="flex-1 overflow-x-auto overflow-y-auto relative scrollbar-thin bg-surface" ref={timelineRef}>
                    <div className="min-w-max relative flex flex-col h-full">
                        
                        {/* 1. Header: Month Names */}
                        <div className="h-8 border-b border-outline-variant flex sticky top-0 bg-surface-container-lowest z-20">
                            {(() => {
                                const months: { label: string, colSpan: number }[] = [];
                                let currentMonth = -1;
                                days.forEach((d) => {
                                    if (d.getMonth() !== currentMonth) {
                                        months.push({ 
                                            label: d.toLocaleString('en-US', { month: 'long', year: 'numeric' }), 
                                            colSpan: 1 
                                        });
                                        currentMonth = d.getMonth();
                                    } else {
                                        months[months.length - 1].colSpan++;
                                    }
                                });
                                return months.map((m, i) => (
                                    <div key={i} className="flex items-center px-4 text-xs font-bold text-on-surface-variant border-r border-outline-variant/50 overflow-hidden" style={{ width: m.colSpan * cellWidth }}>
                                        {m.label}
                                    </div>
                                ));
                            })()}
                        </div>

                        {/* 2. Header: Day Numbers */}
                        <div className="h-8 border-b border-outline-variant flex sticky top-8 bg-surface z-20">
                            {days.map((d, i) => {
                                const midnight = getMidnight(d);
                                const isToday = midnight === todayMidnight;
                                return (
                                    <div key={i} className={`flex items-center justify-center text-[11px] font-medium border-r border-outline-variant/50 shrink-0 ${isToday ? 'text-red-600 font-bold bg-red-50/50 relative' : 'text-on-surface-variant'}`} style={{ width: cellWidth }}>
                                        {d.getDate()}
                                    </div>
                                );
                            })}
                        </div>

                        {/* 3. Grid & Task Bars Area */}
                        <div className="relative flex-1">
                            {/* Vertical Grid Background */}
                            <div className="absolute inset-0 flex pointer-events-none z-0">
                                {days.map((d, i) => {
                                    const midnight = getMidnight(d);
                                    const isToday = midnight === todayMidnight;
                                    return (
                                        <div key={i} className={`h-full border-r shrink-0 relative ${isToday ? 'border-red-200/50 bg-red-50/10' : 'border-outline-variant/30'}`} style={{ width: cellWidth }}>
                                            {/* Today red line indicator */}
                                            {isToday && (
                                                <div className="absolute top-0 bottom-0 left-1/2 w-px bg-red-400/80 -translate-x-1/2 z-0 hidden md:block" />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Task Rows exactly aligned with Sidebar */}
                            <div className="flex flex-col relative z-10 w-full" style={{ width: days.length * cellWidth }}>
                                {tasks.map((task, i) => {
                                    let startOffset = -1;
                                    let width = cellWidth - 16;
                                    let hasDates = false;

                                    if (task.startDate || task.dueDate) {
                                        const sDate = task.startDate ? getMidnight(task.startDate) : getMidnight(task.dueDate!);
                                        const eDate = task.dueDate ? getMidnight(task.dueDate) : getMidnight(task.startDate!);

                                        const startMidnightObj = getMidnight(days[0]);
                                        const diffDaysStart = Math.round((sDate - startMidnightObj) / (1000 * 60 * 60 * 24));
                                        const diffDaysEnd = Math.round((eDate - startMidnightObj) / (1000 * 60 * 60 * 24));

                                        if (diffDaysEnd >= 0 && diffDaysStart < days.length) {
                                            startOffset = diffDaysStart * cellWidth;
                                            width = Math.max((diffDaysEnd - diffDaysStart + 1) * cellWidth - 16, cellWidth - 16);
                                            hasDates = true;
                                        }
                                    }

                                    return (
                                        <div key={task.id} className="h-12 border-b border-outline-variant/20 relative w-full group flex">
                                            {/* Drop targets per cell */}
                                            {days.map((d, j) => (
                                                <div 
                                                    key={j}
                                                    className={`h-full shrink-0 border-r border-transparent hover:bg-primary/5 transition-colors`}
                                                    style={{ width: cellWidth }}
                                                    onDragOver={(e) => {
                                                        e.preventDefault();
                                                    }}
                                                    onDrop={(e) => {
                                                         e.preventDefault();
                                                         const type = e.dataTransfer.getData("dragType");
                                                         const taskIdStr = e.dataTransfer.getData("taskId");
                                                         if (!handleUpdateTask || taskIdStr !== task.id) return;
                                                         
                                                         const droppedDate = new Date(d.getTime());
                                                         // format local date as YYYY-MM-DD
                                                         const tzOffset = droppedDate.getTimezoneOffset() * 60000;
                                                         const localISOTime = (new Date(droppedDate.getTime() - tzOffset)).toISOString().slice(0, 10);

                                                         if (type === "new_task") {
                                                             handleUpdateTask(task.listId, task.id, {
                                                                 startDate: localISOTime,
                                                                 dueDate: localISOTime
                                                             });
                                                         } else if (type === "move_bar") {
                                                             const durStr = e.dataTransfer.getData("duration");
                                                             const duration = parseInt(durStr, 10);
                                                             const endD = new Date(droppedDate.getTime());
                                                             endD.setDate(endD.getDate() + duration);
                                                             const endLocalISOTime = (new Date(endD.getTime() - tzOffset)).toISOString().slice(0, 10);
                                                             
                                                             handleUpdateTask(task.listId, task.id, {
                                                                 startDate: localISOTime,
                                                                 dueDate: endLocalISOTime
                                                             });
                                                         } else if (type === "resize_start") {
                                                             // ensure start is not after end
                                                             let currentEnd = task.dueDate;
                                                             if (!currentEnd) currentEnd = task.startDate;
                                                             
                                                             let updates: Partial<Task> = { startDate: localISOTime };
                                                             if (currentEnd && new Date(localISOTime) > new Date(currentEnd)) {
                                                                 updates.dueDate = localISOTime;
                                                             }
                                                             handleUpdateTask(task.listId, task.id, updates);
                                                         } else if (type === "resize_end") {
                                                             let currentStart = task.startDate;
                                                             if (!currentStart) currentStart = task.dueDate;

                                                             let updates: Partial<Task> = { dueDate: localISOTime };
                                                             if (currentStart && new Date(localISOTime) < new Date(currentStart)) {
                                                                 updates.startDate = localISOTime;
                                                             }
                                                             handleUpdateTask(task.listId, task.id, updates);
                                                         }
                                                    }}
                                                />
                                            ))}

                                            {hasDates && startOffset >= 0 && (
                                                <div 
                                                    className="absolute top-1/2 -translate-y-1/2 h-7 bg-surface-container-low border border-outline-variant shadow-sm rounded flex items-center cursor-move hover:border-primary/50 hover:shadow-md transition-all z-20 min-w-max"
                                                    style={{ left: startOffset + 8, width: width }}
                                                    draggable
                                                    onDragStart={(e) => {
                                                        e.dataTransfer.setData("dragType", "move_bar");
                                                        e.dataTransfer.setData("taskId", task.id);
                                                        const sDateStr = task.startDate || task.dueDate!;
                                                        const eDateStr = task.dueDate || task.startDate!;
                                                        const sDate = new Date(sDateStr);
                                                        const eDate = new Date(eDateStr);
                                                        const dur = Math.round((eDate.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24));
                                                        e.dataTransfer.setData("duration", dur.toString());
                                                    }}
                                                >
                                                    <div 
                                                      className="w-2 h-full cursor-col-resize absolute left-0 top-0 bottom-0 hover:bg-primary/20 rounded-l" 
                                                      draggable
                                                      onDragStart={(e) => {
                                                          e.stopPropagation();
                                                          e.dataTransfer.effectAllowed = "move";
                                                          e.dataTransfer.setData("dragType", "resize_start");
                                                          e.dataTransfer.setData("taskId", task.id);
                                                      }}
                                                    />
                                                    <div className="flex items-center gap-1.5 px-2 truncate pointer-events-none w-full">
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                                        <span className="text-[11px] font-medium text-on-surface truncate">{task.title}</span>
                                                    </div>
                                                    <div 
                                                      className="w-2 h-full cursor-col-resize absolute right-0 top-0 bottom-0 hover:bg-primary/20 rounded-r" 
                                                      draggable
                                                      onDragStart={(e) => {
                                                          e.stopPropagation();
                                                          e.dataTransfer.effectAllowed = "move";
                                                          e.dataTransfer.setData("dragType", "resize_end");
                                                          e.dataTransfer.setData("taskId", task.id);
                                                      }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                                {/* Extend grid height if few tasks */}
                                <div className="h-12 w-full border-b border-outline-variant/10"></div>
                                <div className="flex-1 w-full min-h-[100px]"></div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

