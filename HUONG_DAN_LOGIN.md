# HƯỚNG DẪN ĐĂNG NHẬP CHI TIẾT

## ✅ Đã fix xong tất cả lỗi!

### Lỗi đã fix:
1. ✅ Admin password đã được reset đúng
2. ✅ Quick Admin Login đã dùng đúng credentials
3. ✅ Register API đã gửi đúng firstName/lastName

---

## 🔑 TÀI KHOẢN ĐỂ ĐĂNG NHẬP:

### ADMIN (Quản lý):
```
Email: admin@watchshop.com
Password: Admin123!@#
```

### CUSTOMER (Khách hàng):
```
Email: customer@watchshop.com  
Password: Customer123!@#
```

---

## 📱 CÁCH ĐĂNG NHẬP:

### CÁCH 1: Quick Admin Login (NHANH NHẤT - CHỈ DÀNH CHO ADMIN)

1. Mở app: https://3c31e6bb-3964-40ed-94b2-70049adb2578-00-3ezpzobqaul0l.spock.replit.dev

2. Click vào tab **"Login"** (icon 👤 góc PHẢI DƯỚI cùng)

3. Bạn sẽ thấy màn hình login có:
   - Ô nhập Email
   - Ô nhập Password  
   - Nút **"Login"** (màu vàng)
   - Nút **"🔑 Quick Admin Login"** (màu XANH BLUE) ← CLICK NÚT NÀY!

4. Click nút **"🔑 Quick Admin Login"** màu xanh
   
5. ✅ Tự động đăng nhập admin!

---

### CÁCH 2: Nhập thủ công

1. Mở app và click tab **"Login"** (góc phải dưới)

2. Nhập thông tin:
   - Email: `admin@watchshop.com` hoặc `customer@watchshop.com`
   - Password: `Admin123!@#` hoặc `Customer123!@#`

3. Click nút **"Login"** màu vàng

4. ✅ Đăng nhập thành công!

---

### CÁCH 3: Đăng ký tài khoản mới

1. Click tab **"Login"** (góc phải dưới)

2. Click text **"Don't have an account? Sign Up"** ở dưới cùng

3. Nhập:
   - Full name: Tên của bạn (VD: Nguyen Van A)
   - Email: email mới (VD: test@gmail.com)
   - Password: mật khẩu mạnh (VD: Test123!@#)

4. Click nút **"Sign Up"**

5. ✅ Tạo tài khoản và đăng nhập thành công!

---

## 🎯 SAU KHI ĐĂNG NHẬP:

### ADMIN sẽ thấy:
- Tab **Dashboard** (Tổng quan)
- Tab **Orders** (Đơn hàng)
- Tab **Users** (Người dùng)
- Tab **Settings** (Cài đặt)

### CUSTOMER sẽ thấy:
- Tab **Home** (Trang chủ)
- Tab **Shop** (Cửa hàng)
- Tab **Cart** (Giỏ hàng)  
- Tab **Profile** (Hồ sơ)

---

## ⚠️ NẾU VẪN KHÔNG ĐĂNG NHẬP ĐƯỢC:

1. **Kiểm tra internet** - Đảm bảo có kết nối

2. **Reload trang** - Nhấn F5 hoặc Ctrl+R

3. **Xóa cache**:
   - Nhấn Ctrl+Shift+Delete
   - Chọn "Cookies and other site data"
   - Click "Clear data"
   - Reload lại trang

4. **Thử trình duyệt khác** - Chrome, Firefox, Safari

5. **Kiểm tra console lỗi**:
   - Nhấn F12
   - Tab "Console"
   - Chụp màn hình lỗi gửi cho tôi

---

## 🔗 LINK APP:
https://3c31e6bb-3964-40ed-94b2-70049adb2578-00-3ezpzobqaul0l.spock.replit.dev

---

## 🧪 TEST BACKEND TRỰC TIẾP:

Nếu vẫn có vấn đề, test backend bằng curl:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@watchshop.com","password":"Admin123!@#"}'
```

Response thành công:
```json
{
  "success": true,
  "data": {
    "token": "...",
    "user": {...}
  }
}
```
