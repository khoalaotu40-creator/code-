/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Lock, Mail, AlertCircle, CheckCircle2, ShieldCheck, KeyRound, User as UserIcon } from "lucide-react";
import { User } from "../types";

interface LoginViewProps {
  onLoginSuccess: (token: string, user: User) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("khoalaotu40@gmail.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Security credentials helper for users to easily click and login
  const handleSelectAccount = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || (isRegistering && !fullName)) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const endpoint = isRegistering ? "/api/register" : "/api/login";
      const bodyPayload = isRegistering 
        ? { username, password, fullName } 
        : { username, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyPayload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Lỗi hệ thống.");
      }

      setSuccess(true);
      setTimeout(() => {
        onLoginSuccess(data.token, data.user);
      }, 800);
    } catch (err: any) {
      setError(err.message || "Không thể kết nối đến máy chủ bảo mật.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface-container-lowest p-8 rounded-xl border border-outline-variant shadow-lg transition-all">
        {/* Header and Branding */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-2xl shadow-sm mb-4">
            S
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-primary">
            SE104.Q28 Secure Access
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant max-w-xs mx-auto">
            Quy trình xác thực đăng nhập bảo mật hai lớp phòng tránh rò rỉ dữ liệu dự án.
          </p>
        </div>

        {/* Info alerts */}
        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-lg flex items-center gap-2.5 text-sm border border-error/20">
            <AlertCircle className="h-5 w-5 shrink-0 text-error" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg flex items-center gap-2.5 text-sm border border-emerald-200">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <span>Đăng nhập thành công! Đang chuyển hướng...</span>
          </div>
        )}

        {/* Input Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Họ và tên
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant" />
                  <input
                    type="text"
                    required={isRegistering}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all text-on-surface"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Tài khoản / Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all text-on-surface"
                  placeholder="khoalaotu40@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Mật khẩu bảo mật
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all text-on-surface"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-primary py-2.5 px-4 text-on-primary font-semibold text-sm rounded-lg shadow-sm hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : isRegistering ? "Đăng ký tài khoản" : "Xác thực & Vào Bảng Điều Khiển"}
          </button>
          
          <div className="text-center text-sm text-on-surface-variant">
            {isRegistering ? "Đã có tài khoản? " : "Chưa có tài khoản? "}
            <button 
              type="button" 
              onClick={() => setIsRegistering(!isRegistering)} 
              className="font-bold text-primary hover:underline cursor-pointer"
            >
              {isRegistering ? "Đăng nhập ngay" : "Tạo tài khoản mới"}
            </button>
          </div>
        </form>

        {/* Quick Demo Accs */}
        {!isRegistering && (
          <div className="border-t border-outline-variant pt-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
              <KeyRound className="h-4 w-4 text-primary" />
              <span>Tài khoản thử nghiệm của hệ thống:</span>
            </div>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => handleSelectAccount("khoalaotu40@gmail.com", "password123")}
                className="w-full flex justify-between items-center p-2 mb-1.5 hover:bg-surface-container bg-surface-container-low border border-outline-variant rounded-lg transition-all text-left"
              >
                <div>
                  <p className="font-semibold text-on-surface">Khoa Lão Tứ (User)</p>
                  <p className="text-on-surface-variant">khoalaotu40@gmail.com</p>
                </div>
                <span className="text-primary font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-outline-variant">
                  Click để thử
                </span>
              </button>

              <button
                onClick={() => handleSelectAccount("se104", "se104q28")}
                className="w-full flex justify-between items-center p-2 hover:bg-surface-container bg-surface-container-low border border-outline-variant rounded-lg transition-all text-left"
              >
                <div>
                  <p className="font-semibold text-on-surface">Sinh viên môn SE104.Q28</p>
                  <p className="text-on-surface-variant">se104</p>
                </div>
                <span className="text-primary font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-outline-variant">
                  Click để thử
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Security Shield Label Footer */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-on-surface-variant border-t border-outline-variant/60 pt-4">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Kênh truyền SHA-256 mã hóa quân đội.</span>
        </div>
      </div>
    </div>
  );
}
