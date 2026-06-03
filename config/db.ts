import fs from "fs";
import path from "path";
import { Board, User, Post } from "../src/types";

export const DB_FILE = path.join(process.cwd(), "db.json");

export const DEFAULT_POSTS: Post[] = [
  {
    id: "post-1",
    author: {
      fullName: "Khoa Lão Tứ",
      avatar: "K",
      email: "khoalaotu40@gmail.com"
    },
    content: "Chào cả nhà! Mình vừa cập nhật kế hoạch cho học phần SE104 - Dự án Đồ Án Cuối Kỳ. Mọi người chú ý hoàn thành đúng hạn sơ đồ ERD chương 1 và 2 nhé! 🚀🚀",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    likes: ["admin@se104.vn"],
    comments: [
      {
        id: "c-1",
        author: {
          fullName: "Đức Anh",
          avatar: "A",
          email: "student@se104.vn"
        },
        content: "Em đã nộp bản nháp ERD lên board đồ án rồi ạ, anh xem góp ý giúp em nha!",
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
      }
    ],
    tag: "Đồ Án Cuối Kỳ",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "post-2",
    author: {
      fullName: "Hệ thống Quản lý Dự án",
      avatar: "S",
      email: "system@se104.vn"
    },
    content: "Thông báo quan trọng: Thời hạn nộp báo cáo tiến độ tuần này là 23h59 ngày Chủ Nhật. Các nhóm trưởng vui lòng tổng hợp kết quả trên bảng Kanban.",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    likes: [],
    comments: [],
    tag: "Thông báo"
  }
];

export const DEFAULT_USER: User = {
  username: "khoalaotu40@gmail.com",
  fullName: "Khoa Lão Tứ",
  email: "khoalaotu40@gmail.com",
  avatar: "U",
  role: "Project Manager"
};

