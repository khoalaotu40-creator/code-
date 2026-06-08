# SE104.Q28 Quản Lý Dự Án & Công Việc (Project Management System)

Đây là hệ thống quản lý công việc và bảng tin dành cho sinh viên SE104.Q28, nổi bật với chức năng quản lý bảng Kanban (Cá nhân/Nhóm) trực quan và tính năng theo dõi giao tiếp nội bộ qua Bảng tin (News Feed) chuyên nghiệp.

## 👥 Nhóm Thực Hiện & Giảng Viên Hướng Dẫn
- **Tác giả:**
  - Trương Phạm Đăng Khoa - 24520846
  - Lâm Ngọc Thiên Phúc - 24521378
  - Nguyễn Trần Đăng Khoa - 24520834
- **Giáo viên hướng dẫn:** TS. Đỗ Văn Tiến

## ✨ Chức năng nổi bật
- **Quản lý công việc tiện lợi:** Tổ chức bảng Kanban khoa học, giao diện kéo/thả mượt mà.
- **Trợ lý dự án AI (Quản gia dự án):** Tích hợp Gemini AI dưới dạng chatbot, phân tích thông minh các công việc đến hạn, trễ hạn, ưu tiên cao và tin tức trong hệ thống để tự động báo cáo cho người dùng theo ngữ cảnh cá nhân.
- **Trung tâm điều phối linh hoạt:** Hệ thống Bảng tin giúp theo dõi công việc quá hạn, công việc cá nhân và cập nhật thông báo chung qua các thẻ (Widget) nhanh chóng, kèm lịch (Calendar) trực quan.
- **Lịch sử hoạt động chi tiết:** Lưu trữ thao tác và thảo luận (Audit log) trực tiếp trên từng thẻ Kanban, minh bạch quá trình thực hiện.
- **Phân quyền và giao việc:** Thêm thành viên, phân công công việc thông minh thông qua danh sách thành viên cụ thể.

## 🎨 Giao diện trực quan
- Hệ thống hỗ trợ thị giác người dùng bằng các cảnh báo khẩn cấp khi đến hạn chót (thay đổi trạng thái màu sắc), hiển thị hình ảnh đại diện (avatar) của thành viên trực tiếp trên thẻ công việc. Layout tổng quan dạng bảng và danh sách tinh gọn, đảm bảo không gian rộng rãi, dễ dàng trong việc thao tác và quản lý.

## 🚀 Công nghệ sử dụng
- **Frontend:** React, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend:** Node.js, Express, TypeScript.
- **Cơ sở dữ liệu:** File-based lưu trữ cục bộ (`db.json`) chuyên dụng cho tốc độ, gọn nhẹ và nguyên mẫu.

## 🛠 Hướng dẫn cài đặt
1. Khởi tạo dự án và Node.js.
2. **Cài đặt thư viện:** Chạy lệnh `npm install`
3. **Khởi chạy hệ thống (Dev):** Chạy lệnh `npm run dev`
4. **Build Code Sản Phẩm:** Chạy lệnh `npm run build` sau đó `npm run start`

## 🗄 Sơ đồ dữ liệu thực thể - liên kết (ER Diagram - Khóa chính & Khóa phụ)

Dưới đây là sơ đồ mô tả mối quan hệ giữa các thực thể trong hệ thống cơ sở dữ liệu nội bộ (NoSQL-like object mapping), với việc chỉ ra các khóa liên kết chính (PK) và khóa phụ (FK) chiếu đến nhau.

