const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const register = async (req, res) => {
    try {
        // 1. THÊM phone VÀO ĐÂY ĐỂ NHẬN DỮ LIỆU
        const { email, password, username, phone } = req.body;
        
        const userExists = await db.users.findOne({ where: { email } });
        if (userExists) return res.status(400).send('Email đã tồn tại');

        // Mã hóa password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo user mới
        await db.users.create({
            email,
            username,
            password: hashedPassword, 
            phone: phone, 
            role: 'user'
        });

        res.status(201).send('Đăng ký thành công');
    } catch (error) {
        console.log("LỖI CHI TIẾT:", error);
        res.status(500).send('Lỗi server');
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Tìm user
        const user = await db.users.findOne({ where: { email } });
        if (!user) return res.status(400).send('Email không tồn tại');

        // 2. Check pass
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).send('Sai mật khẩu');

        // 3. Tạo token (SỬA LỖI: Phải dùng biến 'user' - kết quả tìm được)
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            'jewelry', 
            { expiresIn: '1d' }
        );

        res.json({
            token: token,
            user: {
                id: user.id,            
                username: user.username, 
                email: user.email,       
                phone: user.phone,       
                role: user.role          
            }
        });
    } catch (error) {
        console.log(error); // Nên log lỗi ra để dễ debug
        res.status(500).send('Lỗi server');
    }
};

module.exports = { register, login };