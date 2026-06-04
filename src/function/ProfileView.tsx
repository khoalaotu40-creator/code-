import React, { useRef, useState } from "react";
import { User as UserIcon, Sparkles, Upload, CameraIcon } from "lucide-react";
import { User } from "../types";

interface ProfileViewProps {
  user: User | null;
  token: string | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export default function ProfileView({ user, token, setUser }: ProfileViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh hợp lệ.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Kích thước file quá lớn. Vui lòng chọn ảnh dưới 5MB.");
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;

        const res = await fetch("/api/auth/avatar", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ avatarBase64: base64String })
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          alert("Cập nhật ảnh đại diện thành công!");
        } else {
          const error = await res.json();
          alert(error.error || "Cập nhật ảnh đại diện thất bại.");
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-8 animate-fade-in text-on-surface">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-on-surface">Hồ sơ cá nhân</h2>
        <p className="text-xs text-on-surface-variant mt-1">Cập nhật thông tin cá nhân và ảnh đại diện của bạn.</p>
      </div>

      <div className="border-t border-outline-variant/60 pt-6 space-y-4">
        <h3 className="font-bold text-sm flex items-center gap-1.5 text-primary">
          <UserIcon className="h-4.5 w-4.5" />
          <span>Thông tin tài khoản</span>
        </h3>
        
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar Upload Column */}
          <div className="flex flex-col items-center gap-3 shrink-0">
             <div className="relative group cursor-pointer" onClick={() => !isUploading && fileInputRef.current?.click()}>
                {user?.avatar && user.avatar.length > 10 ? (
                  <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-surface shadow-sm" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-3xl font-bold border-4 border-surface shadow-sm">
                    {user?.avatar || user?.fullName?.charAt(0) || "U"}
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <CameraIcon className="w-6 h-6 text-white" />
                </div>
                {isUploading && (
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white animate-spin" />
                  </div>
                )}
             </div>
             <input 
               type="file" 
               ref={fileInputRef} 
               onChange={handleAvatarSelect} 
               accept="image/*" 
               className="hidden" 
             />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 w-full">
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Họ và tên</label>
              <input
                type="text"
                disabled
                value={user?.fullName || "Người dùng"}
                className="w-full p-2 bg-surface-container border border-outline-variant rounded-lg text-xs text-on-surface cursor-not-allowed opacity-80"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-on-surface-variant uppercase mb-1">Email truy cập</label>
              <input
                type="email"
                disabled
                value={user?.email || "email@example.com"}
                className="w-full p-2 bg-surface-container border border-outline-variant rounded-lg text-xs text-on-surface cursor-not-allowed opacity-80"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
