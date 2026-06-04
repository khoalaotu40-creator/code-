import express from "express";
import { getDb } from "../config/db";
import { GoogleGenAI } from "@google/genai";
import { requireAuth } from "./auth";

const router = express.Router();

let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
} catch (e) {
  console.error("Gemini API key not found or invalid initialize");
}

router.post("/", requireAuth, async (req, res) => {
  try {
    const { message } = req.body;
    const user = (req as any).user;

    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    if (!ai) {
        return res.status(503).json({ error: "Chưa cấu hình API Key cho Chatbot. Hãy thêm GEMINI_API_KEY vào biến môi trường." });
    }

    // Prepare context by filtering DB
    const db = getDb();
    const boards = db.boards || [];
    
    // Filter boards user has access to
    const myBoards = boards.filter((b: any) => 
        b.type === "personal" || 
        (b.type === "team" && b.members && b.members.some((m: any) => m.email === user.email))
    );

    // Extract today's tasks and urgent tasks
    const todayStr = new Date();
    const tzOffset = todayStr.getTimezoneOffset() * 60000;
    const localToday = (new Date(todayStr.getTime() - tzOffset)).toISOString().slice(0, 10);
    
    let todayTasks = [];
    let overdueTasks = [];
    let highPriorityTasks = [];
    let allMyTasks = [];

    myBoards.forEach((board: any) => {
        if (!board.lists) return;
        board.lists.forEach((list: any) => {
            if (!list.tasks) return;
            const isDoneList = list.title.toLowerCase().includes("done") || list.title.toLowerCase().includes("hoàn thành");
            
            list.tasks.forEach((task: any) => {
                const taskData = {
                    id: task.id,
                    title: task.title,
                    boardName: board.name || board.title,
                    listName: list.title,
                    dueDate: task.dueDate,
                    priority: task.priority || 'normal',
                    isDone: isDoneList
                };
                
                allMyTasks.push(taskData);
                
                if (task.dueDate === localToday && !isDoneList) {
                    todayTasks.push(taskData);
                }
                
                if (task.dueDate && task.dueDate < localToday && !isDoneList) {
                    overdueTasks.push(taskData);
                }
                
                if (task.priority === "high" && !isDoneList) {
                    highPriorityTasks.push(taskData);
                }
            });
        });
    });
    
    const posts = db.posts || [];
    const recentPosts = posts.slice(0, 5).map((p: any) => ({
      title: p.title,
      content: p.content,
      tags: p.tags,
      author: p.authorName
    }));

    const pendingTasks = allMyTasks.filter(t => !t.isDone);

    // System instruction
    const systemInstruction = `Bạn là Trợ lý AI (Quản gia dự án) của hệ thống quản lý công việc.
Bạn đang trò chuyện với người dùng tên là: ${user.fullName} (Email: ${user.email}).
Ngày hôm nay là: ${localToday}.

Dưới đây là một số thông tin thu thập được từ dữ liệu của ${user.fullName}:
- Danh sách TẤT CẢ các công việc đang chờ xử lý ở các dự án: ${JSON.stringify(pendingTasks.map((t: any) => ({
    title: t.title,
    boardName: t.boardName,
    dueDate: t.dueDate || "Không có hạn",
    priority: t.priority
})))}
- Số công việc đến hạn hôm nay: ${todayTasks.length}. Chi tiết: ${JSON.stringify(todayTasks.map((t: any) => t.title))}
- Số công việc ĐÃ TRỄ HẠN: ${overdueTasks.length}. Chi tiết: ${JSON.stringify(overdueTasks.map((t: any) => t.title + " (Hạn: " + t.dueDate + ")"))}
- Số công việc ưu tiên CAO (Khẩn cấp): ${highPriorityTasks.length}. Chi tiết: ${JSON.stringify(highPriorityTasks.map((t: any) => t.title))}
- Các bài viết mới nhất trên News Feed: ${JSON.stringify(recentPosts.map((p: any) => p.title + (p.tags ? " - " + p.tags.join(",") : "")))}

# QUY TẮC TRẢ LỜI
1. Giao tiếp vui vẻ, tự nhiên, luôn chào hỏi và xưng hô bằng tên người dùng.
2. Giới hạn: CHỈ dùng dữ liệu được cung cấp. Tuyệt đối không bịa thông tin.
3. Kịch bản phản hồi:
   - Tổng quan công việc: Báo cáo số lượng việc trễ hạn, liên quan đến hôm nay và ưu tiên cao. Nếu hỏi về toàn bộ dự án, thống kê số lượng công việc theo từng dự án hoặc mốc thời gian khách yêu cầu.
   - Hỏi về tiến độ / thời gian cụ thể (như tuần này, tháng này, của dự án X): Dùng "Danh sách TẤT CẢ công việc" để tra cứu và trả lời.
   - Hỏi việc hôm nay: Liệt kê công việc trong ngày. Nhắc nhở thêm nếu có việc trễ hạn. (Trễ hạn khi quá hạn deadline mà chưa ở trạng thái hoàn thành)
   - Hỏi tin tức/Thông báo: Tóm tắt danh sách tin tức mới nhất dạng gạch đầu dòng.
   - Hỏi cách sử dụng: Đưa ra hành động trực tiếp (VD: "Để tạo mới, hãy nhấn nút [Tạo công việc]").
   - Ngoài phạm vi quản lý: Lịch sự từ chối và hướng người dùng quay lại chủ đề công việc.
4. Hãy trả lời bằng tiếng Việt, ngắn gọn, lịch sự, sử dụng markdown để định dạng (in đậm, danh sách).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return res.status(500).json({ error: error.message || "Lỗi khi xử lý chatbot." });
  }
});

export default router;
