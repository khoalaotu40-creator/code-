# Hướng dẫn chạy dự án trên máy tính cá nhân (Local)

Dự án này là một ứng dụng Full-stack sử dụng React, Vite, Tailwind CSS cho phía Client (Frontend) và Express, TypeScript cho máy chủ (Backend).

## Yêu cầu môi trường (Prerequisites)
- [Node.js](https://nodejs.org) (Khuyến nghị phiên bản v18 trở lên).
- Trình quản lý gói như npm (có sẵn khi cài Node.js).
- Đảm bảo cổng (port) `3000` của bạn đang không bị ứng dụng khác chiếm dụng (mặc định server chạy ở `:3000`).

## Các bước cài đặt và chạy trong môi trường Phát triển (Development)

1. **Chuẩn bị mã nguồn**:
   - Nếu bạn xuất (.zip) từ nền tảng, hãy giải nén ra một thư mục.
   - Mở Terminal (Command Prompt / PowerShell / iTerm) và di chuyển vào thư mục dự án đó.
   - Ví dụ: `cd path/to/project-folder`

2. **Cài đặt các thư viện phụ thuộc (Dependencies)**:
   ```bash
   npm install
   ```
   Lệnh này sẽ lấy các dependencies từ `package.json` và cài đặt chúng vào thư mục `node_modules`.

3. **Cấu hình môi trường (Biến môi trường - Env variables)**:
   - Nếu dự án có yêu cầu biến môi trường như API Key, hãy sao chép tệp `.env.example` (nếu có) thành tệp tên là `.env`.
   - Điền các giá trị (chẳng hạn như token, API key) vào file `.env`. Nếu dự án không dùng biến môi trường, bỏ qua bước này.

4. **Khởi chạy ứng dụng**:
   ```bash
   npm run dev
   ```
   - Server backend (Express) sẽ được khởi động với `tsx` và hỗ trợ cả Vite Web server để phục vụ frontend nhanh chóng.
   - Khi hoàn tất, truy cập vào trình duyệt theo địa chỉ: **[http://localhost:3000](http://localhost:3000)**

## Cách Build và chạy cho môi trường Sản xuất (Production)

Trong môi trường thực tế, ứng dụng cần được build thành mã tĩnh (cho Front-end) và bundle hoàn chỉnh (cho Back-end) nhằm đảm bảo tối ưu tốc độ.

1. **Build dự án**:
   ```bash
   npm run build
   ```
   - Lệnh này đóng gói Frontend tạo ra các file ở thư mục `dist/`.
   - Lệnh này dùng `esbuild` để biên dịch backend API (`server.ts` -> `dist/server.cjs`).

2. **Khởi chạy phiên bản Production**:
   ```bash
   npm run start
   ```
   - Server Node.js sẽ chạy độc lập với file đã biên dịch (`dist/server.cjs`) và tự động phục vụ file tĩnh của Frontend tại cổng 3000.
   - Mở trình duyệt web của bạn và vào cổng tương tự: **[http://localhost:3000](http://localhost:3000)**.
