import React from "react";
import { User as UserIcon, Database, Sparkles } from "lucide-react";
import { User } from "../types";

interface SettingsViewProps {
  user: User | null;
}

export default function SettingsView({ user }: SettingsViewProps) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-8 animate-fade-in text-on-surface">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-on-surface">Cài đặt hệ thống SE104.Q28</h2>
        <p className="text-xs text-on-surface-variant mt-1">Cấu hình người dùng, dữ liệu bảo mật và quản lý hệ thống lưu trữ dự án.</p>
      </div>

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
  );
}