```text
+-------------------+       +---------------------+
|      USER         |       |        POST         |
+-------------------+       +---------------------+
| PK: email (UID)   | <---- | PK: id              |
|   username        |       | FK: author.email    |
|   fullName        |       |   content           |
|   avatar          |       |   createdAt         |
|   role            |       |   likes[] (FK)      |
+---------^---------+       +----------+----------+
          |                            | (1 - N)
          |                            v
          |                 +---------------------+
          |                 |     POST_COMMENT    |
          |                 +---------------------+
          |                 | PK: id              |
          +-----------------| FK: author.email    |
          |                 |   content           |
          |                 +---------------------+
          |
          |                 +---------------------+       +---------------------+
          |-------------->  |        BOARD        | ----> |     CHAT_MESSAGE    |
          |                 +---------------------+       +---------------------+
          |                 | PK: id              |       | PK: id              |
          |                 | FK: owner (email)   |       | FK: sender.email    |
          |                 | FK: members[email]  |       |   content           |
          |                 |   title             |       +---------------------+
          |                 |   bgGradient        |
          |                 |   type              |       +---------------------+
          |                 +----------+----------+ ----> |         LIST        |
          |                            | (1 - N)          +---------------------+
          |                            v                  | PK: id              |
          |                 +---------------------+       |   title             |
          +---------------- |         TASK        | <---- |   tasks[]           |
                            +---------------------+       +---------------------+
                            | PK: id              |
                            | FK: assignee.email  |
                            |   title             |       +---------------------+
                            |   startDate         | ----> |     ACTIVITY_LOG    |
                            |   dueDate           |       +---------------------+
                            |   priority          |       | PK: id              |
                            +---------------------+       | FK: user.email      |
                                                          |   action            |
                                                          +---------------------+
```

## 👤 Sơ đồ Usecase (Usecase Diagram)

Sơ đồ mô tả các nhóm tác vụ và tiện ích chức năng mà Người Dùng (Actor) có thể thực hiện với hệ thống.

```text
                  +-------------------------------------------------------------+
                  |  HỆ THỐNG GIÁM SÁT DỰ ÁN VÀ BẢNG TIN                        |
                  |                                                             |
                  |  [Quản lý Tài Khoản]                                        |
                  |    - Đăng nhập / Đăng ký                                    |
                  |    - Cập nhật thông tin & Thay đổi Avatar                   |
                  |                                                             |
                  |  [Quản lý Dự Án (Boards)]                                   |
                  |    - Tạo mới Bảng (Cá nhân hoặc Đội nhóm)                   |
  +-------+       |    - Tìm kiếm bảng & Đánh dấu Yêu thích (Favorite)          |
  |       | ----> |    - Cài đặt chung & Xóa dự án                              |
  | Actor |       |                                                             |
  |       | ----> |  [Quản lý Kanban & Công Việc]                               |
  | USER  |       |    - Thêm danh sách / Cột tác vụ                            |
  +-------+       |    - Kéo & Thả công việc (Trượt Drag and Drop UI)           |
                  |    - Thiết lập chi tiết Thẻ (Tag, Due date, Giao việc)      |
                  |                                                             |
                  |  [Tương tác nội bộ]                                         |
                  |    - Chat nhóm trực tiếp theo Dự án (Team Chat)             |
                  |    - Viết lưu bút / Bình luận vào Log Thẻ (Audit Log)       |
                  |                                                             |
                  |  [Mạng nội bộ (News Feed)]                                  |
                  |    - Đăng Bài nội dung mới (kèm Cảm xúc)                    |
                  |    - Tương tác thả tim (Like) & Trả lời Bình luận           |
                  |                                                             |
                  |  [Trợ lý Ảo Dự Án (AI Bot)]                                 |
                  |    - Đặt câu hỏi tiến độ, phân tích dữ liệu qua LLM         |
                  |    - Lắng nghe báo cáo tự động từ Bot                       |
                  +-------------------------------------------------------------+
```


## 📂 Cấu trúc thư mục (File Structure)

