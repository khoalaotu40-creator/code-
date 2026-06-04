import React from "react";
import { ChevronLeft, Search, Settings as SettingsIcon } from "lucide-react";
import { User, Board } from "../types";
import Chatbot from "../components/Chatbot";

interface TopNavBarProps {
  selectedBoard: Board | null;
  onBack: () => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  showNotifications: boolean;
  setShowNotifications: (val: boolean) => void;
  notifications: any[];
  setNotifications: (val: any[]) => void;
  onNavigateSettings: () => void;
  user: User | null;
}

export default function TopNavBar({
  selectedBoard,
  onBack,
  searchQuery,
  setSearchQuery,
  showNotifications,
  setShowNotifications,
  notifications,
  setNotifications,
  onNavigateSettings,
  user
}: TopNavBarProps) {
  return (
    <header className="h-[64px] shrink-0 flex justify-between items-center px-6 bg-surface-container-lowest border-b border-outline-variant shadow-sm z-40">
      <div className="flex-1 max-w-md flex items-center gap-4">
        {selectedBoard && (
          <button
            onClick={onBack}
            className="p-1 px-2.5 hover:bg-surface-container rounded-lg text-primary text-xs font-semibold flex items-center gap-1 border border-outline-variant/60 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Trở lại</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 relative">
        <Chatbot />
      </div>
    </header>
  );
}
