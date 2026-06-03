import React, { useState, useEffect, useRef } from "react";
import { Send, MessageSquare } from "lucide-react";
import { Board, User, ChatMessage } from "../types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

interface TeamChatProps {
  board: Board;
  user: User | null;
  token: string | null;
  onRefreshBoard: () => void;
}

export default function TeamChat({ board, user, token, onRefreshBoard }: TeamChatProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [board.chatMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    setIsSending(true);
    try {
      const res = await fetch(`/api/boards/${board.id}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ content: message })
      });

      if (res.ok) {
        setMessage("");
        onRefreshBoard();
      } else {
        const data = await res.json();
        alert(data.error || "Gửi tin nhắn thất bại.");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối khi gửi tin nhắn.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full md:w-80 bg-surface-container-lowest border border-outline-variant shadow-sm rounded-xl overflow-hidden shrink-0">
      <div className="p-4 border-b border-outline-variant bg-surface-container-low flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="font-bold text-sm text-on-surface">Trao đổi nhóm</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface">
        {(!board.chatMessages || board.chatMessages.length === 0) ? (
          <div className="h-full flex items-center justify-center text-center text-xs text-on-surface-variant p-4">
            Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
          </div>
        ) : (
          board.chatMessages.map((msg: ChatMessage) => {
            const isMe = msg.sender.email === user?.email;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div className="flex items-end gap-2 max-w-[85%]">
                  {!isMe && (
                    <div className="w-6 h-6 shrink-0 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[10px]">
                      {msg.sender.fullName.charAt(0)}
                    </div>
                  )}
                  <div className={`p-2.5 rounded-2xl text-xs ${isMe ? "bg-primary text-on-primary rounded-br-sm" : "bg-surface-container-high text-on-surface rounded-bl-sm"}`}>
                    {!isMe && (
                      <p className="text-[9px] font-bold opacity-70 mb-0.5">{msg.sender.fullName}</p>
                    )}
                    <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
                  </div>
                </div>
                <span className="text-[9px] text-on-surface-variant mt-1 px-1">
                  {dayjs(msg.createdAt).fromNow()}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-outline-variant bg-surface-container-lowest">
        <form onSubmit={handleSendMessage} className="relative flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="w-full pl-3 pr-10 py-2 bg-surface-container-low border border-outline-variant rounded-full text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!message.trim() || isSending}
            className="absolute right-1 p-1.5 rounded-full text-primary hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