```text
/
├── server.ts               # Backend Entry Point: Server và tích hợp các Routes
├── db.json                 # Database hệ thống (tự động tạo ra)
├── vite.config.ts          # Cấu hình Vite build
├── package.json            # Thư viện và Script (dependencies)
├── tsconfig.json           # Cấu hình TypeScript
├── index.html              # Frontend Entry Point HTML
├── .env.example            # Chứa các mẫu hằng số môi trường (nếu có)
│
├── config/                 # Các thiết lập cấu hình chung
│   └── db.ts               # Quản lý Database JSON cục bộ và dữ liệu mock
│
├── api/                    # Phân rã REST API (Backend logic)
│   ├── index.ts            # Entry router chính gom các cụm API
│   ├── auth.ts             # API cho Đăng nhập, Đăng ký, Xét thực (Auth)
│   ├── boards.ts           # API cho tác vụ xử lý Bảng việc Kanban (Boards)
│   ├── chat.ts             # API cho Chat nội bộ trong nhóm
│   └── posts.ts            # API cho thao tác Bảng tin nội bộ (News Feed)
│
└── src/                    # Frontend React src
    ├── main.tsx            # React Bootstrap Entry
    ├── App.tsx             # Component gốc, khung Layout và Routing nội bộ
    ├── index.css           # Cấu hình file CSS / Tailwind
    ├── types.ts            # Khai báo TypeScript Interface cho hệ thống
    │
    ├── components/         # Các Reusable components giao diện
    │   ├── Chatbot.tsx         # Trợ lý AI (Quản gia dự án)
    │   ├── KanbanColumn.tsx    # Khối component cột và thẻ List/Tasks cho Kanban Boards
    │   ├── LoginView.tsx       # Component Form Auth (Đăng ký, Đăng nhập)
    │   ├── MiniCalendar.tsx    # Lịch dạng nhỏ
    │   └── NewsFeedView.tsx    # Giao diện Bảng tin/Status của hệ thống
    │
    └── function/           # Các component chức năng được phân tách từ App
        ├── AddColumnForm.tsx   # Form thêm cột mới vào bảng công việc
        ├── BoardDetail.tsx     # Giao diện hiển thị chi tiết bảng Kanban
        ├── BoardsOverview.tsx  # Giao diện tổng quan danh sách các bảng
        ├── CreateBoardModal.tsx# Modal popup khởi tạo Bảng mới
        ├── ProfileView.tsx     # Giao diện thông tin tài khoản và hình đại diện
        ├── RoadmapView.tsx     # Lộ trình dự án dạng biểu đồ Gantt
        ├── SettingsView.tsx    # Giao diện Cài đặt hệ thống (Database & Storage)
        ├── SidebarNav.tsx      # Sidebar điều hướng chính (Navigation)
        ├── TeamChat.tsx        # Cửa sổ chat nhóm nội bộ
        └── TopNavBar.tsx       # Thanh Header, điều hướng và thông báo
```

## 💾 Cấu trúc dữ liệu (Data Structure)

Dựa trên định nghĩa mã nguồn (`src/types.ts`) và quy định xử lý backend tại `server.ts`, hệ thống sử dụng cấu trúc tổ chức JSON file định quy bao gồm các Model chính sau:

### 1. Users Data (Tài khoản người dùng)
Đại diện cho thông tin tài khoản người dùng đăng nhập hệ thống:

```typescript
export interface User {
  username: string;       // UID hoặc Tên đăng nhập gốc
  fullName: string;       // Tên hiển thị đầy đủ
  email: string;          // Định danh email tài khoản
  avatar: string;         // Alias avatar, hình ảnh user
  role: string;           // Vai trò phân quyền
}
```

### 2. Boards Data (Bảng công việc quản lý dự án)
Bảng công việc tổ chức dự án, có thể được cấp quyền chia sẻ (chia team) qua `members` hoặc giữ ở chế độ Personal.

```typescript
export interface Board {
  id: string;             // ID bảng định danh
  title: string;          // Tiêu đề bảng công việc
  bgGradient: string;     // Lựa chọn màu sắc theme
  isFavorite?: boolean;   // Đánh dấu Pin/Ưu tiên ghim
  type: "personal" | "team";  // Thuộc tính cá nhân / Đội nhóm
  description?: string;   // Mô tả thông tin công tác làm việc
  lastViewedAt?: string;  // Timestamps truy cập gần nhất
  lists?: List[];         // Khối danh sách các Cột công việc (Lists) của Board
  owner: string;          // Email của Chủ sở hữu
  members?: string[];     // Danh sách email thành viên tham gia
  chatMessages?: ChatMessage[]; // Các tin nhắn nhóm
}

export interface List {
  id: string;             // ID của cột
  title: string;          // Trạng thái cột (Cần làm, Đang làm, Hoàn thành..)
  tasks: Task[];          // Array chứa Thẻ các tác vụ cụ thể
}

export interface Task {
  id: string;
  title: string;          // Tiêu đề ngắn gọn của Task
  description: string;    // Yêu cầu chi tiết Task
  startDate?: string;     // Ngày bắt đầu (YYYY-MM-DD)
  dueDate?: string;       // Hạn cuối (YYYY-MM-DD)
  priority?: "low" | "medium" | "high"; // Độ khẩn cấp / Ưu tiên
  label?: string;         // Đánh dấu hashtag phân hóa
  assignee?: {            // Người được phân công việc
    fullName: string;
    avatar?: string;
    email: string;
  };
  activities?: ActivityLog[]; // Lịch sử hoạt động / bình luận
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

export interface ChatMessage {
  id: string;
  sender: {
    fullName: string;
    email: string;
  };
  content: string;
  createdAt: string;
}
```

