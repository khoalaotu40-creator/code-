/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  username: string;
  fullName: string;
  email: string;
  avatar: string;
  role: string;
}

export interface ActivityLog {
  id: string;
  user: {
    fullName: string;
    avatar?: string;
  };
  type?: "comment" | "system";
  action: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate?: string; // YYYY-MM-DD
  priority?: "low" | "medium" | "high";
  label?: string; // e.g. "Cá nhân", "Quan trọng"
  assignee?: {
    fullName: string;
    avatar?: string;
    email: string;
  };
  activities?: ActivityLog[];
}

export interface List {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Board {
  id: string;
  title: string;
  bgGradient: string; // Tailwind class description or exact gradient classes
  isFavorite?: boolean;
  type: "personal" | "team";
  description?: string;
  lastViewedAt?: string; // string timestamp for sorting
  lists?: List[]; // Kanban lists/columns
  owner: string; // email of the owner
  members?: string[]; // emails of members
  chatMessages?: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  sender: {
    fullName: string;
    email: string;
  };
  content: string;
  createdAt: string;
}

export interface PostComment {
  id: string;
  author: {
    fullName: string;
    avatar: string;
    email: string;
  };
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  author: {
    fullName: string;
    avatar: string;
    email: string;
  };
  content: string;
  createdAt: string;
  likes: string[]; // array of user emails
  comments: PostComment[];
  image?: string;
  tag?: string; // e.g. "Đồ Án Cuối Kỳ", "Thông báo"
}

