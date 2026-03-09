/**
npx sequelize-cli init

npx sequelize-cli model:generate --name users --attributes username:string,email:string,password:string,avatar:string,phone:integer,create_at:date,update_at:date 
npx sequelize-cli db:migrate

npx sequelize-cli model:generate --name order --attributes user_id:integer,status:string,note:text,totalPrice:int,create_at:date,update_at:date
lệnh kiểm tra khóa ngoại và ràng buộc: 
SELECT * FROM information_scheme.table_constrains
WHERE table_scheme = "database_name" AND table_name='';
rollback trở lại có thể dùng npx sequelize-cli db:migrate:undo; và trở về ban đầu dùng npx sequelize-cli db:migrate:undo:all
*/
// ... (các comment CLI của bạn giữ nguyên)
require('dotenv').config(); 

const express = require("express");
const cors = require("cors");
const path = require('path');

// Import routes và config
const authRoutes = require('./routes/auth'); 
const webRoutes = require('./routes/web');

console.log("👉 ĐỊA CHỈ DATABASE ĐANG DÙNG LÀ:", process.env.DB_HOST);
console.log("👉 PASSWORD ĐANG ĐỌC ĐƯỢC LÀ:", process.env.DB_PASSWORD ? "Đã thấy mật khẩu" : "Vẫn đang trống (undefined)");
console.log('This is my shopapp');




const app = express();

// ==========================================
// 1. GỌI CORS LÊN TRƯỚC TIÊN 
// ==========================================
app.use(cors({
    origin: [
        "http://localhost:3000", // Web khách hàng
        "http://localhost:5013"  // Web Admin 
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// ==========================================
// 2. MỞ CỬA THƯ MỤC PUBLIC
// ==========================================
app.use('/models', express.static(path.join(__dirname, 'public/models'), {
    setHeaders: function (res, path, stat) {
        res.set('Access-Control-Allow-Origin', '*'); 
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
    }
}));

// ==========================================
// 3. CÁC CẤU HÌNH KHÁC VÀ ROUTES
// ==========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', authRoutes);

console.log("Đang đăng ký route test...");
app.use('', webRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`✅ Server đang chạy tại: http://localhost:${PORT}`);
});