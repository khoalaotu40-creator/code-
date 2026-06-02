/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Hash, 
  Image as ImageIcon,
  Clock, 
  Search, 
  Plus, 
  Flame, 
  Bell, 
  TrendingUp, 
  AlertCircle,
  Tag,
  CheckCircle2,
  Share2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { User, Post, PostComment } from "../types";

interface NewsFeedViewProps {
  user: User | null;
  token: string | null;
}

const PRESET_IMAGES = [
  { url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80", label: "Mô hình ERD" },
  { url: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80", label: "Giao diện Code" },
  { url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80", label: "Báo cáo Tiến độ" },
  { url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80", label: "Họp Nhóm" }
];

const POPULAR_TAGS = ["Tất cả", "Thông báo", "Đồ Án Cuối Kỳ", "Báo cáo", "Database", "Backend", "Ý tưởng"];

export default function NewsFeedView({ user, token }: NewsFeedViewProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  
  // New Post States
  const [content, setContent] = useState("");
  const [selectedTag, setSelectedTag] = useState("Đồ Án Cuối Kỳ");
  const [customTag, setCustomTag] = useState("");
  const [postImage, setPostImage] = useState<string | null>(null);
  const [showImagePresets, setShowImagePresets] = useState(false);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilterTag, setActiveFilterTag] = useState("Tất cả");

  // Comments active expand states
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});

  // Upcoming Milestones Mock (Facebook sidebar style)
  const milestones = [
    { id: 1, title: "Nộp dự thảo ERD & CSDL", days: "Còn 2 ngày", date: "04/06", urgent: true },
    { id: 2, title: "Hoàn thiện API Đăng nhập", days: "Còn 5 ngày", date: "07/06", urgent: false },
    { id: 3, title: "Họp nhóm tổng kết tuần 12", days: "Còn 6 ngày", date: "08/06", urgent: false }
  ];

  // Hot activities statistic
  const stats = [
    { label: "Báo cáo hoàn thành", val: "85%", icon: CheckCircle2, color: "text-emerald-500" },
    { label: "Công việc khẩn cấp", val: "3 thẻ", icon: AlertCircle, color: "text-red-500" },
    { label: "Tương tác tuần này", val: "+140", icon: Flame, color: "text-amber-500" }
  ];

  // Fetch posts from backend
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/posts", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error("Không thể tải bảng tin từ máy chủ.");
      }
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err: any) {
      setErrorMessage(err.message || "Đã xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPosts();
    }
  }, [token]);

  // Handle Post Submit
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setIsSubmittingPost(true);
      const finalTag = customTag.trim() ? customTag.trim() : selectedTag;
      
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          content,
          tag: finalTag,
          image: postImage
        })
      });

      if (!response.ok) {
        throw new Error("Lỗi khi đăng bài viết.");
      }

      const data = await response.json();
      setPosts([data.post, ...posts]);
      
      // Reset forms
      setContent("");
      setCustomTag("");
      setPostImage(null);
      setShowImagePresets(false);
    } catch (err: any) {
      alert(err.message || "Đăng bài thất bại.");
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // Toggle Love/Like
  const handleToggleLike = async (postId: string) => {
    try {
      // Optimistic update
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          const userEmail = user?.email || "";
          const hasLiked = p.likes.includes(userEmail);
          const nextLikes = hasLiked 
            ? p.likes.filter(email => email !== userEmail)
            : [...p.likes, userEmail];
          return { ...p, likes: nextLikes };
        }
        return p;
      }));

      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error();
    } catch (err) {
      // Revert if error
      fetchPosts();
    }
  };

  // Submit dynamic Comment
  const handleSendComment = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const txt = newCommentText[postId];
    if (!txt || !txt.trim()) return;

    try {
      const response = await fetch(`/api/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ content: txt })
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      
      // Update local post state
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return { ...p, comments: data.post.comments };
        }
        return p;
      }));

      // Reset specific comment field
      setNewCommentText(prev => ({ ...prev, [postId]: "" }));
    } catch (err) {
      alert("Không thể đăng bình luận. Thử lại sau nhé!");
    }
  };

  const toggleCommentsExpansion = (postId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Filter & Search Logics
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tag && post.tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = 
      activeFilterTag === "Tất cả" || 
      post.tag === activeFilterTag;

    return matchesSearch && matchesTag;
  });

  const getRelativeTime = (isoString: string) => {
    const postTime = new Date(isoString).getTime();
    const diff = Date.now() - postTime;
    
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours} giờ trước`;
    
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  };

  return (
    <div className="max-w-6xl mx-auto py-4 px-2 md:px-4 space-y-6">
      
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-primary-container via-surface-container-low to-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <TrendingUp className="h-5.5 w-5.5 text-primary animate-pulse" />
            <span>Bảng tin Bản tin học tập / Đồ án SE104.Q28</span>
          </h2>
          <p className="text-xs text-on-surface-variant font-medium mt-1">
            Giao lưu thảo luận, đóng góp ý kiến, đăng tải tiến độ hoặc thông báo quan trọng nhất trong nhóm của bạn.
          </p>
        </div>

        {/* Input Search Block */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-on-surface-variant" />
          </span>
          <input
            type="text"
            placeholder="Tìm bài đăng, tác giả, hashtag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary text-on-surface placeholder:text-on-surface-variant/70 shadow-2xs"
          />
        </div>
      </div>

      {/* Hashtag Quick Filters (like facebook pill filters) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {POPULAR_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveFilterTag(tag)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeFilterTag === tag
                ? "bg-primary text-on-primary shadow-xs"
                : "bg-surface-container-low hover:bg-surface-container text-on-surface-variant border border-outline-variant/60"
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Main Body Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: Feed & Creation (2 cols on large screen) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Create Post Block (styled exactly like Facebook Card) */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-xs">
            <div className="flex gap-3.5">
              <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm shrink-0">
                {user?.fullName?.charAt(0) || "U"}
              </div>
              <div className="flex-1">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`${user?.fullName ? `${user.fullName} ơi, ` : ""}hôm nay bạn muốn chia sẻ tiến độ học tập nào?`}
                  rows={3}
                  className="w-full bg-transparent text-xs text-on-surface focus:outline-none placeholder:text-on-surface-variant resize-none"
                />
              </div>
            </div>

            {/* Selected attached image or attachment indicators */}
            {postImage && (
              <div className="mt-4 relative rounded-xl overflow-hidden max-h-48 border border-outline-variant">
                <img
                  src={postImage}
                  alt="Attachment preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPostImage(null)}
                  className="absolute top-2 right-2 p-1 bg-black/75 hover:bg-black text-white rounded-full text-[10px] uppercase font-bold cursor-pointer"
                >
                  Xóa ảnh x
                </button>
              </div>
            )}

            {/* Expand Image attachment presets */}
            {showImagePresets && (
              <div className="mt-3.5 p-3.5 bg-surface-container rounded-xl border border-outline border-dashed">
                <p className="text-[10px] font-bold text-on-surface h-4 mb-2">Chọn ảnh mẫu từ thư viện để đính kèm:</p>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_IMAGES.map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() => setPostImage(img.url)}
                      className={`h-14 rounded-lg overflow-hidden border-2 relative cursor-pointer ${postImage === img.url ? "border-primary" : "border-transparent"}`}
                      title={img.label}
                    >
                      <img src={img.url} className="w-full h-full object-cover" alt={img.label} />
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white py-0.5 text-center truncate">{img.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom tools header */}
            <div className="mt-4 pt-3.5 border-t border-outline-variant/60 flex flex-wrap gap-2 items-center justify-between">
              <div className="flex items-center gap-1.5">
                {/* Image Trigger */}
                <button
                  type="button"
                  onClick={() => setShowImagePresets(!showImagePresets)}
                  className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant text-xs flex items-center gap-1.5 font-medium transition-all cursor-pointer"
                >
                  <ImageIcon className="h-4 w-4 text-emerald-500" />
                  <span className="hidden sm:inline">Ảnh đính kèm</span>
                </button>

                {/* Tag Selection Dropdown */}
                <div className="flex items-center bg-surface-container-low px-2 py-1 rounded-lg border border-outline-variant/40">
                  <span className="text-[10px] text-on-surface-variant mr-1">Chủ đề:</span>
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="bg-transparent text-[10px] font-bold text-primary focus:outline-none cursor-pointer"
                  >
                    {POPULAR_TAGS.filter(t => t !== "Tất cả").map(tag => (
                      <option key={tag} value={tag}>#{tag}</option>
                    ))}
                    <option value="Tự chọn">#Tự viết tag...</option>
                  </select>
                </div>

                {selectedTag === "Tự chọn" && (
                  <input
                    type="text"
                    placeholder="Viết tag..."
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    className="max-w-[100px] bg-surface-container-low border border-outline-variant rounded px-1.5 py-0.5 text-[9px] focus:outline-none"
                  />
                )}
              </div>

              <button
                onClick={handleCreatePost}
                disabled={isSubmittingPost || !content.trim()}
                className="bg-primary hover:bg-opacity-90 disabled:opacity-50 text-on-primary text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-98 transition-all cursor-pointer"
              >
                {isSubmittingPost ? (
                  <span>Đang đăng...</span>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Đăng bảng tin</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Core Feed List representing post components */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3.5 bg-surface-container-lowest/50 border border-outline-variant border-dashed rounded-2xl">
              <div className="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="text-xs text-on-surface-variant font-medium">Đang đồng bộ hóa bài viết từ dự án...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-surface-container-lowest border border-outline-variant border-dashed rounded-2xl">
              <span className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-surface-container-high text-on-surface-variant mb-3">
                <Hash className="h-6 w-6" />
              </span>
              <h3 className="font-bold text-sm text-on-surface">Chưa có bài đăng nào tương thích</h3>
              <p className="text-xs text-on-surface-variant mt-1.5 max-w-sm mx-auto">
                Hãy là người đầu tiên tạo bài thảo luận cho tag hoặc từ khóa này để thu hút mọi người nhé!
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <AnimatePresence>
                {filteredPosts.map((post: Post) => {
                  const hasLiked = post.likes?.includes(user?.email || "");
                  const isExpanded = !!expandedComments[post.id];

                  return (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xs overflow-hidden"
                    >
                      {/* Post Header */}
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm border border-outline-variant">
                            {post.author.fullName?.trim()?.charAt(0) || "U"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-on-surface leading-tight hover:underline cursor-pointer">
                                {post.author.fullName}
                              </h4>
                              {post.tag && (
                                <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded-md text-[9px] font-bold">
                                  #{post.tag}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant font-medium mt-0.5">
                              <span className="truncate max-w-[120px]">{post.author.email}</span>
                              <span>•</span>
                              <span className="flex items-center gap-0.5">
                                <Clock className="h-3 w-3" />
                                {getRelativeTime(post.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button className="text-on-surface-variant hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-container cursor-pointer">
                          <Share2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Post Content */}
                      <div className="px-4 pb-4.5 text-xs text-on-surface leading-relaxed whitespace-pre-wrap">
                        {post.content}
                      </div>

                      {/* Post Attached Image if applies */}
                      {post.image && (
                        <div className="border-y border-outline-variant bg-surface-container flex justify-center max-h-[350px] overflow-hidden">
                          <img
                            src={post.image}
                            alt="Status visual attachment"
                            className="w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}

                      {/* Like counts and Comment counts status info line */}
                      <div className="px-4 py-2 border-b border-outline-variant/30 flex justify-between items-center text-[11px] text-on-surface-variant font-medium">
                        <div className="flex items-center gap-1.5">
                          {post.likes?.length > 0 && (
                            <>
                              <span className="flex items-center justify-center w-4 h-4 bg-red-100 rounded-full">
                                <Heart className="h-2.5 w-2.5 text-red-500 fill-red-500" />
                              </span>
                              <span>
                                {hasLiked 
                                  ? (post.likes.length === 1 ? "Bạn đã thích" : `Bạn và ${post.likes.length - 1} người khác`)
                                  : `${post.likes.length} lượt thích`
                                }
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => toggleCommentsExpansion(post.id)}
                            className="hover:underline cursor-pointer"
                          >
                            {post.comments?.length || 0} bình luận
                          </button>
                        </div>
                      </div>

                      {/* Social Actions buttons (Facebook style Layout) */}
                      <div className="px-2 py-1.5 bg-surface-container-lowest flex items-center justify-around border-b border-outline-variant/30">
                        <button
                          onClick={() => handleToggleLike(post.id)}
                          className={`flex-1 py-2 hover:bg-surface-container rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                            hasLiked ? "text-red-500" : "text-on-surface-variant hover:text-on-surface"
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${hasLiked ? "fill-red-500" : ""}`} />
                          <span>Yêu thích</span>
                        </button>

                        <button
                          onClick={() => toggleCommentsExpansion(post.id)}
                          className="flex-1 py-2 hover:bg-surface-container text-on-surface-variant hover:text-on-surface rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>Bình luận</span>
                        </button>
                      </div>

                      {/* COLLAPSIBLE COMMENTS DRAWER */}
                      {isExpanded && (
                        <div className="bg-surface-container-low/60 p-4 space-y-4">
                          
                          {/* List existing comments */}
                          {post.comments?.length > 0 && (
                            <div className="space-y-3">
                              {post.comments.map((comment: PostComment) => (
                                <div key={comment.id} className="flex gap-2.5 items-start">
                                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                                    {comment.author.fullName?.charAt(0) || "U"}
                                  </div>
                                  <div className="flex-1 bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant/60 shadow-2xs max-w-lg">
                                    <div className="flex justify-between items-center gap-1 mb-1">
                                      <span className="text-[11px] font-bold text-on-surface">
                                        {comment.author.fullName}
                                      </span>
                                      <span className="text-[9px] text-on-surface-variant/80">
                                        {getRelativeTime(comment.createdAt)}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-on-surface-variant leading-relaxed">
                                      {comment.content}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Inline quick insert comment input form */}
                          <form 
                            onSubmit={(e) => handleSendComment(post.id, e)}
                            className="flex items-center gap-2 pt-2"
                          >
                            <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold text-xs flex items-center justify-center shrink-0">
                              {user?.fullName?.charAt(0) || "U"}
                            </div>
                            <input
                              type="text"
                              value={newCommentText[post.id] || ""}
                              onChange={(e) => setNewCommentText({
                                ...newCommentText,
                                [post.id]: e.target.value
                              })}
                              placeholder="Viết bình luận công khai..."
                              className="flex-grow bg-surface-container-lowest text-xs px-4 py-2.5 rounded-full border border-outline-variant focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
                            />
                            <button
                              type="submit"
                              disabled={!(newCommentText[post.id]?.trim())}
                              className="p-2.5 bg-primary hover:bg-opacity-95 disabled:bg-surface-container-high disabled:text-on-surface-variant text-on-primary rounded-full shadow-2xs active:scale-95 transition-all cursor-pointer"
                              title="Gửi bình luận"
                            >
                              <Send className="h-3.5 w-3.5" />
                            </button>
                          </form>
                        </div>
                      )}

                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Sidebar Stats & Milestones (1 col on large screen) */}
        <div className="space-y-6">
          
          {/* Active Statistics Card Widget */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/80 mb-4 flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-primary" />
              <span>Tiến độ tổng hợp</span>
            </h3>

            <div className="grid grid-cols-1 gap-3.5">
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/40">
                  <div className="flex items-center gap-2.5">
                    <span className={`p-1.5 rounded-lg bg-surface-container-high ${stat.color}`}>
                      <stat.icon className="h-4.5 w-4.5" />
                    </span>
                    <span className="text-[11px] font-semibold text-on-surface-variant">{stat.label}</span>
                  </div>
                  <span className="text-xs font-bold text-on-surface">{stat.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming tasks milestones Facebook Style */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/80 flex items-center gap-1.5">
                <Bell className="h-4.5 w-4.5 text-amber-500 animate-bounce" />
                <span>Sự kiện & Deadline sắp tới</span>
              </h3>
            </div>

            <div className="space-y-3.5">
              {milestones.map((m) => (
                <div 
                  key={m.id}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface-container transition-all"
                >
                  <div className={`p-2 rounded-lg text-center font-bold text-xs select-none ${
                    m.urgent ? "bg-red-50 text-red-600 border border-red-200" : "bg-primary-container text-on-primary-container"
                  }`}>
                    {m.date}
                  </div>
                  <div className="min-w-0 flex-grow">
                    <h4 className="text-xs font-bold text-on-surface truncate leading-snug">
                      {m.title}
                    </h4>
                    <p className={`text-[10px] font-semibold mt-1 flex items-center gap-1 ${
                      m.urgent ? "text-red-500" : "text-on-surface-variant"
                    }`}>
                      <span>•</span>
                      {m.days}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-3.5 border-t border-outline-variant/60">
              <p className="text-[10px] text-center text-on-surface-variant leading-relaxed">
                Tất cả các thời điểm được tự động đồng bộ theo múi giờ địa phương Việt Nam (GMT+7).
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