export const DEFAULT_BOARDS: Board[] = [
  {
    id: "do-an-cuoi-ky",
    title: "Dự án Đồ Án Cuối Kỳ",
    bgGradient: "from-error-container to-surface-container-lowest",
    isFavorite: true,
    type: "team",
    description: "Dự án thực tế cho học phần thực tập tốt nghiệp và đồ án cuối khóa.",
    owner: "khoalaotu40@gmail.com",
    members: ["khoalaotu40@gmail.com", "admin@se104.vn"],
    lastViewedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    lists: [
      {
        id: "lakm-1",
        title: "Cần làm",
        tasks: [
          { id: "t-1", title: "Viết báo cáo chương 1 & 2", description: "Lập đề cương chi tiết và viết nội dung lý thuyết tổng quan.", priority: "high", label: "Báo cáo" },
          { id: "t-2", title: "Thiết kế sơ đồ cơ sở dữ liệu", description: "Vẽ sơ đồ ERD, thiết lập quan hệ bảng cho hệ thống.", priority: "medium", label: "Database" }
        ]
      },
      {
        id: "lakm-2",
        title: "Đang làm",
        tasks: [
          { id: "t-3", title: "Code chức năng Đăng ký/Đăng nhập bảo mật", description: "Sử dụng hashing mật khẩu và JWT token bảo mật cực cao.", priority: "high", label: "Backend" }
        ]
      },
      {
        id: "lakm-3",
        title: "Đã xong",
        tasks: [
          { id: "t-4", title: "Khảo sát ý tưởng đề tài", description: "Họp nhóm thống nhất chọn đề tài Project Management Trello.", priority: "low", label: "Phân tích" }
        ]
      }
    ]
  },
  {
    id: "marketing-qu-3",
    title: "Kế Hoạch Marketing Quý 3",
    bgGradient: "from-[#cce8e4] to-surface-container-lowest",
    isFavorite: true,
    type: "team",
    description: "Kế hoạch quảng bá sản phẩm, tối ưu SEO và truyền thông chiến dịch thu đông.",
    owner: "admin@se104.vn",
    lastViewedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    lists: [
      {
        id: "lmkt-1",
        title: "Ý tưởng",
        tasks: [
          { id: "tk-1", title: "Liên hệ KOLs ngành công nghệ", description: "Tìm kiếm và lọc danh sách 10 KOLs tiềm năng.", priority: "medium" }
        ]
      },
      {
        id: "lmkt-2",
        title: "Kế hoạch chi tiết",
        tasks: [
          { id: "tk-2", title: "Tối ưu hóa SEO Landing Page", description: "Viết bài chuẩn SEO, sửa thẻ meta h1, description.", priority: "high", label: "SEO" }
        ]
      }
    ]
  },
  {
    id: "cong-viec-hang-ngay",
    title: "Công việc Hàng Ngày",
    bgGradient: "from-primary-fixed-dim to-surface-container-lowest",
    isFavorite: false,
    type: "personal",
    description: "Routine sinh hoạt và các việc lặt vặt cần làm tự động hóa mỗi ngày.",
    owner: "khoalaotu40@gmail.com",
    lists: [
      {
        id: "lcv-1",
        title: "Buổi sáng",
        tasks: [
          { id: "tv-1", title: "Tập thể dục và uống nước", description: "Plank 3 phút, chạy nhẹ nhàng 2km nâng cao sức khỏe.", priority: "low", label: "Cá nhân" },
          { id: "tv-2", title: "Đọc sách chuyên ngành 30 phút", description: "Đọc sách về Clean Code hoặc Thiết kế kiến trúc phần mềm Tây Âu.", priority: "medium", label: "Cá nhân" }
        ]
      },
      {
        id: "lcv-2",
        title: "Buổi chiều / tối",
        tasks: [
          { id: "tv-3", title: "Làm bài tập SE104", description: "Giải quyết nốt các câu hỏi lý thuyết và nộp đúng hạn.", priority: "high", label: "Học tập" }
        ]
      }
    ]
  },
  {
    id: "hoc-tap-nghien-cuu",
    title: "Học Tập & Nghiên Cứu",
    bgGradient: "from-tertiary-fixed-dim to-surface-container-lowest",
    isFavorite: false,
    type: "personal",
    owner: "khoalaotu40@gmail.com",
    description: "Nơi lưu trữ tài liệu học tập, các khóa học Udemy, Coursera và công nghệ cần thử nghiệm.",
    lists: [
      {
        id: "lht-1",
        title: "Công nghệ mới",
        tasks: [
          { id: "th-1", title: "Tìm hiểu React 19 Server Components", description: "Tìm hiểu chế độ server action mới và use() API.", priority: "medium" }
        ]
      }
    ]
  },
  {
    id: "thiet-ke-ui-ux",
    title: "Thiết Kế UI/UX",
    bgGradient: "from-surface-variant to-surface-container-lowest",
    isFavorite: false,
    type: "personal",
    owner: "admin@se104.vn",
    description: "Thiết kế giao diện bảng Kanban SE104 và vẽ wireframes cho ứng dụng di động ví điện tử.",
    lists: [
      {
        id: "lui-1",
        title: "Công cụ Figma",
        tasks: [
          { id: "ti-1", title: "Xây dựng hệ thống UI Kit & Token màu", description: "Đồng bộ hóa màu sắc theo chuẩn Material Design 3.", priority: "high" }
        ]
      }
    ]
  },
  {
    id: "len-y-tuong-content",
    title: "Lên Ý Tưởng Content",
    bgGradient: "from-[#e9d5ff] to-surface-container-lowest",
    isFavorite: false,
    type: "personal",
    owner: "se104@se104.vn",
    description: "Kế hoạch xây dựng thương hiệu cá nhân trên TikTok, Facebook và Threads.",
    lists: [
      {
        id: "lyt-1",
        title: "Ý tưởng nháp",
        tasks: [
          { id: "tc-1", title: "Bài viết chia sẻ kinh nghiệm học IT", description: "Kinh nghiệm thực chiến đồ án môn học SE104 công nghệ hiện đại.", priority: "low" }
        ]
      }
    ]
  }
];

export function getDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = { boards: DEFAULT_BOARDS, posts: DEFAULT_POSTS, users: [] };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const content = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(content);
    if (!parsed.boards) parsed.boards = DEFAULT_BOARDS;
    if (!parsed.posts) {
      parsed.posts = DEFAULT_POSTS;
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), "utf-8");
      } catch (e) {
        console.error("Failed to update database:", e);
      }
    }
    if (!parsed.users) parsed.users = [];
    return parsed;
  } catch (error) {
    console.error("Database reading error:", error);
    return { boards: DEFAULT_BOARDS, posts: DEFAULT_POSTS, users: [] };
  }
}

export function saveDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Database saving error:", error);
  }
}

export const SESSIONS = new Map<string, User>();