### 3. News Feed Data (Dữ liệu bài đăng)
Cấu trúc data Bảng tin hỗ trợ tính năng comment linh hoạt và reaction mảng đơn giản:

```typescript
export interface Post {
  id: string;             // UID Sinh bài tự động
  author: {               // Cấu trúc Data Rút gọn của Người đăng post
    fullName: string;
    avatar: string;
    email: string;
  };
  content: string;        // Nội dung hiển thị Text chi tiết
  createdAt: string;      // Timestamps khởi tạo bài Post
  likes: string[];        // Danh sách mảng User(email) đã thao tác Like/Tim
  comments: PostComment[];// Array bình luận lồng (1 tầng)
  image?: string;         // Hình ảnh đính kèm bổ sung
  tag?: string;           // Phân nhóm hiển thị (Filter by Tags)
}

export interface PostComment {
  id: string;             
  author: {               
    fullName: string;
    avatar: string;
    email: string;
  };
  content: string;        // Text content comment
  createdAt: string;      
}
```

## 🔄 Luồng dữ liệu hệ thống (Data Flow)

Dưới đây là sơ đồ luồng dữ liệu kiến trúc tương tác giữa giao diện người dùng (Client), máy chủ (Express API) và cơ sở dữ liệu nội bộ (JSON). Sơ đồ đã được bổ sung thêm luồng tương tác với các ứng dụng bên thứ 3 và chatbot AI.

```text
  +-----------------------+              +-----------------------+              +-----------------------+
  |                       |  (1. Req)    |                       |  (2. I/O)    |                       |
  |  💻 Người Dùng        | ===========> |  ⚙️  Express API       | ===========> |  📄 db.json           |
  |  (React Client App)   | <=========== |  (Máy chủ Node.js)    | <=========== |  (Cơ sở dữ liệu)      |
  |                       |  (8. Res)    |                       |  (3. Data)   |                       |
  +-----------+-----------+              +-----------+-----------+              +-----------+-----------+
              |                                      |                                      |
              |                                      | (4. DB Sync)                         |
              | (9. Chatbot UI)                      | Lưu trữ và cập nhật trạng thái       |
              |                                      V                                      |
  +-----------v-----------+              +-----------------------+                      +---v-------------------+
  |                       |  (7. API)    |                       |  (5. Prompt)         |                       |
  |  🤖 Trợ lý dự án AI   | <=========== |  🧠 Gemini AI API     | <=================== | (Local Backup / State)|
  |  (UI Chatbot)         | ===========> |  (Google Generative)  |                      |                       |
  |                       |  (6. Query)  |                       |                      |                       |
  +-----------------------+              +-----------------------+                      +-----------------------+

Luồng xử lý chi tiết:
  (1) HTTP Requests: App từ phía người dùng truy vấn (GET, POST, PUT, DELETE) lên các router API (/api/boards, /api/posts...).
  (2) Xử lý logic & File System: Backend nhận JWT Token từ Request, đối chiếu. Tiếp đến đọc và phân tích cấu trúc db.json qua hàm khởi tạo trung gian, xử lý các nghiệp vụ (vd: Xoá, thêm cột).
  (3) Trả dữ liệu thực thể: Sau bước ghi thành công, Server lưu lại trạng thái, trả object data về cho luồng Request.
  (4) Lưu trữ: Ghi đè file db.json (Tương tự SQL lưu trữ).
  (5 - 7) AI Flow: Dữ liệu (Boards, tasks, news) được context hoá đem vào System Prompt đẩy sang xử lý tại Google GenAI. Trả về kết quả phân tích dưới dạng tin nhắn, update lên giao diện.
  (8) Client Render: Component React nhận trạng thái Data (State), thay đổi layout tự động.
```
