/**
npx sequelize-cli init

npx sequelize-cli model:generate --name users --attributes username:string,email:string,password:string,avatar:string,phone:integer,create_at:date,update_at:date 
npx sequelize-cli db:migrate

npx sequelize-cli model:generate --name order --attributes user_id:integer,status:string,note:text,totalPrice:int,create_at:date,update_at:date
lệnh kiểm tra khóa ngoại và ràng buộc: 
SELECT * FROM information_scheme.table_constrains
WHERE table_scheme = "database_name" AND table_name='';
rollback trở lại có thể dùng nppx sequelize-cli db:migrate:undo; và trở về ban đầu dùng npx sequelize-cli db:migrate:undo:all
*/
console.log('This is my shopapp');

const express = require("express");
const cors = require("cors");
const path = require('path');
// Import routes và config
const authRoutes = require('./routes/auth'); 
const webRoutes = require('./routes/web');

const app = express();

//  Mở cửa thư mục 'public/models' ra Internet
app.use('/models', express.static(path.join(__dirname, 'public/models')));

app.use(cors(
    {
        origin: [
        "http://localhost:3000", // Web khách hàng
        "http://localhost:5013"  // Web Admin 
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true // Cho phép gửi cookie/token nếu cần
    }
));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. KHAI BÁO CÁC ROUTES
app.use('/api/user', authRoutes);

// --- THÊM ĐOẠN NÀY VÀO TRƯỚC DÒNG app.listen ---
console.log("Đang đăng ký route test...");
app.use('', webRoutes);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`✅ Server đang chạy tại: http://localhost:${PORT}`);
});
