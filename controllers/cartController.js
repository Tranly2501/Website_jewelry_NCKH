const db = require('../models');
const Cart = db.carts;
const CartDetail = db.cartdetails;
const Product = db.products;


// 1. THÊM SẢN PHẨM VÀO GIỎ HÀNG
const addToCart = async (req, res) => {
    try {
        const { user_id, product_id, quantity, size, price } = req.body;

        // Kiểm tra đầu vào cơ bản để tránh crash
        if (!user_id || !product_id || !quantity) {
            return res.status(400).json({ error: "Thiếu thông tin user_id, product_id hoặc quantity" });
        }

        // 1. Tìm hoặc tạo giỏ hàng chính của người dùng
        let [cart, created] = await Cart.findOrCreate({
            where: { user_id: user_id }, 
            defaults: { product_quantity: 1 }
        });

        // 2. Kiểm tra xem sản phẩm (+ size) đã tồn tại trong bảng chi tiết chưa 
        let cartItem = await CartDetail.findOne({
            where: { 
                cart_id: cart.id,
                product_id: product_id,

                size: size || null // Tránh lỗi nếu không có size
            }
        });

        if (cartItem) {
            // Nếu đã tồn tại: Cập nhật số lượng (Cộng dồn)
            cartItem.quantity = parseInt(cartItem.quantity) + parseInt(quantity);
            await cartItem.save();
        } else {
            // Nếu chưa tồn tại: Tạo mới dòng chi tiết
            await CartDetail.create({
                cart_id: cart.id,
                product_id: product_id,
                quantity: quantity,
                size: size,
                price: price
            });
            console.log("Đã thêm sản phẩm vào giỏ hàng");
        }

        // 3. Cập nhật tổng số lượng sản phẩm trong bảng carts (Master)
        cart.product_quantity = parseInt(cart.product_quantity) + parseInt(quantity);
        await cart.save();

        return res.status(200).json({ 
            errCode: 0,
            message: "Thêm vào giỏ hàng thành công!", 
            cartId: cart.id 
        });

    } catch (error) {
        console.error("Lỗi addToCart:", error);
        return res.status(500).json({ error: "Lỗi server khi thêm vào giỏ hàng" });
    }
};
// 2. LẤY THÔNG TIN GIỎ HÀNG (Kèm thông tin sản phẩm)
const getCartByUserId = async (req, res) => {
  try {
        console.log("Danh sách model hiện có:", Object.keys(db))
        const userId = req.params.userId;
        
        if (!userId) {
            return res.status(400).json({ errCode: 1, errMessage: "Thiếu tham số userId" });
        }

        const cartData = await Cart.findOne({
            where: { user_id: userId },
            include: [{
                model: CartDetail, 
                as: 'cartItemData',
                attributes:['id','quantity','size','price'],
                include:[{
                    model: Product, 
                    as: 'product',
                    attributes: [ 'name', 'image_url']
                }]
            }],
            raw: false,
            nest: true
        });

        if (!cartData) {
            return res.status(200).json({ errCode: 0, message: "Giỏ hàng trống", data: [] });
        }

        return res.status(200).json({
            errCode: 0,
            message: "Lấy giỏ hàng thành công!",
            data: cartData
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ errCode: -1, message: "Lỗi Server!" });
    }
};

// 3. CẬP NHẬT SỐ LƯỢNG (Dùng cho nút + / -)
const updateCartQuantity = async (req, res) => {
    
    try {
        const { cart_item_id, product_quantity } = req.body;

        const item = await db.cartdetails.findByPk(cart_item_id);
        if (item) {
            // Đảm bảo tên cột trong Database của bạn là 'quantity'
            item.quantity = product_quantity; 
            await item.save();
            return res.status(200).json({ errCode: 0, message: "Cập nhật thành công!" });
        }
        return res.status(404).json({ errCode: 2, message: "Không tìm thấy sản phẩm!" });
    } catch (error) {
        return res.status(500).json({ errCode: -1, message: "Lỗi Server!" });
    }
};

// 4. XÓA MỘT SẢN PHẨM KHỎI GIỎ

const deleteCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        await Cart.destroy({ where: { id } });
        return res.status(200).json({ errCode: 0, message: "Đã xóa khỏi giỏ hàng!" });
    } catch (error) {
        return res.status(500).json({ errCode: -1, message: "Lỗi Server!" });
    }
};

//lây sô luong sp trong giỏ hàng 
const getCartSummary = async (req, res) => {
    try {
        const userId = req.params.userId;

        // 1. Tìm giỏ hàng của user trước
        const cart = await Cart.findOne({
            where: { user_id: userId }
        });

        if (!cart) {
            return res.status(200).json({
                errCode: 0,
                totalUniqueItems: 0, // Số loại sản phẩm (COUNT)
                totalQuantity: 0      // Tổng số lượng món hàng (SUM)
            });
        }

        // 2. Thực hiện COUNT số dòng trong cartdetails (Có bao nhiêu loại sp)
        const totalUniqueItems = await CartDetail.count({
            where: { cart_id: cart.id }
        });

        // 3. Thực hiện SUM cột quantity (Tổng tất cả số lượng)
        const totalQuantity = await CartDetail.sum('quantity', {
            where: { cart_id: cart.id }
        }) || 0; 

        return res.status(200).json({
            errCode: 0,
            message: "Lấy tổng kết giỏ hàng thành công",
            data: {
                cartId: cart.id,
                totalUniqueItems, 
                totalQuantity
            }
        });

    } catch (error) {
        console.error("Lỗi getCartSummary:", error);
        return res.status(500).json({ errCode: -1, message: "Lỗi server!" });
    }
};
module.exports = {
    addToCart,
    getCartByUserId,
    updateCartQuantity,
    deleteCartItem,
    getCartSummary
};